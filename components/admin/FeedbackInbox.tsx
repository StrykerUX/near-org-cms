"use client";

import { useEffect, useState } from "react";
import { SitepingInbox } from "@siteping/dashboard";
import { Check, Copy } from "lucide-react";
import { REVIEW_UI_COOKIE_NAME } from "@/lib/review-cookies";

// Inbox de comentarios de revisión + el link que se le manda al equipo.
//
// Vive en `components/` de la app y no en `cms-core` a propósito: el CMS es el
// núcleo compartido del fork y no debería enterarse de que existe una
// herramienta de review. Si algún día se retira SitePing, se borran estos
// archivos y `cms-core` no se entera.

export type FeedbackInboxProps = {
  reviewUrl: string;
  projectName: string;
};

function ReviewLink({ reviewUrl }: { reviewUrl: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(reviewUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard falla sin permiso o fuera de https — el input es de solo
      // lectura pero seleccionable, así que siempre queda el copiado a mano.
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-medium text-foreground">Link de revisión</h2>
        <p className="text-sm text-muted-foreground">
          Mandá este link a quien tenga que comentar. Se abre una vez y el modo
          revisión queda activo 30 días en ese navegador — sin cuenta, sin
          instalar nada.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <input
          readOnly
          value={reviewUrl}
          onFocus={(event) => event.currentTarget.select()}
          className="w-full flex-1 rounded-md border border-border bg-background px-3 py-2 font-mono text-xs text-foreground"
        />
        <button
          type="button"
          onClick={copy}
          className="flex shrink-0 items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {copied ? "Copiado" : "Copiar"}
        </button>
      </div>
      <p className="text-xs text-muted-foreground">
        Cada vez que recargás esta página se genera un link nuevo. Los
        anteriores siguen sirviendo hasta que caduquen; para invalidarlos todos
        de golpe hay que rotar <code className="font-mono">REVIEW_ACCESS_SECRET</code>.
      </p>
    </div>
  );
}

/**
 * Le da modo revisión al propio admin, para que "Abrir en la página" lleve a la
 * página CON el widget y con el comentario enfocado.
 *
 * Sin esto el botón parece roto: abre la URL correcta pero sin nada encima,
 * porque quien administra normalmente no abrió un link `/review?token=…`.
 *
 * Solo se pide si la cookie no está: es una escritura, no queremos repetirla en
 * cada visita al inbox.
 */
function useAdminReviewSession() {
  useEffect(() => {
    const active = document.cookie
      .split("; ")
      .some((entry) => entry === `${REVIEW_UI_COOKIE_NAME}=1`);
    if (active) return;

    // Sin `catch` ruidoso: si falla, el inbox sigue siendo perfectamente
    // utilizable y lo único que se pierde es la comodidad del deep link.
    void fetch("/api/admin/review-session", { method: "POST" }).catch(() => {});
  }, []);
}

export default function FeedbackInbox({ reviewUrl, projectName }: FeedbackInboxProps) {
  useAdminReviewSession();

  return (
    <div className="flex flex-col gap-6">
      <ReviewLink reviewUrl={reviewUrl} />

      {/* El endpoint es el proxy de admin, no `/api/siteping`: es el que valida
          la sesión y firma con la API key del lado del servidor. El inbox nunca
          ve la key. */}
      <SitepingInbox
        endpoint="/api/admin/siteping"
        projects={projectName}
        theme="dark"
        locale="es"
        pageSize={25}
      />
    </div>
  );
}
