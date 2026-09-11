import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { buildPassLockerItems, getTokyoItineraryMarkdown } from "@/data/pass";
import { isActivePass, requireActivePass } from "@/lib/pass/access";
import type { Membership } from "@/lib/server/membership";
import type { PassLockerItem } from "@/types/pass";

export type PassLockerResult = {
  active: boolean;
  items: PassLockerItem[];
};

async function loadMembership(userId: string): Promise<Membership | null> {
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
  if (!row) return null;
  return {
    plan: row.plan,
    status: row.status,
    startedAt: row.started_at,
    expiresAt: row.expires_at,
  };
}

export const getPassLocker = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<PassLockerResult> => {
    const membership = await loadMembership(context.userId);
    if (!isActivePass(membership)) {
      return { active: false, items: [] };
    }
    return { active: true, items: buildPassLockerItems() };
  });

export const downloadPassItinerary = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<{ filename: string; markdown: string }> => {
    await requireActivePass(context.userId);
    return {
      filename: "tokyo-3-day-itinerary.md",
      markdown: getTokyoItineraryMarkdown(),
    };
  });
