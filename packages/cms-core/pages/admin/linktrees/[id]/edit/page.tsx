import { auth } from "@cms/lib/auth";
import { prisma } from "@cms/lib/prisma";
import { redirect, notFound } from "next/navigation";
import EditLinktreeClient, { type EditLinktreeInitialData } from "@cms/components/admin/EditLinktreeClient";

function toDatetimeLocal(date: Date | null): string {
  if (!date) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default async function EditLinktreePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if ((session?.user as any)?.role === "VIEWER") redirect("/admin/linktrees");

  const linktree = await prisma.linktree.findUnique({
    where: { id },
    include: {
      sections: {
        include: { links: { orderBy: { position: "asc" } } },
        orderBy: { position: "asc" },
      },
      links: { where: { sectionId: null }, orderBy: { position: "asc" } },
    },
  });

  if (!linktree) notFound();

  const initial: EditLinktreeInitialData = {
    id: linktree.id,
    name: linktree.name,
    slug: linktree.slug,
    displayName: linktree.displayName ?? "",
    bio: linktree.bio ?? "",
    avatarUrl: linktree.avatarUrl ?? "",
    bgColor: linktree.bgColor ?? "#0A0A0A",
    bgImage: linktree.bgImage ?? "",
    textColor: linktree.textColor ?? "#FFFFFF",
    buttonBgColor: linktree.buttonBgColor ?? "#FFFFFF",
    buttonTextColor: linktree.buttonTextColor ?? "#0A0A0A",
    overlayColor: linktree.overlayColor ?? "#000000",
    overlayOpacity: linktree.overlayOpacity ?? 0,
    overlayColor2: linktree.overlayColor2 ?? "#000000",
    overlayOpacity2: linktree.overlayOpacity2 ?? 0,
    glassEffect: linktree.glassEffect,
    sectionTitleBold: linktree.sectionTitleBold,
    sectionTitleItalic: linktree.sectionTitleItalic,
    buttonTextBold: linktree.buttonTextBold,
    buttonTextItalic: linktree.buttonTextItalic,
    titleFontSize: linktree.titleFontSize,
    showTitle: linktree.showTitle,
    avatarSize: linktree.avatarSize,
    avatarShape: linktree.avatarShape,
    status: linktree.status,
    sections: linktree.sections.map((section) => ({
      id: section.id,
      _key: section.id,
      title: section.title,
      displayType: section.displayType,
      isActive: section.isActive,
      links: section.links.map((link) => ({
        id: link.id,
        _key: link.id,
        title: link.title,
        url: link.url,
        icon: link.icon,
        isActive: link.isActive,
        forwardUtm: link.forwardUtm,
        startsAt: toDatetimeLocal(link.startsAt),
        endsAt: toDatetimeLocal(link.endsAt),
      })),
    })),
    ungroupedLinks: linktree.links.map((link) => ({
      id: link.id,
      _key: link.id,
      title: link.title,
      url: link.url,
      icon: link.icon,
      isActive: link.isActive,
      forwardUtm: link.forwardUtm,
      startsAt: toDatetimeLocal(link.startsAt),
      endsAt: toDatetimeLocal(link.endsAt),
    })),
  };

  return <EditLinktreeClient initial={initial} />;
}
