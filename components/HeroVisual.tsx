"use client";

import { useEffect, useRef, useState } from "react";
import { imagePlaceholders } from "@/lib/images";
import SafeImage from "./SafeImage";
import styles from "./HeroVisual.module.css";

const SLIDES = [
  {
    src: imagePlaceholders.hero,
    alt: "Leather footwear sourcing showcase placeholder",
  },
  {
    src: imagePlaceholders.collection,
    alt: "Leather collection placeholder",
  },
  {
    src: imagePlaceholders.editorial,
    alt: "Editorial footwear placeholder",
  },
] as const;

const SLIDE_MS = 5000;

export default function HeroVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || SLIDES.length <= 1) return;

    const timer = window.setInterval(() => {
      setSlide((i) => (i + 1) % SLIDES.length);
    }, SLIDE_MS);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrow = window.matchMedia("(max-width: 960px)").matches;
    if (reduced || narrow) {
      setOffset({ x: 0, y: 0 });
      return;
    }

    const onMove = (e: MouseEvent) => {
      const rect = node.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const x = ((e.clientX - cx) / rect.width) * 10;
      const y = ((e.clientY - cy) / rect.height) * 10;
      setOffset({ x, y });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className={styles.wrap}>
      <div className={styles.orbA} aria-hidden />
      <div className={styles.orbB} aria-hidden />
      <div
        ref={ref}
        className={styles.frame}
        style={{
          transform: `perspective(900px) rotateY(${offset.x * 0.18}deg) rotateX(${-offset.y * 0.14}deg) translateY(${offset.y * -0.15}px)`,
        }}
      >
        <div className={styles.shine} aria-hidden />
        <div className={styles.shineSweep} aria-hidden />
        <div
          className={styles.imageShell}
          aria-roledescription="carousel"
          aria-label="Hero imagery"
        >
          {SLIDES.map((item, index) => (
            <div
              key={item.src}
              className={
                index === slide ? styles.slideActive : styles.slide
              }
              aria-hidden={index !== slide}
            >
              <SafeImage
                src={item.src}
                alt={index === slide ? item.alt : ""}
                fill
                priority={index === 0}
                fallbackKind="hero"
                className={styles.image}
                sizes="(max-width: 960px) 100vw, 22rem"
              />
            </div>
          ))}
          <div className={styles.slideMeta} aria-live="polite">
            {slide + 1} / {SLIDES.length}
          </div>
          <div className={styles.dots} aria-hidden>
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                className={i === slide ? styles.dotActive : styles.dot}
                aria-label={`Show hero image ${i + 1}`}
                onClick={() => setSlide(i)}
              />
            ))}
          </div>
          <div className={styles.slideProgress} aria-hidden>
            <span
              key={slide}
              className={styles.slideProgressBar}
              style={{ animationDuration: `${SLIDE_MS}ms` }}
            />
          </div>
        </div>
        <div className={styles.stamp} aria-hidden>
          <span>O</span>
        </div>
        <span className={styles.goldLine} aria-hidden />
      </div>
    </div>
  );
}
