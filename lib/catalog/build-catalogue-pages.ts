import { siteConfig } from "../site-config";
import type {
  CatalogueDocument,
  CatalogueProductEntry,
} from "./build-catalogue-document";

export type CatalogueBookPage =
  | {
      type: "cover";
      brandName: string;
      logoTagline: string;
      tagline: string;
      edition: string;
      productCount: number;
      heroImage: string;
    }
  | {
      type: "welcome";
      brandName: string;
      description: string;
      edition: string;
    }
  | {
      type: "toc";
      items: { id: string; label: string; page: number; count: number }[];
    }
  | {
      type: "section";
      sectionId: string;
      label: string;
      subtitle?: string;
      heroImage: string;
      heroAlt: string;
      subLabels: string[];
    }
  | {
      type: "products";
      sectionLabel: string;
      subLabel: string;
      products: CatalogueProductEntry[];
    }
  | {
      type: "closing";
      brandName: string;
      logoTagline: string;
      edition: string;
    }
  | { type: "blank" };

/** One style per page — full specifications without extra navigation. */
const PRODUCTS_PER_PAGE = 1;

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}

function firstProductImage(doc: CatalogueDocument): string {
  for (const section of doc.sections) {
    for (const sub of section.subsections) {
      const product = sub.products[0];
      if (product?.image) return product.image;
    }
  }
  return "";
}

/** Flat A4 pages for flipbook + PDF export (even length for spreads). */
export function buildCatalogueBookPages(doc: CatalogueDocument): CatalogueBookPage[] {
  const edition = doc.generatedLabel;
  const heroImage = firstProductImage(doc);

  const cover: CatalogueBookPage = {
    type: "cover",
    brandName: doc.brandName,
    logoTagline: doc.logoTagline,
    tagline: siteConfig.tagline,
    edition,
    productCount: doc.productCount,
    heroImage,
  };

  const welcome: CatalogueBookPage = {
    type: "welcome",
    brandName: doc.brandName,
    description: doc.description,
    edition,
  };

  const body: CatalogueBookPage[] = [];

  for (const section of doc.sections) {
    if (section.productCount === 0) continue;

    const hero =
      section.subsections.find((s) => s.products[0])?.products[0] ?? null;

    body.push({
      type: "section",
      sectionId: section.id,
      label: section.label,
      subtitle: section.subtitle,
      heroImage: hero?.image ?? heroImage,
      heroAlt: hero?.imageAlt ?? section.label,
      subLabels: section.subsections
        .filter((s) => s.products.length > 0)
        .map((s) => s.label),
    });

    for (const sub of section.subsections) {
      if (sub.products.length === 0) continue;
      for (const group of chunk(sub.products, PRODUCTS_PER_PAGE)) {
        body.push({
          type: "products",
          sectionLabel: section.label,
          subLabel: sub.label,
          products: group,
        });
      }
    }
  }

  body.push({
    type: "closing",
    brandName: doc.brandName,
    logoTagline: doc.logoTagline,
    edition,
  });

  const pages: CatalogueBookPage[] = [cover, welcome, { type: "toc", items: [] }, ...body];

  const tocItems = doc.sections
    .filter((s) => s.productCount > 0)
    .map((section) => {
      const pageIndex = pages.findIndex(
        (p) => p.type === "section" && p.sectionId === section.id
      );
      return {
        id: section.id,
        label: section.label,
        page: pageIndex >= 0 ? pageIndex + 1 : 0,
        count: section.productCount,
      };
    });

  pages[2] = { type: "toc", items: tocItems };

  return pages;
}
