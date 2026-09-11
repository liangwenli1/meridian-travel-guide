import { alipaySign, alipayVerify, money2 } from "@/lib/server/payment/sign";
import type { AlipayCredentials, ChargeResult } from "@/lib/server/payment/types";

function stamp() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

async function alipayCall(creds: AlipayCredentials, method: string, biz: Record<string, string>, notifyUrl?: string) {
  const params: Record<string, string> = {
    app_id: creds.appId,
    method,
    format: "JSON",
    charset: "utf-8",
    sign_type: "RSA2",
    timestamp: stamp(),
    version: "1.0",
    biz_content: JSON.stringify(biz),
  };
  if (notifyUrl) params.notify_url = notifyUrl;
  params.sign = alipaySign(params, creds.appPrivateKey);
  const body = new URLSearchParams(params);
  const response = await fetch("https://openapi.alipay.com/gateway.do", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded;charset=utf-8" },
    body,
  });
  return (await response.json()) as Record<string, unknown>;
}

export async function alipayPrecreate(opts: {
  creds: AlipayCredentials;
  outTradeNo: string;
  amount: string;
  subject: string;
  notifyUrl: string;
}): Promise<ChargeResult> {
  const json = await alipayCall(
    opts.creds,
    "alipay.trade.precreate",
    {
      out_trade_no: opts.outTradeNo,
      total_amount: money2(opts.amount),
      subject: opts.subject,
    },
    opts.notifyUrl,
  );
  const inner = (json.alipay_trade_precreate_response ?? json) as Record<string, unknown>;
  if (String(inner.code) !== "10000") {
    throw new Error(String(inner.sub_msg ?? inner.msg ?? "Alipay precreate failed"));
  }
  return {
    qrCode: String(inner.qr_code ?? ""),
    tradeNo: String(inner.out_trade_no ?? opts.outTradeNo),
    raw: json,
  };
}

export async function alipayWap(opts: {
  creds: AlipayCredentials;
  outTradeNo: string;
  amount: string;
  subject: string;
  notifyUrl: string;
  returnUrl: string;
}): Promise<ChargeResult> {
  const params: Record<string, string> = {
    app_id: opts.creds.appId,
    method: "alipay.trade.wap.pay",
    format: "JSON",
    charset: "utf-8",
    sign_type: "RSA2",
    timestamp: stamp(),
    version: "1.0",
    notify_url: opts.notifyUrl,
    return_url: opts.returnUrl,
    biz_content: JSON.stringify({
      out_trade_no: opts.outTradeNo,
      total_amount: money2(opts.amount),
      subject: opts.subject,
      product_code: "QUICK_WAP_WAY",
    }),
  };
  params.sign = alipaySign(params, opts.creds.appPrivateKey);
  const url = `https://openapi.alipay.com/gateway.do?${new URLSearchParams(params).toString()}`;
  return { payUrl: url };
}

export async function alipayQuery(creds: AlipayCredentials, outTradeNo: string) {
  const json = await alipayCall(creds, "alipay.trade.query", { out_trade_no: outTradeNo });
  return (json.alipay_trade_query_response ?? json) as Record<string, unknown>;
}

export function alipayNotifyOk(params: Record<string, string>, publicKey: string) {
  if (!alipayVerify(params, publicKey)) return false;
  return params.trade_status === "TRADE_SUCCESS" || params.trade_status === "TRADE_FINISHED";
}
