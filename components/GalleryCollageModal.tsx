"use client";

import { X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GalleryItem } from "@/lib/gallery";
import ScrollHint from "./ScrollHint";
import SafeImage from "./SafeImage";
import styles from "./GalleryCollageModal.module.css";

type Props = {
  items: GalleryItem[];
  open: boolean;
  onClose: () => void;
  initialIndex?: number;
};

const AUTO_MS = 4500;

export default function GalleryCollageModal({
  items,
  open,
  onClose,
  initialIndex = 0,
}: Props) {
  const [focusIndex, setFocusIndex] = useState(initialIndex);
  const thumbStripRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (open) setFocusIndex(initialIndex);
  }, [open, initialIndex]);

  useEffect(() => {
    if (!open || items.length <= 1) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const timer = window.setInterval(() => {
      setFocusIndex((i) => (i + 1) % items.length);
    }, AUTO_MS);

    return () => clearInterval(timer);
  }, [open, items.length]);

  useEffect(() => {
    if (!open) return;
    const strip = thumbStripRef.current;
    const thumb = strip?.querySelector("[aria-current='true']") as HTMLElement | null;
    if (!strip || !thumb) return;
    const target =
      thumb.offsetLeft - strip.clientWidth / 2 + thumb.offsetWidth / 2;
    strip.scrollTo({
      left: Math.max(0, target),
      behavior: "smooth",
    });
  }, [focusIndex, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight")
        setFocusIndex((i) => (i + 1) % items.length);
      if (e.key === "ArrowLeft")
        setFocusIndex((i) => (i - 1 + items.length) % items.length);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, items.length, onClose]);

  const focused = items[focusIndex];

  const handleBackdrop = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  if (!open) return null;

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Full photo collage"
      onClick={handleBackdrop}
    >
      <div className={styles.panel}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Work &amp; footwear collage</p>
            <h3 className={styles.title}>Studio &amp; campaign gallery</h3>
          </div>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close collage"
          >
            <X size={22} strokeWidth={1.5} />
          </button>
        </header>

        {focused && (
          <figure className={styles.hero} key={focusIndex}>
            <div className={styles.heroMedia}>
              <SafeImage
                src={focused.image}
                alt={focused.imageAlt}
                fill
                fallbackKind="collection"
                className={styles.heroImg}
                sizes="(max-width: 768px) 100vw, 900px"
                priority
              />
            </div>
            <figcaption>{focused.title}</figcaption>
            <div className={styles.progress} aria-hidden>
              <span
                className={styles.progressBar}
                style={{ animationDuration: `${AUTO_MS}ms` }}
                key={focusIndex}
              />
            </div>
          </figure>
        )}

        <div className={styles.stripWrap}>
          <ul
            ref={thumbStripRef}
            className={`${styles.collage} luxuryScroll`}
          >
            {items.map((item, index) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={`${styles.thumb} ${index === focusIndex ? styles.thumbActive : ""}`}
                  onClick={() => setFocusIndex(index)}
                  aria-label={`View ${item.title}`}
                  aria-current={index === focusIndex ? "true" : undefined}
                >
                  <SafeImage
                    src={item.image}
                    alt=""
                    width={320}
                    height={240}
                    fallbackKind="collection"
                    className={styles.thumbImg}
                    sizes="120px"
                  />
                </button>
              </li>
            ))}
          </ul>
          <ScrollHint label="Swipe / scroll thumbnails" />
        </div>
      </div>
    </div>
  );
}
