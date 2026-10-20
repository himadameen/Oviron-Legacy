"use client";

import { useLayoutEffect } from "react";

/**
 * On full page reload, start at the top — do not restore hash/query deep-scroll.
 * In-page #contact links still work when clicked (not reload).
 */
export default function ScrollOnLoad() {
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    window.history.scrollRestoration = "manual";

    const nav = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming | undefined;

    if (nav?.type === "reload") {
      const { pathname, search } = window.location;
      if (window.location.hash) {
        window.history.replaceState(null, "", `${pathname}${search}`);
      }
      window.scrollTo(0, 0);
    }
  }, []);

  return null;
}
