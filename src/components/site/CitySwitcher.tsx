import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Globe } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { t, useI18n } from "@/lib/i18n";
import { getHomeCatalog } from "@/lib/server/catalog";
import { cn } from "@/lib/utils";
import type { City } from "@/types/catalog";

export function CitySwitcher() {
  const locale = useI18n((s) => s.locale);
  const strings = t(locale);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    void getHomeCatalog()
      .then((data) => setCities(data.cities))
      .catch(() => setCities([]));
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={strings.switchCity}
          className="grid size-9 place-items-center rounded-full bg-void-elevated text-fg shadow-border outline-none hover:shadow-border-hover focus-visible:shadow-border-hover"
        >
          <Globe className="size-4" strokeWidth={1.75} />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 p-2">
        <p className="px-2 py-1.5 text-[11px] tracking-[0.16em] text-muted uppercase">{strings.switchCity}</p>
        <ul className="grid grid-cols-2 gap-1">
          {cities.map((city) => {
            const href = `/${city.countrySlug}/${city.slug}`;
            const current = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <li key={city.id}>
                <Link
                  to="/$country/$city"
                  params={{ country: city.countrySlug, city: city.slug }}
                  search={{ s: "overview" }}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block rounded-xl px-2.5 py-2 text-sm transition-colors",
                    current ? "bg-accent text-void" : "text-fg hover:bg-void-elevated",
                  )}
                >
                  <span className="block truncate font-medium">{city.name}</span>
                  <span className={cn("mt-0.5 block truncate text-xs", current ? "text-void/70" : "text-muted")}>
                    {city.country}
                    {city.contentStatus === "coming-soon" ? ` · ${strings.comingSoon}` : ""}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
