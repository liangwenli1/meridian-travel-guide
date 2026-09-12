import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { listPublishedCities } from "@/lib/server/catalog";
import { LanguageToggle } from "@/components/site/LanguageToggle";
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
      <div className="flex flex-col gap-10 px-6 py-12 md:flex-row md:items-start md:justify-between md:gap-16 md:px-10 lg:px-14 lg:py-16">
        <div className="shrink-0 md:max-w-xs">
          <p className="text-lg font-medium tracking-tight text-fg">{SITE.name}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">{SITE.tagline}</p>
        </div>
        <nav aria-label={t(locale).guidesKicker} className="min-w-0 md:pt-0.5">
          <p className="kicker text-muted">{t(locale).guidesKicker}</p>
          <ul className="mt-4 flex max-w-xl flex-wrap gap-x-5 gap-y-2">
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
            <li>
              <Link to="/pass" className="text-sm text-fg/80 transition-colors hover:text-accent">
                {t(locale).passTitle}
              </Link>
            </li>
            <li>
              <Link to="/feedback" className="text-sm text-fg/80 transition-colors hover:text-accent">
                {t(locale).feedbackTitle}
              </Link>
            </li>
            <li>
              <Link to="/login" className="text-sm text-fg/80 transition-colors hover:text-accent">
                {t(locale).signIn}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="flex flex-col-reverse items-start gap-4 px-6 pb-8 sm:flex-row sm:items-end sm:justify-between md:px-10 lg:px-14">
        <p className="text-xs text-muted">
          © {new Date().getFullYear()} {SITE.name}. Land outlines: Natural Earth (public domain). City photos: Unsplash.
        </p>
        <LanguageToggle />
      </div>
    </footer>
  );
}
