import { isMissingProductImage } from "@/lib/images";
import { mergeSpecs } from "@/lib/catalog/default-specs";
import type { CatalogProduct } from "@/lib/catalog/types";
import { pickProductTagChips } from "@/lib/product-tags";
import type { StrapiProductDetail } from "@/lib/api/strapi-types";

/**
 * Map POST /api/product body to the same shape as normalized catalog rows.
 */
export function catalogProductFromStrapiProductDetail(
  detail: StrapiProductDetail
): CatalogProduct | null {
  const main = detail.category;
  const sub = detail.subCategory;
  const p = detail.product;
  if (!main?.id || !sub?.id || !p?.id || !p.sku || !p.name) return null;

  const gallery: string[] = [];
  for (const src of [p.imageUrl, ...(p.imageUrls ?? [])]) {
    const trimmed = src?.trim();
    if (
      !trimmed ||
      isMissingProductImage(trimmed) ||
      gallery.includes(trimmed)
    ) {
      continue;
    }
    gallery.push(trimmed);
  }

  return {
    id: p.id,
    sku: p.sku,
    name: p.name,
    description: p.description,
    image: gallery[0] ?? "",
    gallery,
    imageAlt: p.imageAlt,
    mainCategoryId: main.id,
    mainCategoryLabel: main.label,
    subCategoryId: sub.id,
    subCategoryLabel: sub.label,
    number: "01",
    specs: mergeSpecs(main.id, p.specs),
    productTags: pickProductTagChips(p.tags),
  };
}
