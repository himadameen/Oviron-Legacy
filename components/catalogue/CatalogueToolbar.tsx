"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import CatalogueDownloadButton from "./CatalogueDownloadButton";
import styles from "./CatalogueView.module.css";

export default function CatalogueToolbar() {
  return (
    <div className={styles.toolbar}>
      <div className={`container ${styles.toolbarInner}`}>
        <Link href="/products" className={styles.backLink}>
          <ArrowLeft size={16} strokeWidth={1.5} aria-hidden />
          Back to catalog
        </Link>
        <p className={styles.toolbarHint}>
          Full-screen pages in browser · Download PDF (one A4 sheet per page)
        </p>
        <CatalogueDownloadButton label="Download PDF" />
      </div>
    </div>
  );
}
