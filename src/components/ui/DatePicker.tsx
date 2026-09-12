import { CalendarDays } from "lucide-react";
import { useState } from "react";
import { enUS, zhCN } from "date-fns/locale";
import { Calendar } from "@/components/ui/Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";

function parseLocalYmd(value: string): Date | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return undefined;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

function toLocalYmd(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDisplay(value: string, locale: Locale): string {
  const date = parseLocalYmd(value);
  if (!date) return value;
  if (locale === "zh") {
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
  }
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function DatePicker({
  value,
  onChange,
  locale = "en",
  className,
}: {
  value: string;
  onChange: (next: string) => void;
  locale?: Locale;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = parseLocalYmd(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-12 w-full items-center justify-between rounded-2xl bg-void-elevated px-4 text-left text-sm text-fg shadow-border outline-none",
            "hover:shadow-border-hover focus-visible:shadow-border-hover",
            className,
          )}
        >
          <span>{formatDisplay(value, locale)}</span>
          <CalendarDays className="size-4 shrink-0 text-muted" strokeWidth={1.75} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-1">
        <Calendar
          mode="single"
          selected={selected}
          defaultMonth={selected}
          locale={locale === "zh" ? zhCN : enUS}
          onSelect={(date) => {
            if (!date) return;
            onChange(toLocalYmd(date));
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
