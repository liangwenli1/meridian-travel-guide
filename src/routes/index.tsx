import { useEffect, useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { Globe, type GlobeHandle } from "@/components/globe/Globe";
import { Atlas } from "@/components/home/Atlas";
import { PageWipe } from "@/components/fx/PageWipe";
import { TypingTitle } from "@/components/hero/TypingTitle";
import { SearchBar } from "@/components/search/SearchBar";
import { LanguageToggle } from "@/components/site/LanguageToggle";
import { Button } from "@/components/ui/Button";
import { HOME_PAGES } from "@/lib/home-pages";
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
  const pagingRef = useRef(false);
  const goPageRef = useRef<(dir: 1 | -1) => void>(() => undefined);
  const { reduced, ready } = usePrefersReducedMotion();
  const [leaving, setLeaving] = useState(false);
  const [wipeDir, setWipeDir] = useState<1 | -1>(1);
  const [wiping, setWiping] = useState(false);
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
          search: {},
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

  goPageRef.current = (dir: 1 | -1) => {
    if (pagingRef.current) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const h = scroller.clientHeight || 1;
    const from = Math.round(scroller.scrollTop / h);
    const next = Math.max(0, Math.min(HOME_PAGES.length - 1, from + dir));
    if (next === from) return;
    pagingRef.current = true;
    setWipeDir(dir);
    if (!reduced) {
      setWiping(true);
      window.setTimeout(() => setWiping(false), 820);
    }
    document.getElementById(HOME_PAGES[next].id)?.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "start",
    });
    window.setTimeout(() => {
      pagingRef.current = false;
    }, reduced ? 80 : 920);
  };

  const scrollAtlas = () => goPageRef.current(1);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const nodes = [...scroller.querySelectorAll<HTMLElement>(".home-page")];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.45)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible?.target.id) return;
        nodes.forEach((node) => node.classList.toggle("is-active", node.id === visible.target.id));
      },
      { root: scroller, threshold: [0.45, 0.7] },
    );
    nodes.forEach((node) => observer.observe(node));
    document.getElementById("hero")?.classList.add("is-active");
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey) return;
      if (Math.abs(event.deltaY) < 10) return;
      event.preventDefault();
      goPageRef.current(event.deltaY > 0 ? 1 : -1);
    };
    scroller.addEventListener("wheel", onWheel, { passive: false });
    return () => scroller.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div ref={scrollerRef} className="home-snap bg-void text-fg">
      <PageWipe dir={wipeDir} on={wiping} />
      <a
        href="#search"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-30 focus:rounded-md focus:bg-void-elevated focus:px-3 focus:py-2"
      >
        {t(locale).skip}
      </a>

      <section id="hero" className="home-page is-active relative overflow-hidden">
        <div
          className={`flex h-full flex-col transition-[opacity,filter,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            leaving ? "translate-y-2 opacity-0 blur-sm" : "opacity-100"
          }`}
        >
          <header className="relative z-20 flex items-center justify-between gap-3 px-6 py-4 md:px-12 lg:px-16">
            <p className="text-xl font-medium tracking-tight text-fg">{SITE.name}</p>
            <LanguageToggle />
          </header>

          <div className="flex min-h-0 flex-1 flex-col md:flex-row md:pl-4 lg:pl-8">
            <div className="relative z-10 flex shrink-0 flex-col justify-center px-6 py-8 md:w-[min(34%,28rem)] md:pr-4 md:pl-12 lg:w-[28rem] lg:pr-6 lg:pl-16">
              <TypingTitle reducedMotion={reduced} ready={ready} align="left" />
              <div id="search" className="pointer-events-auto mt-7 w-full">
                <SearchBar
                  cities={cities}
                  countries={countries}
                  onSelect={openCity}
                  className="mx-0 w-full max-w-lg"
                />
              </div>
              <nav aria-label="Published guides" className="pointer-events-auto mt-8 flex flex-wrap gap-2">
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

            <div className="globe-stage relative min-h-[46vh] min-w-0 flex-1 cursor-pointer overflow-hidden">
              <Globe
                reducedMotion={reduced}
                cities={cities}
                countries={countries}
                onCitySelect={openCity}
                globeRef={globeRef}
                heroBand={false}
              />
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
