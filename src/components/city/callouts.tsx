import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const styles = {
  "good-to-know": "border-ok/25 bg-ok/8",
  "local-tip": "border-ink/10 bg-paper-2",
  "worth-it": "border-ink/10 bg-paper-2",
  "watch-out": "border-warn/30 bg-warn/8",
} as const;

export function Callout({
  kind,
  title,
  children,
}: {
  kind: keyof typeof styles;
  title: string;
  children: ReactNode;
}) {
  return (
    <aside className={cn("rounded-[18px] border px-4 py-3 text-sm leading-relaxed text-ink-soft", styles[kind])}>
      <p className="mb-1 text-[11px] tracking-[0.16em] text-ink uppercase">{title}</p>
      <div>{children}</div>
    </aside>
  );
}
