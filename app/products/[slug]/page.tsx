import type { Metadata } from "next";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProductDetailView from "@/components/ProductDetailView";
import ProductManufacturingCard from "@/components/ProductManufacturingCard";
import ScrollToTop from "@/components/ScrollToTop";
import SiteChrome from "@/components/SiteChrome";
import styles from "@/components/ProductListing.module.css";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/json-ld";
import {
  categoryLineFor,
  manufacturingProducts,
} from "@/lib/product-catalog";
import {
  getProductBySeoSlug,
  productCatalogFilterHref,
} from "@/lib/product-routes";
import { getProductPath, primaryColorKeywords } from "@/lib/product-slugs";
import { CATALOGUE_PATH } from "@/lib/catalogue-routes";
import { ogImageFromPath } from "@/lib/seo-images";
import { pageMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return manufacturingProducts.map((product) => ({
    slug: product.seoSlug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySeoSlug(slug);
  if (!product) {
    return pageMetadata({
      title: "Product not found | Oviron",
      description: "The requested footwear style could not be found.",
      path: "/products",
      noIndex: true,
    });
  }

  const colors = primaryColorKeywords(product.colorRuns).join(", ");
  const path = getProductPath(product);
  const title = `${product.name} (${product.skuRef}) | Oviron Catalog`;
  const description = `${product.description} — ${categoryLineFor(product)}. SKU ${product.skuRef}. Colors: ${colors}. ${product.upperMaterial}. Sizes ${product.sizeLabel}. B2B quote enquiry.`;

  const primaryImage = product.galleryImages[0] ?? product.image;

  return pageMetadata({
    title,
    description,
    path,
    ogTitle: `${product.name} · ${product.skuRef} | Oviron`,
    ogImage: ogImageFromPath(
      primaryImage,
      `${product.name} — ${product.skuRef}`
    ),
    keywords: [
      product.name,
      product.skuRef,
      product.mainCategoryLabel,
      product.subCategoryLabel,
      "leather goods wholesale",
      "B2B sourcing",
      ...primaryColorKeywords(product.colorRuns),
    ],
  });
}

export default async function ProductStylePage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySeoSlug(slug);
  if (!product) notFound();

  const path = getProductPath(product);
  const mainFilterHref = productCatalogFilterHref(product.mainCategoryId);
  const subFilterHref = productCatalogFilterHref(
    product.mainCategoryId,
    product.subCategoryId
  );

  const related = manufacturingProducts
    .filter(
      (p) =>
        p.id !== product.id &&
        p.mainCategoryId === product.mainCategoryId &&
        p.subCategoryId === product.subCategoryId
    )
    .slice(0, 4);

  const structuredData = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Product catalog", path: "/products" },
      { name: product.mainCategoryLabel, path: mainFilterHref },
      { name: product.subCategoryLabel, path: subFilterHref },
      { name: product.name, path },
    ]),
    productJsonLd(product),
  ];

  return (
    <>
      {structuredData.map((data, index) => (
        <script
          key={`product-ld-${String(data["@type"])}-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
      <SiteChrome>
        <Header />
      </SiteChrome>
      <main id="main-content" className={styles.detailWrap}>
        <div className={`container ${styles.detailHero}`}>
          <nav
            className={`${styles.breadcrumb} ${styles.breadcrumbLight}`}
            aria-label="Breadcrumb"
          >
            <Link href="/">Home</Link>
            <ChevronRight size={14} aria-hidden />
            <Link href="/products">Product catalog</Link>
            <ChevronRight size={14} aria-hidden />
            <Link href={mainFilterHref}>{product.mainCategoryLabel}</Link>
            <ChevronRight size={14} aria-hidden />
            <Link href={subFilterHref}>{product.subCategoryLabel}</Link>
            <ChevronRight size={14} aria-hidden />
            <span aria-current="page">{product.name}</span>
          </nav>
        </div>

        <div className="container">
          <ProductDetailView product={product} />
        </div>

        {related.length > 0 ? (
          <section
            className={styles.detailRelated}
            aria-labelledby="related-styles-heading"
          >
            <div className="container">
              <header className={styles.detailRelatedHead}>
                <p className={styles.detailRelatedEyebrow}>
                  {product.subCategoryLabel}
                </p>
                <h2 id="related-styles-heading">Related styles</h2>
                <p>
                  More {product.mainCategoryLabel.toLowerCase()} in{" "}
                  {product.subCategoryLabel.toLowerCase()} — open a style for
                  full specifications.
                </p>
              </header>
              <ul className={styles.detailRelatedList}>
                {related.map((item, index) => (
                  <li key={item.id}>
                    <ProductManufacturingCard
                      product={item}
                      index={index}
                      showStyleLink
                    />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        <div className={`container ${styles.detailFooterActions}`}>
          <Link href={CATALOGUE_PATH} className={styles.detailCatalogueLink}>
            View full catalogue
            <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden />
          </Link>
          <Link href="/products" className={styles.detailBackLink}>
            Back to product catalog
          </Link>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
      <FloatingWhatsApp />
    </>
  );
}
