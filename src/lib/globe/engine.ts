import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLOBE_COUNTRY_LABELS } from "@/data/globe-places";
import type { City, Country } from "@/types/catalog";
import { latLngToVector3 } from "./latlng";

/** Bump this when the engine visual contract changes so <Globe> remounts on HMR. */
export const GLOBE_ENGINE_REV = 11;

export type GlobeLabel = {
  id: string;
  kind: "city" | "country";
  name: string;
  subtitle?: string;
  x: number;
  y: number;
  visible: boolean;
  priority: number;
  city?: City;
};

export type GlobeEngineOptions = {
  canvas: HTMLCanvasElement;
  reducedMotion: boolean;
  cities: City[];
  countries: Country[];
  onLabels: (labels: GlobeLabel[]) => void;
  onCityClick: (city: City) => void;
  onReady?: () => void;
};

type FlyState = {
  from: THREE.Spherical;
  to: THREE.Spherical;
  t: number;
  duration: number;
  highlight?: string;
  onDone?: () => void;
};

const EARTH_RADIUS = 1;
const NIGHT_URL = "/globe/earth-night.jpg";
const LAND_MASK_URL = "/globe/land-mask.png";
const BORDERS_URL = "/globe/borders.json";
const CITY_COLOR = 0xe8f4ff;
const CITY_DIM = 0x6a7a88;
const CITY_ACTIVE = 0xd4f03c;

