import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { requireAdmin } from "@/lib/server/ops";
import type { Membership } from "@/lib/server/membership";
import type { OrderRecord, OrderStatus } from "@/lib/server/payment/types";

export type OpsOverview = {
  users: number;
  passes: number;
  pendingOrders: number;
  paidOrders: number;
  smtpOn: boolean;
  payOn: boolean;
};

export type MemberRow = {
  id: string;
  name: string;
  email: string;
  verified: boolean;
  createdAt: string;
  passStatus: string | null;
  passPlan: string | null;
  passExpires: string | null;
  isAdmin: boolean;
  orderCount: number;
};

export type PassRow = {
  userId: string;
  name: string;
  email: string;
  plan: string;
  status: string;
  startedAt: string;
  expiresAt: string | null;
};

export type OpsOrder = OrderRecord & {
  email: string;
  name: string;
};

export type TravelerDesk = {
  membership: Membership | null;
  orders: OrderRecord[];
};

export const getTravelerDesk = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<TravelerDesk> => {
    const sql = await getSql();
    const rows = await sql.query<{
      plan: string;
      status: string;
      started_at: string;
      expires_at: string | null;
    }>(
      `select plan, status, started_at::text as started_at, expires_at::text as expires_at
       from memberships where user_id = $1 limit 1`,
      [context.userId],
    );
    const row = rows[0];
    const membership: Membership | null = row
      ? {
          plan: row.plan,
          status: row.status,
          startedAt: row.started_at,
          expiresAt: row.expires_at,
        }
      : null;
    const { listMyOrders } = await import("@/lib/server/payment/engine");
    const orders = await listMyOrders(context.userId);
    return { membership, orders };
  });

export const getOpsOverview = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<OpsOverview> => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const [users, passes, pending, paid, smtp, pay] = await Promise.all([
      sql.query<{ n: number }>(`select count(*)::int as n from "user"`),
      sql.query<{ n: number }>(
        `select count(*)::int as n from memberships where status = 'active'`,
      ),
      sql.query<{ n: number }>(
        `select count(*)::int as n from payment_orders where status = 'PENDING'`,
      ),
      sql.query<{ n: number }>(
        `select count(*)::int as n from payment_orders where status = 'COMPLETED'`,
      ),
      sql.query<{ value: { enabled?: boolean } }>(
        `select value from site_settings where key = 'smtp'`,
      ),
      sql.query<{ value: { enabled?: boolean } }>(
        `select value from site_settings where key = 'payment'`,
      ),
    ]);
    return {
      users: users[0]?.n ?? 0,
      passes: passes[0]?.n ?? 0,
      pendingOrders: pending[0]?.n ?? 0,
      paidOrders: paid[0]?.n ?? 0,
      smtpOn: Boolean(smtp[0]?.value?.enabled),
      payOn: Boolean(pay[0]?.value?.enabled),
    };
  });

function mapMember(row: {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  pass_status: string | null;
  pass_plan: string | null;
  pass_expires: string | null;
  is_admin: boolean;
  order_count: number;
}): MemberRow {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    verified: row.emailVerified,
    createdAt: row.createdAt,
    passStatus: row.pass_status,
    passPlan: row.pass_plan,
    passExpires: row.pass_expires,
    isAdmin: row.is_admin,
    orderCount: row.order_count,
  };
}

export const listMembers = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input?: { query?: string }) => ({
    query: String(input?.query ?? "").trim().slice(0, 80),
  }))
  .handler(async ({ context, data }): Promise<MemberRow[]> => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const q = data.query ? `%${data.query.toLowerCase()}%` : null;
    const rows = await sql.query<{
      id: string;
      name: string;
      email: string;
      emailVerified: boolean;
      createdAt: string;
      pass_status: string | null;
      pass_plan: string | null;
      pass_expires: string | null;
      is_admin: boolean;
      order_count: number;
    }>(
      `select u.id, u.name, u.email, u."emailVerified" as "emailVerified",
              u."createdAt"::text as "createdAt",
              m.status as pass_status,
              m.plan as pass_plan,
              m.expires_at::text as pass_expires,
              (a.user_id is not null) as is_admin,
              (select count(*)::int from payment_orders o where o.user_id = u.id) as order_count
         from "user" u
         left join memberships m on m.user_id = u.id
         left join site_admins a on a.user_id = u.id
        where ($1::text is null
               or lower(u.email) like $1
               or lower(coalesce(u.name, '')) like $1)
        order by u."createdAt" desc
        limit 200`,
      [q],
    );
    return rows.map(mapMember);
  });

