import "server-only";
import { unstable_cache } from "next/cache";
import { supabasePublic } from "@/lib/supabase/public";
import type { OffPlanProject, OffPlanStatus } from "./types";

interface OffPlanProjectRow {
  id: string;
  slug: string;
  name: string;
  developer: string;
  status: OffPlanStatus;
  area: string;
  city: string;
  handover: string;
  starting_price: number | string;
  unit_types: string[] | null;
  min_size: number | string;
  max_size: number | string;
  payment_plan: string;
  description: string;
  amenities: string[] | null;
  images: string[] | null;
  featured: boolean;
  reference: string;
  agent_id: string | null;
  lat: number | string | null;
  lng: number | string | null;
  brochure_url: string | null;
}

function mapOffPlanProject(row: OffPlanProjectRow): OffPlanProject {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    developer: row.developer,
    status: row.status,
    area: row.area,
    city: row.city,
    handover: row.handover,
    startingPrice: Number(row.starting_price),
    unitTypes: row.unit_types ?? [],
    minSize: Number(row.min_size),
    maxSize: Number(row.max_size),
    paymentPlan: row.payment_plan,
    description: row.description,
    amenities: row.amenities ?? [],
    images: row.images ?? [],
    featured: row.featured,
    reference: row.reference,
    agentId: row.agent_id ?? "",
    lat: row.lat != null ? Number(row.lat) : 0,
    lng: row.lng != null ? Number(row.lng) : 0,
    brochureUrl: row.brochure_url ?? undefined,
  };
}

async function fetchOffPlanProjects(): Promise<OffPlanProject[]> {
  const { data, error } = await supabasePublic
    .from("off_plan_projects")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapOffPlanProject);
}
export const getOffPlanProjects = unstable_cache(fetchOffPlanProjects, ["offplan:all"], {
  revalidate: 300,
  tags: ["off-plan"],
});

async function fetchOffPlanProjectBySlug(slug: string): Promise<OffPlanProject | undefined> {
  const { data, error } = await supabasePublic
    .from("off_plan_projects")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? mapOffPlanProject(data) : undefined;
}
export const getOffPlanProjectBySlug = unstable_cache(fetchOffPlanProjectBySlug, ["offplan:bySlug"], {
  revalidate: 300,
  tags: ["off-plan"],
});

async function fetchFeaturedOffPlanProjects(): Promise<OffPlanProject[]> {
  const { data, error } = await supabasePublic
    .from("off_plan_projects")
    .select("*")
    .eq("featured", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapOffPlanProject);
}
export const getFeaturedOffPlanProjects = unstable_cache(fetchFeaturedOffPlanProjects, ["offplan:featured"], {
  revalidate: 300,
  tags: ["off-plan"],
});
