import { formatEnquiryCategoryValue } from "./catalog";
import {
  getProductById,
  manufacturingProducts,
  type ManufacturingProduct,
} from "./product-catalog";
import { getProductPath } from "./product-slugs";

export function getProductBySeoSlug(slug: string): ManufacturingProduct | null {
  const normalized = slug.trim().toLowerCase();
  return (
    manufacturingProducts.find((p) => p.seoSlug === normalized) ?? null
  );
}

/** Catalog URL for a style (SEO path). */
export function productCatalogHref(productId: string): string {
  const product = getProductById(productId);
  return product ? getProductPath(product) : "/products";
}

/** Home contact form with style prefilled (SEO slug + legacy category name). */
export function productQuoteHref(product: ManufacturingProduct): string {
  const params = new URLSearchParams({
    style: product.seoSlug,
    category: formatEnquiryCategoryValue(product),
  });
  return `/?${params.toString()}#contact`;
}

export function productQuoteHrefFromId(productId: string): string {
  const product = getProductById(productId);
  return product ? productQuoteHref(product) : "/#contact";
}

/** Resolve legacy `?product=` / `?category=` query params. */
export function resolveProductIdFromParam(
  productParam: string | null,
  categoryParam: string | null
): string | null {
  if (productParam) {
    const bySlug = getProductBySeoSlug(productParam);
    if (bySlug) return bySlug.id;

    const byId = getProductById(productParam);
    if (byId) return byId.id;
  }

  const category = categoryParam ?? productParam;
  if (!category) return null;

  const decoded = decodeURIComponent(category);
  const fromCatalog = manufacturingProducts.find(
    (p) => p.id === decoded || p.name === decoded || p.seoSlug === decoded
  );
  return fromCatalog?.id ?? null;
}

export function redirectPathForLegacyProductQuery(
  productParam: string | null,
  categoryParam: string | null
): `/products/${string}` | null {
  const id = resolveProductIdFromParam(productParam, categoryParam);
  if (!id) return null;
  const product = getProductById(id);
  return product ? getProductPath(product) : null;
}
