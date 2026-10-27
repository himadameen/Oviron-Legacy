import { normalizeCatalog } from "./normalize";
import { mockCatalogApiResponse } from "./mock-catalog";
import type { CatalogApiResponse, NormalizedCatalog } from "./types";

export type {
  CatalogApiResponse,
  CatalogApiMainCategory,
  CatalogApiProduct,
  CatalogMainCategory,
  CatalogProduct,
  CatalogSubcategory,
  NormalizedCatalog,
} from "./types";

let cached: NormalizedCatalog | null = null;

/** Sync catalog for client components and static build (mock or last fetch). */
export function getCatalog(): NormalizedCatalog {
  if (!cached) {
    cached = normalizeCatalog(mockCatalogApiResponse);
  }
  return cached;
}

/**
 * Load catalog from API when `NEXT_PUBLIC_CATALOG_API_URL` is set.
 * Falls back to mock data on error or missing env.
 */
export async function loadCatalog(): Promise<NormalizedCatalog> {
  const url = process.env.NEXT_PUBLIC_CATALOG_API_URL?.trim();
  if (!url) {
    return getCatalog();
  }

  try {
    const res = await fetch(url, {
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error(`Catalog API ${res.status}`);
    const json = (await res.json()) as CatalogApiResponse;
    const normalized = normalizeCatalog(json);
    cached = normalized;
    return normalized;
  } catch {
    return getCatalog();
  }
}

/** Replace catalog in tests or after client refresh (optional). */
export function setCatalogCache(catalog: NormalizedCatalog | null): void {
  cached = catalog;
}

export function formatProductCategoryLine(product: {
  mainCategoryLabel: string;
  subCategoryLabel: string;
}): string {
  return `${product.mainCategoryLabel} · ${product.subCategoryLabel}`;
}

export function formatEnquiryCategoryValue(product: {
  mainCategoryLabel: string;
  subCategoryLabel: string;
  name: string;
}): string {
  return `${product.mainCategoryLabel} / ${product.subCategoryLabel} / ${product.name}`;
}
