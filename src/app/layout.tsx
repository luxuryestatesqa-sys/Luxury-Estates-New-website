import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Public_Sans } from "next/font/google";
import JsonLd from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "Luxury Estates",
  url: SITE_URL,
  telephone: "+97471157307",
  email: "info@luxuryestates.qa",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Building No 11, Street No. 339, Zone 69, Marina 25",
    addressLocality: "Lusail",
    addressCountry: "QA",
  },
  areaServed: "Doha, Qatar",
};

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant-garamond",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

// A neutral, corporate-grade grotesque sans (the USWDS/gov.uk family of
// typefaces) — used for the property title + price.
const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-public-sans",
  display: "swap",
});

const description =
  "Luxury Estates connects discerning buyers, tenants and investors with Qatar's finest apartments, villas and commercial properties.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.luxuryestates.qa"),
  title: {
    default: "Luxury Estates | Fine Properties in Qatar",
    template: "%s | Luxury Estates",
  },
  description,
  openGraph: {
    title: "Luxury Estates | Fine Properties in Qatar",
    description,
    siteName: "Luxury Estates",
    locale: "en_QA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luxury Estates | Fine Properties in Qatar",
    description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${cormorantGaramond.variable} ${inter.variable} ${publicSans.variable}`}
    >
      <body className="min-h-full flex flex-col bg-cream-50 text-ink-900">
        <JsonLd data={organizationJsonLd} />
        {children}
      </body>
    </html>
  );
}
