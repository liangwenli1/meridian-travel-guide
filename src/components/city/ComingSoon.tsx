import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { publishedCities } from "@/data/cities";
import { SITE } from "@/lib/site";
import type { City } from "@/types/catalog";

export function ComingSoon({ city }: { city: City }) {
  return (
    <main className="min-h-dvh bg-paper text-ink">
      <header className="flex items-center justify-between px-4 py-5 md:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-ink-soft">
          <ArrowLeft className="size-4" />
          Globe
        </Link>
        <Link to="/" className="font-display text-lg italic">
          {SITE.name}
        </Link>
      </header>
      <div className="mx-auto max-w-2xl px-4 py-16 md:px-8">
        <p className="text-[11px] tracking-[0.2em] text-muted-paper uppercase">
          {city.country} · Coming soon
        </p>
        <h1 className="mt-3 font-display text-5xl italic md:text-6xl">{city.name}</h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-soft">{city.shortDescription}</p>
        <dl className="mt-8 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-muted-paper">Coordinates</dt>
            <dd className="tabular-nums">
              {city.latitude.toFixed(2)}, {city.longitude.toFixed(2)}
            </dd>
          </div>
          <div>
            <dt className="text-muted-paper">Timezone</dt>
            <dd>{city.timezone}</dd>
          </div>
          <div>
            <dt className="text-muted-paper">Currency</dt>
            <dd>
              {city.currency} ({city.currencyCode})
            </dd>
          </div>
          <div>
            <dt className="text-muted-paper">Airports</dt>
            <dd>{city.airportCodes.join(", ") || "—"}</dd>
          </div>
        </dl>
        <p className="mt-10 text-sm text-ink-soft">
          This city is on the globe. The full editorial guide is still being written. Meanwhile, these
          guides are ready:
        </p>
        <ul className="mt-4 flex flex-wrap gap-3">
          {publishedCities.map((item) => (
            <li key={item.id}>
              <Link
                to="/$country/$city"
                params={{ country: item.countrySlug, city: item.slug }}
                className="inline-flex rounded-full px-3 py-2 text-sm shadow-[var(--shadow-paper)]"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
