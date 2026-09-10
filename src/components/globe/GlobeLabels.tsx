import { useState } from "react";
import type { GlobeLabel } from "@/lib/globe/engine";
import { t, useI18n } from "@/lib/i18n";
import type { City } from "@/types/catalog";

type GlobeLabelsProps = {
  labels: GlobeLabel[];
  onSelect: (city: City) => void;
};

export function GlobeLabels({ labels, onSelect }: GlobeLabelsProps) {
  const locale = useI18n((s) => s.locale);
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
            <span className="flex items-center gap-2 rounded-md bg-void/80 px-2 py-1">
              <span
                className={
                  label.kind === "city"
                    ? "size-1.5 rounded-full bg-fg"
                    : "size-1 rounded-full bg-muted"
                }
              />
              <span
                className={
                  label.kind === "country"
                    ? "kicker text-muted"
                    : "font-sans text-xs text-fg"
                }
              >
                {label.name}
              </span>
            </span>
            {isCity && hovered ? (
              <span className="mt-1 ml-1 block rounded-md bg-void/80 px-2 py-1 text-xs text-muted">
                {label.subtitle}
                <span className="ml-2 tracking-widest text-accent uppercase">{t(locale).explore}</span>
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
