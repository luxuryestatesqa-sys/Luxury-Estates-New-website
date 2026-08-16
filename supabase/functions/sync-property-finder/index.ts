// Pulls listings in from the Property Finder Enterprise API and mirrors
// them into the `properties` table (source = 'property_finder'), leaving
// manually entered properties untouched. Runs on a pg_cron schedule every
// 12 hours, and can be triggered on demand from the admin panel.
//
// Built against Property Finder's published OpenAPI spec (Enterprise
// API Gateway, server https://atlas.propertyfinder.com):
//  - Auth: POST /v1/auth/token with { apiKey, apiSecret } -> a Bearer
//    accessToken valid for ~30 minutes. No refresh token; a fresh token
//    is requested on every sync run.
//  - Listings: GET /v1/listings (scope `listings:read`), paginated,
//    returns published/live listings by default.
//  - Locations: listing rows only carry a numeric `location.id`, not a
//    name, so area/city come from our own pf_locations cache table
//    (pre-populated out-of-band — see the comment above
//    resolveLocationName for why calling /v1/locations directly from
//    here doesn't work). Anything not yet cached falls back to a plain
//    "Location #<id>" label and is retried via a best-effort live call.
//
// Real accounts can carry thousands of listings, so pagination, location
// lookups and the final database write are all batched/parallelized
// (with a concurrency cap) rather than done one row at a time — a
// sequential per-listing approach here risks hitting the function's
// execution time limit.

import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const PF_DEFAULT_BASE_URL = "https://atlas.propertyfinder.com";
const CONCURRENCY = 8;
const UPSERT_CHUNK_SIZE = 500;

// A handful of fine-grained sub-locations (building/phase level, e.g.
// "Naples", "Milan" within Lusail's themed districts) come back from PF's
// /v1/locations with coordinates explicitly set to {lat: 0, lng: 0}
// instead of a real centroid or an omitted field. Falling back to the
// city centroid keeps the map marker somewhere sane instead of the
// Gulf of Guinea. Values are the average of this account's own
// already-resolved, real sub-location coordinates per city.
const CITY_FALLBACK_COORDS: Record<string, { lat: number; lng: number }> = {
  Doha: { lat: 25.3655, lng: 51.5458 },
  Lusail: { lat: 25.4213, lng: 51.5038 },
  "Al Wakra": { lat: 25.1588, lng: 51.5719 },
  "Umm Salal Mohammed": { lat: 25.3991, lng: 51.4526 },
  "Al Khor": { lat: 25.6634, lng: 51.5070 },
};

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const PF_TYPE_MAP: Record<string, string> = {
  apartment: "Apartment",
  "hotel-apartment": "Apartment",
  duplex: "Apartment",
  roof: "Apartment",
  villa: "Villa",
  bungalow: "Villa",
  "twin-house": "Villa",
  chalet: "Villa",
  cabin: "Villa",
  palace: "Villa",
  "rest-house": "Villa",
  ivilla: "Villa",
  penthouse: "Penthouse",
  townhouse: "Townhouse",
  land: "Land",
  farm: "Land",
  "office-space": "Office",
  "business-center": "Office",
  "co-working-space": "Office",
  clinic: "Office",
  "medical-facility": "Office",
  retail: "Office",
  shop: "Office",
  "show-room": "Office",
  warehouse: "Office",
  factory: "Office",
  "staff-accommodation": "Office",
  "labor-camp": "Office",
  restaurant: "Office",
  cafeteria: "Office",
  "whole-building": "Office",
  "full-floor": "Office",
  "half-floor": "Office",
  compound: "Office",
  "bulk-sale-unit": "Office",
  "bulk-rent-unit": "Office",
};

interface Settings {
  api_key: string;
  api_secret: string;
  api_base_url: string | null;
  enabled: boolean;
}

