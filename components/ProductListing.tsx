"use client";

import {
  ArrowUpRight,
  ChevronRight,
  Hammer,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CATALOGUE_PATH } from "@/lib/catalogue-routes";
import { useCatalogContext } from "@/lib/catalog-context";
import {
  manufacturingProductsFromCatalog,
  type ManufacturingProduct,
} from "@/lib/product-catalog";
import { useGetStatsQuery } from "@/lib/store/api/strapiApi";
import ProductManufacturingCard from "./ProductManufacturingCard";
import QuoteButton from "./QuoteButton";
import styles from "./ProductListing.module.css";

const PAGE_SIZE = 2;

function LazyProductList({
  items,
  paginationKey,
  blockLabel,
}: {
  items: ManufacturingProduct[];
  paginationKey: string;
  blockLabel: string;
}) {
  const [visibleCount, setVisibleCount] = useState(() =>
    Math.min(PAGE_SIZE, items.length)
  );
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setVisibleCount(Math.min(PAGE_SIZE, items.length));
  }, [paginationKey, items]);

  const visible = useMemo(
    () => items.slice(0, visibleCount),
    [items, visibleCount]
  );
  const hasMore = visibleCount < items.length;

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, items.length));
  }, [items.length]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { root: null, rootMargin: "240px 0px", threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadMore, visibleCount, items.length]);

  return (
    <>
      <ul className={styles.list} aria-label={blockLabel}>
        {visible.map((product, index) => (
          <li
            key={`${product.mainCategoryId}-${product.subCategoryId}-${product.sku}`}
          >
            <ProductManufacturingCard
              product={product}
              index={index}
              showStyleLink
            />
          </li>
        ))}
      </ul>
      {hasMore ? (
        <div
          ref={sentinelRef}
          className={styles.lazySentinel}
          aria-hidden
        />
      ) : null}
      {hasMore ? (
        <p className={styles.lazyHint} aria-live="polite">
          Scroll for more styles in this group
        </p>
      ) : items.length > PAGE_SIZE ? (
        <p className={styles.lazyHint} aria-live="polite">
          All {items.length} styles in this group are shown
        </p>
      ) : null}
    </>
  );
}

export default function ProductListing() {
  const catalog = useCatalogContext();
  const { data: statsData } = useGetStatsQuery();

  const [activeMain, setActiveMain] = useState<string | "all">("all");

  const manufacturingList = useMemo(() => {
    return manufacturingProductsFromCatalog(catalog);
  }, [catalog]);

  const searchParams = useSearchParams();

  useEffect(() => {
    const main = searchParams.get("main");
    if (!main) return;
    const exists = catalog.mainCategories.some((m) => m.id === main);
    if (exists) {
      setActiveMain(main);
    }
  }, [searchParams, catalog.mainCategories]);

  useEffect(() => {
    const main = searchParams.get("main");
    const sub = searchParams.get("sub");
    if (!main || !sub) return;

    const frame = window.requestAnimationFrame(() => {
      document
        .getElementById(`catalog-${main}-${sub}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    if (activeMain === "all") return manufacturingList;
    return manufacturingList.filter((p) => p.mainCategoryId === activeMain);
  }, [activeMain, manufacturingList]);

  const groupedBlocks = useMemo(() => {
    const byId = new Map(manufacturingList.map((p) => [p.id, p]));

    if (activeMain !== "all") {
      const main = catalog.mainCategories.find((m) => m.id === activeMain);
      if (!main) return [];
      return main.subcategories.map((sub) => ({
        mainId: main.id,
        subId: sub.id,
        mainLabel: main.label,
        subLabel: sub.label,
        subtitle: sub.description,
        items: sub.products
          .map((p) => byId.get(p.id))
          .filter(Boolean) as ManufacturingProduct[],
      }));
    }

    return catalog.mainCategories.flatMap((main) =>
      main.subcategories.map((sub) => ({
        mainId: main.id,
        subId: sub.id,
        mainLabel: main.label,
        subLabel: sub.label,
        subtitle: sub.description,
        items: sub.products
          .map((p) => byId.get(p.id))
          .filter(Boolean) as ManufacturingProduct[],
      }))
    );
  }, [activeMain, catalog.mainCategories, manufacturingList]);

  const publishedStylesCount =
    statsData?.totals.activeProducts ?? catalog.productCount;
  const mainCategoriesCount =
    statsData?.totals.mainCategories ?? catalog.mainCategories.length;

  if (catalog.productCount === 0) {
    return (
      <div className="container section">
        <p>Catalog will appear here once products are published.</p>
      </div>
    );
  }

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
                Every category.
                <span>Spec-ready for buyers.</span>
              </h1>
              <p className={styles.heroLead}>
                Shoes, belts, bags, wallets, and more — materials, construction,
                and commercial terms aligned before production.
              </p>
              <div className={styles.heroActions}>
                <Link href={CATALOGUE_PATH} className={styles.heroCtaSecondary}>
                  View Catalogue
                  <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden />
                </Link>
                <Link href="/#contact" className={styles.heroCtaSecondary}>
                  Speak to sourcing
                  <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden />
                </Link>
              </div>
            </div>

            <ul className={styles.heroStats}>
              <li>
                <strong>{publishedStylesCount}</strong>
                <span>Published styles</span>
              </li>
              <li>
                <strong>{mainCategoriesCount}</strong>
                <span>Main categories</span>
              </li>
              <li>
                <strong>SKU</strong>
                <span>Traceable references</span>
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
              aria-label="Main product categories"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeMain === "all"}
                className={activeMain === "all" ? styles.filterActive : styles.filter}
                onClick={() => setActiveMain("all")}
              >
                All
              </button>
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
            <p className={styles.count}>
              {filteredProducts.length} style
              {filteredProducts.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
      </div>

      <section className={styles.catalog} aria-labelledby="catalog-heading">
        <div className="container">
          <h2 id="catalog-heading" className="sr-only">
            Product manufacturing list
          </h2>

          {groupedBlocks.map((block) => (
            <div
              key={`${block.mainId}-${block.subId}`}
              id={`catalog-${block.mainId}-${block.subId}`}
              className={styles.group}
            >
              <header className={styles.groupHead}>
                <div>
                  <p className={styles.groupLabel}>
                    {block.mainLabel} · {block.subLabel}
                  </p>
                  <h3 className={styles.groupTitle}>
                    {block.subtitle ?? block.subLabel}
                  </h3>
                </div>
                <span className={styles.groupCount}>
                  {block.items.length} styles
                </span>
              </header>
              <LazyProductList
                items={block.items}
                paginationKey={`${activeMain}-${block.mainId}-${block.subId}`}
                blockLabel={`${block.mainLabel} · ${block.subLabel}`}
              />
            </div>
          ))}

          <aside className={styles.bottomCta}>
            <div className={styles.bottomCopy}>
              <p className={styles.bottomEyebrow}>Custom programs</p>
              <h2>Need a line not shown here?</h2>
              <p>
                Custom design, packaging, and private-label branding are scoped
                per supplier feasibility and your destination market.
              </p>
            </div>
            <div className={styles.bottomActions}>
              <Link href={CATALOGUE_PATH} className={styles.catalogueLink}>
                View Catalogue
                <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden />
              </Link>
              <QuoteButton
                href="/#contact"
                label="Discuss custom manufacturing"
                variant="light"
              />
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
