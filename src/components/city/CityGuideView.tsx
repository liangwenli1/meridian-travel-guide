import { Link, useSearch } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { City } from "@/types/catalog";
import type { CityGuide } from "@/types/guide";
import { t, useI18n } from "@/lib/i18n";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardMeta, CardTitle } from "@/components/ui/Card";
import { Grid, StatCell, StatGrid } from "@/components/ui/Grid";
import { Table, THead, Th, Tr, Td } from "@/components/ui/Table";
import { AmbientParticles } from "@/components/fx/AmbientParticles";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { BudgetChart } from "./BudgetChart";
import { Callout } from "./callouts";
import { JsonLd } from "./JsonLd";
import { PhotoStrip } from "./PhotoStrip";
import { Section } from "./Section";
import { StickyNav } from "./StickyNav";
import { LetterForm } from "@/components/letter/LetterForm";
import { PassGate, LockedRest } from "@/components/pass/PassGate";
import { TripBrief } from "@/components/pass/TripBrief";
import { listOffseasonTables } from "@/data/pass";
import { localizeGuide } from "@/lib/guide-locale";
import { usePassEntitlements } from "@/lib/pass/use-entitlements";
import { downloadPassItinerary } from "@/lib/server/pass-locker";
import { getChapterNotes } from "@/lib/server/editorial";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const TIER_LABEL: Record<CityGuide["attractions"][number]["tier"], string> = {
  essential: "Essential",
  "extra-time": "If you have extra time",
  niche: "Niche but rewarding",
  conditional: "Only under certain conditions",
  overrated: "Often overrated",
};

const TIER_VARIANT: Record<CityGuide["attractions"][number]["tier"], "accent" | "muted" | "ok" | "warn"> = {
  essential: "accent",
  "extra-time": "ok",
  niche: "muted",
  conditional: "warn",
  overrated: "warn",
};

