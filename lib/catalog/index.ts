import { normalizeCatalog } from "./normalize";
// import { mockCatalogApiResponse } from "./mock-catalog"; // disabled — use Strapi POST APIs
import type {
  CatalogApiResponse,
  CatalogProduct,
  NormalizedCatalog,
} from "./types";

export type {
  CatalogApiResponse,
  CatalogApiMainCategory,
  CatalogApiProduct,
  CatalogMainCategory,
  CatalogProduct,
  CatalogSubcategory,
  NormalizedCatalog,
} from "./types";

function emptyCatalog(): NormalizedCatalog {
  return { mainCategories: [], products: [], productCount: 0 };
}

let cached: NormalizedCatalog | null = null;

/** Sync catalog on the server after `loadCatalog()`; empty until loaded. */
export function getCatalog(): NormalizedCatalog {
  return cached ?? emptyCatalog();
}

/**
 * Load catalog: Strapi (`fetchMergedCatalogFromStrapi`) when base URL is set,
 * else optional legacy GET JSON from `NEXT_PUBLIC_CATALOG_API_URL`.
 * Mock data is not used.
 */
export async function loadCatalog(): Promise<NormalizedCatalog> {
  if (cached && cached.productCount > 0) {
    return cached;
  }

  const { fetchLegacyCatalogJson, fetchMergedCatalogFromStrapi } =
    await import("@/lib/strapi-server");

  const strapiCatalog = await fetchMergedCatalogFromStrapi();
  if (strapiCatalog && strapiCatalog.productCount > 0) {
    cached = strapiCatalog;
    return strapiCatalog;
  }

  const legacyUrl = process.env.NEXT_PUBLIC_CATALOG_API_URL?.trim();
  if (legacyUrl) {
    const fromLegacy = await fetchLegacyCatalogJson(legacyUrl);
    if (fromLegacy && fromLegacy.productCount > 0) {
      cached = fromLegacy;
      return fromLegacy;
    }
  }

  cached = emptyCatalog();
  return cached;
}

/** Replace catalog in tests (optional). */
export function setCatalogCache(catalog: NormalizedCatalog | null): void {
  cached = catalog;
}

/** Add or replace one product so client navigations and routes see API-resolved rows. */
export function upsertProductInCatalogCache(product: CatalogProduct): void {
  const base = cached ?? emptyCatalog();
  const products = base.products.filter((p) => p.id !== product.id);
  products.push(product);
  products.forEach((p, i) => {
    p.number = String(i + 1).padStart(2, "0");
  });

  let placed = false;
  const mainCategories = base.mainCategories.map((main) => {
    if (main.id !== product.mainCategoryId) return main;
    placed = true;
    const subcategories = main.subcategories.map((sub) => {
      if (sub.id !== product.subCategoryId) return sub;
      const prods = sub.products.filter((p) => p.id !== product.id);
      prods.push(product);
      return { ...sub, products: prods };
    });
    const hasSub = subcategories.some((s) => s.id === product.subCategoryId);
    const nextSubs = hasSub
      ? subcategories
      : [
          ...subcategories,
          {
            id: product.subCategoryId,
            label: product.subCategoryLabel,
            description: undefined,
            sortOrder: 999,
            products: [product],
          },
        ];
    return {
      ...main,
      subcategories: nextSubs,
      productCount: nextSubs.reduce((n, s) => n + s.products.length, 0),
    };
  });

  const nextMainCategories = placed
    ? mainCategories
    : [
        ...mainCategories,
        {
          id: product.mainCategoryId,
          label: product.mainCategoryLabel,
          subtitle: undefined,
          sortOrder: 999,
          subcategories: [
            {
              id: product.subCategoryId,
              label: product.subCategoryLabel,
              description: undefined,
              sortOrder: 999,
              products: [product],
            },
          ],
          productCount: 1,
        },
      ];

  cached = {
    mainCategories: nextMainCategories,
    products,
    productCount: products.length,
  };
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
