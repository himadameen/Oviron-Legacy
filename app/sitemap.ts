import type { MetadataRoute } from "next";
import { sitemapEntries } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { resolveSiteOrigin } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = resolveSiteOrigin(siteConfig.domain);
  const lastModified = new Date();

  return sitemapEntries.map((entry) => ({
    url: `${base}${entry.path === "/" ? "/" : entry.path}`,
    lastModified,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
