import type { MetadataRoute } from "next";
import { getProperties } from "@/data/properties";
import { getOffPlanProjects } from "@/data/offplan";
import { getAgents } from "@/data/agents";
import { getPublishedBlogPosts } from "@/data/blog";
import { SITE_URL } from "@/lib/site";

// Next takes the lowest revalidate value across a route and everything it
// reads, so this route's effective freshness is already floored at 1h by
// the unstable_cache calls in getOffPlanProjects/getAgents/getPublishedBlogPosts
// (see DATA_CACHE_REVALIDATE in src/data/*.ts) — this export just documents
// that ceiling and future-proofs it if those ever move higher. getProperties()
// isn't cached at all (see its comment in src/data/properties.ts) so it
// contributes no signal either way.
export const revalidate = 21600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [properties, offPlanProjects, agents, posts] = await Promise.all([
    getProperties(),
    getOffPlanProjects(),
    getAgents(),
    getPublishedBlogPosts(),
  ]);

  return [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/properties`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${SITE_URL}/off-plan`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/agents`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/careers`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/huzoom-lands-for-sale`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/huzoom-lands-for-sale/ar`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/qatar-apartment-finder`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/qatar-apartment-finder/ar`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/lusail-marina-office-finder`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/lusail-marina-office-finder/ar`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/cookies`, changeFrequency: "yearly", priority: 0.2 },
    ...properties.map((p) => ({
      url: `${SITE_URL}/properties/${p.slug}`,
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
    ...offPlanProjects.map((p) => ({
      url: `${SITE_URL}/off-plan/${p.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...agents.map((a) => ({
      url: `${SITE_URL}/agents/${a.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
