import { NextResponse } from "next/server";
import { auth } from "@near/cms-core/lib/auth";
import {
  hasSitepingApiKey,
  sitepingHandler,
  withApiKey,
} from "@/lib/siteping-handler";

// Endpoint del inbox de admin. Existe por una razón concreta: cambiar el estado
// de un comentario o borrarlo exige `Authorization: Bearer <SITEPING_API_KEY>`,
// y esa key no puede viajar al navegador — `SitepingInbox` es un componente de
// cliente, así que cualquiera con las devtools abiertas la leería y tendría
// permiso de borrado sobre toda la base de feedback.
//
// La ruta valida la sesión de NextAuth y recién entonces firma la petición del
// lado del servidor. El inbox nunca ve la key.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// VIEWER puede mirar el feedback pero no resolverlo ni borrarlo, igual que con
// los posts. ADMIN y EDITOR sí.
const WRITE_ROLES = new Set(["ADMIN", "EDITOR"]);

async function requireSession(write: boolean) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (write && !WRITE_ROLES.has(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  // Sin key no hay operación destructiva. El 401 lo ponía el adapter, pero
  // exigírselo lo hace lanzar al construirse en producción y eso tumba el
  // build; el detalle está en `lib/siteping-handler.ts`. La respuesta que ve
  // el inbox es la misma de siempre.
  if (write && !hasSitepingApiKey) {
    return NextResponse.json(
      { error: "apiKey required for destructive operations" },
      { status: 401 },
    );
  }
  return null;
}

export async function GET(request: Request) {
  const denied = await requireSession(false);
  if (denied) return denied;
  return sitepingHandler.GET(await withApiKey(request));
}

export async function PATCH(request: Request) {
  const denied = await requireSession(true);
  if (denied) return denied;
  return sitepingHandler.PATCH(await withApiKey(request));
}

export async function DELETE(request: Request) {
  const denied = await requireSession(true);
  if (denied) return denied;
  return sitepingHandler.DELETE(await withApiKey(request));
}
