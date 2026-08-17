import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPropertyBySlug, getRelatedProperties } from "@/data/properties";
import { formatLocation, formatNumber, formatPrice } from "@/lib/format";
import PropertyGallery from "@/components/PropertyGallery";
import InquiryForm from "@/components/InquiryForm";
import PropertyCard from "@/components/PropertyCard";
import TrustBadges from "@/components/TrustBadges";
import PropertyAgentCard from "@/components/PropertyAgentCard";
import ProjectLocationMap from "@/components/ProjectLocationMap";
import JsonLd, { breadcrumbJsonLd } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";
import type { Property } from "@/data/types";

function propertyJsonLd(property: Property) {
  const url = `${SITE_URL}/properties/${property.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description,
    url,
    image: property.images,
    numberOfRooms: property.beds || undefined,
    floorSize:
      property.size > 0
        ? { "@type": "QuantitativeValue", value: property.size, unitCode: "MTK" }
        : undefined,
    address: {
      "@type": "PostalAddress",
      addressLocality: property.area,
      addressRegion: property.city,
      addressCountry: "QA",
    },
    offers:
      property.price > 0
        ? {
            "@type": "Offer",
            price: property.price,
            priceCurrency: "QAR",
            availability: "https://schema.org/InStock",
            url,
          }
        : undefined,
  };
}

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return {};
  return {
    title: property.title,
    description: property.description,
    alternates: { canonical: `${SITE_URL}/properties/${property.slug}` },
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  const agent = property.agent;
  const relatedFallback = await getRelatedProperties(property.area, property.id, 3);

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <JsonLd data={propertyJsonLd(property)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Properties", url: `${SITE_URL}/properties` },
          { name: property.title, url: `${SITE_URL}/properties/${property.slug}` },
        ])}
      />

      <nav className="mb-6 text-xs text-gray-400">
        <Link href="/properties" className="hover:text-gold-600">
          Properties
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink-600">{property.title}</span>
      </nav>

      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600">
            {formatLocation(property.area, property.city)}
          </p>
          <h1 className="mt-2 font-public-sans text-h1 font-normal text-ink-900">
            {property.title}
          </h1>
        </div>
        <div className="text-left sm:text-right">
          <p className="font-public-sans text-2xl font-normal text-ink-900">
            {formatPrice(property.price, property.priceUnit)}
          </p>
          <p className="text-xs text-gray-400">Ref {property.reference}</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <PropertyGallery images={property.images} title={property.title} />

          <div className="mt-8 grid grid-cols-2 gap-4 border-y border-gray-100 py-6 sm:grid-cols-4">
            <Stat label="Status" value={property.status === "buy" ? "For Sale" : "For Rent"} />
            <Stat label="Type" value={property.type} />
            {property.beds > 0 && <Stat label="Bedrooms" value={String(property.beds)} />}
            {property.baths > 0 && <Stat label="Bathrooms" value={String(property.baths)} />}
            <Stat label="Size" value={`${formatNumber(property.size)} sqm`} />
            {property.yearBuilt > 0 && (
              <Stat label="Year Built" value={String(property.yearBuilt)} />
            )}
          </div>

          <div className="mt-8">
            <h2 className="font-serif text-xl font-semibold text-ink-900">About this property</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">{property.description}</p>
          </div>

          <div className="mt-8">
            <h2 className="font-serif text-xl font-semibold text-ink-900">Amenities</h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
              {property.amenities.map((a) => (
                <li key={a} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="space-y-6">
          <ProjectLocationMap
            name={property.title}
            area={property.area}
            city={property.city}
            lat={property.lat}
            lng={property.lng}
          />

          {agent ? (
            <PropertyAgentCard
              photo={agent.photo}
              name={agent.name}
              title={agent.title}
              phone={agent.phone}
              whatsapp={agent.whatsapp}
              email={agent.email}
            />
          ) : (
            property.pfAgentName && (
              <PropertyAgentCard
                photo={property.pfAgentPhoto ?? ""}
                name={property.pfAgentName}
                title={property.pfAgentTitle || "Real Estate Consultant"}
                phone={property.pfAgentPhone ?? "+97471157307"}
                whatsapp={property.pfAgentWhatsapp ?? "97471157307"}
                email={property.pfAgentEmail ?? "info@luxuryestates.qa"}
              />
            )
          )}

          <InquiryForm
            heading="Enquire about this property"
            presetMessage={`I'm interested in ${property.title} (Ref ${property.reference}). Please share more details.`}
            source="property"
            sourceReference={property.slug}
            whatsappNumber={agent?.whatsapp || property.pfAgentWhatsapp || undefined}
          />

          <TrustBadges
            items={[
              { icon: "shield", label: "Licensed Real Estate Brokerage" },
              { icon: "check", label: "Listing Verified by Luxury Estates" },
              { icon: "lock", label: "Secure, Confidential Transactions" },
            ]}
          />
        </aside>
      </div>

      {relatedFallback.length > 0 && (
        <div className="mt-20">
          <h2 className="font-serif text-2xl font-semibold text-ink-900">
            You may also like
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {relatedFallback.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-1 font-serif text-base font-semibold text-ink-900">{value}</p>
    </div>
  );
}
