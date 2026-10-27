"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import styles from "./SiteChrome.module.css";

type SiteChromeProps = {
  children: ReactNode;
};

/** Fixed top bar + header; spacer prevents content from sliding underneath. */
export default function SiteChrome({ children }: SiteChromeProps) {
  const chromeRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  const measure = useCallback(() => {
    const node = chromeRef.current;
    if (!node) return;
    const next = Math.ceil(node.getBoundingClientRect().height);
    setHeight(next);
    document.documentElement.style.setProperty("--site-chrome-height", `${next}px`);
  }, []);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    const node = chromeRef.current;
    if (!node || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(measure);
    observer.observe(node);
    window.addEventListener("resize", measure, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  return (
    <>
      <div ref={chromeRef} className={styles.chrome}>
        {children}
      </div>
      <div
        className={styles.spacer}
        style={{ height: height > 0 ? height : undefined }}
        aria-hidden
      />
    </>
  );
}
