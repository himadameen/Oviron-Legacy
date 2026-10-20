"use client";

import {
  Box,
  Layers,
  Palette,
  Ruler,
  ShieldCheck,
  Tag,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import QuoteButton from "./QuoteButton";
import SectionIntro from "./SectionIntro";
import SectionReveal from "./SectionReveal";
import styles from "./ProductSpecifications.module.css";

const specGroups: { title: string; tags: string[]; icon: LucideIcon }[] = [
  {
    title: "Style",
    tags: ["Category", "Reference", "Use"],
    icon: Tag,
  },
  {
    title: "Materials",
    tags: ["Upper", "Leather", "Finish"],
    icon: Palette,
  },
  {
    title: "Construction",
    tags: ["Lining", "Sole", "Stitching"],
    icon: Layers,
  },
  {
    title: "Sizing",
    tags: ["Range", "Standard", "Color runs"],
    icon: Ruler,
  },
  {
    title: "Branding",
    tags: ["Logo", "Labels", "Packaging"],
    icon: Box,
  },
  {
    title: "Commercial",
    tags: ["Grade", "Qty", "Shipping"],
    icon: ShieldCheck,
  },
];

export default function ProductSpecifications() {
  return (
    <section
      id="specifications"
      className={`section ${styles.section}`}
      aria-labelledby="spec-heading"
    >
      <div className="container">
        <SectionReveal>
          <SectionIntro
            eyebrow="Specifications"
            title="Details that matter."
            lead="Confirmed per style before quote or production."
            align="center"
          />
          <h2 id="spec-heading" className="sr-only">
            Product specifications
          </h2>
        </SectionReveal>

        <div className={styles.grid}>
          {specGroups.map((group) => {
            const Icon = group.icon;
            return (
              <SectionReveal key={group.title}>
                <article className={styles.card}>
                  <div className={styles.head}>
                    <span className={styles.iconWrap}>
                      <Icon size={22} strokeWidth={1.5} aria-hidden />
                    </span>
                    <h3>{group.title}</h3>
                  </div>
                  <ul>
                    {group.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                </article>
              </SectionReveal>
            );
          })}
        </div>

        <div className={styles.ctaWrap}>
          <QuoteButton label="Request Specs & Quote" />
        </div>
      </div>
    </section>
  );
}
