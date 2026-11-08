import { catalogProductFromStrapiProductDetail } from "@/lib/api/strapi-product-detail";
import {
  fetchStrapiHome,
  fetchStrapiProductById,
  fetchStrapiProductBySku,
} from "@/lib/strapi-server";
import { getCatalog, upsertProductInCatalogCache } from "@/lib/catalog";
import {
  manufacturingProductsFromCatalog,
  type ManufacturingProduct,
} from "@/lib/product-catalog";
import { getProductBySeoSlug } from "@/lib/product-catalog";
import { buildProductSeoSlug } from "@/lib/product-slugs";

/**
 * Resolve slug → product: in-memory catalog first, then Strapi home list + POST /api/product.
 */
export async function getManufacturingProductForPageSlug(
  slug: string
): Promise<ManufacturingProduct | null> {
  const normalized = slug.trim().toLowerCase();
  const catalog = getCatalog();

  const fromCache = getProductBySeoSlug(normalized, catalog);
  if (fromCache) return fromCache;

  const home = await fetchStrapiHome();
  if (!home?.products?.length) return null;

  const productForSlug = home.products
    .map((p) => ({
      id: p.id,
      sku: p.sku,
      slug: buildProductSeoSlug({ skuRef: p.sku, name: p.name }),
    }))
    .find((row) => row.slug === normalized);

  if (!productForSlug) return null;

  const detail =
    (await fetchStrapiProductBySku(productForSlug.sku)) ??
    (await fetchStrapiProductById(productForSlug.id));
  if (!detail) return null;

  const row = catalogProductFromStrapiProductDetail(detail);
  if (!row) return null;

  upsertProductInCatalogCache(row);
  return manufacturingProductsFromCatalog({ products: [row] })[0] ?? null;
}
