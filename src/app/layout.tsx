import type { Metadata } from "next";
import { Amiri, Cormorant_Garamond, Inter, Public_Sans, Tajawal } from "next/font/google";
import JsonLd from "@/components/JsonLd";
import ScrollRestoration from "@/components/ScrollRestoration";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "Luxury Estates",
  url: SITE_URL,
  telephone: "+97470896755",
  email: "info@luxuryestates.qa",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Building No 11, Street No. 339, Zone 69, Marina 25",
    addressLocality: "Lusail",
    addressCountry: "QA",
  },
  areaServed: "Doha, Qatar",
};

// Tells Google this site has real internal search, which is what the
// "sitelinks search box" feature is keyed off. There's no schema or
// submission that makes Google choose specific sitelinks (Buy, Off-Plan,
// etc.) directly — those are decided by its own algorithm as a site
// earns enough branded search volume — but this is the one piece of
// markup Google explicitly documents as feeding into that surface.
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Luxury Estates",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/properties?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

// A secondary, weaker hint some crawlers use to identify a site's main
// sections — reinforces the same nav Header.tsx renders, kept in sync
// with it manually since this is server-only metadata.
const siteNavigationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "SiteNavigationElement", name: "Buy / Rent", url: `${SITE_URL}/properties` },
    { "@type": "SiteNavigationElement", name: "Off-Plan", url: `${SITE_URL}/off-plan` },
    { "@type": "SiteNavigationElement", name: "Agents", url: `${SITE_URL}/agents` },
    { "@type": "SiteNavigationElement", name: "About", url: `${SITE_URL}/about` },
    { "@type": "SiteNavigationElement", name: "Contact", url: `${SITE_URL}/contact` },
  ],
};

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant-garamond",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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

// Arabic-supporting pair for the Huzoom Lusail bilingual landing page only —
// Amiri (elegant serif) mirrors Cormorant's role for headings, Tajawal
// (clean grotesque) mirrors Inter's role for body copy. Unused elsewhere.
const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-tajawal",
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
      className={`h-full antialiased ${cormorantGaramond.variable} ${inter.variable} ${publicSans.variable} ${amiri.variable} ${tajawal.variable}`}
    >
      <body className="min-h-full flex flex-col bg-cream-50 text-ink-900">
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={websiteJsonLd} />
        <JsonLd data={siteNavigationJsonLd} />
        <ScrollRestoration />
        {children}
      </body>
    </html>
  );
}
