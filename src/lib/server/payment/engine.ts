import { getSql } from "@/lib/db";
import { DEFAULT_PAYMENT, publicOrigin, readPayment, requireAdmin } from "@/lib/server/ops";
import { alipayNotifyOk, alipayPrecreate, alipayQuery, alipayWap } from "@/lib/server/payment/alipay";
import { easypayCharge, easypayPaid, easypayQuery, easypayVerify } from "@/lib/server/payment/easypay";
import { stripeCheckout, stripeVerify } from "@/lib/server/payment/stripe";
import { money2, newId } from "@/lib/server/payment/sign";
import { wechatDecryptNotify, wechatNative, wechatQuery } from "@/lib/server/payment/wechat";
import type {
  AlipayCredentials,
  ChargeResult,
  CheckoutRequest,
  EasyPayCredentials,
  OrderRecord,
  OrderStatus,
  PayMethod,
  ProviderPublic,
  ProviderRow,
  ProviderType,
  StripeCredentials,
  WxpayCredentials,
} from "@/lib/server/payment/types";

export type { OrderRecord, PayMethod, ProviderPublic };

type OrderRow = {
  id: string;
  user_id: string;
  provider_id: string | null;
  provider_type: string;
  method: string;
  out_trade_no: string;
  trade_no: string | null;
  amount: string;
  currency: string;
  product: string;
  status: OrderStatus;
  pay_url: string | null;
  qr_code: string | null;
  url_scheme: string | null;
  paid_at: string | null;
  expires_at: string | null;
  created_at: string;
};

const SECRET_KEYS = [
  "pkey",
  "password",
  "appPrivateKey",
  "alipayPublicKey",
  "privateKey",
  "apiV3Key",
  "wechatPublicKey",
  "secretKey",
  "webhookSecret",
];

function mapOrder(row: OrderRow): OrderRecord {
  return {
    id: row.id,
    userId: row.user_id,
    providerId: row.provider_id,
    providerType: row.provider_type,
    method: row.method,
    outTradeNo: row.out_trade_no,
    tradeNo: row.trade_no,
    amount: String(row.amount),
    currency: row.currency,
    product: row.product,
    status: row.status,
    payUrl: row.pay_url,
    qrCode: row.qr_code,
    urlScheme: row.url_scheme,
    paidAt: row.paid_at,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
  };
}

function maskCreds(creds: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(creds ?? {})) {
    if (!value) {
      out[key] = "";
      continue;
    }
    if (SECRET_KEYS.includes(key) || key.toLowerCase().includes("key") || key.toLowerCase().includes("secret")) {
      out[key] = "";
      out[`${key}Set`] = "1";
    } else {
      out[key] = value;
    }
  }
  return out;
}

function mergeCreds(previous: Record<string, string>, incoming: Record<string, string>) {
  const next = { ...previous };
  for (const [key, value] of Object.entries(incoming)) {
    if (key.endsWith("Set")) continue;
    if (value && value.trim()) next[key] = value.trim();
  }
  return next;
}

function asProvider(row: {
  id: string;
  type: string;
  name: string;
  enabled: boolean;
  credentials: Record<string, string>;
  min_amount: string | null;
  max_amount: string | null;
  daily_limit: string | null;
  sort_order: number;
}): ProviderPublic {
  return {
    id: row.id,
    type: row.type as ProviderType,
    name: row.name,
    enabled: row.enabled,
    credentials: maskCreds(row.credentials ?? {}),
    minAmount: row.min_amount == null ? "" : String(row.min_amount),
    maxAmount: row.max_amount == null ? "" : String(row.max_amount),
    dailyLimit: row.daily_limit == null ? "" : String(row.daily_limit),
    sortOrder: row.sort_order,
  };
}

async function loadProviders(): Promise<ProviderRow[]> {
  const sql = await getSql();
  return sql.query<ProviderRow>(
    `select id, type, name, enabled, credentials, extra, min_amount::text as min_amount,
            max_amount::text as max_amount, daily_limit::text as daily_limit, sort_order
     from payment_providers
     order by sort_order asc, created_at asc`,
  );
}

