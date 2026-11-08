"use client";

import {
  ClipboardList,
  FileCheck,
  PhoneCall,
  SlidersHorizontal,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import QuoteButton from "./QuoteButton";
import SectionIntro from "./SectionIntro";
import SectionReveal from "./SectionReveal";
import { useStorefront } from "./StorefrontProvider";
import styles from "./BuyerProcess.module.css";

const defaultIcons: LucideIcon[] = [
  ClipboardList,
  SlidersHorizontal,
  PhoneCall,
  FileCheck,
];

export default function BuyerProcess() {
  const { marketing } = useStorefront();
  const block = marketing.buyerProcess;
  const steps = [...(block?.steps ?? [])].sort(
    (a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999)
  );

  return (
    <section className="section" aria-labelledby="journey-heading">
      <div className="container">
        <SectionReveal>
          <SectionIntro
            eyebrow={block?.eyebrow ?? "Process"}
            title={block?.title ?? "A straightforward way forward."}
            lead={block?.lead}
            align="center"
          />
          <h2 id="journey-heading" className="sr-only">
            Buyer journey
          </h2>
        </SectionReveal>

        <ol className={styles.steps}>
          {steps.map((step, index) => {
            const Icon = defaultIcons[index] ?? ClipboardList;
            return (
              <li key={step.id ?? `step-${index}`}>
                <SectionReveal>
                  <article className={styles.card}>
                    <span className={styles.iconWrap}>
                      <Icon size={22} strokeWidth={1.5} aria-hidden />
                    </span>
                    <span className={styles.num}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3>{step.title}</h3>
                    <p>{step.copy}</p>
                  </article>
                </SectionReveal>
              </li>
            );
          })}
        </ol>

        <div className={styles.ctaWrap}>
          <QuoteButton label="Get Your Quote" />
        </div>
      </div>
    </section>
  );
}
