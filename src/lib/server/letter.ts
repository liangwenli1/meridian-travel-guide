import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { requireAdmin } from "@/lib/server/ops";

export type LetterSubscriber = {
  id: string;
  email: string;
  locale: string;
  citySlug: string | null;
  source: string;
  status: string;
  createdAt: string;
};

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export const subscribeLetter = createServerFn({ method: "POST" })
  .validator((input: { email: string; locale?: string; citySlug?: string | null }) => ({
    email: String(input.email ?? ""),
    locale: String(input.locale ?? "en").slice(0, 8) === "zh" ? "zh" : "en",
    citySlug: input.citySlug ? String(input.citySlug).slice(0, 80) : null,
  }))
  .handler(async ({ data }): Promise<{ ok: true } | { ok: false; error: string }> => {
    const email = normalizeEmail(data.email);
    if (!email.includes("@") || email.length < 5) return { ok: false, error: "invalid" };

    const sql = await getSql();
    const id = crypto.randomUUID();
    await sql.query(
      `insert into letter_subscribers (id, email, locale, city_slug, source, status)
       values ($1, $2, $3, $4, 'letter-form', 'active')
       on conflict (email) do update set
         locale = excluded.locale,
         city_slug = coalesce(excluded.city_slug, letter_subscribers.city_slug),
         source = excluded.source,
         status = 'active'`,
      [id, email, data.locale, data.citySlug],
    );

    try {
      const { recordIntentData } = await import("./catalog.server");
      await recordIntentData("letter", data.citySlug);
    } catch {
      /* intent is best-effort */
    }

    return { ok: true };
  });

export const listLetterSubscribers = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<LetterSubscriber[]> => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const rows = await sql.query<{
      id: string;
      email: string;
      locale: string;
      city_slug: string | null;
      source: string;
      status: string;
      created_at: string;
    }>(
      `select id, email, locale, city_slug, source, status, created_at::text as created_at
         from letter_subscribers
         order by created_at desc
         limit 500`,
    );
    return rows.map((row) => ({
      id: row.id,
      email: row.email,
      locale: row.locale,
      citySlug: row.city_slug,
      source: row.source,
      status: row.status,
      createdAt: row.created_at,
    }));
  });
