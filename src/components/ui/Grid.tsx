import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type GridMin = "sm" | "md" | "lg";

const minClass: Record<GridMin, string> = {
  sm: "grid-fill-sm",
  md: "grid-fill-md",
  lg: "grid-fill-lg",
};

export function Grid({
  min = "md",
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { min?: GridMin }) {
  return <div className={cn(minClass[min], className)} {...props} />;
}

export function StatGrid({ className, ...props }: HTMLAttributes<HTMLDListElement>) {
  return <dl className={cn("stat-grid", className)} {...props} />;
}

export function StatCell({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="stat-cell">
      <dt className="kicker text-muted">{label}</dt>
      <dd className="mt-1 text-sm leading-snug text-fg">{value}</dd>
    </div>
  );
}
