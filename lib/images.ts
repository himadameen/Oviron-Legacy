/** Brand marks — bundled in /public/images */
export const brandLogo = {
  /** Wordmark + tagline (navbar, footer) */
  full: "/images/logo-full.png",
  /** Circular emblem (favicon, hero stamp) */
  icon: "/images/logo.png",
} as const;

/** Bundled placeholders — always available offline. */
export const imagePlaceholders = {
  hero: "/images/placeholder-hero.svg",
  /** Product / catalogue tiles — brand mark when API has no photo */
  collection: brandLogo.icon,
  editorial: "/images/placeholder-editorial.svg",
  logo: brandLogo.icon,
} as const;

const MISSING_PRODUCT_IMAGE = /oviron_seed_placeholder|placeholder-(collection|hero|editorial)\.svg/i;

/** True when Strapi (or API) has no usable product photo. */
export function isMissingProductImage(url?: string | null): boolean {
  const trimmed = url?.trim() ?? "";
  if (!trimmed) return true;
  return MISSING_PRODUCT_IMAGE.test(trimmed);
}

/** Primary product image URL, or bundled Oviron logo. */
export function productImageOrLogo(url?: string | null): string {
  return isMissingProductImage(url) ? brandLogo.icon : url!.trim();
}

/** Set NEXT_PUBLIC_USE_REMOTE_IMAGES=true to load Unsplash URLs (browser-direct via SafeImage) */
const useRemoteImages =
  process.env.NEXT_PUBLIC_USE_REMOTE_IMAGES === "true";

/** Optional Unsplash references when NEXT_PUBLIC_USE_REMOTE_IMAGES=true */
const remote = {
  hero: "https://images.unsplash.com/photo-1608256246200-53bd7f3c1c5?w=1200&q=85",
  approach: "https://images.unsplash.com/photo-1614252239476-1b6195a094cc?w=900&q=80",
  privateLabel: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=900&q=80",
  formal: "https://images.unsplash.com/photo-1614252239476-1b6195a094cc?w=800&q=80",
  office: "https://images.unsplash.com/photo-1614252239476-1b6195a094cc?w=800&q=80",
  loafers: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80",
  driving: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80",
  casual: "https://images.unsplash.com/photo-1614252239476-1b6195a094cc?w=800&q=80",
  sneakers: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
  party: "https://images.unsplash.com/photo-1560769629-975ec94e0a86?w=800&q=80",
  festival: "https://images.unsplash.com/photo-1560769629-975ec94e0a86?w=800&q=80",
  custom: "https://images.unsplash.com/photo-1608256246200-53bd7f3c1c5?w=800&q=80",
} as const;

function pick(local: string, remoteUrl: string): string {
  return useRemoteImages ? remoteUrl : local;
}

export const siteImages = {
  hero: pick(imagePlaceholders.hero, remote.hero),
  approach: pick(imagePlaceholders.editorial, remote.approach),
  privateLabel: pick(imagePlaceholders.collection, remote.privateLabel),
  texture: pick(imagePlaceholders.collection, remote.formal),
} as const;

export const collectionImages = {
  formal: pick(imagePlaceholders.collection, remote.formal),
  office: pick(imagePlaceholders.collection, remote.office),
  loafers: pick(imagePlaceholders.collection, remote.loafers),
  driving: pick(imagePlaceholders.collection, remote.driving),
  casual: pick(imagePlaceholders.collection, remote.casual),
  sneakers: pick(imagePlaceholders.collection, remote.sneakers),
  party: pick(imagePlaceholders.collection, remote.party),
  festival: pick(imagePlaceholders.collection, remote.festival),
  custom: pick(imagePlaceholders.collection, remote.custom),
} as const;

export function placeholderFor(
  kind: "hero" | "collection" | "editorial" | "logo"
): string {
  return imagePlaceholders[kind];
}
