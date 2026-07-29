export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@cms/lib/prisma";
import { isBotUserAgent, hashIp, parseUserAgent } from "@cms/lib/linktree-tracking";

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ linkId: string }> }
) {
  const { linkId } = await params;
  const link = await prisma.linktreeLink.findUnique({
    where: { id: linkId },
    include: { linktree: { select: { status: true } } },
  });

  if (!link || link.linktree.status !== "PUBLISHED" || !link.isActive) {
    return NextResponse.json({ error: "Link not found" }, { status: 404 });
  }

  const now = new Date();
  if (link.startsAt && link.startsAt > now) {
    return NextResponse.json({ error: "Link not yet active" }, { status: 404 });
  }
  if (link.endsAt && link.endsAt < now) {
    return NextResponse.json({ error: "Link expired" }, { status: 404 });
  }

  const url = new URL(req.url);
  const userAgent = req.headers.get("user-agent");
  const referrer = req.headers.get("referer");
  const forwardedFor = req.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() ?? null;
  const isBot = isBotUserAgent(userAgent);
  const { browser, os, deviceType } = parseUserAgent(userAgent);

  const utmValues = Object.fromEntries(
    UTM_KEYS.map((key) => [key, url.searchParams.get(key)])
  ) as Record<(typeof UTM_KEYS)[number], string | null>;

  try {
    await prisma.$transaction([
      prisma.linktreeClick.create({
        data: {
          linkId: link.id,
          utmSource: utmValues.utm_source,
          utmMedium: utmValues.utm_medium,
          utmCampaign: utmValues.utm_campaign,
          utmTerm: utmValues.utm_term,
          utmContent: utmValues.utm_content,
          referrer,
          deviceType,
          browser,
          os,
          ipHash: hashIp(ip),
          isBot,
        },
      }),
      ...(isBot
        ? []
        : [
            prisma.linktreeLink.update({
              where: { id: link.id },
              data: { clickCount: { increment: 1 } },
            }),
          ]),
    ]);
  } catch (error) {
    console.error("Error recording linktree click:", error);
  }

  const target = new URL(link.url);
  if (link.forwardUtm) {
    for (const key of UTM_KEYS) {
      const value = utmValues[key];
      if (value) target.searchParams.set(key, value);
    }
  }

  return NextResponse.redirect(target.toString(), 302);
}
