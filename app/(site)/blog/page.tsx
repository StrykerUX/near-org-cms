import { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import BlogIndexView from "@/components/views/BlogIndexView";
import { getPublishedPosts, getCategoryPills } from "@/lib/queries/posts";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog — NEAR AI",
  description: "Insights on AI, private compute, and the future of the open web.",
  openGraph: {
    type: "website",
    url: "https://near.ai/blog",
    siteName: "NEAR AI",
    title: "Blog — NEAR AI",
    description: "Insights on AI, private compute, and the future of the open web.",
  },
};

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
      nav={<SiteHeader />}
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
