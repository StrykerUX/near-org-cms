import { MetadataRoute } from "next";
import { prisma } from "@near/cms-core/lib/prisma";
import { sitemapEntries } from "@/lib/routes";
import { SITE_URL } from "@/lib/site-config";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let posts: { slug: string; publishedAt: Date | null; updatedAt: Date }[] = [];
  try {
    posts = await prisma.post.findMany({
      where: { status: "PUBLISHED", publishedAt: { lte: new Date() }, excludeFromSitemap: false },
      select: { slug: true, publishedAt: true, updatedAt: true },
      orderBy: { publishedAt: "desc" },
    });
  } catch {}

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...sitemapEntries(), ...postRoutes];
}
