"use client";

import Link from "next/link";
import { useStorefront } from "./StorefrontProvider";
import styles from "./BrandLockup.module.css";

type BrandLockupProps = {
  variant?: "header" | "footer" | "mobile" | "cover";
  /** When false, render spans only (e.g. inside an existing link). */
  asLink?: boolean;
  onNavigate?: () => void;
};

export default function BrandLockup({
  variant = "header",
  asLink = true,
  onNavigate,
}: BrandLockupProps) {
  const { site } = useStorefront();
  const brand = site.brand;

  const content = (
    <>
      <span className={styles.wordmark}>{brand?.name ?? "Oviron"}</span>
      <span className={styles.tagline}>
        {brand?.logoTagline ?? "Global Trade, Import, Export"}
      </span>
    </>
  );

  const className = `${styles.lockup} ${styles[variant]}`;

  if (!asLink) {
    return <span className={className}>{content}</span>;
  }

  return (
    <Link href="/" className={className} onClick={onNavigate}>
      {content}
    </Link>
  );
}
