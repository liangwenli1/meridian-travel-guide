import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";

export type SmtpSettings = {
  enabled: boolean;
  host: string;
  port: number;
  username: string;
  password: string;
  fromName: string;
  fromEmail: string;
  secure: boolean;
};

export type SmtpPublic = Omit<SmtpSettings, "password"> & { hasPassword: boolean };

export type SiteSettings = {
  origin: string;
};

export type PaymentSettings = {
  enabled: boolean;
  productPrefix: string;
  productSuffix: string;
  minAmount: string;
  maxAmount: string;
  dailyLimit: string;
  orderTimeoutMin: number;
  maxPending: number;
  alipayEnabled: boolean;
  alipaySource: "easypay" | "official" | "";
  wechatEnabled: boolean;
  wechatSource: "easypay" | "official" | "";
  stripeEnabled: boolean;
  priceCny: string;
  priceUsd: string;
  helpText: string;
};

export type AdminState = {
  isAdmin: boolean;
  canClaim: boolean;
};

const DEFAULT_SMTP: SmtpSettings = {
  enabled: false,
  host: "",
  port: 465,
  username: "",
  password: "",
  fromName: "Meridian",
  fromEmail: "",
  secure: true,
};

const DEFAULT_SITE: SiteSettings = { origin: "" };

export const DEFAULT_PAYMENT: PaymentSettings = {
  enabled: false,
  productPrefix: "Meridian Field Pass",
  productSuffix: "",
  minAmount: "1",
  maxAmount: "9999",
  dailyLimit: "",
  orderTimeoutMin: 30,
  maxPending: 3,
  alipayEnabled: true,
  alipaySource: "easypay",
  wechatEnabled: true,
  wechatSource: "easypay",
  stripeEnabled: false,
  priceCny: "199.00",
  priceUsd: "49.00",
  helpText: "",
};

export async function readSetting<T>(key: string, fallback: T): Promise<T> {
  const sql = await getSql();
  const rows = await sql.query<{ value: T }>("select value from site_settings where key = $1", [key]);
  const value = rows[0]?.value;
  if (!value || typeof value !== "object") return fallback;
  return { ...fallback, ...value };
}

export async function writeSetting(key: string, value: unknown): Promise<void> {
  const sql = await getSql();
  const payload = JSON.stringify(value);
  await sql.query(
    `insert into site_settings (key, value, updated_at)
     values ($1, $2::jsonb, now())
     on conflict (key) do update set value = excluded.value, updated_at = now()`,
    [key, payload],
  );
}

export async function readSmtp(): Promise<SmtpSettings> {
  return readSetting("smtp", DEFAULT_SMTP);
}

export async function readSite(): Promise<SiteSettings> {
  return readSetting("site", DEFAULT_SITE);
}

export async function readPayment(): Promise<PaymentSettings> {
  return readSetting("payment", DEFAULT_PAYMENT);
}

export async function publicOrigin(fallback = ""): Promise<string> {
  const site = await readSite();
  if (site.origin.trim()) return site.origin.replace(/\/$/, "");
  try {
    const { getRequest } = await import("@tanstack/react-start/server");
    const request = getRequest();
    if (!request) return fallback;
    const url = new URL(request.url);
    const proto = request.headers.get("x-forwarded-proto") ?? url.protocol.replace(":", "");
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? url.host;
    return `${proto}://${host}`;
  } catch {
    return fallback;
  }
}

export async function adminCount(): Promise<number> {
  const sql = await getSql();
  const rows = await sql.query<{ n: number }>("select count(*)::int as n from site_admins");
  return rows[0]?.n ?? 0;
}

export async function isAdminUser(userId: string): Promise<boolean> {
  const sql = await getSql();
  const rows = await sql.query<{ user_id: string }>(
    "select user_id from site_admins where user_id = $1",
    [userId],
  );
  return Boolean(rows[0]);
}

export async function requireAdmin(userId: string): Promise<void> {
  if (await isAdminUser(userId)) return;
  throw new Error("Forbidden");
}

export const getAdminState = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<AdminState> => {
    const isAdmin = await isAdminUser(context.userId);
    const count = await adminCount();
    return { isAdmin, canClaim: !isAdmin && count === 0 };
  });

export const claimAdmin = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<AdminState> => {
    const sql = await getSql();
    const count = await adminCount();
    if (count === 0) {
      await sql.query("insert into site_admins (user_id) values ($1) on conflict do nothing", [
        context.userId,
      ]);
      return { isAdmin: true, canClaim: false };
    }
    const isAdmin = await isAdminUser(context.userId);
    if (!isAdmin) throw new Error("Forbidden");
    return { isAdmin: true, canClaim: false };
  });

export const getSmtpSettings = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<SmtpPublic> => {
    await requireAdmin(context.userId);
    const smtp = await readSmtp();
    const { password, ...rest } = smtp;
    return { ...rest, hasPassword: Boolean(password) };
  });

export const saveSmtpSettings = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: Omit<SmtpSettings, "password"> & { password?: string }) => data)
  .handler(async ({ context, data }): Promise<SmtpPublic> => {
    await requireAdmin(context.userId);
    const current = await readSmtp();
    const next: SmtpSettings = {
      enabled: Boolean(data.enabled),
      host: data.host.trim(),
      port: Number(data.port) || 465,
      username: data.username.trim(),
      password: data.password?.trim() ? data.password.trim() : current.password,
      fromName: data.fromName.trim() || "Meridian",
      fromEmail: data.fromEmail.trim(),
      secure: Boolean(data.secure),
    };
    await writeSetting("smtp", next);
    const { password, ...rest } = next;
    return { ...rest, hasPassword: Boolean(password) };
  });

export const getSiteSettings = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<SiteSettings> => {
    await requireAdmin(context.userId);
    const site = await readSite();
    if (site.origin) return site;
    return { origin: await publicOrigin() };
  });

export const saveSiteSettings = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: SiteSettings) => data)
  .handler(async ({ context, data }): Promise<SiteSettings> => {
    await requireAdmin(context.userId);
    const next = { origin: data.origin.trim().replace(/\/$/, "") };
    await writeSetting("site", next);
    return next;
  });

export const getPaymentSettings = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<PaymentSettings> => {
    await requireAdmin(context.userId);
    return readPayment();
  });

export const savePaymentSettings = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: PaymentSettings) => data)
  .handler(async ({ context, data }): Promise<PaymentSettings> => {
    await requireAdmin(context.userId);
    const next: PaymentSettings = {
      ...DEFAULT_PAYMENT,
      ...data,
      productPrefix: data.productPrefix.trim() || DEFAULT_PAYMENT.productPrefix,
      productSuffix: data.productSuffix.trim(),
      helpText: data.helpText,
      orderTimeoutMin: Math.max(1, Number(data.orderTimeoutMin) || 30),
      maxPending: Math.max(1, Number(data.maxPending) || 3),
    };
    await writeSetting("payment", next);
    return next;
  });
