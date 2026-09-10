import { Link } from "@tanstack/react-router";
import { ArrowDownRight, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/fx/Reveal";
import { LetterForm } from "@/components/letter/LetterForm";
import { Button } from "@/components/ui/Button";
import { dispatches } from "@/data/dispatches";
import { getGuide } from "@/data/guides";
import { t, useI18n } from "@/lib/i18n";
import type { City } from "@/types/catalog";

export function Atlas({ published }: { published: City[] }) {
  const locale = useI18n((s) => s.locale);
  const strings = t(locale);

  return (
    <div className="relative bg-void text-fg">
      <section className="border-t border-line px-6 py-20 md:px-10 md:py-28">
        <Reveal>
          <p className="kicker text-accent">{strings.guidesKicker}</p>
          <h2 className="mt-3 max-w-2xl text-4xl font-medium tracking-tight md:text-5xl">{strings.guidesTitle}</h2>
          <p className="mt-4 max-w-xl text-base text-muted">{strings.guidesDek}</p>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {published.map((city, index) => {
            const guide = getGuide(city.slug);
            return (
              <Reveal key={city.id} delay={index * 80}>
                <Link
                  to="/$country/$city"
                  params={{ country: city.countrySlug, city: city.slug }}
                  search={{}}
                  className="group relative block overflow-hidden rounded-2xl bg-void-elevated shadow-border"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {guide ? (
                      <img
                        src={guide.hero.url}
                        alt={guide.hero.alt}
                        className="content-img size-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="size-full bg-void-elevated" />
                    )}
                    <div className="absolute inset-0 bg-[linear-gradient(to-top,rgba(0,0,0,0.78),rgba(0,0,0,0.12))]" />
                    <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                      <p className="kicker text-silver">{city.country}</p>
                      <p className="mt-1 flex items-end justify-between gap-3 text-3xl font-medium tracking-tight text-fg">
                        {city.name}
                        <ArrowDownRight className="mb-1 size-5 shrink-0 text-accent transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </p>
                      <p className="mt-2 max-w-md text-sm text-fg/75">{city.shortDescription}</p>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="border-t border-line px-6 py-20 md:px-10 md:py-28">
        <Reveal>
          <p className="kicker text-accent">{strings.dispatchKicker}</p>
          <h2 className="mt-3 text-4xl font-medium tracking-tight md:text-5xl">{strings.dispatchTitle}</h2>
        </Reveal>
        <ol className="mt-12 divide-y divide-line border-y border-line">
          {dispatches.map((item, index) => (
            <li key={item.slug}>
              <Reveal delay={index * 70}>
                <article className="grid gap-3 py-8 md:grid-cols-[8rem_1fr_auto] md:items-baseline md:gap-8">
                  <p className="kicker text-muted">{item.date}</p>
                  <div>
                    <p className="kicker text-accent">{item.kicker[locale]}</p>
                    <h3 className="mt-2 text-2xl font-medium tracking-tight text-fg md:text-3xl">{item.title[locale]}</h3>
                    <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">{item.dek[locale]}</p>
                  </div>
                  <span className="hidden text-sm text-muted md:inline">{strings.readingNote}</span>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-line px-6 py-20 md:px-10 md:py-28">
        <Reveal>
          <p className="kicker text-accent">{strings.methodKicker}</p>
          <h2 className="mt-3 max-w-2xl text-4xl font-medium tracking-tight md:text-5xl">{strings.methodTitle}</h2>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[strings.methodWalk, strings.methodNight, strings.methodNoFiller].map((block, index) => (
            <Reveal key={block.title} delay={index * 90}>
              <div className="h-full rounded-2xl bg-void-elevated p-6 shadow-border">
                <p className="font-mono text-xs tracking-[0.18em] text-accent uppercase">0{index + 1}</p>
                <h3 className="mt-4 text-xl font-medium tracking-tight">{block.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{block.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-line px-6 py-20 md:px-10 md:py-28">
        <Reveal>
          <div className="grid items-end gap-8 md:grid-cols-[1.2fr_1fr]">
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
              <Button
                type="button"
                className="mt-5"
                onClick={() => document.getElementById("letter-email")?.focus()}
              >
                {strings.passCta}
                <ArrowRight className="size-4" strokeWidth={1.75} />
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
