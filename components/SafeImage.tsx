"use client";

import Image, { type ImageProps } from "next/image";
import { useCallback, useState } from "react";
import { placeholderFor } from "@/lib/images";

type Props = ImageProps & {
  fallbackKind?: "hero" | "collection" | "editorial";
};

export default function SafeImage({
  src,
  alt,
  fallbackKind = "collection",
  onError,
  unoptimized,
  ...rest
}: Props) {
  const fallback = placeholderFor(fallbackKind);
  const initial =
    typeof src === "string" && src.length > 0 ? src : fallback;
  const [current, setCurrent] = useState(initial);
  const isSvg =
    typeof current === "string" &&
    (current.endsWith(".svg") || current.includes(".svg?"));

  const handleError = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
      if (current !== fallback) {
        setCurrent(fallback);
      }
      onError?.(event);
    },
    [current, fallback, onError]
  );

  return (
    <Image
      {...rest}
      src={current}
      alt={alt}
      onError={handleError}
      unoptimized={unoptimized ?? isSvg}
    />
  );
}
