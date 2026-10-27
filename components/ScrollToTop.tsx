"use client";

import { ChevronUp } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import styles from "./ScrollToTop.module.css";

const SHOW_AFTER_PX = 320;

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollUp = useCallback(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }, []);

  return (
    <button
      type="button"
      className={`${styles.btn} ${visible ? styles.visible : ""}`}
      aria-label="Scroll to top"
      onClick={scrollUp}
    >
      <ChevronUp size={20} strokeWidth={2} aria-hidden />
    </button>
  );
}
