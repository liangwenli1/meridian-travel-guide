import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { t, useI18n } from "@/lib/i18n";
import { getOrderByOut } from "@/lib/server/payment/service";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/pay/return")({
  validateSearch: (search: Record<string, unknown>) => ({
    out_trade_no: typeof search.out_trade_no === "string" ? search.out_trade_no : "",
  }),
  component: PayReturnPage,
  head: () => ({
    meta: [{ title: `Pay · ${SITE.name}` }],
  }),
});

function PayReturnPage() {
  const { out_trade_no: outTradeNo } = Route.useSearch();
  const locale = useI18n((s) => s.locale);
  const strings = t(locale);
  const { user, isPending } = useCurrentUserState();
  const [to, setTo] = useState<string | null>(null);

  useEffect(() => {
    if (isPending || !user || !outTradeNo) return;
    void getOrderByOut({ data: { outTradeNo } })
      .then((order) => setTo(order.status === "COMPLETED" ? "/pass" : `/pay/${order.id}`))
      .catch(() => setTo("/pass"));
  }, [isPending, outTradeNo, user]);

  if (to === "/pass") return <Navigate to="/pass" />;
  if (to?.startsWith("/pay/")) {
    return <Navigate to="/pay/$orderId" params={{ orderId: to.slice(5) }} />;
  }

  return (
    <main className="min-h-dvh bg-void text-fg">
      <SiteHeader />
      <div className="mx-auto max-w-md px-6 py-24">
        <p className="kicker text-accent">{strings.payKicker}</p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight">{strings.payConfirming}</h1>
      </div>
    </main>
  );
}
