import type { Metadata } from "next";
import { brandLogo } from "./images";
import {
  defaultBrandShareImage,
  metadataOpenGraphImages,
  type OgImageDescriptor,
  ogImageFromPath,
} from "./seo-images";
import { siteConfig } from "./site-config";
import { resolveSiteOrigin } from "./site-url";

export const seoKeywords = [
  "leather footwear sourcing",
  "wholesale footwear supply",
  "private label shoes",
  "private label footwear",
  "footwear export enquiry",
  "B2B shoe supplier",
  "leather shoes wholesale",
  "footwear manufacturing coordination",
  "international footwear buyers",
  "Oxford formal shoes wholesale",
  "leather sneaker sourcing",
  "footwear private label MOQ",
] as const;

export const defaultSiteTitle =
  "Oviron | Leather Footwear Sourcing & Export";

export const defaultOgTitle =
  "Oviron | Leather Footwear Sourcing & Export";

const siteOrigin = () => resolveSiteOrigin(siteConfig.domain);

/** Shared robots directives for indexable marketing pages. */
export const indexableRobots: Metadata["robots"] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

export const noIndexRobots: Metadata["robots"] = {
  index: false,
  follow: true,
};

type PageSeoOptions = {
  title: string;
  description: string;
  path: `/${string}` | "/";
  ogTitle?: string;
  keywords?: string[];
  noIndex?: boolean;
  /** Primary share image — product photo, route OG image path, or brand logo. */
  ogImage?: OgImageDescriptor | string;
};

/** Build consistent page metadata (canonical, Open Graph, Twitter). */
export function pageMetadata(options: PageSeoOptions): Metadata {
  const {
    title,
    description,
    path,
    ogTitle,
    keywords,
    noIndex = false,
    ogImage,
  } = options;

  const og = ogTitle ?? title;
  const shareImage =
    typeof ogImage === "string"
      ? ogImageFromPath(ogImage, og)
      : (ogImage ?? defaultBrandShareImage());
  const images = metadataOpenGraphImages(shareImage);

  return {
    title,
    description,
    keywords: keywords ?? [...seoKeywords],
    alternates: {
      canonical: path,
    },
    robots: noIndex ? noIndexRobots : indexableRobots,
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: path,
      siteName: siteConfig.name,
      title: og,
      description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: og,
      description,
      images: images.map((img) => img.url),
      ...(twitterSiteHandle() ? { site: twitterSiteHandle() } : {}),
    },
  };
}

function twitterSiteHandle(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_TWITTER_HANDLE?.trim();
  if (!raw) return undefined;
  return raw.startsWith("@") ? raw : `@${raw}`;
}

/** Root layout defaults — merged with per-route metadata. */
export function rootLayoutMetadata(): Metadata {
  const verification: Metadata["verification"] = {};

  const google = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
  if (google) verification.google = google;

  const bing = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION?.trim();
  if (bing) {
    verification.other = { "msvalidate.01": bing };
  }

  const facebookAppId = process.env.NEXT_PUBLIC_FB_APP_ID?.trim();
  const defaultShare = defaultBrandShareImage();
  const defaultImages = metadataOpenGraphImages(defaultShare);

  return {
    metadataBase: new URL(siteOrigin()),
    title: {
      default: defaultSiteTitle,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    applicationName: siteConfig.name,
    keywords: [...seoKeywords],
    authors: [{ name: siteConfig.legalName, url: siteOrigin() }],
    creator: siteConfig.legalName,
    publisher: siteConfig.legalName,
    category: "Business",
    robots: indexableRobots,
    alternates: {
      canonical: "/",
      languages: {
        "en-US": "/",
      },
    },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: "/",
      siteName: siteConfig.name,
      title: defaultOgTitle,
      description: siteConfig.description,
      images: defaultImages,
    },
    twitter: {
      card: "summary_large_image",
      title: defaultOgTitle,
      description: siteConfig.description,
      images: defaultImages.map((img) => img.url),
      ...(twitterSiteHandle() ? { site: twitterSiteHandle() } : {}),
    },
    ...(facebookAppId ? { facebook: { appId: facebookAppId } } : {}),
    icons: {
      icon: [
        { url: brandLogo.icon, type: "image/png" },
        { url: "/favicon.png", type: "image/png", sizes: "268x268" },
      ],
      shortcut: [brandLogo.icon],
      apple: [{ url: brandLogo.icon, type: "image/png" }],
    },
    manifest: "/manifest.webmanifest",
    referrer: "origin-when-cross-origin",
    formatDetection: {
      telephone: false,
      email: false,
      address: false,
    },
    ...(Object.keys(verification).length > 0 ? { verification } : {}),
  };
}

/** Routes included in sitemap.xml (no hash URLs — crawlers treat them as the home URL). */
export const sitemapEntries = [
  {
    path: "/" as const,
    changeFrequency: "weekly" as const,
    priority: 1,
  },
  {
    path: "/products" as const,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  },
  {
    path: "/catalogue" as const,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  },
] as const;
