import type { Metadata } from "next";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProductManufacturingCard from "@/components/ProductManufacturingCard";
import ScrollToTop from "@/components/ScrollToTop";
import SiteChrome from "@/components/SiteChrome";
import styles from "@/components/ProductListing.module.css";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/json-ld";
import {
  categoryLineFor,
  manufacturingProducts,
} from "@/lib/product-catalog";
import { getProductBySeoSlug } from "@/lib/product-routes";
import { getProductPath, primaryColorKeywords } from "@/lib/product-slugs";
import { CATALOGUE_DOWNLOAD_PATH, CATALOGUE_PATH } from "@/lib/catalogue-routes";
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

  return pageMetadata({
    title,
    description,
    path,
    ogTitle: `${product.name} · ${product.skuRef} | Oviron`,
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
  const colors = primaryColorKeywords(product.colorRuns);

  const structuredData = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Product catalog", path: "/products" },
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
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <ChevronRight size={14} aria-hidden />
            <Link href="/products">Product catalog</Link>
            <ChevronRight size={14} aria-hidden />
            <span aria-current="page">{product.name}</span>
          </nav>

          <div className={styles.detailCatalogueActions}>
            <Link href={CATALOGUE_PATH} className={styles.detailCatalogueLink}>
              View Catalogue
              <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden />
            </Link>
            <Link href={CATALOGUE_DOWNLOAD_PATH} className={styles.detailCatalogueLink}>
              Download catalogue
              <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden />
            </Link>
          </div>

          <ul className={styles.detailMeta}>
            <li>
              <strong>SKU</strong> {product.skuRef}
            </li>
            <li>
              <strong>Category</strong> {categoryLineFor(product)}
            </li>
            {colors.length > 0 ? (
              <li>
                <strong>Colors</strong> {colors.join(" · ")}
              </li>
            ) : null}
            <li>
              <strong>Sizes</strong> {product.sizeLabel}
            </li>
          </ul>
        </div>

        <div className="container">
          <ProductManufacturingCard product={product} index={0} />
        </div>
      </main>
      <Footer />
      <ScrollToTop />
      <FloatingWhatsApp />
    </>
  );
}
