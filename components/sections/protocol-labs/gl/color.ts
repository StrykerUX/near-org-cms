// `#rrggbb` a los tres floats 0..1 que espera un uniforme `vec3`.
//
// ── Por qué vive acá y no dentro de `GlSurface` ───────────────────────────
//
// Nació ahí, que es donde se usa, pero `GlSurface` lleva `"use client"` — y esta
// función se llama al ARMAR la tabla de uniformes, que es trabajo de quien monta
// el hero. Cuando ese sitio es un server component, importarla desde un módulo
// de cliente revienta el build con un error que no menciona el color por ningún
// lado:
//
//   Attempted to call hexToRgb() from the server but hexToRgb is on the client.
//
// Es aritmética pura y no tiene nada de cliente. Acá la puede llamar cualquiera.
// `GlSurface` la re-exporta para que los imports que ya existían sigan
// funcionando.
export function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}
