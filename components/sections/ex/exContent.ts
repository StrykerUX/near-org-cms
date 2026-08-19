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

  /** Lo que se ve por el agujero de la «o». */
  next: {
    body: "NEAR is open infrastructure powering the agent economy. Quantum-resistant and confidential by design, NEAR empowers you to trade anything anywhere and own your intelligence.",

    /**
     * Las palabras que el tratamiento `read` enciende en verde. Se comparan
     * normalizadas (minúsculas, sin puntuación) contra cada palabra del
     * párrafo, así que el orden acá no importa y la copy se puede reescribir
     * sin tocar índices.
     */
    accents: [
      "quantum-resistant",
      "confidential",
      "own",
      "your",
      "intelligence",
    ],
  },
} as const;
