"use client";

import Image, { type ImageProps } from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { placeholderFor } from "@/lib/images";

type Props = ImageProps & {
  fallbackKind?: "hero" | "collection" | "editorial";
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

  if (skipOptimizer && isSvgUrl(currentStr) && fill) {
    return (
      // Native img — Next/Image + fill often fails to paint local SVGs.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={currentStr}
        alt={alt ?? ""}
        className={className}
        onError={handleError}
        decoding="async"
        fetchPriority={priority ? "high" : undefined}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    );
  }

  return (
    <Image
      {...rest}
      fill={fill}
      className={className}
      priority={priority}
      src={current}
      alt={alt}
      onError={handleError}
      unoptimized={skipOptimizer}
    />
  );
}
