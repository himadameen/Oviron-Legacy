import { loadBrandLogoDataUrl } from "@/lib/load-share-image";
import { renderOgImage } from "@/lib/og-image-template";
import { OG_IMAGE_SIZE } from "@/lib/seo-images";
import { siteConfig } from "@/lib/site-config";

export const runtime = "nodejs";
export const alt = "Oviron Product Catalog";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default async function ProductsOpenGraphImage() {
  const logoSrc = await loadBrandLogoDataUrl();

  return renderOgImage({
    logoSrc,
    eyebrow: "Manufacturing catalog",
    title: "Product catalog",
    subtitle: `${siteConfig.name} — spec-ready styles for B2B buyers.`,
  });
}
