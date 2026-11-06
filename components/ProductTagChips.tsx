import type { ProductTagChip as TagChip } from "@/lib/product-tags";
import styles from "./ProductTagChips.module.css";

type Props = {
  tags: TagChip[];
  className?: string;
  /** Visually quieter variant for dense cards */
  size?: "default" | "compact";
};

export default function ProductTagChips({
  tags,
  className,
  size = "default",
}: Props) {
  if (!tags.length) return null;

  return (
    <ul
      className={[
        styles.list,
        size === "compact" ? styles.compact : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label="Product highlights"
    >
      {tags.map((tag) => (
        <li key={tag.key}>
          <span
            className={styles.chip}
            data-tag={tag.key}
          >
            {tag.label}
          </span>
        </li>
      ))}
    </ul>
  );
}
