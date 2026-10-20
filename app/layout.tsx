import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import {
  faqPageJsonLd,
  organizationJsonLd,
  professionalServiceJsonLd,
  webSiteJsonLd,
} from "@/lib/json-ld";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

const siteUrl = siteConfig.domain || "https://example.com";

export const viewport: Viewport = {
  themeColor: "#172A3A",
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Oviron | Leather Footwear Sourcing & Export",
    template: "%s | Oviron",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "leather footwear sourcing",
    "wholesale footwear supply",
    "private label shoes",
    "footwear export enquiry",
    "B2B shoe supplier",
    "leather shoes wholesale",
    "footwear manufacturing coordination",
    "international footwear buyers",
  ],
  authors: [{ name: siteConfig.legalName }],
  creator: siteConfig.legalName,
  publisher: siteConfig.legalName,
  category: "Business",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: "/",
    siteName: siteConfig.name,
    title: "Oviron | Leather Footwear Sourcing & Export",
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Oviron | Leather Footwear Sourcing & Export",
    description: siteConfig.description,
  },
  formatDetection: {
    telephone: false,
  },
};

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
    <html lang="en" className={`${cormorant.variable} ${manrope.variable}`}>
      <body>
        {structuredData.map((data, index) => (
          <script
            key={`${String(data["@type"])}-${index}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
          />
        ))}
        {children}
      </body>
    </html>
  );
}
