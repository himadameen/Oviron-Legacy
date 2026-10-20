"use client";

import { ChevronDown, MessageCircle, Shield, Truck } from "lucide-react";
import { useId, useState } from "react";
import { faqItems } from "@/lib/faq";
import QuoteButton from "./QuoteButton";
import SectionReveal from "./SectionReveal";
import styles from "./FAQ.module.css";

const topics = [
  { icon: MessageCircle, label: "Sourcing & MOQ" },
  { icon: Shield, label: "Grades & quality" },
  { icon: Truck, label: "Export & shipping" },
];

export default function FAQ() {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(faqItems[0]?.id ?? null);

  return (
    <section
      id="faq"
      className={`section ${styles.section}`}
      aria-labelledby="faq-heading"
    >
      <div className={`container ${styles.layout}`}>
        <SectionReveal className={styles.aside}>
          <p className="eyebrow">FAQ</p>
          <h2 id="faq-heading" className={styles.title}>
            Answers for buyers.
          </h2>
          <p className={styles.lead}>
            Short guidance on sourcing, grades, and quotations — specifics
            confirmed per product.
          </p>
          <ul className={styles.topics}>
            {topics.map(({ icon: Icon, label }) => (
              <li key={label}>
                <Icon size={17} strokeWidth={1.5} aria-hidden />
                {label}
              </li>
            ))}
          </ul>
          <QuoteButton label="Get a Quote" />
        </SectionReveal>

        <SectionReveal className={styles.main}>
          <div className={styles.card}>
            {faqItems.map((item, index) => {
              const isOpen = openId === item.id;
              const panelId = `${baseId}-${item.id}-panel`;
              const buttonId = `${baseId}-${item.id}-button`;

              return (
                <div
                  key={item.id}
                  className={`${styles.item} ${isOpen ? styles.itemOpen : ""}`}
                >
                  <h3 className={styles.questionWrap}>
                    <button
                      type="button"
                      id={buttonId}
                      className={styles.trigger}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() =>
                        setOpenId((current) =>
                          current === item.id ? null : item.id
                        )
                      }
                    >
                      <span className={styles.qNum}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className={styles.qText}>{item.question}</span>
                      <ChevronDown
                        className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
                        size={20}
                        strokeWidth={1.5}
                        aria-hidden
                      />
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className={`${styles.panel} ${isOpen ? styles.panelOpen : ""}`}
                  >
                    <div className={styles.panelInner}>
                      <p>{item.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
