import type { ManufacturingProduct } from "./product-catalog";

/** Lowercase hyphenated segment for URLs. */
export function slugifySegment(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

/**
 * Canonical product path segment, e.g. `ov-fm-01-oxford-formal`.
 * SKU first for B2B lookup; style name for readability.
 */
export function buildProductSeoSlug(product: {
  skuRef: string;
  name: string;
}): string {
  const sku = slugifySegment(product.skuRef);
  const style = slugifySegment(product.name);
  return `${sku}-${style}`;
}

export function getProductPath(
  product: Pick<ManufacturingProduct, "seoSlug">
): `/products/${string}` {
  return `/products/${product.seoSlug}`;
}

/** Primary color keywords for metadata (from colorRuns copy). */
export function primaryColorKeywords(colorRuns: string): string[] {
  return colorRuns
    .split(/[,—–-]/)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 6);
}
