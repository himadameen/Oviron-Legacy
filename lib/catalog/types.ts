import type { SizeMatrix } from "../sizing";

/** Payload shape expected from the catalog API (adjust field names in normalize if needed). */
export type CatalogApiResponse = {
  categories: CatalogApiMainCategory[];
};

export type CatalogApiMainCategory = {
  id: string;
  label: string;
  subtitle?: string;
  sortOrder?: number;
  subcategories: CatalogApiSubcategory[];
};

export type CatalogApiSubcategory = {
  id: string;
  label: string;
  description?: string;
  sortOrder?: number;
  products: CatalogApiProduct[];
};

export type CatalogApiProductSpecs = {
  typicalUse?: string;
  upperMaterial?: string;
  lining?: string;
  soleType?: string;
  construction?: string;
  sizes?: SizeMatrix;
  colorRuns?: string;
  gradeOptions?: string;
  privateLabel?: string;
  packaging?: string;
};

export type CatalogApiProduct = {
  id: string;
  sku: string;
  name: string;
  description: string;
  imageUrl: string;
  /** Additional gallery URLs (primary is imageUrl). */
  imageUrls?: string[];
  imageAlt: string;
  specs?: CatalogApiProductSpecs;
};

/** Normalized catalog — empty branches removed. */
export type CatalogMainCategory = {
  id: string;
  label: string;
  subtitle?: string;
  sortOrder: number;
  subcategories: CatalogSubcategory[];
  productCount: number;
};

export type CatalogSubcategory = {
  id: string;
  label: string;
  description?: string;
  sortOrder: number;
  products: CatalogProduct[];
};

export type CatalogProduct = {
  id: string;
  sku: string;
  name: string;
  description: string;
  image: string;
  /** Deduped gallery — first entry matches primary image when set. */
  gallery: string[];
  imageAlt: string;
  mainCategoryId: string;
  mainCategoryLabel: string;
  subCategoryId: string;
  subCategoryLabel: string;
  /** Display index, e.g. "01" */
  number: string;
  specs: Required<CatalogApiProductSpecs>;
};

export type NormalizedCatalog = {
  mainCategories: CatalogMainCategory[];
  products: CatalogProduct[];
  productCount: number;
};
