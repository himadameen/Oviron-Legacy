"use client";

import { useStorefront } from "./StorefrontProvider";
import styles from "./AnnouncementBar.module.css";

export default function AnnouncementBar() {
  const { site } = useStorefront();
  const announcement = site.announcement;
  if (announcement?.enabled === false) return null;

  const items = [...(announcement?.items ?? [])].sort(
    (a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999)
  );
  if (items.length === 0) return null;

  return (
    <div className={styles.bar} role="region" aria-label="Business focus">
      <div className={styles.inner}>
        {items.map((item, index) => (
          <span key={`${item.label}-${index}`}>
            {index > 0 ? <span className={styles.dot} aria-hidden /> : null}
            <span>{item.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
