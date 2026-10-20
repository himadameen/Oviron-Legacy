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
import styles from "./BuyerProcess.module.css";

const steps: {
  n: string;
  title: string;
  copy: string;
  icon: LucideIcon;
}[] = [
  {
    n: "01",
    title: "Share brief",
    copy: "Category, qty, destination",
    icon: ClipboardList,
  },
  {
    n: "02",
    title: "Align specs",
    copy: "Materials, grade, branding",
    icon: SlidersHorizontal,
  },
  {
    n: "03",
    title: "Meet virtually",
    copy: "Clarify terms & requirements",
    icon: PhoneCall,
  },
  {
    n: "04",
    title: "Review proposal",
    copy: "Quote, samples, shipping",
    icon: FileCheck,
  },
];

export default function BuyerProcess() {
  return (
    <section className="section" aria-labelledby="journey-heading">
      <div className="container">
        <SectionReveal>
          <SectionIntro
            eyebrow="Process"
            title="A straightforward way forward."
            align="center"
          />
          <h2 id="journey-heading" className="sr-only">
            Buyer journey
          </h2>
        </SectionReveal>

        <ol className={styles.steps}>
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <li key={step.n}>
                <SectionReveal>
                  <article className={styles.card}>
                    <span className={styles.iconWrap}>
                      <Icon size={22} strokeWidth={1.5} aria-hidden />
                    </span>
                    <span className={styles.num}>{step.n}</span>
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
