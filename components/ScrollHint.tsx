"use client";

import { ChevronDown } from "lucide-react";
import styles from "./ScrollHint.module.css";

type Props = {
  label?: string;
  dark?: boolean;
};

export default function ScrollHint({
  label = "Scroll for more",
  dark = false,
}: Props) {
  return (
    <p
      className={`${styles.hint} ${dark ? styles.dark : ""}`}
      aria-hidden
    >
      <ChevronDown size={14} className={styles.icon} strokeWidth={2} />
      {label}
    </p>
  );
}
