import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { listPublishedCities } from "@/lib/server/catalog";
import { t, useI18n } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import type { City } from "@/types/catalog";

export function SiteFooter() {
  const locale = useI18n((s) => s.locale);
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    void listPublishedCities()
      .then(setCities)
      .catch(() => setCities([]));
  }, []);

  return (
    <footer className="relative z-10 border-t border-line bg-void">
      <div className="grid gap-10 px-6 py-12 md:grid-cols-[minmax(0,18rem)_1fr_auto] md:items-start md:gap-16 md:px-10 lg:px-14 lg:py-16">
        <div>
          <p className="text-lg font-medium tracking-tight text-fg">{SITE.name}</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">{SITE.tagline}</p>
        </div>
        <nav aria-label={t(locale).guidesKicker}>
          <p className="kicker text-muted">{t(locale).guidesKicker}</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-4">
            {cities.map((city) => (
              <li key={city.id}>
                <Link
                  to="/$country/$city"
                  params={{ country: city.countrySlug, city: city.slug }}
                  search={{ s: "overview" }}
                  className="text-sm text-fg/80 transition-colors hover:text-accent"
                >
                  {city.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:pt-6">
          <Link to="/" className="text-sm text-fg/80 transition-colors hover:text-accent">
            {t(locale).globe}
          </Link>
        </div>
      </div>
      <p className="px-6 pb-8 text-xs text-muted md:px-10 lg:px-14">
        © {new Date().getFullYear()} {SITE.name}. Land outlines: Natural Earth (public domain). City photos: Unsplash.
      </p>
    </footer>
  );
}
