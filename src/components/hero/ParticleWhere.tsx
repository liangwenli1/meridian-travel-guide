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

const ACCENT = "rgb(212 240 60)";

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
    if (!wrap || !canvas || reducedMotion) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let disposed = false;
    let raf = 0;
    let particles: Particle[] = [];
    let w = 1;
    let h = 1;
    let dpr = 1;
    let glyphW = 1;
    let glyphH = 1;
    const padX = 48;
    const padY = 90;
    let start = 0;
    let last = 0;
    const mouse = { x: -9999, y: -9999, down: false, inside: false };

    const sample = () => {
      const cs = getComputedStyle(wrap);
      const fontPx = parseFloat(cs.fontSize) || 72;
      const off = document.createElement("canvas");
      const ox = off.getContext("2d", { willReadFrequently: true });
      if (!ox) return { pts: [] as Particle[], width: 2, height: 2 };
      const font = `${cs.fontWeight} ${fontPx}px ${cs.fontFamily}`;
      ox.font = font;
      const metrics = ox.measureText(text);
      const width = Math.max(2, Math.ceil(metrics.width + 2));
      const height = Math.max(2, Math.ceil(fontPx * 1.05));
      off.width = width;
      off.height = height;
      ox.font = font;
      ox.textBaseline = "alphabetic";
      ox.fillStyle = "#fff";
      ox.fillText(text, 0, fontPx * 0.82);
      const data = ox.getImageData(0, 0, width, height).data;
      const step = 1;
      const pts: Particle[] = [];
      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          if (data[(y * width + x) * 4 + 3] < 90) continue;
          if (Math.random() > 0.72) continue;
          const hx = x + Math.random() * 0.6 + 48;
          const hy = y + Math.random() * 0.6 + 90;
          const angle = Math.random() * Math.PI * 2;
          const dist = 80 + Math.random() * 280;
          pts.push({
            hx,
            hy,
            x: hx + Math.cos(angle) * dist,
            y: hy + Math.sin(angle) * dist,
            vx: 0,
            vy: 0,
            size: 0.95 + Math.random() * 0.7,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
      return { pts, width, height };
    };

    const resize = () => {
      const next = sample();
      particles = next.pts;
      glyphW = next.width;
      glyphH = next.height;
      w = next.width + padX + 720;
      h = next.height + padY + 56;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.style.left = `-${padX}px`;
      canvas.style.top = `-${padY}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const localPoint = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const sx = w / Math.max(1, rect.width);
      const sy = h / Math.max(1, rect.height);
      return { x: (event.clientX - rect.left) * sx, y: (event.clientY - rect.top) * sy };
    };

    const onMove = (event: PointerEvent) => {
      const p = localPoint(event);
      mouse.x = p.x;
      mouse.y = p.y;
      const over =
        p.x > padX - 28 &&
        p.x < padX + glyphW + 28 &&
        p.y > padY - 28 &&
        p.y < padY + glyphH + 28;
      mouse.inside = over || mouse.down;
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
      const gather = Math.min(1, t / 1.05);

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = ACCENT;
      const formed = gather >= 1;
      const active = mouse.inside || mouse.down;
      const radius = mouse.down ? 78 : active ? 42 : 0;
      const push = mouse.down ? 2600 : 720;
      const spring = mouse.down ? 3.2 : formed ? 9.5 : 34 + gather * 24;
      const damp = mouse.down ? 0.9 : 0.84;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const mdx = p.hx - mouse.x;
        const mdy = p.hy - mouse.y;
        const near = active && mdx * mdx + mdy * mdy < 52 * 52;
        const tremble = 0.22 + (near ? 0.28 : 0);
        const tx = p.hx + Math.sin(t * 5.4 + p.phase) * tremble;
        const ty = p.hy + Math.cos(t * 4.6 + p.phase) * tremble * 0.75;
        let ax = (tx - p.x) * spring;
        let ay = (ty - p.y) * spring;
        if (radius > 0) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < radius * radius && d2 > 0.2) {
            const d = Math.sqrt(d2);
            const falloff = 1 - d / radius;
            const f = (push * falloff * falloff) / d;
            ax += dx * f;
            ay += dy * f;
          }
        }
        p.vx = (p.vx + ax * dt) * damp;
        p.vy = (p.vy + ay * dt) * damp;
        p.x += p.vx * dt * 60;
        p.y += p.vy * dt * 60;
        ctx.globalAlpha = 0.7 + gather * 0.3;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
      ctx.globalAlpha = 1;
    };

    let ro: ResizeObserver | null = null;
    void document.fonts.ready.then(() => {
      if (disposed) return;
      resize();
      start = 0;
      raf = requestAnimationFrame(tick);
      ro = new ResizeObserver(() => {
        start = 0;
        resize();
      });
      ro.observe(wrap);
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
      className="hero-ask-where relative z-10 inline-block shrink-0 overflow-visible align-baseline"
      aria-label={text}
    >
      <span className="invisible select-none" aria-hidden="true">
        {text}
      </span>
      {reducedMotion ? null : (
        <canvas
          ref={canvasRef}
          className="pointer-events-auto absolute cursor-pointer touch-none"
          aria-hidden="true"
        />
      )}
    </span>
  );
}
