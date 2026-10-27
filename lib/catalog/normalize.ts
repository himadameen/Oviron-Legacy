import { mergeSpecs } from "./default-specs";
import type {
  CatalogApiResponse,
  CatalogMainCategory,
  CatalogProduct,
  CatalogSubcategory,
  NormalizedCatalog,
} from "./types";

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

/** Drop empty subcategories and main categories; assign display numbers. */
export function normalizeCatalog(raw: CatalogApiResponse): NormalizedCatalog {
  const products: CatalogProduct[] = [];
  let counter = 0;

  const mainCategories = sortByOrder(raw.categories ?? [])
    .map((main) => {
      const subcategories = sortByOrder(main.subcategories ?? [])
        .map((sub) => {
          const subProducts = (sub.products ?? []).filter(
            (p) => p.id && p.sku && p.name
          );

          if (subProducts.length === 0) return null;

          const normalizedProducts: CatalogProduct[] = subProducts.map((p) => {
            counter += 1;
            const gallery: string[] = [];
            for (const src of [p.imageUrl, ...(p.imageUrls ?? [])]) {
              const trimmed = src?.trim();
              if (!trimmed || gallery.includes(trimmed)) continue;
              gallery.push(trimmed);
            }
            return {
              id: p.id,
              sku: p.sku,
              name: p.name,
              description: p.description,
              image: gallery[0] ?? p.imageUrl,
              gallery,
              imageAlt: p.imageAlt,
              mainCategoryId: main.id,
              mainCategoryLabel: main.label,
              subCategoryId: sub.id,
              subCategoryLabel: sub.label,
              number: String(counter).padStart(2, "0"),
              specs: mergeSpecs(main.id, p.specs),
            };
          });

          products.push(...normalizedProducts);

          return {
            id: sub.id,
            label: sub.label,
            description: sub.description,
            sortOrder: sub.sortOrder ?? 999,
            products: normalizedProducts,
          };
        })
        .filter((sub) => sub !== null) as CatalogSubcategory[];

      if (subcategories.length === 0) return null;

      const productCount = subcategories.reduce(
        (sum, sub) => sum + sub.products.length,
        0
      );

      return {
        id: main.id,
        label: main.label,
        subtitle: main.subtitle,
        sortOrder: main.sortOrder ?? 999,
        subcategories,
        productCount,
      };
    })
    .filter((main) => main !== null) as CatalogMainCategory[];

  return {
    mainCategories,
    products,
    productCount: products.length,
  };
}
