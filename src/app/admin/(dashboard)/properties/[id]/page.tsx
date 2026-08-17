import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import PropertyForm from "@/components/admin/PropertyForm";
import ExternalListingDeleteButton from "@/components/admin/ExternalListingDeleteButton";
import { formatDate, formatLocation, formatPrice } from "@/lib/format";
import { BackLink, Badge, Card, PageHeader } from "@/components/admin/ui";

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: property }, { data: agents }] = await Promise.all([
    supabase.from("properties").select("*").eq("id", id).maybeSingle(),
    supabase.from("agents").select("id,name").order("name"),
  ]);

  if (!property) notFound();

  if (property.source === "property_finder") {
    return (
      <div>
        <BackLink href="/admin/properties" label="Back to properties" />
        <PageHeader
          title={property.title}
          description="Synced from Property Finder — edit the source listing there, not here."
        />

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          <Card className="overflow-hidden">
            <div className="relative aspect-[16/9] w-full bg-gray-100">
              {property.images?.[0] && (
                <Image src={property.images[0]} alt="" fill className="object-cover" />
              )}
            </div>
            <div className="space-y-4 p-6">
              <div className="flex items-center gap-2">
                <Badge tone="gray">Property Finder</Badge>
                <Badge tone={property.status === "buy" ? "blue" : "green"}>
                  {property.status === "buy" ? "For Sale" : "For Rent"}
                </Badge>
              </div>
              <p className="font-serif text-2xl font-semibold text-ink-900">
                {formatPrice(Number(property.price), property.price_unit)}
              </p>
              <p className="text-sm text-gray-500">{formatLocation(property.area, property.city)}</p>
              <p className="whitespace-pre-line text-sm leading-relaxed text-gray-600">{property.description}</p>
            </div>
          </Card>

          <div className="space-y-6 lg:sticky lg:top-8 lg:self-start">
            <Card className="p-5">
              <dl className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-gray-500">Reference</dt>
                  <dd className="text-ink-900">{property.reference}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-gray-500">Last synced</dt>
                  <dd className="text-ink-900">
                    {property.synced_at ? formatDate(property.synced_at) : "—"}
                  </dd>
                </div>
              </dl>
              {property.external_url && (
                <Link
                  href={property.external_url}
                  target="_blank"
                  className="mt-4 flex items-center gap-1.5 text-sm text-gold-600 hover:underline"
                >
                  View on Property Finder
                  <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.8} />
                </Link>
              )}
            </Card>

            <Card className="p-5">
              <ExternalListingDeleteButton id={property.id} title={property.title} />
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <BackLink href="/admin/properties" label="Back to properties" />
      <PageHeader title="Edit Property" description={property.title} />
      <div className="mt-6">
        <PropertyForm
          initial={{
            id: property.id,
            slug: property.slug,
            title: property.title,
            status: property.status,
            type: property.type,
            featured: property.featured,
            area: property.area,
            city: property.city,
            price: Number(property.price),
            price_unit: property.price_unit,
            beds: property.beds,
            baths: property.baths,
            size: Number(property.size),
            year_built: property.year_built,
            lat: property.lat != null ? Number(property.lat) : null,
            lng: property.lng != null ? Number(property.lng) : null,
            description: property.description,
            amenities: property.amenities ?? [],
            images: property.images ?? [],
            agent_id: property.agent_id,
            reference: property.reference,
          }}
          agents={agents ?? []}
        />
      </div>
    </div>
  );
}
