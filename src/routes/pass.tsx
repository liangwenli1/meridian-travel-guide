import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Button } from "@/components/ui/Button";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { t, useI18n } from "@/lib/i18n";
import { getMembership, startFieldPass, type Membership } from "@/lib/server/membership";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/pass")({
  component: PassPage,
  head: () => ({
    meta: [{ title: `Field Pass · ${SITE.name}` }],
  }),
});

const PERKS = {
  en: [
    "Downloadable day-by-day itineraries",
    "Off-season tables we do not publish",
    "Neighborhood notes before they ship",
    "One city briefing each month",
  ],
  zh: ["可下载的逐日行程", "不公开的淡季餐桌", "发稿前的街区笔记", "每月一座城市的短通讯"],
} as const;

function PassPage() {
  const locale = useI18n((s) => s.locale);
  const strings = t(locale);
  const { user, isPending } = useCurrentUserState();
  const [membership, setMembership] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(false);
  const [working, setWorking] = useState(false);

  useEffect(() => {
    if (isPending || !user) {
      setMembership(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    void getMembership()
      .then((row) => setMembership(row))
      .catch(() => setMembership(null))
      .finally(() => setLoading(false));
  }, [isPending, user]);

  const activate = async () => {
    setWorking(true);
    try {
      const row = await startFieldPass();
      setMembership(row);
      toast.success(strings.passActive);
    } catch {
      toast.error(strings.authFailed);
    } finally {
      setWorking(false);
    }
  };

  const active = membership?.status === "active";

  return (
    <main className="min-h-dvh bg-void text-fg">
      <SiteHeader />
      <div className="mx-auto max-w-xl px-6 py-16 md:py-24">
        <p className="kicker text-accent">{strings.passKicker}</p>
        <h1 className="mt-3 text-5xl font-medium tracking-tight">{strings.passTitle}</h1>
        <p className="mt-4 text-base leading-relaxed text-muted">{strings.passPageDek}</p>
        <p className="mt-6 font-mono text-sm tracking-wide text-accent">{strings.passPrice}</p>

        <ul className="mt-8 space-y-3">
          {PERKS[locale].map((perk) => (
            <li key={perk} className="flex items-start gap-3 text-sm text-fg">
              <Check className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={1.75} />
              {perk}
            </li>
          ))}
        </ul>

        <div className="mt-10">
          {isPending || (user && loading) ? (
            <div className="h-11 w-48 animate-pulse rounded-full bg-void-elevated" />
          ) : active ? (
            <div className="rounded-2xl bg-void-elevated p-5 shadow-border">
              <p className="text-sm font-medium text-fg">{strings.passActive}</p>
              {membership?.expiresAt ? (
                <p className="mt-1 text-sm text-muted">
                  {strings.passUntil} {String(membership.expiresAt).slice(0, 10)}
                </p>
              ) : null}
              <Button asChild className="mt-4" variant="outline">
                <Link to="/account">{strings.account}</Link>
              </Button>
            </div>
          ) : user ? (
            <Button size="lg" disabled={working} onClick={() => void activate()}>
              {working ? strings.working : strings.passStart}
            </Button>
          ) : (
            <Button asChild size="lg">
              <Link to="/login">{strings.passSignIn}</Link>
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
