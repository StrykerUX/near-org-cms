export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@cms/lib/auth";
import { prisma } from "@cms/lib/prisma";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; linkId: string; presetId: string }> }
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

    const { presetId } = await params;
    const preset = await prisma.linktreeUtmPreset.findUnique({ where: { id: presetId } });
    if (!preset) {
      return NextResponse.json({ error: "Preset not found" }, { status: 404 });
    }

    await prisma.linktreeUtmPreset.delete({ where: { id: presetId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting UTM preset:", error);
    return NextResponse.json({ error: "Failed to delete UTM preset" }, { status: 500 });
  }
}
