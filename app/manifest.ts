import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — Leather Footwear Sourcing`,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f7f3eb",
    theme_color: "#172a3a",
    lang: "en",
    orientation: "portrait-primary",
    categories: ["business", "shopping"],
    icons: [
      {
        src: "/favicon.png",
        sizes: "268x268",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
