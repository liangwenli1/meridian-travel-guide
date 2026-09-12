import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminWorkspace } from "@/routes/admin";
import { DeskCard, DeskFrame } from "@/components/desk/DeskFrame";
import { PassGate } from "@/components/pass/PassGate";
import { Button } from "@/components/ui/Button";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { t, useI18n, type Locale } from "@/lib/i18n";
import { getTravelerDesk, type TravelerDesk } from "@/lib/server/desk";
import { listPublishedCities } from "@/lib/server/catalog";
import { getAdminState } from "@/lib/server/ops";
import { normalizePlan } from "@/lib/pass/access";
import {
  downloadPassItinerary,
  getPassLocker,
  type PassLockerResult,
} from "@/lib/server/pass-locker";
import { SITE } from "@/lib/site";
import type { City } from "@/types/catalog";
import type { Localized, PassLockerItem } from "@/types/pass";

export const Route = createFileRoute("/account")({
  validateSearch: (search: Record<string, unknown>): { tab?: "tools" } =>
    search.tab === "tools" ? { tab: "tools" } : {},
  loader: async () => {
    try {
      const state = await getAdminState();
      return { isAdmin: state.isAdmin };
    } catch {
      return { isAdmin: false };
    }
  },
  component: AccountPage,
  head: () => ({
    meta: [{ title: `Account · ${SITE.name}` }],
  }),
});

function loc(value: Localized, locale: Locale) {
  return value[locale] || value.en;
}

function kindLabel(kind: PassLockerItem["kind"], strings: ReturnType<typeof t>) {
  switch (kind) {
    case "itinerary":
      return strings.passLockerItemItinerary;
    case "offseason-table":
      return strings.passLockerItemTable;
    case "neighborhood-preview":
      return strings.passLockerItemPreview;
    case "briefing":
      return strings.passLockerItemBriefing;
    case "arrival-card":
      return strings.passLockerItemArrival;
    case "trip-brief":
      return strings.passLockerItemTripBrief;
    default:
      return kind;
  }
}

function triggerMarkdownDownload(filename: string, markdown: string) {
  const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function AccountPage() {
  const locale = useI18n((s) => s.locale);
  const strings = t(locale);
  const { tab: initialTab } = Route.useSearch();
  const { isAdmin: loadedAdmin } = Route.useLoaderData();
  const { user, isPending } = useCurrentUserState();
  const [desk, setDesk] = useState<TravelerDesk | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [locker, setLocker] = useState<PassLockerResult | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(loadedAdmin);
  const [pane, setPane] = useState<"you" | "tools">(initialTab === "tools" ? "tools" : "you");

  useEffect(() => {
    if (isPending || !user) return;
    void getTravelerDesk()
      .then(setDesk)
      .catch(() => setDesk({ membership: null, orders: [] }));
    void listPublishedCities()
      .then(setCities)
      .catch(() => setCities([]));
    void getPassLocker()
      .then(setLocker)
      .catch(() => setLocker({ active: false, plan: "free", items: [] }));
    void getAdminState()
      .then((state) => setIsAdmin(state.isAdmin))
      .catch(() => setIsAdmin(false));
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
  const plan = locker?.plan ?? normalizePlan(membership?.plan);
  const active = plan === "pro" || plan === "max";
  const orders = desk?.orders ?? [];
  const items = locker?.items ?? [];
  const planLabel = plan === "max" ? strings.planMax : plan === "pro" ? strings.planPro : strings.planFree;

  const onDownload = async (citySlug: string) => {
    setDownloading(true);
    try {
      const file = await downloadPassItinerary({ data: { citySlug } });
      triggerMarkdownDownload(file.filename, file.markdown);
    } catch {
      toast.error(strings.passDownloadFailed);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <DeskFrame
      kicker={strings.account}
      title={user.displayName ?? strings.account}
      dek={user.primaryEmail ?? strings.myDeskDek}
      nav={[
        {
          label: strings.account,
          current: pane === "you",
          onClick: () => setPane("you"),
        },
        { to: "/pass", label: strings.passTitle },
        ...(isAdmin
          ? [
              {
                label: strings.accountTools,
                current: pane === "tools",
                onClick: () => setPane("tools"),
              },
            ]
          : []),
        { to: "/", label: strings.globe },
        { to: "/feedback", label: strings.feedbackTitle },
      ]}
    >
      {isAdmin ? (
        <div hidden={pane !== "tools"}>
          <AdminWorkspace embedded assumeAdmin />
        </div>
      ) : null}
      {pane === "you" ? (
        <>
      <div className="grid gap-4 md:grid-cols-2">
        <DeskCard
          meta={strings.passKicker}
          title={planLabel}
          action={
            <Button asChild variant={active ? "outline" : "default"}>
              <Link to="/pass">{active ? strings.planChange : strings.passStart}</Link>
            </Button>
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

      <div className="mt-10">
        <p className="kicker text-muted">{strings.passLocker}</p>
        <p className="mt-1 text-sm text-muted">{strings.passLockerDek}</p>
        <PassGate active={Boolean(active)} teaserTitle={strings.passTeaserShort} className="mt-4">
          {items.length === 0 ? (
            <p className="mt-3 text-sm text-muted">{strings.passLockerEmpty}</p>
          ) : (
            <ul className="mt-4 divide-y divide-line overflow-hidden rounded-3xl bg-card shadow-border">
              {items.map((item) => (
                <li key={`${item.kind}-${item.id}`} className="flex items-start justify-between gap-3 px-5 py-4 text-sm">
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-muted">{kindLabel(item.kind, strings)} · {item.citySlug}</p>
                    <p className="mt-1 truncate text-fg">{loc(item.title, locale)}</p>
                    <p className="mt-1 text-muted">{loc(item.summary, locale)}</p>
                  </div>
                  {item.kind === "trip-brief" ? (
                    <Link
                      to="/$country/$city"
                      params={{
                        country: cities.find((c) => c.slug === item.citySlug)?.countrySlug ?? item.citySlug,
                        city: item.citySlug,
                      }}
                      search={{ s: "overview" }}
                      className="shrink-0 text-xs text-accent hover:underline"
                    >
                      {strings.briefTitle}
                    </Link>
                  ) : null}
                  {item.downloadable ? (
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={downloading}
                        onClick={() => void onDownload(item.citySlug)}
                      >
                        {downloading ? strings.passDownloading : strings.passDownloadItinerary}
                      </Button>
                      <Link
                        to="/pass/print/$city"
                        params={{ city: item.citySlug }}
                        className="text-xs text-accent hover:underline"
                      >
                        {strings.passPrintPdf}
                      </Link>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </PassGate>
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
        </>
      ) : null}
    </DeskFrame>
  );
}
