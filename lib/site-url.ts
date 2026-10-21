const FALLBACK_ORIGIN = "https://example.com";

/** Canonical origin for metadata, sitemap, and JSON-LD — never throws on bad env values. */
export function resolveSiteOrigin(raw?: string): string {
  const trimmed = raw?.trim();
  if (!trimmed) return FALLBACK_ORIGIN;

  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    return new URL(withProtocol).origin;
  } catch {
    return FALLBACK_ORIGIN;
  }
}

export function absoluteSiteUrl(path: string, rawDomain?: string): string {
  const base = resolveSiteOrigin(rawDomain).replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
