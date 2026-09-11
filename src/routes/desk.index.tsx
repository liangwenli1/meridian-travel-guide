import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Badge } from "@/components/ui/Badge";
import { listLiveDispatches } from "@/lib/server/editorial";
import { t, useI18n } from "@/lib/i18n";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/desk/")({
  loader: () => listLiveDispatches(),
  component: DeskIndexPage,
  head: () => ({
    meta: [{ title: `Desk · ${SITE.name}` }],
  }),
});

function DeskIndexPage() {
  const locale = useI18n((s) => s.locale);
  const strings = t(locale);
  const items = Route.useLoaderData();

  return (
    <main className="min-h-dvh bg-void text-fg">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <p className="kicker text-accent">{strings.deskKicker}</p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight md:text-5xl">{strings.deskTitle}</h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">{strings.deskDek}</p>

        {items.length === 0 ? (
          <p className="mt-12 text-sm text-muted">{strings.deskEmpty}</p>
        ) : (
          <ol className="mt-12 divide-y divide-line border-y border-line">
            {items.map((item) => (
              <li key={item.slug}>
                <Link
                  to="/desk/$slug"
                  params={{ slug: item.slug }}
                  className="group grid gap-3 py-6 transition-colors md:grid-cols-[8rem_1fr_auto] md:items-baseline md:gap-8"
                >
                  <p className="kicker text-muted">{item.date}</p>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="kicker text-accent">{item.kicker[locale]}</p>
                      <Badge variant={item.tier === "pass-briefing" ? "accent" : "muted"}>
                        {item.tier === "pass-briefing" ? strings.deskPassOnly : strings.deskLetterFree}
                      </Badge>
                    </div>
                    <h2 className="mt-2 text-2xl font-medium tracking-tight text-fg group-hover:text-accent md:text-3xl">
                      {item.title[locale]}
                    </h2>
                    <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">{item.dek[locale]}</p>
                  </div>
                  <span className="hidden text-sm text-muted md:inline">{strings.deskReadMore}</span>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </div>
    </main>
  );
}
