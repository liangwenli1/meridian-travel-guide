import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { requireAdmin, publicOrigin } from "@/lib/server/ops";
import { briefing202609 } from "@/data/pass/briefings/2026-09";

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

function token() {
  return crypto.randomUUID().replaceAll("-", "");
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
      `insert into letter_subscribers (id, email, locale, city_slug, source, status, unsub_token)
       values ($1, $2, $3, $4, 'letter-form', 'active', $5)
       on conflict (email) do update set
         locale = excluded.locale,
         city_slug = coalesce(excluded.city_slug, letter_subscribers.city_slug),
         source = excluded.source,
         status = 'active'`,
      [id, email, data.locale, data.citySlug, token()],
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

export const sendLetterIssue = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { testOnly?: boolean }) => ({ testOnly: Boolean(input?.testOnly) }))
  .handler(async ({ context, data }): Promise<{ sent: number; failed: number; error?: string }> => {
    await requireAdmin(context.userId);
    const { sendLetter, letterHtml } = await import("./mail");
    const sql = await getSql();
    const origin = await publicOrigin();
    const rows = data.testOnly
      ? await sql.query<{ email: string; locale: string; unsub_token: string | null }>(
          `select u.email, 'en'::text as locale, null::text as unsub_token
             from "user" u where u.id = $1 limit 1`,
          [context.userId],
        )
      : await sql.query<{ email: string; locale: string; unsub_token: string | null }>(
          `select email, locale, unsub_token from letter_subscribers
            where status = 'active' order by created_at asc limit 200`,
        );
    if (!rows.length) return { sent: 0, failed: 0, error: "empty" };

    let sent = 0;
    let failed = 0;
    for (const row of rows) {
      const locale = row.locale === "zh" ? "zh" : "en";
      const title = briefing202609.title[locale];
      const dek = briefing202609.dek[locale];
      const unsub = row.unsub_token
        ? `${origin}/letter/unsubscribe?token=${row.unsub_token}`
        : origin;
      const html = letterHtml({
        title,
        body: `${dek}\n\n${briefing202609.body[locale].slice(0, 900)}…`,
        href: `${origin}/desk`,
        cta: locale === "zh" ? "读完整篇" : "Read the desk",
      });
      const result = await sendLetter({
        to: row.email,
        subject: title,
        html,
        text: `${title}\n\n${dek}\n\n${unsub}`,
      });
      if (result.ok) sent += 1;
      else failed += 1;
      if (failed && !sent && result.ok === false) {
        return { sent, failed, error: result.error };
      }
    }
    return { sent, failed };
  });

export const unsubscribeLetter = createServerFn({ method: "POST" })
  .validator((input: { token: string }) => ({ token: String(input.token ?? "").slice(0, 80) }))
  .handler(async ({ data }): Promise<{ ok: boolean }> => {
    if (!data.token) return { ok: false };
    const sql = await getSql();
    const result = await sql.query<{ id: string }>(
      `update letter_subscribers set status = 'unsubscribed' where unsub_token = $1 returning id`,
      [data.token],
    );
    return { ok: result.length > 0 };
  });
