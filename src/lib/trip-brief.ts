import { getTripSpec, type Party, type TripCitySpec } from "@/data/pass/trip-briefs";
import type { Localized } from "@/types/pass";
import type { Locale } from "@/lib/i18n";

export type BookingStatus = "ok" | "this-week" | "late";

export type BuiltBrief = {
  citySlug: string;
  arrive: string;
  nights: number;
  party: Party;
  daysUntil: number;
  weekdays: number[];
  bookings: { name: Localized; leadDays: number; skipIfLate: Localized; status: BookingStatus }[];
  closures: { weekday: number; date: string; places: Localized }[];
  stayYes: TripCitySpec["stayYes"];
  stayNo: TripCitySpec["stayNo"];
  waste: Localized[];
  wallet: Localized[];
  arrival: Localized[];
  season: Localized | null;
  partyNote: Localized;
  skipPass: Localized;
  lateCount: number;
};

const WEEKDAY = {
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  zh: ["日", "一", "二", "三", "四", "五", "六"],
} as const;

export function weekdayLabel(day: number, locale: Locale): string {
  return WEEKDAY[locale][day] ?? String(day);
}

export function loc(value: Localized, locale: Locale): string {
  return value[locale];
}

function parseYmd(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function ymd(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export function defaultArriveDate(from = new Date()): string {
  const date = startOfUtcDay(from);
  date.setUTCDate(date.getUTCDate() + 21);
  return ymd(date);
}

export function buildTripBrief(opts: {
  citySlug: string;
  arrive: string;
  nights: number;
  party: Party;
  now?: Date;
}): BuiltBrief | null {
  const spec = getTripSpec(opts.citySlug);
  const arrive = parseYmd(opts.arrive);
  if (!spec || !arrive) return null;
  const nights = Math.min(10, Math.max(1, Math.round(opts.nights) || 3));
  const now = startOfUtcDay(opts.now ?? new Date());
  const daysUntil = Math.round((arrive.getTime() - now.getTime()) / 86400000);
  const weekdays: number[] = [];
  const closures: BuiltBrief["closures"] = [];
  for (let i = 0; i < nights; i += 1) {
    const day = new Date(arrive);
    day.setUTCDate(arrive.getUTCDate() + i);
    const weekday = day.getUTCDay();
    weekdays.push(weekday);
    for (const closed of spec.closed) {
      if (closed.weekday === weekday) {
        closures.push({ weekday, date: ymd(day), places: closed.places });
      }
    }
  }
  const bookings = spec.bookNow.map((item) => {
    let status: BookingStatus = "ok";
    if (daysUntil < item.leadDays) status = "late";
    else if (daysUntil < item.leadDays + 7) status = "this-week";
    return { ...item, status };
  });
  const month = arrive.getUTCMonth() + 1;
  const season = spec.season.find((row) => row.months.includes(month))?.note ?? null;
  return {
    citySlug: spec.citySlug,
    arrive: opts.arrive,
    nights,
    party: opts.party,
    daysUntil,
    weekdays,
    bookings,
    closures,
    stayYes: spec.stayYes,
    stayNo: spec.stayNo,
    waste: spec.waste,
    wallet: spec.wallet,
    arrival: spec.arrival,
    season,
    partyNote: spec.party[opts.party],
    skipPass: spec.skipPass,
    lateCount: bookings.filter((row) => row.status === "late").length,
  };
}

export function briefToMarkdown(brief: BuiltBrief, locale: Locale, cityName: string): string {
  const lines = [
    `# ${cityName} · ${brief.arrive} · ${brief.nights} ${locale === "zh" ? "晚" : "nights"}`,
    "",
    loc(brief.skipPass, locale),
    "",
    locale === "zh" ? "## 现在订" : "## Book now",
    ...brief.bookings.map((row) => {
      const flag = row.status === "late" ? (locale === "zh" ? "已晚" : "late") : row.status === "this-week" ? (locale === "zh" ? "这周订" : "this week") : locale === "zh" ? "还来得及" : "ok";
      return `- **${loc(row.name, locale)}** (${flag}, ${row.leadDays}d) — ${loc(row.skipIfLate, locale)}`;
    }),
    "",
    locale === "zh" ? "## 这几天谁关门" : "## Closed while you are there",
    brief.closures.length
      ? brief.closures.map((row) => `- ${row.date} ${weekdayLabel(row.weekday, locale)} — ${loc(row.places, locale)}`).join("\n")
      : locale === "zh"
        ? "- 没有写进日历的固定闭馆。仍要核对你围着转的那一座。"
        : "- No fixed closures on your weekdays. Still check the one room you built a morning around.",
    "",
    locale === "zh" ? "## 住" : "## Stay",
    ...brief.stayYes.map((row) => `- ${loc(row.name, locale)} — ${loc(row.who, locale)}`),
    `- ${locale === "zh" ? "不要" : "Not"}: ${loc(brief.stayNo.name, locale)} — ${loc(brief.stayNo.why, locale)}`,
    "",
    locale === "zh" ? "## 不要把钱交给这些" : "## Do not pay for these",
    ...brief.waste.map((row) => `- ${loc(row, locale)}`),
    "",
    locale === "zh" ? "## 钱包" : "## Wallet",
    ...brief.wallet.map((row) => `- ${loc(row, locale)}`),
    "",
    locale === "zh" ? "## 落地" : "## Arrival",
    ...brief.arrival.map((row) => `- ${loc(row, locale)}`),
    "",
    locale === "zh" ? "## 同行" : "## Party",
    loc(brief.partyNote, locale),
  ];
  if (brief.season) {
    lines.splice(3, 0, loc(brief.season, locale), "");
  }
  return lines.join("\n");
}
