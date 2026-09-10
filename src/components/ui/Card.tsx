import { Slot } from "@radix-ui/react-slot";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type CardProps = ComponentProps<"article"> & {
  asChild?: boolean;
  interactive?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  variant?: "default" | "stat";
};

export function Card({
  className,
  asChild = false,
  interactive = false,
  padding = "md",
  variant = "default",
  children,
  ...props
}: CardProps) {
  const Comp = asChild ? Slot : "article";
  return (
    <Comp
      className={cn(
        "bg-card text-fg shadow-border min-w-0 rounded-xl",
        padding === "sm" && "p-4",
        padding === "md" && "p-5",
        padding === "lg" && "p-6",
        variant === "stat" &&
          "relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-accent/60",
        interactive &&
          "transition-[box-shadow,transform] duration-150 ease-out hover:-translate-y-0.5 hover:shadow-border-hover",
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function CardHeader({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("flex items-start justify-between gap-3", className)}>{children}</div>
  );
}

export function CardTitle({ className, children }: { className?: string; children: ReactNode }) {
  return <h3 className={cn("text-lg font-medium tracking-tight text-fg", className)}>{children}</h3>;
}

export function CardDescription({ className, children }: { className?: string; children: ReactNode }) {
  return <p className={cn("mt-2 text-sm leading-relaxed text-muted", className)}>{children}</p>;
}

export function CardMeta({ className, children }: { className?: string; children: ReactNode }) {
  return <p className={cn("kicker text-muted", className)}>{children}</p>;
}
