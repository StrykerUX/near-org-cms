import { prisma } from "@near/cms-core/lib/prisma";

export function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

export function getTagBySlug(slug: string) {
  return prisma.tag.findUnique({ where: { slug } });
}
