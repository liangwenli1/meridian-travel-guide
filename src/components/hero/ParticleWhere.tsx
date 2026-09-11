import { useEffect, useRef } from "react";
import * as THREE from "three";

const CYCLE = 11;
const RASTER_SCALE = 4;
const FOV = 38;

const VERT = /* glsl */ `
uniform float uTime;
uniform float uBend;
uniform float uTwist;
uniform float uFold;
uniform float uLoop;
uniform float uGlyph;
uniform float uRot;
uniform float uIdle;
uniform float uFade;
uniform float uHalfW;
uniform float uHalfH;
uniform float uMobile;
uniform float uCameraZ;
uniform float uDpr;
uniform vec2 uMouse;
uniform float uRadius;
attribute vec3 aHome;
attribute vec2 aNorm;
attribute vec2 aGlyphLocal;
attribute float aGlyphId;
attribute float aSeed;
attribute float aSize;
attribute float aBright;
varying float vAlpha;
varying float vBright;

float hash(vec3 p) {
  p = fract(p * 0.3183099 + vec3(0.11, 0.17, 0.13));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
        mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
    mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
        mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
    f.z
  );
}

vec3 rotX(vec3 p, float a) {
  float c = cos(a); float s = sin(a);
  return vec3(p.x, c * p.y - s * p.z, s * p.y + c * p.z);
}
vec3 rotY(vec3 p, float a) {
  float c = cos(a); float s = sin(a);
  return vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z);
}
vec3 rotZ(vec3 p, float a) {
  float c = cos(a); float s = sin(a);
  return vec3(c * p.x - s * p.y, s * p.x + c * p.y, p.z);
}

void main() {
  vec3 home = aHome;
  float nx = aNorm.x;
  float ny = aNorm.y;
  float n1 = noise(vec3(home.xy * 0.04, aSeed));
  float n2 = noise(vec3(home.yx * 0.03, aSeed + uTime * 0.12));

  vec3 pos = home;
  pos += vec3(n1 - 0.5, n2 - 0.5, n1 - n2) * uIdle * 0.32;

  float phase = aGlyphId * 1.618 + aSeed * 0.15;
  vec3 g = pos;
  vec2 gc = home.xy - aGlyphLocal;
  vec3 around = vec3(aGlyphLocal, 0.0);
  around = rotZ(around, uGlyph * 0.16 * sin(phase));
  around = rotY(around, uGlyph * 0.22 * cos(phase * 0.7));
  g.xy = gc + around.xy;
  g.z = around.z + uGlyph * sin(phase) * 7.0;
  pos = mix(pos, g, uGlyph);

  float amt = max(uBend, 0.00015);
  float k = 1.32;
  float theta = (home.x / max(uHalfW, 1.0)) * amt * k;
  float radius = uHalfW / (amt * k);
  vec3 bent = vec3(sin(theta) * radius, pos.y, (1.0 - cos(theta)) * radius);
  pos = mix(pos, bent, smoothstep(0.0, 1.0, uBend));

  float twistA = uTwist * (nx * 0.95 + ny * 0.18 + (n1 - 0.5) * 0.12);
  pos = rotX(pos, twistA);

  float fold = uFold;
  pos.z += sin(nx * 3.14159 + ny * 2.0) * fold * 16.0;
  pos.y += cos(nx * 2.2) * fold * 6.0;
  pos = rotY(pos, fold * nx * 0.28);

  float loop = uLoop;
  float arc = nx * 3.14159265 * mix(1.75, 2.15, loop);
  float rr = mix(uHalfW * 0.95, uHalfW * 1.32, loop) + ny * mix(uHalfH, 26.0, loop) + pos.z * 0.16;
  vec3 ribbon;
  ribbon.x = sin(arc) * rr;
  ribbon.z = cos(arc) * rr * 0.88;
  ribbon.y = mix(pos.y, ny * 20.0 + sin(arc * 1.4) * 12.0, loop);
  pos = mix(pos, ribbon, loop);

  pos = rotX(pos, uRot * 1.05);
  pos = rotY(pos, uRot * 0.72);
  pos = rotZ(pos, uRot * -0.22);

  vec2 md = pos.xy - uMouse;
  float d = length(md);
  float fall = 1.0 - smoothstep(0.0, uRadius, d);
  pos.z += fall * fall * 4.2;
  pos.xy += normalize(md + 1e-4) * fall * fall * 3.4;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  float depth = uCameraZ / max(40.0, -mv.z);
  gl_PointSize = clamp(aSize * uDpr * depth, 0.55, 2.25);
  vBright = aBright * mix(0.72, 1.08, clamp(0.5 + pos.z * 0.012, 0.0, 1.0));
  vAlpha = uFade * mix(0.55, 0.95, aBright);
}
`;

