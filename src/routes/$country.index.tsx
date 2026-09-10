import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AmbientParticles } from "@/components/fx/AmbientParticles";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Grid } from "@/components/ui/Grid";
import { t, useI18n } from "@/lib/i18n";
import { getCountryPage } from "@/lib/server/catalog";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/$country/")({
  loader: async ({ params }) => {
    const data = await getCountryPage({ data: { country: params.country } });
    if (!data.country && data.list.length === 0) throw notFound();
    return data;
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
  const locale = useI18n((s) => s.locale);
  return (
    <main className="page-enter relative min-h-dvh bg-void text-fg">
      <AmbientParticles />
      <div className="relative z-10">
        <header className="flex items-center justify-between px-4 py-5 md:px-8">
          <Link to="/" className="text-sm text-muted hover:text-fg">
            {t(locale).globe}
          </Link>
          <Link to="/" className="text-lg font-medium tracking-tight">
            {SITE.name}
          </Link>
        </header>
        <div className="mx-auto max-w-3xl px-4 py-12 md:px-8">
          <p className="kicker text-accent">{t(locale).country}</p>
          <h1 className="mt-2 text-5xl font-medium tracking-tight">{countryName}</h1>
          <Grid min="lg" className="mt-10">
            {list.map((city) => (
              <Card key={city.id} asChild interactive>
                <Link to="/$country/$city" params={{ country: city.countrySlug, city: city.slug }} search={{}}>
                  <div className="flex items-start justify-between gap-4">
                    <span>
                      <span className="block text-2xl font-medium tracking-tight">{city.name}</span>
                      <span className="mt-1 block text-sm text-muted">{city.shortDescription}</span>
                    </span>
                    <Badge variant={city.contentStatus === "published" ? "accent" : "muted"}>
                      {city.contentStatus === "published" ? t(locale).guide : t(locale).soon}
                    </Badge>
                  </div>
                </Link>
              </Card>
            ))}
          </Grid>
        </div>
        <SiteFooter />
      </div>
    </main>
  );
}
