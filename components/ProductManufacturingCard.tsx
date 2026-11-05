"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import {
  categoryLineFor,
  type ManufacturingProduct,
} from "@/lib/product-catalog";
import { getProductPath } from "@/lib/product-slugs";
import { productQuoteHref } from "@/lib/product-routes";
import ProductGallery from "./product/ProductGallery";
import ProductSpecTabs from "./product/ProductSpecTabs";
import QuoteButton from "./QuoteButton";
import SectionReveal from "./SectionReveal";
import styles from "./ProductListing.module.css";

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
          <ProductGallery
            images={product.galleryImages}
            alt={product.imageAlt}
            eager={index < 2}
            layout="card"
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
