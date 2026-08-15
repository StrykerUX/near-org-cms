import PageHero from "@/components/sections/PageHero";
import PostGrid from "@/components/sections/PostGrid";
import EmptyState from "@/components/sections/EmptyState";
import Pagination from "@/components/sections/Pagination";
import Container from "@/components/primitives/Container";
import type { PostCardData } from "@/components/sections/types";

export type BlogTagViewProps = {
  tagName: string;
  posts: PostCardData[];
  total: number;
  page: number;
  totalPages: number;
  basePath: string;
};

export default function BlogTagView({
  tagName,
  posts,
  total,
  page,
  totalPages,
  basePath,
}: BlogTagViewProps) {
  return (
    <>
      <PageHero
        size="md"
        eyebrow="Tag"
        title={`#${tagName}`}
        stat={`${total} post${total !== 1 ? "s" : ""}`}
      />

      <Container width="wide" className="py-16">
        {posts.length === 0 ? (
          <EmptyState message="No posts with this tag yet." />
        ) : (
          <>
            <PostGrid posts={posts} cardProps={{ metaPosition: "date-top" }} />
            <Pagination page={page} totalPages={totalPages} basePath={basePath} />
          </>
        )}
      </Container>
    </>
  );
}
