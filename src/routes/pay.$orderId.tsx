import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PayQr } from "@/components/pay/PayQr";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Button } from "@/components/ui/Button";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { t, useI18n } from "@/lib/i18n";
import { cancelOrder, getOrder, type OrderRecord } from "@/lib/server/payment/service";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/pay/$orderId")({
  component: PayOrderPage,
  head: () => ({
    meta: [{ title: `Pay · ${SITE.name}` }],
  }),
});

function PayOrderPage() {
  const { orderId } = Route.useParams();
  const locale = useI18n((s) => s.locale);
  const strings = t(locale);
  const navigate = useNavigate();
  const { user, isPending } = useCurrentUserState();
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isPending || !user) return;
    let cancelled = false;
    const tick = async () => {
      try {
        const next = await getOrder({ data: { id: orderId } });
        if (cancelled) return;
        setOrder(next);
        if (next.status === "COMPLETED") {
          window.setTimeout(() => void navigate({ to: "/pass" }), 800);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : strings.authFailed);
      }
    };
    void tick();
    const timer = window.setInterval(() => void tick(), 2500);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [isPending, navigate, orderId, strings.authFailed, user]);

  if (isPending) {
    return (
      <main className="min-h-dvh bg-void text-fg">
        <SiteHeader />
        <div className="mx-auto max-w-md px-6 py-24">
          <div className="h-10 w-40 animate-pulse rounded bg-void-elevated" />
        </div>
      </main>
    );
  }
  if (!user) return <RedirectToSignIn />;

  const qr = order?.qrCode || order?.urlScheme || "";
  const payUrl = order?.payUrl || order?.urlScheme || "";

  return (
    <main className="min-h-dvh bg-void text-fg">
      <SiteHeader />
      <div className="mx-auto max-w-md px-6 py-16">
        <p className="kicker text-accent">{strings.payKicker}</p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight">{strings.payTitle}</h1>
        <p className="mt-3 text-sm text-muted">{strings.payDek}</p>

        {error ? <p className="mt-6 text-sm text-muted">{error}</p> : null}

        {order ? (
          <div className="mt-8 rounded-3xl bg-void-elevated p-6 shadow-border">
            <p className="font-mono text-sm text-accent">
              {order.currency === "USD" ? `$${order.amount}` : `¥${order.amount}`}
            </p>
            <p className="mt-1 text-sm text-muted">
              {order.method === "alipay"
                ? strings.payAlipay
                : order.method === "wechat"
                  ? strings.payWechat
                  : strings.payCard}
            </p>
            {order.status === "PENDING" && qr ? (
              <div className="mt-6 flex justify-center">
                <PayQr value={qr} />
              </div>
            ) : null}
            <p className="mt-4 text-xs tracking-wide text-muted uppercase">{order.status}</p>
            {order.status === "PENDING" && payUrl ? (
              <Button asChild className="mt-5 w-full" size="lg">
                <a href={payUrl} target="_blank" rel="noreferrer">
                  {strings.payOpen}
                </a>
              </Button>
            ) : null}
            {order.status === "PENDING" ? (
              <Button
                type="button"
                variant="ghost"
                className="mt-3 w-full"
                onClick={() => {
                  void cancelOrder({ data: { id: order.id } }).then(() => navigate({ to: "/pass" }));
                }}
              >
                {strings.payCancel}
              </Button>
            ) : null}
            {order.status === "COMPLETED" ? (
              <p className="mt-4 text-sm">{strings.payDone}</p>
            ) : null}
          </div>
        ) : (
          <div className="mt-8 h-48 animate-pulse rounded-3xl bg-void-elevated" />
        )}

        <p className="mt-10">
          <Link to="/pass" className="text-sm text-muted hover:text-fg">
            {strings.passTitle}
          </Link>
        </p>
      </div>
    </main>
  );
}
