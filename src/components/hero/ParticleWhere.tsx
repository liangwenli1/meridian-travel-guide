import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const CFG = {
  rasterScale: 4,
  alphaThreshold: 32,
  cycle: 14,
  fov: 38,
  dprMax: 1.5,
  resizeDebounceMs: 140,
  pointSizeMin: 0.68,
  pointSizeMax: 1.62,
  glyphTilt: 0.42,
  curlStrength: 1,
  bendStrength: 1,
  twistStrength: 1,
  stretchStrength: 1,
  ribbonLength: 1,
  ribbonWave: 1,
  ribbonDepth: 1,
  cloudStrength: 0.7,
  wispyRatio: 0.09,
  pointerRadius: 80,
  pointerStrength: 0.15,
  counts: {
    mobileMin: 8000,
    mobileMax: 12000,
    low: 24000,
    medium: 34000,
    high: 48000,
    veryHigh: 56000,
  },
};

const VERT = /* glsl */ `
uniform float uTime;
uniform float uGlyph;
uniform float uCurl;
uniform float uStretch;
uniform float uRibbon;
uniform float uFlow;
uniform float uCloud;
uniform float uReturn;
uniform float uFinalLock;
uniform float uHalfW;
uniform float uHalfH;
uniform float uCameraZ;
uniform float uDpr;
uniform float uMobile;
uniform vec2 uPointer;
uniform float uPointerRadius;
uniform float uPointerStrength;
uniform float uRibbonLength;
uniform float uRibbonWave;
uniform float uRibbonDepth;
uniform float uCloudStrength;
attribute vec3 aHome;
attribute vec2 aLocal;
attribute vec2 aGlyphLocal;
attribute float aGlyph;
attribute float aSeed;
attribute float aSize;
attribute float aBrightness;
attribute float aFlowOffset;
attribute float aEdge;
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
    mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x), mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
    mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x), mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
    f.z
  );
}
vec3 rotX(vec3 p, float a) { float c = cos(a); float s = sin(a); return vec3(p.x, c*p.y - s*p.z, s*p.y + c*p.z); }
vec3 rotY(vec3 p, float a) { float c = cos(a); float s = sin(a); return vec3(c*p.x + s*p.z, p.y, -s*p.x + c*p.z); }
vec3 rotZ(vec3 p, float a) { float c = cos(a); float s = sin(a); return vec3(c*p.x - s*p.y, s*p.x + c*p.y, p.z); }

vec3 ribbonCenter(float t) {
  float x = mix(-uHalfW * 0.92, uHalfW * (1.55 * uRibbonLength + 0.35), t);
  float y = sin(t * 3.14159265 * 1.55 + 0.12) * uHalfH * 0.48 * uRibbonWave;
  y += sin(t * 3.14159265 * 3.05 + 0.6) * uHalfH * 0.16 * uRibbonWave;
  float z = sin(t * 3.14159265 * 1.7 + 0.2) * uHalfH * 0.7 * uRibbonDepth;
  return vec3(x, y, z);
}

void main() {
  vec3 home = aHome;
  float nx = aLocal.x;
  float ny = aLocal.y;
  float live = 1.0 - uFinalLock;
  float n1 = noise(vec3(home.xy * 0.03, aSeed));

  vec3 pos = home;

  float wave = uCurl * live;
  pos.y += sin(home.x * 0.032 + uTime * 1.15) * uHalfH * 0.1 * wave;
  pos.z += sin(home.x * 0.022 + ny * 1.4) * 6.5 * wave;
  pos = rotY(pos, wave * nx * 0.16);
  pos = rotX(pos, wave * ny * 0.07);
  pos += vec3(n1 - 0.5, noise(vec3(aSeed, home.yx * 0.04)) - 0.5, 0.0) * 0.22 * wave;

  float st = uStretch * live;
  pos.x += st * uHalfW * (0.12 + max(0.0, nx) * 0.5);
  pos.y *= mix(1.0, 0.36, st);
  pos.z += st * ny * 4.0;

  float rb = pow(clamp(uRibbon, 0.0, 1.0), 0.82) * live;
  float t = clamp(0.06 + (nx * 0.5 + 0.5) * 0.86 + aFlowOffset * 0.06, 0.001, 0.999);
  vec3 c0 = ribbonCenter(max(0.001, t - 0.008));
  vec3 c1 = ribbonCenter(min(0.999, t + 0.008));
  vec3 center = ribbonCenter(t);
  vec3 tangent = normalize(c1 - c0);
  vec3 up = abs(tangent.y) > 0.92 ? vec3(0.0, 0.0, 1.0) : vec3(0.0, 1.0, 0.0);
  vec3 normal = normalize(cross(tangent, up));
  vec3 binormal = normalize(cross(normal, tangent));
  float thick = mix(uHalfH * 0.85, uHalfH * 0.17, rb);
  vec3 rib = center + binormal * ny * thick + normal * (aSeed - 0.5) * 2.2;
  rib += tangent * aEdge * 4.0 * (aFlowOffset - 0.5);
  pos = mix(pos, rib, rb);

  pos += tangent * aEdge * uCloud * uCloudStrength * live * 7.0;

  pos = mix(pos, home, uReturn);

  vec2 md = pos.xy - uPointer;
  float pd = length(md);
  float fall = 1.0 - smoothstep(0.0, uPointerRadius, pd);
  pos.z += fall * fall * 2.6 * uPointerStrength * live * (1.0 - rb * 0.7);
  pos.xy += normalize(md + 1e-4) * fall * fall * 2.4 * uPointerStrength * live * (1.0 - uReturn);

  pos.x = clamp(pos.x, -uHalfW * 1.02, uHalfW * 1.95);
  pos.y = clamp(pos.y, -uHalfH * 1.12, uHalfH * 1.15);
  pos = mix(pos, home, uFinalLock);

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  float depth = uCameraZ / max(48.0, -mv.z);
  gl_PointSize = clamp(aSize * uDpr * depth, 0.55, 2.05);
  vBright = aBrightness * mix(0.74, 1.06, clamp(0.5 + pos.z * 0.014, 0.0, 1.0));
  vAlpha = mix(0.55, 0.97, aBrightness);
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

function ease(u: number) {
  const t = Math.min(1, Math.max(0, u));
  return t * t * (3 - 2 * t);
}

function envelope(c: number, inA: number, inB: number, outA: number, outB: number) {
  return ease((c - inA) / Math.max(1e-4, inB - inA)) * (1 - ease((c - outA) / Math.max(1e-4, outB - outA)));
}

function getTimelineState(time: number, mobile: number) {
  const c = ((time % CFG.cycle) + CFG.cycle) % CFG.cycle;
  const m = mobile;
  const lockStart = c < 3.2 ? 1 - ease((c - 2.7) / 0.4) : 0;
  const lockEnd = ease((c - 11.15) / 0.55);
  const ret = c < 8.9 ? 0 : Math.min(1, ease((c - 8.9) / 1.55));
  return {
    glyph: 0,
    curl: envelope(c, 2.75, 4.15, 5.4, 6.6) * m,
    stretch: envelope(c, 4.05, 5.35, 6.5, 7.7) * m,
    ribbon: envelope(c, 5.45, 6.7, 8.15, 9.5) * m,
    flow: envelope(c, 5.7, 6.9, 8.3, 9.6) * m,
    cloud: envelope(c, 7.15, 8.1, 8.9, 9.9) * m,
    ret,
    lock: Math.max(lockStart, lockEnd, c >= 11.7 ? 1 : 0),
  };
}

function getPerformanceTier() {
  const mobile = window.matchMedia("(max-width: 768px)").matches;
  const cores = navigator.hardwareConcurrency || 4;
  const memory = Number((navigator as Navigator & { deviceMemory?: number }).deviceMemory || 4);
  const wide = window.innerWidth >= 1440;
  if (mobile) {
    const count = cores >= 6 ? CFG.counts.mobileMax : CFG.counts.mobileMin;
    return { count, mobile: 0.55, pointer: 0, ribbonLength: 0.6, ribbonDepth: 0.5, cloud: 0.35 };
  }
  if (cores >= 8 && memory >= 8 && wide) {
    return { count: CFG.counts.veryHigh, mobile: 1, pointer: 1, ribbonLength: 1, ribbonDepth: 1, cloud: 1 };
  }
  if (cores >= 8) {
    return { count: CFG.counts.high, mobile: 1, pointer: 1, ribbonLength: 1, ribbonDepth: 0.95, cloud: 0.9 };
  }
  if (cores >= 4 && memory >= 4) {
    return { count: CFG.counts.medium, mobile: 1, pointer: 1, ribbonLength: 0.92, ribbonDepth: 0.85, cloud: 0.75 };
  }
  return { count: CFG.counts.low, mobile: 0.85, pointer: 0.6, ribbonLength: 0.8, ribbonDepth: 0.7, cloud: 0.55 };
}

function hash01(n: number) {
  const s = Math.sin(n * 127.1) * 43758.5453;
  return s - Math.floor(s);
}

type Sample = {
  homes: Float32Array;
  locals: Float32Array;
  glyphLocal: Float32Array;
  glyph: Float32Array;
  seeds: Float32Array;
  sizes: Float32Array;
  bright: Float32Array;
  flow: Float32Array;
  edge: Float32Array;
  halfW: number;
  halfH: number;
};

function sampleGlyphs(text: string, displayPx: number, family: string, weight: string, target: number): Sample | null {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  const scale = CFG.rasterScale;
  const fontPx = displayPx * scale;
  const font = `${weight} ${fontPx}px ${family}`;
  ctx.font = font;
  const chars = Array.from(text);
  if (!chars.length) return null;

  const full = ctx.measureText(text);
  const left = Math.max(0.5, full.actualBoundingBoxLeft || fontPx * 0.04);
  const right = Math.max(0.5, full.actualBoundingBoxRight || full.width);
  const ascent = Math.max(0.5, full.actualBoundingBoxAscent || fontPx * 0.8);
  const descent = Math.max(0.5, full.actualBoundingBoxDescent || fontPx * 0.2);
  const pad = 12;
  const width = Math.ceil(left + right + pad * 2);
  const height = Math.ceil(ascent + descent + pad * 2);
  canvas.width = width;
  canvas.height = height;
  ctx.font = font;
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#fff";
  const fillX = pad + left;
  const fillY = pad + ascent;

  const prefixes: number[] = [];
  for (let i = 0; i < chars.length; i++) {
    prefixes.push(ctx.measureText(chars.slice(0, i).join("")).width);
  }
  prefixes.push(ctx.measureText(text).width);
  ctx.fillText(text, fillX, fillY);

  const wordCenterX = fillX + full.width * 0.5;
  const wordCenterY = fillY + (descent - ascent) * 0.5;
  const glyphCenters = chars.map((_, i) => ({
    x: fillX + (prefixes[i] + prefixes[i + 1]) * 0.5,
    y: wordCenterY,
  }));

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

  const keep = Math.min(1, target / Math.max(1, available));
  const picked: number[] = [];
  for (let i = 0; i < available; i++) {
    if (hash01(i * 1.17 + chars.length * 9.1) > keep) continue;
    picked.push(raw[i * 2], raw[i * 2 + 1]);
  }
  while (picked.length / 2 < target && available > 0) {
    const i = picked.length / 2;
    const src = Math.floor(hash01(i * 3.31 + 4.7) * available) % available;
    picked.push(raw[src * 2] + (hash01(i + 2.2) - 0.5) * 0.7, raw[src * 2 + 1] + (hash01(i + 8.1) - 0.5) * 0.7);
  }
  const count = Math.min(target, Math.floor(picked.length / 2));
  const halfW = Math.max(1, (left + right) * 0.5 / scale);
  const halfH = Math.max(1, (ascent + descent) * 0.5 / scale);

  const homes = new Float32Array(count * 3);
  const locals = new Float32Array(count * 2);
  const glyphLocal = new Float32Array(count * 2);
  const glyph = new Float32Array(count);
  const seeds = new Float32Array(count);
  const sizes = new Float32Array(count);
  const bright = new Float32Array(count);
  const flow = new Float32Array(count);
  const edge = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const px = picked[i * 2];
    const py = picked[i * 2 + 1];
    const lx = (px - wordCenterX) / scale;
    const ly = (wordCenterY - py) / scale;
    homes[i * 3] = lx;
    homes[i * 3 + 1] = ly;
    homes[i * 3 + 2] = 0;
    locals[i * 2] = Math.max(-1, Math.min(1, lx / halfW));
    locals[i * 2 + 1] = Math.max(-1, Math.min(1, ly / halfH));
    let gi = 0;
    const rel = px - fillX;
    for (let g = 0; g < chars.length; g++) {
      if (rel >= prefixes[g] - 0.5) gi = g;
    }
    glyph[i] = gi;
    glyphLocal[i * 2] = (px - glyphCenters[gi].x) / scale;
    glyphLocal[i * 2 + 1] = (glyphCenters[gi].y - py) / scale;
    const seed = hash01(i * 0.173 + gi * 5.9 + px * 0.02);
    seeds[i] = seed * 31;
    const sz = hash01(i * 0.91 + 2.4);
    sizes[i] = sz > 0.94 ? 1.72 + sz * 0.22 : CFG.pointSizeMin + sz * (CFG.pointSizeMax - CFG.pointSizeMin);
    bright[i] = 0.55 + hash01(i * 1.33 + 0.7) * 0.45;
    flow[i] = hash01(i * 2.07 + gi * 0.41);
    edge[i] = hash01(i * 4.13 + 1.9) > 1 - CFG.wispyRatio ? 1 : 0;
  }

  return { homes, locals, glyphLocal, glyph, seeds, sizes, bright, flow, edge, halfW, halfH };
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
  const [fallback, setFallback] = useState(false);

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
    let elapsed = 0;
    let last = 0;
    let lastW = 0;
    let lastH = 0;
    let resizeTimer = 0;
    let reduce = reducedMotion;
    const tier = getPerformanceTier();

    const layoutCamera = () => {
      if (!renderer || !camera) return;
      const w = Math.max(1, stage.clientWidth);
      const h = Math.max(1, stage.clientHeight);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      const dist = h * 0.5 / Math.tan((CFG.fov * Math.PI) / 360);
      camera.position.set(0, 0, dist);
      camera.updateProjectionMatrix();
      if (points) {
        const mw = Math.max(1, measure.offsetWidth);
        points.position.set(mw * 0.5 - w * 0.5, 0, 0);
      }
      if (material) {
        material.uniforms.uCameraZ.value = dist;
        material.uniforms.uDpr.value = Math.min(window.devicePixelRatio || 1, CFG.dprMax);
        material.uniforms.uStageSize.value.set(w, h);
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
      const sampled = sampleGlyphs(text, displayPx, cs.fontFamily, cs.fontWeight, tier.count);
      if (!sampled) {
        setFallback(true);
        return;
      }

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
        camera = new THREE.PerspectiveCamera(CFG.fov, 1, 0.1, 5000);
      }

      geometry?.dispose();
      material?.dispose();
      if (points && scene) scene.remove(points);

      geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(sampled.homes, 3));
      geometry.setAttribute("aHome", new THREE.BufferAttribute(sampled.homes, 3));
      geometry.setAttribute("aLocal", new THREE.BufferAttribute(sampled.locals, 2));
      geometry.setAttribute("aGlyphLocal", new THREE.BufferAttribute(sampled.glyphLocal, 2));
      geometry.setAttribute("aGlyph", new THREE.BufferAttribute(sampled.glyph, 1));
      geometry.setAttribute("aSeed", new THREE.BufferAttribute(sampled.seeds, 1));
      geometry.setAttribute("aSize", new THREE.BufferAttribute(sampled.sizes, 1));
      geometry.setAttribute("aBrightness", new THREE.BufferAttribute(sampled.bright, 1));
      geometry.setAttribute("aFlowOffset", new THREE.BufferAttribute(sampled.flow, 1));
      geometry.setAttribute("aEdge", new THREE.BufferAttribute(sampled.edge, 1));

      material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uGlyph: { value: 0 },
          uCurl: { value: 0 },
          uStretch: { value: 0 },
          uRibbon: { value: 0 },
          uFlow: { value: 0 },
          uCloud: { value: 0 },
          uReturn: { value: 0 },
          uFinalLock: { value: 1 },
          uHalfW: { value: sampled.halfW },
          uHalfH: { value: sampled.halfH },
          uCameraZ: { value: 200 },
          uDpr: { value: Math.min(window.devicePixelRatio || 1, CFG.dprMax) },
          uMobile: { value: tier.mobile },
          uPointer: { value: new THREE.Vector2(9999, 9999) },
          uPointerRadius: { value: CFG.pointerRadius },
          uPointerStrength: { value: 0 },
          uRibbonLength: { value: CFG.ribbonLength * tier.ribbonLength },
          uRibbonWave: { value: CFG.ribbonWave },
          uRibbonDepth: { value: CFG.ribbonDepth * tier.ribbonDepth },
          uCloudStrength: { value: CFG.cloudStrength * tier.cloud },
          uStageSize: { value: new THREE.Vector2(1, 1) },
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
      if (!visible || document.visibilityState === "hidden" || !renderer || !scene || !camera || !material) {
        last = 0;
        return;
      }
      if (!last) last = ts;
      elapsed += ts - last;
      last = ts;
      const t = elapsed / 1000;
      material.uniforms.uTime.value = t;
      if (reduce) {
        material.uniforms.uGlyph.value = 0;
        material.uniforms.uCurl.value = 0;
        material.uniforms.uStretch.value = 0;
        material.uniforms.uRibbon.value = 0;
        material.uniforms.uFlow.value = 0;
        material.uniforms.uCloud.value = 0;
        material.uniforms.uReturn.value = 0;
        material.uniforms.uFinalLock.value = 1;
        material.uniforms.uPointerStrength.value = 0;
      } else {
        const k = getTimelineState(t, tier.mobile);
        material.uniforms.uGlyph.value = k.glyph * CFG.glyphTilt;
        material.uniforms.uCurl.value = k.curl * CFG.curlStrength;
        material.uniforms.uStretch.value = k.stretch * CFG.stretchStrength;
        material.uniforms.uRibbon.value = k.ribbon;
        material.uniforms.uFlow.value = k.flow;
        material.uniforms.uCloud.value = k.cloud;
        material.uniforms.uReturn.value = k.ret;
        material.uniforms.uFinalLock.value = k.lock;
        material.uniforms.uPointerStrength.value = CFG.pointerStrength * tier.pointer;
      }
      renderer.render(scene, camera);
    };

    const onMove = (event: PointerEvent) => {
      if (!material || !points || !tier.pointer || reduce) return;
      const rect = stage.getBoundingClientRect();
      material.uniforms.uPointer.value.set(
        event.clientX - rect.left - rect.width * 0.5 - points.position.x,
        rect.height * 0.5 - (event.clientY - rect.top),
      );
    };

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onReduce = () => {
      reduce = media.matches || reducedMotion;
    };
    media.addEventListener("change", onReduce);

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
        resizeTimer = window.setTimeout(() => build(false), CFG.resizeDebounceMs);
      });
      ro.observe(measure);
      ro.observe(stage);
    });

    window.addEventListener("pointermove", onMove);
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
      document.removeEventListener("visibilitychange", onVis);
      geometry?.dispose();
      material?.dispose();
      renderer?.dispose();
      renderer?.domElement.remove();
    };
  }, [text, reducedMotion]);

  return (
    <span ref={wrapRef} className="hero-ask-where" aria-label={text}>
      <span
        ref={measureRef}
        className={`hero-ask-measure${fallback ? " is-fallback" : ""}`}
        aria-hidden="true"
      >
        {text}
      </span>
      <span ref={stageRef} className="hero-ask-stage" aria-hidden="true" />
    </span>
  );
}
