import { useEffect, useImperativeHandle, useRef, useState, type Ref } from "react";
import type { City, Country } from "@/types/catalog";
import type { GlobeLabel } from "@/lib/globe/engine";
import { GlobeLabels } from "./GlobeLabels";
import { GlobeFallback } from "./GlobeFallback";

/** Bump with the engine so HMR remounts WebGL. */
const GLOBE_ENGINE_REV = 16;

export type GlobeHandle = {
  flyToCity: (city: City) => Promise<void>;
};

type GlobeProps = {
  reducedMotion: boolean;
  cities: City[];
  countries: Country[];
  onCitySelect: (city: City) => void;
  globeRef?: Ref<GlobeHandle | null>;
};

export function Globe({ reducedMotion, cities, countries, onCitySelect, globeRef }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<{
    flyToCity: (city: City) => Promise<void>;
    dispose: () => void;
    setReducedMotion: (value: boolean) => void;
  } | null>(null);
  const [labels, setLabels] = useState<GlobeLabel[]>([]);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const selectRef = useRef(onCitySelect);
  selectRef.current = onCitySelect;

  useImperativeHandle(globeRef, () => ({
    flyToCity: async (city: City) => {
      await engineRef.current?.flyToCity(city);
    },
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !cities.length) return;
    let cancelled = false;
    setReady(false);

    void (async () => {
      const { GlobeEngine, webglAvailable } = await import("@/lib/globe/engine");
      if (cancelled) return;
      if (!webglAvailable()) {
        setFailed(true);
        return;
      }
      const engine = new GlobeEngine({
        canvas,
        reducedMotion,
        cities,
        countries,
        onLabels: (next) => {
          if (!cancelled) setLabels(next);
        },
        onCityClick: (city) => selectRef.current(city),
        onReady: () => {
          if (!cancelled) setReady(true);
        },
      });
      engineRef.current = engine;
    })().catch(() => {
      if (!cancelled) setFailed(true);
    });

    return () => {
      cancelled = true;
      engineRef.current?.dispose();
      engineRef.current = null;
    };
    // GLOBE_ENGINE_REV forces a remount when the WebGL engine itself changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cities, countries, GLOBE_ENGINE_REV]);

  useEffect(() => {
    engineRef.current?.setReducedMotion(reducedMotion);
  }, [reducedMotion]);

  if (failed) {
    return <GlobeFallback cities={cities.filter((c) => c.contentStatus === "published")} onCitySelect={onCitySelect} />;
  }

  return (
    <div className="absolute inset-0">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 size-full touch-none"
        aria-hidden="true"
      />
      <GlobeLabels labels={labels} onSelect={onCitySelect} />
      {!ready ? (
        <div className="pointer-events-none absolute inset-0 bg-void" />
      ) : null}
    </div>
  );
}
