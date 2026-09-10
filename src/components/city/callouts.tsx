import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const styles = {
  "good-to-know": "ring-1 ring-ok/30 bg-ok/8",
  "local-tip": "shadow-border bg-card",
  "worth-it": "ring-1 ring-accent/30 bg-accent/8",
  "watch-out": "ring-1 ring-warn/30 bg-warn/8",
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
    <aside className={cn("rounded-lg px-4 py-3 text-sm leading-relaxed text-muted", styles[kind])}>
      <p className="kicker mb-1 text-fg">{title}</p>
      <div>{children}</div>
    </aside>
  );
}
