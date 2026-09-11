import type { Membership } from "@/lib/server/membership";

/**
 * True when the membership row is usable for Field Pass locker assets.
 * Mirrors the account / pass page check: status === "active".
 * If expiresAt is set and already past, treat as inactive.
 */
export function isActivePass(membership: Membership | null | undefined): boolean {
  if (!membership || membership.status !== "active") return false;
  if (membership.expiresAt) {
    const expires = Date.parse(membership.expiresAt);
    if (!Number.isNaN(expires) && expires < Date.now()) return false;
  }
  return true;
}

export async function requireActivePass(userId: string): Promise<Membership> {
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const rows = await sql.query<{
    plan: string;
    status: string;
    started_at: string;
    expires_at: string | null;
  }>(
    `select plan, status, started_at::text as started_at, expires_at::text as expires_at
     from memberships
     where user_id = $1
     limit 1`,
    [userId],
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
  if (!isActivePass(membership)) {
    const err = new Error("Forbidden: active Field Pass required");
    (err as Error & { status: number }).status = 403;
    throw err;
  }
  return membership!;
}
