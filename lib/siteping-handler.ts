import { createSitepingHandler } from "@siteping/adapter-prisma";
import { prisma } from "@near/cms-core/lib/prisma";
import { createR2ScreenshotStorage } from "@/lib/siteping-screenshots";

// Instancia única del handler de SitePing, compartida por las dos rutas que lo
// exponen: `/api/siteping` (el widget, con cookie de revisión) y
// `/api/admin/siteping` (el inbox, con sesión de NextAuth).
//
// ── Por qué el reparto de permisos es este ───────────────────────────────────
// `publicEndpoints` deja GET y POST sin exigir Bearer, pero eso NO los abre al
// mundo: nadie llega al handler sin pasar antes por el gate de su ruta. El
// beneficio de no inyectar la key en el camino del widget es que SitePing
// aplica su redacción —`authorEmail` en blanco— en las respuestas de GET. Si
// firmáramos también ese tramo, cualquiera con link de revisión podría leer los
// emails de todo el equipo, y no los necesita para nada.
//
// PATCH y DELETE quedan fuera de la lista: cambiar estados y borrar exige la
// key, y la key solo la pone el servidor después de validar la sesión de admin.

const apiKey = process.env.SITEPING_API_KEY;

export const sitepingHandler = createSitepingHandler({
  prisma,
  apiKey,
  publicEndpoints: ["OPTIONS", "GET", "POST"],
  screenshotStorage: createR2ScreenshotStorage(),
});

/**
 * Clona el request añadiendo el Bearer. Los `Headers` de un `Request` son
 * inmutables, así que hay que reconstruirlo entero.
 *
 * El body se materializa a `ArrayBuffer` en vez de reenviar el stream porque
 * `new Request(url, { body: stream })` exige `duplex: "half"` y no está
 * soportado de forma uniforme; las cargas acá son un JSON pequeño, así que
 * bufferizar no cuesta nada.
 */
export async function withApiKey(request: Request): Promise<Request> {
  if (!apiKey) return request;

  const headers = new Headers(request.headers);
  headers.set("authorization", `Bearer ${apiKey}`);

  const method = request.method.toUpperCase();
  const hasBody = method !== "GET" && method !== "HEAD" && method !== "OPTIONS";

  return new Request(request.url, {
    method: request.method,
    headers,
    body: hasBody ? await request.arrayBuffer() : undefined,
  });
}
