import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Button } from "@/components/ui/Button";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { t, useI18n } from "@/lib/i18n";
import { getMembership, type Membership } from "@/lib/server/membership";
import { createCheckout, getPaymentPublic, type PaymentPublic } from "@/lib/server/payment/service";
import type { PayMethod } from "@/lib/server/payment/types";
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
  const navigate = useNavigate();
  const { user, isPending } = useCurrentUserState();
  const [membership, setMembership] = useState<Membership | null>(null);
  const [pay, setPay] = useState<PaymentPublic | null>(null);
  const [loading, setLoading] = useState(false);
  const [working, setWorking] = useState<PayMethod | null>(null);

  useEffect(() => {
    void getPaymentPublic()
      .then(setPay)
      .catch(() => setPay(null));
  }, []);

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

  const checkout = async (method: PayMethod) => {
    setWorking(method);
    try {
      const device = /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "pc";
      const order = await createCheckout({ data: { method, device } });
      if (method === "stripe" && order.payUrl) {
        window.location.href = order.payUrl;
        return;
      }
      await navigate({ to: "/pay/$orderId", params: { orderId: order.id } });
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      toast.error(message === "rate-limited" ? strings.rateLimited : message || strings.authFailed);
    } finally {
      setWorking(null);
    }
  };

  const active = membership?.status === "active";
  const priceLabel =
    pay && (pay.priceCny || pay.priceUsd)
      ? `¥${pay.priceCny} / $${pay.priceUsd} ${locale === "zh" ? "/ 年" : "/ year"}`
      : strings.passPrice;

  return (
    <main className="min-h-dvh bg-void text-fg">
      <SiteHeader />
      <div className="mx-auto max-w-xl px-6 py-16 md:py-24">
        <p className="kicker text-accent">{strings.passKicker}</p>
        <h1 className="mt-3 text-5xl font-medium tracking-tight">{strings.passTitle}</h1>
        <p className="mt-4 text-base leading-relaxed text-muted">{strings.passPageDek}</p>
        <p className="mt-6 font-mono text-sm tracking-wide text-accent">{priceLabel}</p>

        <ul className="mt-8 space-y-3">
          {PERKS[locale].map((perk) => (
            <li key={perk} className="flex items-start gap-3 text-sm text-fg">
              <Check className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={1.75} />
              {perk}
            </li>
          ))}
        </ul>

        <div className="mt-10 space-y-3">
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
          ) : !user ? (
            <Button asChild size="lg">
              <Link to="/login">{strings.passSignIn}</Link>
            </Button>
          ) : !pay?.enabled ? (
            <p className="text-sm leading-relaxed text-muted">{strings.payNotReady}</p>
          ) : (
            <>
              {pay.methods.includes("alipay") ? (
                <Button
                  size="lg"
                  className="w-full"
                  disabled={working !== null}
                  onClick={() => void checkout("alipay")}
                >
                  {working === "alipay" ? strings.working : strings.payAlipay}
                </Button>
              ) : null}
              {pay.methods.includes("wechat") ? (
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full"
                  disabled={working !== null}
                  onClick={() => void checkout("wechat")}
                >
                  {working === "wechat" ? strings.working : strings.payWechat}
                </Button>
              ) : null}
              {pay.methods.includes("stripe") ? (
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full"
                  disabled={working !== null}
                  onClick={() => void checkout("stripe")}
                >
                  {working === "stripe" ? strings.working : strings.payCard}
                </Button>
              ) : null}
              {pay.helpText ? <p className="pt-2 text-xs leading-relaxed text-muted">{pay.helpText}</p> : null}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
