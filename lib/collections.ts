/**
 * @deprecated Use `@/lib/catalog` — kept for gradual migration.
 */
import { getCatalog } from "./catalog";
import type { CatalogProduct } from "./catalog/types";

export type CollectionItem = CatalogProduct;

/** @deprecated Use `getCatalog().mainCategories` */
export const collectionGroups = getCatalog().mainCategories.map((main) => ({
  id: main.id,
  label: main.label,
  subtitle: main.subtitle ?? "",
}));

/** @deprecated Use `getCatalog().products` */
export const collections: CollectionItem[] = getCatalog().products;

export type CollectionGroupId = string;
