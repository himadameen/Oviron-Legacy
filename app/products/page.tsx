import type { Metadata } from "next";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProductListing from "@/components/ProductListing";
import {
  breadcrumbJsonLd,
  productCatalogWebPageJsonLd,
} from "@/lib/json-ld";
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

const structuredData = [
  breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Product catalog", path: "/products" },
  ]),
  productCatalogWebPageJsonLd(),
];

export default function ProductsPage() {
  return (
    <>
      {structuredData.map((data, index) => (
        <script
          key={`products-ld-${String(data["@type"])}-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
      <Header />
      <main id="main-content">
        <ProductListing />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
