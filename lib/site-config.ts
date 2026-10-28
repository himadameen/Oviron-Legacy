/**
 * Replace placeholders with verified business details before launch.
 * Leave empty strings to disable outbound links and show setup instructions.
 */
export const siteConfig = {
  name: "Oviron",
  legalName: "Oviron",
  /** Navbar, footer, and mobile menu lockup */
  logoTagline: "Global Trade • Import • Export",
  tagline: "Crafted for Distinction. Built for the World.",
  /** Digital / PDF catalogue cover headline */
  catalogueTitle: "Product Catalogue",
  description:
    "Explore leather footwear sourcing, wholesale supply, and private-label opportunities with Oviron. Contact us to discuss product specifications and export requirements.",
  /** Canonical site URL — set to your production domain, e.g. https://www.oviron.com */
  domain: process.env.NEXT_PUBLIC_SITE_URL ?? "",
  locale: "en_US",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  businessEmail: process.env.NEXT_PUBLIC_BUSINESS_EMAIL ?? "",
  linkedInUrl: process.env.NEXT_PUBLIC_LINKEDIN_URL ?? "",
} as const;

export const siteMedia = {
  bannerVideoUrl: process.env.NEXT_PUBLIC_BANNER_VIDEO_URL ?? "",
  /** Poster frame until video is configured — replace in lib/images.ts */
  bannerPoster: process.env.NEXT_PUBLIC_BANNER_POSTER ?? "",
} as const;

export function isContactConfigured(
  channel: "whatsapp" | "email" | "linkedin"
): boolean {
  switch (channel) {
    case "whatsapp":
      return Boolean(siteConfig.whatsappNumber.replace(/\D/g, ""));
    case "email":
      return Boolean(siteConfig.businessEmail);
    case "linkedin":
      return Boolean(siteConfig.linkedInUrl);
  }
}
