import "server-only";
import { unstable_cache } from "next/cache";
import { supabasePublic } from "@/lib/supabase/public";
import type { BlogPost } from "./types";

interface BlogPostRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string;
  author: string;
  published: boolean;
  published_at: string | null;
}

function mapBlogPost(row: BlogPostRow): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    coverImage: row.cover_image,
    author: row.author,
    published: row.published,
    publishedAt: row.published_at,
  };
}

async function fetchPublishedBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabasePublic
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapBlogPost);
}
export const getPublishedBlogPosts = unstable_cache(fetchPublishedBlogPosts, ["blog:published"], {
  revalidate: 300,
  tags: ["blog"],
});

async function fetchPublishedBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const { data, error } = await supabasePublic
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) throw error;
  return data ? mapBlogPost(data) : undefined;
}
export const getPublishedBlogPostBySlug = unstable_cache(fetchPublishedBlogPostBySlug, ["blog:bySlug"], {
  revalidate: 300,
  tags: ["blog"],
});
