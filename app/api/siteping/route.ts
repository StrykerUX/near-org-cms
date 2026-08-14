import { NextResponse } from "next/server";
import { sitepingHandler } from "@/lib/siteping-handler";
import { hasReviewAccess } from "@/lib/review-access";

// Endpoint del widget. Leer y escribir comentarios exige la cookie de revisión.
//
// Esto es lo que impide que el endpoint quede abierto: SitePing deja POST
// público por diseño —su widget corre en contextos sin autenticar— y sobre un
// sitio en producción eso significa que cualquiera que descubra la ruta puede
// escribir en la base. El gate va acá, delante, y no en el handler.
//
// PATCH y DELETE no se exponen en esta ruta a propósito: cambiar el estado de
// un comentario o borrarlo es trabajo del inbox, que vive detrás de la sesión
// de admin en `/api/admin/siteping`.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function forbidden() {
  return NextResponse.json(
    { error: "Modo revisión no activo." },
    { status: 403 },
  );
}

export async function GET(request: Request) {
  if (!(await hasReviewAccess())) return forbidden();
  return sitepingHandler.GET(request);
}

export async function POST(request: Request) {
  if (!(await hasReviewAccess())) return forbidden();
  return sitepingHandler.POST(request);
}

export function OPTIONS(request: Request) {
  return sitepingHandler.OPTIONS(request);
}
