"use client";

import Image, { type ImageProps } from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { brandLogo, placeholderFor } from "@/lib/images";
import styles from "./SafeImage.module.css";

type Props = ImageProps & {
  fallbackKind?: "hero" | "collection" | "editorial" | "logo";
};

function isRemoteUrl(src: string): boolean {
  return src.startsWith("http://") || src.startsWith("https://");
}

function isSvgUrl(src: string): boolean {
  return src.endsWith(".svg") || src.includes(".svg?");
}

export default function SafeImage({
  src,
  alt,
  fallbackKind = "collection",
  onError,
  unoptimized,
  fill,
  className,
  priority,
  ...rest
}: Props) {
  const fallback = placeholderFor(fallbackKind);
  const resolvedSrc = useMemo(() => {
    if (typeof src === "string" && src.length > 0) return src;
    return fallback;
  }, [src, fallback]);

  const [current, setCurrent] = useState(resolvedSrc);

  useEffect(() => {
    setCurrent(resolvedSrc);
  }, [resolvedSrc]);

  const currentStr = typeof current === "string" ? current : "";
  const showingLogoPlaceholder =
    currentStr === brandLogo.icon || currentStr === fallback;
  const imageClass = [
    className,
    showingLogoPlaceholder &&
    (fallbackKind === "collection" || fallbackKind === "logo")
      ? styles.logoFallback
      : null,
  ]
    .filter(Boolean)
    .join(" ");
  const skipOptimizer =
    unoptimized ??
    (isSvgUrl(currentStr) || isRemoteUrl(currentStr));

  const handleError = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
      if (current !== fallback) {
        setCurrent(fallback);
      }
      onError?.(event);
    },
    [current, fallback, onError]
  );

  const useNativeImg =
    isRemoteUrl(currentStr) ||
    (skipOptimizer && isSvgUrl(currentStr) && fill);

  if (useNativeImg && fill) {
    return (
      // Native img — Next/Image + fill often fails to paint local SVGs.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={currentStr}
        alt={alt ?? ""}
        className={imageClass}
        onError={handleError}
        decoding="async"
        fetchPriority={priority ? "high" : undefined}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: showingLogoPlaceholder ? "contain" : "cover",
        }}
      />
    );
  }

  if (useNativeImg && !fill) {
    const { width, height, sizes, ...imgRest } = rest;
    return (
      // Strapi/CDN URLs — avoid next/image host allowlist during local dev.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        {...imgRest}
        src={currentStr}
        alt={alt ?? ""}
        width={typeof width === "number" ? width : undefined}
        height={typeof height === "number" ? height : undefined}
        className={imageClass}
        onError={handleError}
        decoding="async"
        fetchPriority={priority ? "high" : undefined}
      />
    );
  }

  return (
    <Image
      {...rest}
      fill={fill}
      className={imageClass}
      priority={priority}
      src={current}
      alt={alt}
      onError={handleError}
      unoptimized={skipOptimizer}
    />
  );
}
