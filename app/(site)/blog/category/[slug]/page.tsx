import { notFound } from "next/navigation";
import { Metadata } from "next";
import BlogCategoryView from "@/components/views/BlogCategoryView";
import { getPostsByCategory } from "@/lib/queries/posts";
import { getCategoryBySlug } from "@/lib/queries/taxonomy";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return { title: `${category.name} — NEAR AI Blog`, description: `Posts in ${category.name} on NEAR AI.` };
}

export default async function CategoryPage({ params, searchParams }: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? 1));

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const { posts, total, totalPages } = await getPostsByCategory({ slug, page });

  return (
    <BlogCategoryView
      categoryName={category.name}
      posts={posts}
      total={total}
      page={page}
      totalPages={totalPages}
      basePath={`/blog/category/${slug}`}
    />
  );
}
