/**
 * Add only verified buyer feedback here. Do not invent named clients or companies.
 * When empty, the UI shows partnership themes instead of fake testimonials.
 */
export type ReviewItem = {
  id: string;
  quote: string;
  role: string;
  region?: string;
  rating: number;
  verified: boolean;
};

export const verifiedReviews: ReviewItem[] = [];

export const partnershipThemes = [
  {
    id: "t1",
    title: "Specification clarity",
    copy: "Structured discussions on materials, grade, and tolerances before quoting.",
    icon: "clipboard" as const,
  },
  {
    id: "t2",
    title: "Responsive communication",
    copy: "Direct channels for wholesale, private-label, and export questions.",
    icon: "message" as const,
  },
  {
    id: "t3",
    title: "Relationship-first supply",
    copy: "Long-term sourcing alignment — not one-off transactions.",
    icon: "handshake" as const,
  },
];
