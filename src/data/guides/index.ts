import type { CityGuide } from "@/types/guide";
import { amsterdamGuide } from "./amsterdam";
import { bangkokGuide } from "./bangkok";
import { barcelonaGuide } from "./barcelona";
import { berlinGuide } from "./berlin";
import { hongKongGuide } from "./hong-kong";
import { istanbulGuide } from "./istanbul";
import { kyotoGuide } from "./kyoto";
import { lisbonGuide } from "./lisbon";
import { londonGuide } from "./london";
import { marrakechGuide } from "./marrakech";
import { mexicoCityGuide } from "./mexico-city";
import { newYorkGuide } from "./new-york";
import { parisGuide } from "./paris";
import { romeGuide } from "./rome";
import { seoulGuide } from "./seoul";
import { singaporeGuide } from "./singapore";
import { sydneyGuide } from "./sydney";
import { taipeiGuide } from "./taipei";
import { tokyoGuide } from "./tokyo";
import { veniceGuide } from "./venice";

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
  amsterdam: amsterdamGuide,
  istanbul: istanbulGuide,
  "hong-kong": hongKongGuide,
  sydney: sydneyGuide,
  berlin: berlinGuide,
  taipei: taipeiGuide,
  venice: veniceGuide,
  marrakech: marrakechGuide,
};

export const PUBLISHED_GUIDE_SLUGS = Object.keys(guides);

export function getGuide(citySlug: string) {
  return guides[citySlug];
}

export function listGuides() {
  return Object.values(guides);
}
