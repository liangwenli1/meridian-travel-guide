import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { cities } from "@/data/cities";
import { countries } from "@/data/countries";
import type { City } from "@/types/catalog";
import { latLngToVector3 } from "./latlng";

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
  onLabels: (labels: GlobeLabel[]) => void;
  onCityClick: (city: City) => void;
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
const MASK_URL = "/globe/earth-dark.jpg";

function isMobile() {
  return window.innerWidth < 768 || window.matchMedia("(pointer: coarse)").matches;
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("earth mask failed"));
    img.src = src;
  });
}

function sampleLand(image: HTMLImageElement, step: number) {
  const width = 1024;
  const height = 512;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return { positions: new Float32Array(0), colors: new Float32Array(0) };

  ctx.drawImage(image, 0, 0, width, height);
  const { data } = ctx.getImageData(0, 0, width, height);
  const positions: number[] = [];
  const colors: number[] = [];

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const jx = Math.min(width - 1, x + ((y * 17) % Math.max(step - 1, 1)));
      const jy = Math.min(height - 1, y + ((x * 13) % Math.max(step - 1, 1)));
      const idx = (jy * width + jx) * 4;
      const r = data[idx] ?? 0;
      const g = data[idx + 1] ?? 0;
      const b = data[idx + 2] ?? 0;
      const brightness = (r + g + b) / 3;
      if (brightness < 48) continue;

      const u = (jx + 0.5) / width;
      const v = (jy + 0.5) / height;
      const lat = (0.5 - v) * 180;
      const lng = (u - 0.5) * 360;
      const lift = 0.004 + (brightness / 255) * 0.01;
      const p = latLngToVector3(lat, lng, EARTH_RADIUS + lift);
      positions.push(p.x, p.y, p.z);

      const t = Math.min(1, brightness / 120);
      colors.push(0.82 + t * 0.18, 0.8 + t * 0.16, 0.68 + t * 0.2);
    }
  }

  return {
    positions: new Float32Array(positions),
    colors: new Float32Array(colors),
  };
}

function makePointMaterial(size: number, opacity: number) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: true,
    toneMapped: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uSize: { value: size },
      uOpacity: { value: opacity },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    },
    vertexShader: `
      attribute vec3 color;
      varying vec3 vColor;
      uniform float uSize;
      uniform float uPixelRatio;
      void main() {
        vColor = color;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        float dist = max(0.55, -mv.z);
        gl_PointSize = clamp(uSize * uPixelRatio * (2.4 / dist), 2.0, 28.0);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      uniform float uOpacity;
      void main() {
        vec2 p = gl_PointCoord - vec2(0.5);
        float d = length(p);
        if (d > 0.5) discard;
        float core = 1.0 - smoothstep(0.0, 0.22, d);
        float halo = 1.0 - smoothstep(0.12, 0.5, d);
        float alpha = (core * 0.95 + halo * 0.45) * uOpacity;
        gl_FragColor = vec4(vColor, alpha);
      }
    `,
  });
}

