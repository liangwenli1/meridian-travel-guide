import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardMeta, CardTitle } from "@/components/ui/Card";
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
}: {
  kicker: string;
  title: string;
  dek?: string;
  nav: DeskLink[];
  children: ReactNode;
  tone?: "traveler" | "ops";
}) {
  return (
    <main className="min-h-dvh bg-void text-fg">
      <SiteHeader />
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 md:grid-cols-[13.5rem_minmax(0,1fr)] md:py-14 lg:px-10">
        <aside className="md:pt-2">
          <p className="kicker text-accent">{kicker}</p>
          <h1 className="mt-3 text-3xl font-medium tracking-tight">{title}</h1>
          {dek ? <p className="mt-3 text-sm leading-relaxed text-muted">{dek}</p> : null}
          <nav className="mt-8 flex gap-2 overflow-x-auto md:flex-col md:gap-1">
            {nav.map((item) =>
              item.onClick ? (
                <Button
                  key={item.label}
                  type="button"
                  variant={item.current ? "default" : "ghost"}
                  size="sm"
                  className="justify-start"
                  onClick={item.onClick}
                >
                  {item.label}
                </Button>
              ) : (
                <Button key={item.to + item.label} asChild variant={item.current ? "default" : "ghost"} size="sm" className="justify-start">
                  <Link to={item.to ?? "/"}>{item.label}</Link>
                </Button>
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
    <Card padding="lg">
      {meta ? <CardMeta>{meta}</CardMeta> : null}
      <CardTitle className={cn(meta && "mt-2")}>{title}</CardTitle>
      {children ? <CardDescription>{children}</CardDescription> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </Card>
  );
}

export function DeskStat({ label, value }: { label: string; value: string | number }) {
  return (
    <Card variant="stat" padding="md">
      <CardMeta>{label}</CardMeta>
      <p className="mt-2 font-mono text-2xl tabular-nums text-fg">{value}</p>
    </Card>
  );
}
