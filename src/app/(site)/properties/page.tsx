import type { Metadata } from "next";
import Link from "next/link";
import { getAreaNames, getPropertiesForListing } from "@/data/properties";
import PropertiesExplorer from "@/components/PropertiesExplorer";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Properties",
  description: "Browse apartments, villas and commercial properties for sale and rent across Qatar, with an interactive map view.",
  alternates: { canonical: `${SITE_URL}/properties` },
};

export const revalidate = 60;

interface SearchParams {
  status?: string;
  type?: string;
  area?: string;
  city?: string;
  beds?: string;
  maxPrice?: string;
  q?: string;
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { type, area, city, beds, maxPrice, q } = params;
  const status = params.status === "rent" ? "rent" : "buy";
  const [properties, areaNames] = await Promise.all([getPropertiesForListing(), getAreaNames()]);

  const locationLabel = area || city;
  const statusLabel = status === "buy" ? "Buy" : "Rent";
  const heading =
    status === "buy"
      ? `Properties for Sale${locationLabel ? ` in ${locationLabel}` : ""}`
      : `Properties for Rent${locationLabel ? ` in ${locationLabel}` : ""}`;

  const breadcrumb = (
    <nav key="breadcrumb" className="text-sm text-[#6b7280]">
      <Link href="/" className="hover:text-gold-600">
        Home
      </Link>
      <span className="mx-2">/</span>
      <Link href={`/properties?status=${status}`} className="hover:text-gold-600">
        {statusLabel}
      </Link>
      <span className="mx-2">/</span>
      <span className="text-ink-600">{heading}</span>
    </nav>
  );

  return (
    <PropertiesExplorer
      properties={properties}
      areaNames={areaNames}
      breadcrumb={breadcrumb}
      heading={heading}
      initialFilters={{
        status,
        type: type ?? "",
        area: area ?? "",
        city: city ?? "",
        beds: beds ?? "",
        maxPrice: maxPrice ?? "",
        q: q ?? "",
      }}
    />
  );
}
