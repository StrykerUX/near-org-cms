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
    /**
     * En segmentos y no en un string porque el párrafo mezcla las dos fuentes:
     * los tramos con `em` van en la serif del cartel. La mezcla es la misma
     * pareja del titular —«OWN YOUR» sans, «World» serif— traída al cuerpo del
     * texto, así que el párrafo se lee como parte de la misma frase y no como
     * un bloque aparte.
     *
     * Qué va en serif: los tramos CONCEPTUALES. Lo que la marca promete va en
     * la voz del cartel; lo técnico se queda en la sans.
     */
    body: [
      { text: "NEAR is open infrastructure powering " },
      { text: "the agent economy", em: true },
      { text: ". Quantum-resistant and " },
      { text: "confidential", em: true },
      { text: " by design, NEAR empowers you to trade anything anywhere and " },
      { text: "own your intelligence", em: true },
      { text: "." },
    ],

    /**
     * Las palabras que el tratamiento `read` enciende en verde. Se comparan
     * normalizadas (minúsculas, sin puntuación) contra cada palabra del
     * párrafo, así que el orden acá no importa y la copy se puede reescribir
     * sin tocar índices.
     *
     * Una sola: el verde y la serif son DOS señales, y puestas encima de las
     * mismas palabras se anulan. La serif marca lo conceptual; el verde, el
     * término de producto.
     */
    accents: ["quantum-resistant"],
  },
} as const;
