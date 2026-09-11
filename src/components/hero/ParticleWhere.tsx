import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import * as THREE from "three";

/**
 * Particle headline.
 *
 * One loop: "Where" breathes → morphs through four city names → the last city
 * folds into a paper plane that flies a dotted route across the whole hero →
 * the particles stream back and re-form "Where".
 *
 * The canvas is portaled into `#hero-fx` (a full-hero layer above the globe and
 * below the copy) so the plane can cross the entire fold. If that host is
 * missing the canvas falls back to a local stage around the word.
 */

export const HERO_FX_HOST_ID = "hero-fx";

const CFG = {
  rasterScale: 4,
  alphaThreshold: 32,
  fov: 38,
  dprMax: 1.5,
  resizeDebounceMs: 140,
  pointSizeMin: 0.7,
  pointSizeMax: 1.7,
  planeShare: 0.45,
  planeSizeEm: 1.25,
  cityFitWidth: 1.04,
  cityMinScale: 0.5,
  stagger: 0.35,
  pointerRadius: 140,
  pointerStrength: 14,
  timing: {
    breathe: 3.0,
    morph: 0.9,
    hold: 2.0,
    form: 0.8,
    fly: 3.0,
    flyMobile: 2.0,
    back: 1.0,
  },
  counts: {
    mobileMin: 8000,
    mobileMax: 12000,
    low: 24000,
    medium: 34000,
    high: 48000,
    veryHigh: 56000,
  },
};

// lucide "send" (paper plane), MIT. Nose points up-right in the 24px box.
const PLANE_BODY =
  "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z";
const PLANE_FOLD = "m21.854 2.147-10.94 10.939";

