export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { CopyObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { auth } from "@cms/lib/auth";
import { prisma } from "@cms/lib/prisma";
import { createS3Client } from "@cms/lib/s3";
import { contentDispositionHeader, CACHE_CONTROL } from "@cms/lib/upload-types";
import { isValidSlugFormat } from "@cms/lib/utils";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { filename, alt, slug } = await req.json();

  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let normalizedSlug: string | null | undefined = undefined;
  if (slug !== undefined) {
    normalizedSlug = typeof slug === "string" ? slug.trim().toLowerCase() : null;
    if (normalizedSlug) {
      if (!isValidSlugFormat(normalizedSlug)) {
        return NextResponse.json(
          { error: "Slug must contain only lowercase letters, numbers, and hyphens" },
          { status: 400 }
        );
      }
      const clash = await prisma.media.findUnique({ where: { slug: normalizedSlug } });
      if (clash && clash.id !== id) {
        return NextResponse.json({ error: "This URL is already taken" }, { status: 400 });
      }
    } else {
      normalizedSlug = null;
    }
  }

  const updated = await prisma.media.update({
    where: { id },
    data: {
      ...(filename !== undefined && { filename }),
      ...(alt !== undefined && { alt }),
      ...(normalizedSlug !== undefined && { slug: normalizedSlug }),
    },
  });

  let r2SyncFailed = false;
  if (filename !== undefined && filename !== media.filename) {
    const key = media.url.replace(`${process.env.R2_PUBLIC_URL}/`, "");
    const s3 = createS3Client();
    try {
      await s3.send(
        new CopyObjectCommand({
          Bucket: process.env.S3_BUCKET,
          Key: key,
          CopySource: `${process.env.S3_BUCKET}/${encodeURIComponent(key)}`,
          MetadataDirective: "REPLACE",
          ContentType: media.mimeType,
          ContentDisposition: contentDispositionHeader(
            filename,
            media.mimeType.startsWith("image/") ? "inline" : "attachment"
          ),
          CacheControl: CACHE_CONTROL,
        })
      );
    } catch (e) {
      console.error("Failed to sync renamed filename to R2 object metadata", e);
      r2SyncFailed = true;
    }
  }

  return NextResponse.json({ ...updated, ...(r2SyncFailed && { r2SyncFailed: true }) });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const key = media.url.replace(`${process.env.R2_PUBLIC_URL}/`, "");
  const s3 = createS3Client();
  await s3.send(
    new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
    })
  );

  await prisma.media.delete({ where: { id } });

  try {
    await (prisma as any).auditLog.create({
      data: {
        userId: session.user.id,
        userEmail: session.user.email ?? "",
        action: "DELETE",
        entityType: "MEDIA",
        entityId: media.id,
        entityTitle: media.filename,
      },
    });
  } catch {}

  return NextResponse.json({ success: true });
}
