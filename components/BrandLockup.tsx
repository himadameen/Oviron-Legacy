import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import styles from "./BrandLockup.module.css";

type BrandLockupProps = {
  variant?: "header" | "footer" | "mobile";
  /** When false, render spans only (e.g. inside an existing link). */
  asLink?: boolean;
  onNavigate?: () => void;
};

export default function BrandLockup({
  variant = "header",
  asLink = true,
  onNavigate,
}: BrandLockupProps) {
  const content = (
    <>
      <span className={styles.wordmark}>{siteConfig.name}</span>
      <span className={styles.tagline}>{siteConfig.logoTagline}</span>
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
