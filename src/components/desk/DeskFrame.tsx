import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { cn } from "@/lib/utils";

export type DeskLink = {
  to?: string;
  label: string;
  current?: boolean;
  onClick?: () => void;
};

export function DeskFrame({
  kicker,
  title,
  dek,
  nav,
  children,
  tone = "traveler",
}: {
  kicker: string;
  title: string;
  dek?: string;
  nav: DeskLink[];
  children: ReactNode;
  tone?: "traveler" | "ops";
}) {
  return (
    <main className={cn("min-h-dvh bg-void text-fg", tone === "ops" && "bg-void")}>
      <SiteHeader />
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 md:grid-cols-[13.5rem_minmax(0,1fr)] md:py-14 lg:px-10">
        <aside className="md:pt-2">
          <p className="kicker text-accent">{kicker}</p>
          <h1 className="mt-3 text-3xl font-medium tracking-tight">{title}</h1>
          {dek ? <p className="mt-3 text-sm leading-relaxed text-muted">{dek}</p> : null}
          <nav className="mt-8 flex gap-2 overflow-x-auto md:flex-col md:gap-1">
            {nav.map((item) =>
              item.onClick ? (
                <button
                  key={item.label}
                  type="button"
                  onClick={item.onClick}
                  className={cn(
                    "shrink-0 rounded-full px-4 py-2 text-left text-sm transition-colors",
                    item.current
                      ? "bg-accent text-void"
                      : "text-muted hover:bg-void-elevated hover:text-fg",
                  )}
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  key={item.to + item.label}
                  to={item.to ?? "/"}
                  className={cn(
                    "shrink-0 rounded-full px-4 py-2 text-sm transition-colors",
                    item.current
                      ? "bg-accent text-void"
                      : "text-muted hover:bg-void-elevated hover:text-fg",
                  )}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>
        </aside>
        <section className="min-w-0">{children}</section>
      </div>
    </main>
  );
}

export function DeskCard({
  title,
  meta,
  children,
  action,
}: {
  title: string;
  meta?: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <article className="rounded-3xl bg-card p-6 shadow-border">
      {meta ? <p className="kicker text-muted">{meta}</p> : null}
      <h2 className={cn("text-lg font-medium tracking-tight", meta && "mt-2")}>{title}</h2>
      {children ? <div className="mt-3 text-sm leading-relaxed text-muted">{children}</div> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </article>
  );
}

export function DeskStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-3xl bg-card px-5 py-4 shadow-border">
      <p className="kicker text-muted">{label}</p>
      <p className="mt-2 font-mono text-2xl tabular-nums text-fg">{value}</p>
    </div>
  );
}
