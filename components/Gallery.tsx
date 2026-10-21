"use client";

import { Grid3X3 } from "lucide-react";
import { useState } from "react";
import { galleryItems } from "@/lib/gallery";
import GalleryCollageModal from "./GalleryCollageModal";
import QuoteButton from "./QuoteButton";
import SectionIntro from "./SectionIntro";
import SectionReveal from "./SectionReveal";
import SafeImage from "./SafeImage";
import styles from "./Gallery.module.css";

/** 8 tiles = full 4×2 grid with no gaps */
const PREVIEW_COUNT = 8;

export default function Gallery() {
  const [collageOpen, setCollageOpen] = useState(false);
  const preview = galleryItems.slice(0, PREVIEW_COUNT);

  return (
    <section
      id="gallery"
      className={`section ${styles.section}`}
      aria-labelledby="gallery-heading"
    >
      <div className="container">
        <SectionReveal>
          <SectionIntro
            eyebrow="Gallery"
            title="Work &amp; footwear in focus."
            lead={`Preview ${preview.length} frames — open the collage for all ${galleryItems.length} images.`}
            align="center"
            titleId="gallery-heading"
          />
        </SectionReveal>

        <SectionReveal>
          <div className={styles.mosaic}>
            {preview.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={styles.tile}
                onClick={() => setCollageOpen(true)}
                aria-label={`Open collage — ${item.title}`}
              >
                <SafeImage
                  src={item.image}
                  alt={item.imageAlt}
                  width={600}
                  height={500}
                  loading={index < 4 ? "eager" : "lazy"}
                  fallbackKind="collection"
                  className={styles.image}
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <span className={styles.tileLabel}>{item.title}</span>
              </button>
            ))}
          </div>
        </SectionReveal>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.collageBtn}
            onClick={() => setCollageOpen(true)}
          >
            <Grid3X3 size={18} strokeWidth={1.5} aria-hidden />
            View full photo collage ({galleryItems.length})
          </button>
          <QuoteButton label="Enquire from gallery" variant="secondary" />
        </div>
      </div>

      <GalleryCollageModal
        items={galleryItems}
        open={collageOpen}
        onClose={() => setCollageOpen(false)}
      />
    </section>
  );
}
