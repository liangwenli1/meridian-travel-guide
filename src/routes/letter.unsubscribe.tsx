import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { t, useI18n } from "@/lib/i18n";
import { unsubscribeLetter } from "@/lib/server/letter";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/letter/unsubscribe")({
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === "string" ? search.token : "",
  }),
  component: UnsubscribePage,
  head: () => ({
    meta: [{ title: `Letter · ${SITE.name}` }],
  }),
});

function UnsubscribePage() {
  const { token } = Route.useSearch();
  const locale = useI18n((s) => s.locale);
  const strings = t(locale);
  const [state, setState] = useState<"work" | "ok" | "bad">("work");

  useEffect(() => {
    if (!token) {
      setState("bad");
      return;
    }
    void unsubscribeLetter({ data: { token } })
      .then((result) => setState(result.ok ? "ok" : "bad"))
      .catch(() => setState("bad"));
  }, [token]);

  return (
    <main className="min-h-dvh bg-void text-fg">
      <SiteHeader />
      <div className="mx-auto max-w-md px-6 py-24">
        <p className="kicker text-accent">{strings.dispatchKicker}</p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight">
          {state === "work" ? strings.working : state === "ok" ? strings.letterUnsubOk : strings.letterUnsubBad}
        </h1>
      </div>
    </main>
  );
}
