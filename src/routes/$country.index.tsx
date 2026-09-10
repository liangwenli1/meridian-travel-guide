import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { citiesInCountry } from "@/data/cities";
import { countries } from "@/data/countries";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/$country/")({
  loader: ({ params }) => {
    const country = countries.find((item) => item.slug === params.country);
    const list = citiesInCountry(params.country);
    if (!country && list.length === 0) throw notFound();
    return {
      countryName: country?.name ?? list[0]?.country ?? params.country,
      list,
    };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.countryName ?? "Country"} city guides · ${SITE.name}`,
      },
    ],
  }),
  component: CountryPage,
});

function CountryPage() {
  const { countryName, list } = Route.useLoaderData();
  return (
    <main className="min-h-dvh bg-paper text-ink">
      <header className="flex items-center justify-between px-4 py-5 md:px-8">
        <Link to="/" className="text-sm text-ink-soft">
          Globe
        </Link>
        <Link to="/" className="font-display text-lg italic">
          {SITE.name}
        </Link>
      </header>
      <div className="mx-auto max-w-3xl px-4 py-12 md:px-8">
        <p className="text-[11px] tracking-[0.2em] text-muted-paper uppercase">Country</p>
        <h1 className="mt-2 font-display text-5xl italic">{countryName}</h1>
        <ul className="mt-10 divide-y divide-line-paper">
          {list.map((city) => (
            <li key={city.id}>
              <Link
                to="/$country/$city"
                params={{ country: city.countrySlug, city: city.slug }}
                className="flex items-baseline justify-between gap-4 py-4"
              >
                <span>
                  <span className="block font-display text-2xl italic">{city.name}</span>
                  <span className="block text-sm text-ink-soft">{city.shortDescription}</span>
                </span>
                <span className="text-xs tracking-[0.14em] text-muted-paper uppercase">
                  {city.contentStatus === "published" ? "Guide" : "Soon"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
