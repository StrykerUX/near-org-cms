// La copy de /prototype/proof-alt, fuera de los componentes que la pintan.
//
// Mismo criterio de módulo puro que `hero-alt/heroAltContent.ts` y
// `home-ab7/homeAb7Content.ts`: strings y arrays `readonly`, sin JSX, sin nada
// que no sobreviva un JSON.stringify. Las diez versiones montan ESTOS datos y
// nada más — si cada una trajera su propia copy, la comparación mediría dos
// cosas a la vez.
//
// El origen es la tabla de seis pruebas del rediseño (la grilla 3×2 con las
// reglas punteadas), no los cinco pasos de `PROOF_STEPS` de home-ab7. Son otros
// datos: cambia el número de items, cambian las cifras y cambian los rótulos.

export type ProofStat = {
  readonly id: string;
  /** El rótulo de arriba: "Built to last". */
  readonly eyebrow: string;
  /**
   * La cifra viene partida en DOS tramos porque así está diseñada: el primero
   * en tinta, el segundo en verde.
   *
   * El corte es ÓPTICO, no semántico, y en dos de los seis cae a mitad de
   * palabra ("Confi" + "dential"). Es deliberado y sale de la referencia: lo
   * que la grilla hace es teñir el final del renglón, no separar dato de
   * unidad. Por eso son `value`/`accent` y no `number`/`unit` — nombrarlos así
   * prometería una semántica que estos datos no tienen.
   */
  readonly value: string;
  readonly accent: string;
  /** La cifra entera como texto plano: para `aria-label` y para los canvas. */
  readonly plain: string;
  /** Versión corta, para carriles, diales y cualquier sitio sin ancho. */
  readonly short: string;
  readonly body: string;
  /**
   * El número al que sube un contador, o `null` si la cifra no es numérica.
   * Cuatro de las seis lo son; las dos que no ("Quantum-ready",
   * "Confidential") NO deben inventarse un número para uniformar — una versión
   * con contadores tiene que resolver a mano qué hace con esas dos, y esa
   * decisión es parte de lo que se está evaluando.
   */
  readonly count: number | null;
};

export const PROOF_STATS: readonly ProofStat[] = [
  {
    id: "uptime",
    eyebrow: "Built to last",
    value: "100% ",
    accent: "uptime",
    plain: "100% uptime",
    short: "100%",
    body: "NEAR has run for more than five years on mainnet without a single outage. Every network upgrade has shipped without downtime.",
    count: 100,
  },
  {
    id: "tps",
    eyebrow: "Built to scale",
    value: "1 Million ",
    accent: "TPS",
    plain: "1 Million TPS",
    short: "1M TPS",
    body: "NEAR's architecture handles over a million transactions per second on consumer-grade hardware and scales automatically through dynamic resharding.",
    count: 1,
  },
  {
    id: "volume",
    eyebrow: "Built to connect",
    value: "$24 + ",
    accent: "Billion",
    plain: "$24+ Billion",
    short: "$24B",
    body: "More than $24 billion in cross-chain volume has settled through NEAR Intents. Swaps clear in seconds for less than a cent, with no manual bridging required.",
    count: 24,
  },
  {
    id: "chains",
    eyebrow: "Built to reach",
    value: "30 + ",
    accent: "Blockchains",
    plain: "30+ Blockchains",
    short: "30+",
    body: "A single integration reaches Bitcoin, Ethereum, Solana, and more than thirty other chains. Transactions execute natively, so users never hold a wrapped asset.",
    count: 30,
  },
  {
    id: "quantum",
    eyebrow: "Built to resist",
    value: "Quantum-",
    accent: "ready",
    plain: "Quantum-ready",
    short: "PQ",
    body: "NEAR is one of the first blockchains to add a NIST-approved post-quantum signature scheme in production.",
    count: null,
  },
  {
    id: "privacy",
    eyebrow: "Built to privacy",
    value: "Confi",
    accent: "dential",
    plain: "Confidential",
    short: "TEE",
    body: "Trades settle inside a private shard and AI workloads run inside encrypted enclaves, where no operator or outside observer can see them.",
    count: null,
  },
];

// El rótulo de cada versión, para el divider y el índice de la página.
export type ProofSpec = {
  readonly id: string;
  readonly index: string;
  readonly title: string;
  readonly stack: string;
  /** Cuánto scroll consume, en palabras del lector. */
  readonly travel: string;
  /** Qué hace la versión y qué mirar. */
  readonly pitch: string;
};

// ── La ronda que quedó ──────────────────────────────────────────────────────
//
// Hubo dos antes. La primera fueron diez versiones que barrían el espacio de
// soluciones (tablero Solari, dial, carril horizontal, plotter, cartas
// hojeables…): siete escondían cinco de las seis pruebas detrás de un gesto, y
// esta sección tiene que entregar las seis sin que nadie toque nada. La segunda
// fueron tres sobre una composición asimétrica común, y se descartaron enteras.
// Viven en los commits `b145ca6` y `b566b04`.
//
// Estas tres nacieron como bocetos en un canvas de diseño y se eligieron ahí
// antes de escribir una línea de código, que es la razón de que las tres sean
// estructuras y no efectos.
//
// Lo que las tres cumplen, y ya no se discute:
//
//   · las seis cifras visibles a la vez, desde el primer frame;
//   · nada depende del puntero — el hover puede AÑADIR, nunca revelar;
//   · light mode: la sección entra después del negro de NEAR Stack y entrega al
//     stone de la newsletter, así que el blanco es el contraste de la página;
//   · el cuerpo completo de las seis, sin recortar;
//   · una pantalla de alto y CERO recorrido extra;
//   · un plan propio por debajo de 1024px — no una degradación automática.
//
// Lo que cambia entre las tres es la ESTRUCTURA, no el mecanismo. Las tres
// entran una vez, al aparecer, y se quedan quietas.
export const PROOF_ALTS: readonly ProofSpec[] = [
  {
    id: "datum",
    index: "B",
    title: "Datum",
    stack: "DOM + GSAP",
    travel: "100svh · la más baja de las tres",
    pitch:
      "Un eje cruza el ancho y las seis pruebas cuelgan de él, alternando arriba y abajo. La que menos estorba: le sobra alto en cualquier pantalla. A cambio, seis columnas de un sexto del ancho dejan la cifra a escala de h2 y con quiebre en casi todas. En móvil el eje GIRA: la línea pasa a vertical y las fichas cuelgan de ella.",
  },
  {
    id: "index",
    index: "C",
    title: "Index",
    stack: "DOM + GSAP",
    travel: "100svh · seis filas en una pantalla",
    pitch:
      "Seis renglones de un documento: número, rótulo, cifra, cuerpo, y una regla de borde a borde entre cada uno. La única en la que las seis cifras están alineadas entre sí, así que se COMPARAN. La más legible y la menos memorable — se parece a una tabla porque lo es.",
  },
  {
    id: "columns",
    index: "D",
    title: "Columns",
    stack: "DOM + GSAP",
    travel: "100svh · seis columnas de alto completo",
    pitch:
      "Las cifras escritas en vertical ocupan la columna entera; el cuerpo queda al pie, horizontal. La más gráfica: se lee como una sola pieza antes de leer una palabra. El precio es que una cifra en vertical cuesta un instante más. En móvil la cifra vuelve a acostarse y la sección cae a seis bloques apilados.",
  },
];
