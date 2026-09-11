import { Link, useSearch } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { City } from "@/types/catalog";
import type { CityGuide } from "@/types/guide";
import { SITE } from "@/lib/site";
import { t, useI18n } from "@/lib/i18n";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardMeta, CardTitle } from "@/components/ui/Card";
import { Grid, StatCell, StatGrid } from "@/components/ui/Grid";
import { Table, THead, Th, Tr, Td } from "@/components/ui/Table";
import { AmbientParticles } from "@/components/fx/AmbientParticles";
import { SiteFooter } from "@/components/site/SiteFooter";
import { BudgetChart } from "./BudgetChart";
import { Callout } from "./callouts";
import { JsonLd } from "./JsonLd";
import { PhotoStrip } from "./PhotoStrip";
import { Section } from "./Section";
import { StickyNav } from "./StickyNav";
import { LetterForm } from "@/components/letter/LetterForm";

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
  const section = useSearch({ from: "/$country/$city" }).s ?? "overview";
  const snapshotEntries = [
    ["Country", guide.snapshot.country],
    ["Language", guide.snapshot.languages],
    ["Currency", guide.snapshot.currency],
    ["Timezone", guide.snapshot.timezone],
    ["Population", guide.snapshot.population],
    ["Daily cost", guide.snapshot.dailyCost],
    ["Best months", guide.snapshot.bestMonths],
    ["Typical stay", guide.snapshot.typicalStay],
    ["Airports", guide.snapshot.airports],
    ["Stations", guide.snapshot.stations],
    ["Visa", guide.snapshot.visaSummary],
    ["Plug / voltage", `${guide.snapshot.plugType} · ${guide.snapshot.voltage}`],
    ["Emergency", guide.snapshot.emergency],
    ["Tipping", guide.snapshot.tipping],
    ["Cash vs card", guide.snapshot.cashVsCard],
    ["Dining hours", guide.snapshot.diningHours],
    ["Walkability", guide.snapshot.walkability],
    ["Transit", guide.snapshot.transitQuality],
    ["Travel style", guide.snapshot.travelStyle],
  ] as const;

  return (
    <div className="page-enter relative min-h-dvh overflow-x-hidden bg-void text-fg">
      <AmbientParticles />
      <JsonLd city={city} guide={guide} />
      <div className="relative z-10">
      <header className="absolute top-0 right-0 left-0 z-20 flex items-center justify-between px-4 py-4 text-fg md:px-8">
        <Button asChild variant="outline" size="sm">
          <Link to="/">
            <ArrowLeft className="size-4" strokeWidth={1.75} />
            {t(locale).globe}
          </Link>
        </Button>
        <Link to="/" className="text-lg font-medium tracking-tight text-fg">
          {SITE.name}
        </Link>
      </header>

      <section className="relative isolate min-h-[72vh] overflow-hidden">
        <img
          src={guide.hero.url}
          alt={guide.hero.alt}
          className="content-img absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.82),rgba(0,0,0,0.2)_55%,rgba(0,0,0,0.4))]" />
        <div className="relative guide-shell flex min-h-[72vh] flex-col justify-end pt-28 pb-12 md:pb-16">
          <p className="kicker text-silver">
            {city.country} · Travel guide
          </p>
          <h1 className="mt-3 max-w-3xl text-5xl leading-[0.95] font-medium tracking-tight text-fg md:text-7xl">
            {guide.title}
          </h1>
          <p className="mt-4 max-w-xl text-base text-fg/80 md:text-lg">{guide.subtitle}</p>
        </div>
      </section>

      <StickyNav />

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

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            <Card>
              <CardTitle>Why go</CardTitle>
              <CardDescription>{guide.whyGo}</CardDescription>
            </Card>
            <div className="grid gap-4">
              <Card>
                <CardMeta>Who will love it</CardMeta>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
                  {guide.whoWillLoveIt.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Card>
              <Card>
                <CardMeta>Who may struggle</CardMeta>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
                  {guide.whoMayStruggle.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>

          <Grid min="md" className="mt-10">
            <Callout kind="good-to-know" title="The short version">
              <ol className="list-decimal space-y-1 pl-4">
                {guide.shortVersion.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </Callout>
            <Callout kind="watch-out" title="Reality check">
              <ul className="list-disc space-y-1 pl-4">
                {guide.realityCheck.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Callout>
          </Grid>

          <Grid min="md" className="mt-12">
            {guide.beforeYouGo.map((item) => (
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
          {guide.neighborhoods.map((area) => (
            <Card key={area.name}>
              <CardHeader>
                <CardTitle className="text-xl">{area.name}</CardTitle>
                <Badge>{area.price}</Badge>
              </CardHeader>
              <CardDescription>{area.vibe}</CardDescription>
              <p className="mt-3 text-xs text-muted">Best for {area.bestFor.join(", ")}</p>
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
            </Card>
          ))}
        </Grid>
        <Table className="mt-8" caption="Best area for…">
          <THead>
            <tr>
              <Th>If you are</Th>
              <Th>Stay in</Th>
              <Th>Why</Th>
            </tr>
          </THead>
          <tbody>
            {guide.bestAreaFor.map((row) => (
              <Tr key={row.persona}>
                <Td className="font-medium">{row.persona}</Td>
                <Td>{row.area}</Td>
                <Td muted>{row.why}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </Section>

      <Section id="things-to-do" show={section === "things-to-do"} eyebrow="Time well spent" title="Attractions and things to do">
        <div className="space-y-4">
          {guide.attractions.map((place) => (
            <Card key={place.name} padding="lg">
              <CardHeader>
                <CardTitle className="text-xl">{place.name}</CardTitle>
                <Badge variant={TIER_VARIANT[place.tier]}>{TIER_LABEL[place.tier]}</Badge>
              </CardHeader>
              <CardDescription>{place.summary}</CardDescription>
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
            </Card>
          ))}
        </div>
        <Grid min="md" className="mt-8">
          {guide.thingsToDo.map((item) => (
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
          {guide.hiddenGems.map((item) => (
            <Card key={item.title}>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.body}</CardDescription>
              {item.watchOut ? <p className="mt-3 text-sm text-warn">{item.watchOut}</p> : null}
            </Card>
          ))}
        </Grid>
        <Grid min="md" className="mt-8">
          {guide.localExperiences.map((item) => (
            <Card key={item.title} padding="sm">
              <CardTitle className="text-base">{item.title}</CardTitle>
              <CardDescription>{item.body}</CardDescription>
            </Card>
          ))}
        </Grid>
        <div className="mt-10 space-y-4">
          {guide.everydayLife.map((item) => (
            <p key={item.title} className="text-sm leading-relaxed text-muted">
              <span className="font-medium text-fg">{item.title}. </span>
              {item.body}
            </p>
          ))}
        </div>
      </Section>

      <Section id="food" show={section === "food"} eyebrow="What to eat" title="Food and drinks" intro={guide.foodIntro}>
        <Grid min="md">
          {guide.dishes.map((dish) => (
            <Card key={dish.name}>
              <CardTitle className="text-xl">{dish.name}</CardTitle>
              {dish.localName ? <p className="text-xs text-muted">{dish.localName}</p> : null}
              <CardDescription>{dish.what}</CardDescription>
              <p className="mt-2 text-sm text-fg">{dish.taste}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Fact label="When" value={dish.when} />
                <Fact label="Price" value={dish.price} />
                <Fact label="Where" value={dish.where} />
                <Fact label="How to order" value={dish.howToOrder} />
              </div>
              {dish.note ? <p className="mt-3 text-sm text-muted">{dish.note}</p> : null}
            </Card>
          ))}
        </Grid>
        <div className="mt-8 space-y-4">
          {guide.foodThemes.map((theme) => (
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
            {guide.venues.map((venue) => (
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
          {guide.shopping.map((item) => (
            <Card key={item.title}>
              <CardTitle className="text-base">{item.title}</CardTitle>
              <CardDescription>{item.body}</CardDescription>
            </Card>
          ))}
        </Grid>
      </Section>

      <Section id="stay" show={section === "stay"} eyebrow="Where to sleep" title="Where to stay" intro={guide.stayIntro}>
        <Grid min="md">
          {guide.stayAreas.map((area) => (
            <Card key={area.name}>
              <CardTitle className="text-xl">{area.name}</CardTitle>
              <p className="mt-1 text-xs text-muted">Best for {area.bestFor.join(", ")}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Fact label="Commute" value={area.commute} />
                <Fact label="Price" value={area.priceHint} />
                <Fact label="Noise" value={area.noise} />
                <Fact label="Safety" value={area.safety} />
              </div>
            </Card>
          ))}
        </Grid>
        <ul className="mt-6 list-disc space-y-2 pl-5 text-sm text-muted">
          {guide.stayNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
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
            {guide.arrival.map((row) => (
              <Tr key={row.name}>
                <Td>
                  <p className="font-medium">{row.name}</p>
                  <p className="text-muted">{row.how}</p>
                  {row.watchOut ? <p className="mt-1 text-warn">{row.watchOut}</p> : null}
                </Td>
                <Td>{row.time}</Td>
                <Td>{row.cost}</Td>
                <Td>{row.bestFor}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
        <Grid min="md" className="mt-8">
          {guide.gettingAround.map((item) => (
            <Card key={item.title}>
              <CardTitle className="text-base">{item.title}</CardTitle>
              <CardDescription>{item.body}</CardDescription>
            </Card>
          ))}
        </Grid>
        <h3 className="mt-10 mb-3 kicker text-muted">Day trips</h3>
        <Grid min="md">
          {guide.dayTrips.map((trip) => (
            <Card key={trip.name}>
              <CardTitle>{trip.name}</CardTitle>
              <p className="mt-1 text-xs text-muted">{trip.time}</p>
              <CardDescription>{trip.why}</CardDescription>
              <p className="mt-2 text-sm text-warn">Skip if {trip.skipIf}</p>
            </Card>
          ))}
        </Grid>
      </Section>

      <Section id="money" show={section === "money"} eyebrow="Costs" title="Budget and payments">
        <p className="mb-4 text-sm text-muted">
          {guide.budget.currency} · {guide.budget.asOf}
        </p>
        <Grid min="sm">
          {guide.budget.bands.map((band) => (
            <Card key={band.name} variant="stat">
              <CardMeta>{band.name}</CardMeta>
              <p className="mt-2 text-2xl font-medium tracking-tight text-fg tabular-nums">{band.daily}</p>
              <p className="mt-2 text-sm text-muted">{band.includes}</p>
            </Card>
          ))}
        </Grid>
        <div className="mt-6">
          <BudgetChart budget={guide.budget} />
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
            {guide.budget.breakdown.map((row) => (
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
              {guide.budget.hidden.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Callout>
          <Callout kind="worth-it" title="Spend here">
            <ul className="list-disc pl-4">
              {guide.budget.worthSpending.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Callout>
          <Callout kind="local-tip" title="Save here">
            <ul className="list-disc pl-4">
              {guide.budget.worthSaving.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Callout>
        </Grid>
        <Grid min="md" className="mt-8">
          {guide.payments.map((item) => (
            <Card key={item.title}>
              <CardTitle className="text-base">{item.title}</CardTitle>
              <CardDescription>{item.body}</CardDescription>
            </Card>
          ))}
        </Grid>
      </Section>

      <Section id="connectivity" show={section === "connectivity"} eyebrow="Before you fly" title="Visa, SIM, and weather">
        <Callout kind="watch-out" title="Visa and entry">
          {guide.visa.summary}
        </Callout>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-muted">
          {guide.visa.details.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <a
          href={guide.visa.officialUrl}
          className="mt-3 inline-flex items-center gap-1 text-sm text-fg"
          target="_blank"
          rel="noreferrer"
        >
          Official source <ArrowUpRight className="size-3.5" />
        </a>
        <Grid min="md" className="mt-8">
          {guide.connectivity.map((item) => (
            <Card key={item.title}>
              <CardTitle className="text-base">{item.title}</CardTitle>
              <CardDescription>{item.body}</CardDescription>
            </Card>
          ))}
        </Grid>
        <Grid min="sm" className="mt-8">
          {guide.seasons.map((season) => (
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
          {guide.weatherTips.map((item) => (
            <Callout key={item.title} kind="good-to-know" title={item.title}>
              {item.body}
            </Callout>
          ))}
        </Grid>
        <ul className="mt-6 space-y-2 text-sm text-muted">
          {guide.festivals.map((fest) => (
            <li key={fest.name}>
              <span className="font-medium text-fg">{fest.name}</span> · {fest.when}. {fest.note}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="apps" show={section === "apps"} eyebrow="Phone" title="Essential apps">
        <Grid min="md">
          {guide.apps.map((app) => (
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
          {guide.culture.map((item) => (
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
            {guide.etiquette.map((row) => (
              <Tr key={row.do}>
                <Td>{row.do}</Td>
                <Td>{row.dont}</Td>
                <Td muted>{row.why}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
        <ul className="mt-6 list-disc space-y-1 pl-5 text-sm text-muted">
          {guide.taboos.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <Grid min="md" className="mt-8">
          {guide.phrases.map((phrase) => (
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
          {guide.localModules.map((item) => (
            <Card key={item.title} padding="sm">
              <CardTitle className="text-base">{item.title}</CardTitle>
              <CardDescription>{item.body}</CardDescription>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="safety" show={section === "safety"} eyebrow="Keep it specific" title="Safety, scams, and access">
        <Grid min="md">
          {guide.safety.map((item) => (
            <Card key={item.title}>
              <CardTitle className="text-base">{item.title}</CardTitle>
              <CardDescription>{item.body}</CardDescription>
            </Card>
          ))}
        </Grid>
        <div className="mt-6 space-y-3">
          {guide.scams.map((scam) => (
            <Card key={scam.name}>
              <CardTitle className="text-base">{scam.name}</CardTitle>
              <p className="mt-2 text-sm text-muted">Look for: {scam.lookFor}</p>
              <p className="text-sm text-muted">Prevent: {scam.prevent}</p>
              <p className="text-sm text-muted">If it happens: {scam.ifItHappens}</p>
            </Card>
          ))}
        </div>
        <StatGrid className="mt-6">
          {guide.emergency.map((item) => (
            <StatCell key={item.label} label={item.label} value={item.value} />
          ))}
        </StatGrid>
        <Grid min="md" className="mt-6">
          {guide.accessibility.map((item) => (
            <Card key={item.title} padding="sm">
              <CardTitle className="text-base">{item.title}</CardTitle>
              <CardDescription>{item.body}</CardDescription>
            </Card>
          ))}
        </Grid>
        <Grid min="md" className="mt-8">
          {guide.byTraveler.map((item) => (
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
              {guide.touristsGetWrong.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Callout>
        </div>
      </Section>

      <Section id="itinerary" show={section === "itinerary"} eyebrow="Time" title="Suggested itineraries">
        <Grid min="md" className="mb-6">
          {guide.timePlanning.map((item) => (
            <Card key={item.title} padding="sm">
              <CardTitle className="text-base">{item.title}</CardTitle>
              <CardDescription>{item.body}</CardDescription>
            </Card>
          ))}
        </Grid>
        <div className="space-y-8">
          {guide.itineraries.map((plan) => (
            <Card key={plan.title} padding="lg">
              <CardMeta>
                {plan.days} day · {plan.pace}
              </CardMeta>
              <CardTitle className="mt-1 text-2xl">{plan.title}</CardTitle>
              <CardDescription className="max-w-2xl">{plan.summary}</CardDescription>
              <div className="mt-5 space-y-4">
                {plan.daysPlan.map((day) => (
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
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="faq" show={section === "faq"} eyebrow="Direct answers" title="FAQ">
        <Card padding="none" className="divide-y divide-line">
          {guide.faq.map((item) => (
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
            {guide.sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} className="text-fg underline-offset-2 hover:underline" target="_blank" rel="noreferrer">
                  {source.name}
                </a>
                <span className="text-muted"> — {source.usedFor}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted">
            Last updated: {guide.lastUpdated}. Hero photo: {guide.hero.author} / {guide.hero.license}.
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
