import { NextResponse } from "next/server";
import { auth } from "@near/cms-core/lib/auth";
import {
  REVIEW_COOKIE_NAME,
  REVIEW_UI_COOKIE_NAME,
  createReviewToken,
  reviewCookieOptions,
  tokenRemainingSeconds,
} from "@/lib/review-access";

// Activa el modo revisión en el navegador de quien ya tiene sesión de admin.
//
// Sin esto, "Abrir en la página" desde el inbox lleva a la página pero sin
// widget: el admin nunca abrió un link `/review?token=…`, así que no tiene la
// cookie. Es el caso más común de todos —quien revisa el feedback es
// justamente quien lo va a ir a mirar— y desde el inbox parece que el sistema
// está roto.
//
// No es un privilegio nuevo: quien tiene sesión de admin ya puede EMITIR links
// de revisión desde esa misma pantalla. Dárselo a sí mismo no le concede nada
// que no pudiera hacer en dos clics.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = createReviewToken();
  const maxAge = tokenRemainingSeconds(token);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(REVIEW_COOKIE_NAME, token, reviewCookieOptions(maxAge));
  response.cookies.set(REVIEW_UI_COOKIE_NAME, "1", {
    ...reviewCookieOptions(maxAge),
    httpOnly: false,
  });
  return response;
}
