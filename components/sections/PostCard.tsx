import Link from "next/link";
import Image from "next/image";
import type { PostCardData } from "@/components/sections/types";

// Extraído de los 3 `<article>` casi idénticos de app/(site)/blog/{page,
// category/[slug],tag/[tag]}.tsx. `sizes` queda hardcodeado (decisión en
// docs/fase0-divergencias-blog.md #4): es una pista de rendimiento de carga,
// no una diferencia visual, así que no se expone como prop.
const IMAGE_SIZES = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

export type PostCardProps = {
  post: PostCardData;
  // "category-top" (blog index): el eyebrow de la card muestra la categoría,
  // la fecha va abajo junto al CTA. "date-top" (category/tag): la fecha va
  // arriba, sin eyebrow de categoría.
  metaPosition?: "category-top" | "date-top";
  ctaLabel?: string;
};

export default function PostCard({
  post,
  metaPosition = "date-top",
  ctaLabel = "Read more →",
}: PostCardProps) {
  return (
    <article className="group flex flex-col rounded-[1.5rem] overflow-hidden border border-[#CAC8C8] bg-[#ECECEC] hover:shadow-lg transition-shadow duration-300">
      <Link href={post.href} className="block overflow-hidden">
        <div className="relative aspect-[16/9] w-full bg-[#CAC8C8]">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes={IMAGE_SIZES}
          />
        </div>
      </Link>
      <div className="flex flex-col flex-1 p-5">
        {metaPosition === "category-top" && post.eyebrow && (
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-[#5A5A5A] mb-2">
            {post.eyebrow}
          </span>
        )}
        {metaPosition === "date-top" && (
          <p className="font-mono text-[0.75rem] text-[#5A5A5A] mb-2">{post.dateLabel}</p>
        )}
        <Link href={post.href}>
          <h2
            className="font-medium leading-snug text-[#101010] group-hover:text-[#525252] transition-colors mb-2 line-clamp-2"
            style={{ fontSize: "var(--font-size-body)" }}
          >
            {post.title}
          </h2>
        </Link>
        {post.excerpt && (
          <p className="font-mono text-[0.8rem] text-[#5A5A5A] leading-relaxed line-clamp-2 flex-1">
            {post.excerpt}
          </p>
        )}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#CAC8C8]">
          {metaPosition === "category-top" ? (
            <>
              <span className="font-mono text-[0.75rem] text-[#5A5A5A]">{post.dateLabel}</span>
              <Link
                href={post.href}
                className="font-mono text-[0.75rem] text-[#5A5A5A] hover:text-[#101010] transition-colors"
              >
                {ctaLabel}
              </Link>
            </>
          ) : (
            <Link
              href={post.href}
              className="font-mono text-[0.75rem] text-[#5A5A5A] hover:text-[#101010] transition-colors"
            >
              {ctaLabel}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
