import { createFileRoute, notFound } from "@tanstack/react-router";
import { CityGuideView } from "@/components/city/CityGuideView";
import { ComingSoon } from "@/components/city/ComingSoon";
import { findCity } from "@/data/cities";
import { getGuide } from "@/data/guides";

export const Route = createFileRoute("/$country/$city")({
  loader: ({ params }) => {
    const city = findCity(params.country, params.city);
    if (!city) throw notFound();
    const guide = getGuide(city.slug);
    return { city, guide };
  },
  head: ({ loaderData }) => {
    const city = loaderData?.city;
    const guide = loaderData?.guide;
    if (!city) return { meta: [{ title: "Guide not found · Meridian" }] };
    return {
      meta: [
        {
          title: guide?.seoTitle ?? `${city.name} Travel Guide · Meridian`,
        },
        {
          name: "description",
          content:
            guide?.seoDescription ??
            `${city.shortDescription} A Meridian city guide for ${city.name}, ${city.country}.`,
        },
      ],
    };
  },
  component: CityRoute,
  notFoundComponent: CityMissing,
});

function CityRoute() {
  const { city, guide } = Route.useLoaderData();
  if (guide) return <CityGuideView city={city} guide={guide} />;
  return <ComingSoon city={city} />;
}

function CityMissing() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-paper px-6 text-center text-ink">
      <p className="font-display text-4xl italic">We do not have that city yet.</p>
      <a href="/" className="mt-4 text-sm text-ink-soft underline-offset-4 hover:underline">
        Back to the globe
      </a>
    </main>
  );
}
