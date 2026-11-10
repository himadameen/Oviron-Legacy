import type { NextConfig } from "next";

type RemotePattern = NonNullable<
  NonNullable<NextConfig["images"]>["remotePatterns"]
>[number];

function strapiImagePatterns(): RemotePattern[] {
  const candidates = [
    process.env.STRAPI_URL,
    process.env.NEXT_PUBLIC_STRAPI_URL,
    "http://localhost:1337",
  ];

  const seen = new Set<string>();
  const patterns: RemotePattern[] = [];

  for (const raw of candidates) {
    const trimmed = raw?.trim();
    if (!trimmed) continue;

    let parsed: URL;
    try {
      parsed = new URL(trimmed);
    } catch {
      continue;
    }

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") continue;

    const port =
      parsed.port ||
      (parsed.hostname === "localhost" && parsed.protocol === "http:"
        ? "1337"
        : "");
    const key = `${parsed.protocol}//${parsed.hostname}${port ? `:${port}` : ""}`;
    if (seen.has(key)) continue;
    seen.add(key);

    patterns.push({
      protocol: parsed.protocol.replace(":", "") as "http" | "https",
      hostname: parsed.hostname,
      ...(port ? { port } : {}),
      pathname: "/**",
    });
  }

  return patterns;
}

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "1337",
        pathname: "/**",
      },
      ...strapiImagePatterns(),
    ],
  },
};

export default nextConfig;
