"use client";

import { useEffect, useRef, useState } from "react";
import { siteImages } from "@/lib/images";
import SafeImage from "./SafeImage";
import styles from "./HeroVisual.module.css";

export default function HeroVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const onMove = (e: MouseEvent) => {
      const rect = node.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const x = ((e.clientX - cx) / rect.width) * 8;
      const y = ((e.clientY - cy) / rect.height) * 8;
      setOffset({ x, y });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={ref}
      className={styles.frame}
      style={{
        transform: `perspective(900px) rotateY(${offset.x * 0.15}deg) rotateX(${-offset.y * 0.12}deg)`,
      }}
    >
      <div className={styles.shine} aria-hidden />
      <div className={styles.imageShell}>
        <SafeImage
          src={siteImages.hero}
          alt="Premium leather dress shoes — illustrative reference"
          width={720}
          height={900}
          priority
          fallbackKind="hero"
          className={styles.image}
          sizes="(max-width: 960px) 100vw, 42vw"
        />
      </div>
      <div className={styles.stamp} aria-hidden>
        <span>O</span>
      </div>
      <span className={styles.goldLine} aria-hidden />
    </div>
  );
}
