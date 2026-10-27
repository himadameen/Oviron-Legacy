import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProductListing from "@/components/ProductListing";
import ScrollToTop from "@/components/ScrollToTop";
import SiteChrome from "@/components/SiteChrome";
import {
  breadcrumbJsonLd,
  productCatalogWebPageJsonLd,
} from "@/lib/json-ld";
import { loadCatalog } from "@/lib/catalog";
import { redirectPathForLegacyProductQuery } from "@/lib/product-routes";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Product Catalog | Manufacturing & Styles",
  description:
    "Complete Oviron footwear manufacturing catalog — formal, casual, sports, and occasion styles with materials, construction, sizing, and B2B quote enquiry.",
  path: "/products",
  ogTitle: "Oviron Product Catalog | Manufacturing Listing",
  keywords: [
    "footwear product catalog",
    "wholesale shoe styles",
    "B2B footwear listing",
    "leather shoe manufacturing specs",
    "formal oxford wholesale",
    "private label footwear catalog",
  ],
});

type PageProps = {
  searchParams: Promise<{ product?: string; category?: string }>;
};

const structuredData = [
  breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Product catalog", path: "/products" },
  ]),
  productCatalogWebPageJsonLd(),
];

export default async function ProductsPage({ searchParams }: PageProps) {
  await loadCatalog();
  const sp = await searchParams;
  const canonical = redirectPathForLegacyProductQuery(
    sp.product ?? null,
    sp.category ?? null
  );
  if (canonical) {
    redirect(canonical);
  }

  return (
    <>
      {structuredData.map((data, index) => (
        <script
          key={`products-ld-${String(data["@type"])}-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
      <SiteChrome>
        <Header />
      </SiteChrome>
      <main id="main-content">
        <Suspense fallback={null}>
          <ProductListing />
        </Suspense>
      </main>
      <Footer />
      <ScrollToTop />
      <FloatingWhatsApp />
    </>
  );
}
