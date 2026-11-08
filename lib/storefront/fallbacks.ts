import { feedbackEntries } from "@/lib/reviews";
import { faqItems } from "@/lib/faq";
import { galleryItems } from "@/lib/gallery";
import { brandLogo, imagePlaceholders, siteImages } from "@/lib/images";
import { siteConfig, siteMedia } from "@/lib/site-config";
import type {
  StorefrontMarketing,
  StorefrontSitePayload,
} from "@/lib/api/storefront-types";
import type { ResolvedStorefront } from "./types";

export const fallbackMarketing: StorefrontMarketing = {
  introSplash: {
    enabled: true,
    pre: "Leather footwear sourcing",
    title: siteConfig.name,
    tagline: "Where the luxury ends.",
    durationMs: 2800,
  },
  hero: {
    eyebrow: "Footwear sourcing & supply",
    title: "Crafted for distinction.",
    titleAccent: "Built for the world.",
    copy: "B2B leather footwear sourcing, wholesale supply, and private-label opportunities.",
    highlights: [
      { label: "Wholesale sourcing", sortOrder: 1 },
      { label: "Export enquiries", sortOrder: 2 },
    ],
    ctaPrimary: { label: "Get a Quote", href: "#contact" },
    ctaSecondary: { label: "View Catalogue", href: "/catalogue" },
    slides: [
      {
        sortOrder: 1,
        image: { url: imagePlaceholders.hero, alt: "Leather footwear sourcing showcase placeholder" },
      },
      {
        sortOrder: 2,
        image: { url: imagePlaceholders.collection, alt: "Leather collection placeholder" },
      },
      {
        sortOrder: 3,
        image: { url: imagePlaceholders.editorial, alt: "Editorial footwear placeholder" },
      },
    ],
    slideIntervalMs: 5000,
  },
  campaignBanner: {
    enabled: true,
    eyebrow: "Campaign · Studio shoot",
    title: "Replace with your professional footage",
    hint: siteMedia.bannerVideoUrl
      ? undefined
      : "Add video or poster in site settings",
    ariaLabel: "Campaign banner",
    video: siteMedia.bannerVideoUrl
      ? { url: siteMedia.bannerVideoUrl, poster: siteMedia.bannerPoster ? { url: siteMedia.bannerPoster, alt: "Campaign poster" } : undefined }
      : undefined,
    fallbackImage: {
      url: siteMedia.bannerPoster || siteImages.hero,
      alt: "Campaign banner — add your professional shoot video or poster",
    },
  },
  gallery: {
    sectionTitle: "Gallery",
    sectionSubtitle: "Representative styles and materials",
    items: galleryItems.map((item, index) => ({
      id: item.id,
      title: item.title,
      sortOrder: index + 1,
      span: item.span ?? "normal",
      image: { url: item.image, alt: item.imageAlt },
    })),
  },
  approach: {
    eyebrow: "Our approach",
    title: "Partnerships begin with clarity.",
    lead: "Structured discussions before quotation.",
    steps: [
      { n: "01", title: "Product-Led", copy: "Category, material, finish, and market.", sortOrder: 1 },
      { n: "02", title: "Grade Clarity", copy: "Internal grade and tolerances agreed upfront.", sortOrder: 2 },
      { n: "03", title: "Buyer-First", copy: "Virtual alignment on requirements and next steps.", sortOrder: 3 },
    ],
    image: { url: siteImages.approach, alt: "Formal leather footwear — illustrative" },
  },
  privateLabel: {
    eyebrow: "Private label",
    title: "Your brand. Your vision.",
    lead: "Customization discussed subject to supplier feasibility.",
    points: [
      { label: "Custom design", sortOrder: 1 },
      { label: "Materials & colors", sortOrder: 2 },
      { label: "Packaging", sortOrder: 3 },
      { label: "MOQ & samples", sortOrder: 4 },
    ],
    image: { url: siteImages.privateLabel, alt: "Private-label leather footwear — illustrative" },
  },
  faq: {
    items: faqItems.map((item, index) => ({
      id: item.id,
      question: item.question,
      answer: item.answer,
      sortOrder: index + 1,
    })),
  },
  testimonials: {
    items: feedbackEntries.map((e, index) => ({
      id: e.id,
      audience: e.audience,
      quote: e.quote,
      attribution: e.attribution,
      rating: e.rating,
      tags: e.tags,
      verified: e.verified,
      sortOrder: index + 1,
    })),
  },
  buyerProcess: {
    eyebrow: "Buyer journey",
    title: "From brief to program.",
    lead: "A clear path for wholesale and private-label enquiries.",
    steps: [
      { id: "s1", title: "Share brief", copy: "Category, qty, destination", sortOrder: 1 },
      { id: "s2", title: "Align specs", copy: "Materials, grade, branding", sortOrder: 2 },
      { id: "s3", title: "Meet virtually", copy: "Clarify terms & requirements", sortOrder: 3 },
      { id: "s4", title: "Review proposal", copy: "Quote, samples, shipping", sortOrder: 4 },
    ],
  },
  qualityGrades: {
    eyebrow: "Grades",
    title: "Options for different needs.",
    lead: "Internal supplier labels — agreed per product before order.",
    disclaimer:
      "Labels vary by supplier — condition and tolerances confirmed per SKU.",
    grades: ["A+", "A", "B+", "B", "C+", "C"].map((label, index) => ({
      id: label.toLowerCase().replace("+", "-plus"),
      label,
      sortOrder: index + 1,
    })),
  },
  footerBlurb:
    "Leather footwear sourcing, wholesale & private-label enquiries.",
};

export const fallbackSite: StorefrontSitePayload = {
  brand: {
    slug: "oviron",
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    logoTagline: siteConfig.logoTagline,
    tagline: siteConfig.tagline,
    aboutBrand: siteConfig.description,
    skuPrefix: "OV",
    description: siteConfig.description,
  },
  assets: {
    logoFull: { url: brandLogo.full, alt: "Oviron — Global Trade, Import, Export" },
    logoIcon: { url: brandLogo.icon, alt: "Oviron emblem" },
    favicon: { url: "/favicon.png", alt: siteConfig.name },
  },
  shareDefaults: {
    ogTitle: "Oviron | B2B Leather Footwear Sourcing, Wholesale & Private Label",
    ogDescription: siteConfig.description,
  },
  contact: {
    whatsappNumber: siteConfig.whatsappNumber,
    businessEmail: siteConfig.businessEmail,
    linkedInUrl: siteConfig.linkedInUrl,
  },
  announcement: {
    enabled: true,
    items: [
      { label: "B2B Footwear Sourcing", sortOrder: 1 },
      { label: "Wholesale", sortOrder: 2 },
      { label: "Private Label", sortOrder: 3 },
    ],
  },
};

export const fallbackResolved: ResolvedStorefront = {
  marketing: fallbackMarketing,
  site: fallbackSite,
  sources: { marketing: "fallback", site: "fallback" },
};
