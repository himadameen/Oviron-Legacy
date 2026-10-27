import type { MetadataRoute } from "next";
import { manufacturingProducts } from "@/lib/product-catalog";
import { getProductPath } from "@/lib/product-slugs";
import { sitemapEntries } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { resolveSiteOrigin } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = resolveSiteOrigin(siteConfig.domain);
  const lastModified = new Date();

  const staticRoutes = sitemapEntries.map((entry) => ({
    url: `${base}${entry.path === "/" ? "/" : entry.path}`,
    lastModified,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));

  const productRoutes = manufacturingProducts.map((product) => ({
    url: `${base}${getProductPath(product)}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  return [...staticRoutes, ...productRoutes];
}
