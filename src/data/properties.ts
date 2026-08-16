import "server-only";
import { unstable_cache } from "next/cache";
import { supabasePublic } from "@/lib/supabase/public";
import { sanitizeWhatsapp } from "@/lib/format";
import type { AgentSummary, ListingStatus, Property, PropertyType } from "./types";

// Supabase's client doesn't pass Next's fetch-cache options, so its requests
// are invisible to Next's Data Cache by default — wrapping with
// unstable_cache is what actually lets these pages be served from cache
// (and thus be fast) instead of hitting the database on every request.
const CACHE_TAGS = { properties: "properties" };

const AGENT_SELECT = "id,slug,name,title,photo,phone,whatsapp,email";
const PROPERTY_SELECT = `*, agent:agents(${AGENT_SELECT})`;

// Everything the listings/explorer page's cards, filters and map actually
// render — cuts every column that page doesn't use (description, amenities,
// year_built, the pf_agent_* fields, source, external_url) and ships only
// the cover photo (plus a real imagesCount) instead of the full images
// array. Needed to get the cached payload under Next's 2MB Data Cache
// limit — at 6 images/property it landed at ~3MB and silently never cached,
// so every request re-hit Supabase for the full paginated table.
const LISTING_SELECT = `id,slug,title,status,type,featured,area,city,price,price_unit,beds,baths,size,lat,lng,images,agent_id,reference,agent:agents(${AGENT_SELECT})`;
const LISTING_IMAGE_CAP = 1;

interface PropertyRow {
  id: string;
  slug: string;
  title: string;
  status: ListingStatus;
  type: PropertyType;
  featured: boolean;
  area: string;
  city: string;
  price: number | string;
  price_unit: "total" | "month";
  beds: number;
  baths: number;
  size: number | string;
  year_built: number;
  lat: number | string | null;
  lng: number | string | null;
  description: string;
  amenities: string[] | null;
  images: string[] | null;
  agent_id: string | null;
  reference: string;
  agent: AgentSummary | null;
  pf_agent_name: string | null;
  pf_agent_photo: string | null;
  pf_agent_phone: string | null;
  pf_agent_whatsapp: string | null;
  pf_agent_email: string | null;
  pf_agent_title: string | null;
  source: "manual" | "property_finder";
  external_url: string | null;
}

function mapProperty(row: PropertyRow): Property {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    status: row.status,
    type: row.type,
    featured: row.featured,
    area: row.area,
    city: row.city,
    price: Number(row.price),
    priceUnit: row.price_unit,
    beds: row.beds,
    baths: row.baths,
    size: Number(row.size),
    yearBuilt: row.year_built,
    lat: row.lat != null ? Number(row.lat) : 0,
    lng: row.lng != null ? Number(row.lng) : 0,
    description: row.description,
    amenities: row.amenities ?? [],
    images: row.images ?? [],
    agentId: row.agent_id ?? "",
    reference: row.reference,
    agent: row.agent ? { ...row.agent, whatsapp: sanitizeWhatsapp(row.agent.whatsapp) } : null,
    pfAgentName: row.pf_agent_name,
    pfAgentPhoto: row.pf_agent_photo,
    pfAgentPhone: row.pf_agent_phone,
    pfAgentWhatsapp: row.pf_agent_whatsapp ? sanitizeWhatsapp(row.pf_agent_whatsapp) : row.pf_agent_whatsapp,
    pfAgentEmail: row.pf_agent_email,
    pfAgentTitle: row.pf_agent_title,
    source: row.source,
    externalUrl: row.external_url,
  };
}

// PostgREST caps a single request at (by default) 1000 rows, which the
// off-plan/manual property count alone never approached — but a synced
// Property Finder inventory easily can. Page through with .range() so
// the public listings page always reflects the full table.
const PAGE_SIZE = 1000;

