import { decryptWechatResource, wechatAuth } from "@/lib/server/payment/sign";
import type { ChargeResult, WxpayCredentials } from "@/lib/server/payment/types";

export async function wechatNative(opts: {
  creds: WxpayCredentials;
  outTradeNo: string;
  amount: string;
  subject: string;
  notifyUrl: string;
}): Promise<ChargeResult> {
  const path = "/v3/pay/transactions/native";
  const body = JSON.stringify({
    appid: opts.creds.appId,
    mchid: opts.creds.mchId,
    description: opts.subject,
    out_trade_no: opts.outTradeNo,
    notify_url: opts.notifyUrl,
    amount: { total: Math.round(Number(opts.amount) * 100), currency: "CNY" },
  });
  const auth = wechatAuth({
    mchId: opts.creds.mchId,
    serialNo: opts.creds.serialNo,
    privateKey: opts.creds.privateKey,
    method: "POST",
    path,
    body,
  });
  const response = await fetch(`https://api.mch.weixin.qq.com${path}`, {
    method: "POST",
    headers: {
      authorization: auth.authorization,
      "content-type": "application/json",
      accept: "application/json",
    },
    body,
  });
  const json = (await response.json()) as Record<string, unknown>;
  if (!json.code_url) {
    throw new Error(String(json.message ?? json.code ?? "WeChat native pay failed"));
  }
  return { qrCode: String(json.code_url), raw: json };
}

export async function wechatQuery(creds: WxpayCredentials, outTradeNo: string) {
  const path = `/v3/pay/transactions/out-trade-no/${encodeURIComponent(outTradeNo)}?mchid=${encodeURIComponent(creds.mchId)}`;
  const auth = wechatAuth({
    mchId: creds.mchId,
    serialNo: creds.serialNo,
    privateKey: creds.privateKey,
    method: "GET",
    path,
    body: "",
  });
  const response = await fetch(`https://api.mch.weixin.qq.com${path}`, {
    headers: { authorization: auth.authorization, accept: "application/json" },
  });
  return (await response.json()) as Record<string, unknown>;
}

export function wechatDecryptNotify(creds: WxpayCredentials, body: {
  resource?: { ciphertext?: string; nonce?: string; associated_data?: string };
}) {
  const resource = body.resource;
  if (!resource?.ciphertext || !resource.nonce) throw new Error("Invalid WeChat notify");
  const plain = decryptWechatResource(
    creds.apiV3Key,
    resource.nonce,
    resource.ciphertext,
    resource.associated_data ?? "",
  );
  return JSON.parse(plain) as Record<string, unknown>;
}
