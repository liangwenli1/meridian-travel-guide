import { useEffect, useRef } from "react";
import * as THREE from "three";

const CYCLE = 12;
const INTRO = 3.2;

const VERT = /* glsl */ `
uniform float uTime;
uniform float uIntro;
uniform float uMorph;
uniform float uIdle;
uniform vec2 uMouse;
uniform float uRadius;
attribute vec3 aHome;
attribute vec3 aFrom;
attribute float aSeed;
attribute float aSize;
varying float vAlpha;

float hash(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
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

vec2 rotate(vec2 p, float a) {
  float c = cos(a);
  float s = sin(a);
  return vec2(c * p.x - s * p.y, s * p.x + c * p.y);
}

void main() {
  vec3 home = aHome;
  float n1 = noise(home * 0.018 + aSeed);
  float n2 = noise(home * 0.011 + vec3(aSeed * 2.1, uTime * 0.05, 0.0));

  float r = length(home.xy) + 0.0001;
  float ang = atan(home.y, home.x);
  float swirl = uMorph * (0.85 + n1 * 0.55);
  float stretch = 1.0 + uMorph * (0.18 + n2 * 0.35);
  float ring = mix(r, mix(r, 70.0 + n1 * 38.0, 0.72), uMorph);
  ang += swirl * (0.55 + 0.35 * sin(r * 0.04 + uTime * 0.35));
  vec3 distorted = vec3(cos(ang) * ring * stretch, sin(ang) * ring * stretch, 0.0);
  distorted.xy = rotate(distorted.xy, uMorph * 0.55);
  distorted.x += uMorph * sin(ang * 2.0 + uTime * 0.4) * 18.0;
  distorted.y += uMorph * cos(r * 0.05 + uTime * 0.3) * 12.0;
  distorted.z = uMorph * (n1 - 0.5) * 52.0;

  vec3 pos = mix(home, distorted, uMorph);
  pos += vec3(n1 - 0.5, n2 - 0.5, n1 - n2) * uIdle * 1.15;

  vec2 md = pos.xy - uMouse;
  float d = length(md);
  float fall = 1.0 - smoothstep(0.0, uRadius, d);
  pos.xy += normalize(md + 0.0001) * fall * fall * 22.0;

  pos = mix(aFrom, pos, uIntro);

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = clamp(aSize * (520.0 / max(80.0, -mv.z)), 0.8, 3.4);
  vAlpha = 0.42 + uIntro * 0.5;
}
`;

const FRAG = /* glsl */ `
uniform vec3 uColor;
varying float vAlpha;
void main() {
  vec2 p = gl_PointCoord - 0.5;
  float d = length(p);
  float alpha = smoothstep(0.48, 0.12, d) * vAlpha;
  if (alpha < 0.02) discard;
  gl_FragColor = vec4(uColor, alpha);
}
`;

function sampleGlyph(text: string, font: string, fontPx: number, target: number) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return { homes: new Float32Array(0), seeds: new Float32Array(0), sizes: new Float32Array(0) };
  ctx.font = font;
  const width = Math.max(2, Math.ceil(ctx.measureText(text).width + 8));
  const height = Math.max(2, Math.ceil(fontPx * 1.1));
  canvas.width = width;
  canvas.height = height;
  ctx.font = font;
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#fff";
  ctx.fillText(text, 2, fontPx * 0.84);
  const data = ctx.getImageData(0, 0, width, height).data;
  const pts: number[] = [];
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (data[(y * width + x) * 4 + 3] < 88) continue;
      pts.push(x, y);
    }
  }
  const count = Math.min(target, Math.max(1200, pts.length / 2));
  const homes = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  const sizes = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const src = (i * (pts.length / 2 / count)) | 0;
    const px = pts[src * 2] + Math.random() * 0.7;
    const py = pts[src * 2 + 1] + Math.random() * 0.7;
    homes[i * 3] = px;
    homes[i * 3 + 1] = py;
    homes[i * 3 + 2] = (Math.random() - 0.5) * 2.5;
    seeds[i] = Math.random() * 40;
    sizes[i] = 1.05 + Math.random() * 1.35;
  }
  return { homes, seeds, sizes, width, height };
}

function morphAmount(t: number) {
  const c = t % CYCLE;
  if (c < 2.8) return 0;
  if (c < 6.0) {
    const u = (c - 2.8) / 3.2;
    return u * u * (3 - 2 * u);
  }
  if (c < 8.8) return 1;
  if (c < 12) {
    const u = (c - 8.8) / 3.2;
    return 1 - u * u * (3 - 2 * u);
  }
  return 0;
}

