import { createHmac, timingSafeEqual, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { REVIEW_COOKIE_NAME } from "@/lib/review-cookies";

// Acceso al modo revisión: quién puede ver el widget de comentarios y escribir
// en /api/siteping.
//
// El problema que resuelve: el equipo que revisa el sitio NO es técnico y no
// tiene cuenta en ningún lado. Pedirles registro es garantizar que no lo usen.
// Pero el widget no puede estar abierto a cualquier visitante, o se llena de
// ruido y las notas internas quedan a la vista.
//
// La solución es la misma que el CMS ya usa para compartir borradores
// (`Post.previewToken`): un link con un token. Se abre una vez
// —`/review?token=…`— y a partir de ahí una cookie firmada mantiene el modo
// revisión activo en todo el sitio. Sin cuentas, sin instalar nada.
//
// El token es autocontenido (`<expiración>.<firma HMAC>`) y NO se guarda en la
// base: se verifica recalculando la firma. Eso evita una tabla y una consulta
// por request, a cambio de no poder revocar un token individual antes de que
// expire — para eso se rota `REVIEW_ACCESS_SECRET`, que invalida todos a la vez.

const SECRET = process.env.REVIEW_ACCESS_SECRET;
const DEFAULT_TTL_DAYS = 30;

// Los nombres viven en `lib/review-cookies.ts` (módulo sin dependencias de
// servidor) porque el widget de cliente los necesita y este archivo importa
// `node:crypto`. Se re-exportan para que el código de servidor tenga un solo
// sitio del que tirar.
export { REVIEW_COOKIE_NAME, REVIEW_UI_COOKIE_NAME } from "@/lib/review-cookies";

/**
 * En producción la falta del secreto es un error de configuración, no un modo
 * degradado: sin él, `createReviewToken` firmaría con una clave vacía y
 * cualquiera podría fabricar un token. Preferimos que el modo revisión no
 * exista a que exista abierto.
 */
function requireSecret(): string {
  if (!SECRET) {
    throw new Error(
      "REVIEW_ACCESS_SECRET no está configurado — el modo revisión no puede firmar tokens.",
    );
  }
  return SECRET;
}

function sign(payload: string): string {
  return createHmac("sha256", requireSecret()).update(payload).digest("base64url");
}

/**
 * Genera un token de revisión válido por `ttlDays`. El `nonce` no aporta
 * seguridad —la firma ya la da el HMAC— pero hace que dos links emitidos el
 * mismo día sean distintos, lo que permite distinguirlos en un log.
 */
export function createReviewToken(ttlDays: number = DEFAULT_TTL_DAYS): string {
  const expiresAt = Date.now() + ttlDays * 24 * 60 * 60 * 1000;
  const nonce = randomBytes(6).toString("base64url");
  const payload = `${expiresAt}.${nonce}`;
  return `${payload}.${sign(payload)}`;
}

/**
 * Verifica firma y expiración. Devuelve `false` ante cualquier anomalía en vez
 * de lanzar: la llaman rutas públicas y un token malformado es un caso normal,
 * no un fallo del servidor.
 */
export function verifyReviewToken(token: string | undefined | null): boolean {
  if (!token || !SECRET) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [expiresAtRaw, nonce, signature] = parts;
  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;

  let expected: string;
  try {
    expected = sign(`${expiresAtRaw}.${nonce}`);
  } catch {
    return false;
  }

  // timingSafeEqual exige buffers del mismo largo, y lanza si no lo son — de
  // ahí el guard previo en vez de un try/catch alrededor.
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;

  return timingSafeEqual(a, b);
}

/** Lee la cookie de revisión del request actual. Solo servidor. */
export async function hasReviewAccess(): Promise<boolean> {
  const store = await cookies();
  return verifyReviewToken(store.get(REVIEW_COOKIE_NAME)?.value);
}

/**
 * Opciones de la cookie. `httpOnly` porque nada del cliente necesita LEER el
 * token —el servidor decide si el widget se monta— y así un XSS no puede
 * exfiltrarlo. `sameSite: lax` para que el link funcione llegando desde Slack.
 */
export function reviewCookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

/** Segundos que le quedan de vida a un token, para alinear la cookie con él. */
export function tokenRemainingSeconds(token: string): number {
  const expiresAt = Number(token.split(".")[0]);
  if (!Number.isFinite(expiresAt)) return 0;
  return Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
}