const VERT = /* glsl */ `
uniform float uTime;
uniform float uMorph;
uniform float uFlightOn;
uniform float uFlight;
uniform float uReturn;
uniform float uMotion;
uniform float uStagger;
uniform float uHalfH;
uniform float uCameraZ;
uniform float uDpr;
uniform vec2 uPointer;
uniform float uPointerRadius;
uniform float uPointerStrength;
uniform vec3 uP0;
uniform vec3 uP1;
uniform vec3 uP2;
uniform vec3 uP3;
uniform float uPlaneScale;
uniform vec3 uGlobe;
attribute vec3 aHome;
attribute vec3 aFrom;
attribute vec3 aTo;
attribute vec2 aPlane;
attribute float aRole;
attribute float aTrail;
attribute float aOrder;
attribute float aSeed;
attribute float aSize;
attribute float aBrightness;
varying float vAlpha;
varying float vBright;

float easeS(float x) { x = clamp(x, 0.0, 1.0); return x * x * (3.0 - 2.0 * x); }
vec3 bez(float t) {
  float u = 1.0 - t;
  return u * u * u * uP0 + 3.0 * u * u * t * uP1 + 3.0 * u * t * t * uP2 + t * t * t * uP3;
}
vec3 bezd(float t) {
  float u = 1.0 - t;
  return 3.0 * u * u * (uP1 - uP0) + 6.0 * u * t * (uP2 - uP1) + 3.0 * t * t * (uP3 - uP2);
}
vec3 pathAt(float s) {
  float c = clamp(s, 0.0, 1.0);
  return bez(c) + bezd(c) * (s - c);
}

void main() {
  float r1 = fract(aSeed * 0.37);
  float r2 = fract(aSeed * 0.61);
  float r3 = fract(aSeed * 0.83);
  float r4 = fract(aSeed * 0.29);
  float r5 = fract(aSeed * 0.53);

  // 1. Text-to-text morph with a left-to-right sweep and an upward throw.
  float m = easeS(uMorph * (1.0 + uStagger) - aOrder * uStagger);
  vec3 a = mix(aFrom, aTo, m);
  float lift = sin(m * 3.14159265);
  a.y += lift * uHalfH * (0.8 + r1 * 1.4);
  a.z += lift * (20.0 + r2 * 40.0);
  a.x += lift * sin(aSeed * 3.1 + uTime * 2.0) * 7.0;

  // 2. Flight: plane particles ride the nose, trail particles are dropped along the route.
  float isPlane = step(0.5, aRole);
  float s = mix(aTrail, uFlight, isPlane);
  vec3 fp = pathAt(s);
  vec3 d = normalize(bezd(clamp(s, 0.0, 1.0)) + vec3(1e-4, 0.0, 0.0));
  float ang = atan(d.y, d.x);
  vec2 pl = aPlane * uPlaneScale;
  vec2 rp = vec2(cos(ang) * pl.x - sin(ang) * pl.y, sin(ang) * pl.x + cos(ang) * pl.y);
  vec3 f = fp + vec3(rp, 0.0) * isPlane;
  vec2 n = vec2(-d.y, d.x);
  f.xy += n * (r3 - 0.5) * 9.0 * (1.0 - isPlane);
  f.z += sin(clamp(s, 0.0, 1.0) * 3.14159265) * 60.0;

  float fl = easeS(uFlightOn * (1.0 + uStagger) - aOrder * uStagger);
  vec3 p = mix(a, f, fl);

  // 3. Return: everything streams back into the home word.
  float rt = easeS(uReturn * 1.5 - r4 * 0.5);
  p = mix(p, aHome, rt);

  // 4. Idle breath and pointer push (never during flight, never in reduced motion).
  float calm = (1.0 - fl) * uMotion;
  p.xy += vec2(sin(uTime * 0.7 + aSeed), cos(uTime * 0.9 + aSeed * 1.3)) * 0.9 * calm;
  vec2 md = p.xy - uPointer;
  float pd = length(md);
  float fall = 1.0 - smoothstep(0.0, uPointerRadius, pd);
  p.xy += normalize(md + 1e-4) * fall * fall * uPointerStrength * calm;
  p.z += fall * fall * uPointerStrength * 0.8 * calm;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float depth = uCameraZ / max(48.0, -mv.z);
  gl_PointSize = clamp(aSize * uDpr * depth * (1.0 + lift * 0.25), 0.6, 3.2);

  // Brightness: base + twinkle on 3% + boost while thrown.
  float tw = step(0.97, r5) * uMotion;
  float bright = aBrightness * mix(1.0, 0.45 + 0.55 * sin(uTime * 3.0 + aSeed * 7.0), tw);
  bright *= 1.0 + lift * 0.35;
  bright *= mix(0.8, 1.1, clamp(0.5 + p.z * 0.006, 0.0, 1.0));

  float alpha = mix(0.35, 1.0, aBrightness);
  // Trail: dotted, appears once the plane has passed, dims with age.
  float emitted = step(aTrail, uFlight);
  float dash = step(0.5, fract(aTrail * 36.0));
  float age = clamp(uFlight - aTrail, 0.0, 1.0);
  float trailA = emitted * dash * max(0.3, 1.0 - age * 0.8) * 0.75;
  float inFlight = fl * (1.0 - rt);
  alpha *= mix(1.0, trailA, inFlight * (1.0 - isPlane));
  // Trail fades slightly when it crosses the globe disc.
  float gd = 1.0 - smoothstep(uGlobe.z * 0.85, uGlobe.z, length(p.xy - uGlobe.xy));
  alpha *= 1.0 - 0.2 * gd * inFlight * (1.0 - isPlane);

  vBright = bright;
  vAlpha = alpha;
}
`;

const FRAG = /* glsl */ `
uniform vec3 uColor;
varying float vAlpha;
varying float vBright;
void main() {
  vec2 p = gl_PointCoord - 0.5;
  float d = length(p);
  float alpha = (1.0 - smoothstep(0.36, 0.52, d)) * vAlpha * vBright;
  if (alpha < 0.03) discard;
  gl_FragColor = vec4(uColor * vBright, alpha);
}
`;

function getPerformanceTier() {
  const mobile = window.matchMedia("(max-width: 768px)").matches;
  const cores = navigator.hardwareConcurrency || 4;
  const memory = Number((navigator as Navigator & { deviceMemory?: number }).deviceMemory || 4);
  const wide = window.innerWidth >= 1440;
  if (mobile) {
    const count = cores >= 6 ? CFG.counts.mobileMax : CFG.counts.mobileMin;
    return { count, mobile: true, pointer: 0, planeScale: 0.6 };
  }
  if (cores >= 8 && memory >= 8 && wide)
    return { count: CFG.counts.veryHigh, mobile: false, pointer: 1, planeScale: 1 };
  if (cores >= 8) return { count: CFG.counts.high, mobile: false, pointer: 1, planeScale: 1 };
  if (cores >= 4 && memory >= 4)
    return { count: CFG.counts.medium, mobile: false, pointer: 1, planeScale: 0.95 };
  return { count: CFG.counts.low, mobile: false, pointer: 0.6, planeScale: 0.9 };
}

