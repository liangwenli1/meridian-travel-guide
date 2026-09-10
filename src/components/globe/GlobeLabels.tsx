import { useState } from "react";
import type { GlobeLabel } from "@/lib/globe/engine";
import { t, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
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
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5",
                "bg-black/70 text-[11px] leading-none text-fg/90 backdrop-blur-sm",
                isCity && "text-fg",
              )}
            >
              {isCity ? <span className="size-1 shrink-0 rounded-full bg-fg" /> : null}
              <span className="whitespace-nowrap">{label.name}</span>
            </span>
            {isCity && hovered ? (
              <span className="mt-1 ml-1 block rounded-md bg-black/75 px-1.5 py-0.5 text-[11px] text-muted">
                {label.subtitle}
                <span className="ml-1.5 tracking-wide text-accent uppercase">{t(locale).explore}</span>
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
