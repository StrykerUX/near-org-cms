import PostCard, { type PostCardProps } from "@/components/sections/PostCard";
import type { PostCardData } from "@/components/sections/types";

export type PostGridProps = {
  posts: PostCardData[];
  cardProps?: Pick<PostCardProps, "metaPosition" | "ctaLabel">;
};

export default function PostGrid({ posts, cardProps }: PostGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} {...cardProps} />
      ))}
    </div>
  );
}