function hash01(n: number) {
  const s = Math.sin(n * 127.1) * 43758.5453;
  return s - Math.floor(s);
}

function easeInOutSine(x: number) {
  return -(Math.cos(Math.PI * Math.min(1, Math.max(0, x))) - 1) / 2;
}

type Sample = { xy: Float32Array; count: number; width: number; height: number };

/** Turn opaque pixels of a canvas into exactly `target` points, sorted by x, relative to (originX, originY), y up. */
function samplePixels(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  originX: number,
  originY: number,
  target: number,
  salt: number,
): Float32Array | null {
  const scale = CFG.rasterScale;
  const data = ctx.getImageData(0, 0, width, height).data;
  const raw: number[] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] < CFG.alphaThreshold) continue;
      raw.push(x, y);
    }
  }
  const available = raw.length / 2;
  if (available < 80) return null;

  const keep = Math.min(1, target / available);
  const picked: number[] = [];
  for (let i = 0; i < available && picked.length / 2 < target; i++) {
    if (hash01(i * 1.17 + salt) > keep) continue;
    picked.push(raw[i * 2], raw[i * 2 + 1]);
  }
  while (picked.length / 2 < target) {
    const i = picked.length / 2;
    const src = Math.floor(hash01(i * 3.31 + 4.7 + salt) * available) % available;
    picked.push(
      raw[src * 2] + (hash01(i + 2.2) - 0.5) * 0.7,
      raw[src * 2 + 1] + (hash01(i + 8.1) - 0.5) * 0.7,
    );
  }

  const order = Array.from({ length: target }, (_, i) => i).sort(
    (a, b) => picked[a * 2] - picked[b * 2],
  );
  const xy = new Float32Array(target * 2);
  for (let i = 0; i < target; i++) {
    const src = order[i];
    xy[i * 2] = (picked[src * 2] - originX) / scale;
    xy[i * 2 + 1] = (originY - picked[src * 2 + 1]) / scale;
  }
  return xy;
}

/** Sample a word. Origin is the CSS text origin (start x, alphabetic baseline). */
function sampleText(
  text: string,
  displayPx: number,
  family: string,
  weight: string,
  target: number,
): Sample | null {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx || !text) return null;
  const scale = CFG.rasterScale;
  const fontPx = displayPx * scale;
  const font = `${weight} ${fontPx}px ${family}`;
  ctx.font = font;
  const full = ctx.measureText(text);
  const left = Math.max(0, full.actualBoundingBoxLeft || 0);
  const right = Math.max(1, full.actualBoundingBoxRight || full.width);
  const ascent = Math.max(1, full.actualBoundingBoxAscent || fontPx * 0.8);
  const descent = Math.max(0, full.actualBoundingBoxDescent || fontPx * 0.2);
  const pad = 12;
  const width = Math.ceil(left + right + pad * 2);
  const height = Math.ceil(ascent + descent + pad * 2);
  canvas.width = width;
  canvas.height = height;
  ctx.font = font;
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#fff";
  const originX = pad + left;
  const originY = pad + ascent;
  ctx.fillText(text, originX, originY);
  const xy = samplePixels(ctx, width, height, originX, originY, target, text.length * 9.1);
  if (!xy) return null;
  return { xy, count: target, width: full.width / scale, height: (ascent + descent) / scale };
}