function isMobile() {
  return window.innerWidth < 768 || window.matchMedia("(pointer: coarse)").matches;
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function makeNightMaterial(night: THREE.Texture, land: THREE.Texture) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uNight: { value: night },
      uLand: { value: land },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      varying vec3 vWorldNormal;
      varying vec3 vWorldPos;
      void main() {
        vUv = uv;
        vec4 world = modelMatrix * vec4(position, 1.0);
        vWorldPos = world.xyz;
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D uNight;
      uniform sampler2D uLand;
      varying vec2 vUv;
      varying vec3 vWorldNormal;
      varying vec3 vWorldPos;

      void main() {
        vec3 night = texture2D(uNight, vUv).rgb * 3.4;
        float land = texture2D(uLand, vUv).r;
        float lum = max(max(night.r, night.g), night.b);

        vec3 ocean = vec3(0.0, 0.0, 0.0);
        vec3 landCol = vec3(0.028, 0.034, 0.045);
        vec3 base = mix(ocean, landCol, smoothstep(0.22, 0.62, land));

        vec3 lights = night * smoothstep(0.02, 0.08, lum);

        vec3 viewDir = normalize(cameraPosition - vWorldPos);
        float fresnel = pow(1.0 - max(dot(normalize(vWorldNormal), viewDir), 0.0), 3.2);
        vec3 limb = vec3(0.10, 0.16, 0.22) * fresnel * 0.45;

        gl_FragColor = vec4(base + lights + limb, 1.0);
      }
    `,
    toneMapped: false,
  });
}

function makeAtmosphereMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(0x7a9bb8) },
    },
    vertexShader: /* glsl */ `
      varying vec3 vNormal;
      varying vec3 vWorldPos;
      void main() {
        vNormal = normalize(mat3(modelMatrix) * normal);
        vec4 world = modelMatrix * vec4(position, 1.0);
        vWorldPos = world.xyz;
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      varying vec3 vNormal;
      varying vec3 vWorldPos;
      void main() {
        vec3 viewDir = normalize(cameraPosition - vWorldPos);
        float f = pow(0.62 - dot(normalize(vNormal), viewDir), 2.4);
        gl_FragColor = vec4(uColor, clamp(f, 0.0, 0.55) * 0.55);
      }
    `,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
  });
}

export class GlobeEngine {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private globe = new THREE.Group();
  private raf = 0;
  private disposed = false;
  private reducedMotion: boolean;
  private cities: City[];
  private countries: Country[];
  private onLabels: GlobeEngineOptions["onLabels"];
  private onCityClick: GlobeEngineOptions["onCityClick"];
  private onReady?: () => void;
  private cityPositions = new Map<string, THREE.Vector3>();
  private cityMeshes = new Map<string, THREE.Mesh>();
  private highlightId: string | null = null;
  private fly: FlyState | null = null;
  private idleTimer = 0;
  private autoRotate = true;
  private lastTs = 0;
  private tmp = new THREE.Vector3();
  private spherical = new THREE.Spherical();
  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2();
  private canvas: HTMLCanvasElement;
  private resizeObs: ResizeObserver;
  private cityGroup = new THREE.Group();
  private rim: THREE.LineLoop;
  private materials: THREE.Material[] = [];
  private geometries: THREE.BufferGeometry[] = [];
  private textures: THREE.Texture[] = [];

  constructor(options: GlobeEngineOptions) {
    this.canvas = options.canvas;
    this.reducedMotion = options.reducedMotion;
    this.cities = options.cities;
    this.countries = options.countries;
    this.onLabels = options.onLabels;
    this.onCityClick = options.onCityClick;
    this.onReady = options.onReady;
    this.autoRotate = !options.reducedMotion;

    this.renderer = new THREE.WebGLRenderer({
      canvas: options.canvas,
      antialias: !isMobile(),
      alpha: true,
      powerPreference: "high-performance",
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.NoToneMapping;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile() ? 1.4 : 2));

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(40, 1, 0.1, 60);
    const start = latLngToVector3(12, -45, 2.28);
    this.camera.position.set(start.x, start.y, start.z);

    this.controls = new OrbitControls(this.camera, options.canvas);
    this.controls.enablePan = false;
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.075;
    this.controls.minDistance = 1.52;
    this.controls.maxDistance = 4.2;
    this.controls.rotateSpeed = 0.38;
    this.controls.zoomSpeed = 0.7;
    this.controls.autoRotate = this.autoRotate;
    this.controls.autoRotateSpeed = 0.22;
    this.controls.minPolarAngle = 0.18;
    this.controls.maxPolarAngle = Math.PI - 0.18;
    this.controls.target.set(0, 0, 0);
    this.controls.update();

    this.scene.add(this.globe);
    this.globe.add(this.cityGroup);

    this.rim = this.makeRim();
    this.scene.add(this.rim);
    this.addStars();
    this.addCities();
    this.bindInput();
    this.resize();

    this.resizeObs = new ResizeObserver(() => this.resize());
    this.resizeObs.observe(options.canvas.parentElement ?? options.canvas);

    this.controls.addEventListener("start", this.handleUserStart);
    this.controls.addEventListener("end", this.handleUserEnd);

    void this.loadEarth().catch((err) => {
      console.error("Globe earth failed", err);
    });
    this.loop(0);
  }

  setReducedMotion(value: boolean) {
    this.reducedMotion = value;
    if (value) {
      this.autoRotate = false;
      this.controls.autoRotate = false;
    }
  }

  async flyToCity(city: City, duration = 1100) {
    const dest = latLngToVector3(city.latitude, city.longitude, 1);
    const from = new THREE.Spherical().setFromVector3(this.camera.position);
    const toVec = new THREE.Vector3(dest.x, dest.y, dest.z).normalize().multiplyScalar(1.68);
    const to = new THREE.Spherical().setFromVector3(toVec);
    this.autoRotate = false;
    this.controls.autoRotate = false;
    this.highlightId = city.id;
    this.updateHighlight();
    const wait = this.reducedMotion ? 40 : duration;
    await new Promise<void>((resolve) => {
      let settled = false;
      const done = () => {
        if (settled) return;
        settled = true;
        resolve();
      };
      this.fly = { from, to, t: 0, duration: wait, highlight: city.id, onDone: done };
      window.setTimeout(done, wait + 200);
    });
  }

  dispose() {
    this.disposed = true;
    const onDone = this.fly?.onDone;
    this.fly = null;
    onDone?.();
    cancelAnimationFrame(this.raf);
    this.resizeObs.disconnect();
    this.controls.removeEventListener("start", this.handleUserStart);
    this.controls.removeEventListener("end", this.handleUserEnd);
    this.canvas.removeEventListener("pointerup", this.handlePointerUp);
    this.controls.dispose();
    this.geometries.forEach((g) => g.dispose());
    this.materials.forEach((m) => m.dispose());
    this.textures.forEach((t) => t.dispose());
    this.renderer.dispose();
  }

  private handleUserStart = () => {
    this.autoRotate = false;
    this.controls.autoRotate = false;
    this.idleTimer = 0;
    const onDone = this.fly?.onDone;
    this.fly = null;
    onDone?.();
  };

  private handleUserEnd = () => {
    this.idleTimer = 0;
  };

  private bindInput() {
    this.canvas.addEventListener("pointerup", this.handlePointerUp);
  }

  private handlePointerUp = (event: PointerEvent) => {
    if (event.button !== 0) return;
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hits = this.raycaster.intersectObjects(this.cityGroup.children, true);
    const obj = hits[0]?.object;
    let cityId = obj?.userData.cityId as string | undefined;
    if (!cityId && obj?.parent) cityId = obj.parent.userData.cityId as string | undefined;
    if (!cityId) return;
    const city = this.cities.find((c) => c.id === cityId);
    if (city) this.onCityClick(city);
  };

  private async loadEarth() {
    const loader = new THREE.TextureLoader();
    try {
      const [night, land, borders] = await Promise.all([
        loader.loadAsync(NIGHT_URL),
        loader.loadAsync(LAND_MASK_URL),
        fetch(BORDERS_URL).then((res) => res.json()) as Promise<{ rings: number[][] }>,
      ]);
      if (this.disposed) {
        night.dispose();
        land.dispose();
        return;
      }
      night.colorSpace = THREE.SRGBColorSpace;
      night.minFilter = THREE.LinearFilter;
      night.magFilter = THREE.LinearFilter;
      night.anisotropy = Math.min(8, this.renderer.capabilities.getMaxAnisotropy());
      night.needsUpdate = true;
      land.colorSpace = THREE.NoColorSpace;
      land.minFilter = THREE.LinearFilter;
      land.magFilter = THREE.LinearFilter;
      land.generateMipmaps = false;
      this.textures.push(night, land);

      const earthMat = makeNightMaterial(night, land);
      const earthGeo = new THREE.SphereGeometry(EARTH_RADIUS, 96, 64);
      const earth = new THREE.Mesh(earthGeo, earthMat);
      this.globe.add(earth);
      this.geometries.push(earthGeo);
      this.materials.push(earthMat);

      const atmosMat = makeAtmosphereMaterial();
      const atmos = new THREE.Mesh(new THREE.SphereGeometry(EARTH_RADIUS * 1.045, 64, 48), atmosMat);
      this.globe.add(atmos);
      this.geometries.push(atmos.geometry);
      this.materials.push(atmosMat);

      this.addBorders(borders.rings);
    } finally {
      if (!this.disposed) this.onReady?.();
    }
  }

  private addBorders(rings: number[][]) {
    const positions: number[] = [];
    const r = EARTH_RADIUS * 1.003;
    for (const ring of rings) {
      if (ring.length < 6) continue;
      for (let i = 0; i < ring.length - 2; i += 2) {
        const a = latLngToVector3(ring[i + 1], ring[i], r);
        const b = latLngToVector3(ring[i + 3], ring[i + 2], r);
        positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    const mat = new THREE.LineBasicMaterial({
      color: 0xd0dce4,
      transparent: true,
      opacity: 0.58,
      depthWrite: false,
      toneMapped: false,
    });
    const lines = new THREE.LineSegments(geo, mat);
    this.globe.add(lines);
    this.geometries.push(geo);
    this.materials.push(mat);
  }

  private makeRim() {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 256; i += 1) {
      const a = (i / 256) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a), Math.sin(a), 0));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({
      color: 0x6a7a88,
      transparent: true,
      opacity: 0.28,
      depthWrite: false,
      toneMapped: false,
    });
    this.geometries.push(geo);
    this.materials.push(mat);
    const line = new THREE.LineLoop(geo, mat);
    line.scale.setScalar(EARTH_RADIUS * 1.002);
    return line;
  }

  private addStars() {
    const count = isMobile() ? 140 : 320;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const r = 10 + Math.random() * 18;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      const c = 0.45 + Math.random() * 0.4;
      colors[i * 3] = c;
      colors[i * 3 + 1] = c;
      colors[i * 3 + 2] = c * 0.95;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({
      size: 0.028,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      sizeAttenuation: true,
      toneMapped: false,
    });
    this.scene.add(new THREE.Points(geometry, material));
    this.geometries.push(geometry);
    this.materials.push(material);
  }

  private addCities() {
    const visGeo = new THREE.SphereGeometry(0.0034, 8, 8);
    const hitGeo = new THREE.SphereGeometry(0.02, 8, 8);
    const hitMat = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false,
      colorWrite: false,
      toneMapped: false,
    });
    this.geometries.push(visGeo, hitGeo);
    this.materials.push(hitMat);

    for (const city of this.cities) {
      const pos = latLngToVector3(city.latitude, city.longitude, EARTH_RADIUS + 0.005);
      const vec = new THREE.Vector3(pos.x, pos.y, pos.z);
      this.cityPositions.set(city.id, vec);

      const visMat = new THREE.MeshBasicMaterial({
        color: city.contentStatus === "published" ? CITY_COLOR : CITY_DIM,
        toneMapped: false,
      });
      this.materials.push(visMat);
      const vis = new THREE.Mesh(visGeo, visMat);
      const hit = new THREE.Mesh(hitGeo, hitMat);
      hit.position.copy(vec);
      hit.userData.cityId = city.id;
      vis.userData.cityId = city.id;
      hit.add(vis);
      this.cityGroup.add(hit);
      this.cityMeshes.set(city.id, vis);
    }
  }

  private updateHighlight() {
    for (const [id, mesh] of this.cityMeshes) {
      const material = mesh.material as THREE.MeshBasicMaterial;
      const active = id === this.highlightId;
      const city = this.cities.find((item) => item.id === id);
      mesh.scale.setScalar(active ? 2.1 : 1);
      material.color.set(
        active ? CITY_ACTIVE : city?.contentStatus === "published" ? CITY_COLOR : CITY_DIM,
      );
    }
  }

  private resize() {
    const parent = this.canvas.parentElement ?? this.canvas;
    const width = parent.clientWidth || window.innerWidth;
    const height = parent.clientHeight || window.innerHeight;
    this.camera.aspect = width / Math.max(height, 1);
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  private inHeroBand(x: number, y: number, width: number, height: number) {
    const nx = Math.abs(x / width - 0.5);
    const ny = y / height;
    if (isMobile()) {
      return nx < 0.42 && ny > 0.08 && ny < 0.5;
    }
    return nx < 0.26 && ny > 0.08 && ny < 0.55;
  }

  private cameraDistance() {
    return this.camera.position.length();
  }

  private lodThresholds() {
    const d = this.cameraDistance();
    if (d > 3.2) return { countryMin: 78, cityMin: 92 };
    if (d > 2.55) return { countryMin: 58, cityMin: 78 };
    if (d > 2.05) return { countryMin: 42, cityMin: 58 };
    return { countryMin: 0, cityMin: 36 };
  }

  private projectLabels() {
    const { countryMin, cityMin } = this.lodThresholds();
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    const cameraDir = this.tmp.copy(this.camera.position).normalize();
    const labels: GlobeLabel[] = [];
    const seen = new Set<string>();

    const pushCountry = (
      id: string,
      name: string,
      lat: number,
      lng: number,
      priority: number,
    ) => {
      if (priority < countryMin || seen.has(name.toLowerCase())) return;
      const p = latLngToVector3(lat, lng, EARTH_RADIUS * 1.02);
      const vec = new THREE.Vector3(p.x, p.y, p.z);
      const facing = vec.clone().normalize().dot(cameraDir);
      if (facing < 0.16) return;
      vec.project(this.camera);
      const x = (vec.x * 0.5 + 0.5) * width;
      const y = (-vec.y * 0.5 + 0.5) * height;
      if (x < 10 || y < 10 || x > width - 10 || y > height - 10) return;
      if (this.inHeroBand(x, y, width, height)) return;
      seen.add(name.toLowerCase());
      labels.push({
        id,
        kind: "country",
        name,
        x,
        y,
        visible: true,
        priority,
      });
    };

    for (const country of this.countries) {
      pushCountry(`country-${country.slug}`, country.name, country.latitude, country.longitude, country.priority);
    }
    for (const place of GLOBE_COUNTRY_LABELS) {
      pushCountry(`place-${place.name}`, place.name, place.latitude, place.longitude, place.priority);
    }

    for (const city of this.cities) {
      const boosted = city.contentStatus === "published" ? city.tourismPriority + 12 : city.tourismPriority;
      if (boosted < cityMin && city.id !== this.highlightId) continue;
      const vec = this.cityPositions.get(city.id);
      if (!vec) continue;
      const facing = vec.clone().normalize().dot(cameraDir);
      if (facing < 0.2 && city.id !== this.highlightId) continue;
      const projected = vec.clone().project(this.camera);
      const x = (projected.x * 0.5 + 0.5) * width;
      const y = (-projected.y * 0.5 + 0.5) * height;
      if (x < 8 || y < 8 || x > width - 8 || y > height - 8) continue;
      if (city.id !== this.highlightId && this.inHeroBand(x, y, width, height)) continue;
      labels.push({
        id: city.id,
        kind: "city",
        name: city.name,
        subtitle: city.country,
        x,
        y,
        visible: true,
        priority: city.id === this.highlightId ? 220 : boosted,
        city,
      });
    }

    labels.sort((a, b) => b.priority - a.priority);
    const placed: GlobeLabel[] = [];
    const minDist = isMobile() ? 46 : 42;
    for (const label of labels) {
      const overlaps = placed.some((other) => {
        const dx = other.x - label.x;
        const dy = other.y - label.y;
        return dx * dx + dy * dy < minDist * minDist;
      });
      if (overlaps) continue;
      placed.push(label);
      if (placed.length >= (isMobile() ? 14 : 24)) break;
    }
    this.onLabels(placed);
  }

  private stepFly(dt: number) {
    if (!this.fly) return;
    this.fly.t += dt * 1000;
    const u = easeInOutCubic(Math.min(1, this.fly.t / this.fly.duration));
    const phi = this.fly.from.phi + (this.fly.to.phi - this.fly.from.phi) * u;
    let deltaTheta = this.fly.to.theta - this.fly.from.theta;
    while (deltaTheta > Math.PI) deltaTheta -= Math.PI * 2;
    while (deltaTheta < -Math.PI) deltaTheta += Math.PI * 2;
    const theta = this.fly.from.theta + deltaTheta * u;
    const radius = this.fly.from.radius + (this.fly.to.radius - this.fly.from.radius) * u;
    this.spherical.set(radius, phi, theta);
    this.camera.position.setFromSpherical(this.spherical);
    this.camera.lookAt(0, 0, 0);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
    if (u >= 1) {
      const onDone = this.fly.onDone;
      this.fly = null;
      onDone?.();
    }
  }

  private loop = (ts: number) => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.loop);
    const dt = Math.min(0.05, this.lastTs ? (ts - this.lastTs) / 1000 : 0.016);
    this.lastTs = ts;

    if (this.fly) {
      this.stepFly(dt);
    } else {
      if (!this.reducedMotion) {
        this.idleTimer += dt;
        if (!this.autoRotate && this.idleTimer > 7.5) {
          this.autoRotate = true;
          this.controls.autoRotate = true;
        }
      }
      this.controls.update();
    }

    this.rim.quaternion.copy(this.camera.quaternion);
    this.cityGroup.visible = this.cameraDistance() < 3.1 || Boolean(this.highlightId);

    this.renderer.render(this.scene, this.camera);
    this.projectLabels();
  };
}

export function webglAvailable() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}
