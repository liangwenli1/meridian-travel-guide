import type { CityGuide } from "@/types/guide";
import { bangkokGuide } from "./bangkok";
import { barcelonaGuide } from "./barcelona";
import { kyotoGuide } from "./kyoto";
import { lisbonGuide } from "./lisbon";
import { londonGuide } from "./london";
import { mexicoCityGuide } from "./mexico-city";
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
  kyoto: kyotoGuide,
  barcelona: barcelonaGuide,
  lisbon: lisbonGuide,
  "mexico-city": mexicoCityGuide,
};

export const PUBLISHED_GUIDE_SLUGS = Object.keys(guides);

export function getGuide(citySlug: string) {
  return guides[citySlug];
}

export function listGuides() {
  return Object.values(guides);
}
