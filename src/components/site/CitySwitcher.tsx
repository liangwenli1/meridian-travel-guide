import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { t, useI18n } from "@/lib/i18n";
import { usePrefersReducedMotion } from "@/lib/motion";
import { getHomeCatalog } from "@/lib/server/catalog";
import { cn } from "@/lib/utils";
import type { City } from "@/types/catalog";

const SLIDE_MS = 2200;
const REST_MS = 6000;
const HOLD_MS = 4000;

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
  const [autoOpen, setAutoOpen] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const pinned = hover || open;

  useEffect(() => {
    void getHomeCatalog()
      .then((data) => setCities(data.cities))
      .catch(() => setCities([]));
  }, []);

  useEffect(() => {
    setOpen(false);
    setHover(false);
    setAutoOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (reduced || pinned) return;
    let cancelled = false;
    let timer = 0;
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timer = window.setTimeout(resolve, ms);
      });
    const run = async () => {
      while (!cancelled) {
        await wait(REST_MS);
        if (cancelled) return;
        setAutoOpen(true);
        await wait(SLIDE_MS + HOLD_MS);
        if (cancelled) return;
        setAutoOpen(false);
        await wait(SLIDE_MS);
      }
    };
    void run();
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [reduced, pinned]);

  const expanded = !reduced && (pinned || autoOpen);

  return (
    <div
      onMouseLeave={() => setHover(false)}
      className={cn("city-orb relative flex h-9 items-center", expanded && "city-orb-open")}
    >
      <Link
        to="/"
        aria-label={strings.globe}
        onMouseEnter={() => setHover(true)}
        onFocus={() => setHover(true)}
        className={cn(
          "relative z-10 grid size-9 shrink-0 place-items-center rounded-full header-chip outline-none",
          ghost ? "bg-transparent" : "bg-void-elevated",
          "focus-visible:shadow-border-hover",
        )}
      >
        <WireGlobe reduced={reduced} />
      </Link>
      <Popover
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setHover(false);
        }}
      >
        <div className="city-orb-label">
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label={strings.changeCity}
              className="whitespace-nowrap px-3 text-sm font-medium tracking-[0.14em] text-fg uppercase outline-none [text-shadow:0_1px_8px_rgb(0_0_0/0.65)]"
            >
              {strings.changeCity}
            </button>
          </PopoverTrigger>
        </div>
        <PopoverContent align="end" className="w-[22rem] p-2">
          <p className="px-2 py-1.5 text-[11px] tracking-[0.16em] text-muted uppercase">{strings.changeCity}</p>
          <ul className="city-list grid grid-cols-3 gap-0.5">
            {cities.map((city) => {
              const href = `/${city.countrySlug}/${city.slug}`;
              const current = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <li key={city.id}>
                  <Link
                    to="/$country/$city"
                    params={{ country: city.countrySlug, city: city.slug }}
                    search={{ s: "overview" }}
                    onClick={() => {
                      setOpen(false);
                      setHover(false);
                      setAutoOpen(false);
                    }}
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
    </div>
  );
}
