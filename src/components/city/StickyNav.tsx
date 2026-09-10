import { useNavigate, useSearch } from "@tanstack/react-router";
import { GUIDE_NAV } from "@/lib/guide-nav";
import { t, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function StickyNav() {
  const locale = useI18n((s) => s.locale);
  const navigate = useNavigate({ from: "/$country/$city" });
  const search = useSearch({ from: "/$country/$city" });
  const active = search.s ?? "overview";

  const go = (id: (typeof GUIDE_NAV)[number]["id"]) => {
    void navigate({
      search: { s: id },
      replace: true,
    });
  };

  return (
    <nav
      id="guide-nav"
      aria-label={t(locale).onThisPage}
      className="sticky top-0 z-20 border-b border-line bg-void/90 backdrop-blur-md"
    >
      <div className="overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <ul className="mx-auto flex w-max min-w-full max-w-6xl flex-nowrap gap-1 px-4 py-2 md:px-8">
          {GUIDE_NAV.map((item) => (
            <li key={item.id} className="shrink-0">
              <button
                type="button"
                onClick={() => go(item.id)}
                aria-current={active === item.id ? "true" : undefined}
                className={cn(
                  "block min-h-9 whitespace-nowrap rounded-full px-3 py-2 text-sm transition-colors duration-150",
                  active === item.id ? "bg-accent text-void" : "text-muted hover:text-fg",
                )}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
