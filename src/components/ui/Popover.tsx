import * as PopoverPrimitive from "@radix-ui/react-popover";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Popover({
  modal = false,
  ...props
}: ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root modal={modal} {...props} />;
}
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverAnchor = PopoverPrimitive.Anchor;

export function PopoverContent({
  className,
  align = "start",
  sideOffset = 8,
  ...props
}: ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "menu-surface z-50 origin-[var(--radix-popover-content-transform-origin)] rounded-2xl bg-card p-2 text-fg shadow-border outline-none",
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}
