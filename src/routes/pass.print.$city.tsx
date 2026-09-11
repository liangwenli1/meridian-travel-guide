import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { getGuide } from "@/data/guides";
import { itineraryMarkdown, pickItinerary } from "@/lib/itinerary-doc";
import { isActivePass } from "@/lib/pass/access";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { t, useI18n } from "@/lib/i18n";
import { getMembership } from "@/lib/server/membership";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/pass/print/$city")({
  loader: ({ params }) => {
    const guide = getGuide(params.city);
    if (!guide) throw notFound();
    return { guide };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `Print itinerary · ${loaderData?.guide.title ?? SITE.name}` }],
  }),
  component: PrintItineraryPage,
});

function PrintItineraryPage() {
  const { guide } = Route.useLoaderData();
  const locale = useI18n((s) => s.locale);
  const strings = t(locale);
  const { user, isPending } = useCurrentUserState();
  const [allowed, setAllowed] = useState(false);
  const plan = pickItinerary(guide, 3);
  const markdown = itineraryMarkdown(guide, 3);

  useEffect(() => {
    if (isPending || !user) {
      setAllowed(false);
      return;
    }
    void getMembership()
      .then((m) => setAllowed(isActivePass(m)))
      .catch(() => setAllowed(false));
  }, [isPending, user]);

  if (isPending) {
    return <main className="min-h-dvh bg-void text-fg" />;
  }
  if (!user) return <RedirectToSignIn />;
  if (!allowed) {
    return (
      <main className="min-h-dvh bg-void px-6 py-24 text-fg">
        <p className="text-sm text-muted">{strings.passTeaserShort}</p>
        <Link to="/pass" className="mt-4 inline-block text-accent hover:underline">
          {strings.passTitle}
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-white text-neutral-900">
      <div className="print:hidden mx-auto flex max-w-2xl items-center justify-between gap-4 px-6 py-6">
        <Link to="/account" className="text-sm text-neutral-500 hover:text-neutral-900">
          ← {strings.account}
        </Link>
        <Button type="button" onClick={() => window.print()}>
          {strings.passPrintPdf}
        </Button>
      </div>
      <article className="mx-auto max-w-2xl px-6 py-8 print:py-0">
        <p className="text-xs tracking-[0.2em] text-neutral-500 uppercase">{SITE.name} · Field Pass</p>
        <h1 className="mt-3 text-3xl font-medium tracking-tight">{plan?.title ?? guide.title}</h1>
        <p className="mt-2 text-sm text-neutral-600">{plan?.summary}</p>
        <pre className="mt-8 whitespace-pre-wrap font-sans text-sm leading-relaxed text-neutral-800">{markdown}</pre>
      </article>
    </main>
  );
}
