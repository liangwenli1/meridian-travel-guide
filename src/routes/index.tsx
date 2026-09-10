import { useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Globe, type GlobeHandle } from "@/components/globe/Globe";
import { TypingTitle } from "@/components/hero/TypingTitle";
import { SearchBar } from "@/components/search/SearchBar";
import { publishedCities } from "@/data/cities";
import { usePrefersReducedMotion } from "@/lib/motion";
import { SITE } from "@/lib/site";
import type { City } from "@/types/catalog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${SITE.name} — Where do you want to go?` },
      { name: "description", content: SITE.description },
    ],
  }),
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const globeRef = useRef<GlobeHandle | null>(null);
  const { reduced, ready } = usePrefersReducedMotion();
  const [leaving, setLeaving] = useState(false);

  const openCity = async (city: City) => {
    if (leaving) return;
    setLeaving(true);
    try {
      if (!reduced) {
        await Promise.race([
          globeRef.current?.flyToCity(city) ?? Promise.resolve(),
          new Promise<void>((resolve) => {
            window.setTimeout(resolve, 1600);
          }),
        ]);
      }
    } finally {
      await navigate({
        to: "/$country/$city",
        params: { country: city.countrySlug, city: city.slug },
      });
    }
  };

  return (
    <main className="relative h-dvh overflow-hidden bg-void text-warm">
      <a
        href="#search"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-30 focus:rounded-md focus:bg-void-elevated focus:px-3 focus:py-2"
      >
        Skip to search
      </a>
      <Globe reducedMotion={reduced} onCitySelect={openCity} globeRef={globeRef} />

      <div
        className={`pointer-events-none relative z-10 flex h-full flex-col transition-opacity duration-500 ${
          leaving ? "opacity-0" : "opacity-100"
        }`}
      >
        <header className="flex items-center justify-between px-5 pt-5 md:px-8">
          <p className="pointer-events-auto font-display text-xl tracking-tight text-warm italic">
            {SITE.name}
          </p>
          <p className="hidden text-xs tracking-[0.2em] text-muted uppercase sm:block">
            City guides
          </p>
        </header>

        <div className="flex flex-1 flex-col items-center px-4 pt-[13vh] md:pt-[15vh]">
          <TypingTitle reducedMotion={reduced} ready={ready} />
          <div id="search" className="pointer-events-auto mt-8 w-full md:mt-10">
            <SearchBar onSelect={openCity} />
          </div>
        </div>

        <nav
          aria-label="Published guides"
          className="pointer-events-auto flex justify-center gap-5 px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] text-sm text-muted"
        >
          {publishedCities.map((city) => (
            <button
              key={city.id}
              type="button"
              className="transition-colors hover:text-warm"
              onClick={() => void openCity(city)}
            >
              {city.name}
            </button>
          ))}
        </nav>
      </div>
    </main>
  );
}
