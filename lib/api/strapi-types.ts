/**
 * Types for Strapi proxy POST APIs (/api/home, /api/catalog, /api/product, /api/stats).
 * Field names match the backend contract you provided.
 */

import type { CatalogApiProductSpecs } from "@/lib/catalog/types";

export type StrapiBrand = {
  slug: string;
  name: string;
  legalName?: string;
  logoTagline?: string;
  tagline?: string;
  aboutBrand?: string;
  skuPrefix?: string;
};

export type StrapiCategory = {
  id: string;
  label: string;
  subtitle?: string;
  sortOrder?: number;
};

export type StrapiSubcategory = {
  id: string;
  label: string;
  description?: string;
  sortOrder?: number;
};

/** Product as returned on home and catalog list endpoints */
export type StrapiListProduct = {
  id: string;
  sku: string;
  name: string;
  description: string;
  imageUrl: string;
  imageUrls?: string[];
  imageAlt: string;
  specs?: CatalogApiProductSpecs;
  quantityAvailable?: number;
  tags?: string[];
  isActive?: boolean;
  subCategoryId?: string;
  subCategoryLabel?: string;
  /** Present when API includes main category on each row */
  mainCategoryId?: string;
};

export type StrapiPagination = {
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
};

export type StrapiHomeResponse = {
  brand?: StrapiBrand;
  categories: StrapiCategory[];
  products: StrapiListProduct[];
  pagination?: StrapiPagination;
};

export type StrapiCatalogResponse = {
  category: StrapiCategory;
  subcategories: StrapiSubcategory[];
  products: StrapiListProduct[];
  pagination?: StrapiPagination;
};

export type StrapiProductDetail = {
  category?: StrapiCategory;
  subCategory?: StrapiSubcategory;
  product: StrapiListProduct & {
    specs?: CatalogApiProductSpecs;
  };
};

export type StrapiStatsResponse = {
  brand?: StrapiBrand;
  totals: {
    activeProducts: number;
    mainCategories: number;
    subCategories: number;
  };
};
