import { brandLogo } from "./images";
import { siteConfig } from "./site-config";
import { absoluteSiteUrl } from "./site-url";

export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;

export type OgImageDescriptor = {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
};

/** Resolve a site path or absolute URL for Open Graph / Twitter tags. */
export function resolveShareImageUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return absoluteSiteUrl(pathOrUrl, siteConfig.domain);
}

export function ogImageFromPath(
  path: string,
  alt: string,
  size = OG_IMAGE_SIZE
): OgImageDescriptor {
  return {
    url: resolveShareImageUrl(path),
    width: size.width,
    height: size.height,
    alt,
  };
}

export function defaultBrandShareImage(): OgImageDescriptor {
  return ogImageFromPath(
    brandLogo.full,
    `${siteConfig.name} — ${siteConfig.tagline}`
  );
}

export function metadataOpenGraphImages(
  images: OgImageDescriptor | OgImageDescriptor[]
) {
  const list = Array.isArray(images) ? images : [images];
  return list.map((img) => ({
    url: img.url,
    width: img.width ?? OG_IMAGE_SIZE.width,
    height: img.height ?? OG_IMAGE_SIZE.height,
    alt: img.alt,
  }));
}
