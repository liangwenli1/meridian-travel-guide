import type { City } from "@/types/catalog";
import { AmbientParticles } from "@/components/fx/AmbientParticles";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { StatCell, StatGrid } from "@/components/ui/Grid";
import { t, useI18n } from "@/lib/i18n";

export function ComingSoon({ city }: { city: City }) {
  const locale = useI18n((s) => s.locale);
  return (
    <main className="page-enter relative min-h-dvh bg-void text-fg">
      <AmbientParticles />
      <div className="relative z-10">
        <SiteHeader />
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
