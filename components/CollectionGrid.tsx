"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { CATALOGUE_DOWNLOAD_PATH, CATALOGUE_PATH } from "@/lib/catalogue-routes";
import { getCatalog, type CatalogProduct } from "@/lib/catalog";
import { productCatalogHref } from "@/lib/product-routes";
import QuoteButton from "./QuoteButton";
import SafeImage from "./SafeImage";
import SectionIntro from "./SectionIntro";
import SectionReveal from "./SectionReveal";
import styles from "./CollectionGrid.module.css";

function defaultMainCategoryId(
  mains: ReturnType<typeof getCatalog>["mainCategories"]
): string {
  return mains.find((m) => m.id === "shoes")?.id ?? mains[0]?.id ?? "";
}

export default function CollectionGrid() {
  const catalog = getCatalog();
  const [activeMain, setActiveMain] = useState(() =>
    defaultMainCategoryId(catalog.mainCategories)
  );

  const activeCategory = useMemo(
    () => catalog.mainCategories.find((m) => m.id === activeMain),
    [catalog.mainCategories, activeMain]
  );

  const blocks = useMemo(() => {
    if (!activeCategory) return [];
    return activeCategory.subcategories.map((sub) => ({
      subLabel: sub.label,
      subDescription: sub.description,
      products: sub.products,
    }));
  }, [activeCategory]);

  if (catalog.productCount === 0 || catalog.mainCategories.length === 0) {
    return null;
  }

  const styleCount =
    activeCategory?.productCount ??
    blocks.reduce((n, b) => n + b.products.length, 0);

  return (
    <section
      id="collections"
      className="section"
      aria-labelledby="collections-heading"
    >
      <div className="container">
        <SectionReveal>
          <SectionIntro
            eyebrow="Collections"
            title={
              activeCategory
                ? `${activeCategory.label} sourcing`
                : "Product collections"
            }
            lead={
              activeCategory?.subtitle ??
              "Browse by line — open a style for full specifications."
            }
            align="center"
            titleId="collections-heading"
          />
        </SectionReveal>

        <div className={styles.categoryShell}>
          <div
            className={styles.filters}
            role="tablist"
            aria-label="Product categories"
          >
            {catalog.mainCategories.map((main) => (
              <button
                key={main.id}
                type="button"
                role="tab"
                aria-selected={activeMain === main.id}
                className={
                  activeMain === main.id ? styles.filterActive : styles.filter
                }
                onClick={() => setActiveMain(main.id)}
              >
                {main.label}
              </button>
            ))}
          </div>
          {activeCategory ? (
            <p className={styles.categoryMeta}>
              {styleCount} style{styleCount === 1 ? "" : "s"} in{" "}
              {activeCategory.label}
            </p>
          ) : null}
        </div>

        <div className={styles.blocks}>
          {blocks.map((block) => (
            <div key={block.subLabel} className={styles.groupBlock}>
              <header className={styles.groupHead}>
                <h3>{block.subLabel}</h3>
                {block.subDescription ? (
                  <p>{block.subDescription}</p>
                ) : null}
              </header>
              <ul className={styles.grid}>
                {block.products.map((item, index) => (
                  <li key={item.id}>{renderCard(item, index)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.footerCta}>
          <Link href="/products" className={styles.catalogLink}>
            View full manufacturing catalog
            <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden />
          </Link>
          <Link href={CATALOGUE_PATH} className={styles.catalogLink}>
            View Catalogue
            <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden />
          </Link>
          <Link href={CATALOGUE_DOWNLOAD_PATH} className={styles.catalogLink}>
            Download catalogue
            <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden />
          </Link>
          <QuoteButton label="Request a Quote" />
        </div>
      </div>
    </section>
  );

  function renderCard(item: CatalogProduct, index: number) {
    const href = productCatalogHref(item.id);

    return (
      <SectionReveal>
        <Link
          href={href}
          className={styles.card}
          aria-label={`View product: ${item.name}`}
        >
          <div className={styles.imageWrap}>
            <SafeImage
              src={item.image}
              alt={item.imageAlt}
              width={640}
              height={480}
              loading={index < 3 ? "eager" : "lazy"}
              fallbackKind="collection"
              className={styles.image}
              sizes="(max-width: 640px) 100vw, 33vw"
            />
            <span className={styles.num}>{item.number}</span>
          </div>
          <div className={styles.body}>
            <p className={styles.sku}>{item.sku}</p>
            <h4>{item.name}</h4>
            <p>{item.description}</p>
            <span className={styles.action}>
              View spec
              <ArrowUpRight size={15} strokeWidth={1.5} />
            </span>
          </div>
        </Link>
      </SectionReveal>
    );
  }
}
