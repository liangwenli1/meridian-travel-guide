import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Button } from "@/components/ui/Button";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { t, useI18n } from "@/lib/i18n";
import { getMembership, type Membership } from "@/lib/server/membership";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/account")({
  component: AccountPage,
  head: () => ({
    meta: [{ title: `Account · ${SITE.name}` }],
  }),
});

function AccountPage() {
  const locale = useI18n((s) => s.locale);
  const strings = t(locale);
  const { user, isPending } = useCurrentUserState();
  const [membership, setMembership] = useState<Membership | null>(null);

  useEffect(() => {
    if (isPending || !user) return;
    void getMembership()
      .then(setMembership)
      .catch(() => setMembership(null));
  }, [isPending, user]);

  if (isPending) {
    return (
      <main className="min-h-dvh bg-void text-fg">
        <SiteHeader />
        <div className="mx-auto max-w-xl px-6 py-24">
          <div className="h-10 w-40 animate-pulse rounded bg-void-elevated" />
        </div>
      </main>
    );
  }

  if (!user) return <RedirectToSignIn />;

  const active = membership?.status === "active";

  return (
    <main className="min-h-dvh bg-void text-fg">
      <SiteHeader />
      <div className="mx-auto max-w-xl px-6 py-16 md:py-24">
        <p className="kicker text-accent">{strings.account}</p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight">
          {user.displayName ?? user.primaryEmail ?? strings.account}
        </h1>
        {user.primaryEmail ? <p className="mt-2 text-sm text-muted">{user.primaryEmail}</p> : null}

        <div className="mt-10 rounded-2xl bg-void-elevated p-6 shadow-border">
          <p className="text-sm font-medium text-fg">{strings.passTitle}</p>
          <p className="mt-2 text-sm text-muted">
            {active ? strings.passActive : strings.passInactive}
          </p>
          {active && membership?.expiresAt ? (
            <p className="mt-1 text-sm text-muted">
              {strings.passUntil} {String(membership.expiresAt).slice(0, 10)}
            </p>
          ) : null}
          <div className="mt-5">
            {active ? (
              <Button asChild variant="outline">
                <Link to="/">{strings.globe}</Link>
              </Button>
            ) : (
              <Button asChild>
                <Link to="/pass">{strings.passStart}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