async function loadProvider(id: string): Promise<ProviderRow | null> {
  const sql = await getSql();
  const rows = await sql.query<ProviderRow>(
    `select id, type, name, enabled, credentials, extra, min_amount::text as min_amount,
            max_amount::text as max_amount, daily_limit::text as daily_limit, sort_order
     from payment_providers where id = $1`,
    [id],
  );
  return rows[0] ?? null;
}

function pickProvider(list: ProviderRow[], type: ProviderType): ProviderRow | undefined {
  return list.find((row) => row.enabled && row.type === type);
}

async function clientIp(): Promise<string> {
  try {
    const { getRequest } = await import("@tanstack/react-start/server");
    const request = getRequest();
    const forwarded = request?.headers.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0]?.trim() || "127.0.0.1";
    return request?.headers.get("cf-connecting-ip") || "127.0.0.1";
  } catch {
    return "127.0.0.1";
  }
}

export async function grantFieldPass(userId: string, plan: "pro" | "max" = "pro") {
  const sql = await getSql();
  await sql.query(
    `insert into memberships (user_id, plan, status, started_at, expires_at)
     values ($1, $2, 'active', now(), now() + interval '1 year')
     on conflict (user_id) do update set
       status = 'active',
       plan = case
         when excluded.plan = 'max' then 'max'
         when memberships.plan = 'max' then 'max'
         else excluded.plan
       end,
       expires_at = case
         when memberships.expires_at is not null and memberships.expires_at > now()
           then memberships.expires_at + interval '1 year'
         else now() + interval '1 year'
       end`,
    [userId, plan],
  );
}

export async function fulfillByOutTradeNo(outTradeNo: string, tradeNo?: string) {
  const sql = await getSql();
  const rows = await sql.query<{ user_id: string; status: string; product: string }>(
    `select user_id, status, product from payment_orders where out_trade_no = $1`,
    [outTradeNo],
  );
  const row = rows[0];
  if (!row) return false;
  if (row.status === "COMPLETED") return true;
  await sql.query(
    `update payment_orders
     set status = 'COMPLETED',
         trade_no = coalesce($2, trade_no),
         paid_at = now()
     where out_trade_no = $1 and status = 'PENDING'`,
    [outTradeNo, tradeNo ?? null],
  );
  const plan = row.product === "max" ? "max" : "pro";
  await grantFieldPass(row.user_id, plan);
  return true;
}

async function loadOrderByOut(outTradeNo: string): Promise<OrderRow | null> {
  const sql = await getSql();
  const rows = await sql.query<OrderRow>(
    `select id, user_id, provider_id, provider_type, method, out_trade_no, trade_no,
            amount::text as amount, currency, product, status, pay_url, qr_code, url_scheme,
            paid_at::text as paid_at, expires_at::text as expires_at, created_at::text as created_at
     from payment_orders where out_trade_no = $1`,
    [outTradeNo],
  );
  return rows[0] ?? null;
}

async function queryUpstream(order: OrderRow): Promise<boolean> {
  if (order.status === "COMPLETED") return true;
  if (!order.provider_id) return false;
  const provider = await loadProvider(order.provider_id);
  if (!provider) return false;
  const creds = provider.credentials ?? {};
  try {
    if (provider.type === "easypay") {
      const json = await easypayQuery(creds as EasyPayCredentials, order.out_trade_no);
      if (easypayPaid(json)) {
        return fulfillByOutTradeNo(order.out_trade_no, String(json.trade_no ?? ""));
      }
    } else if (provider.type === "alipay") {
      const json = await alipayQuery(creds as AlipayCredentials, order.out_trade_no);
      const status = String(json.trade_status ?? "");
      if (status === "TRADE_SUCCESS" || status === "TRADE_FINISHED") {
        return fulfillByOutTradeNo(order.out_trade_no, String(json.trade_no ?? ""));
      }
    } else if (provider.type === "wxpay") {
      const json = await wechatQuery(creds as WxpayCredentials, order.out_trade_no);
      if (json.trade_state === "SUCCESS") {
        return fulfillByOutTradeNo(order.out_trade_no, String(json.transaction_id ?? ""));
      }
    }
  } catch {
    return false;
  }
  return false;
}

