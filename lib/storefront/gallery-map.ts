import type { StorefrontGalleryItem } from "@/lib/api/storefront-types";
import type { GalleryItem } from "@/lib/gallery";
import { mediaUrl } from "./media";

export function mapStorefrontGalleryItems(
  items: StorefrontGalleryItem[] | undefined
): GalleryItem[] {
  if (!items?.length) return [];
  return [...items]
    .sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999))
    .map((item) => ({
      id: item.id,
      title: item.title ?? "Gallery",
      image: mediaUrl(item.image),
      imageAlt: item.image?.alt ?? item.title ?? "Gallery image",
      span: item.span,
    }))
    .filter((row) => row.image);
}
