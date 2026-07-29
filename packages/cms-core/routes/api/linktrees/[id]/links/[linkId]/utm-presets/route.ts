export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@cms/lib/auth";
import { prisma } from "@cms/lib/prisma";
import { z } from "zod";

const presetSchema = z.object({
  label: z.string().min(1),
  utmSource: z.string().optional().nullable(),
  utmMedium: z.string().optional().nullable(),
  utmCampaign: z.string().optional().nullable(),
  utmTerm: z.string().optional().nullable(),
  utmContent: z.string().optional().nullable(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; linkId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { linkId } = await params;
    const presets = await prisma.linktreeUtmPreset.findMany({
      where: { linkId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ presets });
  } catch (error) {
    console.error("Error fetching UTM presets:", error);
    return NextResponse.json({ error: "Failed to fetch UTM presets" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; linkId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userRole = (session.user as any)?.role;
    if (userRole === "VIEWER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { linkId } = await params;
    const link = await prisma.linktreeLink.findUnique({ where: { id: linkId } });
    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    const body = await req.json();
    const data = presetSchema.parse(body);

    const preset = await prisma.linktreeUtmPreset.create({
      data: { ...data, linkId, createdById: session.user.id },
    });

    return NextResponse.json(preset, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
    console.error("Error creating UTM preset:", error);
    return NextResponse.json({ error: "Failed to create UTM preset" }, { status: 500 });
  }
}