export type PaymentPublic = {
  enabled: boolean;
  priceCny: string;
  priceUsd: string;
  priceMaxCny: string;
  priceMaxUsd: string;
  helpText: string;
  methods: PayMethod[];
};

export async function getPaymentPublic(): Promise<PaymentPublic> {
  const settings = await readPayment();
  const providers = await loadProviders();
  const methods: PayMethod[] = [];
  if (settings.enabled && settings.alipayEnabled && settings.alipaySource) {
    const type = settings.alipaySource === "official" ? "alipay" : "easypay";
    if (pickProvider(providers, type)) methods.push("alipay");
  }
  if (settings.enabled && settings.wechatEnabled && settings.wechatSource) {
    const type = settings.wechatSource === "official" ? "wxpay" : "easypay";
    if (pickProvider(providers, type)) methods.push("wechat");
  }
  if (settings.enabled && settings.stripeEnabled && pickProvider(providers, "stripe")) {
    methods.push("stripe");
  }
  return {
    enabled: settings.enabled && methods.length > 0,
    priceCny: settings.priceCny,
    priceUsd: settings.priceUsd,
    priceMaxCny: settings.priceMaxCny,
    priceMaxUsd: settings.priceMaxUsd,
    helpText: settings.helpText,
    methods,
  };
}

export async function listProviders(userId: string): Promise<ProviderPublic[]> {
    await requireAdmin(userId);
    const rows = await loadProviders();
    return rows.map(asProvider);
}

export type ProviderInput = {
  id?: string;
  type: ProviderType;
  name: string;
  enabled: boolean;
  credentials: Record<string, string>;
  minAmount?: string;
  maxAmount?: string;
  dailyLimit?: string;
};

export async function saveProvider(userId: string, data: ProviderInput): Promise<ProviderPublic> {
    await requireAdmin(userId);
    const sql = await getSql();
    const id = data.id || newId("p_");
    const existing = data.id ? await loadProvider(data.id) : null;
    const credentials = mergeCreds(existing?.credentials ?? {}, data.credentials ?? {});
    if (data.type === "easypay" && !credentials.apiBase) {
      credentials.apiBase = "https://zpayz.cn";
    }
    const minAmount = data.minAmount?.trim() || null;
    const maxAmount = data.maxAmount?.trim() || null;
    const dailyLimit = data.dailyLimit?.trim() || null;
    await sql.query(
      `insert into payment_providers (id, type, name, enabled, credentials, min_amount, max_amount, daily_limit)
       values ($1,$2,$3,$4,$5::jsonb,$6,$7,$8)
       on conflict (id) do update set
         name = excluded.name,
         enabled = excluded.enabled,
         credentials = excluded.credentials,
         min_amount = excluded.min_amount,
         max_amount = excluded.max_amount,
         daily_limit = excluded.daily_limit`,
      [
        id,
        data.type,
        data.name.trim() || data.type,
        data.enabled,
        JSON.stringify(credentials),
        minAmount,
        maxAmount,
        dailyLimit,
      ],
    );
    const row = await loadProvider(id);
    if (!row) throw new Error("Could not save provider");
    return asProvider(row);
}

export async function deleteProvider(userId: string, id: string): Promise<{ ok: boolean }> {
    await requireAdmin(userId);
    const sql = await getSql();
    await sql.query(`delete from payment_providers where id = $1`, [id]);
    return { ok: true };
}

export async function listOrdersAdmin(userId: string): Promise<OrderRecord[]> {
    await requireAdmin(userId);
    const sql = await getSql();
    const rows = await sql.query<OrderRow>(
      `select id, user_id, provider_id, provider_type, method, out_trade_no, trade_no,
              amount::text as amount, currency, product, status, pay_url, qr_code, url_scheme,
              paid_at::text as paid_at, expires_at::text as expires_at, created_at::text as created_at
       from payment_orders
       order by created_at desc
       limit 80`,
    );
    return rows.map(mapOrder);
}

