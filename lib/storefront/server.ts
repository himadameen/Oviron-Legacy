import { listStrapiContentGaps } from "./content-gaps";
import { logStorefrontHeroMedia } from "./debug-hero-media";
import { resolveStorefront } from "./resolve";
import type { ResolvedStorefront } from "./types";
import { fetchStrapiHome, fetchStrapiSite } from "@/lib/strapi-server";

let cachedResolved: ResolvedStorefront | null = null;

const useMemoryCache = process.env.NODE_ENV === "production";

/** Server-only: merge CMS + fallbacks for layout and marketing sections. */
export async function loadStorefrontContent(): Promise<ResolvedStorefront> {
  if (useMemoryCache && cachedResolved) {
    logStorefrontHeroMedia("in-memory-cache-hit", null, cachedResolved);
    return cachedResolved;
  }

  const [siteRes, homeRes] = await Promise.all([
    fetchStrapiSite(),
    fetchStrapiHome({ page: 1, pageSize: 8 }),
  ]);

  const resolved = resolveStorefront(homeRes, siteRes);
  const contentGaps = listStrapiContentGaps(homeRes, siteRes);
  logStorefrontHeroMedia("after-fetch", homeRes, resolved);
  if (process.env.NODE_ENV === "development" && contentGaps.length > 0) {
    console.info(
      `[storefront] ${contentGaps.length} Strapi content gap(s). See docs/STRAPI_CONTENT_GAPS.md`
    );
  }
  const payload = { ...resolved, contentGaps };
  if (useMemoryCache) cachedResolved = payload;
  return payload;
}

export function resetStorefrontContentCache(): void {
  cachedResolved = null;
}
