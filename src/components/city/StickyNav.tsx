import { useLayoutEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  GUIDE_NAV_MORE,
  GUIDE_NAV_PRIMARY,
  type GuideSectionId,
} from "@/lib/guide-nav";
import { t, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";

export function StickyNav() {
  const locale = useI18n((s) => s.locale);
  const strings = t(locale);
  const navigate = useNavigate({ from: "/$country/$city" });
  const search = useSearch({ from: "/$country/$city" });
  const active = search.s ?? "overview";
  const fromClick = useRef(false);
  const moreActive = GUIDE_NAV_MORE.some((item) => item.id === active);

  const go = (id: GuideSectionId) => {
    if (id === active) return;
    fromClick.current = true;
    void navigate({
      search: { s: id },
      replace: true,
      resetScroll: false,
    });
  };

  useLayoutEffect(() => {
    if (!fromClick.current) return;
    fromClick.current = false;
    document.getElementById("guide-nav")?.scrollIntoView({ behavior: "instant", block: "start" });
  }, [active]);

  const label = (key: keyof typeof strings) => strings[key] as string;

  return (
    <nav
      id="guide-nav"
      aria-label={strings.onThisPage}
      className="sticky top-0 z-20 border-b border-line bg-void/90 backdrop-blur-md"
    >
      <div className="overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <ul className="guide-shell flex w-max min-w-full flex-nowrap items-center gap-1 py-2">
          {GUIDE_NAV_PRIMARY.map((item) => (
            <li key={item.id} className="shrink-0">
              <button
                type="button"
                onClick={() => go(item.id)}
                aria-current={active === item.id ? "true" : undefined}
                aria-selected={active === item.id}
                className={cn(
                  "block min-h-9 whitespace-nowrap rounded-full px-3 py-2 text-sm transition-colors duration-150",
                  active === item.id ? "bg-accent text-void" : "text-muted hover:text-fg",
                )}
              >
                {label(item.labelKey)}
              </button>
            </li>
          ))}
          <li className="shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-current={moreActive ? "true" : undefined}
                  className={cn(
                    "flex min-h-9 items-center gap-1 whitespace-nowrap rounded-full px-3 py-2 text-sm transition-colors duration-150",
                    moreActive ? "bg-accent text-void" : "text-muted hover:text-fg",
                  )}
                >
                  {moreActive
                    ? label(GUIDE_NAV_MORE.find((item) => item.id === active)!.labelKey)
                    : strings.navMore}
                  <ChevronDown className="size-3.5 opacity-70" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {GUIDE_NAV_MORE.map((item) => (
                  <DropdownMenuItem
                    key={item.id}
                    onSelect={() => go(item.id)}
                    className={cn(active === item.id && "bg-void-elevated")}
                  >
                    {label(item.labelKey)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        </ul>
      </div>
    </nav>
  );
}
