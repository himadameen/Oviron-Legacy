import { formatEnquiryCategoryValue } from "./catalog";
import {
  getProductById,
  getProductBySeoSlug,
  manufacturingProductsFromCatalog,
  type ManufacturingProduct,
} from "./product-catalog";
import type { NormalizedCatalog } from "./catalog/types";
import { getProductPath } from "./product-slugs";

export function productCatalogHref(
  productId: string,
  catalog: NormalizedCatalog
): string {
  const product = getProductById(productId, catalog);
  return product ? getProductPath(product) : "/products";
}

/** Product listing filtered by main (and optional sub) category. */
export function productCatalogFilterHref(
  mainCategoryId: string,
  subCategoryId?: string
): string {
  const params = new URLSearchParams({ main: mainCategoryId });
  if (subCategoryId) {
    params.set("sub", subCategoryId);
  }
  return `/products?${params.toString()}#catalog-top`;
}

/** Home contact form with style prefilled (SEO slug + legacy category name). */
export function productQuoteHref(product: ManufacturingProduct): string {
  const params = new URLSearchParams({
    style: product.seoSlug,
    category: formatEnquiryCategoryValue(product),
  });
  return `/?${params.toString()}#contact`;
}

export function productQuoteHrefFromId(
  productId: string,
  catalog: NormalizedCatalog
): string {
  const product = getProductById(productId, catalog);
  return product ? productQuoteHref(product) : "/#contact";
}

/** Resolve legacy `?product=` / `?category=` query params. */
export function resolveProductIdFromParam(
  productParam: string | null,
  categoryParam: string | null,
  catalog: NormalizedCatalog
): string | null {
  const list = manufacturingProductsFromCatalog(catalog);

  if (productParam) {
    const bySlug = getProductBySeoSlug(productParam, catalog);
    if (bySlug) return bySlug.id;

    const byId = getProductById(productParam, catalog);
    if (byId) return byId.id;
  }

  const category = categoryParam ?? productParam;
  if (!category) return null;

  const decoded = decodeURIComponent(category);
  const fromCatalog = list.find(
    (p) => p.id === decoded || p.name === decoded || p.seoSlug === decoded
  );
  return fromCatalog?.id ?? null;
}

export function redirectPathForLegacyProductQuery(
  productParam: string | null,
  categoryParam: string | null,
  catalog: NormalizedCatalog
): `/products/${string}` | null {
  const id = resolveProductIdFromParam(productParam, categoryParam, catalog);
  if (!id) return null;
  const product = getProductById(id, catalog);
  return product ? getProductPath(product) : null;
}
