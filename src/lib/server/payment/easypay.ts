import { easypaySign, easypayVerify, money2 } from "@/lib/server/payment/sign";
import type { ChargeResult, EasyPayCredentials, PayMethod } from "@/lib/server/payment/types";

/** Z-Pay (z-pay.cn) — default 易支付 host. Docs: https://z-pay.cn/doc.html */
const ZPAY_BASE = "https://zpayz.cn";

function apiRoot(base: string) {
  const root = (base.trim() || ZPAY_BASE).replace(/\/$/, "");
  return root || ZPAY_BASE;
}

function mapiUrl(base: string) {
  const root = apiRoot(base);
  if (root.endsWith(".php")) return root;
  return `${root}/mapi.php`;
}

function queryUrl(base: string) {
  const root = apiRoot(base);
  if (root.endsWith(".php")) return root.replace(/mapi\.php$/i, "api.php");
  return `${root}/api.php`;
}

export async function easypayCharge(opts: {
  creds: EasyPayCredentials;
  method: PayMethod;
  outTradeNo: string;
  amount: string;
  subject: string;
  notifyUrl: string;
  returnUrl: string;
  clientIp: string;
  device: "pc" | "mobile";
}): Promise<ChargeResult> {
  if (opts.method === "stripe") throw new Error("EasyPay does not take Stripe");
  const type = opts.method === "wechat" ? "wxpay" : "alipay";
  const channel = opts.method === "wechat" ? opts.creds.wechatChannel : opts.creds.alipayChannel;
  const params: Record<string, string> = {
    pid: opts.creds.pid,
    type,
    out_trade_no: opts.outTradeNo,
    notify_url: opts.notifyUrl,
    return_url: opts.returnUrl,
    name: opts.subject,
    money: money2(opts.amount),
    clientip: opts.clientIp || "127.0.0.1",
    device: opts.device,
    sign_type: "MD5",
  };
  if (channel) params.cid = channel;
  params.sign = easypaySign(params, opts.creds.pkey);

  const body = new URLSearchParams(params);
  const response = await fetch(mapiUrl(opts.creds.apiBase), {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });
  const text = await response.text();
  let json: Record<string, unknown> = {};
  try {
    json = JSON.parse(text) as Record<string, unknown>;
  } catch {
    throw new Error(text.slice(0, 180) || "Z-Pay did not return JSON");
  }
  const code = Number(json.code ?? json.status ?? 0);
  if (code !== 1) {
    throw new Error(String(json.msg ?? json.message ?? "Z-Pay charge failed"));
  }
  const payUrl =
    String(json.payurl ?? json.payUrl ?? json.payurl2 ?? json.urlscheme ?? "") || undefined;
  const qrCode =
    String(json.qrcode ?? json.qrCode ?? json.img ?? json.code_url ?? "") || undefined;
  return {
    payUrl,
    qrCode,
    urlScheme: String(json.urlscheme ?? "") || undefined,
    tradeNo: String(json.trade_no ?? json.O_id ?? "") || undefined,
    raw: json,
  };
}

export async function easypayQuery(creds: EasyPayCredentials, outTradeNo: string) {
  const url = new URL(queryUrl(creds.apiBase));
  url.searchParams.set("act", "order");
  url.searchParams.set("pid", creds.pid);
  url.searchParams.set("key", creds.pkey);
  url.searchParams.set("out_trade_no", outTradeNo);
  const response = await fetch(url);
  const text = await response.text();
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return { code: 0, msg: text.slice(0, 180) };
  }
}

export function easypayPaid(payload: Record<string, unknown>) {
  const status = String(payload.status ?? payload.trade_status ?? payload.msg ?? "").toLowerCase();
  const code = Number(payload.code ?? 0);
  return (
    status === "1" ||
    status === "success" ||
    status === "trade_success" ||
    payload.trade_status === "TRADE_SUCCESS" ||
    (code === 1 && (payload.status === 1 || payload.status === "1"))
  );
}

export { easypayVerify, ZPAY_BASE };
