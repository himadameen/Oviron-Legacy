"use client";

import { ArrowRight, ArrowUpRight, BookOpen, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { normalizedCatalogFromStrapiHome } from "@/lib/api/normalize-catalog-response";
import { CATALOGUE_PATH } from "@/lib/catalogue-routes";
import { useCatalogContext } from "@/lib/catalog-context";
import type { CatalogProduct } from "@/lib/catalog";
import { productCatalogHref } from "@/lib/product-routes";
import { useGetHomeQuery } from "@/lib/store/api/strapiApi";
import ProductTagChips from "./ProductTagChips";
import QuoteButton from "./QuoteButton";
import SafeImage from "./SafeImage";
import SectionIntro from "./SectionIntro";
import SectionReveal from "./SectionReveal";
import styles from "./CollectionGrid.module.css";

function defaultMainCategoryId(
  mains: ReturnType<typeof useCatalogContext>["mainCategories"]
): string {
  return mains.find((m) => m.id === "shoes")?.id ?? mains[0]?.id ?? "";
}

export default function CollectionGrid() {
  const serverCatalog = useCatalogContext();
  const useApi = Boolean(process.env.NEXT_PUBLIC_STRAPI_URL?.trim());
  const { data: home, isFetching, isError } = useGetHomeQuery(
    { page: 1, pageSize: 8 },
    { skip: !useApi }
  );

  const catalog = useMemo(() => {
    if (!useApi || isError || !home) return serverCatalog;
    try {
      return normalizedCatalogFromStrapiHome(home);
    } catch {
      return serverCatalog;
    }
  }, [useApi, isError, home, serverCatalog]);

  const [activeMain, setActiveMain] = useState(() =>
    defaultMainCategoryId(catalog.mainCategories)
  );

  useEffect(() => {
    setActiveMain((prev) => {
      const stillValid = catalog.mainCategories.some((m) => m.id === prev);
      if (stillValid) return prev;
      return defaultMainCategoryId(catalog.mainCategories);
    });
  }, [catalog.mainCategories]);

  const activeCategory = useMemo(
    () => catalog.mainCategories.find((m) => m.id === activeMain),
    [catalog.mainCategories, activeMain]
  );

  const blocks = useMemo(() => {
    if (!activeCategory) return [];
    return activeCategory.subcategories.map((sub) => ({
      subId: sub.id,
      subLabel: sub.label,
      subDescription: sub.description,
      products: sub.products,
    }));
  }, [activeCategory]);

  if (catalog.productCount === 0 || catalog.mainCategories.length === 0) {
    return null;
  }

  if (useApi && isFetching && catalog === serverCatalog && serverCatalog.productCount === 0) {
    return (
      <section
        id="collections"
        className="section"
        aria-labelledby="collections-heading"
        aria-busy="true"
      >
        <div className="container">
          <p className="text-muted">Loading collections…</p>
        </div>
      </section>
    );
  }

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
        </div>

        <div className={styles.blocks}>
          {blocks.map((block, blockIndex) => (
            <div
              key={`${activeMain}-${block.subId}-${blockIndex}`}
              className={styles.groupBlock}
            >
              <header className={styles.groupHead}>
                <h3>{block.subLabel}</h3>
                {block.subDescription ? (
                  <p>{block.subDescription}</p>
                ) : null}
              </header>
              <ul className={styles.grid}>
                {block.products.map((item, index) => (
                  <li key={`${block.subId}-${item.sku}-${index}`}>
                    {renderCard(item, index)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.footerCta}>
          <div className={styles.footerCtaActions}>
            <Link href="/products" className={styles.footerBtnGhost}>
              <span className={styles.footerBtnIcon} aria-hidden>
                <LayoutGrid size={20} strokeWidth={1.5} />
              </span>
              <span className={styles.footerBtnLabel}>
                <span className={styles.footerBtnTitle}>Manufacturing catalog</span>
                <span className={styles.footerBtnHint}>Browse all styles &amp; specs</span>
              </span>
              <ArrowRight size={18} strokeWidth={1.5} aria-hidden className={styles.footerBtnArrow} />
            </Link>
            <Link href={CATALOGUE_PATH} className={styles.footerBtnGhost}>
              <span className={styles.footerBtnIcon} aria-hidden>
                <BookOpen size={20} strokeWidth={1.5} />
              </span>
              <span className={styles.footerBtnLabel}>
                <span className={styles.footerBtnTitle}>Digital catalogue</span>
                <span className={styles.footerBtnHint}>Flipbook &amp; print layout</span>
              </span>
              <ArrowRight size={18} strokeWidth={1.5} aria-hidden className={styles.footerBtnArrow} />
            </Link>
            <QuoteButton
              className={styles.footerBtnPrimary}
              label="Request a quote"
              href="/#contact"
            />
          </div>
        </div>
      </div>
    </section>
  );

  function renderCard(item: CatalogProduct, index: number) {
    const href = productCatalogHref(item.id, catalog);

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
            {item.productTags?.length ? (
              <div className={styles.tagRow}>
                <ProductTagChips tags={item.productTags} size="compact" />
              </div>
            ) : null}
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
