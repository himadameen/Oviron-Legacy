import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { resolveSiteOrigin } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = resolveSiteOrigin(siteConfig.domain);

  return [
    {
      url: `${base}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/products`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];
}
