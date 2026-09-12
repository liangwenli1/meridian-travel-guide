export type Localized = { en: string; zh: string };

export type OffseasonTable = {
  citySlug: string;
  name: Localized;
  neighborhood: Localized;
  why: Localized;
  howToGetIn: Localized;
  seasonWindow: Localized;
  watchOut?: Localized;
};

export type NeighborhoodPreview = {
  citySlug: string;
  title: Localized;
  body: Localized;
  status: "members-only" | "pre-publish";
  publishedAt?: string;
};

export type MonthlyBriefing = {
  id: string;
  citySlug: string;
  title: Localized;
  dek: Localized;
  body: Localized;
  shippedAt: string;
};

export type PassLockerItem = {
  kind: "itinerary" | "offseason-table" | "neighborhood-preview" | "briefing" | "arrival-card" | "trip-brief";
  id: string;
  citySlug: string;
  title: Localized;
  summary: Localized;
  downloadable?: boolean;
};
