import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { resolveSiteOrigin } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const base = resolveSiteOrigin(siteConfig.domain);

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    host: base,
    sitemap: `${base}/sitemap.xml`,
  };
}
