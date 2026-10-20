"use client";

import { useEffect, useState } from "react";
import styles from "./IntroSplash.module.css";

const STORAGE_KEY = "oviron_intro_seen";

export default function IntroSplash() {
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem(STORAGE_KEY);
    if (seen) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setVisible(true);
    document.body.style.overflow = "hidden";

    const fadeTimer = window.setTimeout(
      () => setFadeOut(true),
      reduced ? 1200 : 2800
    );
    const hideTimer = window.setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = "";
      sessionStorage.setItem(STORAGE_KEY, "1");
    }, reduced ? 1500 : 3400);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
      document.body.style.overflow = "";
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`${styles.overlay} ${fadeOut ? styles.fadeOut : ""}`}
      role="presentation"
      aria-hidden
    >
      <div className={styles.vignette} />
      <div className={styles.content}>
        <p className={styles.pre}>Leather footwear sourcing</p>
        <h1 className={styles.logo}>Oviron</h1>
        <p className={styles.tagline}>Where the luxury ends.</p>
        <span className={styles.line} />
      </div>
    </div>
  );
}