const FRAG = /* glsl */ `
uniform vec3 uColor;
varying float vAlpha;
varying float vBright;
void main() {
  vec2 p = gl_PointCoord - 0.5;
  float d = length(p);
  float alpha = smoothstep(0.46, 0.28, d) * vAlpha * vBright;
  if (alpha < 0.03) discard;
  gl_FragColor = vec4(uColor * vBright, alpha);
}
`;

function ease(u: number) {
  const t = Math.min(1, Math.max(0, u));
  return t * t * (3 - 2 * t);
}

function envelope(c: number, inA: number, inB: number, outA: number, outB: number) {
  return ease((c - inA) / Math.max(0.0001, inB - inA)) * (1 - ease((c - outA) / Math.max(0.0001, outB - outA)));
}

function timeline(t: number) {
  const c = t % CYCLE;
  return {
    bend: envelope(c, 2.4, 4.3, 8.5, 10.1),
    twist: envelope(c, 4.3, 6.1, 8.0, 9.85),
    fold: envelope(c, 4.55, 6.25, 7.85, 9.7),
    loop: envelope(c, 6.1, 7.55, 7.7, 9.45),
    glyph: envelope(c, 4.9, 6.7, 7.75, 9.55),
    rot: envelope(c, 6.15, 7.6, 7.7, 9.5),
  };
}

function particleBudget() {
  const mobile = window.matchMedia("(max-width: 768px)").matches;
  const cores = navigator.hardwareConcurrency || 4;
  const wide = window.innerWidth >= 1440;
  if (mobile) return { count: 10000, mobile: 0.55 };
  if (cores >= 8 && wide) return { count: 56000, mobile: 1 };
  if (cores >= 8) return { count: 42000, mobile: 1 };
  return { count: 32000, mobile: 1 };
}

type Sample = {
  homes: Float32Array;
  norms: Float32Array;
  glyphLocal: Float32Array;
  glyphId: Float32Array;
  seeds: Float32Array;
  sizes: Float32Array;
  bright: Float32Array;
  halfW: number;
  halfH: number;
};

