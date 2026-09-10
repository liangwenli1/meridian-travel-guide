import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CityGuideView } from "@/components/city/CityGuideView";
import { ComingSoon } from "@/components/city/ComingSoon";
import { t, useI18n } from "@/lib/i18n";
import { getCityPage } from "@/lib/server/catalog";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/$country/$city")({
  loader: async ({ params }) => {
    const data = await getCityPage({ data: { country: params.country, city: params.city } });
    if (!data.city) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    const city = loaderData?.city;
    const guide = loaderData?.guide;
    if (!city) return { meta: [{ title: "Guide not found · Meridian" }] };
    return {
      meta: [
        {
          title: guide?.seoTitle ?? `${city.name} Travel Guide · ${SITE.name}`,
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
  if (!city) return <CityMissing />;
  if (guide) return <CityGuideView city={city} guide={guide} />;
  return <ComingSoon city={city} />;
}

function CityMissing() {
  const locale = useI18n((s) => s.locale);
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-void px-6 text-center text-fg">
      <p className="text-4xl font-medium tracking-tight">We do not have that city yet.</p>
      <Link to="/" className="mt-4 text-sm text-muted underline-offset-4 hover:text-fg hover:underline">
        {t(locale).globe}
      </Link>
    </main>
  );
}
