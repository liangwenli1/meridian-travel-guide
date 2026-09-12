import type { City } from "@/types/catalog";
import { AmbientParticles } from "@/components/fx/AmbientParticles";
import { LetterForm } from "@/components/letter/LetterForm";
import { PassGate } from "@/components/pass/PassGate";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Card, CardDescription, CardMeta, CardTitle } from "@/components/ui/Card";
import { StatCell, StatGrid } from "@/components/ui/Grid";
import { listNeighborhoodPreviews } from "@/data/pass";
import { t, useI18n } from "@/lib/i18n";
import { usePassEntitlements } from "@/lib/pass/use-entitlements";

export function ComingSoon({ city }: { city: City }) {
  const locale = useI18n((s) => s.locale);
  const strings = t(locale);
  const { canUseTools } = usePassEntitlements();
  const preview = listNeighborhoodPreviews().find((item) => item.citySlug === city.slug);

  return (
    <main className="page-enter relative min-h-dvh bg-void text-fg">
      <AmbientParticles />
      <div className="relative z-10">
        <SiteHeader />
        <div className="mx-auto max-w-2xl px-4 py-16 md:px-8">
          <p className="kicker text-accent">
            {city.country} · {strings.comingSoon}
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
          {preview ? (
            <div className="mt-10">
              {canUseTools ? (
                <Card padding="lg">
                  <CardMeta>{strings.earlyNotesTitle}</CardMeta>
                  <CardTitle className="mt-2">{preview.title[locale]}</CardTitle>
                  <CardDescription className="whitespace-pre-wrap">{preview.body[locale]}</CardDescription>
                </Card>
              ) : (
                <PassGate
                  active={false}
                  need="features"
                  teaserTitle={preview.title[locale]}
                  teaserBody={strings.gateFeaturesDek}
                />
              )}
            </div>
          ) : null}
          <Card className="mt-10" padding="lg">
            <CardMeta>{strings.waitlistKicker}</CardMeta>
            <CardTitle className="mt-2">{strings.waitlistTitle}</CardTitle>
            <CardDescription>{strings.waitlistDek}</CardDescription>
            <div className="mt-6">
              <LetterForm citySlug={city.slug} compact />
            </div>
          </Card>
        </div>
        <SiteFooter />
      </div>
    </main>
  );
}
