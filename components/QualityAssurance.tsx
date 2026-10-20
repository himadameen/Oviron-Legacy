import {
  Award,
  BadgeCheck,
  HeartHandshake,
  Scale,
  ShieldCheck,
} from "lucide-react";
import QuoteButton from "./QuoteButton";
import SectionReveal from "./SectionReveal";
import styles from "./QualityAssurance.module.css";

const pillars = [
  {
    icon: ShieldCheck,
    title: "Grade transparency",
    copy: "Internal supplier grades agreed per SKU before order.",
  },
  {
    icon: Scale,
    title: "Spec alignment",
    copy: "Materials, construction, and tolerances documented upfront.",
  },
  {
    icon: BadgeCheck,
    title: "Buyer-first process",
    copy: "Virtual alignment before quotation and production steps.",
  },
  {
    icon: HeartHandshake,
    title: "Relationship supply",
    copy: "Long-term sourcing partnership — not anonymous transactions.",
  },
];

export default function QualityAssurance() {
  return (
    <section
      id="assurance"
      className={styles.section}
      aria-labelledby="assurance-heading"
    >
      <div className={`container ${styles.grid}`}>
        <SectionReveal className={styles.copy}>
          <p className={styles.eyebrow}>
            <Award size={14} aria-hidden /> Quality &amp; trust
          </p>
          <h2 id="assurance-heading" className={styles.title}>
            Assurance you can build a business on.
          </h2>
          <p className={styles.lead}>
            We prioritise clarity, loyalty, and honest commercial conversations
            — so your assortment decisions stay confident and defensible.
          </p>
          <QuoteButton label="Discuss Quality & Quote" variant="light" />
        </SectionReveal>

        <div className={styles.cards}>
          {pillars.map((item, i) => {
            const Icon = item.icon;
            return (
              <SectionReveal key={item.title} className={styles.cardWrap}>
                <article
                  className={styles.card}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <span className={styles.iconWrap}>
                    <Icon size={22} strokeWidth={1.5} aria-hidden />
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </article>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
