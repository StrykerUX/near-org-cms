import type { Metadata } from "next";
import { headers } from "next/headers";
import FeedbackInbox from "@/components/admin/FeedbackInbox";
import { createReviewToken } from "@/lib/review-access";
import { SITEPING_PROJECT } from "@/lib/siteping-config";

// Excepción deliberada al patrón de `app/admin/*` (re-exports de una línea a
// `@near/cms-core/pages/admin/…`): SitePing es una herramienta de esta app, no
// del CMS compartido, así que la página vive acá entera. Meterla en `cms-core`
// obligaría al núcleo a depender de `@siteping/dashboard`.
//
// El acceso ya lo cubre `proxy.ts`, que redirige a /admin/login cualquier ruta
// bajo /admin sin sesión.
export const metadata: Metadata = {
  title: "Feedback de revisión",
};

export const dynamic = "force-dynamic";

/**
 * La base sale del header `host` y no de `NEXTAUTH_URL` porque en Railway esa
 * variable apunta al dominio canónico, y quien abre el admin puede estar en el
 * dominio de preview. Un link de revisión hacia otro host llegaría sin cookie
 * y parecería caducado.
 */
async function resolveBaseUrl(): Promise<string> {
  const headerList = await headers();
  const host = headerList.get("host");
  if (!host) return process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "";
  const protocol = host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https";
  return `${protocol}://${host}`;
}

export default async function AdminFeedbackPage() {
  const base = await resolveBaseUrl();
  const token = createReviewToken();
  const reviewUrl = `${base}/review?token=${token}`;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-foreground">Feedback de revisión</h1>
        <p className="text-sm text-muted-foreground">
          Comentarios que el equipo dejó sobre el sitio, anclados al elemento
          exacto de cada página.
        </p>
      </div>

      <FeedbackInbox reviewUrl={reviewUrl} projectName={SITEPING_PROJECT} />
    </div>
  );
}
