import { useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Globe, type GlobeHandle } from "@/components/globe/Globe";
import { TypingTitle } from "@/components/hero/TypingTitle";
import { SearchBar } from "@/components/search/SearchBar";
import { LanguageToggle } from "@/components/site/LanguageToggle";
import { Button } from "@/components/ui/Button";
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

  return (
    <main className="relative h-dvh overflow-hidden bg-void text-fg">
      <a
        href="#search"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-30 focus:rounded-md focus:bg-void-elevated focus:px-3 focus:py-2"
      >
        {t(locale).skip}
      </a>
      <Globe
        reducedMotion={reduced}
        cities={cities}
        countries={countries}
        onCitySelect={openCity}
        globeRef={globeRef}
      />

      <div
        className={`pointer-events-none relative z-10 flex h-full flex-col transition-[opacity,filter,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          leaving ? "translate-y-2 opacity-0 blur-sm" : "opacity-100"
        }`}
      >
        <header className="flex items-center justify-between px-5 pt-5 md:px-8">
          <p className="pointer-events-auto text-xl font-medium tracking-tight text-fg">
            {SITE.name}
          </p>
        </header>

        <div className="flex flex-1 flex-col items-center px-4 pt-[13vh] md:pt-[15vh]">
          <TypingTitle reducedMotion={reduced} ready={ready} />
          <div id="search" className="pointer-events-auto mt-8 w-full md:mt-10">
            <SearchBar cities={cities} countries={countries} onSelect={openCity} />
          </div>
        </div>

        <nav
          aria-label="Published guides"
          className="pointer-events-auto flex justify-center gap-2 px-4 pb-[calc(4.5rem+env(safe-area-inset-bottom))]"
        >
          {published.map((city) => (
            <Button
              key={city.id}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => void openCity(city)}
            >
              {city.name}
            </Button>
          ))}
        </nav>
      </div>

      <LanguageToggle className="pointer-events-auto absolute right-5 bottom-6 z-20 md:right-8" />

      <div
        className={`pointer-events-none absolute inset-0 z-30 bg-void transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          leaving ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      />
    </main>
  );
}
