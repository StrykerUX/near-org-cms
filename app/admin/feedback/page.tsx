import type { Metadata } from "next";
import { headers } from "next/headers";
import FeedbackInbox from "@/components/admin/FeedbackInbox";
import { createReviewToken } from "@/lib/review-access";
import { resolveRequestOrigin } from "@/lib/request-origin";
import { SITEPING_PROJECT } from "@/lib/siteping-config";

// Excepción deliberada al patrón de `app/admin/*` (re-exports de una línea a
// `@near/cms-core/pages/admin/…`): SitePing es una herramienta de esta app, no
// del CMS compartido, así que la página vive acá entera. Meterla en `cms-core`
// obligaría al núcleo a depender de `@siteping/dashboard`.
//
// El acceso ya lo cubre `proxy.ts`, que redirige a /admin/login cualquier ruta
// bajo /admin sin sesión.
export const metadata: Metadata = {
  title: "Site Feedback",
};

export const dynamic = "force-dynamic";

export default async function AdminFeedbackPage() {
  // El origen sale de las cabeceras del request y no de `NEXTAUTH_URL`: esa
  // variable apunta al dominio canónico, y quien abre el admin puede estar en
  // otro (preview, o el subdominio local de portless). Un link de revisión
  // hacia otro host llegaría sin cookie y parecería caducado.
  const headerList = await headers();
  const base =
    resolveRequestOrigin(headerList) ?? process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "";
  const token = createReviewToken();
  const reviewUrl = `${base}/review?token=${token}`;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-foreground">Site Feedback</h1>
        <p className="text-sm text-muted-foreground">
          Comments the team left on the site, pinned to the exact element on
          each page.
        </p>
      </div>

      <FeedbackInbox reviewUrl={reviewUrl} projectName={SITEPING_PROJECT} />
    </div>
  );
}
