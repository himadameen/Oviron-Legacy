/**
 * @deprecated Use `@/lib/catalog-context` + `useCatalogContext()` on the client,
 * or `getCatalog()` on the server after `loadCatalog()`.
 */
import type { CatalogProduct } from "./catalog/types";

export type CollectionItem = CatalogProduct;

export type CollectionGroupId = string;

export const collectionGroups: {
  id: string;
  label: string;
  subtitle: string;
}[] = [];

export const collections: CollectionItem[] = [];
