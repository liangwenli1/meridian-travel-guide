export type ContentStatus = "published" | "coming-soon";

export type City = {
  id: string;
  name: string;
  slug: string;
  alternateNames: string[];
  country: string;
  countrySlug: string;
  countryCode: string;
  region: string;
  latitude: number;
  longitude: number;
  population: number;
  tourismPriority: number;
  capital: boolean;
  timezone: string;
  currency: string;
  currencyCode: string;
  languages: string[];
  airportCodes: string[];
  shortDescription: string;
  contentStatus: ContentStatus;
};

export type Country = {
  name: string;
  slug: string;
  code: string;
  latitude: number;
  longitude: number;
  priority: number;
};
