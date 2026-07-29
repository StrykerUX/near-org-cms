export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@cms/lib/auth";
import { prisma } from "@cms/lib/prisma";

async function nextAvailableSlug(baseSlug: string): Promise<string> {
  let candidate = `${baseSlug}-copy`;
  let suffix = 2;
  while (await prisma.linktree.findUnique({ where: { slug: candidate } })) {
    candidate = `${baseSlug}-copy-${suffix}`;
    suffix += 1;
  }
  return candidate;
}

export async function POST(
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

    const original = await prisma.linktree.findUnique({
      where: { id },
      include: {
        sections: { include: { links: true }, orderBy: { position: "asc" } },
        links: { where: { sectionId: null } },
      },
    });
    if (!original) {
      return NextResponse.json({ error: "Linktree not found" }, { status: 404 });
    }

    const slug = await nextAvailableSlug(original.slug);
    const originalSections = original.sections;
    const originalUngroupedLinks = original.links;

    function copyLinkData(link: (typeof originalUngroupedLinks)[number]) {
      return {
        title: link.title,
        url: link.url,
        icon: link.icon,
        position: link.position,
        isActive: link.isActive,
        forwardUtm: link.forwardUtm,
        startsAt: link.startsAt,
        endsAt: link.endsAt,
      };
    }

    const duplicate = await prisma.$transaction(async (tx) => {
      const created = await tx.linktree.create({
        data: {
          name: `${original.name} (Copy)`,
          slug,
          displayName: original.displayName,
          bio: original.bio,
          avatarUrl: original.avatarUrl,
          bgColor: original.bgColor,
          bgImage: original.bgImage,
          textColor: original.textColor,
          buttonBgColor: original.buttonBgColor,
          buttonTextColor: original.buttonTextColor,
          overlayColor: original.overlayColor,
          overlayOpacity: original.overlayOpacity,
          overlayColor2: original.overlayColor2,
          overlayOpacity2: original.overlayOpacity2,
          glassEffect: original.glassEffect,
          sectionTitleBold: original.sectionTitleBold,
          sectionTitleItalic: original.sectionTitleItalic,
          buttonTextBold: original.buttonTextBold,
          buttonTextItalic: original.buttonTextItalic,
          titleFontSize: original.titleFontSize,
          seoTitle: original.seoTitle,
          seoDesc: original.seoDesc,
          ogImage: original.ogImage,
          status: "DRAFT",
          ownerId: session.user.id,
          sections: {
            create: originalSections.map((section) => ({
              title: section.title,
              position: section.position,
              isActive: section.isActive,
              displayType: section.displayType,
            })),
          },
        },
        include: { sections: true },
      });

      for (let i = 0; i < originalSections.length; i++) {
        const dbSection = created.sections[i];
        if (!dbSection) continue;
        for (const link of originalSections[i].links) {
          await tx.linktreeLink.create({
            data: { linktreeId: created.id, sectionId: dbSection.id, ...copyLinkData(link) },
          });
        }
      }
      for (const link of originalUngroupedLinks) {
        await tx.linktreeLink.create({
          data: { linktreeId: created.id, sectionId: null, ...copyLinkData(link) },
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
          entityId: duplicate.id,
          entityTitle: duplicate.name,
        },
      });
    } catch (auditError) {
      console.error("Audit log failed:", auditError);
    }

    return NextResponse.json(duplicate, { status: 201 });
  } catch (error) {
    console.error("Error duplicating linktree:", error);
    return NextResponse.json({ error: "Failed to duplicate linktree" }, { status: 500 });
  }
}
