import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LanguageToggle } from "@/components/site/LanguageToggle";
import { t, useI18n } from "@/lib/i18n";
import { confirmSignup } from "@/lib/server/email-verify";
import { SITE } from "@/lib/site";

type Search = { token?: string };

export const Route = createFileRoute("/verify-email")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    token: typeof search.token === "string" ? search.token : "",
  }),
  component: VerifyEmail,
  head: () => ({
    meta: [{ title: `Confirm email · ${SITE.name}` }],
  }),
});

function VerifyEmail() {
  const locale = useI18n((s) => s.locale);
  const strings = t(locale);
  const navigate = useNavigate();
  const { token } = Route.useSearch();
  const [status, setStatus] = useState<"working" | "ok" | "bad">("working");

  useEffect(() => {
    let cancelled = false;
    if (!token) {
      setStatus("bad");
      return;
    }
    void confirmSignup({ data: { token } })
      .then((result) => {
        if (cancelled) return;
        if (result.ok) {
          setStatus("ok");
          window.setTimeout(() => {
            void navigate({ to: "/login", search: { registered: true } });
          }, 900);
        } else {
          setStatus("bad");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("bad");
      });
    return () => {
      cancelled = true;
    };
  }, [navigate, token]);

  return (
    <main className="relative min-h-dvh bg-void text-fg">
      <header className="relative z-10 flex items-center justify-between px-6 py-5 md:px-12">
        <Link to="/" className="text-xl font-medium tracking-tight">
          {SITE.name}
        </Link>
        <LanguageToggle />
      </header>
      <div className="mx-auto flex min-h-[calc(100dvh-4.5rem)] max-w-md flex-col justify-center px-6 pb-16">
        <p className="kicker text-accent">{strings.authKicker}</p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight">
          {status === "working"
            ? strings.verifyWorking
            : status === "ok"
              ? strings.verifyOk
              : strings.verifyBad}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {status === "working"
            ? strings.verifyWorkingDek
            : status === "ok"
              ? strings.verifyOkDek
              : strings.verifyBadDek}
        </p>
        {status === "bad" ? (
          <Link to="/login" className="mt-8 text-sm text-accent underline-offset-4 hover:underline">
            {strings.signIn}
          </Link>
        ) : null}
      </div>
    </main>
  );
}