export const listPasses = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input?: { status?: string }) => ({
    status: String(input?.status ?? "all"),
  }))
  .handler(async ({ context, data }): Promise<PassRow[]> => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const status = data.status === "active" || data.status === "cancelled" ? data.status : null;
    const rows = await sql.query<{
      user_id: string;
      name: string;
      email: string;
      plan: string;
      status: string;
      started_at: string;
      expires_at: string | null;
    }>(
      `select m.user_id, u.name, u.email, m.plan, m.status,
              m.started_at::text as started_at, m.expires_at::text as expires_at
         from memberships m
         join "user" u on u.id = m.user_id
        where ($1::text is null or m.status = $1)
        order by m.started_at desc
        limit 200`,
      [status],
    );
    return rows.map((row) => ({
      userId: row.user_id,
      name: row.name,
      email: row.email,
      plan: row.plan,
      status: row.status,
      startedAt: row.started_at,
      expiresAt: row.expires_at,
    }));
  });

export const setPass = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { userId: string; action: string; plan?: string; days?: number }) => ({
    userId: String(input.userId),
    action: String(input.action),
    plan: input.plan === "max" ? "max" : "pro",
    days: Math.min(3650, Math.max(1, Number(input.days) || 365)),
  }))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    if (data.action === "revoke") {
      await sql.query(
        `update memberships set status = 'cancelled' where user_id = $1`,
        [data.userId],
      );
      return { ok: true };
    }
    if (data.action === "extend") {
      await sql.query(
        `update memberships
            set status = 'active',
                expires_at = case
                  when expires_at is not null and expires_at > now()
                    then expires_at + ($2 || ' days')::interval
                  else now() + ($2 || ' days')::interval
                end
          where user_id = $1`,
        [data.userId, String(data.days)],
      );
      return { ok: true };
    }
    await sql.query(
      `insert into memberships (user_id, plan, status, started_at, expires_at)
       values ($1, $2, 'active', now(), now() + ($3 || ' days')::interval)
       on conflict (user_id) do update set
         plan = excluded.plan,
         status = 'active',
         expires_at = now() + ($3 || ' days')::interval`,
      [data.userId, data.plan, String(data.days)],
    );
    return { ok: true };
  });

export const listOpsOrders = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input?: { status?: string; query?: string }) => ({
    status: String(input?.status ?? "all"),
    query: String(input?.query ?? "").trim().slice(0, 80),
  }))
  .handler(async ({ context, data }): Promise<OpsOrder[]> => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const status =
      data.status === "PENDING" ||
      data.status === "COMPLETED" ||
      data.status === "CANCELLED" ||
      data.status === "FAILED" ||
      data.status === "EXPIRED"
        ? data.status
        : null;
    const q = data.query ? `%${data.query.toLowerCase()}%` : null;
    const rows = await sql.query<{
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
      email: string;
      name: string;
    }>(
      `select o.id, o.user_id, o.provider_id, o.provider_type, o.method, o.out_trade_no, o.trade_no,
              o.amount::text as amount, o.currency, o.product, o.status, o.pay_url, o.qr_code, o.url_scheme,
              o.paid_at::text as paid_at, o.expires_at::text as expires_at, o.created_at::text as created_at,
              coalesce(u.email, '') as email, coalesce(u.name, '') as name
         from payment_orders o
         left join "user" u on u.id = o.user_id
        where ($1::text is null or o.status = $1)
          and ($2::text is null
               or lower(o.out_trade_no) like $2
               or lower(coalesce(u.email, '')) like $2)
        order by o.created_at desc
        limit 200`,
      [status, q],
    );
    return rows.map((row) => ({
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
      email: row.email,
      name: row.name,
    }));
  });

export const cancelOpsOrder = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { outTradeNo: string; refund?: boolean }) => ({
    outTradeNo: String(input.outTradeNo),
    refund: Boolean(input.refund),
  }))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    if (data.refund) {
      await sql.query(
        `update payment_orders set status = 'CANCELLED'
          where out_trade_no = $1 and status = 'COMPLETED'`,
        [data.outTradeNo],
      );
    } else {
      await sql.query(
        `update payment_orders set status = 'CANCELLED'
          where out_trade_no = $1 and status = 'PENDING'`,
        [data.outTradeNo],
      );
    }
    return { ok: true };
  });
