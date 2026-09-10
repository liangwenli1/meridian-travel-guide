import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AmbientParticles } from "@/components/fx/AmbientParticles";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/Button";
import { StatCell, StatGrid } from "@/components/ui/Grid";
import { t, useI18n } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import type { City } from "@/types/catalog";

export function ComingSoon({ city }: { city: City }) {
  const locale = useI18n((s) => s.locale);
  return (
    <main className="page-enter relative min-h-dvh bg-void text-fg">
      <AmbientParticles />
      <div className="relative z-10">
        <header className="flex items-center justify-between px-4 py-5 md:px-8">
          <Button asChild variant="ghost" size="sm">
            <Link to="/">
              <ArrowLeft className="size-4" />
              {t(locale).globe}
            </Link>
          </Button>
          <Link to="/" className="text-lg font-medium tracking-tight">
            {SITE.name}
          </Link>
        </header>
        <div className="mx-auto max-w-2xl px-4 py-16 md:px-8">
          <p className="kicker text-accent">
            {city.country} · {t(locale).comingSoon}
          </p>
          <h1 className="mt-3 text-5xl font-medium tracking-tight md:text-6xl">{city.name}</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">{city.shortDescription}</p>
          <StatGrid className="mt-8">
            <StatCell
              label="Coordinates"
              value={`${city.latitude.toFixed(2)}, ${city.longitude.toFixed(2)}`}
            />
            <StatCell label="Timezone" value={city.timezone} />
            <StatCell label="Currency" value={`${city.currency} (${city.currencyCode})`} />
            <StatCell label="Airports" value={city.airportCodes.join(", ") || "—"} />
          </StatGrid>
        </div>
        <SiteFooter />
      </div>
    </main>
  );
}
