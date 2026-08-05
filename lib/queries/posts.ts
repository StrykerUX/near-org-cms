import { prisma } from "@near/cms-core/lib/prisma";
import { extractExcerpt } from "@near/cms-core/lib/excerpt";
import type { PostCardData, PillItem } from "@/components/sections/types";

// Único PAGE_SIZE y único cálculo de skip/totalPages — hoy triplicado entre
// blog/page.tsx, blog/category/[slug]/page.tsx y blog/tag/[tag]/page.tsx.
export const PAGE_SIZE = 12;

type PostRow = {
  id: string;
  slug: string;
  title: string;
  coverImage: string | null;
  publishedAt: Date | null;
  excerpt: string | null;
  content: unknown;
  categories?: { name: string; slug: string }[];
};

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// La única función que convierte una fila de Prisma a un view-model — el
// diseñador nunca ve un `Date` ni un `content: unknown`, ver
// components/sections/types.ts.
export function toPostCard(post: PostRow): PostCardData {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    href: `/blog/${post.slug}`,
    coverImage: post.coverImage ?? "/blog-gen-background.jpg",
    excerpt: post.excerpt || extractExcerpt(post.content),
    dateLabel: post.publishedAt ? formatDate(post.publishedAt) : "",
    eyebrow: post.categories?.[0]?.name ?? null,
  };
}

function paginate(page: number) {
  const safePage = Math.max(1, page);
  return { page: safePage, skip: (safePage - 1) * PAGE_SIZE };
}

export async function getPublishedPosts({
  page,
  q,
  category,
}: {
  page: number;
  q?: string;
  category?: string;
}) {
  const { skip } = paginate(page);
  const now = new Date();

  const where = {
    status: "PUBLISHED" as const,
    publishedAt: { lte: now },
    ...(q && {
      OR: [
        { title: { contains: q, mode: "insensitive" as const } },
        { excerpt: { contains: q, mode: "insensitive" as const } },
      ],
    }),
    ...(category && { categories: { some: { slug: category } } }),
  };

  const [rows, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      take: PAGE_SIZE,
      skip,
      select: {
        id: true,
        slug: true,
        title: true,
        coverImage: true,
        publishedAt: true,
        excerpt: true,
        content: true,
        categories: { select: { name: true, slug: true } },
      },
    }),
    prisma.post.count({ where }),
  ]);

  return {
    posts: rows.map(toPostCard),
    total,
    totalPages: Math.ceil(total / PAGE_SIZE),
  };
}

export async function getCategoryPills({
  activeSlug,
}: {
  activeSlug: string | null;
}): Promise<{ items: PillItem[]; allItem: PillItem }> {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true, slug: true },
    orderBy: { name: "asc" },
  });

  return {
    allItem: { id: "__all__", label: "All", href: "/blog", active: !activeSlug },
    items: categories.map((cat) => ({
      id: cat.id,
      label: cat.name,
      href: `/blog?category=${cat.slug}`,
      active: activeSlug === cat.slug,
    })),
  };
}

export async function getPostsByCategory({ slug, page }: { slug: string; page: number }) {
  const { skip } = paginate(page);
  const now = new Date();
  const where = {
    status: "PUBLISHED" as const,
    publishedAt: { lte: now },
    categories: { some: { slug } },
  };

  const [rows, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      take: PAGE_SIZE,
      skip,
      select: {
        id: true,
        slug: true,
        title: true,
        coverImage: true,
        publishedAt: true,
        excerpt: true,
        content: true,
      },
    }),
    prisma.post.count({ where }),
  ]);

  return {
    posts: rows.map(toPostCard),
    total,
    totalPages: Math.ceil(total / PAGE_SIZE),
  };
}

export async function getPostsByTag({ slug, page }: { slug: string; page: number }) {
  const { skip } = paginate(page);
  const now = new Date();
  const where = {
    status: "PUBLISHED" as const,
    publishedAt: { lte: now },
    tags: { some: { slug } },
  };

  const [rows, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      take: PAGE_SIZE,
      skip,
      select: {
        id: true,
        slug: true,
        title: true,
        coverImage: true,
        publishedAt: true,
        excerpt: true,
        content: true,
      },
    }),
    prisma.post.count({ where }),
  ]);

  return {
    posts: rows.map(toPostCard),
    total,
    totalPages: Math.ceil(total / PAGE_SIZE),
  };
}
