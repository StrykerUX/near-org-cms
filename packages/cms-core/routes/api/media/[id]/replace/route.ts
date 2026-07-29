export const dynamic = "force-dynamic";

export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { auth } from "@cms/lib/auth";
import { prisma } from "@cms/lib/prisma";
import { createS3Client } from "@cms/lib/s3";
import { resolveFileType, checkRateLimit, contentDispositionHeader, CACHE_CONTROL } from "@cms/lib/upload-types";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!checkRateLimit(session.user.id)) {
    return NextResponse.json({ error: "Too many uploads. Try again in a minute." }, { status: 429 });
  }

  const { id } = await params;
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const config = resolveFileType(file);
  if (!config) {
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
  }

  if (file.size > config.maxSize) {
    const maxMb = config.maxSize / (1024 * 1024);
    return NextResponse.json({ error: `File too large (max ${maxMb}MB)` }, { status: 400 });
  }

  const reportedExt = file.name.split(".").pop()?.toLowerCase();
  if (!reportedExt || !config.validExtensions.includes(reportedExt)) {
    return NextResponse.json(
      { error: "File extension does not match its declared type" },
      { status: 400 }
    );
  }

  const currentExt = media.url.split(".").pop()?.toLowerCase();
  if (config.ext !== currentExt) {
    return NextResponse.json(
      { error: `Replacement must be a .${currentExt} file` },
      { status: 400 }
    );
  }

  const key = media.url.replace(`${process.env.R2_PUBLIC_URL}/`, "");
  const buffer = Buffer.from(await file.arrayBuffer());

  const s3 = createS3Client();
  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: config.mimeType,
      ContentDisposition: contentDispositionHeader(
        media.filename,
        config.mimeType.startsWith("image/") ? "inline" : "attachment"
      ),
      CacheControl: CACHE_CONTROL,
    })
  );

  const updated = await prisma.media.update({
    where: { id },
    data: { mimeType: config.mimeType, size: file.size },
  });

  try {
    await (prisma as any).auditLog.create({
      data: {
        userId: session.user.id,
        userEmail: session.user.email ?? "",
        action: "UPDATE",
        entityType: "MEDIA",
        entityId: media.id,
        entityTitle: media.filename,
      },
    });
  } catch {}

  return NextResponse.json(updated);
}
