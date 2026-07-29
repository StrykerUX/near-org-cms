export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@cms/lib/auth";
import { prisma } from "@cms/lib/prisma";
import { isReservedSlug } from "@cms/lib/linktree-reserved-slugs";
import { isValidSlugFormat } from "@cms/lib/utils";
import { z } from "zod";

const linkSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  url: z.string().min(1),
  icon: z.string().optional().nullable(),
  position: z.number().int(),
  isActive: z.boolean().optional(),
  forwardUtm: z.boolean().optional(),
  startsAt: z.string().optional().nullable(),
  endsAt: z.string().optional().nullable(),
});

const sectionSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  position: z.number().int(),
  isActive: z.boolean().optional(),
  displayType: z.enum(["COLUMN", "ROW", "ICONS", "ICONS_LABEL"]).optional(),
  links: z.array(linkSchema).optional().default([]),
});

const updateLinktreeSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  displayName: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
  bgColor: z.string().optional().nullable(),
  bgImage: z.string().optional().nullable(),
  textColor: z.string().optional().nullable(),
  buttonBgColor: z.string().optional().nullable(),
  buttonTextColor: z.string().optional().nullable(),
  overlayColor: z.string().optional().nullable(),
  overlayOpacity: z.number().int().min(0).max(100).optional().nullable(),
  overlayColor2: z.string().optional().nullable(),
  overlayOpacity2: z.number().int().min(0).max(100).optional().nullable(),
  glassEffect: z.boolean().optional(),
  sectionTitleBold: z.boolean().optional(),
  sectionTitleItalic: z.boolean().optional(),
  buttonTextBold: z.boolean().optional(),
  buttonTextItalic: z.boolean().optional(),
  titleFontSize: z.enum(["SM", "MD", "LG"]).optional(),
  seoTitle: z.string().optional().nullable(),
  seoDesc: z.string().optional().nullable(),
  ogImage: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  sections: z.array(sectionSchema).optional(),
  ungroupedLinks: z.array(linkSchema).optional(),
});

