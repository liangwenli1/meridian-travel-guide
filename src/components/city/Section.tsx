import type { ReactNode } from "react";

export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 border-t border-line-paper py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        {eyebrow ? (
          <p className="mb-2 text-[11px] tracking-[0.18em] text-muted-paper uppercase">{eyebrow}</p>
        ) : null}
        <h2 className="font-display text-3xl tracking-tight text-ink italic md:text-4xl">{title}</h2>
        {intro ? <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-soft">{intro}</p> : null}
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}
