"use client";

import { useEffect, useState } from "react";
import { useStorefront } from "./StorefrontProvider";
import styles from "./IntroSplash.module.css";

const STORAGE_KEY = "oviron_intro_seen";

export default function IntroSplash() {
  const { marketing } = useStorefront();
  const splash = marketing.introSplash;
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (splash?.enabled === false) return;
    const seen = sessionStorage.getItem(STORAGE_KEY);
    if (seen) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = splash?.durationMs ?? 2800;
    setVisible(true);
    document.body.style.overflow = "hidden";

    const fadeTimer = window.setTimeout(
      () => setFadeOut(true),
      reduced ? Math.min(1200, duration) : duration
    );
    const hideTimer = window.setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = "";
      sessionStorage.setItem(STORAGE_KEY, "1");
    }, reduced ? Math.min(1500, duration + 600) : duration + 600);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
      document.body.style.overflow = "";
    };
  }, [splash?.durationMs, splash?.enabled]);

  if (!visible) return null;

  return (
    <div
      className={`${styles.overlay} ${fadeOut ? styles.fadeOut : ""}`}
      role="presentation"
      aria-hidden
    >
      <div className={styles.vignette} />
      <div className={styles.content}>
        <p className={styles.pre}>{splash?.pre}</p>
        <h1 className={styles.logo}>{splash?.title}</h1>
        <p className={styles.tagline}>{splash?.tagline}</p>
        <span className={styles.line} />
      </div>
    </div>
  );
}