function sampleText(text: string, displayPx: number, family: string, weight: string, target: number): Sample | null {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  const fontPx = displayPx * RASTER_SCALE;
  const font = `${weight} ${fontPx}px ${family}`;
  ctx.font = font;
  const metrics = ctx.measureText(text);
  const left = Math.max(0.5, metrics.actualBoundingBoxLeft || fontPx * 0.05);
  const right = Math.max(0.5, metrics.actualBoundingBoxRight || metrics.width);
  const ascent = Math.max(0.5, metrics.actualBoundingBoxAscent || fontPx * 0.8);
  const descent = Math.max(0.5, metrics.actualBoundingBoxDescent || fontPx * 0.2);
  const pad = 10;
  const width = Math.ceil(left + right + pad * 2);
  const height = Math.ceil(ascent + descent + pad * 2);
  canvas.width = width;
  canvas.height = height;
  ctx.font = font;
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#fff";
  const fillX = pad + left;
  const fillY = pad + ascent;
  ctx.fillText(text, fillX, fillY);

  const chars = Array.from(text);
  const edges: number[] = [0];
  for (let i = 1; i <= chars.length; i++) {
    edges.push(ctx.measureText(chars.slice(0, i).join("")).width);
  }
  const centers: { cx: number; cy: number }[] = [];
  for (let i = 0; i < chars.length; i++) {
    centers.push({
      cx: fillX + (edges[i] + edges[i + 1]) * 0.5,
      cy: fillY - (ascent - descent) * 0.5,
    });
  }

  const data = ctx.getImageData(0, 0, width, height).data;
  const raw: number[] = [];
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (data[(y * width + x) * 4 + 3] < 80) continue;
      raw.push(x + Math.random() * 0.45, y + Math.random() * 0.45);
    }
  }
  const available = raw.length / 2;
  if (available < 80) return null;
  const count = Math.min(target, Math.max(available, Math.min(target, available * 3)));
  const centerX = fillX + (right - left) * 0.5;
  const centerY = fillY + (descent - ascent) * 0.5;
  const halfW = Math.max(1, (left + right) * 0.5 / RASTER_SCALE);
  const halfH = Math.max(1, (ascent + descent) * 0.5 / RASTER_SCALE);

  const homes = new Float32Array(count * 3);
  const norms = new Float32Array(count * 2);
  const glyphLocal = new Float32Array(count * 2);
  const glyphId = new Float32Array(count);
  const seeds = new Float32Array(count);
  const sizes = new Float32Array(count);
  const bright = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const src = available === 0 ? 0 : Math.floor((i / count) * available) % available;
    const jitter = i >= available ? (Math.random() - 0.5) * 0.8 : 0;
    const px = raw[src * 2] + jitter;
    const py = raw[src * 2 + 1] + jitter;
    const lx = (px - centerX) / RASTER_SCALE;
    const ly = (centerY - py) / RASTER_SCALE;
    homes[i * 3] = lx;
    homes[i * 3 + 1] = ly;
    homes[i * 3 + 2] = 0;
    norms[i * 2] = Math.max(-1, Math.min(1, lx / halfW));
    norms[i * 2 + 1] = Math.max(-1, Math.min(1, ly / halfH));
    let gi = 0;
    const rel = px - fillX;
    for (let g = 0; g < chars.length; g++) {
      if (rel >= edges[g] - 0.5) gi = g;
    }
    glyphId[i] = gi;
    glyphLocal[i * 2] = (px - centers[gi].cx) / RASTER_SCALE;
    glyphLocal[i * 2 + 1] = (centers[gi].cy - py) / RASTER_SCALE;
    seeds[i] = Math.random() * 31;
    const r = Math.random();
    sizes[i] = r > 0.92 ? 1.85 + Math.random() * 0.3 : 0.72 + r * 0.95;
    bright[i] = 0.55 + Math.random() * 0.45;
  }

  return { homes, norms, glyphLocal, glyphId, seeds, sizes, bright, halfW, halfH };
}

