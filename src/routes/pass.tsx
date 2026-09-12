import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardMeta, CardTitle } from "@/components/ui/Card";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { t, useI18n } from "@/lib/i18n";
import { normalizePlan } from "@/lib/pass/access";
import { getMembership, type Membership } from "@/lib/server/membership";
import { createCheckout, getPaymentPublic, type PaymentPublic } from "@/lib/server/payment/service";
import type { PayMethod } from "@/lib/server/payment/types";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/pass")({
  component: PassPage,
  head: () => ({
    meta: [{ title: `Plans · ${SITE.name}` }],
  }),
});

const TIERS = {
  en: {
    free: ["Published city guides", "Monthly letter signup", "A teaser of what is closed on your dates"],
    pro: [
      "A trip brief for your dates: book now, closed days, where not to stay",
      "The taxi / pass / tout that costs more than a year",
      "Printable days and arrival notes for every published city",
    ],
    max: ["Everything in Pro", "Neighborhood notes before they ship", "The locker as each new city ships"],
  },
  zh: {
    free: ["已发布的城市指南", "月度来信", "你日期里谁关门的一条预告"],
    pro: ["按日期的出行简报：现在订、闭馆、不要住哪", "那趟贵过一年会员的出租车 / 通票 / 黄牛", "每座已发布城市的可打印日子和过境"],
    max: ["包含 Pro 全部", "发稿前的街区笔记", "每座新城里的储物柜"],
  },
} as const;

function PassPage() {
  const locale = useI18n((s) => s.locale);
  const strings = t(locale);
  const navigate = useNavigate();
  const { user, isPending } = useCurrentUserState();
  const [membership, setMembership] = useState<Membership | null>(null);
  const [pay, setPay] = useState<PaymentPublic | null>(null);
  const [loading, setLoading] = useState(false);
  const [working, setWorking] = useState<string | null>(null);

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

  const checkout = async (method: PayMethod, plan: "pro" | "max") => {
    setWorking(`${plan}-${method}`);
    try {
      const device = /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "pc";
      const order = await createCheckout({ data: { method, device, plan } });
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

  const plan = normalizePlan(membership?.status === "active" ? membership.plan : "free");
  const perks = TIERS[locale];

  const payButtons = (tier: "pro" | "max") => {
    if (isPending || (user && loading)) {
      return <div className="h-11 w-full animate-pulse rounded-full bg-void-elevated" />;
    }
    if (plan === tier || (plan === "max" && tier === "pro")) {
      return (
        <p className="text-sm text-muted">
          {plan === "max" ? strings.planCurrentMax : strings.planCurrentPro}
        </p>
      );
    }
    if (!user) {
      return (
        <Button asChild className="w-full" variant={tier === "max" ? "default" : "outline"}>
          <Link to="/login">{strings.passSignIn}</Link>
        </Button>
      );
    }
    if (!pay?.enabled) {
      return <p className="text-sm text-muted">{strings.payNotReady}</p>;
    }
    return (
      <div className="space-y-2">
        {pay.methods.includes("alipay") ? (
          <Button
            className="w-full"
            variant={tier === "max" ? "default" : "outline"}
            disabled={working !== null}
            onClick={() => void checkout("alipay", tier)}
          >
            {working === `${tier}-alipay` ? strings.working : strings.payAlipay}
          </Button>
        ) : null}
        {pay.methods.includes("wechat") ? (
          <Button
            className="w-full"
            variant="outline"
            disabled={working !== null}
            onClick={() => void checkout("wechat", tier)}
          >
            {working === `${tier}-wechat` ? strings.working : strings.payWechat}
          </Button>
        ) : null}
        {pay.methods.includes("stripe") ? (
          <Button
            className="w-full"
            variant="outline"
            disabled={working !== null}
            onClick={() => void checkout("stripe", tier)}
          >
            {working === `${tier}-stripe` ? strings.working : strings.payCard}
          </Button>
        ) : null}
      </div>
    );
  };

  return (
    <main className="min-h-dvh bg-void text-fg">
      <SiteHeader />
      <div className="mx-auto max-w-5xl px-6 py-16 md:py-24">
        <p className="kicker text-accent">{strings.passKicker}</p>
        <h1 className="mt-3 text-5xl font-medium tracking-tight">{strings.passTitle}</h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">{strings.passPageDek}</p>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <Card padding="lg">
            <CardMeta>{strings.planFree}</CardMeta>
            <CardTitle className="mt-2">{strings.planFree}</CardTitle>
            <p className="mt-3 font-mono text-sm text-accent">{strings.planFreePrice}</p>
            <CardDescription>{strings.planFreeDek}</CardDescription>
            <ul className="mt-6 space-y-3">
              {perks.free.map((perk) => (
                <li key={perk} className="flex items-start gap-3 text-sm text-fg">
                  <Check className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={1.75} />
                  {perk}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              {plan === "free" ? (
                <p className="text-sm text-muted">{strings.planCurrentFree}</p>
              ) : (
                <Button asChild variant="outline" className="w-full">
                  <Link to="/account">{strings.account}</Link>
                </Button>
              )}
            </div>
          </Card>

          <Card padding="lg" className="shadow-border-hover">
            <CardMeta>{strings.planPro}</CardMeta>
            <CardTitle className="mt-2">{strings.planPro}</CardTitle>
            <p className="mt-3 font-mono text-sm text-accent">
              {pay ? `¥${pay.priceCny} / $${pay.priceUsd}` : strings.passPrice} {strings.planYear}
            </p>
            <CardDescription>{strings.planProDek}</CardDescription>
            <ul className="mt-6 space-y-3">
              {perks.pro.map((perk) => (
                <li key={perk} className="flex items-start gap-3 text-sm text-fg">
                  <Check className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={1.75} />
                  {perk}
                </li>
              ))}
            </ul>
            <div className="mt-8">{payButtons("pro")}</div>
          </Card>

          <Card padding="lg">
            <CardMeta>{strings.planMax}</CardMeta>
            <CardTitle className="mt-2">{strings.planMax}</CardTitle>
            <p className="mt-3 font-mono text-sm text-accent">
              {pay ? `¥${pay.priceMaxCny} / $${pay.priceMaxUsd}` : strings.planMaxPrice} {strings.planYear}
            </p>
            <CardDescription>{strings.planMaxDek}</CardDescription>
            <ul className="mt-6 space-y-3">
              {perks.max.map((perk) => (
                <li key={perk} className="flex items-start gap-3 text-sm text-fg">
                  <Check className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={1.75} />
                  {perk}
                </li>
              ))}
            </ul>
            <div className="mt-8">{payButtons("max")}</div>
          </Card>
        </div>
        {pay?.helpText ? <p className="mt-8 text-xs leading-relaxed text-muted">{pay.helpText}</p> : null}
      </div>
    </main>
  );
}
