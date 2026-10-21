/**
 * Replace sample entries with verified client/customer feedback before campaigns.
 * Do not use real names or companies unless confirmed.
 */
export type ReviewItem = {
  id: string;
  quote: string;
  role: string;
  region?: string;
  rating: number;
  verified: boolean;
};

export type FeedbackEntry = {
  id: string;
  audience: "client" | "customer";
  quote: string;
  attribution: string;
  rating: number;
  tags: string[];
  verified: boolean;
};

/** Legacy verified list — if populated, takes precedence in UI */
export const verifiedReviews: ReviewItem[] = [];

/** Editable feedback shown in UI (swap with verified quotes) */
export const feedbackEntries: FeedbackEntry[] = [
  {
    id: "c1",
    audience: "client",
    quote:
      "Clear grade discussions and specification alignment before we committed to a style run.",
    attribution: "Wholesale footwear buyer",
    rating: 5,
    tags: ["Specs", "Grades"],
    verified: false,
  },
  {
    id: "c2",
    audience: "client",
    quote:
      "Private-label packaging and logo placement were handled step-by-step with realistic MOQ conversations.",
    attribution: "Private-label manager",
    rating: 5,
    tags: ["Private label", "MOQ"],
    verified: false,
  },
  {
    id: "c3",
    audience: "client",
    quote:
      "Responsive on WhatsApp and email — helpful for international time zones and urgent assortment decisions.",
    attribution: "Regional distributor",
    rating: 4.5,
    tags: ["Communication"],
    verified: false,
  },
  {
    id: "c4",
    audience: "client",
    quote:
      "Export documentation and shipping expectations were explained early, not after the order was placed.",
    attribution: "Export-focused retailer",
    rating: 5,
    tags: ["Export"],
    verified: false,
  },
  {
    id: "u1",
    audience: "customer",
    quote:
      "Assortment photos and category options made it easy to shortlist styles for our seasonal buy.",
    attribution: "Retail buying team",
    rating: 5,
    tags: ["Assortment"],
    verified: false,
  },
  {
    id: "u2",
    audience: "customer",
    quote:
      "Sample discussions were transparent on timeline and cost — no surprises on specifications.",
    attribution: "Footwear category lead",
    rating: 4.5,
    tags: ["Samples"],
    verified: false,
  },
  {
    id: "u3",
    audience: "customer",
    quote:
      "Virtual call helped align target price, quantity, and destination before formal quotation.",
    attribution: "Sourcing coordinator",
    rating: 5,
    tags: ["Quotation"],
    verified: false,
  },
  {
    id: "u4",
    audience: "customer",
    quote:
      "Professional presentation of collections and gallery references supported our internal approvals.",
    attribution: "Merchandising partner",
    rating: 5,
    tags: ["Presentation"],
    verified: false,
  },
];

export function averageRating(entries: FeedbackEntry[]): number {
  if (entries.length === 0) return 0;
  const sum = entries.reduce((acc, e) => acc + e.rating, 0);
  return Math.round((sum / entries.length) * 10) / 10;
}
