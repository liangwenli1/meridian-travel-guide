import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Avatar({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-full bg-void-elevated text-sm font-medium text-fg shadow-border",
        className,
      )}
      {...props}
    />
  );
}

export function AvatarImage({ className, alt = "", ...props }: ComponentProps<"img">) {
  return <img alt={alt} className={cn("absolute inset-0 size-full object-cover", className)} {...props} />;
}

export function AvatarFallback({ className, ...props }: ComponentProps<"span">) {
  return <span className={cn("leading-none", className)} {...props} />;
}
