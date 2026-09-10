import { useEffect, useRef, useState } from "react";
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
import { cn } from "@/lib/utils";
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

type HomeLayout = "overlay" | "copy-left" | "globe-left";
const LAYOUT_KEY = "meridian-home-layout";

function Home() {
  const { cities, countries, published } = Route.useLoaderData();
  const navigate = useNavigate();
  const globeRef = useRef<GlobeHandle | null>(null);
  const { reduced, ready } = usePrefersReducedMotion();
  const [leaving, setLeaving] = useState(false);
  const [layout, setLayout] = useState<HomeLayout>("overlay");
  const locale = useI18n((s) => s.locale);
  const strings = t(locale);

  useEffect(() => {
    const saved = window.localStorage.getItem(LAYOUT_KEY);
    if (saved === "overlay" || saved === "copy-left" || saved === "globe-left") {
      setLayout(saved);
    }
  }, []);

  const chooseLayout = (next: HomeLayout) => {
    setLayout(next);
    window.localStorage.setItem(LAYOUT_KEY, next);
  };

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

  const overlay = layout === "overlay";
  const copyLeft = layout === "copy-left";

  const copyPanel = (
    <div
      className={cn(
        "relative z-10 flex min-h-0 flex-col",
        overlay
          ? "pointer-events-none h-full"
          : "h-auto justify-center px-6 py-8 md:h-full md:w-[min(42%,34rem)] md:shrink-0 md:px-10 lg:px-14",
      )}
    >
      <div
        className={cn(
          overlay
            ? "flex flex-1 flex-col items-center px-4 pt-[13vh] md:pt-[15vh]"
            : "flex flex-col items-start",
        )}
      >
        <TypingTitle reducedMotion={reduced} ready={ready} align={overlay ? "center" : "left"} />
        <div id="search" className={cn("pointer-events-auto mt-8 w-full md:mt-10", !overlay && "max-w-xl")}>
          <SearchBar
            cities={cities}
            countries={countries}
            onSelect={openCity}
            className={overlay ? undefined : "mx-0 w-full max-w-xl"}
          />
        </div>
      </div>

      <nav
        aria-label="Published guides"
        className={cn(
          "pointer-events-auto flex gap-2 px-4",
          overlay
            ? "justify-center pb-[calc(4.5rem+env(safe-area-inset-bottom))]"
            : "mt-10 flex-wrap justify-start px-0 pb-2",
        )}
      >
        {published.map((city) => (
          <Button key={city.id} type="button" variant="ghost" size="sm" onClick={() => void openCity(city)}>
            {city.name}
          </Button>
        ))}
      </nav>
    </div>
  );

  const globePanel = (
    <div className={cn("relative min-h-0", overlay ? "absolute inset-0" : "min-h-[48vh] flex-1")}>
      <Globe
        reducedMotion={reduced}
        cities={cities}
        countries={countries}
        onCitySelect={openCity}
        globeRef={globeRef}
        heroBand={overlay}
      />
    </div>
  );

  return (
    <main className="relative h-dvh overflow-hidden bg-void text-fg">
      <a
        href="#search"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-30 focus:rounded-md focus:bg-void-elevated focus:px-3 focus:py-2"
      >
        {strings.skip}
      </a>

      <div
        className={cn(
          "flex h-full flex-col transition-[opacity,filter,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          leaving ? "translate-y-2 opacity-0 blur-sm" : "opacity-100",
        )}
      >
        <header
          className={cn(
            "z-20 flex items-center justify-between gap-3 px-5 py-4 md:px-8",
            overlay ? "absolute inset-x-0 top-0" : "relative",
          )}
        >
          <p className="text-xl font-medium tracking-tight text-fg">{SITE.name}</p>
          <LayoutSwitch layout={layout} onChange={chooseLayout} />
        </header>

        {overlay ? (
          <div className="relative min-h-0 flex-1">
            {globePanel}
            {copyPanel}
          </div>
        ) : (
          <div
            className={cn(
              "flex min-h-0 flex-1 flex-col md:flex-row",
              !copyLeft && "md:flex-row-reverse",
            )}
          >
            {copyPanel}
            {globePanel}
          </div>
        )}
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

function LayoutSwitch({
  layout,
  onChange,
}: {
  layout: HomeLayout;
  onChange: (layout: HomeLayout) => void;
}) {
  const locale = useI18n((s) => s.locale);
  const strings = t(locale);
  const options: { id: HomeLayout; label: string }[] = [
    { id: "overlay", label: strings.layoutOverlay },
    { id: "copy-left", label: strings.layoutCopyLeft },
    { id: "globe-left", label: strings.layoutGlobeLeft },
  ];

  return (
    <div
      className="pointer-events-auto inline-flex items-center rounded-full bg-void-elevated p-1 shadow-border"
      role="group"
      aria-label={strings.layoutGroup}
    >
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          className={cn(
            "rounded-full px-2.5 py-1.5 text-xs transition-colors duration-150 md:px-3 md:text-sm",
            layout === option.id ? "bg-accent font-medium text-void" : "text-muted hover:text-fg",
          )}
          aria-pressed={layout === option.id}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
