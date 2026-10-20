import {
  Handshake,
  MessageSquare,
  ScanLine,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { siteImages } from "@/lib/images";
import SafeImage from "./SafeImage";
import QuoteButton from "./QuoteButton";
import SectionIntro from "./SectionIntro";
import SectionReveal from "./SectionReveal";
import styles from "./OvironApproach.module.css";

const principles: {
  n: string;
  title: string;
  copy: string;
  icon: LucideIcon;
}[] = [
  {
    n: "01",
    title: "Product-Led",
    copy: "Category, material, finish, and market.",
    icon: ScanLine,
  },
  {
    n: "02",
    title: "Grade Clarity",
    copy: "Internal grade and tolerances agreed upfront.",
    icon: MessageSquare,
  },
  {
    n: "03",
    title: "Buyer-First",
    copy: "Virtual alignment on requirements and next steps.",
    icon: Handshake,
  },
];

export default function OvironApproach() {
  return (
    <section
      id="approach"
      className={styles.section}
      aria-labelledby="approach-heading"
    >
      <div className={`container ${styles.grid}`}>
        <div className={styles.visual}>
          <SafeImage
            src={siteImages.approach}
            alt="Formal leather footwear — illustrative"
            width={560}
            height={700}
            loading="lazy"
            fallbackKind="editorial"
            className={styles.image}
            sizes="(max-width: 960px) 100vw, 38vw"
          />
        </div>
        <div>
          <SectionReveal>
            <SectionIntro
              eyebrow="Our approach"
              title="Partnerships begin with clarity."
              lead="Structured discussions before quotation."
              tone="dark"
            />
            <h2 id="approach-heading" className="sr-only">
              The Oviron approach
            </h2>
            <ul className={styles.list}>
              {principles.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.n}>
                    <span className={styles.iconWrap}>
                      <Icon size={20} strokeWidth={1.5} aria-hidden />
                    </span>
                    <div>
                      <span className={styles.num}>{item.n}</span>
                      <h3>{item.title}</h3>
                      <p>{item.copy}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <QuoteButton label="Start Enquiry" variant="light" />
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
