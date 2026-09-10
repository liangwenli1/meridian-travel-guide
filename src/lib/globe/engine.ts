import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLOBE_COUNTRY_LABELS } from "@/data/globe-places";
import type { City, Country } from "@/types/catalog";
import { latLngToVector3 } from "./latlng";

/** Bump this when the engine visual contract changes so <Globe> remounts on HMR. */
export const GLOBE_ENGINE_REV = 23;

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
  heroBand?: boolean;
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
const CITY_COLOR = 0xf4f1dc;
const CITY_DIM = 0x7a7560;
const CITY_ACTIVE = 0xd4f03c;

/** Keep large-country names off the homepage title. */
const LABEL_ANCHORS: Record<string, { lat: number; lng: number }> = {
  "United States": { lat: 44.2, lng: -120.8 },
  Mexico: { lat: 31.0, lng: -110.8 },
  Canada: { lat: 53.2, lng: -66.5 },
};

function isMobile() {
  return window.innerWidth < 768 || window.matchMedia("(pointer: coarse)").matches;
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${url}`));
    img.src = url;
  });
}

function imageData(img: HTMLImageElement, width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("2d context unavailable");
  ctx.drawImage(img, 0, 0, width, height);
  return ctx.getImageData(0, 0, width, height);
}

function hash01(x: number, y: number) {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

function samplePixel(data: ImageData, w: number, h: number, lat: number, lng: number) {
  const wrapped = ((lng + 180) % 360 + 360) % 360;
  const x = Math.min(w - 1, Math.max(0, Math.floor((wrapped / 360) * w)));
  const y = Math.min(h - 1, Math.max(0, Math.floor(((90 - lat) / 180) * h)));
  const i = (y * w + x) * 4;
  return { r: data.data[i], g: data.data[i + 1], b: data.data[i + 2], i };
}

function makeLandMaterial(land: THREE.Texture) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uLand: { value: land },
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
      varying vec2 vUv;
      void main() {
        float land = texture2D(uLand, vUv).r;
        vec3 ocean = vec3(0.0);
        vec3 ground = vec3(0.02, 0.026, 0.032);
        float mask = smoothstep(0.2, 0.72, land);
        gl_FragColor = vec4(mix(ocean, ground, mask), 1.0);
      }
    `,
    toneMapped: false,
    glslVersion: THREE.GLSL1,
  });
}

