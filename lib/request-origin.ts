// Origen público del request, visto desde el navegador.
//
// No se puede usar `new URL(request.url).origin`: detrás de un proxy inverso
// eso devuelve el host y puerto INTERNOS donde escucha Next, no la URL por la
// que entró el usuario. Con portless en local, `nearorg.localhost:1355` llega a
// Next como `localhost:4921`, así que un redirect construido con `url.origin`
// saca a la persona del dominio en el que estaba — y la cookie que acompaña al
// redirect queda guardada en el dominio equivocado, con lo que el modo revisión
// nunca se activa. Lo mismo pasaría en Railway.
//
// El orden es el estándar: `x-forwarded-*` manda cuando hay proxy, y el resto
// es fallback para cuando se sirve directo.

type HeaderReader = { get(name: string): string | null };

/** Primer valor de una cabecera que puede venir como lista (`a, b, c`). */
function first(value: string | null): string | null {
  if (!value) return null;
  const head = value.split(",")[0]?.trim();
  return head || null;
}

function isLocalHostname(host: string): boolean {
  const hostname = host.split(":")[0].toLowerCase();
  return (
    hostname === "localhost" ||
    // portless sirve subdominios `*.localhost` por HTTP; darles https rompe el
    // link con ERR_SSL_PROTOCOL_ERROR.
    hostname.endsWith(".localhost") ||
    hostname === "127.0.0.1" ||
    hostname === "[::1]"
  );
}

export function resolveRequestOrigin(headers: HeaderReader): string | null {
  const host = first(headers.get("x-forwarded-host")) ?? first(headers.get("host"));
  if (!host) return null;

  const forwardedProto = first(headers.get("x-forwarded-proto"));
  const protocol = forwardedProto ?? (isLocalHostname(host) ? "http" : "https");

  return `${protocol}://${host}`;
}
