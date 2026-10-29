import { loadBrandLogoDataUrl } from "@/lib/load-share-image";
import { renderOgImage } from "@/lib/og-image-template";
import { siteConfig } from "@/lib/site-config";
import { OG_IMAGE_SIZE } from "@/lib/seo-images";

export const runtime = "nodejs";
export const alt = "Oviron — Leather Footwear Sourcing & Export";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logoSrc = await loadBrandLogoDataUrl();

  return renderOgImage({
    logoSrc,
    eyebrow: siteConfig.name,
    title: "Leather Footwear Sourcing & Export",
    subtitle:
      "Wholesale supply and private-label enquiries for international buyers.",
  });
}
