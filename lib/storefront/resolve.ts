import type {
  StorefrontHomeResponse,
  StorefrontMarketing,
  StorefrontSitePayload,
  StorefrontSiteResponse,
} from "@/lib/api/storefront-types";
import { fallbackMarketing, fallbackSite } from "./fallbacks";
import type { ContentSource, ResolvedStorefront } from "./types";

export type { ResolvedStorefront, ContentSource } from "./types";

function pickMediaUrl(
  primary?: string,
  fallback?: string
): string | undefined {
  const p = primary?.trim();
  if (p) return p;
  const f = fallback?.trim();
  return f || undefined;
}

function mergeMarketing(
  cms?: StorefrontMarketing
): { marketing: StorefrontMarketing; source: ContentSource } {
  if (!cms) {
    return { marketing: fallbackMarketing, source: "fallback" };
  }

  const hasHero = Boolean(cms.hero?.title || cms.hero?.slides?.length);
  const hasAny =
    hasHero ||
    cms.faq?.items?.length ||
    cms.gallery?.items?.length ||
    cms.testimonials?.items?.length;

  if (!hasAny) {
    return { marketing: fallbackMarketing, source: "fallback" };
  }

  return {
    marketing: {
      ...fallbackMarketing,
      ...cms,
      version: cms.version ?? fallbackMarketing.version,
      introSplash: { ...fallbackMarketing.introSplash, ...cms.introSplash },
      hero: {
        ...fallbackMarketing.hero,
        ...cms.hero,
        highlights: cms.hero?.highlights?.length
          ? cms.hero.highlights
          : fallbackMarketing.hero?.highlights,
        slides: cms.hero?.slides?.length
          ? cms.hero.slides
          : fallbackMarketing.hero?.slides,
        ctaPrimary: cms.hero?.ctaPrimary ?? fallbackMarketing.hero?.ctaPrimary,
        ctaSecondary:
          cms.hero?.ctaSecondary ?? fallbackMarketing.hero?.ctaSecondary,
      },
      campaignBanner: {
        ...fallbackMarketing.campaignBanner,
        ...cms.campaignBanner,
        fallbackImage:
          cms.campaignBanner?.fallbackImage ??
          fallbackMarketing.campaignBanner?.fallbackImage,
      },
      gallery:
        cms.gallery?.items?.length
          ? { ...fallbackMarketing.gallery, ...cms.gallery }
          : fallbackMarketing.gallery,
      approach: { ...fallbackMarketing.approach, ...cms.approach },
      privateLabel: { ...fallbackMarketing.privateLabel, ...cms.privateLabel },
      faq: cms.faq?.items?.length
        ? cms.faq
        : fallbackMarketing.faq,
      testimonials: cms.testimonials?.items?.length
        ? cms.testimonials
        : fallbackMarketing.testimonials,
      buyerProcess: { ...fallbackMarketing.buyerProcess, ...cms.buyerProcess },
      qualityGrades: {
        ...fallbackMarketing.qualityGrades,
        ...cms.qualityGrades,
        grades: cms.qualityGrades?.grades?.length
          ? cms.qualityGrades.grades
          : fallbackMarketing.qualityGrades?.grades,
      },
      footerBlurb: cms.footerBlurb ?? fallbackMarketing.footerBlurb,
    },
    source: "mixed",
  };
}

function mergeSite(
  cms?: StorefrontSitePayload
): { site: StorefrontSitePayload; source: ContentSource } {
  if (!cms) {
    return { site: fallbackSite, source: "fallback" };
  }

  const hasContact =
    cms.contact?.whatsappNumber ||
    cms.contact?.businessEmail ||
    cms.contact?.linkedInUrl;

  return {
    site: {
      ...fallbackSite,
      ...cms,
      version: cms.version ?? fallbackSite.version,
      brand: {
        ...fallbackSite.brand,
        ...cms.brand,
        name: cms.brand?.name ?? fallbackSite.brand?.name ?? "Oviron",
      },
      assets: {
        logoFull: cms.assets?.logoFull?.url
          ? cms.assets.logoFull
          : fallbackSite.assets?.logoFull,
        logoIcon: cms.assets?.logoIcon?.url
          ? cms.assets.logoIcon
          : fallbackSite.assets?.logoIcon,
        favicon: cms.assets?.favicon?.url
          ? cms.assets.favicon
          : fallbackSite.assets?.favicon,
        defaultShareImage:
          cms.assets?.defaultShareImage ?? fallbackSite.assets?.defaultShareImage,
      },
      contact: {
        whatsappNumber: pickMediaUrl(
          cms.contact?.whatsappNumber,
          fallbackSite.contact?.whatsappNumber
        ),
        businessEmail: pickMediaUrl(
          cms.contact?.businessEmail,
          fallbackSite.contact?.businessEmail
        ),
        linkedInUrl: pickMediaUrl(
          cms.contact?.linkedInUrl,
          fallbackSite.contact?.linkedInUrl
        ),
      },
      announcement: cms.announcement?.items?.length
        ? cms.announcement
        : fallbackSite.announcement,
      shareDefaults: { ...fallbackSite.shareDefaults, ...cms.shareDefaults },
    },
    source: hasContact || cms.assets?.logoFull?.url ? "mixed" : "fallback",
  };
}

export function resolveStorefront(
  home: StorefrontHomeResponse | null,
  siteRes: StorefrontSiteResponse | null
): ResolvedStorefront {
  const { marketing, source: mSource } = mergeMarketing(home?.marketing);
  const { site, source: sSource } = mergeSite(siteRes?.site);

  if (home?.brand) {
    site.brand = {
      ...site.brand,
      ...home.brand,
      slug: home.brand.slug ?? site.brand?.slug ?? "oviron",
      name: home.brand.name ?? site.brand?.name ?? "Oviron",
    };
  }

  return {
    marketing,
    site,
    sources: { marketing: mSource, site: sSource },
  };
}
