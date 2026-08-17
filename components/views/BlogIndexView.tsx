import PageHero from "@/components/sections/PageHero";
import SearchField from "@/components/sections/SearchField";
import FilterPills from "@/components/sections/FilterPills";
import PostGrid from "@/components/sections/PostGrid";
import EmptyState from "@/components/sections/EmptyState";
import Pagination from "@/components/sections/Pagination";
import Container from "@/components/primitives/Container";
import type { PostCardData, PillItem } from "@/components/sections/types";

export type BlogIndexViewProps = {
  posts: PostCardData[];
  total: number;
  page: number;
  totalPages: number;
  categoryPills: { items: PillItem[]; allItem: PillItem };
  query: string;
  activeCategory: string | null;
};

export default function BlogIndexView({
  posts,
  total,
  page,
  totalPages,
  categoryPills,
  query,
  activeCategory,
}: BlogIndexViewProps) {
  return (
    <>
      <PageHero
        size="lg"
        eyebrow="NEAR AI BLOG"
        title={
          <>
            The future of AI<br className="hidden sm:block" /> is open
          </>
        }
        description="Insights on private AI, confidential compute, and building the open web."
      />

      <Container width="wide" className="py-16">
        <SearchField defaultValue={query} />
        <FilterPills items={categoryPills.items} allItem={categoryPills.allItem} />

        {(query || activeCategory) && (
          <p className="text-body-sm-mono text-[#5A5A5A] mb-6">
            {total} result{total !== 1 ? "s" : ""}
            {query && ` for "${query}"`}
          </p>
        )}

        {posts.length === 0 ? (
          <EmptyState message="No posts yet. Check back soon." />
        ) : (
          <>
            <PostGrid posts={posts} cardProps={{ metaPosition: "category-top", ctaLabel: "Read →" }} />
            <Pagination
              page={page}
              totalPages={totalPages}
              basePath="/blog"
              params={{
                ...(query && { q: query }),
                ...(activeCategory && { category: activeCategory }),
              }}
            />
          </>
        )}
      </Container>
    </>
  );
}
