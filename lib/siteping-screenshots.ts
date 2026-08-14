import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import type { ScreenshotStorage } from "@siteping/adapter-prisma";
import { createS3Client } from "@near/cms-core/lib/s3";

// Las capturas del widget van a R2, no a Postgres.
//
// Por defecto SitePing guarda el JPEG como data URL en la columna
// `screenshotUrl`. Con el tope de 1.5 MB por captura, unas pocas decenas de
// comentarios pesarían más que todo el resto del CMS junto, y cada consulta al
// inbox arrastraría esos blobs. R2 ya está configurado para el media del CMS,
// así que reusamos el mismo bucket.

const KEY_PREFIX = "siteping";

/**
 * `feedbackId` llega del cliente (es el `clientId` que genera el widget, porque
 * el registro todavía no existe cuando se sube la imagen), así que se trata
 * como entrada hostil: si se interpolara crudo, un id con `../` podría escribir
 * fuera del prefijo. Se reduce al alfabeto de un cuid y se acota el largo.
 */
function safeKeySegment(raw: string): string {
  const cleaned = raw.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 64);
  return cleaned || "unknown";
}

function extensionFor(mimeType: string): string {
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  return "jpg";
}

export function createR2ScreenshotStorage(): ScreenshotStorage | undefined {
  const bucket = process.env.S3_BUCKET;
  const publicUrl = process.env.R2_PUBLIC_URL;

  // Sin bucket o sin URL pública no hay dónde subir ni cómo servir la imagen.
  // Devolvemos `undefined` en vez de lanzar: SitePing cae solo a data URLs, que
  // es peor pero deja el feedback funcionando. Perder un comentario del equipo
  // por una env var faltante sería mucho peor que una captura pesada.
  if (!bucket || !publicUrl) return undefined;

  const client = createS3Client();
  const base = publicUrl.replace(/\/$/, "");

  return {
    async upload(dataUrl, { feedbackId, mimeType }) {
      const base64 = dataUrl.split(",")[1] ?? "";
      const body = Buffer.from(base64, "base64");
      const key = `${KEY_PREFIX}/${safeKeySegment(feedbackId)}.${extensionFor(mimeType)}`;

      await client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: body,
          ContentType: mimeType,
          // Inmutable: la key lleva el id del feedback y una captura nunca se
          // reescribe, así que el navegador puede quedársela para siempre.
          CacheControl: "public, max-age=31536000, immutable",
        }),
      );

      return { url: `${base}/${key}` };
    },

    async delete(url) {
      if (!url.startsWith(`${base}/${KEY_PREFIX}/`)) return;
      const key = url.slice(base.length + 1);
      await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
    },
  };
}
