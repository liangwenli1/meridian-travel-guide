import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";

export type Membership = {
  plan: string;
  status: string;
  startedAt: string;
  expiresAt: string | null;
};

type MembershipRow = {
  plan: string;
  status: string;
  started_at: string;
  expires_at: string | null;
};

function toMembership(row: MembershipRow): Membership {
  return {
    plan: row.plan,
    status: row.status,
    startedAt: String(row.started_at),
    expiresAt: row.expires_at == null ? null : String(row.expires_at),
  };
}

const MEMBERSHIP_SELECT = `
  select plan, status, started_at::text as started_at, expires_at::text as expires_at
  from memberships
  where user_id = $1
  limit 1
`;

export const getMembership = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<Membership | null> => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql.query<MembershipRow>(MEMBERSHIP_SELECT, [context.userId]);
    const row = rows[0];
    return row ? toMembership(row) : null;
  });