export async function listMyOrders(userId: string): Promise<OrderRecord[]> {
    const sql = await getSql();
    const rows = await sql.query<OrderRow>(
      `select id, user_id, provider_id, provider_type, method, out_trade_no, trade_no,
              amount::text as amount, currency, product, status, pay_url, qr_code, url_scheme,
              paid_at::text as paid_at, expires_at::text as expires_at, created_at::text as created_at
       from payment_orders
       where user_id = $1
       order by created_at desc
       limit 20`,
      [userId],
    );
    return rows.map(mapOrder);
}

export async function markOrderPaid(userId: string, outTradeNo: string): Promise<OrderRecord> {
    await requireAdmin(userId);
    await fulfillByOutTradeNo(outTradeNo, "manual");
    const row = await loadOrderByOut(outTradeNo);
    if (!row) throw new Error("Order not found");
    return mapOrder(row);
}

async function createCharge(opts: {
  provider: ProviderRow;
  method: PayMethod;
  device: "pc" | "mobile";
  outTradeNo: string;
  amount: string;
  subject: string;
  origin: string;
}): Promise<ChargeResult> {
  const notify = `${opts.origin}/api/payment/webhook/${opts.provider.type}`;
  // Z-Pay forbids query strings on notify_url / return_url.
  const ret = `${opts.origin}/pay/return`;
  const creds = opts.provider.credentials ?? {};
  if (opts.provider.type === "easypay") {
    return easypayCharge({
      creds: creds as EasyPayCredentials,
      method: opts.method,
      outTradeNo: opts.outTradeNo,
      amount: opts.amount,
      subject: opts.subject,
      notifyUrl: notify,
      returnUrl: ret,
      clientIp: await clientIp(),
      device: opts.device,
    });
  }
  if (opts.provider.type === "alipay") {
    if (opts.device === "mobile") {
      return alipayWap({
        creds: creds as AlipayCredentials,
        outTradeNo: opts.outTradeNo,
        amount: opts.amount,
        subject: opts.subject,
        notifyUrl: notify,
        returnUrl: ret,
      });
    }
    return alipayPrecreate({
      creds: creds as AlipayCredentials,
      outTradeNo: opts.outTradeNo,
      amount: opts.amount,
      subject: opts.subject,
      notifyUrl: notify,
    });
  }
  if (opts.provider.type === "wxpay") {
    return wechatNative({
      creds: creds as WxpayCredentials,
      outTradeNo: opts.outTradeNo,
      amount: opts.amount,
      subject: opts.subject,
      notifyUrl: notify,
    });
  }
  return stripeCheckout({
    creds: creds as StripeCredentials,
    outTradeNo: opts.outTradeNo,
    amountUsd: opts.amount,
    subject: opts.subject,
    successUrl: `${ret}&status=success`,
    cancelUrl: `${opts.origin}/pass`,
  });
}

