import { getCatalog, type CatalogProduct } from "./catalog";
import { collectionImages, imagePlaceholders, siteImages } from "./images";
import { buildProductSeoSlug } from "./product-slugs";
import { formatSizeMatrix, type SizeMatrix } from "./sizing";

export type ManufacturingProduct = CatalogProduct & {
  seoSlug: string;
  skuRef: string;
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
  return {
    ...item,
    skuRef: item.sku,
    seoSlug: buildProductSeoSlug({ skuRef: item.sku, name: item.name }),
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

function buildManufacturingProducts(): ManufacturingProduct[] {
  const { products } = getCatalog();
  return products.map((p) => toManufacturingProduct(p, products));
}

export const manufacturingProducts: ManufacturingProduct[] =
  buildManufacturingProducts();

export function categoryLineFor(product: {
  mainCategoryLabel: string;
  subCategoryLabel: string;
}): string {
  return `${product.mainCategoryLabel} · ${product.subCategoryLabel}`;
}

export function getProductById(id: string): ManufacturingProduct | undefined {
  return manufacturingProducts.find((p) => p.id === id);
}

export { formatSizeMatrix, getCatalog };
