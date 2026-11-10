import { isMissingProductImage } from "../images";
import { pickProductTagChips } from "../product-tags";
import { mergeSpecs } from "./default-specs";
import type {
  CatalogApiResponse,
  CatalogMainCategory,
  CatalogProduct,
  CatalogSubcategory,
  NormalizedCatalog,
} from "./types";

function dedupeByProductId<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of items) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    out.push(item);
  }
  return out;
}

function mergeSubcategoriesById(
  subs: CatalogSubcategory[]
): CatalogSubcategory[] {
  const order: string[] = [];
  const map = new Map<string, CatalogSubcategory>();

  for (const sub of subs) {
    const prev = map.get(sub.id);
    if (!prev) {
      order.push(sub.id);
      map.set(sub.id, { ...sub, products: [...sub.products] });
      continue;
    }

    map.set(sub.id, {
      ...prev,
      description: prev.description ?? sub.description,
      products: dedupeByProductId([...prev.products, ...sub.products]),
    });
  }

  return order.map((id) => map.get(id)!).filter(Boolean);
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

/** Drop empty subcategories and main categories; assign display numbers. */
export function normalizeCatalog(raw: CatalogApiResponse): NormalizedCatalog {
  const mainCategories = sortByOrder(raw.categories ?? [])
    .map((main) => {
      const subcategories = mergeSubcategoriesById(
        sortByOrder(main.subcategories ?? [])
          .map((sub) => {
            const subProducts = dedupeByProductId(
              (sub.products ?? []).filter((p) => p.id && p.sku && p.name)
            );

            if (subProducts.length === 0) return null;

            const normalizedProducts: CatalogProduct[] = subProducts.map((p) => {
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
                number: "",
                specs: mergeSpecs(main.id, p.specs),
                productTags: pickProductTagChips(p.tags),
              };
            });

            return {
              id: sub.id,
              label: sub.label,
              description: sub.description,
              sortOrder: sub.sortOrder ?? 999,
              products: normalizedProducts,
            };
          })
          .filter((sub) => sub !== null) as CatalogSubcategory[]
      );

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

  const products: CatalogProduct[] = [];
  let counter = 0;
  for (const main of mainCategories) {
    for (const sub of main.subcategories) {
      for (const product of sub.products) {
        counter += 1;
        products.push({
          ...product,
          number: String(counter).padStart(2, "0"),
        });
      }
    }
  }

  return {
    mainCategories,
    products,
    productCount: products.length,
  };
}
