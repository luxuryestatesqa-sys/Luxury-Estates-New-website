"use client";

import Image from "next/image";
import Link from "next/link";
import { Building2 } from "lucide-react";
import { formatLocation, formatPrice } from "@/lib/format";
import SearchBox from "./SearchBox";
import { useAdminSearch } from "./useAdminSearch";
import { Badge, Card, EmptyState } from "./ui";

interface PropertyRow {
  id: string;
  title: string;
  status: "buy" | "rent";
  area: string;
  city: string;
  price: number;
  price_unit: "total" | "month";
  featured: boolean;
  images: string[] | null;
  source: "manual" | "property_finder";
}

export default function PropertiesList({ rows }: { rows: PropertyRow[] }) {
  const { query, setQuery, filtered } = useAdminSearch(rows, (p, q) =>
    [p.title, p.area, p.city].some((v) => v.toLowerCase().includes(q)),
  );

  return (
    <div>
      <SearchBox value={query} onChange={setQuery} placeholder="Search properties…" />

      <Card className="mt-4">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Building2 className="h-10 w-10" strokeWidth={1.3} />}
            title="No properties found"
            description="Try a different search, or add your first property."
          />
        ) : (
          <ul className="divide-y divide-gray-100">
            {filtered.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/admin/properties/${p.id}`}
                  className="flex items-center gap-4 px-5 py-3.5 transition hover:bg-cream-50"
                >
                  <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    {p.images?.[0] && (
                      <Image src={p.images[0]} alt="" fill sizes="64px" className="object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold text-ink-900">{p.title}</p>
                      {p.featured && <Badge tone="gold">Featured</Badge>}
                      {p.source === "property_finder" && <Badge tone="gray">Property Finder</Badge>}
                    </div>
                    <p className="mt-0.5 truncate text-xs text-gray-500">
                      {formatLocation(p.area, p.city)}
                    </p>
                  </div>
                  <Badge tone={p.status === "buy" ? "blue" : "green"}>
                    {p.status === "buy" ? "For Sale" : "For Rent"}
                  </Badge>
                  <p className="w-32 shrink-0 text-right text-sm font-medium text-ink-900">
                    {formatPrice(p.price, p.price_unit)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
