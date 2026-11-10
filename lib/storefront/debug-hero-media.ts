import type { StrapiHomeResponse } from "@/lib/api/strapi-types";
import { mediaUrl } from "@/lib/storefront/media";
import type { ResolvedStorefront } from "@/lib/storefront/types";
import { getStrapiBaseUrl } from "@/lib/strapi-server";

function slideUrls(
  slides: { image?: { url?: string; alt?: string } }[] | undefined
) {
  return (slides ?? []).map((s, i) => ({
    index: i + 1,
    apiUrl: s.image?.url ?? "(missing)",
    mediaUrl: mediaUrl(s.image) || "(empty after mediaUrl)",
    alt: s.image?.alt ?? "",
  }));
}

/** Dev-only: trace hero / campaign media from Strapi vs merged storefront. */
export function logStorefrontHeroMedia(
  phase: string,
  homeRes: StrapiHomeResponse | null,
  resolved: ResolvedStorefront
): void {
  if (process.env.NODE_ENV !== "development") return;

  const productSample = (homeRes?.products ?? []).slice(0, 3).map((p) => ({
    sku: p.sku,
    imageUrl: p.imageUrl,
    imageUrls: p.imageUrls,
  }));

  console.log(`[storefront:media] ${phase}`, {
    strapiBaseUrl: getStrapiBaseUrl(),
    homeApiOk: Boolean(homeRes),
    marketingSource: resolved.sources.marketing,
    apiHeroSlides: slideUrls(homeRes?.marketing?.hero?.slides),
    mergedHeroSlides: slideUrls(resolved.marketing.hero?.slides),
    apiCampaignBanner: {
      eyebrow: homeRes?.marketing?.campaignBanner?.eyebrow ?? "(missing)",
      title: homeRes?.marketing?.campaignBanner?.title ?? "(missing)",
      hint: homeRes?.marketing?.campaignBanner?.hint ?? "(missing)",
    },
    mergedCampaignBanner: {
      eyebrow: resolved.marketing.campaignBanner?.eyebrow ?? "(missing)",
      title: resolved.marketing.campaignBanner?.title ?? "(missing)",
      hint: resolved.marketing.campaignBanner?.hint ?? "(missing)",
      videoUrl: resolved.marketing.campaignBanner?.video?.url ?? "(none)",
      posterUrl: mediaUrl(resolved.marketing.campaignBanner?.video?.poster) || "(none)",
      fallbackUrl: mediaUrl(resolved.marketing.campaignBanner?.fallbackImage) || "(none)",
    },
    /** Catalog grid uses these — not the hero carousel */
    homeProductsImageSample: productSample,
  });
}
