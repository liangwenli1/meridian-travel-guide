import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-2xl bg-void-elevated px-4 py-3 text-sm text-fg shadow-border outline-none",
        "placeholder:text-muted focus-visible:shadow-border-hover disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