interface MappedListing {
  external_id: string;
  title: string;
  slug: string;
  status: "buy" | "rent";
  type: string;
  area: string;
  city: string;
  price: number;
  price_unit: "total" | "month";
  beds: number;
  baths: number;
  size: number;
  year_built: number;
  lat: number | null;
  lng: number | null;
  description: string;
  amenities: string[];
  images: string[];
  agent_id: string | null;
  pf_agent_name: string | null;
  pf_agent_photo: string | null;
  pf_agent_phone: string | null;
  pf_agent_whatsapp: string | null;
  pf_agent_email: string | null;
  pf_agent_title: string | null;
  reference: string;
  external_url: string | null;
}

interface AgentContact {
  name: string;
  photo: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  title: string | null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  const { data: settings, error: settingsError } = await supabase
    .from("property_finder_settings")
    .select("api_key,api_secret,api_base_url,enabled")
    .eq("id", "default")
    .maybeSingle();

  if (settingsError || !settings) {
    return json({ status: "error", message: "Could not load property_finder_settings." }, 500);
  }

  if (!settings.enabled) {
    await updateStatus(supabase, "skipped", "Integration is turned off.", null);
    return json({ status: "skipped", message: "Integration is turned off." });
  }

  if (!settings.api_key || !settings.api_secret) {
    await updateStatus(supabase, "error", "Missing API key or API secret.", null);
    return json({ status: "error", message: "Missing API key or API secret." }, 400);
  }

  const baseUrl = (settings.api_base_url || PF_DEFAULT_BASE_URL).replace(/\/$/, "");

