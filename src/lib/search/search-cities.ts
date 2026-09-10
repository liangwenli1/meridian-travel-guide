import type { City, Country } from "@/types/catalog";

export type SearchHit = {
  city: City;
  score: number;
  reason: "city" | "alias" | "country" | "code";
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

function levenshtein(a: string, b: string) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const rows = a.length + 1;
  const cols = b.length + 1;
  const matrix = new Int16Array(rows * cols);
  for (let i = 0; i < rows; i += 1) matrix[i * cols] = i;
  for (let j = 0; j < cols; j += 1) matrix[j] = j;
  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i * cols + j] = Math.min(
        matrix[(i - 1) * cols + j] + 1,
        matrix[i * cols + j - 1] + 1,
        matrix[(i - 1) * cols + j - 1] + cost,
      );
    }
  }
  return matrix[(rows - 1) * cols + (cols - 1)];
}

function scoreName(query: string, name: string) {
  const n = normalize(name);
  if (!query || !n) return 0;
  if (n === query) return 120;
  if (n.startsWith(query)) return 100 - Math.min(query.length, 20);
  const parts = n.split(/[\s,'-]+/);
  if (parts.some((part) => part.startsWith(query))) return 88;
  if (n.includes(query)) return 70;
  if (query.length >= 3 && levenshtein(query, n.slice(0, query.length + 1)) <= 1) return 56;
  if (query.length >= 4 && levenshtein(query, n) <= 2) return 42;
  return 0;
}

export function searchCitiesIn(
  cities: City[],
  countries: Country[],
  rawQuery: string,
  limit = 8,
): SearchHit[] {
  const query = normalize(rawQuery);
  if (query.length < 1) return [];

  const hits = new Map<string, SearchHit>();

  const bump = (city: City, score: number, reason: SearchHit["reason"]) => {
    if (score <= 0) return;
    const current = hits.get(city.id);
    const weighted = score + city.tourismPriority * 0.08;
    if (!current || weighted > current.score) {
      hits.set(city.id, { city, score: weighted, reason });
    }
  };

  for (const city of cities) {
    bump(city, scoreName(query, city.name), "city");
    bump(city, scoreName(query, city.country) * 0.72, "country");
    bump(city, scoreName(query, city.countryCode) * 0.6, "code");
    bump(city, scoreName(query, city.countrySlug.replaceAll("-", " ")) * 0.7, "country");
    for (const alias of city.alternateNames) {
      bump(city, scoreName(query, alias) * 0.96, "alias");
    }
  }

  for (const country of countries) {
    const countryScore = Math.max(
      scoreName(query, country.name),
      scoreName(query, country.slug.replaceAll("-", " ")),
      scoreName(query, country.code) * 0.8,
    );
    if (countryScore < 70) continue;
    const inCountry = cities
      .filter((city) => city.countrySlug === country.slug)
      .sort((a, b) => b.tourismPriority - a.tourismPriority)
      .slice(0, 5);
    for (const city of inCountry) {
      bump(city, countryScore + city.tourismPriority * 0.12, "country");
    }
  }

  return [...hits.values()].sort((a, b) => b.score - a.score).slice(0, limit);
}
