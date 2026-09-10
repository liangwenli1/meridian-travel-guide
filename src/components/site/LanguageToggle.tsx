import { cn } from "@/lib/utils";
import { useI18n, type Locale } from "@/lib/i18n";

const OPTIONS: { id: Locale; label: string }[] = [
  { id: "zh", label: "简体中文" },
  { id: "en", label: "English" },
];

export function LanguageToggle({ className }: { className?: string }) {
  const locale = useI18n((s) => s.locale);
  const setLocale = useI18n((s) => s.setLocale);

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full bg-void-elevated p-1 shadow-border",
        className,
      )}
      role="group"
      aria-label="Language"
    >
      {OPTIONS.map((option) => (
        <button
          key={option.id}
          type="button"
          className={cn(
            "rounded-full px-3 py-1.5 text-sm transition-colors duration-150",
            locale === option.id ? "bg-accent font-medium text-void" : "text-muted hover:text-fg",
          )}
          aria-pressed={locale === option.id}
          onClick={() => setLocale(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
