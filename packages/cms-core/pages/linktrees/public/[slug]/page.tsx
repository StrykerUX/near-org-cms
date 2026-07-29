import { prisma } from "@cms/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import LinktreePublicView from "@cms/components/linktree/LinktreePublicView";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const linktree = await prisma.linktree.findUnique({ where: { slug } });
    if (!linktree || linktree.status !== "PUBLISHED") return {};
    const title = linktree.seoTitle || linktree.displayName || linktree.name;
    const description = linktree.seoDesc || linktree.bio || undefined;
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: linktree.ogImage ? [{ url: linktree.ogImage }] : [],
      },
    };
  } catch {
    return {};
  }
}

export async function generateStaticParams() {
  try {
    const linktrees = await prisma.linktree.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true },
    });
    return linktrees.map((l: { slug: string }) => ({ slug: l.slug }));
  } catch {
    return [];
  }
}

export default async function LinktreePublicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const linktree = await prisma.linktree.findUnique({
    where: { slug },
    include: {
      sections: {
        include: { links: { orderBy: { position: "asc" } } },
        orderBy: { position: "asc" },
      },
      links: { where: { sectionId: null }, orderBy: { position: "asc" } },
    },
  });

  if (!linktree || linktree.status !== "PUBLISHED") notFound();

  return (
    <LinktreePublicView
      displayName={linktree.displayName}
      bio={linktree.bio}
      avatarUrl={linktree.avatarUrl}
      bgColor={linktree.bgColor}
      bgImage={linktree.bgImage}
      textColor={linktree.textColor}
      buttonBgColor={linktree.buttonBgColor}
      buttonTextColor={linktree.buttonTextColor}
      overlayColor={linktree.overlayColor}
      overlayOpacity={linktree.overlayOpacity}
      glassEffect={linktree.glassEffect}
      overlayColor2={linktree.overlayColor2}
      overlayOpacity2={linktree.overlayOpacity2}
      titleFontSize={linktree.titleFontSize}
      sectionTitleBold={linktree.sectionTitleBold}
      sectionTitleItalic={linktree.sectionTitleItalic}
      buttonTextBold={linktree.buttonTextBold}
      buttonTextItalic={linktree.buttonTextItalic}
      sections={linktree.sections.map((section) => ({
        id: section.id,
        title: section.title,
        displayType: section.displayType,
        isActive: section.isActive,
        links: section.links,
      }))}
      ungroupedLinks={linktree.links}
    />
  );
}
