import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import type { City, Country } from "@/types/catalog";
import { latLngToVector3 } from "./latlng";

/** Bump this when the engine visual contract changes so <Globe> remounts on HMR. */
export const GLOBE_ENGINE_REV = 8;

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
const LAND_MASK_URL = "/globe/land-mask.png";
const CITY_COLOR = 0xf0f0e4;
const CITY_DIM = 0x5a5a4c;
const CITY_ACTIVE = 0xd4f03c;

function isMobile() {
  return window.innerWidth < 768 || window.matchMedia("(pointer: coarse)").matches;
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function makeStippleMaterial(land: THREE.Texture) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uLand: { value: land },
      uDotColor: { value: new THREE.Color(0xf6f6ea) },
      uDensity: { value: isMobile() ? 64 : 78 },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D uLand;
      uniform vec3 uDotColor;
      uniform float uDensity;
      varying vec2 vUv;

      void main() {
        float land = step(0.45, texture2D(uLand, vUv).r);
        float lat = (0.5 - vUv.y) * 3.14159265;
        float cosLat = max(abs(cos(lat)), 0.28);
        vec2 grid = vec2(vUv.x * uDensity * 2.0 * cosLat, vUv.y * uDensity);
        vec2 cell = fract(grid) - 0.5;
        float d = length(cell);
        float dot = 1.0 - smoothstep(0.22, 0.34, d);
        float lit = land * dot;
        gl_FragColor = vec4(uDotColor * lit, 1.0);
      }
    `,
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
    this.camera = new THREE.PerspectiveCamera(42, 1, 0.1, 60);
    const start = latLngToVector3(-8, 125, 3.05);
    this.camera.position.set(start.x, start.y, start.z);

    this.controls = new OrbitControls(this.camera, options.canvas);
    this.controls.enablePan = false;
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.075;
    this.controls.minDistance = 1.55;
    this.controls.maxDistance = 4.8;
    this.controls.rotateSpeed = 0.38;
    this.controls.zoomSpeed = 0.7;
    this.controls.autoRotate = this.autoRotate;
    this.controls.autoRotateSpeed = 0.28;
    this.controls.minPolarAngle = 0.18;
    this.controls.maxPolarAngle = Math.PI - 0.18;
    this.controls.target.set(0, 0, 0);
    this.controls.update();

    this.scene.add(this.globe);
    this.globe.add(this.cityGroup);

    this.rim = this.makeRim();
    this.scene.add(this.rim);
    this.addOrbits();
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
    try {
      const texture = await new THREE.TextureLoader().loadAsync(LAND_MASK_URL);
      if (this.disposed) {
        texture.dispose();
        return;
      }
      texture.colorSpace = THREE.NoColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      texture.needsUpdate = true;
      this.textures.push(texture);

      const earthMat = makeStippleMaterial(texture);
      const earth = new THREE.Mesh(new THREE.SphereGeometry(EARTH_RADIUS, 96, 64), earthMat);
      this.globe.add(earth);
      this.geometries.push(earth.geometry);
      this.materials.push(earthMat);
    } finally {
      if (!this.disposed) this.onReady?.();
    }
  }

  private makeRim() {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 256; i += 1) {
      const a = (i / 256) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a), Math.sin(a), 0));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({
      color: 0x5c5c52,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
      toneMapped: false,
    });
    this.geometries.push(geo);
    this.materials.push(mat);
    const line = new THREE.LineLoop(geo, mat);
    line.scale.setScalar(EARTH_RADIUS * 1.002);
    return line;
  }

  private addOrbits() {
    const rings = [
      { rx: 1.92, ry: 0.74, rotX: 0.62, rotZ: 0.32, opacity: 0.16 },
      { rx: 2.28, ry: 0.9, rotX: 1.02, rotZ: -0.22, opacity: 0.1 },
      { rx: 1.62, ry: 0.58, rotX: -0.38, rotZ: 0.72, opacity: 0.08 },
    ];
    for (const ring of rings) {
      const curve = new THREE.EllipseCurve(0, 0, ring.rx, ring.ry, 0, Math.PI * 2, false, 0);
      const points = curve.getPoints(180).map((p) => new THREE.Vector3(p.x, p.y, 0));
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({
        color: 0x4a4a40,
        transparent: true,
        opacity: ring.opacity,
        depthWrite: false,
        toneMapped: false,
      });
      const line = new THREE.LineLoop(geo, mat);
      line.rotation.x = ring.rotX;
      line.rotation.z = ring.rotZ;
      this.scene.add(line);
      this.geometries.push(geo);
      this.materials.push(mat);
    }
  }

  private addStars() {
    const count = isMobile() ? 180 : 420;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const r = 10 + Math.random() * 18;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      const c = 0.55 + Math.random() * 0.4;
      colors[i * 3] = c;
      colors[i * 3 + 1] = c;
      colors[i * 3 + 2] = c * 0.92;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({
      size: 0.032,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
      sizeAttenuation: true,
      toneMapped: false,
    });
    this.scene.add(new THREE.Points(geometry, material));
    this.geometries.push(geometry);
    this.materials.push(material);
  }

  private addCities() {
    const visGeo = new THREE.SphereGeometry(0.0026, 8, 8);
    const hitGeo = new THREE.SphereGeometry(0.018, 8, 8);
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
      const pos = latLngToVector3(city.latitude, city.longitude, EARTH_RADIUS + 0.004);
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
      mesh.scale.setScalar(active ? 1.8 : 1);
      material.color.set(active ? CITY_ACTIVE : CITY_COLOR);
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
    const mobile = isMobile();
    const top = height * (mobile ? 0.1 : 0.12);
    const bottom = height * (mobile ? 0.48 : 0.62);
    const left = width * (mobile ? 0.1 : 0.18);
    const right = width * (mobile ? 0.9 : 0.82);
    return x > left && x < right && y > top && y < bottom;
  }

  private cameraDistance() {
    return this.camera.position.length();
  }

  private lodThresholds() {
    const d = this.cameraDistance();
    if (d > 2.7) return { countries: false, cityMin: 200 };
    if (d > 2.35) return { countries: true, cityMin: 88 };
    if (d > 1.9) return { countries: true, cityMin: 68 };
    return { countries: false, cityMin: 30 };
  }

  private projectLabels() {
    const { countries: showCountries, cityMin } = this.lodThresholds();
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    const cameraDir = this.tmp.copy(this.camera.position).normalize();
    const labels: GlobeLabel[] = [];

    if (showCountries) {
      for (const country of this.countries) {
        const p = latLngToVector3(country.latitude, country.longitude, EARTH_RADIUS * 1.02);
        const vec = new THREE.Vector3(p.x, p.y, p.z);
        const facing = vec.clone().normalize().dot(cameraDir);
        if (facing < 0.18) continue;
        vec.project(this.camera);
        const x = (vec.x * 0.5 + 0.5) * width;
        const y = (-vec.y * 0.5 + 0.5) * height;
        if (x < 8 || y < 8 || x > width - 8 || y > height - 8) continue;
        if (this.inHeroBand(x, y, width, height)) continue;
        labels.push({
          id: `country-${country.slug}`,
          kind: "country",
          name: country.name,
          x,
          y,
          visible: true,
          priority: country.priority,
        });
      }
    }

    for (const city of this.cities) {
      if (city.tourismPriority < cityMin && city.id !== this.highlightId) continue;
      const vec = this.cityPositions.get(city.id);
      if (!vec) continue;
      const facing = vec.clone().normalize().dot(cameraDir);
      if (facing < 0.22 && city.id !== this.highlightId) continue;
      const projected = vec.clone().project(this.camera);
      const x = (projected.x * 0.5 + 0.5) * width;
      const y = (-projected.y * 0.5 + 0.5) * height;
      if (x < 6 || y < 6 || x > width - 6 || y > height - 6) continue;
      if (city.id !== this.highlightId && this.inHeroBand(x, y, width, height)) continue;
      labels.push({
        id: city.id,
        kind: "city",
        name: city.name,
        subtitle: city.country,
        x,
        y,
        visible: true,
        priority: city.id === this.highlightId ? 200 : city.tourismPriority,
        city,
      });
    }

    labels.sort((a, b) => b.priority - a.priority);
    const placed: GlobeLabel[] = [];
    const minDist = isMobile() ? 52 : 48;
    for (const label of labels) {
      const overlaps = placed.some((other) => {
        const dx = other.x - label.x;
        const dy = other.y - label.y;
        return dx * dx + dy * dy < minDist * minDist;
      });
      if (overlaps) continue;
      placed.push(label);
      if (placed.length >= (isMobile() ? 8 : 14)) break;
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
    this.cityGroup.visible = this.cameraDistance() < 2.55 || Boolean(this.highlightId);

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
