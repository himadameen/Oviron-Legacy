import { loadBrandLogoDataUrl, loadShareImageDataUrl } from "@/lib/load-share-image";
import { renderOgImage } from "@/lib/og-image-template";
import { getProductBySeoSlug } from "@/lib/product-routes";
import { categoryLineFor } from "@/lib/product-catalog";
import { OG_IMAGE_SIZE } from "@/lib/seo-images";
import { siteConfig } from "@/lib/site-config";

export const runtime = "nodejs";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateImageMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySeoSlug(slug);
  return [
    {
      alt: product
        ? `${product.name} · ${product.skuRef} | ${siteConfig.name}`
        : `${siteConfig.name} product`,
      size: OG_IMAGE_SIZE,
      contentType: "image/png",
    },
  ];
}

export default async function ProductOpenGraphImage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySeoSlug(slug);
  const logoSrc = await loadBrandLogoDataUrl();

  if (!product) {
    return renderOgImage({
      logoSrc,
      eyebrow: siteConfig.name,
      title: "Product catalog",
      subtitle: siteConfig.description,
    });
  }

  const productImageSrc = await loadShareImageDataUrl(product.galleryImages[0] ?? product.image);

  return renderOgImage({
    logoSrc,
    eyebrow: categoryLineFor(product),
    title: product.name,
    subtitle: `SKU ${product.skuRef} · ${product.upperMaterial}`,
    productImageSrc,
  });
}