export function CityGuideView({ city, guide }: { city: City; guide: CityGuide }) {
  const locale = useI18n((s) => s.locale);
  const strings = t(locale);
  const view = localizeGuide(guide, locale);
  const section = useSearch({ from: "/$country/$city" }).s ?? "overview";
  const { canReadFull, canUseTools } = usePassEntitlements();
  const [downloading, setDownloading] = useState(false);
  const [chapterNote, setChapterNote] = useState("");

  useEffect(() => {
    void getChapterNotes({ data: { citySlug: city.slug } })
      .then((rows) => {
        const row = rows.find((item) => item.chapter === section && item.locale === locale);
        setChapterNote(row?.markdown ?? "");
      })
      .catch(() => setChapterNote(""));
  }, [city.slug, locale, section]);

  const downloadItinerary = async () => {
    setDownloading(true);
    try {
      const file = await downloadPassItinerary({ data: { citySlug: city.slug } });
      const blob = new Blob([file.markdown], { type: "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      toast.error(strings.passDownloadFailed);
    } finally {
      setDownloading(false);
    }
  };
  const snapshotEntries = [
    ["Country", view.snapshot.country],
    ["Language", view.snapshot.languages],
    ["Currency", view.snapshot.currency],
    ["Timezone", view.snapshot.timezone],
    ["Population", view.snapshot.population],
    ["Daily cost", view.snapshot.dailyCost],
    ["Best months", view.snapshot.bestMonths],
    ["Typical stay", view.snapshot.typicalStay],
    ["Airports", view.snapshot.airports],
    ["Stations", view.snapshot.stations],
    ["Visa", view.snapshot.visaSummary],
    ["Plug / voltage", `${view.snapshot.plugType} · ${view.snapshot.voltage}`],
    ["Emergency", view.snapshot.emergency],
    ["Tipping", view.snapshot.tipping],
    ["Cash vs card", view.snapshot.cashVsCard],
    ["Dining hours", view.snapshot.diningHours],
    ["Walkability", view.snapshot.walkability],
    ["Transit", view.snapshot.transitQuality],
    ["Travel style", view.snapshot.travelStyle],
  ] as const;

  return (
    <div className="page-enter relative min-h-dvh overflow-x-hidden bg-void text-fg">
      <AmbientParticles />
      <JsonLd city={city} guide={guide} />
      <div className="relative z-10">
      <SiteHeader overlay className="px-4 md:px-8" />

      <section className="relative isolate min-h-[72vh] overflow-hidden">
        <img
          src={view.hero.url}
          alt={view.hero.alt}
          referrerPolicy="no-referrer"
          className="content-img absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.82),rgba(0,0,0,0.2)_55%,rgba(0,0,0,0.4))]" />
        <div className="relative guide-shell flex min-h-[72vh] flex-col justify-end pt-28 pb-12 md:pb-16">
          <p className="kicker text-silver">
            {city.country} · Travel guide
          </p>
          <h1 className="mt-3 max-w-3xl text-5xl leading-[0.95] font-medium tracking-tight text-fg md:text-7xl">
            {view.title}
          </h1>
          <p className="mt-4 max-w-xl text-base text-fg/80 md:text-lg">{view.subtitle}</p>
        </div>
      </section>

      <StickyNav />

      {chapterNote ? (
        <div className="guide-shell pt-8">
          <Card padding="sm">
            <CardMeta>{strings.fieldNote}</CardMeta>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted">{chapterNote}</p>
          </Card>
        </div>
      ) : null}

      <section id="overview" className={`guide-panel scroll-mt-20 py-14 md:py-20 ${section === "overview" ? "" : "hidden"}`}>
        <div className="guide-shell">
          <p className="kicker text-muted">City snapshot</p>
          <h2 className="mt-2 text-3xl font-medium tracking-tight text-fg md:text-4xl">Thirty seconds on {city.name}</h2>
          <StatGrid className="mt-8">
            {snapshotEntries.map(([label, value]) => (
              <StatCell key={label} label={label} value={value} />
            ))}
          </StatGrid>

          <PhotoStrip citySlug={city.slug} />

          <TripBrief
            citySlug={city.slug}
            cityName={city.name}
            countrySlug={city.countrySlug}
            canReadFull={canReadFull}
            canUseTools={canUseTools}
          />

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            <Card>
              <CardTitle>Why go</CardTitle>
              <CardDescription>{view.whyGo}</CardDescription>
            </Card>
            <div className="grid gap-4">
              <Card>
                <CardMeta>Who will love it</CardMeta>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
                  {view.whoWillLoveIt.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Card>
              <Card>
                <CardMeta>Who may struggle</CardMeta>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
                  {view.whoMayStruggle.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>

          <Grid min="md" className="mt-10">
            <Callout kind="good-to-know" title="The short version">
              <ol className="list-decimal space-y-1 pl-4">
                {view.shortVersion.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </Callout>
            <Callout kind="watch-out" title="Reality check">
              <ul className="list-disc space-y-1 pl-4">
                {view.realityCheck.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Callout>
          </Grid>

          <Grid min="md" className="mt-12">
            {view.beforeYouGo.map((item) => (
              <Card key={item.title}>
                <CardTitle className="text-base">{item.title}</CardTitle>
                <CardDescription>{item.body}</CardDescription>
              </Card>
            ))}
          </Grid>
        </div>
      </section>

      <Section id="neighborhoods" show={section === "neighborhoods"} eyebrow="Urban grain" title="Neighborhoods at a glance">
        <Grid min="md">
          {view.neighborhoods.map((area) => (
            <Card key={area.name}>
              <CardHeader>
                <CardTitle className="text-xl">{area.name}</CardTitle>
                <Badge>{area.price}</Badge>
              </CardHeader>
              <CardDescription>{area.vibe}</CardDescription>
              <p className="mt-3 text-xs text-muted">Best for {area.bestFor.join(", ")}</p>
              {canReadFull ? (
              <>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="surface-inner">
                  <p className="kicker text-muted">Noise</p>
                  <p className="mt-1 text-sm">{area.noise}</p>
                </div>
                <div className="surface-inner">
                  <p className="kicker text-muted">Safety</p>
                  <p className="mt-1 text-sm">{area.safety}</p>
                </div>
                <div className="surface-inner">
                  <p className="kicker text-muted">Transit</p>
                  <p className="mt-1 text-sm">{area.transit}</p>
                </div>
                <div className="surface-inner">
                  <p className="kicker text-muted">Stay</p>
                  <p className="mt-1 text-sm">{area.stayNights}</p>
                </div>
              </div>
              <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                <div>
                  <p className="kicker text-ok">Pros</p>
                  <ul className="mt-1 list-disc pl-4 text-muted">
                    {area.pros.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="kicker text-warn">Tradeoffs</p>
                  <ul className="mt-1 list-disc pl-4 text-muted">
                    {area.cons.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted">Combine with {area.combineWith}</p>
              </>
              ) : null}
            </Card>
          ))}
        </Grid>
        <LockedRest open={canReadFull} className="mt-8">
        <Table className="mt-8" caption="Best area for…">
          <THead>
            <tr>
              <Th>If you are</Th>
              <Th>Stay in</Th>
              <Th>Why</Th>
            </tr>
          </THead>
          <tbody>
            {view.bestAreaFor.map((row) => (
              <Tr key={row.persona}>
                <Td className="font-medium">{row.persona}</Td>
                <Td>{row.area}</Td>
                <Td muted>{row.why}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
        </LockedRest>
      </Section>

      <Section id="things-to-do" show={section === "things-to-do"} eyebrow="Time well spent" title="Attractions and things to do">
        <div className="space-y-4">
          {view.attractions.map((place) => (
            <Card key={place.name} padding="lg">
              <CardHeader>
                <CardTitle className="text-xl">{place.name}</CardTitle>
                <Badge variant={TIER_VARIANT[place.tier]}>{TIER_LABEL[place.tier]}</Badge>
              </CardHeader>
              <CardDescription>{place.summary}</CardDescription>
              {canReadFull ? (
              <>
              <p className="mt-2 text-sm text-fg">{place.whyItMatters}</p>
              <Grid min="sm" className="mt-4">
                <Fact label="Duration" value={place.duration} />
                <Fact label="Price" value={place.price} />
                <Fact label="Hours" value={place.hours} />
                <Fact label="Reservation" value={place.reservation} />
                <Fact label="Queue" value={place.queue} />
                <Fact label="Crowds" value={place.crowd} />
                <Fact label="Best time" value={place.bestTime} />
                <Fact label="Transport" value={place.transport} />
              </Grid>
              <Grid min="md" className="mt-4">
                <Callout kind="worth-it" title="Worth it?">
                  {place.worthIt}
                </Callout>
                <Callout kind="local-tip" title="Local tip">
                  {place.tips[0]}
                </Callout>
                <Callout kind="watch-out" title="Common mistake">
                  {place.mistakes[0]}
                </Callout>
              </Grid>
              <p className="mt-3 text-sm text-muted">If it is crowded or closed: {place.alternative}</p>
              </>
              ) : null}
            </Card>
          ))}
        </div>
        <LockedRest open={canReadFull} className="mt-8">
        <Grid min="md" className="mt-8">
          {view.thingsToDo.map((item) => (
            <Card key={item.title}>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.body}</CardDescription>
              <p className="mt-3 text-xs text-muted">
                {item.duration} · {item.who}
              </p>
            </Card>
          ))}
        </Grid>
        <Grid min="md" className="mt-8">
          {view.hiddenGems.map((item) => (
            <Card key={item.title}>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.body}</CardDescription>
              {item.watchOut ? <p className="mt-3 text-sm text-warn">{item.watchOut}</p> : null}
            </Card>
          ))}
        </Grid>
        <Grid min="md" className="mt-8">
          {view.localExperiences.map((item) => (
            <Card key={item.title} padding="sm">
              <CardTitle className="text-base">{item.title}</CardTitle>
              <CardDescription>{item.body}</CardDescription>
            </Card>
          ))}
        </Grid>
        <div className="mt-10 space-y-4">
          {view.everydayLife.map((item) => (
            <p key={item.title} className="text-sm leading-relaxed text-muted">
              <span className="font-medium text-fg">{item.title}. </span>
              {item.body}
            </p>
          ))}
        </div>
        </LockedRest>
      </Section>

      <Section id="food" show={section === "food"} eyebrow="What to eat" title="Food and drinks" intro={view.foodIntro}>
        <Grid min="md">
          {view.dishes.map((dish) => (
            <Card key={dish.name}>
              <CardTitle className="text-xl">{dish.name}</CardTitle>
              {dish.localName ? <p className="text-xs text-muted">{dish.localName}</p> : null}
              <CardDescription>{dish.what}</CardDescription>
              {canReadFull ? (
              <>
              <p className="mt-2 text-sm text-fg">{dish.taste}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Fact label="When" value={dish.when} />
                <Fact label="Price" value={dish.price} />
                <Fact label="Where" value={dish.where} />
                <Fact label="How to order" value={dish.howToOrder} />
              </div>
              {dish.note ? <p className="mt-3 text-sm text-muted">{dish.note}</p> : null}
              </>
              ) : null}
            </Card>
          ))}
        </Grid>
        <LockedRest open={canReadFull} className="mt-8">
        <div className="mt-8 space-y-4">
          {view.foodThemes.map((theme) => (
            <Card key={theme.title} padding="sm">
              <CardTitle>{theme.title}</CardTitle>
              <CardDescription className="max-w-3xl">{theme.body}</CardDescription>
            </Card>
          ))}
        </div>
        <Table className="mt-8">
          <THead>
            <tr>
              <Th>Place</Th>
              <Th>Type</Th>
              <Th>Neighborhood</Th>
              <Th>Price</Th>
            </tr>
          </THead>
          <tbody>
            {view.venues.map((venue) => (
              <Tr key={venue.name}>
                <Td>
                  <p className="font-medium">{venue.name}</p>
                  <p className="text-muted">{venue.why}</p>
                </Td>
                <Td>{venue.type}</Td>
                <Td>{venue.neighborhood}</Td>
                <Td>{venue.price}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
        <Grid min="md" className="mt-8">
          {view.shopping.map((item) => (
            <Card key={item.title}>
              <CardTitle className="text-base">{item.title}</CardTitle>
              <CardDescription>{item.body}</CardDescription>
            </Card>
          ))}
        </Grid>
        <div className="mt-10">
          <h3 className="kicker text-muted">{strings.deskOffseasonTitle}</h3>
          <div className="mt-4 space-y-4">
            {listOffseasonTables()
              .filter((table) => table.citySlug === view.citySlug)
              .map((table) => (
                <Card key={table.name.en} padding="sm">
                  <CardTitle className="text-base">{table.name[locale]}</CardTitle>
                  <p className="mt-1 text-xs text-muted">{table.neighborhood[locale]} · {table.seasonWindow[locale]}</p>
                  <CardDescription className="mt-2">{table.why[locale]}</CardDescription>
                  <p className="mt-2 text-sm text-fg">{table.howToGetIn[locale]}</p>
                  {table.watchOut ? <p className="mt-2 text-sm text-warn">{table.watchOut[locale]}</p> : null}
                </Card>
              ))}
            {listOffseasonTables().filter((table) => table.citySlug === view.citySlug).length === 0 ? (
              <p className="mt-3 text-sm text-muted">{strings.passLockerEmpty}</p>
            ) : null}
          </div>
        </div>
        </LockedRest>
      </Section>

      <Section id="stay" show={section === "stay"} eyebrow="Where to sleep" title="Where to stay" intro={view.stayIntro}>
        <Grid min="md">
          {view.stayAreas.map((area) => (
            <Card key={area.name}>
              <CardTitle className="text-xl">{area.name}</CardTitle>
              <p className="mt-1 text-xs text-muted">Best for {area.bestFor.join(", ")}</p>
              {canReadFull ? (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Fact label="Commute" value={area.commute} />
                <Fact label="Price" value={area.priceHint} />
                <Fact label="Noise" value={area.noise} />
                <Fact label="Safety" value={area.safety} />
              </div>
              ) : null}
            </Card>
          ))}
        </Grid>
        <LockedRest open={canReadFull} className="mt-6">
        <ul className="mt-6 list-disc space-y-2 pl-5 text-sm text-muted">
          {view.stayNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
        </LockedRest>
      </Section>

      <Section id="transport" show={section === "transport"} eyebrow="Getting in and around" title="Transport">
        <h3 className="mb-3 kicker text-muted">Airport and station arrival</h3>
        <Table>
          <THead>
            <tr>
              <Th>Option</Th>
              <Th>Time</Th>
              <Th>Cost</Th>
              <Th>Best for</Th>
            </tr>
          </THead>
          <tbody>
            {view.arrival.map((row) => (
              <Tr key={row.name}>
                <Td>
                  <p className="font-medium">{row.name}</p>
                  {canReadFull ? (
                    <>
                      <p className="text-muted">{row.how}</p>
                      {row.watchOut ? <p className="mt-1 text-warn">{row.watchOut}</p> : null}
                    </>
                  ) : null}
                </Td>
                <Td>{row.time}</Td>
                <Td>{canReadFull ? row.cost : "—"}</Td>
                <Td>{canReadFull ? row.bestFor : "—"}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
        <LockedRest open={canReadFull} className="mt-8">
        <Grid min="md" className="mt-8">
          {view.gettingAround.map((item) => (
            <Card key={item.title}>
              <CardTitle className="text-base">{item.title}</CardTitle>
              <CardDescription>{item.body}</CardDescription>
            </Card>
          ))}
        </Grid>
        <h3 className="mt-10 mb-3 kicker text-muted">Day trips</h3>
        <Grid min="md">
          {view.dayTrips.map((trip) => (
            <Card key={trip.name}>
              <CardTitle>{trip.name}</CardTitle>
              <p className="mt-1 text-xs text-muted">{trip.time}</p>
              <CardDescription>{trip.why}</CardDescription>
              <p className="mt-2 text-sm text-warn">Skip if {trip.skipIf}</p>
            </Card>
          ))}
        </Grid>
        </LockedRest>
      </Section>

      <Section id="money" show={section === "money"} eyebrow="Costs" title="Budget and payments">
        <p className="mb-4 text-sm text-muted">
          {view.budget.currency} · {view.budget.asOf}
        </p>
        <Grid min="sm">
          {view.budget.bands.map((band) => (
            <Card key={band.name} variant="stat">
              <CardMeta>{band.name}</CardMeta>
              <p className="mt-2 text-2xl font-medium tracking-tight text-fg tabular-nums">{band.daily}</p>
              <p className="mt-2 text-sm text-muted">{band.includes}</p>
            </Card>
          ))}
        </Grid>
        <LockedRest open={canReadFull} className="mt-6">
        <div className="mt-6">
          <BudgetChart budget={view.budget} />
        </div>
        <Table className="mt-6">
          <THead>
            <tr>
              <Th>Item</Th>
              <Th>Budget</Th>
              <Th>Mid-range</Th>
              <Th>Luxury</Th>
            </tr>
          </THead>
          <tbody>
            {view.budget.breakdown.map((row) => (
              <Tr key={row.item}>
                <Td>{row.item}</Td>
                <Td className="tabular-nums">{row.budget}</Td>
                <Td className="tabular-nums">{row.mid}</Td>
                <Td className="tabular-nums">{row.luxury}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
        <Grid min="md" className="mt-6">
          <Callout kind="watch-out" title="Easy to miss">
            <ul className="list-disc pl-4">
              {view.budget.hidden.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Callout>
          <Callout kind="worth-it" title="Spend here">
            <ul className="list-disc pl-4">
              {view.budget.worthSpending.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Callout>
          <Callout kind="local-tip" title="Save here">
            <ul className="list-disc pl-4">
              {view.budget.worthSaving.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Callout>
        </Grid>
        <Grid min="md" className="mt-8">
          {view.payments.map((item) => (
            <Card key={item.title}>
              <CardTitle className="text-base">{item.title}</CardTitle>
              <CardDescription>{item.body}</CardDescription>
            </Card>
          ))}
        </Grid>
        </LockedRest>
      </Section>

      <Section id="connectivity" show={section === "connectivity"} eyebrow="Before you fly" title="Visa, SIM, and weather">
        <Callout kind="watch-out" title="Visa and entry">
          {view.visa.summary}
        </Callout>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-muted">
          {view.visa.details.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <a
          href={view.visa.officialUrl}
          className="mt-3 inline-flex items-center gap-1 text-sm text-fg"
          target="_blank"
          rel="noreferrer"
        >
          Official source <ArrowUpRight className="size-3.5" />
        </a>
        <Grid min="md" className="mt-8">
          {view.connectivity.map((item) => (
            <Card key={item.title}>
              <CardTitle className="text-base">{item.title}</CardTitle>
              <CardDescription>{item.body}</CardDescription>
            </Card>
          ))}
        </Grid>
        <Grid min="sm" className="mt-8">
          {view.seasons.map((season) => (
            <Card key={season.name}>
              <CardTitle>{season.name}</CardTitle>
              <p className="mt-1 text-xs text-muted">{season.forWhom}</p>
              <p className="mt-2 text-sm text-muted">{season.pros}</p>
              <p className="mt-2 text-sm text-warn">{season.cons}</p>
              <p className="mt-2 text-sm">{season.pack}</p>
            </Card>
          ))}
        </Grid>
        <Grid min="md" className="mt-6">
          {view.weatherTips.map((item) => (
            <Callout key={item.title} kind="good-to-know" title={item.title}>
              {item.body}
            </Callout>
          ))}
        </Grid>
        <ul className="mt-6 space-y-2 text-sm text-muted">
          {view.festivals.map((fest) => (
            <li key={fest.name}>
              <span className="font-medium text-fg">{fest.name}</span> · {fest.when}. {fest.note}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="apps" show={section === "apps"} eyebrow="Phone" title="Essential apps">
        <Grid min="md">
          {view.apps.map((app) => (
            <Card key={app.name} padding="sm">
              <CardHeader>
                <div>
                  <CardTitle className="text-base">{app.name}</CardTitle>
                  <p className="mt-1 text-sm text-muted">{app.purpose}</p>
                </div>
                <Badge variant={app.necessary === "before" ? "accent" : "muted"}>
                  {app.necessary === "before" ? "Install before" : app.necessary === "after" ? "After arrival" : "Skip unless"}
                </Badge>
              </CardHeader>
              <p className="mt-2 text-xs text-muted">
                {app.platforms}
                {app.needLocalNumber ? " · local number" : ""}
                {app.needLocalBank ? " · local bank" : ""}
                {app.offline ? " · works offline" : ""}
              </p>
              <p className="mt-2 text-sm text-muted">{app.note}</p>
            </Card>
          ))}
        </Grid>
      </Section>

      <Section id="culture" show={section === "culture"} eyebrow="How the city behaves" title="Culture and etiquette">
        <div className="space-y-4">
          {view.culture.map((item) => (
            <Card key={item.title} padding="sm">
              <CardTitle>{item.title}</CardTitle>
              <CardDescription className="max-w-3xl">{item.body}</CardDescription>
            </Card>
          ))}
        </div>
        <Table className="mt-8">
          <THead>
            <tr>
              <Th>Do</Th>
              <Th>Don't</Th>
              <Th>Why</Th>
            </tr>
          </THead>
          <tbody>
            {view.etiquette.map((row) => (
              <Tr key={row.do}>
                <Td>{row.do}</Td>
                <Td>{row.dont}</Td>
                <Td muted>{row.why}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
        <ul className="mt-6 list-disc space-y-1 pl-5 text-sm text-muted">
          {view.taboos.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <Grid min="md" className="mt-8">
          {view.phrases.map((phrase) => (
            <Card key={phrase.original} padding="sm">
              <p className="text-xl font-medium tracking-tight text-fg">{phrase.original}</p>
              <p className="text-sm text-muted">{phrase.romanized}</p>
              <p className="mt-2 text-sm">{phrase.meaning}</p>
              <p className="mt-2 text-sm text-muted">Use: {phrase.use}</p>
              <p className="text-sm text-warn">Avoid: {phrase.avoid}</p>
            </Card>
          ))}
        </Grid>
        <div className="mt-8 space-y-3">
          {view.localModules.map((item) => (
            <Card key={item.title} padding="sm">
              <CardTitle className="text-base">{item.title}</CardTitle>
              <CardDescription>{item.body}</CardDescription>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="safety" show={section === "safety"} eyebrow="Keep it specific" title="Safety, scams, and access">
        <Grid min="md">
          {view.safety.map((item) => (
            <Card key={item.title}>
              <CardTitle className="text-base">{item.title}</CardTitle>
              <CardDescription>{item.body}</CardDescription>
            </Card>
          ))}
        </Grid>
        <div className="mt-6 space-y-3">
          {view.scams.map((scam) => (
            <Card key={scam.name}>
              <CardTitle className="text-base">{scam.name}</CardTitle>
              <p className="mt-2 text-sm text-muted">Look for: {scam.lookFor}</p>
              <p className="text-sm text-muted">Prevent: {scam.prevent}</p>
              <p className="text-sm text-muted">If it happens: {scam.ifItHappens}</p>
            </Card>
          ))}
        </div>
        <StatGrid className="mt-6">
          {view.emergency.map((item) => (
            <StatCell key={item.label} label={item.label} value={item.value} />
          ))}
        </StatGrid>
        <Grid min="md" className="mt-6">
          {view.accessibility.map((item) => (
            <Card key={item.title} padding="sm">
              <CardTitle className="text-base">{item.title}</CardTitle>
              <CardDescription>{item.body}</CardDescription>
            </Card>
          ))}
        </Grid>
        <Grid min="md" className="mt-8">
          {view.byTraveler.map((item) => (
            <Card key={item.persona}>
              <CardTitle className="text-base">{item.persona}</CardTitle>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted">
                {item.tips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </Card>
          ))}
        </Grid>
        <div className="mt-6">
          <Callout kind="watch-out" title="Things visitors often get wrong">
            <ul className="list-disc pl-4">
              {view.touristsGetWrong.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Callout>
        </div>
      </Section>

      <Section id="itinerary" show={section === "itinerary"} eyebrow="Time" title="Suggested itineraries">
        <div className="mb-6 flex flex-wrap gap-2">
          <PassGate active={canUseTools} need="features" teaserTitle={strings.gateFeaturesTitle}>
            <Button variant="outline" size="sm" disabled={downloading} onClick={() => void downloadItinerary()}>
              {downloading ? strings.passDownloading : strings.passDownloadItinerary}
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link to="/pass/print/$city" params={{ city: city.slug }}>
                {strings.passPrintPdf}
              </Link>
            </Button>
          </PassGate>
        </div>
        <Grid min="md" className="mb-6">
          {view.timePlanning.map((item) => (
            <Card key={item.title} padding="sm">
              <CardTitle className="text-base">{item.title}</CardTitle>
              <CardDescription>{item.body}</CardDescription>
            </Card>
          ))}
        </Grid>
        <div className="space-y-8">
          {view.itineraries.map((plan, planIndex) => {
            const freeDays = canReadFull || planIndex > 0 ? [] : plan.daysPlan.slice(0, 1);
            const lockedDays =
              canReadFull ? [] : planIndex === 0 ? plan.daysPlan.slice(1) : plan.daysPlan;
            const visibleDays = canReadFull ? plan.daysPlan : freeDays;

            return (
              <Card key={plan.title} padding="lg">
                <CardMeta>
                  {plan.days} day · {plan.pace}
                </CardMeta>
                <CardTitle className="mt-1 text-2xl">{plan.title}</CardTitle>
                <CardDescription className="max-w-2xl">{plan.summary}</CardDescription>
                <div className="mt-5 space-y-4">
                  {visibleDays.map((day) => (
                    <div key={day.label} className="surface-inner">
                      <h4 className="text-sm font-medium">
                        {day.label} — {day.theme}
                      </h4>
                      <ol className="mt-2 space-y-2">
                        {day.stops.map((stop) => (
                          <li key={`${day.label}-${stop.title}`} className="grid grid-cols-[4.5rem_1fr] gap-3 text-sm">
                            <span className="text-muted tabular-nums">{stop.time}</span>
                            <span>
                              <span className="font-medium">{stop.title}. </span>
                              <span className="text-muted">{stop.detail}</span>
                            </span>
                          </li>
                        ))}
                      </ol>
                      <p className="mt-2 text-sm text-muted">If it rains: {day.rainPlan}</p>
                    </div>
                  ))}
                  {!canReadFull && lockedDays.length > 0 ? (
                    <PassGate
                      active={false}
                      teaserTitle={strings.deskItineraryTeaser}
                      teaserBody={
                        planIndex === 0
                          ? `${lockedDays.length} more day${lockedDays.length === 1 ? "" : "s"} in this plan`
                          : plan.title
                      }
                    >
                      {null}
                    </PassGate>
                  ) : null}
                </div>
              </Card>
            );
          })}
        </div>
      </Section>

      <Section id="faq" show={section === "faq"} eyebrow="Direct answers" title="FAQ">
        <Card padding="none" className="divide-y divide-line">
          {view.faq.map((item) => (
            <details key={item.q} className="group px-5 py-4">
              <summary className="cursor-pointer list-none text-base font-medium marker:content-none">
                {item.q}
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </Card>
        <div className="mt-10 border-t border-line pt-8">
          <h3 className="kicker text-muted">Sources</h3>
          <ul className="mt-3 space-y-1 text-sm">
            {view.sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} className="text-fg underline-offset-2 hover:underline" target="_blank" rel="noreferrer">
                  {source.name}
                </a>
                <span className="text-muted"> — {source.usedFor}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted">
            Last updated: {view.lastUpdated}. Hero photo: {view.hero.author} / {view.hero.license}.
          </p>
        </div>
      </Section>
      <section className="border-t border-line py-16">
        <div className="guide-shell grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-end">
          <div>
            <p className="kicker text-accent">{t(locale).letterKicker}</p>
            <h2 className="mt-2 text-3xl font-medium tracking-tight">{t(locale).letterTitle}</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">{t(locale).letterDek}</p>
          </div>
          <LetterForm citySlug={city.slug} compact />
        </div>
      </section>
      <SiteFooter />
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface-inner">
      <dt className="kicker text-muted">{label}</dt>
      <dd className="mt-0.5 text-sm text-fg">{value}</dd>
    </div>
  );
}
