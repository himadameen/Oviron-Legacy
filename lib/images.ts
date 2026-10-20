/** Bundled placeholders — always available offline. */
export const imagePlaceholders = {
  hero: "/images/placeholder-hero.svg",
  collection: "/images/placeholder-collection.svg",
  editorial: "/images/placeholder-editorial.svg",
} as const;

/** Set NEXT_PUBLIC_USE_REMOTE_IMAGES=false to use local SVG placeholders only */
const useRemoteImages =
  process.env.NEXT_PUBLIC_USE_REMOTE_IMAGES !== "false";

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
  privateLabel: pick(imagePlaceholders.editorial, remote.privateLabel),
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
  kind: "hero" | "collection" | "editorial"
): string {
  return imagePlaceholders[kind];
}
