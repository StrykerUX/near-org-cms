// Las seis pruebas de NEAR, en la forma que pide el ledger.
//
// ── Por qué no reusa `homepage-shared/homepageUpdateContent.ts` ─────────────
//
// El cuerpo de las seis es palabra por palabra el mismo que el de
// `PROOF_STATS`, y aun así este módulo lo repite. El motivo es la FORMA, no el
// texto: allá cada prueba se guarda como `value` + `accent`, dos tramos cuyo
// corte es óptico ("Confi" + "dential") y existe para pintar el segundo en
// verde. Acá la cifra se descompone en tres piezas con roles distintos
// —numeral, signo y glosa— porque el renglón las trata distinto: el numeral
// es la estructura y lo que sigue va a poco más de la mitad de su cuerpo, y
// además cada pieza entra en su propio tiempo.
//
// Importar `PROOF_STATS` y re-partir sus tramos acá acoplaría dos secciones por
// una posición de carácter: cambiar "1 Million " por "1 million " en la que
// comparte rompería el numeral de esta, en silencio y a distancia. Son dos
// tratamientos de la misma prueba, y cada uno guarda la suya.
//
// ── Por qué son dos arrays y no uno con bandera ────────────────────────────
//
// Las cuatro primeras tienen cifra y ocupan un renglón entero; las dos últimas
// no tienen cifra y van en pareja, media caja cada una. Eso no es una variante
// del mismo renglón: es otro layout. Un solo array con `numeral?: string`
// obligaría al componente a preguntar por la ausencia del numeral para decidir
// dónde va la prueba, que es deducir la composición de un dato de copy.

export type LedgerRow = {
  id: string;
  eyebrow: string;
  /**
   * La cifra, como NÚMERO y no como texto.
   *
   * Es un número porque la sección la cuenta: al entrar el renglón, el numeral
   * sube de 0 hasta acá. Guardado como `"100"` habría que parsearlo en el
   * componente para animarlo, y ese parseo se rompe el día que alguien escriba
   * `"1,000"` o `"~30"` — en silencio, porque `parseFloat` devuelve algo.
   */
  value: number;
  /**
   * Cuántos decimales fija el contador, ida y vuelta: es el formato del valor
   * final Y el de cada cuadro intermedio.
   *
   * El de TPS es 1 y no 0 a propósito. Con cero decimales el contador de esa
   * prueba tiene un solo paso visible —de 0 a 1— y no se lee como una cuenta
   * sino como una aparición; el renglón queda fuera de la serie mientras los
   * otros tres suben. Con un decimal, "1.0" cuenta como los demás.
   */
  decimals: number;
  /** Lo que va pegado adelante de la cifra. Solo el `$` del volumen. */
  prefix?: string;
  /** El signo que la califica. Cadena vacía cuando la cifra no lleva ninguno. */
  unit: string;
  /**
   * La palabra que cierra la cifra, en el MISMO renglón y sobre la misma base:
   * «uptime», «Million TPS», «Billion», «Blockchains».
   *
   * Va capitalizada donde nombra una magnitud —Million, Billion— y en minúscula
   * donde nombra la medida («uptime»). No es inconsistencia: es la diferencia
   * entre la escala del número y lo que se contó.
   */
  gloss: string;
  body: string;
};

/**
 * El texto de la cifra a un valor dado — el final, y cada paso del contador.
 *
 * ── Los ceros a la izquierda ────────────────────────────────────────────────
 *
 * La cuenta arranca en `000` y no en `0`, en `$00` y no en `$0`. El motivo es
 * de composición y no de estilo: el numeral mide una fracción del ancho del
 * bloque, o sea que es enorme, y una cifra que crece de un carácter a tres
 * REACOMODA el renglón entero en cada salto — el signo y la glosa, que van
 * pegados a su derecha, se corren dos veces mientras el número sube. Rellenando
 * a la izquierda el ancho es el mismo desde el primer cuadro y lo único que se
 * mueve son los dígitos.
 *
 * El relleno se mide contra el valor FINAL, así que cada renglón lleva los
 * suyos: tres para `100`, dos para `24` y `30`, uno para `1.0`. No es un ancho
 * declarado en ningún lado y por eso no hay nada que mantener sincronizado el
 * día que una prueba cambie de cifra.
 *
 * `at` cae por defecto en el propio valor de la prueba: llamarla con la fila
 * sola devuelve el texto final, que es lo que el servidor renderiza.
 */
export function formatLedgerValue(
  spec: { value: number; decimals: number; prefix?: string },
  at: number = spec.value,
) {
  const width = String(Math.trunc(spec.value)).length;
  const [whole, fraction] = at.toFixed(spec.decimals).split(".");
  return `${spec.prefix ?? ""}${whole.padStart(width, "0")}${
    fraction ? `.${fraction}` : ""
  }`;
}

export const LEDGER_ROWS: readonly LedgerRow[] = [
  {
    id: "uptime",
    eyebrow: "Built to last",
    value: 100,
    decimals: 0,
    unit: "%",
    gloss: "uptime",
    body: "NEAR has run for more than five years on mainnet without a single outage. Every network upgrade has shipped without downtime.",
  },
  {
    id: "tps",
    eyebrow: "Built to scale",
    value: 1,
    decimals: 1,
    unit: "",
    gloss: "Million TPS",
    body: "NEAR's architecture handles over a million transactions per second on consumer-grade hardware and scales automatically through dynamic resharding.",
  },
  {
    id: "volume",
    eyebrow: "Built to connect",
    value: 24,
    decimals: 0,
    prefix: "$",
    unit: "+",
    gloss: "Billion",
    body: "More than $24 billion in cross-chain volume has settled through NEAR Intents. Swaps clear in seconds for less than a cent, with no manual bridging required.",
  },
  {
    id: "chains",
    eyebrow: "Built to reach",
    value: 30,
    decimals: 0,
    unit: "+",
    gloss: "Blockchains",
    body: "A single integration reaches Bitcoin, Ethereum, Solana, and more than thirty other chains. Transactions execute natively, so users never hold a wrapped asset.",
  },
];

export type LedgerNote = {
  id: string;
  eyebrow: string;
  /** Ocupa el lugar del numeral: estas dos pruebas no tienen cifra. */
  gloss: string;
  body: string;
};

export const LEDGER_NOTES: readonly LedgerNote[] = [
  {
    id: "quantum",
    eyebrow: "Built to resist",
    gloss: "Quantum-ready",
    body: "NEAR is one of the first blockchains to add a NIST-approved post-quantum signature scheme in production.",
  },
  {
    id: "privacy",
    eyebrow: "Built to privacy",
    gloss: "Confidential",
    body: "Trades settle inside a private shard and AI workloads run inside encrypted enclaves, where no operator or outside observer can see them.",
  },
];
