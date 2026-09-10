import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AmbientParticles } from "@/components/fx/AmbientParticles";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Grid, StatCell, StatGrid } from "@/components/ui/Grid";
import { publishedCities } from "@/data/cities";
import { SITE } from "@/lib/site";
import type { City } from "@/types/catalog";

export function ComingSoon({ city }: { city: City }) {
  return (
    <main className="page-enter relative min-h-dvh bg-void text-fg">
      <AmbientParticles />
      <div className="relative z-10">
      <header className="flex items-center justify-between px-4 py-5 md:px-8">
        <Button asChild variant="ghost" size="sm">
          <Link to="/">
            <ArrowLeft className="size-4" />
            Globe
          </Link>
        </Button>
        <Link to="/" className="text-lg font-medium tracking-tight">
          {SITE.name}
        </Link>
      </header>
      <div className="mx-auto max-w-2xl px-4 py-16 md:px-8">
        <p className="kicker text-accent">
          {city.country} · Coming soon
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
        <p className="mt-10 text-sm text-muted">
          This city is on the globe. The full editorial guide is still being written. Meanwhile, these
          guides are ready:
        </p>
        <Grid min="sm" className="mt-4">
          {publishedCities.map((item) => (
            <Card key={item.id} asChild interactive padding="sm">
              <Link to="/$country/$city" params={{ country: item.countrySlug, city: item.slug }}>
                <span className="block text-lg font-medium tracking-tight">{item.name}</span>
                <span className="mt-1 block text-sm text-muted">{item.country}</span>
              </Link>
            </Card>
          ))}
        </Grid>
      </div>
      <SiteFooter />
      </div>
    </main>
  );
}