function makeEarthMaterial(texture: THREE.Texture) {
  return new THREE.ShaderMaterial({
    toneMapped: false,
    uniforms: {
      uMap: { value: texture },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormalW;
      varying vec3 vViewDir;
      void main() {
        vUv = uv;
        vec4 world = modelMatrix * vec4(position, 1.0);
        vNormalW = normalize(mat3(modelMatrix) * normal);
        vViewDir = cameraPosition - world.xyz;
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: `
      uniform sampler2D uMap;
      varying vec2 vUv;
      varying vec3 vNormalW;
      varying vec3 vViewDir;

      void main() {
        vec3 tex = texture2D(uMap, vUv).rgb;
        float luma = dot(tex, vec3(0.299, 0.587, 0.114));
        float land = smoothstep(0.08, 0.22, luma);

        vec2 grid = vec2(vUv.x * 300.0, vUv.y * 150.0);
        vec2 cell = fract(grid) - 0.5;
        float d = length(cell);
        float dotMask = 1.0 - smoothstep(0.14, 0.36, d);

        vec3 ocean = vec3(0.02, 0.035, 0.06);
        vec3 landCol = tex * vec3(1.08, 1.04, 0.9);
        vec3 surface = mix(ocean, landCol, land * mix(0.55, 1.0, dotMask));

        vec3 N = normalize(vNormalW);
        vec3 V = normalize(vViewDir);
        float ndv = clamp(dot(N, V), 0.0, 1.0);
        float wrap = 0.42 + 0.58 * ndv;
        float rim = pow(1.0 - ndv, 2.6);

        vec3 color = surface * wrap;
        color += vec3(0.32, 0.46, 0.72) * rim * 0.38;
        color += land * vec3(0.12, 0.11, 0.08) * (1.0 - wrap);

        gl_FragColor = vec4(color, 1.0);
      }
    `,
  });
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
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
  private onLabels: GlobeEngineOptions["onLabels"];
  private onCityClick: GlobeEngineOptions["onCityClick"];
  private cityPositions = new Map<string, THREE.Vector3>();
  private cityMeshes = new Map<string, THREE.Mesh>();
  private highlightId: string | null = null;
  private fly: FlyState | null = null;
  private idleTimer = 0;
  private autoRotate = true;
  private lastTs = 0;
  private tmp = new THREE.Vector3();
  private spherical = new THREE.Spherical();
  private labelScratch: GlobeLabel[] = [];
  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2();
  private canvas: HTMLCanvasElement;
  private resizeObs: ResizeObserver;
  private cityGroup = new THREE.Group();
  private materials: THREE.Material[] = [];
  private geometries: THREE.BufferGeometry[] = [];
  private textures: THREE.Texture[] = [];

  constructor(options: GlobeEngineOptions) {
    this.canvas = options.canvas;
    this.reducedMotion = options.reducedMotion;
    this.onLabels = options.onLabels;
    this.onCityClick = options.onCityClick;
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
    const start = latLngToVector3(22, 12, 3.12);
    this.camera.position.set(start.x, start.y, start.z);

    this.controls = new OrbitControls(this.camera, options.canvas);
    this.controls.enablePan = false;
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.075;
    this.controls.minDistance = 1.48;
    this.controls.maxDistance = 4.6;
    this.controls.rotateSpeed = 0.38;
    this.controls.zoomSpeed = 0.7;
    this.controls.autoRotate = this.autoRotate;
    this.controls.autoRotateSpeed = 0.32;
    this.controls.minPolarAngle = 0.18;
    this.controls.maxPolarAngle = Math.PI - 0.18;
    this.controls.target.set(0, 0, 0);
    this.controls.update();

    this.scene.add(this.globe);
    this.globe.add(this.cityGroup);

    this.addAtmosphere();
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
    const hits = this.raycaster.intersectObjects(this.cityGroup.children, false);
    const mesh = hits[0]?.object;
    const cityId = mesh?.userData.cityId as string | undefined;
    if (!cityId) return;
    const city = cities.find((c) => c.id === cityId);
    if (city) this.onCityClick(city);
  };

  private async loadEarth() {
    const image = await loadImage(MASK_URL);
    if (this.disposed) return;

    const texture = new THREE.Texture(image);
    texture.needsUpdate = true;
    texture.colorSpace = THREE.NoColorSpace;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    texture.anisotropy = Math.min(4, this.renderer.capabilities.getMaxAnisotropy());
    this.textures.push(texture);

    const earthMat = makeEarthMaterial(texture);
    const earth = new THREE.Mesh(new THREE.SphereGeometry(EARTH_RADIUS, 96, 64), earthMat);
    this.globe.add(earth);
    this.geometries.push(earth.geometry);
    this.materials.push(earthMat);

    const land = sampleLand(image, isMobile() ? 4 : 2);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(land.positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(land.colors, 3));
    const material = makePointMaterial(isMobile() ? 10 : 7.5, 0.88);
    const points = new THREE.Points(geometry, material);
    this.globe.add(points);
    this.geometries.push(geometry);
    this.materials.push(material);
  }

  private addAtmosphere() {
    const material = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
          gl_FragColor = vec4(0.42, 0.58, 0.92, 1.0) * intensity * 0.95;
        }
      `,
    });
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(EARTH_RADIUS * 1.16, 48, 32), material);
    this.scene.add(mesh);
    this.geometries.push(mesh.geometry);
    this.materials.push(material);
  }

  private addStars() {
    const count = isMobile() ? 420 : 1100;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const r = 9 + Math.random() * 18;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      const c = 0.55 + Math.random() * 0.45;
      colors[i * 3] = c;
      colors[i * 3 + 1] = c * (0.92 + Math.random() * 0.08);
      colors[i * 3 + 2] = c * (0.88 + Math.random() * 0.12);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({
      size: 0.07,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      sizeAttenuation: true,
      toneMapped: false,
    });
    this.scene.add(new THREE.Points(geometry, material));
    this.geometries.push(geometry);
    this.materials.push(material);
  }

  private addCities() {
    const geo = new THREE.SphereGeometry(0.01, 12, 12);
    this.geometries.push(geo);
    for (const city of cities) {
      const pos = latLngToVector3(city.latitude, city.longitude, EARTH_RADIUS + 0.014);
      const vec = new THREE.Vector3(pos.x, pos.y, pos.z);
      this.cityPositions.set(city.id, vec);
      const material = new THREE.MeshBasicMaterial({
        color: city.contentStatus === "published" ? 0xf4f0e6 : 0x8b93a0,
        transparent: true,
        opacity: 0.96,
        toneMapped: false,
      });
      this.materials.push(material);
      const mesh = new THREE.Mesh(geo, material);
      mesh.position.copy(vec);
      mesh.scale.setScalar(city.contentStatus === "published" ? 1.25 : 0.85);
      mesh.userData.cityId = city.id;
      this.cityGroup.add(mesh);
      this.cityMeshes.set(city.id, mesh);
    }
  }

  private updateHighlight() {
    for (const [id, mesh] of this.cityMeshes) {
      const material = mesh.material as THREE.MeshBasicMaterial;
      const active = id === this.highlightId;
      mesh.scale.setScalar(active ? 2.4 : 1);
      material.color.set(active ? 0xffffff : 0xf4f0e6);
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
    const bottom = height * (mobile ? 0.44 : 0.6);
    const left = width * (mobile ? 0.12 : 0.2);
    const right = width * (mobile ? 0.88 : 0.8);
    return x > left && x < right && y > top && y < bottom;
  }

  private cameraDistance() {
    return this.camera.position.length();
  }

  private lodThresholds() {
    const d = this.cameraDistance();
    if (d > 3.15) return { countries: true, cityMin: 200 };
    if (d > 2.45) return { countries: true, cityMin: 90 };
    if (d > 1.9) return { countries: false, cityMin: 68 };
    return { countries: false, cityMin: 30 };
  }

  private projectLabels() {
    const { countries: showCountries, cityMin } = this.lodThresholds();
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    const cameraDir = this.tmp.copy(this.camera.position).normalize();
    const labels: GlobeLabel[] = [];

    if (showCountries) {
      for (const country of countries) {
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

    for (const city of cities) {
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
      if (placed.length >= (isMobile() ? 10 : 18)) break;
    }
    this.labelScratch = placed;
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
