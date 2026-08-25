import type { Metadata } from "next";
import { getAreaNames, getPropertiesForListing } from "@/data/properties";
import PropertiesExplorer from "@/components/PropertiesExplorer";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Buy & Rent Properties",
  description: "Browse apartments, villas and commercial properties for sale and rent across Qatar, with an interactive map view.",
  alternates: { canonical: `${SITE_URL}/properties` },
};

// Safety net only — admin saves push fresh data instantly via /api/revalidate.
export const revalidate = 3600;

export default async function PropertiesPage() {
  const [properties, areaNames] = await Promise.all([getPropertiesForListing(), getAreaNames()]);

  return <PropertiesExplorer properties={properties} areaNames={areaNames} />;
}
