// La copy de los tres drafts EX — DRAFT.
//
// Módulo puro, sin JSX. Lo que hay acá es de relleno a propósito: estas tres
// páginas existen para decidir FONDO y COMPOSICIÓN, no texto. Las tres dicen lo
// mismo para que la comparación mida una sola cosa.

export const EX_COPY = {
  lead: "Own your",
  word: "World",

  sub: "Move cross-chain, trade perps, hold RWAs, stay confidential, and access all of DeFi from your own wallet.",

  /** Dos acciones, como en el prototipo de referencia: una primaria y una que no. */
  actions: [
    { label: "Start Developing", href: "#", primary: true },
    { label: "Learn More", href: "#", primary: false },
  ],

  /** El clip de ab7, en loop. Mismo asset — no se duplica nada. */
  video: "/prototype/v2/hero-descent-v2.mp4",
  poster: "/prototype/v2/hero-descent-v2-poster.jpg",

  /** Lo que se ve por el agujero de la «o». Placeholder. */
  next: {
    kicker: "Sección 02 · placeholder",
    title: "Lo que aparece por dentro de la O.",
    body: "Draft. Este bloque existe para ver la transición con algo que ocupe espacio real: un kicker, un titular de dos renglones y un párrafo. El contenido definitivo se decide después.",
  },
} as const;
