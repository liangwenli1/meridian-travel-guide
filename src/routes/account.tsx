import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DeskCard, DeskFrame } from "@/components/desk/DeskFrame";
import { Button } from "@/components/ui/Button";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { t, useI18n } from "@/lib/i18n";
import { getTravelerDesk, type TravelerDesk } from "@/lib/server/desk";
import { listPublishedCities } from "@/lib/server/catalog";
import { SITE } from "@/lib/site";
import type { City } from "@/types/catalog";

export const Route = createFileRoute("/account")({
  component: AccountPage,
  head: () => ({
    meta: [{ title: `My desk · ${SITE.name}` }],
  }),
});

function AccountPage() {
  const locale = useI18n((s) => s.locale);
  const strings = t(locale);
  const { user, isPending } = useCurrentUserState();
  const [desk, setDesk] = useState<TravelerDesk | null>(null);
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    if (isPending || !user) return;
    void getTravelerDesk()
      .then(setDesk)
      .catch(() => setDesk({ membership: null, orders: [] }));
    void listPublishedCities()
      .then(setCities)
      .catch(() => setCities([]));
  }, [isPending, user]);

  if (isPending) {
    return (
      <main className="min-h-dvh bg-void text-fg">
        <div className="mx-auto max-w-xl px-6 py-24">
          <div className="h-10 w-40 animate-pulse rounded-3xl bg-void-elevated" />
        </div>
      </main>
    );
  }

  if (!user) return <RedirectToSignIn />;

  const membership = desk?.membership;
  const active = membership?.status === "active";
  const orders = desk?.orders ?? [];

  return (
    <DeskFrame
      tone="traveler"
      kicker={strings.myDeskKicker}
      title={user.displayName ?? strings.myDeskTitle}
      dek={user.primaryEmail ?? strings.myDeskDek}
      nav={[
        { to: "/account", label: strings.myDeskTitle, current: true },
        { to: "/pass", label: strings.passTitle },
        { to: "/", label: strings.globe },
        { to: "/feedback", label: strings.feedbackTitle },
      ]}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <DeskCard
          meta={strings.passKicker}
          title={strings.passTitle}
          action={
            active ? (
              <Button asChild variant="outline">
                <Link to="/">{strings.globe}</Link>
              </Button>
            ) : (
              <Button asChild>
                <Link to="/pass">{strings.passStart}</Link>
              </Button>
            )
          }
        >
          <p>{active ? strings.passActive : strings.passInactive}</p>
          {active && membership?.expiresAt ? (
            <p className="mt-1">
              {strings.passUntil} {String(membership.expiresAt).slice(0, 10)}
            </p>
          ) : null}
        </DeskCard>
        <DeskCard meta={strings.account} title={user.primaryEmail ?? strings.email}>
          <p>{strings.myDeskSignedIn}</p>
        </DeskCard>
      </div>

      <div className="mt-8">
        <p className="kicker text-muted">{strings.guidesKicker}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {cities.map((city) => (
            <li key={city.id}>
              <Link
                to="/$country/$city"
                params={{ country: city.countrySlug, city: city.slug }}
                search={{ s: "overview" }}
                className="inline-flex rounded-full bg-card px-4 py-2 text-sm text-fg shadow-border hover:shadow-border-hover"
              >
                {city.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10">
        <p className="kicker text-muted">{strings.myOrders}</p>
        {orders.length === 0 ? (
          <p className="mt-3 text-sm text-muted">{strings.payNoOrders}</p>
        ) : (
          <ul className="mt-4 divide-y divide-line overflow-hidden rounded-3xl bg-card shadow-border">
            {orders.map((order) => (
              <li key={order.id} className="flex items-center justify-between gap-3 px-5 py-4 text-sm">
                <div className="min-w-0">
                  <p className="truncate text-fg">{order.product}</p>
                  <p className="mt-1 font-mono text-xs text-muted">
                    {order.method} · {order.status}
                  </p>
                </div>
                {order.status === "PENDING" ? (
                  <Link
                    to="/pay/$orderId"
                    params={{ orderId: order.id }}
                    className="shrink-0 text-accent hover:underline"
                  >
                    {strings.payOpen}
                  </Link>
                ) : (
                  <span className="shrink-0 font-mono text-muted">
                    {order.amount} {order.currency}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </DeskFrame>
  );
}
