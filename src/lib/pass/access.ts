import type { Membership } from "@/lib/server/membership";

export type PaidPlan = "pro" | "max";

export function planTier(plan: string | undefined | null): 0 | 1 | 2 {
  if (plan === "max") return 2;
  if (plan === "pro" || plan === "field-pass") return 1;
  return 0;
}

export function normalizePlan(plan: string | undefined | null): "free" | PaidPlan {
  const tier = planTier(plan);
  if (tier >= 2) return "max";
  if (tier >= 1) return "pro";
  return "free";
}

/**
 * True when the membership row is a paid, unexpired plan (Pro or Max).
 */
export function isActivePass(membership: Membership | null | undefined): boolean {
  if (!membership || membership.status !== "active") return false;
  if (planTier(membership.plan) < 1) return false;
  if (membership.expiresAt) {
    const expires = Date.parse(membership.expiresAt);
    if (!Number.isNaN(expires) && expires < Date.now()) return false;
  }
  return true;
}

export function hasMaxPass(membership: Membership | null | undefined): boolean {
  return isActivePass(membership) && planTier(membership?.plan) >= 2;
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
