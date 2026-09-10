import { createServerFn } from "@tanstack/react-start";

/**
 * Catalog API (auth off).
 * Browser loaders and client components call these server functions.
 * Handlers run only on the server and talk to Postgres via catalog.server.
 */

export const getHomeCatalog = createServerFn({ method: "GET" }).handler(async () => {
  const { getHomeCatalogData } = await import("./catalog.server");
  return getHomeCatalogData();
});

export const getCountryPage = createServerFn({ method: "GET" })
  .validator((input: { country: string }) => ({ country: String(input.country) }))
  .handler(async ({ data }) => {
    const { getCountryPageData } = await import("./catalog.server");
    return getCountryPageData(data.country);
  });

export const getCityPage = createServerFn({ method: "GET" })
  .validator((input: { country: string; city: string }) => ({
    country: String(input.country),
    city: String(input.city),
  }))
  .handler(async ({ data }) => {
    const { getCityPageData } = await import("./catalog.server");
    return getCityPageData(data.country, data.city);
  });

export const searchCatalog = createServerFn({ method: "GET" })
  .validator((input: { query: string; limit?: number }) => ({
    query: String(input.query ?? ""),
    limit: Math.min(12, Math.max(1, Number(input.limit) || 8)),
  }))
  .handler(async ({ data }) => {
    const { searchCatalogData } = await import("./catalog.server");
    return searchCatalogData(data.query, data.limit);
  });

export const recordSearch = createServerFn({ method: "POST" })
  .validator((input: { query: string; resultCityId: string | null }) => ({
    query: String(input.query ?? "").slice(0, 80),
    resultCityId: input.resultCityId ? String(input.resultCityId) : null,
  }))
  .handler(async ({ data }) => {
    const { recordSearchData } = await import("./catalog.server");
    await recordSearchData(data.query, data.resultCityId);
  });

export const listPublishedCities = createServerFn({ method: "GET" }).handler(async () => {
  const { listPublishedData } = await import("./catalog.server");
  return listPublishedData();
});

export const recordIntent = createServerFn({ method: "POST" })
  .validator((input: { kind: string; citySlug?: string | null }) => ({
    kind: String(input.kind ?? "letter").slice(0, 40),
    citySlug: input.citySlug ? String(input.citySlug).slice(0, 80) : null,
  }))
  .handler(async ({ data }) => {
    const { recordIntentData } = await import("./catalog.server");
    await recordIntentData(data.kind, data.citySlug);
  });
