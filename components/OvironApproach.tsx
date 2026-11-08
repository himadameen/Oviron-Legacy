"use client";

import {
  Handshake,
  MessageSquare,
  ScanLine,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { siteImages } from "@/lib/images";
import { mediaUrl } from "@/lib/storefront/media";
import SafeImage from "./SafeImage";
import QuoteButton from "./QuoteButton";
import SectionIntro from "./SectionIntro";
import SectionReveal from "./SectionReveal";
import { useStorefront } from "./StorefrontProvider";
import styles from "./OvironApproach.module.css";

const defaultIcons: LucideIcon[] = [ScanLine, MessageSquare, Handshake];

export default function OvironApproach() {
  const { marketing } = useStorefront();
  const approach = marketing.approach;
  const steps = [...(approach?.steps ?? [])].sort(
    (a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999)
  );
  const imageSrc = mediaUrl(approach?.image) || siteImages.approach;

  return (
    <section
      id="approach"
      className={styles.section}
      aria-labelledby="approach-heading"
    >
      <div className={`container ${styles.grid}`}>
        <div className={styles.visual}>
          <SafeImage
            src={imageSrc}
            alt={approach?.image?.alt ?? "Formal leather footwear — illustrative"}
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
              eyebrow={approach?.eyebrow ?? "Our approach"}
              title={approach?.title ?? "Partnerships begin with clarity."}
              lead={approach?.lead ?? "Structured discussions before quotation."}
              tone="dark"
            />
            <h2 id="approach-heading" className="sr-only">
              The Oviron approach
            </h2>
            <ul className={styles.list}>
              {steps.map((item, index) => {
                const Icon = defaultIcons[index] ?? ScanLine;
                return (
                  <li key={`approach-${index}`}>
                    <span className={styles.iconWrap}>
                      <Icon size={20} strokeWidth={1.5} aria-hidden />
                    </span>
                    <div>
                      <span className={styles.num}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
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
