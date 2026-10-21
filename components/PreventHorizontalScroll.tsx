"use client";

import { useEffect } from "react";

/**
 * Keeps the document pinned on the vertical axis only (no sideways page drift).
 */
export default function PreventHorizontalScroll() {
  useEffect(() => {
    const doc = document.documentElement;
    const body = document.body;

    doc.classList.add("noHorizontalPageScroll");
    body.classList.add("noHorizontalPageScroll");

    const resetX = () => {
      if (window.scrollX !== 0) {
        window.scrollTo(0, window.scrollY);
      }
    };

    window.addEventListener("scroll", resetX, { passive: true });
    resetX();

    return () => {
      window.removeEventListener("scroll", resetX);
      doc.classList.remove("noHorizontalPageScroll");
      body.classList.remove("noHorizontalPageScroll");
    };
  }, []);

  return null;
}