export async function createCheckout(userId: string, data: CheckoutRequest): Promise<OrderRecord> {
    const { rateLimit } = await import("@/lib/server/redis");
    if (!(await rateLimit(`pay:user:${userId}`, 10, 600))) {
      throw new Error("rate-limited");
    }
    const settings = await readPayment();
    if (!settings.enabled) throw new Error("Payments are not enabled");
    const sql = await getSql();
    const pending = await sql.query<{ n: number }>(
      `select count(*)::int as n from payment_orders where user_id = $1 and status = 'PENDING'`,
      [userId],
    );
    if ((pending[0]?.n ?? 0) >= settings.maxPending) {
      throw new Error("Too many open orders");
    }

    const providers = await loadProviders();
    let providerType: ProviderType;
    if (data.method === "alipay") {
      if (!settings.alipayEnabled || !settings.alipaySource) throw new Error("Alipay is not available");
      providerType = settings.alipaySource === "official" ? "alipay" : "easypay";
    } else if (data.method === "wechat") {
      if (!settings.wechatEnabled || !settings.wechatSource) throw new Error("WeChat Pay is not available");
      providerType = settings.wechatSource === "official" ? "wxpay" : "easypay";
    } else {
      if (!settings.stripeEnabled) throw new Error("Card payments are not available");
      providerType = "stripe";
    }
    const provider = pickProvider(providers, providerType);
    if (!provider) throw new Error("No payment provider is configured");

    const plan = data.plan === "max" ? "max" : "pro";
    const currency = data.method === "stripe" ? "USD" : "CNY";
    const amount = money2(
      data.method === "stripe"
        ? plan === "max"
          ? settings.priceMaxUsd
          : settings.priceUsd
        : plan === "max"
          ? settings.priceMaxCny
          : settings.priceCny,
    );
    const min = Number(settings.minAmount || DEFAULT_PAYMENT.minAmount);
    const max = Number(settings.maxAmount || 999999);
    if (Number(amount) < min || Number(amount) > max) throw new Error("Amount is out of range");

    const origin = await publicOrigin();
    const outTradeNo = newId("M");
    const id = newId("o_");
    const subject = `${plan === "max" ? "Meridian Max" : "Meridian Pro"}`.trim();
    const timeout = Math.max(1, settings.orderTimeoutMin);
    const charge = await createCharge({
      provider,
      method: data.method,
      device: data.device === "mobile" ? "mobile" : "pc",
      outTradeNo,
      amount,
      subject,
      origin,
    });

    await sql.query(
      `insert into payment_orders (
         id, user_id, provider_id, provider_type, method, out_trade_no, trade_no,
         amount, currency, product, status, pay_url, qr_code, url_scheme, raw, expires_at
       ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'PENDING',$11,$12,$13,$14::jsonb, now() + ($15 || ' minutes')::interval)`,
      [
        id,
        userId,
        provider.id,
        provider.type,
        data.method,
        outTradeNo,
        charge.tradeNo ?? null,
        amount,
        currency,
        plan,
        charge.payUrl ?? null,
        charge.qrCode ?? null,
        charge.urlScheme ?? null,
        JSON.stringify(charge.raw ?? {}),
        String(timeout),
      ],
    );
    const row = await loadOrderByOut(outTradeNo);
    if (!row) throw new Error("Could not create order");
    return mapOrder(row);
}

export async function getOrder(userId: string, id: string): Promise<OrderRecord> {
    const sql = await getSql();
    const rows = await sql.query<OrderRow>(
      `select id, user_id, provider_id, provider_type, method, out_trade_no, trade_no,
              amount::text as amount, currency, product, status, pay_url, qr_code, url_scheme,
              paid_at::text as paid_at, expires_at::text as expires_at, created_at::text as created_at
       from payment_orders where id = $1 and user_id = $2`,
      [id, userId],
    );
    const row = rows[0];
    if (!row) throw new Error("Order not found");
    if (row.status === "PENDING") {
      const paid = await queryUpstream(row);
      if (paid) {
        const fresh = await loadOrderByOut(row.out_trade_no);
        if (fresh) return mapOrder(fresh);
      }
      if (row.expires_at && new Date(row.expires_at).getTime() < Date.now()) {
        await sql.query(`update payment_orders set status = 'EXPIRED' where id = $1 and status = 'PENDING'`, [
          row.id,
        ]);
        return { ...mapOrder(row), status: "EXPIRED" };
      }
    }
    return mapOrder(row);
}

export async function getOrderByOut(userId: string, outTradeNo: string): Promise<OrderRecord> {
    const sql = await getSql();
    const rows = await sql.query<OrderRow>(
      `select id, user_id, provider_id, provider_type, method, out_trade_no, trade_no,
              amount::text as amount, currency, product, status, pay_url, qr_code, url_scheme,
              paid_at::text as paid_at, expires_at::text as expires_at, created_at::text as created_at
       from payment_orders where out_trade_no = $1 and user_id = $2`,
      [outTradeNo, userId],
    );
    const row = rows[0];
    if (!row) throw new Error("Order not found");
    if (row.status === "PENDING") {
      const paid = await queryUpstream(row);
      if (paid) {
        const fresh = await loadOrderByOut(row.out_trade_no);
        if (fresh) return mapOrder(fresh);
      }
    }
    return mapOrder(row);
}

