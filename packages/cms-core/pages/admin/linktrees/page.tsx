import Link from "next/link";
import { prisma } from "@cms/lib/prisma";
import { auth } from "@cms/lib/auth";
import { Prisma } from "@prisma/client";
import { Button } from "@cms/components/ui/button";
import { Card, CardContent } from "@cms/components/ui/card";
import { LinktreesBulkTable } from "./LinktreesBulkTable";

const PAGE_SIZE = 20;

export default async function LinktreesPage() {
  const session = await auth();
  const userRole = (session?.user as any)?.role;
  const userId = session?.user?.id;

  const where: Prisma.LinktreeWhereInput =
    userRole === "VIEWER" ? { ownerId: userId as string } : {};

  const [linktrees, total] = await Promise.all([
    prisma.linktree.findMany({
      where,
      include: {
        owner: true,
        _count: { select: { links: true } },
      },
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
    }),
    prisma.linktree.count({ where }),
  ]);

  const clickTotals = await prisma.linktreeLink.groupBy({
    by: ["linktreeId"],
    where: { linktreeId: { in: linktrees.map((l) => l.id) } },
    _sum: { clickCount: true },
  });
  const clickTotalMap = new Map(clickTotals.map((c) => [c.linktreeId, c._sum.clickCount ?? 0]));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold">Linktrees</h1>
          <p className="text-sm text-muted-foreground mt-1">{total} total</p>
        </div>
        {userRole !== "VIEWER" && (
          <Button asChild>
            <Link href="/admin/linktrees/new">+ New Linktree</Link>
          </Button>
        )}
      </div>

      <Card>
        {linktrees.length === 0 ? (
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground">No linktrees yet.</p>
            {userRole !== "VIEWER" && (
              <Button asChild variant="link" className="mt-2">
                <Link href="/admin/linktrees/new">Create the first one</Link>
              </Button>
            )}
          </CardContent>
        ) : (
          <LinktreesBulkTable
            linktrees={linktrees.map((l) => ({
              id: l.id,
              name: l.name,
              slug: l.slug,
              status: l.status,
              linkCount: l._count.links,
              totalClicks: clickTotalMap.get(l.id) ?? 0,
              updatedAt: l.updatedAt.toISOString(),
              owner: { name: l.owner.name },
            }))}
            userRole={userRole}
          />
        )}
      </Card>
    </div>
  );
}
