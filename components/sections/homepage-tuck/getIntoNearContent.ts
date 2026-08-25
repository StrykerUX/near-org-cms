// Las tres puertas de entrada a NEAR, tal como las nombra el artboard.
//
// ── ⚠️ Dos de los tres cuerpos son NUEVOS ───────────────────────────────────
//
// En el artboard las tres filas repiten palabra por palabra la misma frase
// —"Trade, access yield, and go confidential, all from a single near.com
// account."—, que describe la PRIMERA. Es el marcador de posición típico de una
// maqueta: sirve para medir cuántas líneas ocupa el bloque, no para decir qué
// hace cada puerta. Copiarlo tres veces habría dejado dos filas mintiendo.
//
// Así que la primera va verbatim del artboard y las otras dos están escritas
// acá, en el mismo registro y con el mismo largo (una línea larga + una corta,
// que es lo que hace que las tres cajas midan igual). Si marketing tiene la
// copy real, esto se reemplaza y nada más cambia.
//
// TODO(copy): confirmar los cuerpos de `integrate` y `build` con quien
// escribió el de `trade`.
//
// ── Por qué el id es un tipo y no un string ────────────────────────────────
//
// Cada fila lleva su propia rampa de color —quince bandas muestreadas del
// artboard— y esa rampa es presentación, así que vive en `GetIntoNear.tsx` y no
// acá. El puente entre las dos mitades es el `id`, y con `id: string` un cambio
// de nombre en este módulo dejaría a la sección buscando una rampa que no
// existe: sin error de compilación, con la barra en blanco. Como unión cerrada,
// el `Record` de allá deja de tipar en cuanto se agrega, quita o renombra una
// fila.

export type GetIntoRowId = "trade" | "integrate" | "build";

export type GetIntoRow = {
  id: GetIntoRowId;
  /** El nombre de la puerta. Va en una sola línea: la retícula cuenta con eso. */
  label: string;
  /** Dos líneas. La segunda, corta — es lo que le da aire al renglón. */
  body: string;
  href: string;
};

export const GET_INTO_ROWS: readonly GetIntoRow[] = [
  {
    id: "trade",
    label: "Trade on NEAR",
    body: "Trade, access yield, and go confidential, all from a single near.com account.",
    href: "/nearcom",
  },
  {
    id: "integrate",
    label: "Integrate NEAR",
    body: "Add chain abstraction to your product: one account, any chain, no bridges.",
    href: "/chain-abstraction",
  },
  {
    id: "build",
    label: "Build on NEAR",
    body: "Ship on a network that finalizes in a second, for a fraction of a cent.",
    href: "/protocol",
  },
] as const;

export const GET_INTO_TITLE = "Get into NEAR";
