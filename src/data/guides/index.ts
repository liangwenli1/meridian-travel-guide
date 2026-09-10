import type { CityGuide } from "@/types/guide";
import { bangkokGuide } from "./bangkok";
import { londonGuide } from "./london";
import { newYorkGuide } from "./new-york";
import { parisGuide } from "./paris";
import { romeGuide } from "./rome";
import { seoulGuide } from "./seoul";
import { singaporeGuide } from "./singapore";
import { tokyoGuide } from "./tokyo";

const guides: Record<string, CityGuide> = {
  tokyo: tokyoGuide,
  paris: parisGuide,
  bangkok: bangkokGuide,
  singapore: singaporeGuide,
  "new-york": newYorkGuide,
  london: londonGuide,
  seoul: seoulGuide,
  rome: romeGuide,
};

export function getGuide(citySlug: string) {
  return guides[citySlug];
}
