import {
  collectionGroups,
  collections,
  type CollectionGroupId,
  type CollectionItem,
} from "./collections";
import { collectionImages, imagePlaceholders, siteImages } from "./images";
import {
  formatSizeMatrix,
  sizeMatrixCompact,
  sizeMatrixStandard,
  type SizeMatrix,
} from "./sizing";

export type ManufacturingProduct = CollectionItem & {
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

type ManufacturingDetails = Omit<
  ManufacturingProduct,
  keyof CollectionItem | "sizeLabel" | "galleryImages"
>;

/** At least 3 distinct frames for the card slider (placeholders + category pool). */
function galleryForProduct(item: CollectionItem): string[] {
  const groupPeers = collections
    .filter((c) => c.group === item.group && c.id !== item.id)
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

const manufacturingById: Record<string, ManufacturingDetails> = {
  oxford: {
    skuRef: "OV-FM-01",
    typicalUse: "Corporate, formal retail, uniform programs",
    upperMaterial: "Full-grain leather (grade agreed per order)",
    lining: "Leather or textile — confirmed per SKU",
    soleType: "Leather sole or rubber unit — style dependent",
    construction: "Cemented / welt options discussed per spec",
    sizes: sizeMatrixStandard,
    colorRuns: "Black, brown, oxblood — custom swatches available",
    gradeOptions: "A+ through C — internal supplier labels",
    privateLabel: "Logo, insole, box — feasibility per MOQ",
    packaging: "Retail box or export carton — buyer brief",
  },
  office: {
    skuRef: "OV-FM-02",
    typicalUse: "Office wear, wholesale assortments",
    upperMaterial: "Corrected or full-grain leather",
    lining: "Breathable textile or leather",
    soleType: "Rubber heel & sole — anti-slip options",
    construction: "Cemented construction standard",
    sizes: sizeMatrixStandard,
    colorRuns: "Black, tan, dark brown",
    gradeOptions: "A+ through C",
    privateLabel: "Supported subject to approval",
    packaging: "Brand-ready or neutral export pack",
  },
  loafers: {
    skuRef: "OV-FM-03",
    typicalUse: "Premium casual, boutique lines",
    upperMaterial: "Soft full-grain or nubuck",
    lining: "Leather lining preferred",
    soleType: "Leather or lightweight rubber",
    construction: "Moccasin or cemented — per design",
    sizes: sizeMatrixCompact,
    colorRuns: "Brown, navy, black, suede tones",
    gradeOptions: "A+ through B typical for retail",
    privateLabel: "Hardware & label customization",
    packaging: "Dust bag option on request",
  },
  driving: {
    skuRef: "OV-CA-04",
    typicalUse: "Resort, driving, soft casual wholesale",
    upperMaterial: "Softy leather or suede",
    lining: "Leather or unlined options",
    soleType: "Rubber pebble sole",
    construction: "Hand-lasted moccasin style",
    sizes: sizeMatrixStandard,
    colorRuns: "Earth tones, navy, classic neutrals",
    gradeOptions: "A through C",
    privateLabel: "Emboss / deboss logo on vamp",
    packaging: "Export bulk or retail-ready",
  },
  casual: {
    skuRef: "OV-CA-05",
    typicalUse: "High-volume casual programs",
    upperMaterial: "Leather or leather-textile mix",
    lining: "Textile mesh for comfort",
    soleType: "TR or rubber cup sole",
    construction: "Cemented — production efficient",
    sizes: sizeMatrixStandard,
    colorRuns: "Seasonal palettes — 3–6 colors typical",
    gradeOptions: "A through C for volume lines",
    privateLabel: "Full brand package available",
    packaging: "Carton ratio optimized for export",
  },
  boat: {
    skuRef: "OV-CA-06",
    typicalUse: "Resort, marina, summer retail",
    upperMaterial: "Oiled leather or canvas-leather",
    lining: "Textile, moisture-friendly",
    soleType: "Non-marking rubber",
    construction: "Cemented, siped sole pattern",
    sizes: sizeMatrixCompact,
    colorRuns: "Navy, white, tan, two-tone",
    gradeOptions: "A through B+",
    privateLabel: "Side label & box print",
    packaging: "Retail or twin-pair export",
  },
  sneakers: {
    skuRef: "OV-SP-07",
    typicalUse: "Fashion sneaker, lifestyle wholesale",
    upperMaterial: "Leather panels with textile inserts",
    lining: "Mesh textile",
    soleType: "EVA / rubber cup sole",
    construction: "Strobel or cemented",
    sizes: sizeMatrixStandard,
    colorRuns: "White-base + accent colors",
    gradeOptions: "A+ through B",
    privateLabel: "Tongue, heel, outsole branding",
    packaging: "Retail box with tissue insert",
  },
  active: {
    skuRef: "OV-SP-08",
    typicalUse: "Active casual, travel retail",
    upperMaterial: "Leather with performance textile",
    lining: "Padded textile collar",
    soleType: "Lightweight rubber trail pattern",
    construction: "Cemented with reinforced toe",
    sizes: sizeMatrixStandard,
    colorRuns: "Charcoal, black, olive accents",
    gradeOptions: "A through B",
    privateLabel: "Reflective & logo options",
    packaging: "Export cartons or hang-tag retail",
  },
  occasion: {
    skuRef: "OV-OT-09",
    typicalUse: "Festival, wedding guest, occasion packs",
    upperMaterial: "Embellished or plain leather",
    lining: "Leather or satin-feel textile",
    soleType: "Leather or low-profile rubber",
    construction: "Cemented — detail per design",
    sizes: sizeMatrixCompact,
    colorRuns: "Metallic, patent, classic black",
    gradeOptions: "A+ through B — detail sensitive",
    privateLabel: "Custom last & ornament discussion",
    packaging: "Gift box programs on request",
  },
};

export const manufacturingProducts: ManufacturingProduct[] = collections.map(
  (item) => {
    const details = manufacturingById[item.id];
    return {
      ...item,
      ...details,
      sizeLabel: formatSizeMatrix(details.sizes),
      galleryImages: galleryForProduct(item),
    };
  }
);

export function groupLabelFor(id: CollectionGroupId): string {
  return collectionGroups.find((g) => g.id === id)?.label ?? id;
}

export { collectionGroups, formatSizeMatrix };
