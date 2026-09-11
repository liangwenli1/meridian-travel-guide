import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { requireAdmin } from "@/lib/server/ops";
import type { Membership } from "@/lib/server/membership";
import type { OrderRecord } from "@/lib/server/payment/types";

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
  passExpires: string | null;
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

export const listMembers = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<MemberRow[]> => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const rows = await sql.query<{
      id: string;
      name: string;
      email: string;
      emailVerified: boolean;
      createdAt: string;
      pass_status: string | null;
      pass_expires: string | null;
    }>(
      `select u.id, u.name, u.email, u."emailVerified" as "emailVerified",
              u."createdAt"::text as "createdAt",
              m.status as pass_status,
              m.expires_at::text as pass_expires
         from "user" u
         left join memberships m on m.user_id = u.id
         order by u."createdAt" desc
         limit 120`,
    );
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      verified: row.emailVerified,
      createdAt: row.createdAt,
      passStatus: row.pass_status,
      passExpires: row.pass_expires,
    }));
  });