function makePointMaterial(additive: boolean) {
  const maxSize = additive ? "2.6" : "1.6";
  return new THREE.ShaderMaterial({
    vertexShader: /* glsl */ `
      attribute float aSize;
      varying vec3 vColor;
      void main() {
        vColor = color;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        float dist = max(-mv.z, 0.55);
        gl_PointSize = clamp(aSize * (5.2 / dist), 0.7, ${maxSize});
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      varying vec3 vColor;
      void main() {
        vec2 p = gl_PointCoord * 2.0 - 1.0;
        float d = dot(p, p);
        if (d > 1.0) discard;
        float core = 1.0 - smoothstep(0.0, 0.55, d);
        float halo = 1.0 - smoothstep(0.2, 1.0, d);
        float alpha = mix(halo * 0.55, core, core);
        gl_FragColor = vec4(vColor, alpha);
      }
    `,
    transparent: true,
    depthTest: true,
    depthWrite: false,
    blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    vertexColors: true,
    toneMapped: false,
    glslVersion: THREE.GLSL1,
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
  private heroBandEnabled: boolean;
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
  private earthMesh: THREE.Mesh;
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
    this.heroBandEnabled = options.heroBand !== false;
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
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile() ? 1.35 : 2));

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 80);
    const start = latLngToVector3(12, -78, 2.48);
    this.camera.position.set(start.x, start.y, start.z);

    this.controls = new OrbitControls(this.camera, options.canvas);
    this.controls.enablePan = false;
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.075;
    this.controls.minDistance = 1.62;
    this.controls.maxDistance = 4.6;
    this.controls.rotateSpeed = 0.42;
    this.controls.zoomSpeed = 0.75;
    this.controls.autoRotate = this.autoRotate;
    this.controls.autoRotateSpeed = 0.22;
    this.controls.minPolarAngle = 0.18;
    this.controls.maxPolarAngle = Math.PI - 0.18;
    this.controls.target.set(0, 0, 0);
    this.controls.update();

    this.scene.add(this.globe);
    this.globe.add(this.cityGroup);

    this.earthMesh = new THREE.Mesh(
      new THREE.SphereGeometry(EARTH_RADIUS, 96, 64),
      new THREE.MeshBasicMaterial({ color: 0x000000 }),
    );
    this.globe.add(this.earthMesh);
    this.geometries.push(this.earthMesh.geometry);
    this.materials.push(this.earthMesh.material as THREE.Material);

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
    const toVec = new THREE.Vector3(dest.x, dest.y, dest.z).normalize().multiplyScalar(2.05);
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
      const mobile = isMobile();
      const [nightImg, landImg, borders] = await Promise.all([
        loadImage(NIGHT_URL),
        loadImage(LAND_MASK_URL),
        fetch(BORDERS_URL).then((res) => res.json()) as Promise<{ rings: number[][] }>,
      ]);
      if (this.disposed) return;

      const landTex = new THREE.Texture(landImg);
      landTex.colorSpace = THREE.NoColorSpace;
      landTex.minFilter = THREE.LinearFilter;
      landTex.magFilter = THREE.LinearFilter;
      landTex.generateMipmaps = false;
      landTex.needsUpdate = true;
      this.textures.push(landTex);

      const landMat = makeLandMaterial(landTex);
      const prev = this.earthMesh.material;
      this.earthMesh.material = landMat;
      if (prev instanceof THREE.Material) prev.dispose();
      this.materials.push(landMat);

      this.addPopulationParticles(landImg, nightImg, mobile);
      this.addBorders(borders.rings);
    } finally {
      if (!this.disposed) this.onReady?.();
    }
  }

  private addPopulationParticles(
    landImg: HTMLImageElement,
    nightImg: HTMLImageElement,
    mobile: boolean,
  ) {
    const w = mobile ? 2048 : 4096;
    const h = w / 2;
    const land = imageData(landImg, w, h);
    const night = imageData(nightImg, w, h);
    const step = mobile ? 2 : 1;

    const positions: number[] = [];
    const colors: number[] = [];
    const sizes: number[] = [];

    const spawn = (lat: number, lng: number, signal: number, seed: number) => {
      const radius = EARTH_RADIUS * (1.0032 + hash01(seed, 13) * 0.0028);
      const p = latLngToVector3(lat, lng, radius);
      positions.push(p.x, p.y, p.z);
      const north = Math.min(1, Math.max(0, (lat + 38) / 72));
      const intensity = 0.42 + (signal / 255) * 0.9;
      colors.push(
        Math.min(1, (1.0 * (1 - north) + 0.68 * north) * intensity),
        Math.min(1, (0.78 * (1 - north) + 0.96 * north) * intensity),
        Math.min(1, (0.28 * (1 - north) + 1.02 * north) * intensity),
      );
      sizes.push(0.72 + (signal / 255) * 1.15);
    };

    for (let y = 0; y < h; y += step) {
      const lat0 = 90 - ((y + 0.5) / h) * 180;
      for (let x = 0; x < w; x += step) {
        const i = (y * w + x) * 4;
        if (land.data[i] < 80) continue;
        const red = night.data[i];
        const green = night.data[i + 1];
        const blue = night.data[i + 2];
        const signal = Math.min(red, green);
        if (signal < 20) continue;
        if (blue > signal + 18 && signal < 32) continue;

        const lng0 = ((x + 0.5) / w) * 360 - 180;
        const lat = lat0 + (hash01(x, y + 11) - 0.5) * 0.05;
        const lng = lng0 + (hash01(x + 9, y) - 0.5) * 0.05;
        spawn(lat, lng, signal, x * 13 + y);

        if (!mobile && signal > 70) {
          spawn(
            lat + (hash01(x, y + 41) - 0.5) * 0.07,
            lng + (hash01(x + 47, y) - 0.5) * 0.07,
            signal,
            x * 17 + y + 0.4,
          );
        }
      }
    }

    this.pushPoints(positions, colors, sizes, true);
  }

  private pushPoints(positions: number[], colors: number[], sizes: number[], additive: boolean) {
    if (!positions.length) return;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geo.setAttribute("aSize", new THREE.Float32BufferAttribute(sizes, 1));
    const mat = makePointMaterial(additive);
    const points = new THREE.Points(geo, mat);
    points.frustumCulled = false;
    this.globe.add(points);
    this.geometries.push(geo);
    this.materials.push(mat);
  }

  private addBorders(rings: number[][]) {
    const positions: number[] = [];
    const r = EARTH_RADIUS * 1.009;
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
      color: 0xc9d4de,
      transparent: true,
      opacity: 0.52,
      depthWrite: false,
      toneMapped: false,
    });
    this.globe.add(new THREE.LineSegments(geo, mat));
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
      color: 0x6a6a62,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
      toneMapped: false,
    });
    this.geometries.push(geo);
    this.materials.push(mat);
    const line = new THREE.LineLoop(geo, mat);
    line.scale.setScalar(EARTH_RADIUS * 1.001);
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
    const visGeo = new THREE.SphereGeometry(0.0024, 8, 8);
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
      const pos = latLngToVector3(city.latitude, city.longitude, EARTH_RADIUS + 0.012);
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
      mesh.scale.setScalar(active ? 2.2 : 1);
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
    if (!this.heroBandEnabled) return false;
    const nx = Math.abs(x / width - 0.5);
    const ny = y / height;
    if (isMobile()) {
      return nx < 0.42 && ny > 0.1 && ny < 0.48;
    }
    if (ny > 0.46 && ny < 0.56 && nx < 0.36) return true;
    if (ny > 0.26 && ny < 0.4 && nx < 0.2) return true;
    if (ny > 0.38 && ny < 0.47 && nx < 0.18) return true;
    return false;
  }

  private cameraDistance() {
    return this.camera.position.length();
  }

  private lodThresholds() {
    const d = this.cameraDistance();
    if (d > 4.2) return { countryMin: 70, cityMin: 88 };
    if (d > 3.1) return { countryMin: 48, cityMin: 72 };
    if (d > 2.4) return { countryMin: 34, cityMin: 54 };
    return { countryMin: 0, cityMin: 30 };
  }

  private isFrontFacing(vec: THREE.Vector3, cameraDir: THREE.Vector3, minDot: number) {
    return vec.clone().normalize().dot(cameraDir) >= minDot;
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
      const anchor = LABEL_ANCHORS[name];
      const p = latLngToVector3(anchor?.lat ?? lat, anchor?.lng ?? lng, EARTH_RADIUS * 1.02);
      const vec = new THREE.Vector3(p.x, p.y, p.z);
      if (!this.isFrontFacing(vec, cameraDir, 0.32)) return;
      vec.project(this.camera);
      if (vec.z > 0.98) return;
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
      if (city.id !== this.highlightId && !this.isFrontFacing(vec, cameraDir, 0.45)) continue;
      const projected = vec.clone().project(this.camera);
      if (projected.z > 0.98 && city.id !== this.highlightId) continue;
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
      if (placed.length >= (isMobile() ? 16 : 32)) break;
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
    this.cityGroup.visible = this.cameraDistance() < 4.6 || Boolean(this.highlightId);

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
