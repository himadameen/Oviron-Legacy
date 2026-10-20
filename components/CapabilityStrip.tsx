import {
  FileText,
  Globe2,
  Package,
  Tags,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SectionReveal from "./SectionReveal";
import styles from "./CapabilityStrip.module.css";

const items: { n: string; label: string; icon: LucideIcon }[] = [
  { n: "01", label: "Wholesale Enquiries", icon: Package },
  { n: "02", label: "Private Label", icon: Tags },
  { n: "03", label: "Specifications", icon: FileText },
  { n: "04", label: "International Buyers", icon: Globe2 },
];

export default function CapabilityStrip() {
  return (
    <section className={styles.strip} aria-label="Business capabilities">
      <div className="container">
        <SectionReveal>
          <ul className={styles.list}>
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.n}>
                  <span className={styles.iconWrap}>
                    <Icon size={20} strokeWidth={1.5} aria-hidden />
                  </span>
                  <span className={styles.num}>{item.n}</span>
                  <span className={styles.label}>{item.label}</span>
                </li>
              );
            })}
          </ul>
        </SectionReveal>
      </div>
    </section>
  );
}
