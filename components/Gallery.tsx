"use client";

import { ZoomIn } from "lucide-react";
import { galleryItems } from "@/lib/gallery";
import QuoteButton from "./QuoteButton";
import SectionIntro from "./SectionIntro";
import SectionReveal from "./SectionReveal";
import SafeImage from "./SafeImage";
import styles from "./Gallery.module.css";

export default function Gallery() {
  return (
    <section id="gallery" className={`section ${styles.section}`} aria-labelledby="gallery-heading">
      <div className="container">
        <SectionReveal>
          <SectionIntro
            eyebrow="Gallery"
            title="Visual catalogue."
            lead="Studio and campaign frames — swap with your professional shoot assets."
            align="center"
            titleId="gallery-heading"
          />
        </SectionReveal>

        <ul className={styles.grid}>
          {galleryItems.map((item, index) => (
            <li
              key={item.id}
              className={
                item.span === "wide"
                  ? styles.wide
                  : item.span === "tall"
                    ? styles.tall
                    : undefined
              }
            >
              <SectionReveal>
                <figure className={styles.frame}>
                  <SafeImage
                    src={item.image}
                    alt={item.imageAlt}
                    width={800}
                    height={600}
                    loading={index < 2 ? "eager" : "lazy"}
                    fallbackKind="collection"
                    className={styles.image}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <figcaption className={styles.caption}>
                    <span>{item.title}</span>
                    <ZoomIn size={16} aria-hidden />
                  </figcaption>
                </figure>
              </SectionReveal>
            </li>
          ))}
        </ul>

        <div className={styles.cta}>
          <QuoteButton label="Enquire from Gallery" />
        </div>
      </div>
    </section>
  );
}
