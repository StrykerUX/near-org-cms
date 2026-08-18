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
  /** Cuánto scroll consume, en palabras del lector: "100svh · sin sticky". */
  readonly travel: string;
  /** Qué hace la versión y qué mirar. */
  readonly pitch: string;
};

export const PROOF_ALTS: readonly ProofSpec[] = [
  {
    id: "ledger",
    index: "01",
    title: "Ledger",
    stack: "CSS + GSAP",
    travel: "100svh · sin sticky",
    pitch:
      "La grilla de la referencia, dibujada: las reglas punteadas se trazan de un extremo al otro y los dígitos aterrizan girando, como un odómetro. Las dos cifras SIN dígitos se revelan con máscara — la asimetría de los datos queda a la vista en vez de disimularse.",
  },
  {
    id: "ticker",
    index: "02",
    title: "Ticker",
    stack: "DOM + GSAP",
    travel: "100svh · sin sticky",
    pitch:
      "Una cinta horizontal infinita con las seis cifras. No avanza con el reloj: avanza con la VELOCIDAD del scroll de la página, y se frena sola cuando el lector suelta. El hover detiene la cinta y abre el cuerpo de esa cifra.",
  },
  {
    id: "solari",
    index: "03",
    title: "Solari",
    stack: "DOM + GSAP",
    travel: "100svh · sin sticky",
    pitch:
      "Un tablero de aeropuerto: un solo dato en pantalla y los caracteres girando hasta la cifra siguiente. Ciclo automático con pausa al hover, y seis teclas para saltar a mano.",
  },
  {
    id: "dial",
    index: "04",
    title: "Dial",
    stack: "SVG animado",
    travel: "100svh · sin sticky",
    pitch:
      "Seis arcos concéntricos que se dibujan al entrar. Cada arco es una prueba; el que está activo se ilumina y su cifra ocupa el centro. Se recorre con el puntero, no con el scroll.",
  },
  {
    id: "rail",
    index: "05",
    title: "Rail",
    stack: "DOM + GSAP · sticky",
    travel: "200svh · horizontal",
    pitch:
      "Lo contrario de todos los demás: el scroll vertical se convierte en recorrido HORIZONTAL y las seis pruebas pasan de lado. Es el único que consume recorrido de verdad, y está para tener con qué comparar.",
  },
  {
    id: "plotter",
    index: "06",
    title: "Plotter",
    stack: "Canvas 2D",
    travel: "100svh · sin sticky",
    pitch:
      "Un registrador de aguja: una traza recorre el ancho de la sección y marca seis hitos. La aguja sigue al puntero; el hito bajo la aguja levanta su ficha.",
  },
  {
    id: "prism",
    index: "07",
    title: "Prism",
    stack: "WebGL2 · shader propio",
    travel: "100svh · sin sticky",
    pitch:
      "La grilla sobre un campo de interferencia. El shader no anima solo: cada celda que el puntero toca inyecta energía en SU región y el campo la propaga a las vecinas.",
  },
  {
    id: "deck",
    index: "08",
    title: "Deck",
    stack: "DOM + GSAP · drag",
    travel: "100svh · sin sticky",
    pitch:
      "Seis cartas apiladas que se hojean con el puntero: arrastrar o hacer clic manda la de arriba al fondo. El scroll no participa — es una sección con la que se JUEGA.",
  },
  {
    id: "bento",
    index: "09",
    title: "Bento",
    stack: "CSS grid + GSAP",
    travel: "100svh · sin sticky",
    pitch:
      "Mosaico asimétrico: las seis cifras conviven con pesos distintos y la celda enfocada se expande empujando a las demás. La animación es del LAYOUT, no de los elementos.",
  },
  {
    id: "verso",
    index: "10",
    title: "Verso",
    stack: "SplitText + GSAP · sticky",
    travel: "150svh · sticky corto",
    pitch:
      "Un párrafo editorial con las seis cifras adentro. Al avanzar, cada cifra se desprende del párrafo y se archiva en la columna de la derecha; al final el párrafo queda hueco y la columna llena.",
  },
];
