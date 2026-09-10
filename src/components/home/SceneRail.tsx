import { HOME_PAGES, type HomePageId } from "@/lib/home-pages";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function SceneRail({
  active,
  onSelect,
}: {
  active: HomePageId;
  onSelect: (id: HomePageId) => void;
}) {
  const locale = useI18n((s) => s.locale);

  return (
    <nav
      aria-label={locale === "zh" ? "场景" : "Scenes"}
      className="pointer-events-auto fixed top-1/2 right-3 z-40 hidden -translate-y-1/2 md:right-5 md:block"
    >
      <ol className="flex flex-col gap-2">
        {HOME_PAGES.map((page, index) => {
          const current = page.id === active;
          return (
            <li key={page.id}>
              <button
                type="button"
                onClick={() => onSelect(page.id)}
                className={cn(
                  "flex min-h-10 items-center gap-2 text-left transition-colors duration-150",
                  current ? "text-accent" : "text-muted hover:text-fg",
                )}
              >
                <span
                  className={cn(
                    "block h-px w-4 transition-[width,background-color] duration-200",
                    current ? "w-7 bg-accent" : "bg-line-strong",
                  )}
                />
                <span className="font-mono text-2xs tracking-[0.18em]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="sr-only">{locale === "zh" ? page.zh : page.en}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
