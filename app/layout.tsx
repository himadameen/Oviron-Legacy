import type { Metadata, Viewport } from "next";
import {
  faqPageJsonLd,
  organizationJsonLd,
  professionalServiceJsonLd,
  webSiteJsonLd,
} from "@/lib/json-ld";
import PreventHorizontalScroll from "@/components/PreventHorizontalScroll";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = [
    organizationJsonLd(),
    webSiteJsonLd(),
    professionalServiceJsonLd(),
    faqPageJsonLd(),
  ];

  return (
    <html lang="en">
      <body>
        {structuredData.map((data, index) => (
          <script
            key={`${String(data["@type"])}-${index}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
          />
        ))}
        <div id="site-root">
          <PreventHorizontalScroll />
          {children}
        </div>
      </body>
    </html>
  );
}
