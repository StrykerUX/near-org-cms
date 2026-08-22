// Copy PROPUESTA para el laboratorio de la franja de prueba.
//
// ⚠️ Vive acá y NO en `protocolContent.ts` a propósito. Ese módulo es la
// transcripción del doc de sitemap y no lleva una palabra que el doc no diga;
// esto es texto escrito para probar una hipótesis de diseño y **no está
// aprobado**. Mezclarlos haría imposible saber después qué vino del doc.
//
// Si una variante gana, su copy pasa por revisión editorial y recién ahí entra
// al módulo de contenido.

/**
 * El ancla humana de cada cifra — variante P2.
 *
 * El problema que intenta resolver: "600ms" y "1M+ TPS" no le dicen nada a quien
 * no trabaja en infraestructura, que es la mitad del público de esta página. Un
 * número sin referencia no persuade; sólo informa a quien ya sabía.
 *
 * Regla que se siguió al escribirlas: **ninguna introduce un dato nuevo**. Son
 * reformulaciones de la misma cifra o aritmética sobre ella. La única excepción
 * declarada es la referencia externa de `SCALE_REFERENCE`, más abajo.
 */
export const ANCHORS: Record<string, string> = {
  uptime: "Not one halt since launch.",
  tps: "Anyone can check it on-chain.",
  // A revisar con el equipo: es una comparación de sentido común, no una
  // medición. Si incomoda, la alternativa literal es "Two blocks per second".
  block: "A new block before you finish blinking.",
  // Misma nota: comparación cualitativa contra una autorización de tarjeta.
  finality: "Irreversible before a card terminal prints.",
  shards: "One of them nobody can read into.",
  fee: "A thousand transactions for two dollars.",
};

/**
 * Los tres grupos de la variante P3.
 *
 * Las seis cifras NO son seis cosas del mismo tipo, y presentarlas en fila lo
 * disimula: tres hablan de tiempo, dos de tamaño y una de precio. Agrupadas, el
 * lector se lleva tres ideas en vez de seis números.
 *
 * Los rótulos son de estructura, no de marca — describen qué mide cada par.
 */
export const GROUPS = [
  { label: "Speed", ids: ["block", "finality"] },
  { label: "Scale", ids: ["tps", "shards"] },
  { label: "Record", ids: ["uptime", "fee"] },
] as const;

/**
 * La frase corrida de la variante P5. Las cifras van marcadas con `**` y el
 * componente las parte — así el texto se lee entero acá y no hay que
 * reconstruirlo mentalmente desde un array de fragmentos.
 */
export const SENTENCE =
  "NEAR has run for **5+ years** with **100% uptime**, settling transactions in **1.2s** across **10 shards** — one of them private — for under **$0.002** each, at a verified ceiling of **1M+ TPS**.";