// Not wrapped in unstable_cache: the full table is already ~6MB serialized
// (1300+ rows with descriptions and full image arrays) and Next's Data
// Cache silently refuses to store entries over 2MB — wrapping it just
// produces a build-time warning with zero actual caching benefit. Callers
// that only need a summary (area names, counts) should prefer the other,
// genuinely-cacheable helpers below instead of calling this repeatedly.
export async function fetchProperties(): Promise<Property[]> {
  const rows: PropertyRow[] = [];
  let from = 0;
  for (;;) {
    const { data, error } = await supabasePublic
      .from("properties")
      .select(PROPERTY_SELECT)
      .order("created_at", { ascending: false })
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw error;
    const page = (data ?? []) as PropertyRow[];
    rows.push(...page);
    if (page.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }
  return rows.map(mapProperty);
}
export const getProperties = fetchProperties;

// The listings/explorer page (Buy/Rent) needs every row for its
// client-side filtering + map, but not every column — using LISTING_SELECT
// and capping images keeps the serialized payload small enough to actually
// fit Next's Data Cache, turning every /properties request that used to hit
// Supabase fresh (via fetchProperties above) into a cache hit instead.
type ListingRow = Omit<
  PropertyRow,
  | "description"
  | "amenities"
  | "year_built"
  | "pf_agent_name"
  | "pf_agent_photo"
  | "pf_agent_phone"
  | "pf_agent_whatsapp"
  | "pf_agent_email"
  | "pf_agent_title"
  | "source"
  | "external_url"
>;

async function fetchPropertiesForListing(): Promise<Property[]> {
  const rows: ListingRow[] = [];
  let from = 0;
  for (;;) {
    const { data, error } = await supabasePublic
      .from("properties")
      .select(LISTING_SELECT)
      .order("created_at", { ascending: false })
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw error;
    const page = (data ?? []) as unknown as ListingRow[];
    rows.push(...page);
    if (page.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }
  return rows.map((row) => {
    const images = row.images ?? [];
    return {
      ...mapProperty({
        ...row,
        description: "",
        amenities: [],
        year_built: 0,
        pf_agent_name: null,
        pf_agent_photo: null,
        pf_agent_phone: null,
        pf_agent_whatsapp: null,
        pf_agent_email: null,
        pf_agent_title: null,
        source: "manual",
        external_url: null,
        images: images.slice(0, LISTING_IMAGE_CAP),
      }),
      imagesCount: images.length,
    };
  });
}
export const getPropertiesForListing = unstable_cache(
  fetchPropertiesForListing,
  ["properties:listing"],
  { revalidate: 60, tags: [CACHE_TAGS.properties] },
);

async function fetchPropertiesCount(): Promise<number> {
  const { count, error } = await supabasePublic
    .from("properties")
    .select("id", { count: "exact", head: true });
  if (error) throw error;
  return count ?? 0;
}
export const getPropertiesCount = unstable_cache(fetchPropertiesCount, ["properties:count"], {
  revalidate: 60,
  tags: [CACHE_TAGS.properties],
});

// Targeted, limited query for filling out a short list (e.g. "featured" rails
// that don't have enough featured rows yet) — avoids pulling the full ~6MB
// properties table just to grab a handful of extra rows.
async function fetchFillerProperties(excludeIds: string[], limit: number): Promise<Property[]> {
  let query = supabasePublic
    .from("properties")
    .select(PROPERTY_SELECT)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (excludeIds.length > 0) {
    query = query.not("id", "in", `(${excludeIds.join(",")})`);
  }
  const { data, error } = await query;
  if (error) throw error;
  return (data as PropertyRow[] | null ?? []).map(mapProperty);
}
export const getFillerProperties = unstable_cache(fetchFillerProperties, ["properties:filler"], {
  revalidate: 60,
  tags: [CACHE_TAGS.properties],
});

async function fetchPropertyBySlug(slug: string): Promise<Property | undefined> {
  const { data, error } = await supabasePublic
    .from("properties")
    .select(PROPERTY_SELECT)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? mapProperty(data) : undefined;
}
export const getPropertyBySlug = unstable_cache(fetchPropertyBySlug, ["properties:bySlug"], {
  revalidate: 60,
  tags: [CACHE_TAGS.properties],
});

// Used for the "related properties" rail on the detail page. Deliberately a
// targeted, limited query rather than fetching the full ~1300-row table and
// filtering in JS — that pattern was measured at 3-8s per request.
async function fetchRelatedProperties(
  area: string,
  excludeId: string,
  limit: number,
): Promise<Property[]> {
  const { data: sameArea, error: areaError } = await supabasePublic
    .from("properties")
    .select(PROPERTY_SELECT)
    .eq("area", area)
    .neq("id", excludeId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (areaError) throw areaError;
  if (sameArea && sameArea.length > 0) {
    return (sameArea as PropertyRow[]).map(mapProperty);
  }

  const { data: anyOther, error: anyError } = await supabasePublic
    .from("properties")
    .select(PROPERTY_SELECT)
    .neq("id", excludeId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (anyError) throw anyError;
  return (anyOther ?? []).map(mapProperty);
}
export const getRelatedProperties = unstable_cache(fetchRelatedProperties, ["properties:related"], {
  revalidate: 60,
  tags: [CACHE_TAGS.properties],
});

async function fetchFeaturedProperties(): Promise<Property[]> {
  const rows: PropertyRow[] = [];
  let from = 0;
  for (;;) {
    const { data, error } = await supabasePublic
      .from("properties")
      .select(PROPERTY_SELECT)
      .eq("featured", true)
      .order("created_at", { ascending: false })
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw error;
    const page = (data ?? []) as PropertyRow[];
    rows.push(...page);
    if (page.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }
  return rows.map(mapProperty);
}
export const getFeaturedProperties = unstable_cache(fetchFeaturedProperties, ["properties:featured"], {
  revalidate: 60,
  tags: [CACHE_TAGS.properties],
});

async function fetchPropertiesByAgentId(agentId: string): Promise<Property[]> {
  const rows: PropertyRow[] = [];
  let from = 0;
  for (;;) {
    const { data, error } = await supabasePublic
      .from("properties")
      .select(PROPERTY_SELECT)
      .eq("agent_id", agentId)
      .order("created_at", { ascending: false })
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw error;
    const page = (data ?? []) as PropertyRow[];
    rows.push(...page);
    if (page.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }
  return rows.map(mapProperty);
}
export const getPropertiesByAgentId = unstable_cache(fetchPropertiesByAgentId, ["properties:byAgentId"], {
  revalidate: 60,
  tags: [CACHE_TAGS.properties],
});

async function fetchAreaNames(): Promise<string[]> {
  const all = await fetchProperties();
  return Array.from(new Set(all.map((p) => p.area))).sort();
}
export const getAreaNames = unstable_cache(fetchAreaNames, ["properties:areaNames"], {
  revalidate: 60,
  tags: [CACHE_TAGS.properties],
});

export interface AreaPick {
  /** Display name shown on the tile — may differ from the stored `area` (e.g. "Pearl Qatar" vs. "The Pearl Island"). */
  label: string;
  /** Exact `area` value to filter by. Omit to feature an entire city instead of one area within it. */
  area?: string;
  city: string;
  /** Hand-picked photo URL, verified to actually depict this location. When omitted, falls back to the top listing's first photo — not guaranteed to be a representative exterior shot. */
  image?: string;
}

export interface FeaturedArea {
  label: string;
  href: string;
  city: string;
  count: number;
  image: string;
}

async function fetchFeaturedAreas(picks: AreaPick[]): Promise<FeaturedArea[]> {
  const results = await Promise.all(
    picks.map(async (pick) => {
      const href = pick.area
        ? `/properties?area=${encodeURIComponent(pick.area)}`
        : `/properties?city=${encodeURIComponent(pick.city)}`;

      if (pick.image) {
        let countQuery = supabasePublic
          .from("properties")
          .select("id", { count: "exact", head: true })
          .eq("city", pick.city);
        if (pick.area) countQuery = countQuery.eq("area", pick.area);
        const { count } = await countQuery;
        return { label: pick.label, href, city: pick.city, count: count ?? 0, image: pick.image };
      }

      let query = supabasePublic.from("properties").select("images", { count: "exact" }).eq("city", pick.city);
      if (pick.area) query = query.eq("area", pick.area);
      const { data, count } = await query
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(1);
      const images = (data as { images: string[] | null }[] | null)?.[0]?.images ?? [];
      return { label: pick.label, href, city: pick.city, count: count ?? 0, image: images[0] ?? "" };
    }),
  );
  return results.filter((a) => a.image && a.count > 0);
}
export const getFeaturedAreas = unstable_cache(fetchFeaturedAreas, ["properties:featuredAreas"], {
  revalidate: 60,
  tags: [CACHE_TAGS.properties],
});
