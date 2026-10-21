"use client";

import Link from "next/link";
import { useEffect } from "react";
import { siteRoutes } from "@/lib/routes";
import styles from "./not-found.module.css";

const CHUNK_RETRY_KEY = "oviron_chunk_retry";

function isStaleBundleError(error: Error): boolean {
  const msg = `${error.message ?? ""} ${error.name ?? ""}`;
  return (
    /ChunkLoadError/i.test(msg) ||
    /Loading chunk/i.test(msg) ||
    /Failed to fetch dynamically imported module/i.test(msg) ||
    /__webpack_modules__/i.test(msg) ||
    /is not a function/i.test(msg)
  );
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const showDetails = process.env.NODE_ENV === "development";

  useEffect(() => {
    console.error(error);

    if (typeof window === "undefined" || !isStaleBundleError(error)) return;
    if (sessionStorage.getItem(CHUNK_RETRY_KEY)) return;

    sessionStorage.setItem(CHUNK_RETRY_KEY, "1");
    window.location.reload();
  }, [error]);

  return (
    <main className={styles.main} id="main-content">
      <p className="eyebrow">Something went wrong</p>
      <h1 className={styles.title}>We could not load this page.</h1>
      <p className={styles.lead}>
        Try again, or return home. If you were running dev mode, stop every
        local server on port 3000, then run <code>npm run dev</code> once, or{" "}
        <code>npm run preview</code> for a stable production build.
      </p>
      {showDetails && error.message ? (
        <p className={styles.lead}>
          <strong>Debug:</strong> {error.message}
        </p>
      ) : null}
      <div className={styles.actions}>
        <button type="button" className="btn btnPrimary" onClick={() => reset()}>
          Try again
        </button>
        <Link href={siteRoutes.home} className="btn btnSecondary">
          Home
        </Link>
        <Link href={siteRoutes.products} className="btn btnSecondary">
          Products
        </Link>
      </div>
    </main>
  );
}
