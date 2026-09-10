import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "kicker inline-flex shrink-0 items-center rounded-full px-2.5 py-1",
  {
    variants: {
      variant: {
        muted: "bg-void text-muted shadow-border",
        accent: "bg-accent/12 text-accent",
        ok: "bg-ok/12 text-ok",
        warn: "bg-warn/12 text-warn",
      },
    },
    defaultVariants: {
      variant: "muted",
    },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
