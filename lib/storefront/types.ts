import type {
  StorefrontMarketing,
  StorefrontSitePayload,
} from "@/lib/api/storefront-types";
import type { ContentGap } from "./content-gaps";

export type ContentSource = "cms" | "fallback" | "mixed";

export type ResolvedStorefront = {
  marketing: StorefrontMarketing;
  site: StorefrontSitePayload;
  sources: { marketing: ContentSource; site: ContentSource };
  /** Fields still using local fallbacks when Strapi is sparse */
  contentGaps?: ContentGap[];
};
