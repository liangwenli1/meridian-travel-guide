import { useEffect, useRef } from "react";

export function AmbientParticles() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const dots = Array.from({ length: reduce ? 18 : 48 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.4 + Math.random() * 1.2,
      s: 0.04 + Math.random() * 0.08,
      a: 0.12 + Math.random() * 0.22,
    }));

    const draw = () => {
      if (document.hidden) {
        raf = 0;
        return;
      }
      const parent = canvas.parentElement ?? canvas;
      const w = parent.clientWidth || window.innerWidth;
      const h = parent.clientHeight || window.innerHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      ctx.clearRect(0, 0, w, h);
      for (const dot of dots) {
        if (!reduce) {
          dot.y -= dot.s / 600;
          if (dot.y < 0) dot.y = 1;
        }
        ctx.beginPath();
        ctx.fillStyle = `rgba(212, 240, 60, ${dot.a * 0.55})`;
        ctx.arc(dot.x * w, dot.y * h, dot.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
        return;
      }
      if (!raf) raf = requestAnimationFrame(draw);
    };
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 z-0 size-full"
      aria-hidden="true"
    />
  );
}