/** Sample the paper plane, nose pointing +x, centred on its own middle. */
function samplePlane(sizePx: number, target: number): Sample | null {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  const scale = CFG.rasterScale;
  const box = Math.ceil(sizePx * scale * 1.5);
  canvas.width = box;
  canvas.height = box;
  const k = (sizePx * scale) / 24;
  ctx.translate(box / 2, box / 2);
  ctx.rotate(Math.PI / 4);
  ctx.scale(k, k);
  ctx.translate(-12, -12);
  ctx.fillStyle = "#fff";
  ctx.fill(new Path2D(PLANE_BODY));
  ctx.globalCompositeOperation = "destination-out";
  ctx.lineWidth = 1.1;
  ctx.lineCap = "round";
  ctx.stroke(new Path2D(PLANE_FOLD));
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const xy = samplePixels(ctx, box, box, box / 2, box / 2, target, 77.7);
  if (!xy) return null;
  return { xy, count: target, width: sizePx, height: sizePx };
}

function measureWidth(text: string, displayPx: number, family: string, weight: string) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return displayPx * text.length * 0.6;
  ctx.font = `${weight} ${displayPx}px ${family}`;
  return ctx.measureText(text).width;
}

function fontBox(displayPx: number, family: string, weight: string) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return { ascent: displayPx * 0.97, descent: displayPx * 0.24 };
  ctx.font = `${weight} ${displayPx}px ${family}`;
  const m = ctx.measureText("Hg") as TextMetrics & {
    fontBoundingBoxAscent?: number;
    fontBoundingBoxDescent?: number;
  };
  return {
    ascent: m.fontBoundingBoxAscent || displayPx * 0.97,
    descent: m.fontBoundingBoxDescent || displayPx * 0.24,
  };
}

type Phase = "breathe" | "morph" | "hold" | "form" | "fly" | "back";

