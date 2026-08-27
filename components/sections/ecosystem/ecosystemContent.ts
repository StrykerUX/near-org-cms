// Copy for /ecosystem.
//
// Same contract as the other content modules: pure strings and arrays of
// objects, no JSX, no `Date`, no functions.
//
// ── Por qué existe esta página ─────────────────────────────────────────────
//
// (Comentario en español, a diferencia del resto de la carpeta: esto es una nota
// de proceso y no documentación de la página.)
//
// La página de la Foundation cierra invitando a «Explore the ecosystem» y ese
// link apuntaba a `/ecosystem`, que era un 404. Se dejó la URL correcta escrita
// a propósito —un link correcto que todavía no resuelve se arregla creando la
// página; uno desviado a una ruta parecida hay que acordarse de volver a
// apuntar— y esto es cumplir esa promesa.
//
// ── Qué es real y qué está declarado ──────────────────────────────────────
//
// Real: el titular y el cuerpo salen textuales de `foundationContent.ECOSYSTEM`,
// que es lo que la Foundation ya dice sobre su ecosistema, y las doce marcas son
// las mismas doce, con sus cinco logos servidos.
//
// Declarado: los tres grupos del directorio y el bloque de cierre. Nadie me pasó
// un deck de esta página, así que lo que no se podía derivar está escrito como
// lo que es —una estructura propuesta— y marcado acá arriba en vez de disimulado
// adentro de un componente. La clasificación de cada proyecto es la parte más
// frágil y necesita revisión de alguien del ecosistema antes de publicar.

/** Las doce marcas las sigue declarando la Foundation, que es de donde salieron. */
export { ECOSYSTEM_MARKS } from "@/components/sections/foundation/foundationContent";

export const META = {
  title: "Ecosystem",
  description:
    "Hundreds of applications, wallets, and protocols build on NEAR. The builders own what they make.",
} as const;

/** §1 — el hero. Textual de `foundationContent.ECOSYSTEM`. */
export const HERO = {
  eyebrow: "The ecosystem",
  headline: "Built by an ecosystem, not a company",
  body: "Hundreds of applications, wallets, and protocols build on NEAR. The Foundation supports the ecosystem that builds them. The builders own what they make.",
} as const;

/**
 * §2 — el directorio.
 *
 * ⚠ ESTRUCTURA PROPUESTA. Los tres grupos y la asignación de cada proyecto son
 * una clasificación mía, no un dato que me hayan dado. Sirve para que el
 * directorio no sea una bolsa de doce logos sueltos, y necesita que alguien del
 * ecosistema la confirme: un proyecto en la categoría equivocada es un error que
 * el proyecto nota antes que nadie.
 */
export const DIRECTORY = {
  eyebrow: "Directory",
  headline: "Who builds here",
  note: "Proposed grouping — to be confirmed with the ecosystem team.",
  groups: [
    {
      id: "money",
      title: "Move and hold value",
      body: "Exchanges, lending, and the rails that carry assets between chains.",
      members: ["ref-finance", "burrow", "rainbow-bridge", "aurora"],
    },
    {
      id: "accounts",
      title: "Accounts and access",
      body: "Wallets and the hardware that keeps keys out of reach.",
      members: ["meteor-wallet", "ledger", "brave"],
    },
    {
      id: "apps",
      title: "Things people use",
      body: "Consumer applications, marketplaces, and the products built on top.",
      members: ["mintbase", "sweat-economy", "venice", "abound", "zodl"],
    },
  ],
} as const;

/** §3 — el cierre. ⚠ Copy propuesta: no salió de ningún deck. */
export const CLOSING = {
  headline: "Build the next one",
  body: "The protocol is open, the docs are public, and the Foundation funds the people who ship. Nothing here needed permission.",
  primary: { label: "Read the docs", href: "https://docs.near.org" },
  secondary: { label: "Talk to the Foundation", href: "/contact-us" },
} as const;

/**
 * El terreno de esta página.
 *
 * Petróleo frío, y la elección es por descarte: las otras cuatro páginas con
 * este shader ya tomaron papel de archivo, albaricoque, verde y azul mineral.
 * Un quinto terreno que se confunda con alguno de esos rompe lo único que hace
 * que las superficies se distingan de un vistazo cuando se las compara en
 * pestañas distintas.
 */
export const GROUND = {
  palette: { bg: "#00dc8d", high: "#00dc8d", line: "#00dc8d" },
  bands: 8,
  scale: 1.9,
  tilt: 0.45,
} as const;
