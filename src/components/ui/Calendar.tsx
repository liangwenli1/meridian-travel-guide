import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, type DayPickerProps } from "react-day-picker";
import { cn } from "@/lib/utils";

export function Calendar({ className, classNames, showOutsideDays = true, ...props }: DayPickerProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col",
        month: "space-y-3",
        month_caption: "relative flex h-9 items-center justify-center",
        caption_label: "text-sm font-medium tracking-tight",
        nav: "absolute inset-x-0 top-0 flex items-center justify-between",
        button_previous: cn(
          "inline-flex size-8 items-center justify-center rounded-full text-muted",
          "hover:bg-void-elevated hover:text-fg",
        ),
        button_next: cn(
          "inline-flex size-8 items-center justify-center rounded-full text-muted",
          "hover:bg-void-elevated hover:text-fg",
        ),
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "w-9 text-center text-2xs tracking-[0.14em] text-muted uppercase",
        week: "mt-1 flex w-full",
        day: "relative size-9 p-0 text-center text-sm",
        day_button: cn(
          "size-9 rounded-full text-fg",
          "hover:bg-void-elevated focus-visible:shadow-border-hover",
        ),
        selected: "[&_button]:bg-accent [&_button]:text-void [&_button]:hover:bg-accent-dim",
        today: "[&_button]:font-medium [&_button]:text-accent [&.rdp-selected_button]:text-void",
        outside: "opacity-35",
        disabled: "opacity-30",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? (
            <ChevronLeft className="size-4" strokeWidth={1.75} />
          ) : (
            <ChevronRight className="size-4" strokeWidth={1.75} />
          ),
      }}
      {...props}
    />
  );
}
