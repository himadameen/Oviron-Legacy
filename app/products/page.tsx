import type { Metadata } from "next";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProductListing from "@/components/ProductListing";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Product Catalog | Manufacturing & Styles",
  description:
    "Complete Oviron footwear manufacturing catalog — formal, casual, sports, and occasion styles with materials, construction, sizing, and B2B quote enquiry.",
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: "Oviron Product Catalog | Manufacturing Listing",
    description: siteConfig.description,
    url: "/products",
  },
};

export default function ProductsPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <ProductListing />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
