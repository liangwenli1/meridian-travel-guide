import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { t, useI18n } from "@/lib/i18n";
import { usePrefersReducedMotion } from "@/lib/motion";
import { getHomeCatalog } from "@/lib/server/catalog";
import { cn } from "@/lib/utils";
import type { City } from "@/types/catalog";

function WireGlobe({ reduced }: { reduced: boolean }) {
  return (
    <span className={cn("wire-globe", !reduced && "wire-globe-live")} aria-hidden>
      <span className="wire-globe-spin">
        <span className="wire-globe-limb" />
        <span className="wire-globe-ring wire-globe-eq" />
        <span className="wire-globe-ring wire-globe-m0" />
        <span className="wire-globe-ring wire-globe-m1" />
        <span className="wire-globe-ring wire-globe-m2" />
        <span className="wire-globe-ring wire-globe-n1" />
        <span className="wire-globe-ring wire-globe-s1" />
      </span>
    </span>
  );
}

export function CitySwitcher({ ghost = false }: { ghost?: boolean }) {
  const locale = useI18n((s) => s.locale);
  const strings = t(locale);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { reduced } = usePrefersReducedMotion();
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
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
          aria-label={strings.changeCity}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className={cn(
            "city-orb relative flex h-9 items-center overflow-hidden rounded-full text-left outline-none",
            "focus-visible:shadow-border-hover",
            ghost ? "city-orb-ghost bg-transparent" : "bg-void-elevated shadow-border hover:shadow-border-hover",
            reduced && "w-9",
            !reduced && "city-orb-loop",
            hover && !reduced && "city-orb-open",
          )}
        >
          <WireGlobe reduced={reduced} />
          <span className="city-orb-copy min-w-0 flex-1 truncate pr-3.5 pl-0.5 text-xs font-medium tracking-wide text-white">
            {strings.changeCity}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[22rem] p-2">
        <p className="px-2 py-1.5 text-[11px] tracking-[0.16em] text-muted uppercase">{strings.changeCity}</p>
        <ul className="grid grid-cols-3 gap-0.5">
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
                    "block truncate rounded-lg px-2 py-1.5 text-sm transition-colors",
                    current ? "bg-accent font-medium text-void" : "text-fg hover:bg-void-elevated",
                  )}
                >
                  {city.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
