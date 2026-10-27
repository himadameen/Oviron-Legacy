"use client";

import { ArrowUpRight, X } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import type { CatalogueProductEntry } from "@/lib/catalog/build-catalogue-document";
import SafeImage from "../SafeImage";
import styles from "./CatalogueBook.module.css";

type Props = {
  product: CatalogueProductEntry | null;
  onClose: () => void;
};

export default function CatalogueProductQuickView({ product, onClose }: Props) {
  useEffect(() => {
    if (!product) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [product, onClose]);

  if (!product) return null;

  return (
    <div className={styles.quickViewBackdrop} role="presentation" onClick={onClose}>
      <dialog
        open
        className={styles.quickViewDialog}
        aria-labelledby="catalogue-quickview-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={styles.quickViewClose}
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} strokeWidth={1.5} aria-hidden />
        </button>
        <div className={styles.quickViewGrid}>
          <div className={styles.quickViewMedia}>
            <SafeImage
              src={product.image}
              alt={product.imageAlt}
              fill
              className={styles.quickViewImage}
              fallbackKind="collection"
              sizes="(max-width: 720px) 100vw, 420px"
              priority
            />
          </div>
          <div className={styles.quickViewBody}>
            <p className={styles.quickViewSku}>{product.sku}</p>
            <h2 id="catalogue-quickview-title" className={styles.quickViewTitle}>
              {product.name}
            </h2>
            <p className={styles.quickViewCategory}>{product.categoryLine}</p>
            <p className={styles.quickViewDesc}>{product.description}</p>
            <dl className={styles.quickViewSpecs}>
              {product.specLines.map((line) => (
                <div key={line.label}>
                  <dt>{line.label}</dt>
                  <dd>{line.value}</dd>
                </div>
              ))}
            </dl>
            <Link href={product.productPath} className={styles.quickViewCta}>
              Open full style page
              <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden />
            </Link>
          </div>
        </div>
      </dialog>
    </div>
  );
}
