import { useEffect, useRef } from "react";

type Particle = {
  lx: number;
  ly: number;
  sx: number;
  sy: number;
  c1x: number;
  c1y: number;
  c2x: number;
  c2y: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  delay: number;
  duration: number;
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

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || reducedMotion) return;

    const host = wrap.closest("#hero") as HTMLElement | null;
    if (!host) return;

    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "position:absolute;inset:0;z-index:25;pointer-events:none;";
    host.appendChild(canvas);
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) {
      canvas.remove();
      return;
    }

    let disposed = false;
    let raf = 0;
    let particles: Particle[] = [];
    let w = 1;
    let h = 1;
    let dpr = 1;
    let originX = 0;
    let originY = 0;
    let start = 0;
    let last = 0;
    const mouse = { x: -9999, y: -9999, px: -9999, py: -9999, vx: 0, vy: 0 };

    const glyphDots = () => {
      const cs = getComputedStyle(wrap);
      const fontPx = parseFloat(cs.fontSize) || 72;
      const off = document.createElement("canvas");
      const ox = off.getContext("2d", { willReadFrequently: true });
      if (!ox) return [] as { lx: number; ly: number; size: number }[];
      const font = `${cs.fontWeight} ${fontPx}px ${cs.fontFamily}`;
      ox.font = font;
      const width = Math.max(2, Math.ceil(ox.measureText(text).width + 2));
      const height = Math.max(2, Math.ceil(fontPx * 1.05));
      off.width = width;
      off.height = height;
      ox.font = font;
      ox.textBaseline = "alphabetic";
      ox.fillStyle = "#fff";
      ox.fillText(text, 0, fontPx * 0.82);
      const data = ox.getImageData(0, 0, width, height).data;
      const dots: { lx: number; ly: number; size: number }[] = [];
      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          if (data[(y * width + x) * 4 + 3] < 90) continue;
          if (Math.random() > 0.7) continue;
          dots.push({
            lx: x + Math.random() * 0.5,
            ly: y + Math.random() * 0.5,
            size: 0.9 + Math.random() * 0.75,
          });
        }
      }
      return dots;
    };

    const layoutCanvas = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = Math.max(1, host.clientWidth);
      h = Math.max(1, host.clientHeight);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const hostRect = host.getBoundingClientRect();
      const wrapRect = wrap.getBoundingClientRect();
      originX = wrapRect.left - hostRect.left;
      originY = wrapRect.top - hostRect.top;
    };

    const seed = () => {
      layoutCanvas();
      const dots = glyphDots();
      particles = dots.map((dot) => {
        const sx = Math.random() * w;
        const sy = Math.random() * h;
        const hx = originX + dot.lx;
        const hy = originY + dot.ly;
        const a1 = Math.random() * Math.PI * 2;
        const a2 = Math.random() * Math.PI * 2;
        const d1 = 80 + Math.random() * Math.max(w, h) * 0.55;
        const d2 = 80 + Math.random() * Math.max(w, h) * 0.55;
        return {
          lx: dot.lx,
          ly: dot.ly,
          sx,
          sy,
          c1x: sx + Math.cos(a1) * d1,
          c1y: sy + Math.sin(a1) * d1,
          c2x: hx + Math.cos(a2) * d2,
          c2y: hy + Math.sin(a2) * d2,
          x: sx,
          y: sy,
          vx: 0,
          vy: 0,
          size: dot.size,
          delay: Math.random() * 1.4,
          duration: 1.1 + Math.random() * 4.4,
        };
      });
      start = 0;
    };

    const onMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    };

    const tick = (ts: number) => {
      if (disposed) return;
      raf = requestAnimationFrame(tick);
      if (document.visibilityState === "hidden") return;
      if (!start) start = ts;
      last = ts;
      const t = (ts - start) / 1000;

      if (mouse.px < -900) {
        mouse.px = mouse.x;
        mouse.py = mouse.y;
      }
      mouse.vx = mouse.x - mouse.px;
      mouse.vy = mouse.y - mouse.py;
      mouse.px = mouse.x;
      mouse.py = mouse.y;
      const swipe = Math.hypot(mouse.vx, mouse.vy);
      const radius = 130 + Math.min(160, swipe * 10);

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = ACCENT;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const hx = originX + p.lx;
        const hy = originY + p.ly;
        const u = Math.min(1, Math.max(0, (t - p.delay) / p.duration));
        const e = 1 - (1 - u) ** 3;
        const gathering = u < 1;

        if (gathering) {
          const o = 1 - e;
          p.x = o * o * o * p.sx + 3 * o * o * e * p.c1x + 3 * o * e * e * p.c2x + e * e * e * hx;
          p.y = o * o * o * p.sy + 3 * o * o * e * p.c1y + 3 * o * e * e * p.c2y + e * e * e * hy;
          p.vx = 0;
          p.vy = 0;
        } else {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (swipe > 0.35 && d2 < radius * radius && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const falloff = 1 - d / radius;
            const wind = falloff * falloff;
            p.vx += mouse.vx * wind * 2.2;
            p.vy += mouse.vy * wind * 2.2;
            p.vx += -mouse.vy * wind * 0.45;
            p.vy += mouse.vx * wind * 0.45;
            p.vx += (dx / d) * wind * 1.1;
            p.vy += (dy / d) * wind * 1.1;
          }
          p.vx += (hx - p.x) * 0.028;
          p.vy += (hy - p.y) * 0.028;
          p.vx *= 0.92;
          p.vy *= 0.92;
          const v = Math.hypot(p.vx, p.vy);
          if (v > 22) {
            p.vx *= 22 / v;
            p.vy *= 22 / v;
          }
          p.x += p.vx;
          p.y += p.vy;
          if (v < 0.05 && Math.abs(hx - p.x) < 0.4 && Math.abs(hy - p.y) < 0.4) {
            p.x = hx;
            p.y = hy;
            p.vx = 0;
            p.vy = 0;
          }
        }

        ctx.globalAlpha = 0.55 + e * 0.45;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
      ctx.globalAlpha = 1;
    };

    let ro: ResizeObserver | null = null;
    void document.fonts.ready.then(() => {
      if (disposed) return;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (disposed) return;
          seed();
          raf = requestAnimationFrame(tick);
          ro = new ResizeObserver(() => layoutCanvas());
          ro.observe(host);
          ro.observe(wrap);
        });
      });
    });

    window.addEventListener("pointermove", onMove);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro?.disconnect();
      window.removeEventListener("pointermove", onMove);
      canvas.remove();
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
