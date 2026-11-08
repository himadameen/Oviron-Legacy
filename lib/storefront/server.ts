import { listStrapiContentGaps } from "./content-gaps";
import { resolveStorefront } from "./resolve";
import type { ResolvedStorefront } from "./types";
import { fetchStrapiHome, fetchStrapiSite } from "@/lib/strapi-server";

let cachedResolved: ResolvedStorefront | null = null;

/** Server-only: merge CMS + fallbacks for layout and marketing sections. */
export async function loadStorefrontContent(): Promise<ResolvedStorefront> {
  if (cachedResolved) return cachedResolved;

  const [siteRes, homeRes] = await Promise.all([
    fetchStrapiSite(),
    fetchStrapiHome({ page: 1, pageSize: 8 }),
  ]);

  const resolved = resolveStorefront(homeRes, siteRes);
  const contentGaps = listStrapiContentGaps(homeRes, siteRes);
  if (process.env.NODE_ENV === "development" && contentGaps.length > 0) {
    console.info(
      `[storefront] ${contentGaps.length} Strapi content gap(s). See docs/STRAPI_CONTENT_GAPS.md`
    );
  }
  cachedResolved = { ...resolved, contentGaps };
  return cachedResolved;
}

export function resetStorefrontContentCache(): void {
  cachedResolved = null;
}
