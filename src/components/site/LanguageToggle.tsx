import { ChevronDown, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { cn } from "@/lib/utils";
import { t, useI18n, type Locale } from "@/lib/i18n";

const OPTIONS: { id: Locale; labelKey: "langEnglish" | "langChinese" }[] = [
  { id: "en", labelKey: "langEnglish" },
  { id: "zh", labelKey: "langChinese" },
];

export function LanguageToggle({ className }: { className?: string }) {
  const locale = useI18n((s) => s.locale);
  const setLocale = useI18n((s) => s.setLocale);
  const strings = t(locale);
  const current = OPTIONS.find((option) => option.id === locale) ?? OPTIONS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={strings.language}
          className={cn(
            "inline-flex h-9 items-center gap-2 rounded-full bg-void-elevated px-3 text-sm text-fg shadow-border outline-none",
            "hover:shadow-border-hover focus-visible:shadow-border-hover",
            className,
          )}
        >
          <Globe className="size-3.5" strokeWidth={1.75} />
          <span>{strings[current.labelKey]}</span>
          <ChevronDown className="size-3.5 text-muted" strokeWidth={1.75} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        {OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.id}
            className={cn(locale === option.id && "bg-void-elevated text-accent")}
            onSelect={() => setLocale(option.id)}
          >
            {strings[option.labelKey]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
