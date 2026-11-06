import { normalizeCatalog } from "@/lib/catalog/normalize";
import type { CatalogApiResponse, NormalizedCatalog } from "@/lib/catalog/types";
import type {
  StrapiCatalogResponse,
  StrapiCategory,
  StrapiHomeResponse,
  StrapiListProduct,
  StrapiSubcategory,
} from "./strapi-types";

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

/**
 * Build nested categories + subcategories from a flat product list
 * (home feed) using subCategoryId / subCategoryLabel on each product.
 */
function inferMainIdForHomeProducts(
  products: StrapiListProduct[],
  categories: StrapiCategory[]
): string | null {
  const explicit = products.map((p) => p.mainCategoryId).find(Boolean);
  if (explicit) return explicit;

  if (categories.length === 1) return categories[0].id;

  const shoes = categories.find((c) => c.id === "shoes");
  if (shoes) return shoes.id;

  return categories[0]?.id ?? null;
}

function catalogApiResponseFromHome(
  home: StrapiHomeResponse
): CatalogApiResponse {
  const mains = sortByOrder(home.categories ?? []);
  const allProducts = home.products ?? [];
  const orphanMainId = inferMainIdForHomeProducts(allProducts, mains);

  return {
    categories: mains.map((main) => {
      const productsHere = allProducts.filter((p) => {
        if (p.mainCategoryId) return p.mainCategoryId === main.id;
        if (orphanMainId) return main.id === orphanMainId;
        return false;
      });

      const subMap = new Map<
        string,
        { meta: StrapiSubcategory; products: StrapiListProduct[] }
      >();

      for (const p of productsHere) {
        const subId = p.subCategoryId ?? "_uncategorized";
        const subLabel = p.subCategoryLabel ?? "Styles";
        let bucket = subMap.get(subId);
        if (!bucket) {
          bucket = {
            meta: {
              id: subId,
              label: subLabel,
              description: undefined,
              sortOrder: 999,
            },
            products: [],
          };
          subMap.set(subId, bucket);
        }
        bucket.products.push(p);
      }

      const subcategories = sortByOrder(
        [...subMap.values()].map((b) => ({
          id: b.meta.id,
          label: b.meta.label,
          description: b.meta.description,
          sortOrder: b.meta.sortOrder,
          products: b.products,
        }))
      );

      return {
        id: main.id,
        label: main.label,
        subtitle: main.subtitle,
        sortOrder: main.sortOrder,
        subcategories,
      };
    }),
  };
}

/** Full nested catalog response (one main category). */
export function normalizedCatalogFromStrapiCatalog(
  res: StrapiCatalogResponse
): NormalizedCatalog {
  const main = res.category;
  const subs = sortByOrder(res.subcategories ?? []);

  const subIds = new Set(subs.map((s) => s.id));
  const products = res.products ?? [];

  const extrasBySub = new Map<string, StrapiListProduct[]>();
  for (const p of products) {
    const sid = p.subCategoryId;
    if (!sid || subIds.has(sid)) continue;
    const list = extrasBySub.get(sid) ?? [];
    list.push(p);
    extrasBySub.set(sid, list);
  }

  const mergedSubs = [
    ...subs.map((s) => ({
      ...s,
      products: [
        ...(s.id
          ? products.filter((p) => p.subCategoryId === s.id)
          : []),
      ],
    })),
    ...[...extrasBySub.entries()].map(([id, prods], idx) => ({
      id,
      label: prods[0]?.subCategoryLabel ?? id,
      description: undefined,
      sortOrder: 900 + idx,
      products: prods,
    })),
  ];

  const payload: CatalogApiResponse = {
    categories: [
      {
        id: main.id,
        label: main.label,
        subtitle: main.subtitle,
        sortOrder: main.sortOrder,
        subcategories: mergedSubs,
      },
    ],
  };

  return normalizeCatalog(payload);
}

export function normalizedCatalogFromStrapiHome(
  home: StrapiHomeResponse
): NormalizedCatalog {
  return normalizeCatalog(catalogApiResponseFromHome(home));
}
