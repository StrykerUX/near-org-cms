export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@cms/lib/auth";
import { prisma } from "@cms/lib/prisma";

const RANGE_DAYS: Record<string, number> = { "7": 7, "30": 30, "90": 90 };

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const linktree = await prisma.linktree.findUnique({
      where: { id },
      select: { id: true, links: { select: { id: true, title: true } } },
    });
    if (!linktree) {
      return NextResponse.json({ error: "Linktree not found" }, { status: 404 });
    }

    const url = new URL(req.url);
    const rangeParam = url.searchParams.get("range") ?? "30";
    const rangeDays = RANGE_DAYS[rangeParam] ?? 30;

    const linkIds = await prisma.linktreeLink.findMany({
      where: { linktreeId: id },
      select: { id: true, title: true },
    });
    const linkIdList = linkIds.map((l) => l.id);

    const now = new Date();
    const since24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const since7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const since30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sinceRange = new Date(now.getTime() - rangeDays * 24 * 60 * 60 * 1000);

    const baseWhere = { linkId: { in: linkIdList }, isBot: false };

    const [count24h, count7d, count30d, rangeClicks] = await Promise.all([
      prisma.linktreeClick.count({ where: { ...baseWhere, clickedAt: { gte: since24h } } }),
      prisma.linktreeClick.count({ where: { ...baseWhere, clickedAt: { gte: since7d } } }),
      prisma.linktreeClick.count({ where: { ...baseWhere, clickedAt: { gte: since30d } } }),
      prisma.linktreeClick.findMany({
        where: { ...baseWhere, clickedAt: { gte: sinceRange } },
        select: { clickedAt: true, linkId: true, utmSource: true },
      }),
    ]);

    // Daily timeseries
    const dayBuckets = new Map<string, number>();
    for (let i = 0; i < rangeDays; i++) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      dayBuckets.set(d.toISOString().slice(0, 10), 0);
    }
    for (const click of rangeClicks) {
      const key = click.clickedAt.toISOString().slice(0, 10);
      if (dayBuckets.has(key)) {
        dayBuckets.set(key, (dayBuckets.get(key) ?? 0) + 1);
      }
    }
    const timeseries = [...dayBuckets.entries()]
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([date, clicks]) => ({ date, clicks }));

    // Top links within range
    const linkTitleMap = new Map(linkIds.map((l) => [l.id, l.title]));
    const clicksByLink = new Map<string, number>();
    for (const click of rangeClicks) {
      clicksByLink.set(click.linkId, (clicksByLink.get(click.linkId) ?? 0) + 1);
    }
    const topLinks = [...clicksByLink.entries()]
      .map(([linkId, clicks]) => ({ linkId, title: linkTitleMap.get(linkId) ?? "Unknown", clicks }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10);

    // Top UTM sources within range
    const clicksBySource = new Map<string, number>();
    for (const click of rangeClicks) {
      const source = click.utmSource || "(none)";
      clicksBySource.set(source, (clicksBySource.get(source) ?? 0) + 1);
    }
    const topUtmSources = [...clicksBySource.entries()]
      .map(([source, clicks]) => ({ source, clicks }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10);

    return NextResponse.json({
      rolling: { last24h: count24h, last7d: count7d, last30d: count30d },
      timeseries,
      topLinks,
      topUtmSources,
      rangeDays,
    });
  } catch (error) {
    console.error("Error fetching linktree analytics:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
