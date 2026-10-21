"use client";

import { useLayoutEffect } from "react";

/**
 * On full page reload, start at the top — do not restore hash/query deep-scroll.
 * In-page #contact links still work when clicked (not reload).
 */
export default function ScrollOnLoad() {
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    sessionStorage.removeItem("oviron_chunk_retry");

    window.history.scrollRestoration = "manual";

    const nav = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming | undefined;

    const isReload = nav?.type === "reload";
    const isNavigate = nav?.type === "navigate";

    if (isReload || isNavigate) {
      const { pathname, search } = window.location;
      if (isReload && window.location.hash) {
        window.history.replaceState(null, "", `${pathname}${search}`);
      }
      if (isReload || (isNavigate && !window.location.hash)) {
        window.scrollTo(0, 0);
      }
    }
  }, []);

  return null;
}
