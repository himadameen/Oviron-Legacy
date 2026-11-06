"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import {
  categoryLineFor,
  type ManufacturingProduct,
} from "@/lib/product-catalog";
import { CATALOGUE_PATH } from "@/lib/catalogue-routes";
import { productQuoteHref } from "@/lib/product-routes";
import ProductGallery from "./product/ProductGallery";
import ProductSpecTabs from "./product/ProductSpecTabs";
import ProductTagChips from "./ProductTagChips";
import QuoteButton from "./QuoteButton";
import SectionReveal from "./SectionReveal";
import styles from "./ProductListing.module.css";

type ProductDetailViewProps = {
  product: ManufacturingProduct;
};

export default function ProductDetailView({ product }: ProductDetailViewProps) {
  const quoteHref = productQuoteHref(product);

  return (
    <SectionReveal>
      <article className={styles.detailPanel}>
        <div className={styles.detailGrid}>
          <div className={styles.detailGalleryCol}>
            <ProductGallery
              images={product.galleryImages}
              alt={product.imageAlt}
              eager
              layout="detail"
            />
            <span className={styles.detailGalleryCategory}>
              {categoryLineFor(product)}
            </span>
          </div>

          <div className={styles.detailMain}>
            <header className={styles.detailHeader}>
              <p className={styles.detailEyebrow}>
                <span>{product.skuRef}</span>
                <span aria-hidden>·</span>
                <span>{categoryLineFor(product)}</span>
              </p>
              <h1 className={styles.detailTitle}>{product.name}</h1>
              <p className={styles.detailLead}>{product.description}</p>
              {product.productTags.length > 0 ? (
                <div className={styles.detailTagRow}>
                  <ProductTagChips tags={product.productTags} />
                </div>
              ) : null}
              <div className={styles.detailActions}>
                <QuoteButton
                  href={quoteHref}
                  label="Request manufacturing quote"
                  variant="primary"
                />
                <Link href={CATALOGUE_PATH} className={styles.detailSecondaryLink}>
                  View catalogue
                  <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden />
                </Link>
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

            <ProductSpecTabs product={product} layout="detail" />
          </div>
        </div>
      </article>
    </SectionReveal>
  );
}
