import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { resolveShareImageUrl } from "./seo-images";

let logoFullDataUrl: string | null = null;

/** Inline PNG wordmark for `next/og` ImageResponse (Node runtime). */
export async function loadBrandLogoDataUrl(): Promise<string> {
  if (logoFullDataUrl) return logoFullDataUrl;
  const file = await readFile(
    join(process.cwd(), "public/images/logo-full.png")
  );
  logoFullDataUrl = `data:image/png;base64,${file.toString("base64")}`;
  return logoFullDataUrl;
}

/** Load a catalog image (local /public path or remote URL) as a data URL for OG rendering. */
export async function loadShareImageDataUrl(
  pathOrUrl: string
): Promise<string | null> {
  try {
    if (/^https?:\/\//i.test(pathOrUrl)) {
      const res = await fetch(pathOrUrl, { cache: "force-cache" });
      if (!res.ok) return null;
      const type = res.headers.get("content-type") ?? "image/jpeg";
      const buf = Buffer.from(await res.arrayBuffer());
      return `data:${type};base64,${buf.toString("base64")}`;
    }

    if (pathOrUrl.startsWith("/")) {
      const file = await readFile(join(process.cwd(), "public", pathOrUrl.slice(1)));
      const ext = pathOrUrl.split(".").pop()?.toLowerCase();
      const mime =
        ext === "svg"
          ? "image/svg+xml"
          : ext === "webp"
            ? "image/webp"
            : ext === "png"
              ? "image/png"
              : "image/jpeg";
      return `data:${mime};base64,${file.toString("base64")}`;
    }

    const absolute = resolveShareImageUrl(pathOrUrl);
    const res = await fetch(absolute, { cache: "force-cache" });
    if (!res.ok) return null;
    const type = res.headers.get("content-type") ?? "image/jpeg";
    const buf = Buffer.from(await res.arrayBuffer());
    return `data:${type};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}
