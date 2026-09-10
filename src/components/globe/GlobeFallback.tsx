import type { City } from "@/types/catalog";
import { t, useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";

export function GlobeFallback({
  cities,
  onCitySelect,
}: {
  cities: City[];
  onCitySelect: (city: City) => void;
}) {
  const locale = useI18n((s) => s.locale);
  return (
    <div className="absolute inset-0 flex items-end justify-center bg-void pb-[18vh]">
      <div className="max-w-lg px-6 text-center">
        <p className="text-sm text-muted">{t(locale).webgl}</p>
        <ul className="mt-4 flex flex-wrap justify-center gap-2">
          {cities.map((city) => (
            <li key={city.id}>
              <Button type="button" variant="outline" size="sm" onClick={() => onCitySelect(city)}>
                {city.name}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
