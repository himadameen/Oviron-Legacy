import type { Metadata, Viewport } from "next";
import {
  faqPageJsonLd,
  organizationJsonLd,
  professionalServiceJsonLd,
  webSiteJsonLd,
} from "@/lib/json-ld";
import PreventHorizontalScroll from "@/components/PreventHorizontalScroll";
import MarketingAnalytics from "@/components/MarketingAnalytics";
import StoreProvider from "@/components/StoreProvider";
import { CatalogProvider } from "@/lib/catalog-context";
import { loadCatalog } from "@/lib/catalog";
import { rootLayoutMetadata } from "@/lib/seo";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#172A3A",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light",
};

export const metadata: Metadata = rootLayoutMetadata();

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const catalog = await loadCatalog();
  const structuredData = [
    organizationJsonLd(),
    webSiteJsonLd(),
    professionalServiceJsonLd(),
    faqPageJsonLd(),
  ];

  return (
    <html lang="en">
      <body>
        <MarketingAnalytics />
        {structuredData.map((data, index) => (
          <script
            key={`${String(data["@type"])}-${index}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
          />
        ))}
        <div id="site-root">
          <StoreProvider>
            <CatalogProvider value={catalog}>
              <PreventHorizontalScroll />
              {children}
            </CatalogProvider>
          </StoreProvider>
        </div>
      </body>
    </html>
  );
}
