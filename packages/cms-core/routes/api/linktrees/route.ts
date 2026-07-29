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

export const createLinktreeSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
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
  showTitle: z.boolean().optional(),
  avatarSize: z.enum(["SM", "MD", "LG"]).optional(),
  avatarShape: z.enum(["CIRCLE", "LOGO"]).optional(),
  seoTitle: z.string().optional().nullable(),
  seoDesc: z.string().optional().nullable(),
  ogImage: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  sections: z.array(sectionSchema).optional().default([]),
  ungroupedLinks: z.array(linkSchema).optional().default([]),
});

function linkCreateData(link: z.infer<typeof linkSchema>) {
  return {
    title: link.title,
    url: link.url,
    icon: link.icon ?? null,
    position: link.position,
    isActive: link.isActive ?? true,
    forwardUtm: link.forwardUtm ?? false,
    startsAt: link.startsAt ? new Date(link.startsAt) : null,
    endsAt: link.endsAt ? new Date(link.endsAt) : null,
  };
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const url = new URL(req.url);
    const page = Math.max(1, Number(url.searchParams.get("page") ?? 1));
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit") ?? 20)));
    const skip = (page - 1) * limit;

    const userRole = (session?.user as any)?.role;
    const where =
      session?.user?.id && userRole === "VIEWER"
        ? { ownerId: session.user.id }
        : {};

    const [linktrees, total] = await Promise.all([
      prisma.linktree.findMany({
        where,
        include: {
          owner: true,
          _count: { select: { links: true } },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip,
      }),
      prisma.linktree.count({ where }),
    ]);

    return NextResponse.json({ linktrees, total, page, limit });
  } catch (error) {
    console.error("Error fetching linktrees:", error);
    return NextResponse.json(
      { error: "Failed to fetch linktrees" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any)?.role;
    if (userRole === "VIEWER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const data = createLinktreeSchema.parse(body);
    const slug = data.slug.toLowerCase();

    if (!isValidSlugFormat(slug)) {
      return NextResponse.json(
        { error: "Slug must contain only lowercase letters, numbers, and hyphens" },
        { status: 400 }
      );
    }
    if (isReservedSlug(slug)) {
      return NextResponse.json({ error: "This slug is reserved" }, { status: 400 });
    }

    const existing = await prisma.linktree.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }

    const linktree = await prisma.$transaction(async (tx) => {
      const created = await tx.linktree.create({
        data: {
          name: data.name,
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
          showTitle: data.showTitle,
          avatarSize: data.avatarSize,
          avatarShape: data.avatarShape,
          seoTitle: data.seoTitle,
          seoDesc: data.seoDesc,
          ogImage: data.ogImage,
          status: data.status,
          ownerId: session.user.id,
          publishedAt: data.status === "PUBLISHED" ? new Date() : null,
          sections: {
            create: data.sections.map((section) => ({
              title: section.title,
              position: section.position,
              isActive: section.isActive ?? true,
              displayType: section.displayType ?? "COLUMN",
            })),
          },
        },
        include: { sections: true },
      });

      for (let i = 0; i < data.sections.length; i++) {
        const dbSection = created.sections[i];
        if (!dbSection) continue;
        for (const link of data.sections[i].links) {
          await tx.linktreeLink.create({
            data: { linktreeId: created.id, sectionId: dbSection.id, ...linkCreateData(link) },
          });
        }
      }
      for (const link of data.ungroupedLinks) {
        await tx.linktreeLink.create({
          data: { linktreeId: created.id, sectionId: null, ...linkCreateData(link) },
        });
      }

      return tx.linktree.findUniqueOrThrow({
        where: { id: created.id },
        include: { sections: { include: { links: true } }, links: { where: { sectionId: null } } },
      });
    });

    try {
      await (prisma as any).auditLog.create({
        data: {
          userId: session.user.id,
          userEmail: session.user.email ?? "",
          action: "CREATE",
          entityType: "LINKTREE",
          entityId: linktree.id,
          entityTitle: linktree.name,
        },
      });
    } catch (auditError) {
      console.error("Audit log failed:", auditError);
    }

    if (linktree.status === "PUBLISHED") {
      revalidatePath(`/${linktree.slug}`);
    }

    return NextResponse.json(linktree, { status: 201 });
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

    console.error("Error creating linktree:", error);
    return NextResponse.json(
      { error: "Failed to create linktree" },
      { status: 500 }
    );
  }
}