export function ParticleWhere({
  text,
  reducedMotion,
}: {
  text: string;
  reducedMotion: boolean;
}) {
  const wrapRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const host = wrap.closest("#hero") as HTMLElement | null;
    if (!host) return;

    let disposed = false;
    let raf = 0;
    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let points: THREE.Points | null = null;
    let geometry: THREE.BufferGeometry | null = null;
    let material: THREE.ShaderMaterial | null = null;
    let visible = true;
    const mouse = { x: 0, y: 0 };
    let start = 0;

    const targetCount = (() => {
      const mobile = window.matchMedia("(max-width: 768px)").matches;
      const cores = navigator.hardwareConcurrency || 4;
      if (mobile) return 12000;
      if (cores >= 8) return 48000;
      return 32000;
    })();

    let lastW = 0;
    let lastH = 0;
    let resizeTimer = 0;

    const build = (force = false) => {
      const w = Math.max(1, host.clientWidth);
      const h = Math.max(1, host.clientHeight);
      if (!force && Math.abs(w - lastW) < 2 && Math.abs(h - lastH) < 2 && points) {
        renderer?.setSize(w, h, false);
        if (camera) {
          camera.aspect = w / h;
          camera.position.set(0, 0, (h * 0.5) / Math.tan((42 * Math.PI) / 360));
          camera.updateProjectionMatrix();
        }
        return;
      }
      lastW = w;
      lastH = h;
      const cs = getComputedStyle(wrap);
      const fontPx = parseFloat(cs.fontSize) || 72;
      const font = `${cs.fontWeight} ${fontPx}px ${cs.fontFamily}`;
      const sampled = sampleGlyph(text, font, fontPx, reducedMotion ? Math.min(8000, targetCount) : targetCount);
      if (!sampled.width || !sampled.homes.length) return;

      const hostRect = host.getBoundingClientRect();
      const wrapRect = wrap.getBoundingClientRect();
      const originX = wrapRect.left - hostRect.left;
      const originY = wrapRect.top - hostRect.top;
      const count = sampled.homes.length / 3;
      const homes = new Float32Array(count * 3);
      const from = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const lx = sampled.homes[i * 3];
        const ly = sampled.homes[i * 3 + 1];
        const x = originX + lx - w * 0.5;
        const y = h * 0.5 - (originY + ly);
        const z = sampled.homes[i * 3 + 2];
        homes[i * 3] = x;
        homes[i * 3 + 1] = y;
        homes[i * 3 + 2] = z;
        from[i * 3] = (Math.random() - 0.5) * w * 1.15;
        from[i * 3 + 1] = (Math.random() - 0.5) * h * 1.15;
        from[i * 3 + 2] = (Math.random() - 0.5) * 80;
      }

      if (!renderer) {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "high-performance" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setClearColor(0x000000, 0);
        renderer.domElement.style.cssText = "position:absolute;inset:0;z-index:18;pointer-events:none;";
        renderer.domElement.setAttribute("aria-hidden", "true");
        host.appendChild(renderer.domElement);
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 4000);
      }

      renderer.setSize(w, h, false);
      camera!.aspect = w / h;
      camera!.position.set(0, 0, (h * 0.5) / Math.tan((42 * Math.PI) / 360));
      camera!.updateProjectionMatrix();

      geometry?.dispose();
      material?.dispose();
      if (points && scene) scene.remove(points);

      geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(homes, 3));
      geometry.setAttribute("aHome", new THREE.BufferAttribute(homes, 3));
      geometry.setAttribute("aFrom", new THREE.BufferAttribute(from, 3));
      geometry.setAttribute("aSeed", new THREE.BufferAttribute(sampled.seeds, 1));
      geometry.setAttribute("aSize", new THREE.BufferAttribute(sampled.sizes, 1));
      material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uIntro: { value: reducedMotion ? 1 : 0 },
          uMorph: { value: 0 },
          uIdle: { value: reducedMotion ? 0 : 1 },
          uMouse: { value: new THREE.Vector2(9999, 9999) },
          uRadius: { value: 120 },
          uColor: { value: new THREE.Color("#d4f03c") },
        },
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.NormalBlending,
      });
      points = new THREE.Points(geometry, material);
      scene!.add(points);
    };

    const tick = (ts: number) => {
      if (disposed) return;
      raf = requestAnimationFrame(tick);
      if (!visible || document.visibilityState === "hidden" || !renderer || !scene || !camera || !material) return;
      if (!start) start = ts;
      const t = (ts - start) / 1000;
      material.uniforms.uTime.value = t;
      if (!reducedMotion) {
        const intro = Math.min(1, t / INTRO);
        const iu = intro * intro * (3 - 2 * intro);
        material.uniforms.uIntro.value = iu;
        material.uniforms.uMorph.value = intro >= 1 ? morphAmount(t - INTRO) : 0;
      }
      renderer.render(scene, camera);
    };

    const onMove = (event: PointerEvent) => {
      if (!material || !host) return;
      const rect = host.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width * 0.5;
      const y = rect.height * 0.5 - (event.clientY - rect.top);
      mouse.x = x;
      mouse.y = y;
      material.uniforms.uMouse.value.set(x, y);
    };

    let ro: ResizeObserver | null = null;
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries.some((e) => e.isIntersecting);
      },
      { threshold: 0.05 },
    );
    io.observe(host);

    void document.fonts.ready.then(() => {
      if (disposed) return;
      build(true);
      raf = requestAnimationFrame(tick);
      ro = new ResizeObserver(() => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => build(false), 160);
      });
      ro.observe(host);
      ro.observe(wrap);
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
    <span
      ref={wrapRef}
      className="hero-ask-where relative inline-block shrink-0 align-baseline"
      aria-label={text}
    >
      <span className="invisible select-none" aria-hidden="true">
        {text}
      </span>
    </span>
  );
}
