import { publishedCities } from "@/data/cities";
import type { City } from "@/types/catalog";

export function GlobeFallback({ onCitySelect }: { onCitySelect: (city: City) => void }) {
  return (
    <div className="absolute inset-0 flex items-end justify-center bg-[radial-gradient(circle_at_50%_40%,#161922,var(--color-void)_62%)] pb-[18vh]">
      <div className="max-w-lg px-6 text-center">
        <p className="text-sm text-muted">
          The live globe needs WebGL. Search above, or open a finished guide.
        </p>
        <ul className="mt-4 flex flex-wrap justify-center gap-2">
          {publishedCities.map((city) => (
            <li key={city.id}>
              <button
                type="button"
                className="rounded-full px-3 py-2 text-sm text-warm shadow-[var(--shadow-border)] transition-colors hover:bg-warm/8"
                onClick={() => onCitySelect(city)}
              >
                {city.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
