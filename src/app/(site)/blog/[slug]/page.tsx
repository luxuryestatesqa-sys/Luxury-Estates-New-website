import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { getPublishedBlogPostBySlug, getPublishedBlogPosts } from "@/data/blog";
import { formatDate } from "@/lib/format";
import BlogCard from "@/components/BlogCard";
import { SITE_URL } from "@/lib/site";

// Safety net only — admin saves push fresh data instantly via /api/revalidate.
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `${SITE_URL}/blog/${post.slug}` },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);
  if (!post) notFound();

  const allPosts = await getPublishedBlogPosts();
  const related = allPosts.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 lg:px-8">
      <nav className="mb-6 text-xs text-gray-400">
        <Link href="/blog" className="hover:text-gold-600">
          Blog
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink-600">{post.title}</span>
      </nav>

      <p className="text-xs text-gray-400">
        {post.publishedAt ? formatDate(post.publishedAt) : ""}
        {post.author ? ` · ${post.author}` : ""}
      </p>
      <h1 className="mt-2 font-serif text-h1 font-semibold text-ink-900">
        {post.title}
      </h1>

      {post.coverImage ? (
        <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-xl bg-gray-100">
          <Image src={post.coverImage} alt={post.title} fill className="object-cover" priority />
        </div>
      ) : null}

      <div className="prose prose-neutral mt-8 max-w-none prose-headings:font-serif prose-headings:text-ink-900 prose-a:text-gold-600">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>

      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="font-serif text-2xl font-semibold text-ink-900">More from the blog</h2>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <BlogCard key={p.id} post={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
