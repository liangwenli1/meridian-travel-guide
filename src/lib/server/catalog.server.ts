import { cities as seedCities } from "@/data/cities";
import { countries as seedCountries } from "@/data/countries";
import { getGuide } from "@/data/guides";
import { getSql } from "@/lib/db";
import { searchCitiesIn, type SearchHit } from "@/lib/search/search-cities";
import type { City, Country } from "@/types/catalog";
import type { CityGuide } from "@/types/guide";

type CityRow = {
  id: string;
  name: string;
  slug: string;
  alternate_names: unknown;
  country: string;
  country_slug: string;
  country_code: string;
  region: string;
  latitude: number;
  longitude: number;
  population: number;
  tourism_priority: number;
  capital: boolean;
  timezone: string;
  currency: string;
  currency_code: string;
  languages: unknown;
  airport_codes: unknown;
  short_description: string;
  content_status: string;
};

type CountryRow = {
  slug: string;
  name: string;
  code: string;
  latitude: number;
  longitude: number;
  priority: number;
};

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      return [];
    }
  }
  return [];
}

function mapCity(row: CityRow): City {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    alternateNames: asStringArray(row.alternate_names),
    country: row.country,
    countrySlug: row.country_slug,
    countryCode: row.country_code,
    region: row.region,
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    population: Number(row.population),
    tourismPriority: Number(row.tourism_priority),
    capital: Boolean(row.capital),
    timezone: row.timezone,
    currency: row.currency,
    currencyCode: row.currency_code,
    languages: asStringArray(row.languages),
    airportCodes: asStringArray(row.airport_codes),
    shortDescription: row.short_description,
    contentStatus: row.content_status === "published" ? "published" : "coming-soon",
  };
}

function mapCountry(row: CountryRow): Country {
  return {
    slug: row.slug,
    name: row.name,
    code: row.code,
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    priority: Number(row.priority),
  };
}

function asGuide(payload: unknown): CityGuide {
  const value = typeof payload === "string" ? JSON.parse(payload) : payload;
  return value as CityGuide;
}

let seedPromise: Promise<void> | null = null;

async function seedCatalog() {
  const sql = await getSql();

  for (const country of seedCountries) {
    await sql.query(
      `insert into countries (slug, name, code, latitude, longitude, priority)
       values ($1, $2, $3, $4, $5, $6)
       on conflict (slug) do update set
         name = excluded.name,
         code = excluded.code,
         latitude = excluded.latitude,
         longitude = excluded.longitude,
         priority = excluded.priority`,
      [country.slug, country.name, country.code, country.latitude, country.longitude, country.priority],
    );
  }

  for (const city of seedCities) {
    await sql.query(
      `insert into cities (
         id, name, slug, alternate_names, country, country_slug, country_code, region,
         latitude, longitude, population, tourism_priority, capital, timezone, currency,
         currency_code, languages, airport_codes, short_description, content_status
       ) values (
         $1,$2,$3,$4::jsonb,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17::jsonb,$18::jsonb,$19,$20
       )
       on conflict (id) do update set
         short_description = excluded.short_description,
         content_status = excluded.content_status,
         tourism_priority = excluded.tourism_priority`,
      [
        city.id,
        city.name,
        city.slug,
        JSON.stringify(city.alternateNames),
        city.country,
        city.countrySlug,
        city.countryCode,
        city.region,
        city.latitude,
        city.longitude,
        city.population,
        city.tourismPriority,
        city.capital,
        city.timezone,
        city.currency,
        city.currencyCode,
        JSON.stringify(city.languages),
        JSON.stringify(city.airportCodes),
        city.shortDescription,
        city.contentStatus,
      ],
    );
  }

  for (const city of seedCities.filter((item) => item.contentStatus === "published")) {
    const guide = getGuide(city.slug);
    if (!guide) continue;
    await sql.query(
      `insert into city_guides (city_slug, payload)
       values ($1, $2)
       on conflict (city_slug) do update set payload = excluded.payload, updated_at = now()`,
      [city.slug, JSON.stringify(guide)],
    );
  }
}

export function ensureSeeded() {
  seedPromise ??= seedCatalog().catch((err) => {
    seedPromise = null;
    throw err;
  });
  return seedPromise;
}

export async function getHomeCatalogData() {
  await ensureSeeded();
  const sql = await getSql();
  const cityRows = await sql<CityRow>`select * from cities order by tourism_priority desc, name`;
  const countryRows = await sql<CountryRow>`select * from countries order by priority desc, name`;
  const cities = cityRows.map(mapCity);
  return {
    cities,
    countries: countryRows.map(mapCountry),
    published: cities.filter((city) => city.contentStatus === "published"),
  };
}

export async function getCountryPageData(countrySlug: string) {
  await ensureSeeded();
  const sql = await getSql();
  const countryRows = await sql<CountryRow>`select * from countries where slug = ${countrySlug} limit 1`;
  const cityRows = await sql<CityRow>`
    select * from cities where country_slug = ${countrySlug} order by tourism_priority desc, name
  `;
  const list = cityRows.map(mapCity);
  const country = countryRows[0] ? mapCountry(countryRows[0]) : null;
  return {
    country,
    countryName: country?.name ?? list[0]?.country ?? countrySlug,
    list,
  };
}

export async function getCityPageData(countrySlug: string, citySlug: string) {
  await ensureSeeded();
  const sql = await getSql();
  const cityRows = await sql<CityRow>`
    select * from cities where country_slug = ${countrySlug} and slug = ${citySlug} limit 1
  `;
  const city = cityRows[0] ? mapCity(cityRows[0]) : null;
  if (!city) return { city: null, guide: null as CityGuide | null };
  const guideRows = await sql<{ payload: unknown }>`
    select payload from city_guides where city_slug = ${city.slug} limit 1
  `;
  const fromDb = guideRows[0] ? asGuide(guideRows[0].payload) : null;
  return {
    city,
    guide: fromDb ?? getGuide(city.slug) ?? null,
  };
}

export async function searchCatalogData(query: string, limit = 8): Promise<SearchHit[]> {
  const { cities, countries } = await getHomeCatalogData();
  return searchCitiesIn(cities, countries, query, limit);
}

export async function recordSearchData(query: string, resultCityId: string | null) {
  await ensureSeeded();
  const sql = await getSql();
  const trimmed = query.trim().slice(0, 80);
  if (!trimmed) return;
  await sql.query(`insert into search_events (query, result_city_id) values ($1, $2)`, [
    trimmed,
    resultCityId,
  ]);
}

export async function listPublishedData() {
  await ensureSeeded();
  const sql = await getSql();
  const rows = await sql<CityRow>`
    select * from cities where content_status = 'published' order by name
  `;
  return rows.map(mapCity);
}

export async function recordIntentData(kind: string, citySlug: string | null) {
  await ensureSeeded();
  const sql = await getSql();
  await sql.query(`insert into intents (kind, city_slug) values ($1, $2)`, [kind, citySlug]);
}