  try {
    const token = await getAccessToken(baseUrl, settings.api_key, settings.api_secret);
    const rawListings = await fetchAllListings(baseUrl, token);
    const agentDirectory = await fetchAgentDirectory(baseUrl, token);

    // Internal agent rows imported from Property Finder carry the same
    // publicProfile.id (pf_user_id) that listings' assignedTo.id refers
    // to — use it to link each synced property to the matching agent row
    // so /agents/[slug] can show their real listings.
    const { data: linkedAgents } = await supabase
      .from("agents")
      .select("id,pf_user_id")
      .not("pf_user_id", "is", null);
    const agentIdByPfUserId = new Map<number, string>();
    for (const a of linkedAgents ?? []) {
      if (a.pf_user_id != null) agentIdByPfUserId.set(a.pf_user_id, a.id);
    }

    // Resolve every unique location once. Prefer our own pf_locations
    // cache (see comment on resolveLocationName for why) and only fall
    // back to a live API call — best-effort, may fail — for ids we
    // haven't seen before; anything that does resolve live is written
    // back to the cache so future runs don't need to retry it.
    const uniqueLocationIds = Array.from(
      new Set(
        rawListings
          .map((r) => (r.location as { id?: number } | undefined)?.id)
          .filter((id): id is number => typeof id === "number"),
      ),
    );

    const locationCache = new Map<number, { area: string; city: string; lat: number | null; lng: number | null }>();
    if (uniqueLocationIds.length > 0) {
      const { data: cachedLocations } = await supabase
        .from("pf_locations")
        .select("id,name,city,lat,lng")
        .in("id", uniqueLocationIds);
      for (const loc of cachedLocations ?? []) {
        locationCache.set(loc.id, {
          area: loc.name,
          city: loc.city ?? "",
          lat: loc.lat ?? null,
          lng: loc.lng ?? null,
        });
      }
    }

    const uncachedIds = uniqueLocationIds.filter((id) => !locationCache.has(id));
    const newlyResolved: { id: number; name: string; city: string; lat: number | null; lng: number | null }[] = [];
    await mapWithConcurrency(uncachedIds, CONCURRENCY, async (locationId) => {
      const resolved = await resolveLocationName(baseUrl, token, locationId);
      if (resolved) {
        locationCache.set(locationId, resolved);
        newlyResolved.push({
          id: locationId,
          name: resolved.area,
          city: resolved.city,
          lat: resolved.lat,
          lng: resolved.lng,
        });
      }
    });
    if (newlyResolved.length > 0) {
      await supabase.from("pf_locations").upsert(newlyResolved, { onConflict: "id" });
    }

    const mapped = rawListings
      .map((raw) => mapListing(raw, locationCache, agentDirectory, agentIdByPfUserId))
      .filter((l): l is MappedListing => l !== null);

    if (rawListings.length > 0 && mapped.length === 0) {
      const sampleKeys = Object.keys(rawListings[0] ?? {}).join(", ") || "(empty object)";
      const message = `Fetched ${rawListings.length} listing(s) but none had a recognizable id/title/price. First listing's fields: ${sampleKeys}`;
      await updateStatus(supabase, "error", message, 0);
      return json({ status: "error", fetched: rawListings.length, mapped: 0, message });
    }

    const rows = mapped.map((listing) => ({
      ...listing,
      source: "property_finder",
      synced_at: new Date().toISOString(),
    }));
    let upsertedCount = 0;
    const upsertErrors: string[] = [];
    for (let i = 0; i < rows.length; i += UPSERT_CHUNK_SIZE) {
      const chunk = rows.slice(i, i + UPSERT_CHUNK_SIZE);
      const { error: upsertError, count } = await supabase
        .from("properties")
        .upsert(chunk, { onConflict: "source,external_id", count: "exact" });
      if (upsertError) {
        console.error(`Upsert failed for chunk starting at ${i}:`, upsertError.message);
        if (upsertErrors.length < 3) upsertErrors.push(upsertError.message);
      } else {
        upsertedCount += count ?? chunk.length;
      }
    }

    if (upsertErrors.length > 0 && upsertedCount === 0) {
      const message = `Fetched and mapped ${mapped.length} listing(s) but the database write failed: ${upsertErrors.join(" | ")}`;
      await updateStatus(supabase, "error", message, 0);
      return json({ status: "error", mapped: mapped.length, message });
    }

    const deletedCount = await pruneMissing(supabase, mapped.map((l) => l.external_id));

    const errorSuffix = upsertErrors.length > 0 ? ` (${upsertErrors.length} chunk error(s): ${upsertErrors[0]})` : "";
    const message = `Synced ${upsertedCount} of ${mapped.length} listing(s)${deletedCount ? `, removed ${deletedCount} no longer in the feed` : ""}.${errorSuffix}`;
    await updateStatus(supabase, upsertErrors.length > 0 ? "error" : "success", message, upsertedCount);
    return json({
      status: upsertErrors.length > 0 ? "error" : "success",
      synced: upsertedCount,
      deleted: deletedCount,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await updateStatus(supabase, "error", message, null);
    return json({ status: "error", message }, 500);
  }
});

async function mapWithConcurrency<T>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<void>,
): Promise<void> {
  let index = 0;
  async function worker() {
    while (index < items.length) {
      const current = items[index++];
      await fn(current);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
}

async function getAccessToken(baseUrl: string, apiKey: string, apiSecret: string): Promise<string> {
  const res = await fetch(`${baseUrl}/v1/auth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-PF-Error-Format": "problem-json-v2",
    },
    body: JSON.stringify({ apiKey, apiSecret }),
  });

  if (!res.ok) {
    throw new Error(await describeError(res, "Failed to authenticate with Property Finder"));
  }

  const body = await res.json();
  if (!body?.accessToken) {
    throw new Error("Property Finder auth response did not include an accessToken.");
  }
  return body.accessToken as string;
}

async function fetchAllListings(baseUrl: string, token: string): Promise<Record<string, unknown>[]> {
  const perPage = 100;
  const maxPages = 100;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "X-PF-Error-Format": "problem-json-v2",
  };

  async function fetchPage(page: number): Promise<{ results: Record<string, unknown>[]; totalPages: number }> {
    const res = await fetch(`${baseUrl}/v1/listings?perPage=${perPage}&page=${page}`, { headers });
    if (!res.ok) {
      throw new Error(await describeError(res, "Failed to fetch listings from Property Finder"));
    }
    const body = await res.json();
    return {
      results: Array.isArray(body?.results) ? body.results : [],
      totalPages: body?.pagination?.totalPages ?? 1,
    };
  }

  const first = await fetchPage(1);
  const all = [...first.results];
  const totalPages = Math.min(first.totalPages, maxPages);

  const remainingPages = Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => i + 2);
  const collected: Record<string, unknown>[][] = [];
  await mapWithConcurrency(remainingPages, CONCURRENCY, async (page) => {
    const { results } = await fetchPage(page);
    collected.push(results);
  });
  for (const results of collected) all.push(...results);

  return all;
}

// Listings only embed a bare {id, name, photo} for assignedTo/createdBy.
// Real contact info (phone, WhatsApp, email, title) lives on this account's
// own /v1/users directory — these are Luxury Estates' own team members, not
// third parties, and the id used on listings is each user's
// publicProfile.id, not their outer account id. The directory is small
// (tens of users, not thousands), so it's cheap to fetch in full each run
// rather than resolving one-by-one.
async function fetchAgentDirectory(baseUrl: string, token: string): Promise<Map<number, AgentContact>> {
  const perPage = 100;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "X-PF-Error-Format": "problem-json-v2",
  };

  const directory = new Map<number, AgentContact>();
  try {
    let page = 1;
    for (;;) {
      const res = await fetch(`${baseUrl}/v1/users?perPage=${perPage}&page=${page}`, { headers });
      if (!res.ok) break;
      const body = await res.json();
      const users = Array.isArray(body?.data) ? body.data : [];
      for (const user of users) {
        const profile = user?.publicProfile;
        if (!profile?.id) continue;
        directory.set(profile.id, {
          name: profile.name || (user?.firstName ? `${user.firstName} ${user.lastName}`.trim() : ""),
          photo: profile.imageVariants?.large?.default || profile.imageVariants?.large?.jpg || null,
          phone: profile.phone || user?.mobile || null,
          whatsapp: profile.whatsappPhone || profile.phone || user?.mobile || null,
          email: profile.email || user?.email || null,
          title: profile.position?.primary || null,
        });
      }
      const totalPages = body?.pagination?.totalPages ?? 1;
      if (page >= totalPages) break;
      page += 1;
    }
  } catch {
    // best-effort — listings still sync with just the name/photo already
    // embedded on assignedTo if the directory fetch fails
  }
  return directory;
}

// GET /v1/locations requires a free-text `search` term (min length 2)
// that's matched against location names, ANDed with `filter[id]`. There
// is no way to look a location up by id alone, so we pair filter[id]
// with a couple of very common letter pairs — enough to match virtually
// any location name — and let filter[id] do the actual narrowing.
//
// KNOWN ISSUE: this endpoint returns a WAF-style 404/403 when called
// from Supabase's egress IPs (or any non-curl/non-Python HTTP client —
// confirmed with Node's fetch and raw https module too), even though
// the identical request succeeds from an ordinary client. It's
// endpoint-specific: /v1/auth/token and /v1/listings both work fine
// from here. This is almost certainly a client-fingerprint check on
// Property Finder's/AWS's WAF, not IP-based — worth reporting to
// integration.support@propertyfinder.ae. Rather than try to spoof past
// it, the sync relies on the pf_locations cache table (pre-populated
// out-of-band from a client that isn't blocked) and only attempts this
// live call as a best-effort fallback for ids not yet in that cache.
const LOCATION_SEARCH_CANDIDATES = ["al", "ei", "oo"];

async function resolveLocationName(
  baseUrl: string,
  token: string,
  locationId: number,
): Promise<{ area: string; city: string; lat: number | null; lng: number | null } | null> {
  for (const search of LOCATION_SEARCH_CANDIDATES) {
    try {
      const url = `${baseUrl}/v1/locations?filter%5Bid%5D=${locationId}&search=${search}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      if (res.ok) {
        const body = await res.json();
        const match = (body?.data ?? []).find((l: { id?: number }) => l.id === locationId);
        if (match) {
          const tree = Array.isArray(match.tree) ? match.tree : [];
          const cityEntry = tree.find((t: { type?: string }) => t.type === "CITY");
          const coords = match.coordinates as { lat?: number; lng?: number } | undefined;
          return {
            area: match.name ?? `Location #${locationId}`,
            city: cityEntry?.name ?? "",
            lat: typeof coords?.lat === "number" ? coords.lat : null,
            lng: typeof coords?.lng === "number" ? coords.lng : null,
          };
        }
      }
    } catch {
      // try the next candidate
    }
  }
  return null;
}

function resolvePrice(price: { type?: string; amounts?: Record<string, number> }): {
  status: "buy" | "rent";
  price_unit: "total" | "month";
  price: number;
} {
  const amounts = price.amounts ?? {};
  if (price.type === "sale") {
    return { status: "buy", price_unit: "total", price: Number(amounts.sale) || 0 };
  }
  if (amounts.monthly != null) return { status: "rent", price_unit: "month", price: Number(amounts.monthly) };
  if (amounts.yearly != null) return { status: "rent", price_unit: "month", price: Math.round(Number(amounts.yearly) / 12) };
  if (amounts.weekly != null) return { status: "rent", price_unit: "month", price: Math.round(Number(amounts.weekly) * 4.345) };
  if (amounts.daily != null) return { status: "rent", price_unit: "month", price: Math.round(Number(amounts.daily) * 30) };
  return { status: "rent", price_unit: "month", price: 0 };
}

function parseBedrooms(value: string | undefined): number {
  if (!value || value === "studio") return 0;
  const n = parseInt(value, 10);
  return Number.isFinite(n) ? n : 0;
}

function parseBathrooms(value: string | undefined): number {
  if (!value || value === "none") return 0;
  const n = parseInt(value, 10);
  return Number.isFinite(n) ? n : 0;
}

function mapPfType(type: string | undefined, category: string | undefined): string {
  if (type && PF_TYPE_MAP[type]) return PF_TYPE_MAP[type];
  return category === "commercial" ? "Office" : "Apartment";
}

function mapListing(
  raw: Record<string, unknown>,
  locationCache: Map<number, { area: string; city: string; lat: number | null; lng: number | null }>,
  agentDirectory: Map<number, AgentContact>,
  agentIdByPfUserId: Map<number, string>,
): MappedListing | null {
  const id = raw.id as string | undefined;
  const titleObj = raw.title as { en?: string; ar?: string } | undefined;
  const title = titleObj?.en || titleObj?.ar;
  const priceObj = raw.price as { type?: string; amounts?: Record<string, number> } | undefined;

  if (!id || !title || !priceObj) return null;

  const state = raw.state as { stage?: string } | undefined;
  if (state?.stage && state.stage !== "live") return null;

  const { status, price_unit, price } = resolvePrice(priceObj);

  const locationObj = raw.location as { id?: number } | undefined;
  const resolvedLocation =
    locationObj?.id != null ? locationCache.get(locationObj.id) : undefined;
  const area = resolvedLocation?.area ?? (locationObj?.id != null ? `Location #${locationObj.id}` : "");
  const city = resolvedLocation?.city ?? "";

  const hasRealCoords =
    resolvedLocation?.lat != null &&
    resolvedLocation?.lng != null &&
    !(resolvedLocation.lat === 0 && resolvedLocation.lng === 0);
  const cityFallback = CITY_FALLBACK_COORDS[city];
  // Several distinct sub-locations can share the same city fallback (see
  // CITY_FALLBACK_COORDS above); nudge each by a small, deterministic
  // amount (keyed off the PF location id) so they don't all render as one
  // stacked marker on the map.
  const jitter = locationObj?.id != null ? (((locationObj.id * 2654435761) % 1000) / 1000 - 0.5) * 0.01 : 0;
  const lat = hasRealCoords ? resolvedLocation!.lat : cityFallback ? cityFallback.lat + jitter : null;
  const lng = hasRealCoords ? resolvedLocation!.lng : cityFallback ? cityFallback.lng - jitter : null;

  const media = raw.media as
    | { images?: Array<{ original?: { url?: string }; watermarked?: { url?: string } }> }
    | undefined;
  const images = (media?.images ?? [])
    .map((img) => img.original?.url || img.watermarked?.url)
    .filter((url): url is string => Boolean(url));

  const descriptionObj = raw.description as { en?: string; ar?: string } | undefined;
  const amenities = Array.isArray(raw.amenities) ? (raw.amenities as string[]) : [];
  const reference = (raw.reference as string) || id;
  const size = Number(raw.size ?? raw.builtUpArea ?? 0) || 0;

  const listingAgent = (raw.assignedTo ?? raw.createdBy) as
    | { id?: number; name?: string; photos?: { thumbnail?: string } }
    | undefined;
  const agentContact = listingAgent?.id != null ? agentDirectory.get(listingAgent.id) : undefined;

  return {
    external_id: id,
    title,
    slug: slugify(`${title}-${id}`),
    status,
    type: mapPfType(raw.type as string | undefined, raw.category as string | undefined),
    area,
    city,
    price,
    price_unit,
    beds: parseBedrooms(raw.bedrooms as string | undefined),
    baths: parseBathrooms(raw.bathrooms as string | undefined),
    size,
    year_built: 0,
    lat,
    lng,
    description: descriptionObj?.en || descriptionObj?.ar || "",
    amenities,
    images,
    agent_id: listingAgent?.id != null ? agentIdByPfUserId.get(listingAgent.id) ?? null : null,
    pf_agent_name: agentContact?.name || listingAgent?.name?.trim() || null,
    pf_agent_photo: agentContact?.photo || listingAgent?.photos?.thumbnail || null,
    pf_agent_phone: agentContact?.phone ?? null,
    pf_agent_whatsapp: agentContact?.whatsapp ?? null,
    pf_agent_email: agentContact?.email ?? null,
    pf_agent_title: agentContact?.title ?? null,
    reference: `PF-${reference}`,
    external_url: null,
  };
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

async function describeError(res: Response, fallback: string): Promise<string> {
  try {
    const body = await res.json();
    const detail = body?.detail || body?.title || body?.message;
    return detail ? `${fallback}: ${detail} (HTTP ${res.status})` : `${fallback} (HTTP ${res.status})`;
  } catch {
    return `${fallback} (HTTP ${res.status})`;
  }
}

async function pruneMissing(supabase: SupabaseClient, seenIds: string[]): Promise<number> {
  const existingIds: string[] = [];
  const PAGE_SIZE = 1000;
  for (let offset = 0; ; offset += PAGE_SIZE) {
    const { data: page } = await supabase
      .from("properties")
      .select("external_id")
      .eq("source", "property_finder")
      .range(offset, offset + PAGE_SIZE - 1);
    for (const row of page ?? []) {
      if (row.external_id) existingIds.push(row.external_id);
    }
    if (!page || page.length < PAGE_SIZE) break;
  }

  const seenSet = new Set(seenIds);
  const idsToDelete = existingIds.filter((id: string) => !seenSet.has(id));
  if (idsToDelete.length === 0) return 0;

  let deleted = 0;
  for (let i = 0; i < idsToDelete.length; i += UPSERT_CHUNK_SIZE) {
    const chunk = idsToDelete.slice(i, i + UPSERT_CHUNK_SIZE);
    const { count, error } = await supabase
      .from("properties")
      .delete({ count: "exact" })
      .eq("source", "property_finder")
      .in("external_id", chunk);
    if (error) {
      console.error("Prune failed:", error.message);
      continue;
    }
    deleted += count ?? 0;
  }
  return deleted;
}

async function updateStatus(
  supabase: SupabaseClient,
  status: "success" | "error" | "skipped",
  message: string,
  count: number | null,
) {
  await supabase
    .from("property_finder_settings")
    .update({
      last_synced_at: new Date().toISOString(),
      last_sync_status: status,
      last_sync_message: message,
      last_sync_count: count,
    })
    .eq("id", "default");
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}
