import { NextResponse } from "next/server";
import {
  REVIEW_COOKIE_NAME,
  REVIEW_UI_COOKIE_NAME,
  reviewCookieOptions,
  tokenRemainingSeconds,
  verifyReviewToken,
} from "@/lib/review-access";

// Canje del link de revisión: `/review?token=…&to=/prototype/homepage-v2`.
//
// Es lo único que la persona que revisa tiene que abrir. A partir de acá la
// cookie viaja sola y el widget aparece en todo el sitio, así que el link se
// manda una vez por Slack y no hay que volver a explicarlo.
//
// `runtime = "nodejs"` es obligatorio: la verificación usa `node:crypto`, que
// no existe en el runtime edge.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Solo se acepta un destino relativo. Sin esto, `?to=https://otro-sitio` haría
 * de esta ruta un redirect abierto usable para phishing: el link saldría de un
 * dominio de confianza y aterrizaría en cualquier lado.
 *
 * `//host` y `/\host` también son absolutos para el navegador aunque empiecen
 * con `/`, de ahí que no alcance con comprobar el primer carácter.
 */
function safePath(raw: string | null): string {
  if (!raw) return "/";
  if (!raw.startsWith("/")) return "/";
  if (raw.startsWith("//") || raw.startsWith("/\\")) return "/";
  return raw;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const destination = safePath(url.searchParams.get("to"));

  if (!verifyReviewToken(token)) {
    // 403 y no un redirect: si el link caducó, quien lo abre tiene que
    // enterarse. Un redirect silencioso a la home haría que pareciera que
    // funcionó y que el widget simplemente "no aparece".
    return new NextResponse(
      "Este link de revisión no es válido o ya expiró. Pedí uno nuevo al equipo.",
      { status: 403, headers: { "content-type": "text/plain; charset=utf-8" } },
    );
  }

  const validToken = token as string;
  const maxAge = tokenRemainingSeconds(validToken);

  const response = NextResponse.redirect(new URL(destination, url.origin));
  response.cookies.set(REVIEW_COOKIE_NAME, validToken, reviewCookieOptions(maxAge));
  // Espejo legible por el cliente, para que el widget sepa que tiene que
  // montarse sin obligar al layout a leer cookies. Ver REVIEW_UI_COOKIE_NAME.
  response.cookies.set(REVIEW_UI_COOKIE_NAME, "1", {
    ...reviewCookieOptions(maxAge),
    httpOnly: false,
  });
  return response;
}

/** Salir del modo revisión — útil para comprobar cómo ve la página un visitante. */
export async function DELETE() {
  const response = NextResponse.json({ ok: true }, { status: 200 });
  response.cookies.set(REVIEW_COOKIE_NAME, "", reviewCookieOptions(0));
  response.cookies.set(REVIEW_UI_COOKIE_NAME, "", {
    ...reviewCookieOptions(0),
    httpOnly: false,
  });
  return response;
}
