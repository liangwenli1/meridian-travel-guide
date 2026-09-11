import { Link } from "@tanstack/react-router";
import { ArrowDownRight, ArrowRight } from "lucide-react";
import { LetterForm } from "@/components/letter/LetterForm";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/Button";
import { cityHours } from "@/data/hours";
import { dispatches } from "@/data/dispatches";
import { getGuide } from "@/data/guides";
import { t, useI18n } from "@/lib/i18n";
import type { City } from "@/types/catalog";

export function Atlas({ published }: { published: City[] }) {
  const locale = useI18n((s) => s.locale);
  const strings = t(locale);

  return (
    <>
      <section id="guides" className="px-6 py-20 md:px-10 md:py-24 lg:px-14">
        <div className="scene-item">
          <p className="kicker text-accent">{strings.guidesKicker}</p>
          <h2 className="mt-3 max-w-3xl text-4xl font-medium tracking-tight md:text-5xl">{strings.guidesTitle}</h2>
          <p className="mt-4 max-w-xl text-base text-muted">{strings.guidesDek}</p>
        </div>
        <div className="scene-item mt-8 grid min-h-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {published.map((city) => {
            const guide = getGuide(city.slug);
            return (
              <Link
                key={city.id}
                to="/$country/$city"
                params={{ country: city.countrySlug, city: city.slug }}
                search={{ s: "overview" }}
                className="group relative block min-h-[28vh] overflow-hidden rounded-2xl bg-void-elevated shadow-border transition-transform duration-200 ease-out hover:-translate-y-0.5"
              >
                <div className="relative h-full min-h-[28vh] overflow-hidden sm:min-h-[32vh]">
                  {guide ? (
                    <img
                      src={guide.hero.url}
                      alt={guide.hero.alt}
                      className="content-img absolute inset-0 size-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-void-elevated" />
                  )}
                  <div className="absolute inset-0 bg-[linear-gradient(to-top,rgba(0,0,0,0.78),rgba(0,0,0,0.12))]" />
                  <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                    <p className="kicker text-silver">{city.country}</p>
                    <p className="mt-1 flex items-end justify-between gap-3 text-3xl font-medium tracking-tight text-fg">
                      {city.name}
                      <ArrowDownRight className="mb-1 size-5 shrink-0 text-accent transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </p>
                    <p className="mt-2 line-clamp-2 max-w-md text-sm text-fg/75">{city.shortDescription}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section id="desk" className="px-6 py-20 md:px-10 md:py-24 lg:px-14">
        <div className="scene-item">
          <p className="kicker text-accent">{strings.dispatchKicker}</p>
          <h2 className="mt-3 text-4xl font-medium tracking-tight md:text-5xl">{strings.dispatchTitle}</h2>
        </div>
        <ol className="scene-item mt-10 divide-y divide-line border-y border-line">
          {dispatches.map((item) => (
            <li key={item.slug}>
              <article className="grid gap-3 py-6 md:grid-cols-[8rem_1fr_auto] md:items-baseline md:gap-8">
                <p className="kicker text-muted">{item.date}</p>
                <div>
                  <p className="kicker text-accent">{item.kicker[locale]}</p>
                  <h3 className="mt-2 text-2xl font-medium tracking-tight text-fg md:text-3xl">{item.title[locale]}</h3>
                  <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">{item.dek[locale]}</p>
                </div>
                <span className="hidden text-sm text-muted md:inline">{strings.readingNote}</span>
              </article>
            </li>
          ))}
        </ol>
      </section>

      <section id="hours" className="px-6 py-20 md:px-10 md:py-24 lg:px-14">
        <div className="scene-item">
          <p className="kicker text-accent">{strings.hoursKicker}</p>
          <h2 className="mt-3 max-w-3xl text-4xl font-medium tracking-tight md:text-5xl">{strings.hoursTitle}</h2>
          <p className="mt-4 max-w-xl text-base text-muted">{strings.hoursDek}</p>
        </div>
        <ol className="scene-item mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {cityHours.map((hour) => (
            <li key={hour.time} className="hour-cell">
              <p className="font-mono text-sm tracking-wide text-accent">{hour.time}</p>
              <h3 className="mt-2 text-xl font-medium tracking-tight">{hour.title[locale]}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{hour.body[locale]}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="method" className="px-6 py-20 md:px-10 md:py-24 lg:px-14">
        <div className="scene-item">
          <p className="kicker text-accent">{strings.methodKicker}</p>
          <h2 className="mt-3 max-w-2xl text-4xl font-medium tracking-tight md:text-5xl">{strings.methodTitle}</h2>
        </div>
        <div className="scene-item mt-10 grid gap-4 md:grid-cols-3">
          {[strings.methodWalk, strings.methodNight, strings.methodNoFiller].map((block, index) => (
            <div key={block.title} className="h-full rounded-2xl bg-void-elevated p-6 shadow-border md:p-8">
              <p className="font-mono text-xs tracking-[0.18em] text-accent uppercase">0{index + 1}</p>
              <h3 className="mt-4 text-xl font-medium tracking-tight">{block.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{block.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="letter" className="flex flex-col">
        <div className="px-6 py-20 md:px-10 md:py-24 lg:px-14">
          <div className="scene-item grid items-end gap-8 md:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="kicker text-accent">{strings.letterKicker}</p>
              <h2 className="mt-3 text-4xl font-medium tracking-tight md:text-5xl">{strings.letterTitle}</h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">{strings.letterDek}</p>
              <div className="mt-8">
                <LetterForm />
              </div>
            </div>
            <div className="rounded-2xl bg-void-elevated p-6 shadow-border">
              <p className="text-sm font-medium text-fg">{strings.passTitle}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{strings.passDek}</p>
              <Button asChild className="mt-5">
                <Link to="/pass">
                  {strings.passCta}
                  <ArrowRight className="size-4" strokeWidth={1.75} />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <SiteFooter />
      </section>
    </>
  );
}
