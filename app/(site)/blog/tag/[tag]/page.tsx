import { notFound } from "next/navigation";
import { Metadata } from "next";
import BlogTagView from "@/components/views/BlogTagView";
import { getPostsByTag } from "@/lib/queries/posts";
import { getTagBySlug } from "@/lib/queries/taxonomy";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }): Promise<Metadata> {
  const { tag } = await params;
  return { title: `#${tag} — NEAR AI Blog`, description: `Posts tagged ${tag} on NEAR AI.` };
}

export default async function TagPage({ params, searchParams }: {
  params: Promise<{ tag: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { tag: tagSlug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? 1));

  const tag = await getTagBySlug(tagSlug);
  if (!tag) notFound();

  const { posts, total, totalPages } = await getPostsByTag({ slug: tagSlug, page });

  return (
    <BlogTagView
      tagName={tag.name}
      posts={posts}
      total={total}
      page={page}
      totalPages={totalPages}
      basePath={`/blog/tag/${tagSlug}`}
    />
  );
}
