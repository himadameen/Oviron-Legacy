import type { StorefrontMediaRef } from "@/lib/api/storefront-types";

export function mediaUrl(
  ref?: StorefrontMediaRef | null,
  size: "default" | "sm" | "lg" = "default"
): string {
  if (!ref) return "";
  if (size === "sm" && ref.urlSm?.trim()) return ref.urlSm.trim();
  if (size === "lg" && ref.urlLg?.trim()) return ref.urlLg.trim();
  return ref.url?.trim() ?? "";
}

export function isAbsoluteMediaUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}
