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

// ── La segunda ronda ────────────────────────────────────────────────────────
//
// La primera fueron diez versiones que barrían todo el espacio de soluciones
// (tablero Solari, dial, carril horizontal, plotter, cartas hojeables…). Viven
// en el commit `b145ca6` y **se borraron a propósito**: siete de las diez
// escondían cinco de las seis pruebas detrás de un gesto, y esta sección tiene
// que entregar las seis SIN que nadie toque nada.
//
// Las tres que quedan comparten esas reglas, que ya no se discuten:
//
//   · las seis cifras visibles a la vez, desde el primer frame;
//   · nada depende del puntero — el hover puede AÑADIR, nunca revelar;
//   · light mode: entra después del negro de NEAR Stack y entrega al stone de
//     la newsletter, así que el blanco es el contraste de la página;
//   · el cuerpo completo de las seis, sin recortar;
//   · 100svh de alto y CERO recorrido extra, incluida la 03.
//
// Lo único que cambia entre las tres es DE DÓNDE sale el movimiento.
export const PROOF_ALTS: readonly ProofSpec[] = [
  {
    id: "cadence",
    index: "01",
    title: "Cadence",
    stack: "DOM + GSAP",
    travel: "100svh · entra y se queda quieta",
    pitch:
      "Composición asimétrica en doce columnas: las seis cifras no alinean entre sí y dos de ellas mandan sobre las otras cuatro. Al entrar en cuadro se revelan en diagonal, con las reglas trazándose bajo cada una; después la sección no se mueve nunca más.",
  },
  {
    id: "halo",
    index: "02",
    title: "Halo",
    stack: "WebGL2 · shader propio",
    travel: "100svh · una capa de fondo que respira",
    pitch:
      "La misma composición, sobre un campo de curvas de nivel en gris casi blanco que deriva muy despacio. El fondo no compite: nunca pasa de un 4% de contraste, y lo que hace es dar profundidad a un blanco que si no sería plano.",
  },
  {
    id: "staircase",
    index: "03",
    title: "Staircase",
    stack: "DOM + GSAP · scroll",
    travel: "100svh · cero recorrido extra",
    pitch:
      "Las seis arrancan escalonadas en una diagonal pronunciada y el scroll las ENDEREZA mientras la sección cruza el viewport. Conducida por scroll sin gastar un solo píxel de más: no hay sticky ni track, el recorrido es el paso natural de la sección por la pantalla.",
  },
];
