export type MediaAsset = {
  url: string;
  alt: string;
  source: string;
  author: string;
  license: string;
  originalUrl: string;
  location?: string;
};

export type Snapshot = {
  country: string;
  languages: string;
  currency: string;
  timezone: string;
  population: string;
  dailyCost: string;
  bestMonths: string;
  typicalStay: string;
  airports: string;
  stations: string;
  visaSummary: string;
  plugType: string;
  voltage: string;
  emergency: string;
  tipping: string;
  cashVsCard: string;
  diningHours: string;
  walkability: string;
  transitQuality: string;
  travelStyle: string;
};

export type Neighborhood = {
  name: string;
  vibe: string;
  bestFor: string[];
  price: string;
  noise: string;
  safety: string;
  transit: string;
  stayNights: string;
  pros: string[];
  cons: string[];
  combineWith: string;
};

export type Attraction = {
  name: string;
  summary: string;
  whyItMatters: string;
  whoItSuits: string;
  duration: string;
  price: string;
  hours: string;
  reservation: string;
  queue: string;
  crowd: string;
  location: string;
  transport: string;
  bestTime: string;
  season: string;
  accessibility: string;
  nearby: string;
  tips: string[];
  mistakes: string[];
  alternative: string;
  worthIt: string;
  tier: "essential" | "extra-time" | "niche" | "conditional" | "overrated";
};

export type Dish = {
  name: string;
  localName?: string;
  what: string;
  taste: string;
  when: string;
  price: string;
  where: string;
  howToOrder: string;
  note?: string;
};

export type Venue = {
  name: string;
  type: string;
  cuisine?: string;
  price: string;
  neighborhood: string;
  why: string;
  who: string;
  dishes?: string[];
  reservation: string;
  note?: string;
};

export type AppItem = {
  name: string;
  purpose: string;
  platforms: string;
  needLocalNumber: boolean;
  needLocalBank: boolean;
  offline: boolean;
  necessary: "before" | "after" | "skip";
  note: string;
};

export type Itinerary = {
  title: string;
  days: number;
  pace: "essentials" | "balanced" | "slow";
  summary: string;
  daysPlan: {
    label: string;
    theme: string;
    stops: { time: string; title: string; detail: string }[];
    rainPlan: string;
  }[];
};

export type CityGuide = {
  citySlug: string;
  countrySlug: string;
  title: string;
  subtitle: string;
  seoTitle: string;
  seoDescription: string;
  hero: MediaAsset;
  snapshot: Snapshot;
  whyGo: string;
  whoWillLoveIt: string[];
  whoMayStruggle: string[];
  shortVersion: string[];
  realityCheck: string[];
  /** Optional Chinese overlay — whole-page language switch, not dual subtitles. */
  zh?: {
    title?: string;
    subtitle?: string;
    seoTitle?: string;
    seoDescription?: string;
    whyGo?: string;
    whoWillLoveIt?: string[];
    whoMayStruggle?: string[];
    shortVersion?: string[];
    realityCheck?: string[];
    snapshot?: Partial<Snapshot>;
  };
  beforeYouGo: { title: string; body: string }[];
  neighborhoods: Neighborhood[];
  bestAreaFor: { persona: string; area: string; why: string }[];
  attractions: Attraction[];
  thingsToDo: { title: string; body: string; duration: string; who: string }[];
  hiddenGems: { title: string; body: string; watchOut?: string }[];
  localExperiences: { title: string; body: string }[];
  everydayLife: { title: string; body: string }[];
  foodIntro: string;
  dishes: Dish[];
  foodThemes: { title: string; body: string }[];
  venues: Venue[];
  shopping: { title: string; body: string }[];
  stayIntro: string;
  stayAreas: {
    name: string;
    bestFor: string[];
    commute: string;
    priceHint: string;
    noise: string;
    safety: string;
  }[];
  stayNotes: string[];
  arrival: {
    name: string;
    time: string;
    cost: string;
    how: string;
    bestFor: string;
    watchOut?: string;
  }[];
  gettingAround: { title: string; body: string }[];
  dayTrips: { name: string; time: string; why: string; skipIf: string }[];
  seasons: {
    name: string;
    forWhom: string;
    pros: string;
    cons: string;
    pack: string;
  }[];
  weatherTips: { title: string; body: string }[];
  festivals: { name: string; when: string; note: string }[];
  budget: {
    currency: string;
    asOf: string;
    bands: { name: string; daily: string; includes: string }[];
    breakdown: { item: string; budget: string; mid: string; luxury: string }[];
    hidden: string[];
    worthSpending: string[];
    worthSaving: string[];
  };
  timePlanning: { title: string; body: string }[];
  itineraries: Itinerary[];
  visa: { summary: string; details: string[]; officialUrl: string };
  connectivity: { title: string; body: string }[];
  payments: { title: string; body: string }[];
  apps: AppItem[];
  culture: { title: string; body: string }[];
  etiquette: { do: string; dont: string; why: string }[];
  taboos: string[];
  safety: { title: string; body: string }[];
  scams: {
    name: string;
    lookFor: string;
    prevent: string;
    ifItHappens: string;
  }[];
  emergency: { label: string; value: string }[];
  accessibility: { title: string; body: string }[];
  byTraveler: { persona: string; tips: string[] }[];
  touristsGetWrong: string[];
  localModules: { title: string; body: string }[];
  phrases: {
    original: string;
    romanized: string;
    meaning: string;
    use: string;
    avoid: string;
  }[];
  faq: { q: string; a: string }[];
  sources: { name: string; url: string; usedFor: string }[];
  lastUpdated: string;
};
