import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { dispatches as seedDispatches, type Dispatch, type DispatchTier } from "@/data/dispatches";
import { GUIDE_NAV } from "@/lib/guide-nav";
import { requireAdmin } from "@/lib/server/ops";

export type ChapterEdit = {
  citySlug: string;
  chapter: string;
  locale: string;
  markdown: string;
  updatedAt: string;
};

function loc(value: unknown): { en: string; zh: string } {
  if (value && typeof value === "object") {
    const rec = value as Record<string, unknown>;
    return { en: String(rec.en ?? ""), zh: String(rec.zh ?? rec.en ?? "") };
  }
  return { en: String(value ?? ""), zh: String(value ?? "") };
}

function mapDispatch(row: {
  slug: string;
  date: string;
  kicker: unknown;
  title: unknown;
  dek: unknown;
  body: unknown;
  tier: string;
}): Dispatch {
  return {
    slug: row.slug,
    date: String(row.date).slice(0, 10),
    kicker: loc(row.kicker),
    title: loc(row.title),
    dek: loc(row.dek),
    body: loc(row.body),
    tier: row.tier === "pass-briefing" ? "pass-briefing" : "letter-free",
  };
}

async function ensureDispatchSeed() {
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const count = await sql.query<{ n: string }>(`select count(*)::text as n from dispatches`);
  if (Number(count[0]?.n ?? 0) > 0) return;
  for (const item of seedDispatches) {
    await sql.query(
      `insert into dispatches (slug, date, kicker, title, dek, body, tier)
       values ($1, $2, $3::jsonb, $4::jsonb, $5::jsonb, $6::jsonb, $7)
       on conflict (slug) do nothing`,
      [
        item.slug,
        item.date,
        JSON.stringify(item.kicker),
        JSON.stringify(item.title),
        JSON.stringify(item.dek),
        JSON.stringify(item.body),
        item.tier,
      ],
    );
  }
}

export const listLiveDispatches = createServerFn({ method: "GET" }).handler(async (): Promise<Dispatch[]> => {
  try {
    await ensureDispatchSeed();
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql.query<{
      slug: string;
      date: string;
      kicker: unknown;
      title: unknown;
      dek: unknown;
      body: unknown;
      tier: string;
    }>(`select slug, date::text as date, kicker, title, dek, body, tier from dispatches order by date desc`);
    return rows.map(mapDispatch);
  } catch {
    return seedDispatches;
  }
});

export const getLiveDispatch = createServerFn({ method: "GET" })
  .validator((input: { slug: string }) => ({ slug: String(input.slug) }))
  .handler(async ({ data }): Promise<Dispatch | null> => {
    try {
      await ensureDispatchSeed();
      const { getSql } = await import("@/lib/db");
      const sql = await getSql();
      const rows = await sql.query<{
        slug: string;
        date: string;
        kicker: unknown;
        title: unknown;
        dek: unknown;
        body: unknown;
        tier: string;
      }>(
        `select slug, date::text as date, kicker, title, dek, body, tier from dispatches where slug = $1`,
        [data.slug],
      );
      return rows[0] ? mapDispatch(rows[0]) : seedDispatches.find((item) => item.slug === data.slug) ?? null;
    } catch {
      return seedDispatches.find((item) => item.slug === data.slug) ?? null;
    }
  });

export const saveDispatch = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: Dispatch) => ({
    slug: String(input.slug).trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").slice(0, 80),
    date: String(input.date).slice(0, 10),
    kicker: { en: String(input.kicker?.en ?? ""), zh: String(input.kicker?.zh ?? "") },
    title: { en: String(input.title?.en ?? ""), zh: String(input.title?.zh ?? "") },
    dek: { en: String(input.dek?.en ?? ""), zh: String(input.dek?.zh ?? "") },
    body: { en: String(input.body?.en ?? ""), zh: String(input.body?.zh ?? "") },
    tier: (input.tier === "pass-briefing" ? "pass-briefing" : "letter-free") as DispatchTier,
  }))
  .handler(async ({ data, context }) => {
    await requireAdmin(context.userId);
    if (!data.slug || !data.title.en) throw new Error("invalid");
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await sql.query(
      `insert into dispatches (slug, date, kicker, title, dek, body, tier, updated_at)
       values ($1, $2, $3::jsonb, $4::jsonb, $5::jsonb, $6::jsonb, $7, now())
       on conflict (slug) do update set
         date = excluded.date,
         kicker = excluded.kicker,
         title = excluded.title,
         dek = excluded.dek,
         body = excluded.body,
         tier = excluded.tier,
         updated_at = now()`,
      [
        data.slug,
        data.date,
        JSON.stringify(data.kicker),
        JSON.stringify(data.title),
        JSON.stringify(data.dek),
        JSON.stringify(data.body),
        data.tier,
      ],
    );
    return data;
  });

export const deleteDispatch = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { slug: string }) => ({ slug: String(input.slug) }))
  .handler(async ({ data, context }) => {
    await requireAdmin(context.userId);
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await sql.query(`delete from dispatches where slug = $1`, [data.slug]);
    return { ok: true };
  });

export const listChapterEdits = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<ChapterEdit[]> => {
    await requireAdmin(context.userId);
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql.query<{
      city_slug: string;
      chapter: string;
      locale: string;
      markdown: string;
      updated_at: string;
    }>(
      `select city_slug, chapter, locale, markdown, updated_at::text as updated_at
       from guide_chapter_edits order by updated_at desc`,
    );
    return rows.map((row) => ({
      citySlug: row.city_slug,
      chapter: row.chapter,
      locale: row.locale,
      markdown: row.markdown,
      updatedAt: row.updated_at,
    }));
  });

export const saveChapterEdit = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { citySlug: string; chapter: string; locale: string; markdown: string }) => ({
    citySlug: String(input.citySlug).slice(0, 80),
    chapter: GUIDE_NAV.some((item) => item.id === input.chapter) ? String(input.chapter) : "overview",
    locale: input.locale === "zh" ? "zh" : "en",
    markdown: String(input.markdown ?? "").slice(0, 20000),
  }))
  .handler(async ({ data, context }) => {
    await requireAdmin(context.userId);
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await sql.query(
      `insert into guide_chapter_edits (city_slug, chapter, locale, markdown, updated_at)
       values ($1, $2, $3, $4, now())
       on conflict (city_slug, chapter, locale) do update set
         markdown = excluded.markdown, updated_at = now()`,
      [data.citySlug, data.chapter, data.locale, data.markdown],
    );
    return data;
  });

export const getChapterNotes = createServerFn({ method: "GET" })
  .validator((input: { citySlug: string }) => ({ citySlug: String(input.citySlug) }))
  .handler(async ({ data }): Promise<ChapterEdit[]> => {
    try {
      const { getSql } = await import("@/lib/db");
      const sql = await getSql();
      const rows = await sql.query<{
        city_slug: string;
        chapter: string;
        locale: string;
        markdown: string;
        updated_at: string;
      }>(
        `select city_slug, chapter, locale, markdown, updated_at::text as updated_at
         from guide_chapter_edits where city_slug = $1`,
        [data.citySlug],
      );
      return rows.map((row) => ({
        citySlug: row.city_slug,
        chapter: row.chapter,
        locale: row.locale,
        markdown: row.markdown,
        updatedAt: row.updated_at,
      }));
    } catch {
      return [];
    }
  });
