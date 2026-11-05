"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import SafeImage from "../SafeImage";
import styles from "../ProductListing.module.css";

const SLIDE_MS = 4200;

type ProductGalleryProps = {
  images: string[];
  alt: string;
  eager?: boolean;
  /** Larger gallery with thumbnail strip (product detail page). */
  layout?: "card" | "detail";
};

export default function ProductGallery({
  images,
  alt,
  eager,
  layout = "card",
}: ProductGalleryProps) {
  const [index, setIndex] = useState(0);
  const [autoplayEpoch, setAutoplayEpoch] = useState(0);
  const [autoplayPaused, setAutoplayPaused] = useState(false);
  const isDetail = layout === "detail";

  useEffect(() => {
    setIndex(0);
    setAutoplayEpoch((n) => n + 1);
  }, [images]);

  useEffect(() => {
    if (images.length <= 1 || autoplayPaused) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, SLIDE_MS);

    return () => clearInterval(timer);
  }, [images.length, autoplayPaused, autoplayEpoch]);

  const goTo = useCallback(
    (next: number) => {
      setIndex((next + images.length) % images.length);
      setAutoplayEpoch((n) => n + 1);
    },
    [images.length]
  );

  const sliderClass = isDetail ? styles.detailSlider : styles.slider;
  const mediaClass = isDetail ? styles.detailMedia : undefined;

  return (
    <div
      className={mediaClass}
      aria-roledescription="carousel"
      aria-label={`${alt} — image gallery`}
      onMouseEnter={isDetail ? () => setAutoplayPaused(true) : undefined}
      onMouseLeave={isDetail ? () => setAutoplayPaused(false) : undefined}
      onFocusCapture={isDetail ? () => setAutoplayPaused(true) : undefined}
      onBlurCapture={
        isDetail
          ? (event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                setAutoplayPaused(false);
              }
            }
          : undefined
      }
    >
      <div className={sliderClass}>
        {images.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className={i === index ? styles.slideActive : styles.slide}
            aria-hidden={i !== index}
          >
            <SafeImage
              src={src}
              alt={i === index ? `${alt} — view ${i + 1}` : ""}
              fill
              loading={eager && i === 0 ? "eager" : "lazy"}
              fallbackKind="collection"
              className={styles.cardImage}
              sizes={
                isDetail
                  ? "(max-width: 900px) 100vw, 50vw"
                  : "(max-width: 900px) 100vw, 320px"
              }
            />
          </div>
        ))}
        {images.length > 1 && (
          <>
            {isDetail ? (
              <>
                <button
                  type="button"
                  className={`${styles.detailGalleryNav} ${styles.detailGalleryNavPrev}`}
                  aria-label="Previous image"
                  onClick={() => goTo(index - 1)}
                >
                  <ChevronLeft size={20} strokeWidth={1.5} aria-hidden />
                </button>
                <button
                  type="button"
                  className={`${styles.detailGalleryNav} ${styles.detailGalleryNavNext}`}
                  aria-label="Next image"
                  onClick={() => goTo(index + 1)}
                >
                  <ChevronRight size={20} strokeWidth={1.5} aria-hidden />
                </button>
              </>
            ) : null}
            <span className={styles.sliderCount} aria-live="polite">
              {index + 1} / {images.length}
            </span>
            {!isDetail ? (
              <div className={styles.sliderDots}>
                {images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={i === index ? styles.dotActive : styles.dot}
                    aria-label={`Show image ${i + 1}`}
                    aria-current={i === index ? "true" : undefined}
                    onClick={() => goTo(i)}
                  />
                ))}
              </div>
            ) : null}
            <div
              className={
                isDetail ? styles.detailSliderProgress : styles.sliderProgress
              }
              aria-hidden
            >
              <span
                key={`${autoplayEpoch}-${index}`}
                className={styles.sliderProgressBar}
                style={{ animationDuration: `${SLIDE_MS}ms` }}
              />
            </div>
          </>
        )}
      </div>
      {isDetail && images.length > 1 ? (
        <ul className={styles.detailThumbs} aria-label="Gallery thumbnails">
          {images.map((src, i) => (
            <li key={`${src}-thumb-${i}`}>
              <button
                type="button"
                className={
                  i === index ? styles.detailThumbActive : styles.detailThumb
                }
                aria-label={`View image ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => goTo(i)}
              >
                <SafeImage
                  src={src}
                  alt=""
                  fill
                  fallbackKind="collection"
                  className={styles.detailThumbImage}
                  sizes="80px"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
