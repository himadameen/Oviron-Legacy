import {
  normalizedCatalogFromStrapiCatalog,
  normalizedCatalogFromStrapiHome,
  normalizedCatalogFromStrapiNestedCatalog,
} from "@/lib/api/normalize-catalog-response";
import type {
  StrapiCatalogResponse,
  StrapiHomeResponse,
  StrapiNestedCatalogResponse,
  StrapiProductDetail,
  StrapiSiteResponse,
} from "@/lib/api/strapi-types";
import { normalizeCatalog } from "@/lib/catalog/normalize";
import type {
  CatalogApiResponse,
  CatalogMainCategory,
  CatalogProduct,
  NormalizedCatalog,
} from "@/lib/catalog/types";
const BRAND = "oviron";

export function getStrapiBaseUrl(): string {
  const fromEnv =
    process.env.STRAPI_URL?.trim() ||
    process.env.NEXT_PUBLIC_STRAPI_URL?.trim();
  return (fromEnv || "http://localhost:1337").replace(/\/$/, "");
}

function sortByOrder<T extends { sortOrder?: number; label: string }>(
  items: T[]
): T[] {
  return [...items].sort((a, b) => {
    const ao = a.sortOrder ?? 999;
    const bo = b.sortOrder ?? 999;
    if (ao !== bo) return ao - bo;
    return a.label.localeCompare(b.label);
  });
}

function dedupeProductsById(products: CatalogProduct[]): CatalogProduct[] {
  const byId = new Map<string, CatalogProduct>();
  for (const p of products) {
    if (!byId.has(p.id)) byId.set(p.id, p);
  }
  return [...byId.values()];
}

function mergeSubcategories(
  a: CatalogMainCategory["subcategories"],
  b: CatalogMainCategory["subcategories"]
): CatalogMainCategory["subcategories"] {
  const map = new Map(
    a.map((s) => [s.id, { ...s, products: [...s.products] }])
  );
  for (const sub of b) {
    const cur = map.get(sub.id);
    if (!cur) {
      map.set(sub.id, { ...sub, products: [...sub.products] });
      continue;
    }
    const seen = new Set(cur.products.map((p) => p.id));
    for (const p of sub.products) {
      if (!seen.has(p.id)) {
        cur.products.push(p);
        seen.add(p.id);
      }
    }
  }
  return sortByOrder([...map.values()]);
}

function mergeTwoNormalizedCatalogs(
  left: NormalizedCatalog,
  right: NormalizedCatalog
): NormalizedCatalog {
  const mainMap = new Map(
    left.mainCategories.map((m) => [
      m.id,
      {
        ...m,
        subcategories: m.subcategories.map((s) => ({
          ...s,
          products: [...s.products],
        })),
      },
    ])
  );

  for (const main of right.mainCategories) {
    const existing = mainMap.get(main.id);
    if (!existing) {
      mainMap.set(main.id, {
        ...main,
        subcategories: main.subcategories.map((s) => ({
          ...s,
          products: [...s.products],
        })),
      });
      continue;
    }
    existing.subcategories = mergeSubcategories(
      existing.subcategories,
      main.subcategories
    );
    existing.productCount = existing.subcategories.reduce(
      (n, s) => n + s.products.length,
      0
    );
  }

  const mains = sortByOrder([...mainMap.values()]);
  const products = dedupeProductsById([
    ...left.products,
    ...right.products,
  ]);
  products.forEach((p, i) => {
    p.number = String(i + 1).padStart(2, "0");
  });

  return {
    mainCategories: mains.map((m) => ({
      ...m,
      productCount: m.subcategories.reduce((n, s) => n + s.products.length, 0),
    })),
    products,
    productCount: products.length,
  };
}

async function strapiPost<T>(path: string, body: Record<string, unknown>): Promise<T | null> {
  const base = getStrapiBaseUrl();
  const isDev = process.env.NODE_ENV === "development";
  try {
    const res = await fetch(`${base}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      ...(isDev
        ? { cache: "no-store" as const }
        : { next: { revalidate: 120 } }),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchStrapiHome(options?: {
  page?: number;
  pageSize?: number;
}): Promise<StrapiHomeResponse | null> {
  return strapiPost<StrapiHomeResponse>("/api/home", {
    brand: BRAND,
    page: options?.page ?? 1,
    pageSize: options?.pageSize ?? 8,
  });
}

export async function fetchStrapiSite(): Promise<StrapiSiteResponse | null> {
  return strapiPost<StrapiSiteResponse>("/api/site", { brand: BRAND });
}

function isNestedCatalogResponse(
  value: unknown
): value is StrapiNestedCatalogResponse {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return Array.isArray(record.categories) && !("category" in record);
}

export async function fetchStrapiCatalog(body: {
  category: string;
  page?: number;
  pageSize?: number;
  subCategory?: string;
}): Promise<StrapiCatalogResponse | StrapiNestedCatalogResponse | null> {
  const payload: Record<string, unknown> = {
    brand: BRAND,
    category: body.category,
  };
  if (body.page != null) payload.page = body.page;
  if (body.pageSize != null) payload.pageSize = body.pageSize;
  if (body.subCategory) payload.subCategory = body.subCategory;

  return strapiPost<StrapiCatalogResponse | StrapiNestedCatalogResponse>(
    "/api/catalog",
    payload
  );
}

export async function fetchStrapiProductBySku(
  sku: string
): Promise<StrapiProductDetail | null> {
  return strapiPost<StrapiProductDetail>("/api/product", {
    brand: BRAND,
    sku,
  });
}

export async function fetchStrapiProductById(
  productId: string
): Promise<StrapiProductDetail | null> {
  return strapiPost<StrapiProductDetail>("/api/product", {
    brand: BRAND,
    product: productId,
  });
}

/**
 * Load full catalog: merge POST /api/catalog per main category from POST /api/home category list.
 * Falls back to normalizing home-only payload if per-category calls fail.
 */
export async function fetchMergedCatalogFromStrapi(): Promise<NormalizedCatalog | null> {
  const home = await fetchStrapiHome();
  if (!home) return null;

  const categories = sortByOrder(home.categories ?? []);
  if (categories.length === 0) {
    return normalizedCatalogFromStrapiHome(home);
  }

  let merged: NormalizedCatalog | null = null;
  for (const cat of categories) {
    const res = await fetchStrapiCatalog({
      category: cat.id,
      page: 1,
      pageSize: 500,
    });
    if (!res) continue;
    const partial = isNestedCatalogResponse(res)
      ? normalizedCatalogFromStrapiNestedCatalog(res)
      : normalizedCatalogFromStrapiCatalog(res);
    merged = merged ? mergeTwoNormalizedCatalogs(merged, partial) : partial;
  }

  return merged ?? normalizedCatalogFromStrapiHome(home);
}

/** Used when legacy GET catalog URL is set. */
export async function fetchLegacyCatalogJson(url: string): Promise<NormalizedCatalog | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const json = (await res.json()) as CatalogApiResponse;
    return normalizeCatalog(json);
  } catch {
    return null;
  }
}
