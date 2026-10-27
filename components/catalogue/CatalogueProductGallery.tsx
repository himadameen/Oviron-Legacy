"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import SafeImage from "../SafeImage";
import styles from "./CatalogueView.module.css";

type CatalogueProductGalleryProps = {
  images: string[];
  alt: string;
  productName: string;
};

export default function CatalogueProductGallery({
  images,
  alt,
  productName,
}: CatalogueProductGalleryProps) {
  const slides = images.length > 0 ? images : [];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [images]);

  const goTo = useCallback(
    (next: number) => {
      if (slides.length === 0) return;
      setIndex((next + slides.length) % slides.length);
    },
    [slides.length]
  );

  if (slides.length === 0) {
    return (
      <div className={styles.galleryStage} aria-hidden>
        <div className={styles.galleryEmpty} />
      </div>
    );
  }

  const hasMultiple = slides.length > 1;

  return (
    <div
      className={styles.gallery}
      aria-roledescription="carousel"
      aria-label={`${productName} — product images`}
    >
      <div className={styles.galleryStage}>
        {slides.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className={
              i === index ? styles.gallerySlideActive : styles.gallerySlide
            }
            aria-hidden={i !== index}
          >
            <div className={styles.gallerySlideInner}>
              <SafeImage
                src={src}
                alt={
                  i === index ? `${alt} — view ${i + 1} of ${slides.length}` : ""
                }
                fill
                fallbackKind="collection"
                className={styles.galleryImage}
                sizes="(max-width: 640px) 88vw, 188px"
                priority={i === 0}
              />
            </div>
          </div>
        ))}

        {hasMultiple ? (
          <>
            <button
              type="button"
              className={`${styles.galleryNav} ${styles.galleryNavPrev}`}
              onClick={() => goTo(index - 1)}
              aria-label="Previous image"
            >
              <ChevronLeft size={18} strokeWidth={1.75} aria-hidden />
            </button>
            <button
              type="button"
              className={`${styles.galleryNav} ${styles.galleryNavNext}`}
              onClick={() => goTo(index + 1)}
              aria-label="Next image"
            >
              <ChevronRight size={18} strokeWidth={1.75} aria-hidden />
            </button>
            <span className={styles.galleryCount} aria-live="polite">
              {index + 1} / {slides.length}
            </span>
          </>
        ) : null}
      </div>

      {hasMultiple ? (
        <ul className={styles.galleryThumbs} aria-label="Choose image">
          {slides.map((src, i) => (
            <li key={`thumb-${src}-${i}`}>
              <button
                type="button"
                className={
                  i === index ? styles.galleryThumbActive : styles.galleryThumb
                }
                onClick={() => goTo(i)}
                aria-label={`Show image ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
              >
                <SafeImage
                  src={src}
                  alt=""
                  width={120}
                  height={120}
                  fallbackKind="collection"
                  className={styles.galleryThumbImage}
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
