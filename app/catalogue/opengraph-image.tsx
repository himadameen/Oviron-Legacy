import { loadBrandLogoDataUrl } from "@/lib/load-share-image";
import { renderOgImage } from "@/lib/og-image-template";
import { OG_IMAGE_SIZE } from "@/lib/seo-images";
import { siteConfig } from "@/lib/site-config";

export const runtime = "nodejs";
export const alt = "Oviron Product Catalogue";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default async function CatalogueOpenGraphImage() {
  const logoSrc = await loadBrandLogoDataUrl();

  return renderOgImage({
    logoSrc,
    eyebrow: siteConfig.name,
    title: siteConfig.catalogueTitle,
    subtitle:
      "Digital book and PDF — categories, SKUs, and B2B specifications.",
  });
}
