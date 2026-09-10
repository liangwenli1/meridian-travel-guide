import { useState } from "react";
import type { GlobeLabel } from "@/lib/globe/engine";
import type { City } from "@/types/catalog";

type GlobeLabelsProps = {
  labels: GlobeLabel[];
  onSelect: (city: City) => void;
};

export function GlobeLabels({ labels, onSelect }: GlobeLabelsProps) {
  const [hoverId, setHoverId] = useState<string | null>(null);

  return (
    <div className="pointer-events-none absolute inset-0">
      {labels.map((label) => {
        const hovered = hoverId === label.id;
        const isCity = label.kind === "city" && label.city;
        return (
          <button
            key={label.id}
            type="button"
            className="pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 text-left"
            style={{ left: label.x, top: label.y }}
            onMouseEnter={() => setHoverId(label.id)}
            onMouseLeave={() => setHoverId((id) => (id === label.id ? null : id))}
            onFocus={() => setHoverId(label.id)}
            onBlur={() => setHoverId((id) => (id === label.id ? null : id))}
            onClick={() => {
              if (label.city) onSelect(label.city);
            }}
            disabled={!isCity}
          >
            <span className="flex items-center gap-2 rounded-md bg-void/75 px-2 py-1 backdrop-blur-sm">
              <span
                className={
                  label.kind === "city"
                    ? "size-1.5 rounded-full bg-accent shadow-[0_0_10px_rgba(110,224,210,0.7)]"
                    : "size-1 rounded-full bg-accent/50"
                }
              />
              <span
                className={
                  label.kind === "country"
                    ? "font-sans text-[11px] tracking-[0.16em] text-accent uppercase"
                    : "font-sans text-[12px] text-fg"
                }
              >
                {label.name}
              </span>
            </span>
            {isCity && hovered ? (
              <span className="mt-1 ml-1 block rounded-md bg-void/80 px-2 py-1 text-[11px] text-muted">
                {label.subtitle}
                <span className="ml-2 tracking-[0.16em] text-accent uppercase">Explore</span>
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
