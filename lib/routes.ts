/** App routes and home anchors — keep nav, sitemap, and not-found in sync. */
export const siteRoutes = {
  home: "/",
  products: "/products",
  robots: "/robots.txt",
  sitemap: "/sitemap.xml",
} as const;

export const homeSections = {
  assurance: "assurance",
  collections: "collections",
  gallery: "gallery",
  feedback: "feedback",
  faq: "faq",
  contact: "contact",
} as const;

export type HomeSectionId =
  (typeof homeSections)[keyof typeof homeSections];

export function homeHash(section: HomeSectionId): string {
  return `/#${section}`;
}

/** Primary navigation (Header). */
export const primaryNav = [
  { href: homeHash("assurance"), label: "Quality" },
  { href: siteRoutes.products, label: "Products" },
  { href: homeHash("gallery"), label: "Gallery" },
  { href: homeHash("feedback"), label: "Reviews" },
  { href: homeHash("faq"), label: "FAQ" },
] as const;

export const quoteHref = homeHash("contact");

export const footerNav = [
  { href: siteRoutes.products, label: "Product Catalog" },
  { href: homeHash("collections"), label: "Collections" },
  { href: "/#specifications", label: "Specifications" },
  { href: "/#private-label", label: "Private Label" },
  { href: homeHash("faq"), label: "FAQ" },
  { href: homeHash("contact"), label: "Contact" },
] as const;
