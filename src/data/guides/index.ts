import type { CityGuide } from "@/types/guide";
import { amsterdamGuide } from "./amsterdam";
import { athensGuide } from "./athens";
import { bangkokGuide } from "./bangkok";
import { barcelonaGuide } from "./barcelona";
import { berlinGuide } from "./berlin";
import { capeTownGuide } from "./cape-town";
import { chicagoGuide } from "./chicago";
import { dubaiGuide } from "./dubai";
import { florenceGuide } from "./florence";
import { hanoiGuide } from "./hanoi";
import { hongKongGuide } from "./hong-kong";
import { istanbulGuide } from "./istanbul";
import { kyotoGuide } from "./kyoto";
import { lisbonGuide } from "./lisbon";
import { londonGuide } from "./london";
import { losAngelesGuide } from "./los-angeles";
import { marrakechGuide } from "./marrakech";
import { melbourneGuide } from "./melbourne";
import { mexicoCityGuide } from "./mexico-city";
import { newYorkGuide } from "./new-york";
import { osakaGuide } from "./osaka";
import { parisGuide } from "./paris";
import { pragueGuide } from "./prague";
import { romeGuide } from "./rome";
import { seoulGuide } from "./seoul";
import { singaporeGuide } from "./singapore";
import { sydneyGuide } from "./sydney";
import { taipeiGuide } from "./taipei";
import { tokyoGuide } from "./tokyo";
import { veniceGuide } from "./venice";

const guides: Record<string, CityGuide> = {
  amsterdam: amsterdamGuide,
  athens: athensGuide,
  bangkok: bangkokGuide,
  barcelona: barcelonaGuide,
  berlin: berlinGuide,
  "cape-town": capeTownGuide,
  chicago: chicagoGuide,
  dubai: dubaiGuide,
  florence: florenceGuide,
  hanoi: hanoiGuide,
  "hong-kong": hongKongGuide,
  istanbul: istanbulGuide,
  kyoto: kyotoGuide,
  lisbon: lisbonGuide,
  london: londonGuide,
  "los-angeles": losAngelesGuide,
  marrakech: marrakechGuide,
  melbourne: melbourneGuide,
  "mexico-city": mexicoCityGuide,
  "new-york": newYorkGuide,
  osaka: osakaGuide,
  paris: parisGuide,
  prague: pragueGuide,
  rome: romeGuide,
  seoul: seoulGuide,
  singapore: singaporeGuide,
  sydney: sydneyGuide,
  taipei: taipeiGuide,
  tokyo: tokyoGuide,
  venice: veniceGuide,
};

export const PUBLISHED_GUIDE_SLUGS = Object.keys(guides);

export function getGuide(citySlug: string) {
  return guides[citySlug];
}

export function listGuides() {
  return Object.values(guides);
}
