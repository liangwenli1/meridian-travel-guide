import { useEffect, useImperativeHandle, useRef, useState, type Ref } from "react";
import type { City } from "@/types/catalog";
import type { GlobeLabel } from "@/lib/globe/engine";
import { GlobeLabels } from "./GlobeLabels";
import { GlobeFallback } from "./GlobeFallback";

export type GlobeHandle = {
  flyToCity: (city: City) => Promise<void>;
};

type GlobeProps = {
  reducedMotion: boolean;
  onCitySelect: (city: City) => void;
  globeRef?: Ref<GlobeHandle | null>;
};

export function Globe({ reducedMotion, onCitySelect, globeRef }: GlobeProps) {
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
    if (!canvas) return;
    let cancelled = false;

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
        onLabels: (next) => {
          if (!cancelled) setLabels(next);
        },
        onCityClick: (city) => selectRef.current(city),
      });
      engineRef.current = engine;
      setReady(true);
    })().catch(() => {
      if (!cancelled) setFailed(true);
    });

    return () => {
      cancelled = true;
      engineRef.current?.dispose();
      engineRef.current = null;
    };
    // Create the WebGL context once. Reduced-motion is applied via the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    engineRef.current?.setReducedMotion(reducedMotion);
  }, [reducedMotion]);

  if (failed) {
    return <GlobeFallback onCitySelect={onCitySelect} />;
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
