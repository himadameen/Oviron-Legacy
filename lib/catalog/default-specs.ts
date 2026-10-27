import type { CatalogApiProductSpecs } from "./types";
import {
  sizeMatrixAccessory,
  sizeMatrixStandard,
  type SizeMatrix,
} from "../sizing";

export function defaultSpecsForMainCategory(
  mainCategoryId: string
): Required<CatalogApiProductSpecs> {
  const base = (sizes: SizeMatrix): Required<CatalogApiProductSpecs> => ({
    typicalUse: "B2B wholesale — specifications confirmed per order",
    upperMaterial: "Materials confirmed per SKU and destination market",
    lining: "As per approved sample",
    soleType: "Construction confirmed per style",
    construction: "Supplier feasibility reviewed per design",
    sizes,
    colorRuns: "Palette agreed per season or program",
    gradeOptions: "Internal grades A+ through C — per supplier",
    privateLabel: "Branding & packaging scoped at MOQ",
    packaging: "Retail or export — buyer brief",
  });

  switch (mainCategoryId) {
    case "shoes":
      return {
        ...base(sizeMatrixStandard),
        typicalUse: "Footwear wholesale & private-label programs",
        upperMaterial: "Full-grain or agreed leather grade",
        soleType: "Leather or rubber unit — style dependent",
        construction: "Cemented / welt — per specification",
      };
    case "belts":
      return {
        ...base(sizeMatrixAccessory),
        typicalUse: "Retail & uniform belt programs",
        upperMaterial: "Full-grain leather",
        lining: "Leather or split backing",
        soleType: "N/A",
        construction: "Stitched edge / bonded — per design",
        sizes: sizeMatrixAccessory,
      };
    case "bags":
      return {
        ...base(sizeMatrixAccessory),
        typicalUse: "Retail, corporate gifting, travel retail",
        upperMaterial: "Leather or leather-textile combination",
        lining: "Textile or suede lining",
        soleType: "N/A",
        construction: "Reinforced stress points — spec per model",
      };
    case "wallets":
      return {
        ...base(sizeMatrixAccessory),
        typicalUse: "Retail sets & private-label gifting",
        upperMaterial: "Leather — grade per price band",
        lining: "Leather or RFID lining optional",
        soleType: "N/A",
        construction: "Machine or hand-finished — per SKU",
      };
    case "others":
      return {
        ...base(sizeMatrixAccessory),
        typicalUse: "Display, gifting, and boutique add-ons",
        upperMaterial: "Leather, wood, or mixed materials — per design",
        lining: "Interior finish per specification",
        soleType: "N/A",
        construction: "Custom build — MOQ dependent",
      };
    default:
      return base(sizeMatrixStandard);
  }
}

export function mergeSpecs(
  mainCategoryId: string,
  partial?: CatalogApiProductSpecs
): Required<CatalogApiProductSpecs> {
  const defaults = defaultSpecsForMainCategory(mainCategoryId);
  return {
    ...defaults,
    ...partial,
    sizes: partial?.sizes ?? defaults.sizes,
  };
}
