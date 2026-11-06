import type { CatalogProduct } from "./catalog";
import { collectionImages, imagePlaceholders, siteImages } from "./images";
import type { ProductTagChip } from "./product-tags";
import { buildProductSeoSlug } from "./product-slugs";
import type { NormalizedCatalog } from "./catalog/types";
import { formatSizeMatrix, type SizeMatrix } from "./sizing";

export type ManufacturingProduct = CatalogProduct & {
  seoSlug: string;
  skuRef: string;
  /** Display chips from API tags (max 2). */
  productTags: ProductTagChip[];
  typicalUse: string;
  upperMaterial: string;
  lining: string;
  soleType: string;
  construction: string;
  sizes: SizeMatrix;
  sizeLabel: string;
  colorRuns: string;
  gradeOptions: string;
  privateLabel: string;
  packaging: string;
  galleryImages: string[];
};

function galleryForProduct(
  item: CatalogProduct,
  peers: CatalogProduct[]
): string[] {
  if (item.gallery.length > 1) {
    return item.gallery.slice(0, 8);
  }

  const groupPeers = peers
    .filter(
      (c) =>
        c.mainCategoryId === item.mainCategoryId &&
        c.subCategoryId === item.subCategoryId &&
        c.id !== item.id
    )
    .map((c) => c.image);

  const pool = [
    item.image,
    ...groupPeers,
    imagePlaceholders.collection,
    imagePlaceholders.hero,
    imagePlaceholders.editorial,
    siteImages.approach,
    siteImages.texture,
    siteImages.hero,
    ...Object.values(collectionImages),
  ];

  const unique: string[] = [];
  for (const src of pool) {
    if (!src || unique.includes(src)) continue;
    unique.push(src);
    if (unique.length >= 4) break;
  }

  return unique.length > 0 ? unique : [item.image];
}

function toManufacturingProduct(
  item: CatalogProduct,
  all: CatalogProduct[]
): ManufacturingProduct {
  const { specs } = item;
  const tags: ProductTagChip[] = item.productTags?.length
    ? item.productTags
    : [];

  return {
    ...item,
    skuRef: item.sku,
    seoSlug: buildProductSeoSlug({ skuRef: item.sku, name: item.name }),
    productTags: tags,
    typicalUse: specs.typicalUse,
    upperMaterial: specs.upperMaterial,
    lining: specs.lining,
    soleType: specs.soleType,
    construction: specs.construction,
    sizes: specs.sizes,
    sizeLabel: formatSizeMatrix(specs.sizes),
    colorRuns: specs.colorRuns,
    gradeOptions: specs.gradeOptions,
    privateLabel: specs.privateLabel,
    packaging: specs.packaging,
    galleryImages: galleryForProduct(item, all),
  };
}

/** All products from a loaded normalized catalog (live API data). */
export function manufacturingProductsFromCatalog(
  catalog: Pick<NormalizedCatalog, "products">
): ManufacturingProduct[] {
  const { products } = catalog;
  return products.map((p) => toManufacturingProduct(p, products));
}

export function getProductById(
  id: string,
  catalog: Pick<NormalizedCatalog, "products">
): ManufacturingProduct | undefined {
  const row = catalog.products.find((p) => p.id === id);
  return row
    ? toManufacturingProduct(row, catalog.products)
    : undefined;
}

export function getProductBySeoSlug(
  slug: string,
  catalog: Pick<NormalizedCatalog, "products">
): ManufacturingProduct | null {
  const normalized = slug.trim().toLowerCase();
  const list = manufacturingProductsFromCatalog(catalog);
  return list.find((p) => p.seoSlug === normalized) ?? null;
}

export function categoryLineFor(product: {
  mainCategoryLabel: string;
  subCategoryLabel: string;
}): string {
  return `${product.mainCategoryLabel} · ${product.subCategoryLabel}`;
}

export { formatSizeMatrix };
