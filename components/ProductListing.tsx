"use client";

import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Hammer,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CATALOGUE_PATH } from "@/lib/catalogue-routes";
import { getCatalog } from "@/lib/catalog";
import {
  manufacturingProducts,
  type ManufacturingProduct,
} from "@/lib/product-catalog";
import ProductManufacturingCard from "./ProductManufacturingCard";
import QuoteButton from "./QuoteButton";
import styles from "./ProductListing.module.css";

const PAGE_SIZE = 2;

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
            <ProductManufacturingCard
              product={product}
              index={page * PAGE_SIZE + index}
              showStyleLink
            />
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
  const catalog = getCatalog();
  const [activeMain, setActiveMain] = useState<string | "all">("all");

  const filteredProducts = useMemo(() => {
    if (activeMain === "all") return manufacturingProducts;
    return manufacturingProducts.filter((p) => p.mainCategoryId === activeMain);
  }, [activeMain]);

  const groupedBlocks = useMemo(() => {
    if (activeMain !== "all") {
      const main = catalog.mainCategories.find((m) => m.id === activeMain);
      if (!main) return [];
      return main.subcategories.map((sub) => ({
        mainLabel: main.label,
        subLabel: sub.label,
        subtitle: sub.description,
        items: sub.products.map(
          (p) => manufacturingProducts.find((m) => m.id === p.id)!
        ).filter(Boolean),
      }));
    }

    return catalog.mainCategories.flatMap((main) =>
      main.subcategories.map((sub) => ({
        mainLabel: main.label,
        subLabel: sub.label,
        subtitle: sub.description,
        items: sub.products.map(
          (p) => manufacturingProducts.find((m) => m.id === p.id)!
        ).filter(Boolean),
      }))
    );
  }, [activeMain, catalog.mainCategories]);

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
                <strong>{catalog.productCount}</strong>
                <span>Published styles</span>
              </li>
              <li>
                <strong>{catalog.mainCategories.length}</strong>
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
              key={`${block.mainLabel}-${block.subLabel}`}
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
              <PaginatedProductList
                items={block.items}
                paginationKey={`${activeMain}-${block.mainLabel}-${block.subLabel}`}
                paginationLabel={`${block.mainLabel} ${block.subLabel} pagination`}
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
