import { Info } from "lucide-react";
import QuoteButton from "./QuoteButton";
import SectionIntro from "./SectionIntro";
import SectionReveal from "./SectionReveal";
import styles from "./QualityGrades.module.css";

const grades = ["A+", "A", "B+", "B", "C+", "C"];

export default function QualityGrades() {
  return (
    <section className={`section ${styles.section}`} aria-labelledby="grades-heading">
      <div className="container">
        <SectionReveal>
          <SectionIntro
            eyebrow="Grades"
            title="Options for different needs."
            lead="Internal supplier labels — agreed per product before order."
            align="center"
          />
          <h2 id="grades-heading" className="sr-only">
            Internal product grades
          </h2>
        </SectionReveal>

        <SectionReveal>
          <ul className={styles.grid} aria-label="Internal grade labels">
            {grades.map((grade) => (
              <li key={grade}>
                <span className={styles.grade}>{grade}</span>
              </li>
            ))}
          </ul>
        </SectionReveal>

        <p className={styles.disclaimer}>
          <Info size={16} strokeWidth={1.5} aria-hidden />
          Labels vary by supplier — condition and tolerances confirmed per SKU.
        </p>

        <div className={styles.ctaWrap}>
          <QuoteButton label="Discuss Grades & Quote" variant="secondary" />
        </div>
      </div>
    </section>
  );
}
