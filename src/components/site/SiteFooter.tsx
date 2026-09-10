import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { listPublishedCities } from "@/lib/server/catalog";
import { t, useI18n } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import { Button } from "@/components/ui/Button";
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
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <p className="text-lg font-medium tracking-tight text-fg">{SITE.name}</p>
          <p className="mt-2 max-w-sm text-sm text-muted">{SITE.tagline}</p>
        </div>
        <nav aria-label="Published guides" className="flex flex-wrap gap-2">
          {cities.map((city) => (
            <Button key={city.id} asChild variant="outline" size="sm">
              <Link to="/$country/$city" params={{ country: city.countrySlug, city: city.slug }} search={{}}>
                {city.name}
              </Link>
            </Button>
          ))}
          <Button asChild size="sm">
            <Link to="/">{t(locale).globe}</Link>
          </Button>
        </nav>
      </div>
      <p className="mx-auto max-w-6xl px-4 pb-8 text-xs text-muted md:px-8">
        Land outlines: Natural Earth (public domain). City photos: Unsplash.
      </p>
    </footer>
  );
}
