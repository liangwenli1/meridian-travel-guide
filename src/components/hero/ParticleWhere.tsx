import { useEffect, useRef } from "react";

type Particle = {
  lx: number;
  ly: number;
  sx: number;
  sy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  delay: number;
};

const ACCENT = "rgb(212 240 60)";
const GATHER_S = 3.1;

function easeOut(u: number) {
  const t = Math.min(1, Math.max(0, u));
  return 1 - (1 - t) ** 3;
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
    if (!wrap || reducedMotion) return;

    const host = wrap.closest("#hero") as HTMLElement | null;
    if (!host) return;

    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "position:absolute;inset:0;z-index:15;pointer-events:none;";
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
    const mouse = { x: -9999, y: -9999, px: -9999, py: -9999, vx: 0, vy: 0, down: false };

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
        return {
          lx: dot.lx,
          ly: dot.ly,
          sx,
          sy,
          x: sx,
          y: sy,
          vx: 0,
          vy: 0,
          size: dot.size,
          delay: Math.random() * 0.95,
        };
      });
      start = 0;
    };

    const onMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      mouse.px = mouse.x;
      mouse.py = mouse.y;
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    };
    const onDown = () => {
      mouse.down = true;
    };
    const onUp = () => {
      mouse.down = false;
    };
    const onLeave = () => {
      if (!mouse.down) {
        mouse.x = -9999;
        mouse.y = -9999;
        mouse.vx = 0;
        mouse.vy = 0;
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

      if (mouse.x > -900) {
        mouse.vx += (mouse.x - mouse.px - mouse.vx) * 0.35;
        mouse.vy += (mouse.y - mouse.py - mouse.vy) * 0.35;
        mouse.px = mouse.x;
        mouse.py = mouse.y;
      }

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = ACCENT;
      const radius = mouse.down ? 118 : 86;
      const push = mouse.down ? 2400 : 1100;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const hx = originX + p.lx;
        const hy = originY + p.ly;
        const u = easeOut((t - p.delay) / GATHER_S);
        const dxm = p.x - mouse.x;
        const dym = p.y - mouse.y;
        const d2 = dxm * dxm + dym * dym;
        const near = d2 < radius * radius && mouse.x > -900;

        if (u < 1 && !near) {
          p.x = p.sx + (hx - p.sx) * u;
          p.y = p.sy + (hy - p.sy) * u;
          p.vx = 0;
          p.vy = 0;
        } else {
          let ax = (hx - p.x) * (near ? 1.6 : 5.5);
          let ay = (hy - p.y) * (near ? 1.6 : 5.5);
          if (near && d2 > 0.2) {
            const d = Math.sqrt(d2);
            const falloff = 1 - d / radius;
            const f = (push * falloff * falloff) / d;
            ax += dxm * f;
            ay += dym * f;
            ax += mouse.vx * falloff * 55;
            ay += mouse.vy * falloff * 55;
          }
          p.vx = (p.vx + ax * dt) * (near ? 0.92 : 0.84);
          p.vy = (p.vy + ay * dt) * (near ? 0.92 : 0.84);
          p.x += p.vx * dt * 60;
          p.y += p.vy * dt * 60;
        }

        ctx.globalAlpha = 0.5 + u * 0.5;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
      ctx.globalAlpha = 1;
    };

    let ro: ResizeObserver | null = null;
    void document.fonts.ready.then(() => {
      if (disposed) return;
      seed();
      raf = requestAnimationFrame(tick);
      ro = new ResizeObserver(() => {
        layoutCanvas();
      });
      ro.observe(host);
      ro.observe(wrap);
    });

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    host.addEventListener("pointerleave", onLeave);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro?.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      host.removeEventListener("pointerleave", onLeave);
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