export function ParticleWhere({
  text,
  cities,
  reducedMotion,
}: {
  text: string;
  cities: readonly string[];
  reducedMotion: boolean;
}) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const stageRef = useRef<HTMLSpanElement>(null);
  const [fallback, setFallback] = useState(false);
  const [host, setHost] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setHost(document.getElementById(HERO_FX_HOST_ID));
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    const measure = measureRef.current;
    const stage = stageRef.current;
    if (!wrap || !measure || !stage) return;

    let disposed = false;
    let raf = 0;
    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let points: THREE.Points | null = null;
    let geometry: THREE.BufferGeometry | null = null;
    let material: THREE.ShaderMaterial | null = null;
    let fromAttr: THREE.BufferAttribute | null = null;
    let toAttr: THREE.BufferAttribute | null = null;
    let visible = true;
    let last = 0;
    let lastW = 0;
    let lastH = 0;
    let resizeTimer = 0;
    let reduce = reducedMotion;
    let dirty = true;
    const tier = getPerformanceTier();

    // Shapes (all in points-local px, origin = text origin / baseline).
    let home: Float32Array | null = null;
    let cityShapes: Float32Array[] = [];
    let whereWidth = 0;
    let whereHeight = 0;

    // Timeline.
    let phase: Phase = "breathe";
    let phaseT = 0;
    let cityIndex = 0;
    const flyDuration = tier.mobile ? CFG.timing.flyMobile : CFG.timing.fly;

    const pointerTarget = new THREE.Vector2(99999, 99999);
    const pointerNow = new THREE.Vector2(99999, 99999);

    const setPair = (from: Float32Array, to: Float32Array) => {
      if (!fromAttr || !toAttr) return;
      const f = fromAttr.array as Float32Array;
      const t = toAttr.array as Float32Array;
      const n = fromAttr.count;
      for (let i = 0; i < n; i++) {
        f[i * 3] = from[i * 2];
        f[i * 3 + 1] = from[i * 2 + 1];
        f[i * 3 + 2] = 0;
        t[i * 3] = to[i * 2];
        t[i * 3 + 1] = to[i * 2 + 1];
        t[i * 3 + 2] = 0;
      }
      fromAttr.needsUpdate = true;
      toAttr.needsUpdate = true;
    };

    const resetTimeline = () => {
      phase = "breathe";
      phaseT = 0;
      cityIndex = 0;
      if (home) setPair(home, home);
      if (material) {
        material.uniforms.uMorph.value = 0;
        material.uniforms.uFlightOn.value = 0;
        material.uniforms.uFlight.value = 0;
        material.uniforms.uReturn.value = 0;
      }
      dirty = true;
    };

    const layout = () => {
      if (!renderer || !camera || !material) return;
      const w = Math.max(1, stage.clientWidth);
      const h = Math.max(1, stage.clientHeight);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      const dist = (h * 0.5) / Math.tan((CFG.fov * Math.PI) / 360);
      camera.position.set(0, 0, dist);
      camera.updateProjectionMatrix();
      material.uniforms.uCameraZ.value = dist;
      material.uniforms.uDpr.value = Math.min(window.devicePixelRatio || 1, CFG.dprMax);

      const cs = getComputedStyle(measure);
      const displayPx = parseFloat(cs.fontSize) || 72;
      const fb = fontBox(displayPx, cs.fontFamily, cs.fontWeight);
      const mBox = measure.getBoundingClientRect();
      const sBox = stage.getBoundingClientRect();
      const baselineFromTop = (mBox.height - (fb.ascent + fb.descent)) / 2 + fb.ascent;
      const ox = mBox.left - sBox.left - w * 0.5;
      const oy = h * 0.5 - (mBox.top + baselineFromTop - sBox.top);
      points?.position.set(ox, oy, 0);

      // Flight path in stage-centred px, then shifted into points-local space.
      // Take off from the middle of the word, climb gently over the globe, leave top-right.
      const p0 = new THREE.Vector3(ox + whereWidth * 0.5, oy + whereHeight * 0.32, 0);
      const p1 = tier.mobile
        ? new THREE.Vector3(p0.x + w * 0.3, p0.y + h * 0.12, 0)
        : new THREE.Vector3(p0.x + w * 0.2, p0.y + h * 0.03, 0);
      const p2 = tier.mobile
        ? new THREE.Vector3(w * 0.1, h * 0.36, 0)
        : new THREE.Vector3(w * 0.2, h * 0.14, 0);
      const p3 = tier.mobile
        ? new THREE.Vector3(w * 0.68, h * 0.78, 0)
        : new THREE.Vector3(w * 0.62, h * 0.7, 0);
      const shift = new THREE.Vector3(ox, oy, 0);
      material.uniforms.uP0.value.copy(p0.sub(shift));
      material.uniforms.uP1.value.copy(p1.sub(shift));
      material.uniforms.uP2.value.copy(p2.sub(shift));
      material.uniforms.uP3.value.copy(p3.sub(shift));
      // Rough globe disc (right side of the fold) used only to dim the trail a touch.
      material.uniforms.uGlobe.value.set(w * 0.26 - ox, 0 - oy, tier.mobile ? h * 0.3 : h * 0.42);
      dirty = true;
    };

    const build = (force: boolean) => {
      const mw = measure.offsetWidth;
      const mh = measure.offsetHeight;
      if (!force && Math.abs(mw - lastW) < 1 && Math.abs(mh - lastH) < 1 && points) {
        layout();
        return;
      }
      lastW = mw;
      lastH = mh;
      const cs = getComputedStyle(measure);
      const displayPx = parseFloat(cs.fontSize) || 72;
      const family = cs.fontFamily;
      const weight = cs.fontWeight;
      const count = tier.count;

      const where = sampleText(text, displayPx, family, weight, count);
      if (!where) {
        setFallback(true);
        return;
      }
      home = where.xy;
      whereWidth = where.width;
      whereHeight = where.height;

      cityShapes = [];
      for (const city of cities) {
        const natural = measureWidth(city, displayPx, family, weight);
        const fit = Math.max(
          CFG.cityMinScale,
          Math.min(1, (where.width * CFG.cityFitWidth) / Math.max(1, natural)),
        );
        const s = sampleText(city, displayPx * fit, family, weight, count);
        if (s) cityShapes.push(s.xy);
      }

      const planeCount = Math.max(200, Math.round(count * CFG.planeShare));
      const plane = samplePlane(where.height * CFG.planeSizeEm, planeCount);

      if (!renderer) {
        try {
          renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: false,
            powerPreference: "high-performance",
          });
        } catch {
          setFallback(true);
          return;
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, CFG.dprMax));
        renderer.setClearColor(0x000000, 0);
        renderer.domElement.setAttribute("aria-hidden", "true");
        stage.appendChild(renderer.domElement);
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(CFG.fov, 1, 0.1, 6000);
      }

      geometry?.dispose();
      material?.dispose();
      if (points && scene) scene.remove(points);

      const homes = new Float32Array(count * 3);
      const planeLocal = new Float32Array(count * 2);
      const role = new Float32Array(count);
      const trail = new Float32Array(count);
      const order = new Float32Array(count);
      const seeds = new Float32Array(count);
      const sizes = new Float32Array(count);
      const bright = new Float32Array(count);

      // Assign plane role to a random subset; hand plane points to them in x order.
      let planeCursor = 0;
      for (let i = 0; i < count; i++) {
        homes[i * 3] = home[i * 2];
        homes[i * 3 + 1] = home[i * 2 + 1];
        order[i] = i / count;
        const seed = hash01(i * 0.173 + home[i * 2] * 0.02);
        seeds[i] = seed * 31;
        const sz = hash01(i * 0.91 + 2.4);
        sizes[i] =
          sz > 0.94
            ? 1.85 + sz * 0.3
            : CFG.pointSizeMin + sz * (CFG.pointSizeMax - CFG.pointSizeMin);
        bright[i] = 0.5 + hash01(i * 1.33 + 0.7) * 0.5;
        const isPlane =
          plane !== null && hash01(i * 4.13 + 1.9) < CFG.planeShare && planeCursor < planeCount;
        if (isPlane && plane) {
          role[i] = 1;
          planeLocal[i * 2] = plane.xy[planeCursor * 2];
          planeLocal[i * 2 + 1] = plane.xy[planeCursor * 2 + 1];
          planeCursor += 1;
        } else {
          role[i] = 0;
          trail[i] = hash01(i * 2.07 + 0.41) * 1.02;
        }
      }

      geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(homes, 3));
      geometry.setAttribute("aHome", new THREE.BufferAttribute(homes, 3));
      fromAttr = new THREE.BufferAttribute(new Float32Array(count * 3), 3);
      toAttr = new THREE.BufferAttribute(new Float32Array(count * 3), 3);
      fromAttr.setUsage(THREE.DynamicDrawUsage);
      toAttr.setUsage(THREE.DynamicDrawUsage);
      geometry.setAttribute("aFrom", fromAttr);
      geometry.setAttribute("aTo", toAttr);
      geometry.setAttribute("aPlane", new THREE.BufferAttribute(planeLocal, 2));
      geometry.setAttribute("aRole", new THREE.BufferAttribute(role, 1));
      geometry.setAttribute("aTrail", new THREE.BufferAttribute(trail, 1));
      geometry.setAttribute("aOrder", new THREE.BufferAttribute(order, 1));
      geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
      geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
      geometry.setAttribute("aBrightness", new THREE.BufferAttribute(bright, 1));
      // Keep the whole stage inside the frustum no matter where the plane is.
      geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 1e6);

      material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uMorph: { value: 0 },
          uFlightOn: { value: 0 },
          uFlight: { value: 0 },
          uReturn: { value: 0 },
          uMotion: { value: reduce ? 0 : 1 },
          uStagger: { value: CFG.stagger },
          uHalfH: { value: where.height * 0.5 },
          uCameraZ: { value: 200 },
          uDpr: { value: Math.min(window.devicePixelRatio || 1, CFG.dprMax) },
          uPointer: { value: new THREE.Vector2(99999, 99999) },
          uPointerRadius: { value: CFG.pointerRadius },
          uPointerStrength: { value: CFG.pointerStrength * tier.pointer },
          uP0: { value: new THREE.Vector3() },
          uP1: { value: new THREE.Vector3() },
          uP2: { value: new THREE.Vector3() },
          uP3: { value: new THREE.Vector3() },
          uPlaneScale: { value: tier.planeScale },
          uGlobe: { value: new THREE.Vector3(0, 0, 1) },
          uColor: { value: new THREE.Color("#d4f03c") },
        },
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        depthWrite: false,
      });
      points = new THREE.Points(geometry, material);
      points.frustumCulled = false;
      scene?.add(points);
      resetTimeline();
      layout();
    };

    const advance = (dt: number) => {
      if (!material || !home) return;
      const u = material.uniforms;
      const T = CFG.timing;
      phaseT += dt;
      switch (phase) {
        case "breathe":
          if (phaseT >= T.breathe && cityShapes.length) {
            phase = "morph";
            phaseT = 0;
            cityIndex = 0;
            setPair(home, cityShapes[0]);
          }
          break;
        case "morph":
          u.uMorph.value = easeInOutSine(phaseT / T.morph);
          if (phaseT >= T.morph) {
            u.uMorph.value = 1;
            phase = "hold";
            phaseT = 0;
          }
          break;
        case "hold":
          if (phaseT >= T.hold) {
            phaseT = 0;
            const current = cityShapes[cityIndex];
            if (cityIndex + 1 < cityShapes.length) {
              cityIndex += 1;
              setPair(current, cityShapes[cityIndex]);
              u.uMorph.value = 0;
              phase = "morph";
            } else {
              setPair(current, current);
              u.uMorph.value = 0;
              u.uFlight.value = 0;
              phase = "form";
            }
          }
          break;
        case "form":
          u.uFlightOn.value = Math.min(1, phaseT / T.form);
          if (phaseT >= T.form) {
            u.uFlightOn.value = 1;
            phase = "fly";
            phaseT = 0;
          }
          break;
        case "fly":
          u.uFlight.value = easeInOutSine(phaseT / flyDuration);
          if (phaseT >= flyDuration) {
            u.uFlight.value = 1;
            phase = "back";
            phaseT = 0;
          }
          break;
        case "back":
          u.uReturn.value = Math.min(1, phaseT / T.back);
          if (phaseT >= T.back) resetTimeline();
          break;
      }
    };

    const tick = (ts: number) => {
      if (disposed) return;
      raf = requestAnimationFrame(tick);
      if (!renderer || !scene || !camera || !material) return;
      if (!visible || document.visibilityState === "hidden") {
        last = 0;
        return;
      }
      if (!last) last = ts;
      const dt = Math.min(0.05, (ts - last) / 1000);
      last = ts;

      if (reduce) {
        material.uniforms.uMotion.value = 0;
        if (!dirty) return;
        dirty = false;
        renderer.render(scene, camera);
        return;
      }
      material.uniforms.uMotion.value = 1;
      material.uniforms.uTime.value += dt;
      advance(dt);
      pointerNow.lerp(pointerTarget, 0.18);
      material.uniforms.uPointer.value.copy(pointerNow);
      renderer.render(scene, camera);
    };

    const onMove = (event: PointerEvent) => {
      if (!points || !tier.pointer || reduce) return;
      const rect = stage.getBoundingClientRect();
      pointerTarget.set(
        event.clientX - rect.left - rect.width * 0.5 - points.position.x,
        rect.height * 0.5 - (event.clientY - rect.top) - points.position.y,
      );
    };
    const onLeave = () => pointerTarget.set(99999, 99999);

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onReduce = () => {
      reduce = media.matches || reducedMotion;
      if (reduce) resetTimeline();
      dirty = true;
    };
    media.addEventListener("change", onReduce);

    const io = new IntersectionObserver(
      (entries) => {
        const next = entries.some((entry) => entry.isIntersecting);
        if (next && !visible) resetTimeline();
        visible = next;
      },
      { threshold: 0.04 },
    );
    io.observe(stage);

    let ro: ResizeObserver | null = null;
    void document.fonts.ready.then(() => {
      if (disposed) return;
      build(true);
      raf = requestAnimationFrame(tick);
      ro = new ResizeObserver(() => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => build(false), CFG.resizeDebounceMs);
      });
      ro.observe(measure);
      ro.observe(stage);
    });

    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", onLeave);
    const onVis = () => {
      if (document.visibilityState === "hidden") last = 0;
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      ro?.disconnect();
      io.disconnect();
      media.removeEventListener("change", onReduce);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
      geometry?.dispose();
      material?.dispose();
      renderer?.dispose();
      renderer?.domElement.remove();
    };
  }, [text, cities, reducedMotion, host]);

  const stage = (
    <span ref={stageRef} className={host ? "hero-fx-stage" : "hero-ask-stage"} aria-hidden="true" />
  );

  return (
    <span ref={wrapRef} className="hero-ask-where" aria-label={text}>
      <span
        ref={measureRef}
        className={`hero-ask-measure${fallback ? " is-fallback" : ""}`}
        aria-hidden="true"
      >
        {text}
      </span>
      {host ? createPortal(stage, host) : stage}
    </span>
  );
}
