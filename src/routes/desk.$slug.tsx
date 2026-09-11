import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PassGate } from "@/components/pass/PassGate";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Badge } from "@/components/ui/Badge";
import { getDispatch } from "@/data/dispatches";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { t, useI18n } from "@/lib/i18n";
import { isActivePass } from "@/lib/pass/access";
import { getMembership } from "@/lib/server/membership";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/desk/$slug")({
  loader: ({ params }) => {
    const dispatch = getDispatch(params.slug);
    if (!dispatch) throw notFound();
    return { dispatch };
  },
  head: ({ loaderData }) => {
    const dispatch = loaderData?.dispatch;
    if (!dispatch) return { meta: [{ title: `Not found · ${SITE.name}` }] };
    return {
      meta: [
        { title: `${dispatch.title.en} · Desk · ${SITE.name}` },
        { name: "description", content: dispatch.dek.en },
      ],
    };
  },
  component: DeskArticlePage,
  notFoundComponent: DeskMissing,
});

function DeskArticlePage() {
  const { dispatch } = Route.useLoaderData();
  const locale = useI18n((s) => s.locale);
  const strings = t(locale);
  const { user, isPending: authPending } = useCurrentUserState();
  const [passActive, setPassActive] = useState(false);

  useEffect(() => {
    if (authPending || !user) {
      setPassActive(false);
      return;
    }
    void getMembership()
      .then((m) => setPassActive(isActivePass(m)))
      .catch(() => setPassActive(false));
  }, [authPending, user]);

  const canReadFull = dispatch.tier === "letter-free" || passActive;
  const paragraphs = dispatch.body[locale].split(/\n\n+/).filter(Boolean);

  return (
    <main className="min-h-dvh bg-void text-fg">
      <SiteHeader />
      <article className="mx-auto max-w-2xl px-6 py-16 md:py-24">
        <Link to="/desk" className="kicker text-muted transition-colors hover:text-fg">
          ← {strings.deskTitle}
        </Link>
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <p className="kicker text-accent">{dispatch.kicker[locale]}</p>
          <Badge variant={dispatch.tier === "pass-briefing" ? "accent" : "muted"}>
            {dispatch.tier === "pass-briefing" ? strings.deskPassOnly : strings.deskLetterFree}
          </Badge>
          <p className="kicker text-muted">{dispatch.date}</p>
        </div>
        <h1 className="mt-4 text-4xl font-medium tracking-tight md:text-5xl">{dispatch.title[locale]}</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">{dispatch.dek[locale]}</p>

        {canReadFull ? (
          <div className="mt-10 space-y-5 text-base leading-relaxed text-fg/90">
            {paragraphs.map((para: string) => (
              <p key={para.slice(0, 48)}>{para}</p>
            ))}
          </div>
        ) : (
          <div className="mt-10">
            <PassGate
              active={false}
              teaserTitle={strings.deskPassTeaserTitle}
              teaserBody={strings.deskPassTeaserBody}
            >
              {null}
            </PassGate>
          </div>
        )}
      </article>
    </main>
  );
}

function DeskMissing() {
  const locale = useI18n((s) => s.locale);
  const strings = t(locale);
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-void px-6 text-center text-fg">
      <p className="text-4xl font-medium tracking-tight">{strings.deskNotFound}</p>
      <Link to="/desk" className="mt-4 text-sm text-muted underline-offset-4 hover:text-fg hover:underline">
        {strings.deskTitle}
      </Link>
    </main>
  );
}
