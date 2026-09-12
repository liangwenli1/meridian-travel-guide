import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import * as THREE from "three";

/**
 * Particle headline.
 *
 * One loop (~30s), never quite the same twice:
 *   breathe → "Where" lifts above its slot and grows (extra particles light up)
 *   → four city names, each morph using a different method (sweep / burst /
 *   vortex / rain, rotated every loop) → the particles stream down to the
 *   bottom-left corner and fold into a small paper plane → the plane flies a
 *   thin dotted route: climb to the centre, one loop, out over the globe
 *   → everything streams back and re-forms "Where" in its slot.
 *
 * The canvas is portaled into `#hero-fx` (full fold, above the globe, below the
 * copy). Without that host it falls back to a local stage around the word.
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
  spareShare: 0.4,
  planeShare: 0.08,
  trailShare: 0.2,
  planeWingspanPx: 56,
  planeWingspanMobilePx: 40,
  stageScale: 1.35,
  stageRiseEm: 1.0,
  stageHeaderPx: 72,
  stageMarginPx: 16,
  cityFitWidth: 1.04,
  cityMinScale: 0.5,
  stagger: 0.9,
  pointerRadius: 140,
  pointerStrength: 14,
  timing: {
    breathe: 3.0,
    rise: 2.2,
    morph: 2.0,
    hold: 2.4,
    gather: 1.4,
    fly: 5.0,
    flyMobile: 3.5,
    back: 1.8,
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

const MODE = { sweep: 0, burst: 1, vortex: 2, rain: 3, rise: 4 } as const;
const METHODS = [MODE.sweep, MODE.burst, MODE.vortex, MODE.rain];

// Side-view paper plane in a 100 x 64 box, nose at (100, 30). Two faces with a fold gap.
const PLANE_WING = [
  [2, 2],
  [100, 30],
  [28, 38],
];
const PLANE_KEEL = [
  [30, 42],
  [100, 30],
  [44, 64],
];
const PLANE_BOX = { w: 100, h: 64, cx: 50, cy: 32 };

const VERT = /* glsl */ `
uniform float uTime;
uniform float uMorph;
uniform float uMode;
uniform float uDir;
uniform float uStagger;
uniform float uSpare;
uniform float uGather;
uniform float uFlightOn;
uniform float uFlight;
uniform float uReturn;
uniform float uMotion;
uniform float uHalfW;
uniform float uHalfH;
uniform float uStageY;
uniform float uFromY;
uniform float uToY;
uniform float uCameraZ;
uniform float uDpr;
uniform vec2 uPointer;
uniform float uPointerRadius;
uniform float uPointerStrength;
uniform vec3 uS0;
uniform vec3 uS1;
uniform vec3 uS2;
uniform vec3 uS3;
uniform vec3 uE0;
uniform vec3 uE1;
uniform vec3 uE2;
uniform vec3 uE3;
uniform vec2 uLoopC;
uniform float uLoopR;
uniform float uLoopDir;
uniform vec3 uGlobe;
attribute vec3 aHome;
attribute vec3 aFrom;
attribute vec3 aTo;
attribute vec2 aPlane;
attribute float aShade;
attribute float aRole;
attribute float aTrail;
attribute float aOrder;
attribute float aSeed;
attribute float aSize;
attribute float aBrightness;
attribute float aSpare;
varying float vAlpha;
varying float vBright;

const float PI = 3.14159265;
const float SEG1 = 0.38;
const float SEG2 = 0.68;

float cubicInOut(float x) {
  x = clamp(x, 0.0, 1.0);
  return x < 0.5 ? 4.0 * x * x * x : 1.0 - pow(-2.0 * x + 2.0, 3.0) * 0.5;
}
vec3 bez(vec3 p0, vec3 p1, vec3 p2, vec3 p3, float t) {
  float u = 1.0 - t;
  return u * u * u * p0 + 3.0 * u * u * t * p1 + 3.0 * u * t * t * p2 + t * t * t * p3;
}
vec3 pathAt(float s) {
  s = clamp(s, 0.0, 1.0);
  vec3 p;
  if (s < SEG1) {
    p = bez(uS0, uS1, uS2, uS3, s / SEG1);
  } else if (s < SEG2) {
    float u = (s - SEG1) / (SEG2 - SEG1);
    float th = -0.5 * PI * uLoopDir + uLoopDir * 2.0 * PI * u;
    p = vec3(uLoopC + uLoopR * vec2(cos(th), sin(th)), 0.0);
  } else {
    p = bez(uE0, uE1, uE2, uE3, (s - SEG2) / (1.0 - SEG2));
  }
  p.z += sin(s * PI) * 40.0;
  return p;
}

void main() {
  float r1 = fract(aSeed * 0.37);
  float r2 = fract(aSeed * 0.61);
  float r3 = fract(aSeed * 0.83);
  float r4 = fract(aSeed * 0.29);
  float r5 = fract(aSeed * 0.53);

  // 1. Shape-to-shape morph. Departure order and mid-path drift depend on the method.
  float key = aOrder;
  if (uMode == 0.0) key = uDir > 0.0 ? aOrder : 1.0 - aOrder;
  else if (uMode == 1.0) key = r1;
  else if (uMode == 2.0) key = r2;
  else if (uMode == 3.0) key = 1.0 - clamp((aFrom.y - uFromY) / (uHalfH * 1.5) * 0.5 + 0.5, 0.0, 1.0);
  else key = r3 * 0.5;
  float dur = 0.8 + 0.4 * r4;
  float m = cubicInOut((uMorph * (1.0 + uStagger) - key * uStagger) / dur);
  float w = sin(m * PI);
  vec3 a = mix(aFrom, aTo, m);
  if (uMode == 0.0) {
    a += vec3(sin(aSeed + uTime * 1.3) * 6.0, (r1 - 0.5) * 80.0, 30.0 + r2 * 40.0) * w;
  } else if (uMode == 1.0) {
    float ang = r1 * 6.2831853;
    float rad = uHalfW * (0.5 + 0.7 * r2);
    a += vec3(cos(ang), sin(ang) * 0.6, 0.0) * rad * w;
    a += vec3(sin(uTime * 0.8 + aSeed), cos(uTime * 0.7 + aSeed * 1.7), 0.0) * 14.0 * w;
    a.z += 50.0 * w * r3;
  } else if (uMode == 2.0) {
    vec2 c = vec2(0.0, mix(uFromY, uToY, m));
    vec2 d = a.xy - c;
    float ang = w * PI * (0.6 + 0.6 * r1) * uDir;
    float cs = cos(ang);
    float sn = sin(ang);
    a.xy = c + vec2(cs * d.x - sn * d.y, sn * d.x + cs * d.y) * (1.0 + 0.35 * w);
    a.z += 40.0 * w;
  } else if (uMode == 3.0) {
    a += vec3(sin(aSeed + uTime) * 8.0, -uHalfH * (1.6 + r1 * 1.2), 20.0 * r2) * w;
  }

  // 2. Flight along the dotted route.
  float isPlane = step(0.5, aRole);
  float s = mix(aTrail, uFlight, isPlane);
  vec3 fp = pathAt(s);
  vec3 d = pathAt(min(1.0, s + 0.004)) - pathAt(max(0.0, s - 0.004));
  vec2 dn = normalize(d.xy + vec2(1e-5, 0.0));
  vec2 rp = vec2(dn.x * aPlane.x - dn.y * aPlane.y, dn.y * aPlane.x + dn.x * aPlane.y);
  vec3 f = fp + vec3(rp, 0.0) * isPlane;
  f.xy += vec2(-dn.y, dn.x) * (r3 - 0.5) * 3.0 * (1.0 - isPlane);

  vec3 p = mix(a, f, uFlightOn);

  // 3. Return: stream back into the home word, staggered.
  float rt = cubicInOut(uReturn * 1.6 - r4 * 0.6);
  p = mix(p, aHome, rt);

  // 4. Idle breath and pointer push (not in flight, not in reduced motion).
  float calm = (1.0 - uFlightOn) * uMotion;
  p.xy += vec2(sin(uTime * 0.7 + aSeed), cos(uTime * 0.9 + aSeed * 1.3)) * 0.9 * calm;
  vec2 md = p.xy - uPointer;
  float fall = 1.0 - smoothstep(0.0, uPointerRadius, length(md));
  p.xy += normalize(md + 1e-4) * fall * fall * uPointerStrength * calm;
  p.z += fall * fall * uPointerStrength * 0.8 * calm;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float depth = uCameraZ / max(48.0, -mv.z);
  gl_PointSize = clamp(aSize * uDpr * depth * (1.0 + w * 0.2), 0.6, 3.2);

  // Brightness: base, 3% twinkle, lift while travelling, keel shading on the plane.
  float tw = step(0.97, r5) * uMotion;
  float bright = aBrightness * mix(1.0, 0.45 + 0.55 * sin(uTime * 3.0 + aSeed * 7.0), tw);
  bright *= 1.0 + w * 0.3;
  bright *= mix(0.85, 1.1, clamp(0.5 + p.z * 0.006, 0.0, 1.0));
  bright *= mix(1.0, aShade, isPlane * uFlightOn);

  float alpha = mix(0.35, 1.0, aBrightness);
  // Spare particles only exist on the stage (they make the word grow).
  float spare = cubicInOut(uSpare * 1.5 - r5 * 0.5);
  alpha *= mix(1.0, spare, aSpare);
  // Non-plane particles fade while gathering; the trail is drawn as the plane passes.
  float isTrail = step(0.5, aRole + 0.5) * (1.0 - isPlane) * step(0.0, aTrail);
  float emitted = step(aTrail, uFlight) * uFlightOn;
  float dash = step(0.55, fract(aTrail * 90.0));
  float age = clamp(uFlight - aTrail, 0.0, 1.0);
  float trailA = emitted * dash * max(0.35, 1.0 - age * 0.7) * 0.45;
  float hidden = uGather * (1.0 - rt);
  float nonPlaneA = mix(1.0 - hidden, max(1.0 - hidden, trailA), isTrail);
  alpha *= mix(nonPlaneA, 1.0, isPlane);
  // The route dims a touch where it crosses the globe disc.
  float gd = 1.0 - smoothstep(uGlobe.z * 0.85, uGlobe.z, length(p.xy - uGlobe.xy));
  alpha *= 1.0 - 0.2 * gd * uFlightOn * (1.0 - rt) * (1.0 - isPlane);

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
    return { count, mobile: true, pointer: 0 };
  }
  if (cores >= 8 && memory >= 8 && wide)
    return { count: CFG.counts.veryHigh, mobile: false, pointer: 1 };
  if (cores >= 8) return { count: CFG.counts.high, mobile: false, pointer: 1 };
  if (cores >= 4 && memory >= 4) return { count: CFG.counts.medium, mobile: false, pointer: 1 };
  return { count: CFG.counts.low, mobile: false, pointer: 0.6 };
}

function hash01(n: number) {
  const s = Math.sin(n * 127.1) * 43758.5453;
  return s - Math.floor(s);
}

function easeInOutSine(x: number) {
  return -(Math.cos(Math.PI * Math.min(1, Math.max(0, x))) - 1) / 2;
}

function cubicInOut(x: number) {
  const t = Math.min(1, Math.max(0, x));
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

type Sample = { xy: Float32Array; count: number; width: number; height: number };

/** Opaque pixels → exactly `target` points, sorted by x, centred on (originX, originY), y up, CSS px. */
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

/** Sample a word centred on its ink box. Also returns the ink centre relative to the CSS text origin. */
function sampleText(
  text: string,
  displayPx: number,
  family: string,
  weight: string,
  target: number,
): (Sample & { inkDx: number; inkDy: number }) | null {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx || !text) return null;
  const scale = CFG.rasterScale;
  const fontPx = displayPx * scale;
  const font = `${weight} ${fontPx}px ${family}`;
  ctx.font = font;
  const full = ctx.measureText(text);
  const left = full.actualBoundingBoxLeft || 0;
  const right = Math.max(1, full.actualBoundingBoxRight || full.width);
  const ascent = Math.max(1, full.actualBoundingBoxAscent || fontPx * 0.8);
  const descent = Math.max(0, full.actualBoundingBoxDescent || fontPx * 0.2);
  const pad = 12;
  const width = Math.ceil(Math.max(0, left) + right + pad * 2);
  const height = Math.ceil(ascent + descent + pad * 2);
  canvas.width = width;
  canvas.height = height;
  ctx.font = font;
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#fff";
  const textX = pad + Math.max(0, left);
  const textY = pad + ascent;
  ctx.fillText(text, textX, textY);
  const inkCx = textX + (right - left) * 0.5;
  const inkCy = textY + (descent - ascent) * 0.5;
  const xy = samplePixels(ctx, width, height, inkCx, inkCy, target, text.length * 9.1);
  if (!xy) return null;
  return {
    xy,
    count: target,
    width: (left + right) / scale,
    height: (ascent + descent) / scale,
    inkDx: (inkCx - textX) / scale,
    inkDy: (inkCy - textY) / scale,
  };
}

/** Side-view paper plane, nose pointing +x, centred. Returns points and a per-point shade (keel darker). */
function samplePlane(
  wingspanPx: number,
  target: number,
): (Sample & { shade: Float32Array }) | null {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  const scale = CFG.rasterScale;
  const k = (wingspanPx * scale) / PLANE_BOX.w;
  const pad = 4 * scale;
  const width = Math.ceil(PLANE_BOX.w * k + pad * 2);
  const height = Math.ceil(PLANE_BOX.h * k + pad * 2);
  canvas.width = width;
  canvas.height = height;
  ctx.fillStyle = "#fff";
  for (const poly of [PLANE_WING, PLANE_KEEL]) {
    ctx.beginPath();
    poly.forEach(([x, y], i) =>
      i ? ctx.lineTo(pad + x * k, pad + y * k) : ctx.moveTo(pad + x * k, pad + y * k),
    );
    ctx.closePath();
    ctx.fill();
  }
  const xy = samplePixels(
    ctx,
    width,
    height,
    pad + PLANE_BOX.cx * k,
    pad + PLANE_BOX.cy * k,
    target,
    77.7,
  );
  if (!xy) return null;
  const shade = new Float32Array(target);
  const unit = wingspanPx / PLANE_BOX.w;
  for (let i = 0; i < target; i++) {
    const sx = xy[i * 2] / unit + PLANE_BOX.cx;
    const sy = PLANE_BOX.cy - xy[i * 2 + 1] / unit;
    const fold = 40 - ((sx - 30) * 10) / 70;
    shade[i] = sy > fold + 1 ? 0.6 : 1;
  }
  return {
    xy,
    count: target,
    width: wingspanPx,
    height: (PLANE_BOX.h / PLANE_BOX.w) * wingspanPx,
    shade,
  };
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

type Phase = "breathe" | "rise" | "morph" | "hold" | "gather" | "fly" | "back";

type Route = {
  s: THREE.Vector3[];
  e: THREE.Vector3[];
  loopC: THREE.Vector2;
  loopR: number;
  loopDir: number;
};

const SEG1 = 0.38;
const SEG2 = 0.68;

function bezierAt(p: THREE.Vector3[], t: number, out: THREE.Vector3) {
  const u = 1 - t;
  return out
    .copy(p[0])
    .multiplyScalar(u * u * u)
    .addScaledVector(p[1], 3 * u * u * t)
    .addScaledVector(p[2], 3 * u * t * t)
    .addScaledVector(p[3], t * t * t);
}

function routeAt(route: Route, s: number, out: THREE.Vector3) {
  const c = Math.min(1, Math.max(0, s));
  if (c < SEG1) bezierAt(route.s, c / SEG1, out);
  else if (c < SEG2) {
    const u = (c - SEG1) / (SEG2 - SEG1);
    const th = -0.5 * Math.PI * route.loopDir + route.loopDir * 2 * Math.PI * u;
    out.set(
      route.loopC.x + route.loopR * Math.cos(th),
      route.loopC.y + route.loopR * Math.sin(th),
      0,
    );
  } else bezierAt(route.e, (c - SEG2) / (1 - SEG2), out);
  out.z += Math.sin(c * Math.PI) * 40;
  return out;
}

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

    // Shapes, all centred on their own ink box, in CSS px at home scale.
    let home: Float32Array | null = null;
    let cityShapes: Float32Array[] = [];
    let planeLocal: Float32Array | null = null;
    let roles: Float32Array | null = null;
    let whereW = 0;
    let whereH = 0;
    let stageY = 0;
    let stageScale = CFG.stageScale;
    let inkDx = 0;
    let inkDy = 0;
    const route: Route = {
      s: [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()],
      e: [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()],
      loopC: new THREE.Vector2(),
      loopR: 100,
      loopDir: 1,
    };

    // Timeline.
    let phase: Phase = "breathe";
    let phaseT = 0;
    let cityIndex = 0;
    let loop = 0;
    const flyDuration = tier.mobile ? CFG.timing.flyMobile : CFG.timing.fly;

    const pointerTarget = new THREE.Vector2(99999, 99999);
    const pointerNow = new THREE.Vector2(99999, 99999);
    const tmp = new THREE.Vector3();
    const tmp2 = new THREE.Vector3();

    const packInto = (attr: THREE.BufferAttribute, xy: Float32Array, scale: number, dy: number) => {
      const arr = attr.array as Float32Array;
      const n = attr.count;
      for (let i = 0; i < n; i++) {
        arr[i * 3] = xy[i * 2] * scale;
        arr[i * 3 + 1] = xy[i * 2 + 1] * scale + dy;
        arr[i * 3 + 2] = 0;
      }
      attr.needsUpdate = true;
    };
    const packRaw = (attr: THREE.BufferAttribute, xyz: Float32Array) => {
      (attr.array as Float32Array).set(xyz);
      attr.needsUpdate = true;
    };

    /** Where the plane (and everything else) sits at take-off: the route start, already rotated to its heading. */
    const planeFormation = () => {
      if (!planeLocal || !roles) return null;
      const n = roles.length;
      const out = new Float32Array(n * 3);
      routeAt(route, 0, tmp);
      routeAt(route, 0.004, tmp2);
      const dx = tmp2.x - tmp.x;
      const dy = tmp2.y - tmp.y;
      const len = Math.hypot(dx, dy) || 1;
      const cs = dx / len;
      const sn = dy / len;
      for (let i = 0; i < n; i++) {
        if (roles[i] > 0.5) {
          const px = planeLocal[i * 2];
          const py = planeLocal[i * 2 + 1];
          out[i * 3] = tmp.x + cs * px - sn * py;
          out[i * 3 + 1] = tmp.y + sn * px + cs * py;
        } else {
          out[i * 3] = tmp.x + (hash01(i * 0.77 + 1.1) - 0.5) * 36;
          out[i * 3 + 1] = tmp.y + (hash01(i * 0.91 + 2.3) - 0.5) * 36;
        }
        out[i * 3 + 2] = 0;
      }
      return out;
    };

    const setUniform = (name: string, value: number) => {
      if (material) material.uniforms[name].value = value;
    };

    const resetTimeline = () => {
      phase = "breathe";
      phaseT = 0;
      cityIndex = 0;
      if (home && fromAttr && toAttr) {
        packInto(fromAttr, home, 1, 0);
        packInto(toAttr, home, 1, 0);
      }
      setUniform("uMorph", 0);
      setUniform("uMode", MODE.rise);
      setUniform("uSpare", 0);
      setUniform("uGather", 0);
      setUniform("uFlightOn", 0);
      setUniform("uFlight", 0);
      setUniform("uReturn", 0);
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

      // Points origin = ink centre of the resting word, in stage-centred px (y up).
      const cs = getComputedStyle(measure);
      const displayPx = parseFloat(cs.fontSize) || 72;
      const fb = fontBox(displayPx, cs.fontFamily, cs.fontWeight);
      const mBox = measure.getBoundingClientRect();
      const sBox = stage.getBoundingClientRect();
      const baselineFromTop = (mBox.height - (fb.ascent + fb.descent)) / 2 + fb.ascent;
      const ox = mBox.left + inkDx - sBox.left - w * 0.5;
      const oy = h * 0.5 - (mBox.top + baselineFromTop + inkDy - sBox.top);
      points?.position.set(ox, oy, 0);

      // Stage = above the slot. Fit the lift and the growth into the headroom under the header,
      // so a 768px laptop does not push the city names into the header.
      const inkTop = mBox.top + baselineFromTop + inkDy - whereH * 0.5;
      const headroom = inkTop - (sBox.top + CFG.stageHeaderPx) - CFG.stageMarginPx;
      let scale = CFG.stageScale;
      let rise = whereH * CFG.stageRiseEm;
      const need = () => rise + (scale - 1) * whereH * 0.5;
      if (need() > headroom) rise = Math.max(whereH * 0.35, headroom - (scale - 1) * whereH * 0.5);
      if (need() > headroom) scale = Math.max(1.05, 1 + ((headroom - rise) * 2) / whereH);
      stageScale = scale;
      stageY = rise;
      material.uniforms.uStageY.value = stageY;
      material.uniforms.uHalfW.value = whereW * 0.5 * stageScale;
      material.uniforms.uHalfH.value = whereH * 0.5 * stageScale;

      // Route in stage-centred px, then shifted into points-local space.
      const m = tier.mobile;
      // Desktop: take off below the search box, stay low until past its right end, then climb.
      const start = m
        ? new THREE.Vector3(-w * 0.42, -h * 0.1, 0)
        : new THREE.Vector3(-w * 0.45, -h * 0.27, 0);
      const loopC = m ? new THREE.Vector2(0, h * 0.14) : new THREE.Vector2(w * 0.02, h * 0.16);
      const loopR = m ? Math.min(h * 0.08, 70) : Math.min(h * 0.13, 120);
      const exit = m
        ? new THREE.Vector3(w * 0.6, h * 0.62, 0)
        : new THREE.Vector3(w * 0.58, h * 0.66, 0);
      const entry = new THREE.Vector3(loopC.x, loopC.y - loopR * route.loopDir, 0);
      route.s[0].copy(start);
      route.s[1].set(start.x + (m ? w * 0.18 : w * 0.5), start.y, 0);
      route.s[2].set(entry.x - (m ? w * 0.25 : w * 0.04), entry.y - (m ? 0 : h * 0.14), 0);
      route.s[3].copy(entry);
      route.e[0].copy(entry);
      route.e[1].set(entry.x + w * 0.2, entry.y, 0);
      route.e[2].set(exit.x - w * 0.12, exit.y - h * 0.2, 0);
      route.e[3].copy(exit);
      route.loopC.copy(loopC);
      route.loopR = loopR;
      const shift = new THREE.Vector3(ox, oy, 0);
      for (const v of [...route.s, ...route.e]) v.sub(shift);
      route.loopC.sub(new THREE.Vector2(ox, oy));
      const u = material.uniforms;
      u.uS0.value.copy(route.s[0]);
      u.uS1.value.copy(route.s[1]);
      u.uS2.value.copy(route.s[2]);
      u.uS3.value.copy(route.s[3]);
      u.uE0.value.copy(route.e[0]);
      u.uE1.value.copy(route.e[1]);
      u.uE2.value.copy(route.e[2]);
      u.uE3.value.copy(route.e[3]);
      u.uLoopC.value.copy(route.loopC);
      u.uLoopR.value = route.loopR;
      u.uLoopDir.value = route.loopDir;
      // Rough globe disc (right side of the fold), only used to dim the route a touch.
      u.uGlobe.value.set(w * 0.26 - ox, 0 - oy, m ? h * 0.3 : h * 0.42);
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
      whereW = where.width;
      whereH = where.height;
      inkDx = where.inkDx;
      inkDy = where.inkDy;
      stageY = whereH * CFG.stageRiseEm;

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

      const planeCount = Math.max(300, Math.round(count * CFG.planeShare));
      const plane = samplePlane(
        tier.mobile ? CFG.planeWingspanMobilePx : CFG.planeWingspanPx,
        planeCount,
      );

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
      planeLocal = new Float32Array(count * 2);
      const shade = new Float32Array(count).fill(1);
      roles = new Float32Array(count);
      const trail = new Float32Array(count).fill(-1);
      const order = new Float32Array(count);
      const seeds = new Float32Array(count);
      const sizes = new Float32Array(count);
      const bright = new Float32Array(count);
      const spare = new Float32Array(count);

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
        spare[i] = hash01(i * 3.71 + 0.9) < CFG.spareShare ? 1 : 0;
        const pick = hash01(i * 4.13 + 1.9);
        if (plane && pick < CFG.planeShare && planeCursor < planeCount) {
          roles[i] = 1;
          planeLocal[i * 2] = plane.xy[planeCursor * 2];
          planeLocal[i * 2 + 1] = plane.xy[planeCursor * 2 + 1];
          shade[i] = plane.shade[planeCursor];
          spare[i] = 0;
          planeCursor += 1;
        } else if (pick < CFG.planeShare + CFG.trailShare) {
          roles[i] = 0;
          trail[i] = hash01(i * 2.07 + 0.41) * 1.02;
        } else {
          roles[i] = 0;
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
      geometry.setAttribute("aShade", new THREE.BufferAttribute(shade, 1));
      geometry.setAttribute("aRole", new THREE.BufferAttribute(roles, 1));
      geometry.setAttribute("aTrail", new THREE.BufferAttribute(trail, 1));
      geometry.setAttribute("aOrder", new THREE.BufferAttribute(order, 1));
      geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
      geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
      geometry.setAttribute("aBrightness", new THREE.BufferAttribute(bright, 1));
      geometry.setAttribute("aSpare", new THREE.BufferAttribute(spare, 1));
      geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 1e6);

      material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uMorph: { value: 0 },
          uMode: { value: MODE.rise },
          uDir: { value: 1 },
          uStagger: { value: CFG.stagger },
          uSpare: { value: 0 },
          uGather: { value: 0 },
          uFlightOn: { value: 0 },
          uFlight: { value: 0 },
          uReturn: { value: 0 },
          uMotion: { value: reduce ? 0 : 1 },
          uHalfW: { value: whereW * 0.5 * CFG.stageScale },
          uHalfH: { value: whereH * 0.5 * CFG.stageScale },
          uStageY: { value: stageY },
          uFromY: { value: 0 },
          uToY: { value: 0 },
          uCameraZ: { value: 200 },
          uDpr: { value: Math.min(window.devicePixelRatio || 1, CFG.dprMax) },
          uPointer: { value: new THREE.Vector2(99999, 99999) },
          uPointerRadius: { value: CFG.pointerRadius },
          uPointerStrength: { value: CFG.pointerStrength * tier.pointer },
          uS0: { value: new THREE.Vector3() },
          uS1: { value: new THREE.Vector3() },
          uS2: { value: new THREE.Vector3() },
          uS3: { value: new THREE.Vector3() },
          uE0: { value: new THREE.Vector3() },
          uE1: { value: new THREE.Vector3() },
          uE2: { value: new THREE.Vector3() },
          uE3: { value: new THREE.Vector3() },
          uLoopC: { value: new THREE.Vector2() },
          uLoopR: { value: 100 },
          uLoopDir: { value: 1 },
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

    const startMorph = (
      from: Float32Array,
      to: Float32Array,
      mode: number,
      fromScale: number,
      toScale: number,
    ) => {
      if (!fromAttr || !toAttr) return;
      packInto(fromAttr, from, fromScale, fromScale === 1 ? 0 : stageY);
      packInto(toAttr, to, toScale, toScale === 1 ? 0 : stageY);
      setUniform("uFromY", fromScale === 1 ? 0 : stageY);
      setUniform("uToY", toScale === 1 ? 0 : stageY);
      setUniform("uMorph", 0);
      setUniform("uMode", mode);
      phase = "morph";
      phaseT = 0;
    };

    const advance = (dt: number) => {
      if (!material || !home) return;
      const u = material.uniforms;
      const T = CFG.timing;
      const S = stageScale;
      phaseT += dt;
      switch (phase) {
        case "breathe":
          if (phaseT >= T.breathe && cityShapes.length) {
            // Lift straight out of the slot into the first city: no second "Where" on the stage.
            cityIndex = 0;
            startMorph(home, cityShapes[0], METHODS[loop % METHODS.length], 1, S);
            phase = "rise";
          }
          break;
        case "rise": {
          const k = Math.min(1, phaseT / T.rise);
          u.uMorph.value = k;
          u.uSpare.value = k;
          if (phaseT >= T.rise) {
            u.uMorph.value = 1;
            u.uSpare.value = 1;
            phase = "hold";
            phaseT = 0;
          }
          break;
        }
        case "morph":
          u.uMorph.value = Math.min(1, phaseT / T.morph);
          if (phaseT >= T.morph) {
            u.uMorph.value = 1;
            phase = "hold";
            phaseT = 0;
          }
          break;
        case "hold":
          if (phaseT >= T.hold) {
            const current = cityShapes[cityIndex];
            if (cityIndex + 1 < cityShapes.length) {
              cityIndex += 1;
              startMorph(
                current,
                cityShapes[cityIndex],
                METHODS[(loop + cityIndex) % METHODS.length],
                S,
                S,
              );
            } else {
              const formation = planeFormation();
              if (fromAttr && toAttr && formation) {
                packInto(fromAttr, current, S, stageY);
                packRaw(toAttr, formation);
              }
              u.uMorph.value = 0;
              u.uMode.value = MODE.sweep;
              u.uDir.value = -1; // right-hand particles leave first, streaming down-left
              u.uFlight.value = 0;
              phase = "gather";
              phaseT = 0;
            }
          }
          break;
        case "gather": {
          const k = Math.min(1, phaseT / T.gather);
          u.uMorph.value = k;
          u.uGather.value = cubicInOut(k);
          if (phaseT >= T.gather) {
            u.uMorph.value = 1;
            u.uGather.value = 1;
            u.uFlightOn.value = 1;
            phase = "fly";
            phaseT = 0;
          }
          break;
        }
        case "fly":
          u.uFlight.value = easeInOutSine(phaseT / flyDuration);
          if (phaseT >= flyDuration) {
            u.uFlight.value = 1;
            phase = "back";
            phaseT = 0;
          }
          break;
        case "back": {
          const k = Math.min(1, phaseT / T.back);
          u.uReturn.value = k;
          u.uSpare.value = 1 - k;
          if (phaseT >= T.back) {
            loop += 1;
            route.loopDir = loop % 2 === 0 ? 1 : -1;
            u.uDir.value = route.loopDir;
            layout();
            resetTimeline();
          }
          break;
        }
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
