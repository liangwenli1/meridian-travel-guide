import { useEffect, useRef } from "react";

type Particle = {
  hx: number;
  hy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  phase: number;
};

const ACCENT = { r: 212, g: 240, b: 60 };

export function ParticleWhere({
  text,
  reducedMotion,
}: {
  text: string;
  reducedMotion: boolean;
}) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    if (reducedMotion) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let disposed = false;
    let raf = 0;
    let particles: Particle[] = [];
    let w = 1;
    let h = 1;
    let dpr = 1;
    let start = 0;
    let last = 0;
    const mouse = { x: -9999, y: -9999, down: false, inside: false };

    const sample = (fontPx: number) => {
      const off = document.createElement("canvas");
      const ox = off.getContext("2d", { willReadFrequently: true });
      if (!ox) return [] as Particle[];
      ox.font = `500 ${fontPx}px Inter, ui-sans-serif, system-ui, sans-serif`;
      const metrics = ox.measureText(text);
      const width = Math.ceil(Math.max(1, metrics.width + fontPx * 0.12));
      const height = Math.ceil(fontPx * 1.12);
      off.width = width;
      off.height = height;
      ox.font = `500 ${fontPx}px Inter, ui-sans-serif, system-ui, sans-serif`;
      ox.textBaseline = "alphabetic";
      ox.fillStyle = "#fff";
      ox.fillText(text, fontPx * 0.04, fontPx * 0.86);
      const data = ox.getImageData(0, 0, width, height).data;
      const step = fontPx > 88 ? 2 : 3;
      const pts: Particle[] = [];
      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          if (data[(y * width + x) * 4 + 3] < 140) continue;
          const jitter = Math.random();
          if (jitter > 0.82) continue;
          const hx = x + 0.4;
          const hy = y + 0.4;
          const angle = Math.random() * Math.PI * 2;
          const dist = 40 + Math.random() * 220;
          pts.push({
            hx,
            hy,
            x: hx + Math.cos(angle) * dist,
            y: hy + Math.sin(angle) * dist,
            vx: 0,
            vy: 0,
            size: 0.7 + Math.random() * 1.35,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
      wrap.style.width = `${width}px`;
      wrap.style.height = `${height}px`;
      return pts;
    };

    const resize = () => {
      const parent = wrap.parentElement;
      const cw = parent?.clientWidth || wrap.clientWidth || 420;
      const fontPx = Math.min(115, Math.max(52, cw * 0.168));
      dpr = Math.min(2, window.devicePixelRatio || 1);
      particles = sample(fontPx);
      w = Math.max(1, parseFloat(wrap.style.width) || 1);
      h = Math.max(1, parseFloat(wrap.style.height) || 1);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const localPoint = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };

    const onMove = (event: PointerEvent) => {
      const p = localPoint(event);
      mouse.x = p.x;
      mouse.y = p.y;
      mouse.inside = true;
    };
    const onDown = (event: PointerEvent) => {
      canvas.setPointerCapture(event.pointerId);
      mouse.down = true;
      onMove(event);
    };
    const onUp = () => {
      mouse.down = false;
    };
    const onLeave = () => {
      if (!mouse.down) {
        mouse.inside = false;
        mouse.x = -9999;
        mouse.y = -9999;
      }
    };

    const tick = (ts: number) => {
      if (disposed) return;
      raf = requestAnimationFrame(tick);
      if (document.visibilityState === "hidden") return;
      if (!start) start = ts;
      const dt = Math.min(0.033, last ? (ts - last) / 1000 : 0.016);
      last = ts;
      const t = (ts - start) / 1000;
      const gather = Math.min(1, t / 1.15);

      ctx.clearRect(0, 0, w, h);
      const radius = mouse.down ? 128 : 78;
      const push = mouse.down ? 2400 : 980;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const tremble = 0.55 + (mouse.inside ? 0.7 : 0);
        const tx = p.hx + Math.sin(t * 7.4 + p.phase) * tremble;
        const ty = p.hy + Math.cos(t * 6.1 + p.phase * 1.13) * tremble * 0.85;
        const spring = 18 + gather * 46;
        let ax = (tx - p.x) * spring;
        let ay = (ty - p.y) * spring;
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < radius * radius && d2 > 0.25) {
          const d = Math.sqrt(d2);
          const falloff = 1 - d / radius;
          const f = (push * falloff * falloff) / d;
          ax += dx * f;
          ay += dy * f;
        }
        p.vx = (p.vx + ax * dt) * 0.78;
        p.vy = (p.vy + ay * dt) * 0.78;
        p.x += p.vx * dt * 60;
        p.y += p.vy * dt * 60;
        const a = 0.55 + gather * 0.45;
        ctx.fillStyle = `rgba(${ACCENT.r},${ACCENT.g},${ACCENT.b},${a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    let ro: ResizeObserver | null = null;
    void document.fonts.ready.then(() => {
      if (disposed) return;
      resize();
      start = 0;
      raf = requestAnimationFrame(tick);
      ro = new ResizeObserver(() => resize());
      if (wrap.parentElement) ro.observe(wrap.parentElement);
    });

    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("pointerleave", onLeave);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro?.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [text, reducedMotion]);

  return (
    <span
      ref={wrapRef}
      className="hero-ask-where relative inline-block align-baseline"
      aria-label={text}
    >
      {reducedMotion ? (
        text
      ) : (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 size-full cursor-pointer touch-none"
          aria-hidden="true"
        />
      )}
    </span>
  );
}
