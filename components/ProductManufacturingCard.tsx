"use client";

import { ArrowUpRight, Layers, Package, Palette } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  categoryLineFor,
  type ManufacturingProduct,
} from "@/lib/product-catalog";
import { getProductPath } from "@/lib/product-slugs";
import { productQuoteHref } from "@/lib/product-routes";
import QuoteButton from "./QuoteButton";
import SafeImage from "./SafeImage";
import SectionReveal from "./SectionReveal";
import styles from "./ProductListing.module.css";

const SLIDE_MS = 4200;

function ProductImageSlider({
  images,
  alt,
  eager,
}: {
  images: string[];
  alt: string;
  eager?: boolean;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [images]);

  useEffect(() => {
    if (images.length <= 1) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, SLIDE_MS);

    return () => clearInterval(timer);
  }, [images.length]);

  const goTo = (next: number) => {
    setIndex((next + images.length) % images.length);
  };

  return (
    <div
      className={styles.slider}
      aria-roledescription="carousel"
      aria-label={`${alt} — image gallery`}
    >
      {images.map((src, i) => (
        <div
          key={`${src}-${i}`}
          className={i === index ? styles.slideActive : styles.slide}
          aria-hidden={i !== index}
        >
          <SafeImage
            src={src}
            alt={i === index ? `${alt} — view ${i + 1}` : ""}
            fill
            loading={eager && i === 0 ? "eager" : "lazy"}
            fallbackKind="collection"
            className={styles.cardImage}
            sizes="(max-width: 900px) 100vw, 320px"
          />
        </div>
      ))}
      {images.length > 1 && (
        <>
          <span className={styles.sliderCount} aria-live="polite">
            {index + 1} / {images.length}
          </span>
          <div className={styles.sliderDots}>
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                className={i === index ? styles.dotActive : styles.dot}
                aria-label={`Show image ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
          <div className={styles.sliderProgress} aria-hidden>
            <span
              key={index}
              className={styles.sliderProgressBar}
              style={{ animationDuration: `${SLIDE_MS}ms` }}
            />
          </div>
        </>
      )}
    </div>
  );
}

type SpecTab = "materials" | "build" | "commercial";

function ProductSpecTabs({ product }: { product: ManufacturingProduct }) {
  const [tab, setTab] = useState<SpecTab>("materials");

  const panels: Record<
    SpecTab,
    { icon: typeof Palette; label: string; rows: { label: string; value: string }[] }
  > = {
    materials: {
      icon: Palette,
      label: "Materials",
      rows: [
        { label: "Upper", value: product.upperMaterial },
        { label: "Lining", value: product.lining },
        { label: "Colors", value: product.colorRuns },
      ],
    },
    build: {
      icon: Layers,
      label: "Build",
      rows: [
        { label: "Construction", value: product.construction },
        { label: "Sole", value: product.soleType },
        { label: "Size matrix", value: product.sizeLabel },
      ],
    },
    commercial: {
      icon: Package,
      label: "Commercial",
      rows: [
        { label: "Grades", value: product.gradeOptions },
        { label: "Private label", value: product.privateLabel },
        { label: "Packaging", value: product.packaging },
      ],
    },
  };

  const active = panels[tab];
  const Icon = active.icon;

  return (
    <div className={styles.specTabs}>
      <div className={styles.specTabList} role="tablist" aria-label="Product specifications">
        {(Object.keys(panels) as SpecTab[]).map((key) => {
          const PanelIcon = panels[key].icon;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              className={tab === key ? styles.specTabActive : styles.specTab}
              onClick={() => setTab(key)}
            >
              <PanelIcon size={14} strokeWidth={1.5} aria-hidden />
              {panels[key].label}
            </button>
          );
        })}
      </div>
      <div className={styles.specPanel} role="tabpanel" aria-label={active.label}>
        <div className={styles.specPanelHead}>
          <Icon size={18} strokeWidth={1.5} aria-hidden />
          <h3>{active.label}</h3>
        </div>
        <dl className={styles.specDl}>
          {active.rows.map((row) => (
            <div key={row.label}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

type ProductManufacturingCardProps = {
  product: ManufacturingProduct;
  index?: number;
  highlighted?: boolean;
  showStyleLink?: boolean;
};

export default function ProductManufacturingCard({
  product,
  index = 0,
  highlighted = false,
  showStyleLink = false,
}: ProductManufacturingCardProps) {
  const productPath = getProductPath(product);
  const quoteHref = productQuoteHref(product);

  return (
    <SectionReveal>
      <article
        id={`product-${product.id}`}
        className={`${styles.card} ${highlighted ? styles.cardHighlighted : ""}`}
      >
        <div className={styles.cardMedia}>
          <ProductImageSlider
            images={product.galleryImages}
            alt={product.imageAlt}
            eager={index < 2}
          />
          <div className={styles.cardMediaOverlay} aria-hidden />
          <span className={styles.cardCategory}>
            {categoryLineFor(product)}
          </span>
          <span className={styles.cardIndex}>{product.number}</span>
        </div>

        <div className={styles.cardBody}>
          <header className={styles.cardHead}>
            <div>
              <p className={styles.cardSku}>{product.skuRef}</p>
              <h2 className={styles.cardTitle}>
                {showStyleLink ? (
                  <Link href={productPath} className={styles.cardTitleLink}>
                    {product.name}
                  </Link>
                ) : (
                  product.name
                )}
              </h2>
              <p className={styles.cardTagline}>{product.description}</p>
            </div>
          </header>

          <ul className={styles.sizeStrip} aria-label="Size range">
            <li>
              <span>EU</span>
              {product.sizes.eu}
            </li>
            <li>
              <span>UK</span>
              {product.sizes.uk}
            </li>
            <li>
              <span>US</span>
              {product.sizes.us}
            </li>
          </ul>

          <p className={styles.cardUse}>
            <span>Typical use</span>
            {product.typicalUse}
          </p>

          <ProductSpecTabs product={product} />

          <footer className={styles.cardFoot}>
            {showStyleLink ? (
              <Link href={productPath} className={styles.stylePageLink}>
                View style page
                <ArrowUpRight size={15} strokeWidth={1.5} aria-hidden />
              </Link>
            ) : null}
            <QuoteButton
              href={quoteHref}
              label="Request manufacturing quote"
              variant="primary"
            />
          </footer>
        </div>
      </article>
    </SectionReveal>
  );
}
