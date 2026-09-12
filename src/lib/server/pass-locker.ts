import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { buildPassLockerItems, getItineraryMarkdown } from "@/data/pass";
import { isActivePass, hasMaxPass, requireMaxPass } from "@/lib/pass/access";
import type { Membership } from "@/lib/server/membership";
import type { PassLockerItem } from "@/types/pass";

export type PassLockerResult = {
  active: boolean;
  plan: "free" | "pro" | "max";
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
      return { active: false, plan: "free", items: [] };
    }
    const max = hasMaxPass(membership);
    const items = buildPassLockerItems()
      .filter((item) => max || item.kind !== "neighborhood-preview")
      .map((item) => (max ? item : { ...item, downloadable: false }));
    return { active: true, plan: max ? "max" : "pro", items };
  });

export const downloadPassItinerary = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input?: { citySlug?: string }) => ({
    citySlug: String(input?.citySlug ?? "tokyo").slice(0, 80),
  }))
  .handler(async ({ context, data }): Promise<{ filename: string; markdown: string }> => {
    await requireMaxPass(context.userId);
    const slug = data.citySlug || "tokyo";
    return {
      filename: `${slug}-3-day-itinerary.md`,
      markdown: getItineraryMarkdown(slug),
    };
  });