export async function cancelOrder(userId: string, id: string): Promise<OrderRecord> {
    const sql = await getSql();
    await sql.query(
      `update payment_orders set status = 'CANCELLED' where id = $1 and user_id = $2 and status = 'PENDING'`,
      [id, userId],
    );
    const rows = await sql.query<OrderRow>(
      `select id, user_id, provider_id, provider_type, method, out_trade_no, trade_no,
              amount::text as amount, currency, product, status, pay_url, qr_code, url_scheme,
              paid_at::text as paid_at, expires_at::text as expires_at, created_at::text as created_at
       from payment_orders where id = $1 and user_id = $2`,
      [id, userId],
    );
    if (!rows[0]) throw new Error("Order not found");
    return mapOrder(rows[0]);
}

export async function handleEasypayNotify(params: Record<string, string>) {
  const outTradeNo = params.out_trade_no;
  if (!outTradeNo) return false;
  const order = await loadOrderByOut(outTradeNo);
  if (!order?.provider_id) return false;
  const provider = await loadProvider(order.provider_id);
  if (!provider) return false;
  const key = String(provider.credentials.pkey ?? "");
  if (!easypayVerify(params, key)) return false;
  if (params.trade_status && params.trade_status !== "TRADE_SUCCESS") return false;
  return fulfillByOutTradeNo(outTradeNo, params.trade_no);
}

export async function handleAlipayNotify(params: Record<string, string>) {
  const outTradeNo = params.out_trade_no;
  if (!outTradeNo) return false;
  const order = await loadOrderByOut(outTradeNo);
  if (!order?.provider_id) return false;
  const provider = await loadProvider(order.provider_id);
  if (!provider) return false;
  if (!alipayNotifyOk(params, String(provider.credentials.alipayPublicKey ?? ""))) return false;
  return fulfillByOutTradeNo(outTradeNo, params.trade_no);
}

export async function handleWxpayNotify(body: Record<string, unknown>) {
  const sql = await getSql();
  const rows = await sql.query<ProviderRow>(
    `select id, type, name, enabled, credentials, extra, min_amount::text as min_amount,
            max_amount::text as max_amount, daily_limit::text as daily_limit, sort_order
     from payment_providers where type = 'wxpay' and enabled = true`,
  );
  for (const provider of rows) {
    try {
      const plain = wechatDecryptNotify(provider.credentials as WxpayCredentials, body);
      const outTradeNo = String(plain.out_trade_no ?? "");
      if (plain.trade_state === "SUCCESS" && outTradeNo) {
        return fulfillByOutTradeNo(outTradeNo, String(plain.transaction_id ?? ""));
      }
    } catch {
      continue;
    }
  }
  return false;
}

export async function handleStripeNotify(rawBody: string, signature: string) {
  const providers = (await loadProviders()).filter((row) => row.type === "stripe");
  for (const provider of providers) {
    const secret = String(provider.credentials.webhookSecret ?? "");
    if (!secret || !stripeVerify(rawBody, signature, secret)) continue;
    const json = JSON.parse(rawBody) as {
      type?: string;
      data?: { object?: { client_reference_id?: string; metadata?: { out_trade_no?: string }; id?: string } };
    };
    if (json.type !== "checkout.session.completed" && json.type !== "payment_intent.succeeded") continue;
    const obj = json.data?.object;
    const outTradeNo = obj?.client_reference_id || obj?.metadata?.out_trade_no;
    if (!outTradeNo) continue;
    return fulfillByOutTradeNo(outTradeNo, obj?.id);
  }
  return false;
}

export async function paramsFromRequest(request: Request): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  const url = new URL(request.url);
  url.searchParams.forEach((value, key) => {
    out[key] = value;
  });
  if (request.method === "POST") {
    const contentType = request.headers.get("content-type") ?? "";
    if (contentType.includes("json")) {
      const json = (await request.json()) as Record<string, unknown>;
      for (const [key, value] of Object.entries(json)) out[key] = String(value ?? "");
    } else {
      const text = await request.text();
      new URLSearchParams(text).forEach((value, key) => {
        out[key] = value;
      });
    }
  }
  return out;
}
