import { categoryLineFor, manufacturingProducts } from "../product-catalog";
import { getProductPath } from "../product-slugs";
import { siteConfig } from "../site-config";
import { absoluteSiteUrl } from "../site-url";
import { getCatalog } from "./index";

export type CatalogueSpecLine = {
  label: string;
  value: string;
};

export type CatalogueProductEntry = {
  id: string;
  sku: string;
  name: string;
  description: string;
  image: string;
  imageAlt: string;
  /** Primary + alternates for catalogue gallery (deduped). */
  images: string[];
  categoryLine: string;
  productPath: string;
  productUrl: string;
  specLines: CatalogueSpecLine[];
};

export type CatalogueSubsection = {
  id: string;
  label: string;
  description?: string;
  products: CatalogueProductEntry[];
};

export type CatalogueSection = {
  id: string;
  label: string;
  subtitle?: string;
  subsections: CatalogueSubsection[];
  productCount: number;
};

export type CatalogueDocument = {
  brandName: string;
  logoTagline: string;
  description: string;
  generatedAtIso: string;
  generatedLabel: string;
  productCount: number;
  sections: CatalogueSection[];
};

function formatGeneratedLabel(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
}

function specLinesForProduct(
  product: (typeof manufacturingProducts)[number]
): CatalogueSpecLine[] {
  return [
    { label: "Typical use", value: product.typicalUse },
    { label: "Upper / material", value: product.upperMaterial },
    { label: "Colors", value: product.colorRuns },
    { label: "Sizes", value: product.sizeLabel },
    { label: "Construction", value: product.construction },
    { label: "Grades", value: product.gradeOptions },
    { label: "Private label", value: product.privateLabel },
    { label: "Packaging", value: product.packaging },
  ].filter((line) => line.value.trim().length > 0);
}

/** Single source for browser catalogue + print/PDF output. */
export function buildCatalogueDocument(now = new Date()): CatalogueDocument {
  const catalog = getCatalog();
  const productById = new Map(
    manufacturingProducts.map((product) => [product.id, product])
  );

  const sections: CatalogueSection[] = catalog.mainCategories.map((main) => {
    const subsections: CatalogueSubsection[] = main.subcategories.map((sub) => ({
      id: sub.id,
      label: sub.label,
      description: sub.description,
      products: sub.products
        .map((item) => productById.get(item.id))
        .filter((p): p is NonNullable<typeof p> => Boolean(p))
        .map((product) => {
          const productPath = getProductPath(product);
          return {
            id: product.id,
            sku: product.skuRef,
            name: product.name,
            description: product.description,
            image: product.image,
            imageAlt: product.imageAlt,
            images: product.galleryImages,
            categoryLine: categoryLineFor(product),
            productPath,
            productUrl: absoluteSiteUrl(productPath, siteConfig.domain),
            specLines: specLinesForProduct(product),
          };
        }),
    }));

    return {
      id: main.id,
      label: main.label,
      subtitle: main.subtitle,
      subsections,
      productCount: subsections.reduce((n, s) => n + s.products.length, 0),
    };
  });

  return {
    brandName: siteConfig.name,
    logoTagline: siteConfig.logoTagline,
    description: siteConfig.description,
    generatedAtIso: now.toISOString(),
    generatedLabel: formatGeneratedLabel(now),
    productCount: catalog.productCount,
    sections,
  };
}
