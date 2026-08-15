import { Metadata } from "next";
import BlogIndexView from "@/components/views/BlogIndexView";
import { getPublishedPosts, getCategoryPills } from "@/lib/queries/posts";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const revalidate = 60;

export const metadata: Metadata = toMetadata(meta);

export default async function BlogIndex({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; category?: string }>;
}) {
  const { page: pageParam, q, category } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? 1));

  const [{ posts, total, totalPages }, categoryPills] = await Promise.all([
    getPublishedPosts({ page, q, category }),
    getCategoryPills({ activeSlug: category ?? null }),
  ]);

  return (
    <BlogIndexView
      posts={posts}
      total={total}
      page={page}
      totalPages={totalPages}
      categoryPills={categoryPills}
      query={q ?? ""}
      activeCategory={category ?? null}
    />
  );
}
