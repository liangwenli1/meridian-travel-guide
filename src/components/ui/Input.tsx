import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-2xl bg-void-elevated px-4 text-sm text-fg shadow-border outline-none",
        "placeholder:text-muted focus-visible:shadow-border-hover disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
