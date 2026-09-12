import { useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { Globe, type GlobeHandle } from "@/components/globe/Globe";
import { Atlas } from "@/components/home/Atlas";
import { TypingTitle } from "@/components/hero/TypingTitle";
import { SearchBar } from "@/components/search/SearchBar";
import { SiteHeader } from "@/components/site/SiteHeader";
import { t, useI18n } from "@/lib/i18n";
import { usePrefersReducedMotion } from "@/lib/motion";
import { getHomeCatalog } from "@/lib/server/catalog";
import { SITE } from "@/lib/site";
import type { City } from "@/types/catalog";

export const Route = createFileRoute("/")({
  loader: () => getHomeCatalog(),
  head: () => ({
    meta: [
      { title: `${SITE.name} — Where do you want to go?` },
      { name: "description", content: SITE.description },
    ],
  }),
  component: Home,
});

function Home() {
  const { cities, countries, published } = Route.useLoaderData();
  const navigate = useNavigate();
  const globeRef = useRef<GlobeHandle | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const { reduced, ready } = usePrefersReducedMotion();
  const [leaving, setLeaving] = useState(false);
  const locale = useI18n((s) => s.locale);

  const openCity = async (city: City) => {
    if (leaving) return;
    setLeaving(true);
    try {
      if (!reduced) {
        await Promise.race([
          globeRef.current?.flyToCity(city) ?? Promise.resolve(),
          new Promise<void>((resolve) => {
            window.setTimeout(resolve, 1400);
          }),
        ]);
        await new Promise<void>((resolve) => {
          window.setTimeout(resolve, reduced ? 0 : 280);
        });
      }
    } finally {
      const go = () =>
        navigate({
          to: "/$country/$city",
          params: { country: city.countrySlug, city: city.slug },
          search: { s: "overview" },
        });
      const doc = document as Document & {
        startViewTransition?: (cb: () => void) => { finished: Promise<void> };
      };
      if (doc.startViewTransition) {
        await doc.startViewTransition(() => {
          void go();
        }).finished.catch(() => undefined);
      } else {
        await go();
      }
    }
  };

  const scrollAtlas = () => {
    document.getElementById("guides")?.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <div ref={scrollerRef} className="home-snap bg-void text-fg">
      <a
        href="#search"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-30 focus:rounded-md focus:bg-void-elevated focus:px-3 focus:py-2"
      >
        {t(locale).skip}
      </a>

      <section id="hero" className="home-page relative overflow-hidden">
        <div
          className={`flex h-full flex-col transition-[opacity,filter,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            leaving ? "translate-y-2 opacity-0 blur-sm" : "opacity-100"
          }`}
        >
          <div id="hero-fx" className="pointer-events-none absolute inset-0 z-10" aria-hidden="true" />
          <SiteHeader />

          <div className="relative min-h-0 flex-1">
            <div className="globe-stage absolute inset-0 z-0 cursor-pointer overflow-hidden">
              <Globe
                reducedMotion={reduced}
                cities={cities}
                countries={countries}
                onCitySelect={openCity}
                globeRef={globeRef}
                heroBand={false}
              />
            </div>
            <div className="hero-copy relative z-20 flex h-full w-full max-w-[42rem] flex-col items-center justify-center overflow-visible px-6 py-8 md:px-0">
              <TypingTitle reducedMotion={reduced} ready={ready} align="left" />
              <div id="search" className="hero-search pointer-events-auto mt-16 w-full md:mt-24">
                <SearchBar
                  cities={cities}
                  countries={countries}
                  onSelect={openCity}
                  className="mx-0 w-full max-w-none"
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={scrollAtlas}
            className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 text-xs tracking-[0.2em] text-muted uppercase transition-colors hover:text-fg"
          >
            {t(locale).scrollAtlas}
            <ChevronDown className="size-4 animate-bounce" strokeWidth={1.75} />
          </button>
        </div>
      </section>

      <Atlas published={published} />

      <div
        className={`pointer-events-none fixed inset-0 z-30 bg-void transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          leaving ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      />
    </div>
  );
}
