import type { CityGuide } from "@/types/guide";
import { bangkokGuide } from "./bangkok";
import { parisGuide } from "./paris";
import { singaporeGuide } from "./singapore";
import { tokyoGuide } from "./tokyo";

const guides: Record<string, CityGuide> = {
  tokyo: tokyoGuide,
  paris: parisGuide,
  bangkok: bangkokGuide,
  singapore: singaporeGuide,
};

export function getGuide(citySlug: string) {
  return guides[citySlug];
}
