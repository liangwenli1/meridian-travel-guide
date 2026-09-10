import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { City } from "@/types/catalog";
import type { CityGuide } from "@/types/guide";
import { SITE } from "@/lib/site";
import { Callout } from "./callouts";
import { JsonLd } from "./JsonLd";
import { Section } from "./Section";
import { StickyNav } from "./StickyNav";

const TIER_LABEL: Record<CityGuide["attractions"][number]["tier"], string> = {
  essential: "Essential",
  "extra-time": "If you have extra time",
  niche: "Niche but rewarding",
  conditional: "Only under certain conditions",
  overrated: "Often overrated",
};

export function CityGuideView({ city, guide }: { city: City; guide: CityGuide }) {
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
    <div className="min-h-dvh bg-paper text-ink">
      <JsonLd city={city} guide={guide} />
      <header className="absolute top-0 right-0 left-0 z-20 flex items-center justify-between px-4 py-4 text-warm md:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full bg-void/45 px-3 py-2 text-sm backdrop-blur-md"
        >
          <ArrowLeft className="size-4" strokeWidth={1.75} />
          Globe
        </Link>
        <Link to="/" className="font-display text-lg text-warm italic">
          {SITE.name}
        </Link>
      </header>

      <section className="relative isolate min-h-[72vh] overflow-hidden">
        <img
          src={guide.hero.url}
          alt={guide.hero.alt}
          className="absolute inset-0 size-full object-cover outline outline-1 -outline-offset-1 outline-black/20"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(7,8,12,0.78),rgba(7,8,12,0.18)_55%,rgba(7,8,12,0.35))]" />
        <div className="relative mx-auto flex min-h-[72vh] max-w-6xl flex-col justify-end px-4 pb-12 pt-28 md:px-8 md:pb-16">
          <p className="text-[11px] tracking-[0.22em] text-silver uppercase">
            {city.country} · Travel guide
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-5xl leading-[0.95] text-warm italic md:text-7xl">
            {guide.title}
          </h1>
          <p className="mt-4 max-w-xl text-base text-warm/80 md:text-lg">{guide.subtitle}</p>
        </div>
      </section>

      <StickyNav />

      <section id="overview" className="scroll-mt-20 py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <p className="text-[11px] tracking-[0.18em] text-muted-paper uppercase">City snapshot</p>
          <h2 className="mt-2 font-display text-3xl text-ink italic md:text-4xl">Thirty seconds on {city.name}</h2>
          <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-[22px] bg-line-paper md:grid-cols-3 lg:grid-cols-4">
            {snapshotEntries.map(([label, value]) => (
              <div key={label} className="bg-paper-2 px-4 py-3">
                <dt className="text-[11px] tracking-[0.14em] text-muted-paper uppercase">{label}</dt>
                <dd className="mt-1 text-sm leading-snug text-ink">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="font-display text-2xl italic">Why go</h3>
              <p className="mt-3 leading-relaxed text-ink-soft">{guide.whyGo}</p>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm tracking-[0.14em] text-ink uppercase">Who will love it</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-soft">
                  {guide.whoWillLoveIt.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm tracking-[0.14em] text-ink uppercase">Who may struggle</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-soft">
                  {guide.whoMayStruggle.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
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
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {guide.beforeYouGo.map((item) => (
              <article key={item.title} className="rounded-[22px] px-5 py-4 shadow-[var(--shadow-paper)]">
                <h3 className="text-base font-medium">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Section id="neighborhoods" eyebrow="Urban grain" title="Neighborhoods at a glance">
        <div className="grid gap-4 md:grid-cols-2">
          {guide.neighborhoods.map((area) => (
            <article key={area.name} className="rounded-[22px] p-5 shadow-[var(--shadow-paper)]">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-2xl italic">{area.name}</h3>
                <p className="text-xs tracking-wide text-muted-paper uppercase">{area.price}</p>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{area.vibe}</p>
              <p className="mt-3 text-xs text-muted-paper">Best for {area.bestFor.join(", ")}</p>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-muted-paper">Noise</dt>
                  <dd>{area.noise}</dd>
                </div>
                <div>
                  <dt className="text-muted-paper">Safety</dt>
                  <dd>{area.safety}</dd>
                </div>
                <div>
                  <dt className="text-muted-paper">Transit</dt>
                  <dd>{area.transit}</dd>
                </div>
                <div>
                  <dt className="text-muted-paper">Stay</dt>
                  <dd>{area.stayNights}</dd>
                </div>
              </dl>
              <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                <div>
                  <p className="text-[11px] tracking-[0.14em] text-ok uppercase">Pros</p>
                  <ul className="mt-1 list-disc pl-4 text-ink-soft">
                    {area.pros.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[11px] tracking-[0.14em] text-warn uppercase">Tradeoffs</p>
                  <ul className="mt-1 list-disc pl-4 text-ink-soft">
                    {area.cons.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="mt-4 text-sm text-ink-soft">
                Combine with {area.combineWith}
              </p>
            </article>
          ))}
        </div>
        <div className="mt-8 overflow-x-auto rounded-[22px] shadow-[var(--shadow-paper)]">
          <table className="min-w-full text-left text-sm">
            <caption className="px-4 py-3 text-left text-[11px] tracking-[0.16em] text-muted-paper uppercase">
              Best area for…
            </caption>
            <thead className="bg-paper-2 text-xs tracking-wide text-muted-paper uppercase">
              <tr>
                <th className="px-4 py-2 font-medium">If you are</th>
                <th className="px-4 py-2 font-medium">Stay in</th>
                <th className="px-4 py-2 font-medium">Why</th>
              </tr>
            </thead>
            <tbody>
              {guide.bestAreaFor.map((row) => (
                <tr key={row.persona} className="border-t border-line-paper">
                  <td className="px-4 py-3 font-medium">{row.persona}</td>
                  <td className="px-4 py-3">{row.area}</td>
                  <td className="px-4 py-3 text-ink-soft">{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="things-to-do" eyebrow="Time well spent" title="Attractions and things to do">
        <div className="space-y-4">
          {guide.attractions.map((place) => (
            <article key={place.name} className="rounded-[22px] p-5 shadow-[var(--shadow-paper)]">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-2xl italic">{place.name}</h3>
                <p className="text-[11px] tracking-[0.14em] text-muted-paper uppercase">
                  {TIER_LABEL[place.tier]}
                </p>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{place.summary}</p>
              <p className="mt-2 text-sm text-ink">{place.whyItMatters}</p>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                <Fact label="Duration" value={place.duration} />
                <Fact label="Price" value={place.price} />
                <Fact label="Hours" value={place.hours} />
                <Fact label="Reservation" value={place.reservation} />
                <Fact label="Queue" value={place.queue} />
                <Fact label="Crowds" value={place.crowd} />
                <Fact label="Best time" value={place.bestTime} />
                <Fact label="Transport" value={place.transport} />
              </dl>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <Callout kind="worth-it" title="Worth it?">
                  {place.worthIt}
                </Callout>
                <Callout kind="local-tip" title="Local tip">
                  {place.tips[0]}
                </Callout>
                <Callout kind="watch-out" title="Common mistake">
                  {place.mistakes[0]}
                </Callout>
              </div>
              <p className="mt-3 text-sm text-ink-soft">If it is crowded or closed: {place.alternative}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {guide.thingsToDo.map((item) => (
            <article key={item.title} className="rounded-[22px] p-5 shadow-[var(--shadow-paper)]">
              <h3 className="text-lg font-medium">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.body}</p>
              <p className="mt-3 text-xs text-muted-paper">
                {item.duration} · {item.who}
              </p>
            </article>
          ))}
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {guide.hiddenGems.map((item) => (
            <article key={item.title} className="rounded-[22px] p-5 shadow-[var(--shadow-paper)]">
              <h3 className="font-display text-xl italic">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.body}</p>
              {item.watchOut ? (
                <p className="mt-3 text-sm text-warn">{item.watchOut}</p>
              ) : null}
            </article>
          ))}
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {guide.localExperiences.map((item) => (
            <article key={item.title}>
              <h3 className="text-base font-medium">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.body}</p>
            </article>
          ))}
        </div>
        <div className="mt-10 space-y-4">
          {guide.everydayLife.map((item) => (
            <p key={item.title} className="text-sm leading-relaxed text-ink-soft">
              <span className="font-medium text-ink">{item.title}. </span>
              {item.body}
            </p>
          ))}
        </div>
      </Section>

      <Section id="food" eyebrow="What to eat" title="Food and drinks" intro={guide.foodIntro}>
        <div className="grid gap-4 md:grid-cols-2">
          {guide.dishes.map((dish) => (
            <article key={dish.name} className="rounded-[22px] p-5 shadow-[var(--shadow-paper)]">
              <h3 className="font-display text-2xl italic">{dish.name}</h3>
              {dish.localName ? <p className="text-xs text-muted-paper">{dish.localName}</p> : null}
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{dish.what}</p>
              <p className="mt-2 text-sm text-ink">{dish.taste}</p>
              <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <Fact label="When" value={dish.when} />
                <Fact label="Price" value={dish.price} />
                <Fact label="Where" value={dish.where} />
                <Fact label="How to order" value={dish.howToOrder} />
              </dl>
              {dish.note ? <p className="mt-3 text-sm text-ink-soft">{dish.note}</p> : null}
            </article>
          ))}
        </div>
        <div className="mt-8 space-y-5">
          {guide.foodThemes.map((theme) => (
            <article key={theme.title}>
              <h3 className="text-lg font-medium">{theme.title}</h3>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-soft">{theme.body}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 overflow-x-auto rounded-[22px] shadow-[var(--shadow-paper)]">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-paper-2 text-xs tracking-wide text-muted-paper uppercase">
              <tr>
                <th className="px-4 py-2 font-medium">Place</th>
                <th className="px-4 py-2 font-medium">Type</th>
                <th className="px-4 py-2 font-medium">Neighborhood</th>
                <th className="px-4 py-2 font-medium">Price</th>
              </tr>
            </thead>
            <tbody>
              {guide.venues.map((venue) => (
                <tr key={venue.name} className="border-t border-line-paper align-top">
                  <td className="px-4 py-3">
                    <p className="font-medium">{venue.name}</p>
                    <p className="text-ink-soft">{venue.why}</p>
                  </td>
                  <td className="px-4 py-3">{venue.type}</td>
                  <td className="px-4 py-3">{venue.neighborhood}</td>
                  <td className="px-4 py-3">{venue.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {guide.shopping.map((item) => (
            <article key={item.title} className="rounded-[22px] p-5 shadow-[var(--shadow-paper)]">
              <h3 className="text-base font-medium">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.body}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section id="stay" eyebrow="Where to sleep" title="Where to stay" intro={guide.stayIntro}>
        <div className="grid gap-4 md:grid-cols-2">
          {guide.stayAreas.map((area) => (
            <article key={area.name} className="rounded-[22px] p-5 shadow-[var(--shadow-paper)]">
              <h3 className="font-display text-2xl italic">{area.name}</h3>
              <p className="mt-1 text-xs text-muted-paper">Best for {area.bestFor.join(", ")}</p>
              <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <Fact label="Commute" value={area.commute} />
                <Fact label="Price" value={area.priceHint} />
                <Fact label="Noise" value={area.noise} />
                <Fact label="Safety" value={area.safety} />
              </dl>
            </article>
          ))}
        </div>
        <ul className="mt-6 list-disc space-y-2 pl-5 text-sm text-ink-soft">
          {guide.stayNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </Section>

      <Section id="transport" eyebrow="Getting in and around" title="Transport">
        <h3 className="mb-3 text-sm tracking-[0.14em] text-muted-paper uppercase">Airport and station arrival</h3>
        <div className="overflow-x-auto rounded-[22px] shadow-[var(--shadow-paper)]">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-paper-2 text-xs tracking-wide text-muted-paper uppercase">
              <tr>
                <th className="px-4 py-2 font-medium">Option</th>
                <th className="px-4 py-2 font-medium">Time</th>
                <th className="px-4 py-2 font-medium">Cost</th>
                <th className="px-4 py-2 font-medium">Best for</th>
              </tr>
            </thead>
            <tbody>
              {guide.arrival.map((row) => (
                <tr key={row.name} className="border-t border-line-paper align-top">
                  <td className="px-4 py-3">
                    <p className="font-medium">{row.name}</p>
                    <p className="text-ink-soft">{row.how}</p>
                    {row.watchOut ? <p className="mt-1 text-warn">{row.watchOut}</p> : null}
                  </td>
                  <td className="px-4 py-3">{row.time}</td>
                  <td className="px-4 py-3">{row.cost}</td>
                  <td className="px-4 py-3">{row.bestFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {guide.gettingAround.map((item) => (
            <article key={item.title} className="rounded-[22px] p-5 shadow-[var(--shadow-paper)]">
              <h3 className="text-base font-medium">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.body}</p>
            </article>
          ))}
        </div>
        <h3 className="mt-10 mb-3 text-sm tracking-[0.14em] text-muted-paper uppercase">Day trips</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {guide.dayTrips.map((trip) => (
            <article key={trip.name} className="rounded-[22px] p-5 shadow-[var(--shadow-paper)]">
              <h3 className="font-display text-xl italic">{trip.name}</h3>
              <p className="mt-1 text-xs text-muted-paper">{trip.time}</p>
              <p className="mt-2 text-sm text-ink-soft">{trip.why}</p>
              <p className="mt-2 text-sm text-warn">Skip if {trip.skipIf}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section id="money" eyebrow="Costs" title="Budget and payments">
        <p className="mb-4 text-sm text-muted-paper">
          {guide.budget.currency} · {guide.budget.asOf}
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {guide.budget.bands.map((band) => (
            <article key={band.name} className="rounded-[22px] p-5 shadow-[var(--shadow-paper)]">
              <h3 className="text-sm tracking-[0.14em] uppercase">{band.name}</h3>
              <p className="mt-2 font-display text-3xl italic">{band.daily}</p>
              <p className="mt-2 text-sm text-ink-soft">{band.includes}</p>
            </article>
          ))}
        </div>
        <div className="mt-6 overflow-x-auto rounded-[22px] shadow-[var(--shadow-paper)]">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-paper-2 text-xs tracking-wide text-muted-paper uppercase">
              <tr>
                <th className="px-4 py-2 font-medium">Item</th>
                <th className="px-4 py-2 font-medium">Budget</th>
                <th className="px-4 py-2 font-medium">Mid-range</th>
                <th className="px-4 py-2 font-medium">Luxury</th>
              </tr>
            </thead>
            <tbody>
              {guide.budget.breakdown.map((row) => (
                <tr key={row.item} className="border-t border-line-paper">
                  <td className="px-4 py-3">{row.item}</td>
                  <td className="px-4 py-3">{row.budget}</td>
                  <td className="px-4 py-3">{row.mid}</td>
                  <td className="px-4 py-3">{row.luxury}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
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
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {guide.payments.map((item) => (
            <article key={item.title} className="rounded-[22px] p-5 shadow-[var(--shadow-paper)]">
              <h3 className="text-base font-medium">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.body}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section id="connectivity" eyebrow="Before you fly" title="Visa, SIM, and weather">
        <Callout kind="watch-out" title="Visa and entry">
          {guide.visa.summary}
        </Callout>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-ink-soft">
          {guide.visa.details.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <a
          href={guide.visa.officialUrl}
          className="mt-3 inline-flex items-center gap-1 text-sm text-ink"
          target="_blank"
          rel="noreferrer"
        >
          Official source <ArrowUpRight className="size-3.5" />
        </a>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {guide.connectivity.map((item) => (
            <article key={item.title} className="rounded-[22px] p-5 shadow-[var(--shadow-paper)]">
              <h3 className="text-base font-medium">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.body}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {guide.seasons.map((season) => (
            <article key={season.name} className="rounded-[22px] p-5 shadow-[var(--shadow-paper)]">
              <h3 className="font-display text-xl italic">{season.name}</h3>
              <p className="mt-1 text-xs text-muted-paper">{season.forWhom}</p>
              <p className="mt-2 text-sm text-ink-soft">{season.pros}</p>
              <p className="mt-2 text-sm text-warn">{season.cons}</p>
              <p className="mt-2 text-sm">{season.pack}</p>
            </article>
          ))}
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {guide.weatherTips.map((item) => (
            <Callout key={item.title} kind="good-to-know" title={item.title}>
              {item.body}
            </Callout>
          ))}
        </div>
        <ul className="mt-6 space-y-2 text-sm text-ink-soft">
          {guide.festivals.map((fest) => (
            <li key={fest.name}>
              <span className="font-medium text-ink">{fest.name}</span> · {fest.when}. {fest.note}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="apps" eyebrow="Phone" title="Essential apps">
        <div className="grid gap-3 md:grid-cols-2">
          {guide.apps.map((app) => (
            <article key={app.name} className="flex items-start justify-between gap-3 rounded-[22px] p-4 shadow-[var(--shadow-paper)]">
              <div>
                <h3 className="text-base font-medium">{app.name}</h3>
                <p className="mt-1 text-sm text-ink-soft">{app.purpose}</p>
                <p className="mt-2 text-xs text-muted-paper">
                  {app.platforms}
                  {app.needLocalNumber ? " · local number" : ""}
                  {app.needLocalBank ? " · local bank" : ""}
                  {app.offline ? " · works offline" : ""}
                </p>
                <p className="mt-2 text-sm text-ink-soft">{app.note}</p>
              </div>
              <p className="shrink-0 text-[10px] tracking-[0.14em] text-muted-paper uppercase">
                {app.necessary === "before" ? "Install before" : app.necessary === "after" ? "After arrival" : "Skip unless"}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section id="culture" eyebrow="How the city behaves" title="Culture and etiquette">
        <div className="space-y-4">
          {guide.culture.map((item) => (
            <article key={item.title}>
              <h3 className="text-lg font-medium">{item.title}</h3>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-soft">{item.body}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 overflow-x-auto rounded-[22px] shadow-[var(--shadow-paper)]">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-paper-2 text-xs tracking-wide text-muted-paper uppercase">
              <tr>
                <th className="px-4 py-2 font-medium">Do</th>
                <th className="px-4 py-2 font-medium">Don't</th>
                <th className="px-4 py-2 font-medium">Why</th>
              </tr>
            </thead>
            <tbody>
              {guide.etiquette.map((row) => (
                <tr key={row.do} className="border-t border-line-paper align-top">
                  <td className="px-4 py-3">{row.do}</td>
                  <td className="px-4 py-3">{row.dont}</td>
                  <td className="px-4 py-3 text-ink-soft">{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="mt-6 list-disc space-y-1 pl-5 text-sm text-ink-soft">
          {guide.taboos.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {guide.phrases.map((phrase) => (
            <article key={phrase.original} className="rounded-[22px] p-4 shadow-[var(--shadow-paper)]">
              <p className="font-display text-2xl italic">{phrase.original}</p>
              <p className="text-sm text-muted-paper">{phrase.romanized}</p>
              <p className="mt-2 text-sm">{phrase.meaning}</p>
              <p className="mt-2 text-sm text-ink-soft">Use: {phrase.use}</p>
              <p className="text-sm text-warn">Avoid: {phrase.avoid}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 space-y-3">
          {guide.localModules.map((item) => (
            <article key={item.title}>
              <h3 className="text-base font-medium">{item.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{item.body}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section id="safety" eyebrow="Keep it specific" title="Safety, scams, and access">
        <div className="grid gap-4 md:grid-cols-2">
          {guide.safety.map((item) => (
            <article key={item.title} className="rounded-[22px] p-5 shadow-[var(--shadow-paper)]">
              <h3 className="text-base font-medium">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.body}</p>
            </article>
          ))}
        </div>
        <div className="mt-6 space-y-3">
          {guide.scams.map((scam) => (
            <article key={scam.name} className="rounded-[22px] p-5 shadow-[var(--shadow-paper)]">
              <h3 className="text-base font-medium">{scam.name}</h3>
              <p className="mt-2 text-sm text-ink-soft">Look for: {scam.lookFor}</p>
              <p className="text-sm text-ink-soft">Prevent: {scam.prevent}</p>
              <p className="text-sm text-ink-soft">If it happens: {scam.ifItHappens}</p>
            </article>
          ))}
        </div>
        <dl className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {guide.emergency.map((item) => (
            <div key={item.label} className="rounded-[18px] bg-paper-2 px-4 py-3">
              <dt className="text-[11px] tracking-[0.14em] text-muted-paper uppercase">{item.label}</dt>
              <dd className="mt-1 text-sm">{item.value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {guide.accessibility.map((item) => (
            <article key={item.title}>
              <h3 className="text-base font-medium">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.body}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {guide.byTraveler.map((item) => (
            <article key={item.persona} className="rounded-[22px] p-5 shadow-[var(--shadow-paper)]">
              <h3 className="text-base font-medium">{item.persona}</h3>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-ink-soft">
                {item.tips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <Callout kind="watch-out" title="Things visitors often get wrong">
          <ul className="list-disc pl-4">
            {guide.touristsGetWrong.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Callout>
      </Section>

      <Section id="itinerary" eyebrow="Time" title="Suggested itineraries">
        <div className="mb-6 grid gap-3 md:grid-cols-2">
          {guide.timePlanning.map((item) => (
            <article key={item.title}>
              <h3 className="text-base font-medium">{item.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{item.body}</p>
            </article>
          ))}
        </div>
        <div className="space-y-8">
          {guide.itineraries.map((plan) => (
            <article key={plan.title} className="rounded-[26px] p-5 shadow-[var(--shadow-paper)] md:p-6">
              <p className="text-[11px] tracking-[0.16em] text-muted-paper uppercase">
                {plan.days} day · {plan.pace}
              </p>
              <h3 className="mt-1 font-display text-3xl italic">{plan.title}</h3>
              <p className="mt-2 max-w-2xl text-sm text-ink-soft">{plan.summary}</p>
              <div className="mt-5 space-y-5">
                {plan.daysPlan.map((day) => (
                  <div key={day.label}>
                    <h4 className="text-sm font-medium">
                      {day.label} — {day.theme}
                    </h4>
                    <ol className="mt-2 space-y-2">
                      {day.stops.map((stop) => (
                        <li key={`${day.label}-${stop.title}`} className="grid grid-cols-[4.5rem_1fr] gap-3 text-sm">
                          <span className="tabular-nums text-muted-paper">{stop.time}</span>
                          <span>
                            <span className="font-medium">{stop.title}. </span>
                            <span className="text-ink-soft">{stop.detail}</span>
                          </span>
                        </li>
                      ))}
                    </ol>
                    <p className="mt-2 text-sm text-ink-soft">If it rains: {day.rainPlan}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section id="faq" eyebrow="Direct answers" title="FAQ">
        <div className="divide-y divide-line-paper rounded-[22px] shadow-[var(--shadow-paper)]">
          {guide.faq.map((item) => (
            <details key={item.q} className="group px-5 py-4">
              <summary className="cursor-pointer list-none text-base font-medium marker:content-none">
                {item.q}
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-10 border-t border-line-paper pt-8">
          <h3 className="text-sm tracking-[0.14em] text-muted-paper uppercase">Sources</h3>
          <ul className="mt-3 space-y-1 text-sm">
            {guide.sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} className="text-ink underline-offset-2 hover:underline" target="_blank" rel="noreferrer">
                  {source.name}
                </a>
                <span className="text-muted-paper"> — {source.usedFor}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted-paper">
            Last updated: {guide.lastUpdated}. Hero photo: {guide.hero.author} / {guide.hero.license}.
          </p>
        </div>
      </Section>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] tracking-[0.12em] text-muted-paper uppercase">{label}</dt>
      <dd className="mt-0.5 text-ink">{value}</dd>
    </div>
  );
}
