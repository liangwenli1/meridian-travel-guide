import { tokyoGuide } from "@/data/guides/tokyo";
import { briefing202609 } from "@/data/pass/briefings/2026-09";
import { kyotoNeighborhoodPreview } from "@/data/pass/neighborhood-previews/kyoto";
import { taipeiNeighborhoodPreview } from "@/data/pass/neighborhood-previews/taipei";
import { tokyoOffseasonTables } from "@/data/pass/offseason-tables/tokyo";
import type {
  MonthlyBriefing,
  NeighborhoodPreview,
  OffseasonTable,
  PassLockerItem,
} from "@/types/pass";

export function listOffseasonTables(): OffseasonTable[] {
  return [...tokyoOffseasonTables];
}

export function listNeighborhoodPreviews(): NeighborhoodPreview[] {
  return [kyotoNeighborhoodPreview, taipeiNeighborhoodPreview];
}

export function listBriefings(): MonthlyBriefing[] {
  return [briefing202609];
}

/** Render the Tokyo 3-day itinerary as clean Markdown (no PDF). */
export function getTokyoItineraryMarkdown(): string {
  const plan =
    tokyoGuide.itineraries.find((item) => item.days === 3) ?? tokyoGuide.itineraries[0];
  if (!plan) {
    return "# Tokyo itinerary\n\nNo itinerary available.\n";
  }

  const lines: string[] = [
    `# ${plan.title}`,
    "",
    `_${plan.days} day · ${plan.pace}_`,
    "",
    plan.summary,
    "",
  ];

  for (const day of plan.daysPlan) {
    lines.push(`## ${day.label} — ${day.theme}`, "");
    for (const stop of day.stops) {
      lines.push(`- **${stop.time} — ${stop.title}:** ${stop.detail}`);
    }
    lines.push("", `*If it rains:* ${day.rainPlan}`, "");
  }

  lines.push("---", "", `_Source: Meridian Field Pass · ${tokyoGuide.citySlug}_`, "");
  return lines.join("\n");
}

export function buildPassLockerItems(): PassLockerItem[] {
  const items: PassLockerItem[] = [
    {
      kind: "itinerary",
      id: "tokyo-3-day",
      citySlug: "tokyo",
      title: {
        en: "Tokyo 3-day itinerary (Markdown)",
        zh: "东京三日行程（Markdown）",
      },
      summary: {
        en: "Day-by-day west / east / food plan from the public guide, downloadable as .md.",
        zh: "公开指南里的西城 / 东城 / 食物三日骨架，可下载为 .md。",
      },
      downloadable: true,
    },
  ];

  for (const table of listOffseasonTables()) {
    items.push({
      kind: "offseason-table",
      id: `${table.citySlug}-${table.name.en.slice(0, 24).replace(/\s+/g, "-").toLowerCase()}`,
      citySlug: table.citySlug,
      title: table.name,
      summary: table.why,
    });
  }

  for (const preview of listNeighborhoodPreviews()) {
    items.push({
      kind: "neighborhood-preview",
      id: `${preview.citySlug}-preview`,
      citySlug: preview.citySlug,
      title: preview.title,
      summary: {
        en: preview.body.en.slice(0, 160) + (preview.body.en.length > 160 ? "…" : ""),
        zh: preview.body.zh.slice(0, 80) + (preview.body.zh.length > 80 ? "…" : ""),
      },
    });
  }

  for (const briefing of listBriefings()) {
    items.push({
      kind: "briefing",
      id: briefing.id,
      citySlug: briefing.citySlug,
      title: briefing.title,
      summary: briefing.dek,
    });
  }

  return items;
}
