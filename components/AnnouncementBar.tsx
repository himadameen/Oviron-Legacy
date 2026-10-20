import styles from "./AnnouncementBar.module.css";

export default function AnnouncementBar() {
  return (
    <div className={styles.bar} role="region" aria-label="Business focus">
      <div className={styles.inner}>
        <span>B2B Footwear Sourcing</span>
        <span className={styles.dot} aria-hidden />
        <span>Wholesale</span>
        <span className={styles.dot} aria-hidden />
        <span>Private Label</span>
      </div>
    </div>
  );
}
