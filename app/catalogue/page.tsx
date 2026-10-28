import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import CatalogueDownloadOnQuery from "@/components/catalogue/CatalogueDownloadOnQuery";
import CatalogueToolbar from "@/components/catalogue/CatalogueToolbar";
import CatalogueBook from "@/components/catalogue/CatalogueBook";
import CataloguePrintExport from "@/components/catalogue/CataloguePrintExport";
import { buildCatalogueDocument } from "@/lib/catalog/build-catalogue-document";
import { buildCatalogueBookPages } from "@/lib/catalog/build-catalogue-pages";
import { loadCatalog } from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo";
import "./catalogue-print.css";

export const metadata: Metadata = pageMetadata({
  title: "Product Catalogue | Oviron — Digital Book & PDF",
  description:
    "Browse the Oviron product catalogue as a digital book or download an A4 PDF — categories, SKUs, and product specifications.",
  path: "/catalogue",
  ogTitle: "Oviron Product Catalogue",
  keywords: [
    "leather product catalogue PDF",
    "B2B wholesale catalogue",
    "footwear manufacturing specs",
    "Oviron product list",
  ],
});

export default async function CataloguePage() {
  await loadCatalog();
  const document = buildCatalogueDocument();
  const pages = buildCatalogueBookPages(document);

  if (document.productCount === 0) {
    notFound();
  }

  return (
    <>
      <Suspense fallback={null}>
        <CatalogueDownloadOnQuery />
      </Suspense>
      <CatalogueToolbar />
      <main id="main-content">
        <CatalogueBook pages={pages} />
        <CataloguePrintExport pages={pages} />
      </main>
    </>
  );
}