function linkWriteData(link: z.infer<typeof linkSchema>) {
  return {
    title: link.title,
    url: link.url,
    icon: link.icon ?? null,
    isActive: link.isActive ?? true,
    forwardUtm: link.forwardUtm ?? false,
    position: link.position,
    startsAt: link.startsAt ? new Date(link.startsAt) : null,
    endsAt: link.endsAt ? new Date(link.endsAt) : null,
  };
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const linktree = await prisma.linktree.findUnique({
      where: { id },
      include: {
        owner: true,
        sections: { include: { links: { orderBy: { position: "asc" } } }, orderBy: { position: "asc" } },
        links: { where: { sectionId: null }, orderBy: { position: "asc" } },
      },
    });

    if (!linktree) {
      return NextResponse.json({ error: "Linktree not found" }, { status: 404 });
    }

    return NextResponse.json(linktree);
  } catch (error) {
    console.error("Error fetching linktree:", error);
    return NextResponse.json({ error: "Failed to fetch linktree" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userRole = (session.user as any)?.role;
    if (userRole === "VIEWER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const existing = await prisma.linktree.findUnique({
      where: { id },
      include: { sections: { include: { links: true } }, links: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Linktree not found" }, { status: 404 });
    }

    const body = await req.json();
    const data = updateLinktreeSchema.parse(body);

    let slug = existing.slug;
    if (data.slug && data.slug.toLowerCase() !== existing.slug) {
      slug = data.slug.toLowerCase();
      if (!isValidSlugFormat(slug)) {
        return NextResponse.json(
          { error: "Slug must contain only lowercase letters, numbers, and hyphens" },
          { status: 400 }
        );
      }
      if (isReservedSlug(slug)) {
        return NextResponse.json({ error: "This slug is reserved" }, { status: 400 });
      }
      const clash = await prisma.linktree.findUnique({ where: { slug } });
      if (clash) {
        return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
      }
    }

    const now = new Date();
    const resolvedPublishedAt =
      data.status === "PUBLISHED" ? existing.publishedAt ?? now : existing.publishedAt;

    const shouldSyncLinks = data.sections !== undefined || data.ungroupedLinks !== undefined;
    const desiredSections = data.sections ?? [];
    const desiredUngrouped = data.ungroupedLinks ?? [];

    const updated = await prisma.$transaction(async (tx) => {
      await tx.linktree.update({
        where: { id },
        data: {
          name: data.name ?? existing.name,
          slug,
          displayName: data.displayName,
          bio: data.bio,
          avatarUrl: data.avatarUrl,
          bgColor: data.bgColor,
          bgImage: data.bgImage,
          textColor: data.textColor,
          buttonBgColor: data.buttonBgColor,
          buttonTextColor: data.buttonTextColor,
          overlayColor: data.overlayColor,
          overlayOpacity: data.overlayOpacity,
          overlayColor2: data.overlayColor2,
          overlayOpacity2: data.overlayOpacity2,
          glassEffect: data.glassEffect,
          sectionTitleBold: data.sectionTitleBold,
          sectionTitleItalic: data.sectionTitleItalic,
          buttonTextBold: data.buttonTextBold,
          buttonTextItalic: data.buttonTextItalic,
          titleFontSize: data.titleFontSize,
          seoTitle: data.seoTitle,
          seoDesc: data.seoDesc,
          ogImage: data.ogImage,
          status: data.status ?? existing.status,
          publishedAt: resolvedPublishedAt,
        },
      });

      if (shouldSyncLinks) {
        const currentSectionIds = new Set(existing.sections.map((s) => s.id));
        const keptSectionIds = new Set<string>();
        const allDesiredLinks: { link: z.infer<typeof linkSchema>; sectionId: string | null }[] =
          desiredUngrouped.map((link) => ({ link, sectionId: null }));

        for (const section of desiredSections) {
          let resolvedSectionId: string;
          if (section.id && currentSectionIds.has(section.id)) {
            await tx.linktreeSection.update({
              where: { id: section.id },
              data: {
                title: section.title,
                position: section.position,
                isActive: section.isActive ?? true,
                displayType: section.displayType ?? "COLUMN",
              },
            });
            resolvedSectionId = section.id;
          } else {
            const created = await tx.linktreeSection.create({
              data: {
                linktreeId: id,
                title: section.title,
                position: section.position,
                isActive: section.isActive ?? true,
                displayType: section.displayType ?? "COLUMN",
              },
            });
            resolvedSectionId = created.id;
          }
          keptSectionIds.add(resolvedSectionId);
          for (const link of section.links) {
            allDesiredLinks.push({ link, sectionId: resolvedSectionId });
          }
        }

        const sectionIdsToDelete = [...currentSectionIds].filter(
          (sid) => !keptSectionIds.has(sid)
        );
        if (sectionIdsToDelete.length) {
          await tx.linktreeSection.deleteMany({ where: { id: { in: sectionIdsToDelete } } });
        }

        const currentLinkIds = new Set([
          ...existing.links.map((l) => l.id),
          ...existing.sections.flatMap((s) => s.links.map((l) => l.id)),
        ]);
        const keptLinkIds = new Set<string>();

        for (const { link, sectionId } of allDesiredLinks) {
          if (link.id && currentLinkIds.has(link.id)) {
            await tx.linktreeLink.update({
              where: { id: link.id },
              data: { ...linkWriteData(link), sectionId },
            });
            keptLinkIds.add(link.id);
          } else {
            const created = await tx.linktreeLink.create({
              data: { linktreeId: id, sectionId, ...linkWriteData(link) },
            });
            keptLinkIds.add(created.id);
          }
        }

        const linkIdsToDelete = [...currentLinkIds].filter((lid) => !keptLinkIds.has(lid));
        if (linkIdsToDelete.length) {
          await tx.linktreeLink.deleteMany({ where: { id: { in: linkIdsToDelete } } });
        }
      }

      return tx.linktree.findUnique({
        where: { id },
        include: {
          owner: true,
          sections: { include: { links: { orderBy: { position: "asc" } } }, orderBy: { position: "asc" } },
          links: { where: { sectionId: null }, orderBy: { position: "asc" } },
        },
      });
    });

    try {
      await (prisma as any).auditLog.create({
        data: {
          userId: session.user.id,
          userEmail: session.user.email ?? "",
          action: "UPDATE",
          entityType: "LINKTREE",
          entityId: id,
          entityTitle: updated?.name ?? existing.name,
        },
      });
    } catch (auditError) {
      console.error("Audit log failed:", auditError);
    }

    if (existing.slug !== slug) {
      revalidatePath(`/${existing.slug}`);
    }
    if (updated?.status === "PUBLISHED") {
      revalidatePath(`/${slug}`);
    }

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid request body",
          ...(process.env.NODE_ENV === "development" && { details: error.issues }),
        },
        { status: 400 }
      );
    }

    console.error("Error updating linktree:", error);
    return NextResponse.json({ error: "Failed to update linktree" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userRole = (session.user as any)?.role;
    if (userRole === "VIEWER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const linktree = await prisma.linktree.findUnique({ where: { id } });
    if (!linktree) {
      return NextResponse.json({ error: "Linktree not found" }, { status: 404 });
    }

    await prisma.linktree.delete({ where: { id } });

    try {
      await (prisma as any).auditLog.create({
        data: {
          userId: session.user.id,
          userEmail: session.user.email ?? "",
          action: "DELETE",
          entityType: "LINKTREE",
          entityId: linktree.id,
          entityTitle: linktree.name,
        },
      });
    } catch (auditError) {
      console.error("Audit log failed:", auditError);
    }

    revalidatePath(`/${linktree.slug}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting linktree:", error);
    return NextResponse.json({ error: "Failed to delete linktree" }, { status: 500 });
  }
}
