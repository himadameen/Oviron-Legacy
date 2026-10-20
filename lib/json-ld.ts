import { faqItems } from "./faq";
import { siteConfig } from "./site-config";

function absoluteUrl(path: string): string {
  const base = siteConfig.domain || "https://example.com";
  return `${base.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
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
