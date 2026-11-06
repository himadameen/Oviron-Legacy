import type { MetadataRoute } from "next";
import { getCatalog, loadCatalog } from "@/lib/catalog";
import { manufacturingProductsFromCatalog } from "@/lib/product-catalog";
import { getProductPath } from "@/lib/product-slugs";
import { sitemapEntries } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { resolveSiteOrigin } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await loadCatalog();
  const catalog = getCatalog();
  const base = resolveSiteOrigin(siteConfig.domain);
  const lastModified = new Date();

  const staticRoutes = sitemapEntries.map((entry) => ({
    url: `${base}${entry.path === "/" ? "/" : entry.path}`,
    lastModified,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));

  const manufacturing = manufacturingProductsFromCatalog(catalog);
  const productRoutes = manufacturing.map((product) => ({
    url: `${base}${getProductPath(product)}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  return [...staticRoutes, ...productRoutes];
}
