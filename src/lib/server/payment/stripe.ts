import type { ChargeResult, StripeCredentials } from "@/lib/server/payment/types";
import { stripeVerify } from "@/lib/server/payment/sign";

export async function stripeCheckout(opts: {
  creds: StripeCredentials;
  outTradeNo: string;
  amountUsd: string;
  subject: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<ChargeResult> {
  const cents = Math.round(Number(opts.amountUsd) * 100);
  const body = new URLSearchParams({
    mode: "payment",
    success_url: opts.successUrl,
    cancel_url: opts.cancelUrl,
    client_reference_id: opts.outTradeNo,
    "metadata[out_trade_no]": opts.outTradeNo,
    "line_items[0][quantity]": "1",
    "line_items[0][price_data][currency]": "usd",
    "line_items[0][price_data][unit_amount]": String(cents),
    "line_items[0][price_data][product_data][name]": opts.subject,
  });
  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      authorization: `Bearer ${opts.creds.secretKey}`,
      "content-type": "application/x-www-form-urlencoded",
    },
    body,
  });
  const json = (await response.json()) as Record<string, unknown>;
  if (!json.url) throw new Error(String(json.error ?? json.message ?? "Stripe checkout failed"));
  return { payUrl: String(json.url), tradeNo: String(json.id ?? ""), raw: json };
}

export { stripeVerify };
