import { collectionImages } from "../images";
import {
  sizeMatrixCompact,
  sizeMatrixStandard,
} from "../sizing";
import type { CatalogApiResponse } from "./types";

/**
 * Stand-in until `NEXT_PUBLIC_CATALOG_API_URL` is wired.
 * Replace by returning the same JSON shape from your API.
 */
export const mockCatalogApiResponse: CatalogApiResponse = {
  categories: [
    {
      id: "shoes",
      label: "Shoes",
      subtitle: "Footwear sourcing & private label",
      sortOrder: 1,
      subcategories: [
        {
          id: "formal",
          label: "Formal",
          description: "Dress & business profiles",
          sortOrder: 1,
          products: [
            {
              id: "oxford",
              sku: "OV-SH-01",
              name: "Oxford Formal",
              description: "Classic closed lacing",
              imageUrl: collectionImages.formal,
              imageAlt: "Formal oxford leather shoes",
              specs: {
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
            },
            {
              id: "office",
              sku: "OV-SH-02",
              name: "Business Derby",
              description: "Office-ready leather",
              imageUrl: collectionImages.office,
              imageAlt: "Business leather derby shoes",
              specs: {
                typicalUse: "Office wear, wholesale assortments",
                upperMaterial: "Corrected or full-grain leather",
                lining: "Breathable textile or leather",
                soleType: "Rubber heel & sole — anti-slip options",
                construction: "Cemented construction standard",
                sizes: sizeMatrixStandard,
                colorRuns: "Black, tan, dark brown",
              },
            },
          ],
        },
        {
          id: "casual",
          label: "Casual",
          description: "Everyday leather lines",
          sortOrder: 2,
          products: [
            {
              id: "casual",
              sku: "OV-SH-05",
              name: "Casual Lace-Up",
              description: "Relaxed wholesale line",
              imageUrl: collectionImages.casual,
              imageAlt: "Casual leather lace-up",
            },
            {
              id: "driving",
              sku: "OV-SH-04",
              name: "Driving Moccasin",
              description: "Soft casual luxury",
              imageUrl: collectionImages.driving,
              imageAlt: "Leather driving moccasin",
            },
            {
              id: "boat",
              sku: "OV-SH-06",
              name: "Deck & Resort",
              description: "Light resort profiles",
              imageUrl: collectionImages.loafers,
              imageAlt: "Casual deck style leather shoe",
            },
          ],
        },
        {
          id: "loafers",
          label: "Loafers",
          description: "Slip-on refinement",
          sortOrder: 3,
          products: [
            {
              id: "loafers",
              sku: "OV-SH-03",
              name: "Premium Loafers",
              description: "Slip-on refinement",
              imageUrl: collectionImages.loafers,
              imageAlt: "Premium leather loafers",
              specs: {
                sizes: sizeMatrixCompact,
                colorRuns: "Brown, navy, black, suede tones",
              },
            },
          ],
        },
        {
          id: "boots",
          label: "Boots",
          description: "Ankle & lace-up boot profiles",
          sortOrder: 4,
          products: [
            {
              id: "chelsea-boot",
              sku: "OV-SH-10",
              name: "Chelsea Boot",
              description: "Elastic-side wholesale boot",
              imageUrl: collectionImages.formal,
              imageAlt: "Leather chelsea boot",
              specs: {
                typicalUse: "Autumn/winter retail & uniform",
                sizes: sizeMatrixStandard,
                colorRuns: "Black, tan, oxblood",
              },
            },
          ],
        },
      ],
    },
    {
      id: "belts",
      label: "Belts",
      subtitle: "Leather belt programs",
      sortOrder: 2,
      subcategories: [
        {
          id: "formal",
          label: "Formal",
          sortOrder: 1,
          products: [
            {
              id: "belt-formal-classic",
              sku: "OV-BL-01",
              name: "Classic Dress Belt",
              description: "Pin buckle — uniform & retail",
              imageUrl: collectionImages.formal,
              imageAlt: "Formal leather dress belt",
              specs: {
                colorRuns: "Black, brown",
                sizes: sizeMatrixStandard,
              },
            },
          ],
        },
        {
          id: "casual",
          label: "Casual",
          sortOrder: 2,
          products: [
            {
              id: "belt-casual-web",
              sku: "OV-BL-02",
              name: "Casual Leather Belt",
              description: "Matte hardware options",
              imageUrl: collectionImages.casual,
              imageAlt: "Casual leather belt",
            },
          ],
        },
        {
          id: "design",
          label: "Design",
          sortOrder: 3,
          products: [
            {
              id: "belt-design-plaque",
              sku: "OV-BL-03",
              name: "Designer Plaque Belt",
              description: "Custom plaque & emboss",
              imageUrl: collectionImages.party,
              imageAlt: "Designer leather belt",
            },
          ],
        },
      ],
    },
    {
      id: "bags",
      label: "Bags",
      subtitle: "Business & lifestyle carry",
      sortOrder: 3,
      subcategories: [
        {
          id: "laptop",
          label: "Laptop",
          sortOrder: 1,
          products: [
            {
              id: "bag-laptop-slim",
              sku: "OV-BG-01",
              name: "Slim Laptop Brief",
              description: "13–15″ laptop chamber",
              imageUrl: collectionImages.office,
              imageAlt: "Leather laptop bag",
            },
          ],
        },
        {
          id: "handbag",
          label: "HandBag",
          sortOrder: 2,
          products: [
            {
              id: "bag-hand-tote",
              sku: "OV-BG-02",
              name: "Structured Tote",
              description: "Day-to-office profile",
              imageUrl: collectionImages.loafers,
              imageAlt: "Leather handbag",
            },
          ],
        },
        {
          id: "premium",
          label: "Premium Bag",
          sortOrder: 3,
          products: [
            {
              id: "bag-premium-weekend",
              sku: "OV-BG-03",
              name: "Weekend Holdall",
              description: "Full-grain travel holdall",
              imageUrl: collectionImages.formal,
              imageAlt: "Premium leather holdall",
            },
          ],
        },
        {
          id: "sling",
          label: "Sling Bag",
          sortOrder: 4,
          products: [
            {
              id: "bag-sling-cross",
              sku: "OV-BG-04",
              name: "Crossbody Sling",
              description: "Compact crossbody",
              imageUrl: collectionImages.driving,
              imageAlt: "Leather sling bag",
            },
          ],
        },
        {
          id: "cashier",
          label: "Cashier Bag",
          sortOrder: 5,
          products: [
            {
              id: "bag-cashier-messenger",
              sku: "OV-BG-05",
              name: "Messenger Cashier",
              description: "Retail & hospitality use",
              imageUrl: collectionImages.casual,
              imageAlt: "Leather messenger bag",
            },
          ],
        },
      ],
    },
    {
      id: "wallets",
      label: "Wallets",
      subtitle: "Small leather goods",
      sortOrder: 4,
      subcategories: [
        {
          id: "two-fold",
          label: "Two Fold",
          sortOrder: 1,
          products: [
            {
              id: "wallet-bifold",
              sku: "OV-WL-01",
              name: "Bi-Fold Wallet",
              description: "Classic billfold",
              imageUrl: collectionImages.formal,
              imageAlt: "Leather bi-fold wallet",
            },
          ],
        },
        {
          id: "three-fold",
          label: "Three Fold",
          sortOrder: 2,
          products: [
            {
              id: "wallet-trifold",
              sku: "OV-WL-02",
              name: "Tri-Fold Wallet",
              description: "Compact tri-fold",
              imageUrl: collectionImages.office,
              imageAlt: "Leather tri-fold wallet",
            },
          ],
        },
        {
          id: "card-holder",
          label: "Card Holder",
          sortOrder: 3,
          products: [
            {
              id: "wallet-card-slim",
              sku: "OV-WL-03",
              name: "Slim Card Holder",
              description: "Minimal card sleeve",
              imageUrl: collectionImages.driving,
              imageAlt: "Leather card holder",
            },
          ],
        },
      ],
    },
    {
      id: "others",
      label: "Others",
      subtitle: "Boxes & display",
      sortOrder: 5,
      subcategories: [
        {
          id: "jewel-box",
          label: "Jewel Box",
          sortOrder: 1,
          products: [
            {
              id: "other-jewel-box",
              sku: "OV-OT-01",
              name: "Jewellery Box",
              description: "Velvet-lined presentation box",
              imageUrl: collectionImages.party,
              imageAlt: "Leather jewellery box",
            },
          ],
        },
        {
          id: "watch-box",
          label: "Watch Box",
          sortOrder: 2,
          products: [
            {
              id: "other-watch-box",
              sku: "OV-OT-02",
              name: "Watch Box",
              description: "Single & double watch cases",
              imageUrl: collectionImages.party,
              imageAlt: "Leather watch box",
            },
          ],
        },
      ],
    },
  ],
};
