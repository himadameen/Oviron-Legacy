"use client";

import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Hammer,
  Layers,
  Package,
  Palette,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CollectionGroupId } from "@/lib/collections";
import {
  collectionGroups,
  groupLabelFor,
  manufacturingProducts,
  type ManufacturingProduct,
} from "@/lib/product-catalog";
import QuoteButton from "./QuoteButton";
import SafeImage from "./SafeImage";
import SectionReveal from "./SectionReveal";
import styles from "./ProductListing.module.css";

const PAGE_SIZE = 2;
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
      <div
        className={styles.specPanel}
        role="tabpanel"
        aria-label={active.label}
      >
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

function ProductCard({
  product,
  index,
}: {
  product: ManufacturingProduct;
  index: number;
}) {
  const quoteHref = `/?category=${encodeURIComponent(product.name)}#contact`;

  return (
    <SectionReveal>
      <article className={styles.card}>
        <div className={styles.cardMedia}>
          <ProductImageSlider
            images={product.galleryImages}
            alt={product.imageAlt}
            eager={index < 2}
          />
          <div className={styles.cardMediaOverlay} aria-hidden />
          <span className={styles.cardCategory}>
            {groupLabelFor(product.group)}
          </span>
          <span className={styles.cardIndex}>{product.number}</span>
        </div>

        <div className={styles.cardBody}>
          <header className={styles.cardHead}>
            <div>
              <p className={styles.cardSku}>{product.skuRef}</p>
              <h2 className={styles.cardTitle}>{product.name}</h2>
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

function Pagination({
  page,
  totalPages,
  onPageChange,
  label,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  label: string;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav className={styles.pagination} aria-label={label}>
      <button
        type="button"
        className={styles.pageBtn}
        disabled={page === 0}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
        Previous
      </button>
      <span className={styles.pageMeta}>
        Page {page + 1} of {totalPages}
      </span>
      <button
        type="button"
        className={styles.pageBtn}
        disabled={page >= totalPages - 1}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
      >
        Next
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}

function PaginatedProductList({
  items,
  paginationKey,
  paginationLabel,
}: {
  items: ManufacturingProduct[];
  paginationKey: string;
  paginationLabel: string;
}) {
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));

  useEffect(() => {
    setPage(0);
  }, [paginationKey, items.length]);

  const visible = useMemo(() => {
    const start = page * PAGE_SIZE;
    return items.slice(start, start + PAGE_SIZE);
  }, [items, page]);

  return (
    <>
      <ul className={styles.list}>
        {visible.map((product, index) => (
          <li key={product.id}>
            <ProductCard product={product} index={page * PAGE_SIZE + index} />
          </li>
        ))}
      </ul>
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        label={paginationLabel}
      />
    </>
  );
}

export default function ProductListing() {
  const [active, setActive] = useState<CollectionGroupId | "all">("all");

  const filtered = useMemo(() => {
    if (active === "all") return manufacturingProducts;
    return manufacturingProducts.filter((p) => p.group === active);
  }, [active]);

  const grouped = useMemo(() => {
    if (active !== "all") return null;
    return collectionGroups
      .map((group) => ({
        ...group,
        items: manufacturingProducts.filter((p) => p.group === group.id),
      }))
      .filter((g) => g.items.length > 0);
  }, [active]);

  return (
    <>
      <header id="catalog-top" className={styles.hero}>
        <div className={styles.heroGlow} aria-hidden />
        <div className="container">
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <ChevronRight size={14} aria-hidden />
            <span aria-current="page">Product catalog</span>
          </nav>

          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <p className={styles.heroEyebrow}>
                <Hammer size={15} strokeWidth={1.5} aria-hidden />
                Manufacturing catalog
              </p>
              <h1>
                Every style.
                <span>Spec-ready for buyers.</span>
              </h1>
              <p className={styles.heroLead}>
                Full footwear line for wholesale and private-label programs —
                materials, construction, and commercial terms aligned before
                production.
              </p>
              <Link href="/#contact" className={styles.heroCta}>
                Speak to sourcing
                <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden />
              </Link>
            </div>

            <ul className={styles.heroStats}>
              <li>
                <strong>{manufacturingProducts.length}</strong>
                <span>Manufacturing styles</span>
              </li>
              <li>
                <strong>{collectionGroups.length}</strong>
                <span>Product families</span>
              </li>
              <li>
                <strong>EU · UK · US</strong>
                <span>Size matrices</span>
              </li>
              <li>
                <strong>B2B</strong>
                <span>Export &amp; wholesale</span>
              </li>
            </ul>
          </div>
        </div>
      </header>

      <div className={styles.stickyBar}>
        <div className="container">
          <div className={styles.toolbar}>
            <div
              className={styles.filters}
              role="tablist"
              aria-label="Product categories"
            >
              <button
                type="button"
                role="tab"
                aria-selected={active === "all"}
                className={active === "all" ? styles.filterActive : styles.filter}
                onClick={() => setActive("all")}
              >
                All
              </button>
              {collectionGroups.map((group) => (
                <button
                  key={group.id}
                  type="button"
                  role="tab"
                  aria-selected={active === group.id}
                  className={
                    active === group.id ? styles.filterActive : styles.filter
                  }
                  onClick={() => setActive(group.id)}
                >
                  {group.label}
                </button>
              ))}
            </div>
            <p className={styles.count}>
              {filtered.length} style{filtered.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
      </div>

      <section className={styles.catalog} aria-labelledby="catalog-heading">
        <div className="container">
          <h2 id="catalog-heading" className="sr-only">
            Product manufacturing list
          </h2>

          {grouped ? (
            grouped.map((group) => (
              <div
                key={group.id}
                id={`catalog-${group.id}`}
                className={styles.group}
              >
                <header className={styles.groupHead}>
                  <div>
                    <p className={styles.groupLabel}>{group.label}</p>
                    <h3 className={styles.groupTitle}>{group.subtitle}</h3>
                  </div>
                  <span className={styles.groupCount}>
                    {group.items.length} styles
                  </span>
                </header>
                <PaginatedProductList
                  items={group.items}
                  paginationKey={`${active}-${group.id}`}
                  paginationLabel={`${group.label} products pagination`}
                />
              </div>
            ))
          ) : (
            <PaginatedProductList
              items={filtered}
              paginationKey={active}
              paginationLabel="Filtered products pagination"
            />
          )}

          <aside className={styles.bottomCta}>
            <div className={styles.bottomCopy}>
              <p className={styles.bottomEyebrow}>Custom programs</p>
              <h2>Need a last or line not shown here?</h2>
              <p>
                Custom design, packaging, and private-label branding are scoped
                per supplier feasibility and your destination market.
              </p>
            </div>
            <QuoteButton
              href="/#contact"
              label="Discuss custom manufacturing"
              variant="light"
            />
          </aside>
        </div>
      </section>
    </>
  );
}
