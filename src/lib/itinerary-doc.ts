import { getGuide } from "@/data/guides";
import type { CityGuide, Itinerary } from "@/types/guide";

export function pickItinerary(guide: CityGuide, days = 3): Itinerary | null {
  return guide.itineraries.find((item) => item.days === days) ?? guide.itineraries[0] ?? null;
}

export function itineraryMarkdown(guide: CityGuide, days = 3): string {
  const plan = pickItinerary(guide, days);
  if (!plan) return `# ${guide.title}\n\nNo itinerary available.\n`;

  const lines: string[] = [
    `# ${plan.title}`,
    "",
    `_${guide.title} · ${plan.days} day · ${plan.pace}_`,
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

  lines.push("---", "", `_Meridian Field Pass · ${guide.citySlug}_`, "");
  return lines.join("\n");
}

export function itineraryForCity(citySlug: string, days = 3) {
  const guide = getGuide(citySlug);
  if (!guide) return null;
  return {
    guide,
    plan: pickItinerary(guide, days),
    markdown: itineraryMarkdown(guide, days),
    filename: `${citySlug}-${days}-day-itinerary.md`,
  };
}
