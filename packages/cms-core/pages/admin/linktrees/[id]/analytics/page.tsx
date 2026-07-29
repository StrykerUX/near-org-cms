import { prisma } from "@cms/lib/prisma";
import { notFound } from "next/navigation";
import LinktreeAnalyticsClient from "@cms/components/admin/linktree/LinktreeAnalyticsClient";

export default async function LinktreeAnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const linktree = await prisma.linktree.findUnique({ where: { id }, select: { id: true, name: true } });
  if (!linktree) notFound();

  return <LinktreeAnalyticsClient linktreeId={linktree.id} linktreeName={linktree.name} />;
}
