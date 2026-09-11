import { tokyoGuide } from "@/data/guides/tokyo";
import { listGuides } from "@/data/guides";
import { listArrivalCards } from "@/data/pass/arrival-cards";
import { briefing202609 } from "@/data/pass/briefings/2026-09";
import { bangkokNeighborhoodPreview } from "@/data/pass/neighborhood-previews/bangkok";
import { kyotoNeighborhoodPreview } from "@/data/pass/neighborhood-previews/kyoto";
import { taipeiNeighborhoodPreview } from "@/data/pass/neighborhood-previews/taipei";
import { parisOffseasonTables } from "@/data/pass/offseason-tables/paris";
import { tokyoOffseasonTables } from "@/data/pass/offseason-tables/tokyo";
import { itineraryMarkdown } from "@/lib/itinerary-doc";
import type {
  MonthlyBriefing,
  NeighborhoodPreview,
  OffseasonTable,
  PassLockerItem,
} from "@/types/pass";

export function listOffseasonTables(): OffseasonTable[] {
  return [...tokyoOffseasonTables, ...parisOffseasonTables];
}

export function listNeighborhoodPreviews(): NeighborhoodPreview[] {
  return [kyotoNeighborhoodPreview, taipeiNeighborhoodPreview, bangkokNeighborhoodPreview];
}

export function listBriefings(): MonthlyBriefing[] {
  return [briefing202609];
}

/** Render a city itinerary as Markdown. */
export function getItineraryMarkdown(citySlug = "tokyo"): string {
  const guide = listGuides().find((item) => item.citySlug === citySlug) ?? tokyoGuide;
  return itineraryMarkdown(guide, 3);
}

/** @deprecated use getItineraryMarkdown */
export function getTokyoItineraryMarkdown(): string {
  return getItineraryMarkdown("tokyo");
}

export function buildPassLockerItems(): PassLockerItem[] {
  const items: PassLockerItem[] = [];

  for (const guide of listGuides()) {
    items.push({
      kind: "itinerary",
      id: `${guide.citySlug}-3-day`,
      citySlug: guide.citySlug,
      title: {
        en: `${guide.title.replace(" Travel Guide", "")} 3-day itinerary`,
        zh: `${guide.zh?.title ?? guide.title} · 三日行程`,
      },
      summary: {
        en: "Day-by-day plan with rain swaps. Download Markdown or print to PDF.",
        zh: "带雨天替换的逐日骨架。可下载 Markdown，或打印为 PDF。",
      },
      downloadable: true,
    });
  }

  for (const card of listArrivalCards()) {
    items.push({
      kind: "arrival-card",
      id: `${card.citySlug}-arrival`,
      citySlug: card.citySlug,
      title: card.title,
      summary: card.minutes,
    });
  }

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
