import { faqItems } from "./faq";
import { siteConfig } from "./site-config";
import { absoluteSiteUrl } from "./site-url";

function absoluteUrl(path: string): string {
  return absoluteSiteUrl(path, siteConfig.domain);
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.legalName,
    url: absoluteUrl("/"),
    description: siteConfig.description,
    ...(siteConfig.businessEmail
      ? { email: siteConfig.businessEmail }
      : {}),
    sameAs: [
      siteConfig.linkedInUrl || undefined,
    ].filter(Boolean),
  };
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: absoluteUrl("/"),
    description: siteConfig.description,
    inLanguage: "en",
    publisher: {
      "@type": "Organization",
      name: siteConfig.legalName,
    },
  };
}

export function faqPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function professionalServiceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: `${siteConfig.name} — Leather Footwear Sourcing`,
    url: absoluteUrl("/"),
    description: siteConfig.description,
    areaServed: "Worldwide",
    serviceType: [
      "Leather footwear sourcing",
      "Wholesale footwear supply",
      "Private-label footwear coordination",
      "Export buyer enquiries",
    ],
  };
}

export function breadcrumbJsonLd(
  crumbs: ReadonlyArray<{ name: string; path: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

export function productCatalogWebPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Oviron Footwear Manufacturing Catalog",
    description:
      "B2B leather footwear styles — formal, casual, sports, and occasion lines with specifications and quote enquiry.",
    url: absoluteUrl("/products"),
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: absoluteUrl("/"),
    },
    about: {
      "@type": "Thing",
      name: "Leather footwear wholesale and private-label sourcing",
    },
  };
}
