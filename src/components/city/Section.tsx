import type { ReactNode } from "react";

export function Section({
  id,
  show = true,
  eyebrow,
  title,
  intro,
  children,
}: {
  id: string;
  show?: boolean;
  eyebrow?: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  if (!show) return null;
  return (
    <section id={id} className="guide-panel border-t border-line py-14 md:py-20">
      <div className="guide-shell">
        {eyebrow ? <p className="kicker mb-2 text-accent">{eyebrow}</p> : null}
        <h2 className="text-3xl font-medium tracking-tight text-fg md:text-4xl">{title}</h2>
        {intro ? <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">{intro}</p> : null}
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}