export function ParticleWhere({
  text,
  reducedMotion,
}: {
  text: string;
  reducedMotion: boolean;
}) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const stageRef = useRef<HTMLSpanElement>(null);

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
    let visible = true;
    let start = 0;
    let lastW = 0;
    let lastH = 0;
    let resizeTimer = 0;
    const budget = particleBudget();

    const layoutCamera = () => {
      if (!renderer || !camera) return;
      const w = Math.max(1, stage.clientWidth);
      const h = Math.max(1, stage.clientHeight);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      const dist = h * 0.5 / Math.tan((FOV * Math.PI) / 360);
      camera.position.set(0, 0, dist);
      camera.updateProjectionMatrix();
      if (material) {
        material.uniforms.uCameraZ.value = dist;
        material.uniforms.uDpr.value = Math.min(window.devicePixelRatio || 1, 1.5);
      }
    };

    const build = (force: boolean) => {
      const mw = measure.offsetWidth;
      const mh = measure.offsetHeight;
      if (!force && Math.abs(mw - lastW) < 1 && Math.abs(mh - lastH) < 1 && points) {
        layoutCamera();
        return;
      }
      lastW = mw;
      lastH = mh;
      const cs = getComputedStyle(measure);
      const displayPx = parseFloat(cs.fontSize) || 72;
      const sampled = sampleText(
        text,
        displayPx,
        cs.fontFamily,
        cs.fontWeight,
        reducedMotion ? Math.min(12000, budget.count) : budget.count,
      );
      if (!sampled) return;

      if (!renderer) {
        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: false,
          powerPreference: "high-performance",
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.setClearColor(0x000000, 0);
        renderer.domElement.setAttribute("aria-hidden", "true");
        stage.appendChild(renderer.domElement);
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 5000);
      }

      geometry?.dispose();
      material?.dispose();
      if (points && scene) scene.remove(points);

      geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(sampled.homes, 3));
      geometry.setAttribute("aHome", new THREE.BufferAttribute(sampled.homes, 3));
      geometry.setAttribute("aNorm", new THREE.BufferAttribute(sampled.norms, 2));
      geometry.setAttribute("aGlyphLocal", new THREE.BufferAttribute(sampled.glyphLocal, 2));
      geometry.setAttribute("aGlyphId", new THREE.BufferAttribute(sampled.glyphId, 1));
      geometry.setAttribute("aSeed", new THREE.BufferAttribute(sampled.seeds, 1));
      geometry.setAttribute("aSize", new THREE.BufferAttribute(sampled.sizes, 1));
      geometry.setAttribute("aBright", new THREE.BufferAttribute(sampled.bright, 1));

      material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uBend: { value: 0 },
          uTwist: { value: 0 },
          uFold: { value: 0 },
          uLoop: { value: 0 },
          uGlyph: { value: 0 },
          uRot: { value: 0 },
          uIdle: { value: reducedMotion ? 0 : 1 },
          uFade: { value: 1 },
          uHalfW: { value: sampled.halfW },
          uHalfH: { value: sampled.halfH },
          uMobile: { value: budget.mobile },
          uCameraZ: { value: 200 },
          uDpr: { value: Math.min(window.devicePixelRatio || 1, 1.5) },
          uMouse: { value: new THREE.Vector2(9999, 9999) },
          uRadius: { value: 46 },
          uColor: { value: new THREE.Color("#d4f03c") },
        },
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        depthWrite: false,
      });
      points = new THREE.Points(geometry, material);
      scene!.add(points);
      layoutCamera();
    };

    const tick = (ts: number) => {
      if (disposed) return;
      raf = requestAnimationFrame(tick);
      if (!visible || document.visibilityState === "hidden" || !renderer || !scene || !camera || !material) return;
      if (!start) start = ts;
      const t = (ts - start) / 1000;
      material.uniforms.uTime.value = t;
      material.uniforms.uFade.value = Math.min(1, t / 0.55);
      if (reducedMotion) {
        material.uniforms.uBend.value = 0;
        material.uniforms.uTwist.value = 0;
        material.uniforms.uFold.value = 0;
        material.uniforms.uLoop.value = 0;
        material.uniforms.uGlyph.value = 0;
        material.uniforms.uRot.value = 0;
        material.uniforms.uIdle.value = 0;
      } else {
        const k = timeline(t);
        const m = budget.mobile;
        material.uniforms.uBend.value = k.bend * m;
        material.uniforms.uTwist.value = k.twist * m;
        material.uniforms.uFold.value = k.fold * m;
        material.uniforms.uLoop.value = k.loop * m;
        material.uniforms.uGlyph.value = k.glyph * m;
        material.uniforms.uRot.value = k.rot * m;
      }
      renderer.render(scene, camera);
    };

    const onMove = (event: PointerEvent) => {
      if (!material) return;
      const rect = stage.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width * 0.5;
      const y = rect.height * 0.5 - (event.clientY - rect.top);
      material.uniforms.uMouse.value.set(x, y);
    };

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries.some((entry) => entry.isIntersecting);
      },
      { threshold: 0.04 },
    );
    io.observe(wrap);

    let ro: ResizeObserver | null = null;
    void document.fonts.ready.then(() => {
      if (disposed) return;
      build(true);
      raf = requestAnimationFrame(tick);
      ro = new ResizeObserver(() => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => build(false), 180);
      });
      ro.observe(measure);
      ro.observe(stage);
    });

    window.addEventListener("pointermove", onMove);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      ro?.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      geometry?.dispose();
      material?.dispose();
      renderer?.dispose();
      renderer?.domElement.remove();
    };
  }, [text, reducedMotion]);

  return (
    <span ref={wrapRef} className="hero-ask-where" aria-label={text}>
      <span ref={measureRef} className="hero-ask-measure" aria-hidden="true">
        {text}
      </span>
      <span ref={stageRef} className="hero-ask-stage" aria-hidden="true" />
    </span>
  );
}
