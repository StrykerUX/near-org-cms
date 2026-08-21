// Calibración inicial contra el frame de referencia.
//
// Los valores NO son un punto de partida neutro: están medidos sobre la imagen
// (paleta muestreada, ángulo del degradé estimado sobre la diagonal de la banda
// clara, foco deducido de hacia dónde convergen las estrías). El lab existe para
// moverlos, pero moverlos desde acá y no desde cero.

import type { FoliageVariant } from "./foliage";

export type FoliageParams = {
  focusX: number;
  focusY: number;
  scale: number;
  curl: number;
  curlScale: number;
  blur: number;
  detail: number;
  detailFall: number;
  contrast: number;
  lift: number;
  gradAngle: number;
  gradSpread: number;
  gradGamma: number;
  gradMix: number;
  grain: number;
  drift: number;
  c0: string;
  c1: string;
  c2: string;
  c3: string;
  c4: string;
};

// ── Paleta ──────────────────────────────────────────────────────────────────
//
// Cinco paradas muestreadas de la referencia, de la luz a la sombra. La primera
// no es blanca ni la última negra a propósito: la referencia nunca satura por
// arriba —su punto más claro sigue siendo un crema verdoso— ni cierra en negro
// puro, y esos dos topes son buena parte de por qué se lee como película y no
// como un degradé sintético.
const PALETTE = {
  c0: "#e8efbe", // luz: crema verdoso de la esquina superior izquierda
  c1: "#b5cc86", // salvia claro
  c2: "#5e8f5c", // verde medio, el cuerpo de la imagen
  c3: "#1f5540", // verde bosque
  c4: "#0a2018", // sombra: verde casi negro del borde derecho
};

// Base común. Lo que cambia entre variantes es sobre todo `blur`, porque el
// parámetro significa cosas distintas en cada una: en A es cuánto se comprime el
// dominio, en B la longitud del barrido y en C la apertura del escalado. Un
// mismo número daría tres intensidades muy distintas.
const BASE: Omit<FoliageParams, "blur"> = {
  // Fuera del canvas, a la derecha y un poco por encima del centro: es donde
  // convergen las estrías de la referencia si se prolongan.
  focusX: 1.28,
  focusY: 0.58,

  scale: 3.4,
  curl: 1.35,
  curlScale: 1.1,

  detail: 0.72,
  // El detalle muere rápido al alejarse del foco: a la izquierda de la
  // referencia no hay hoja legible, solo degradé.
  detailFall: 1.45,

  // Relieve de las estrías. El producto \`contrast × gradMix\` es el número que
  // de verdad importa: es la amplitud con la que el follaje mueve el índice de
  // la rampa, y el degradé solo recorre 1.0 de punta a punta. Pasado ~0.45 el
  // follaje empieza a tapar la dirección de la luz y la imagen se vuelve un
  // mármol verde sin encuadre — es lo que pasaba con 2.4 × 0.62 ≈ 0.74.
  contrast: 1.35,
  lift: 0.0,

  // Radianes. Negativo = el degradé oscurece hacia abajo-derecha, que es la
  // diagonal de la referencia (luz arriba-izquierda). ~-41°: la banda clara de
  // la referencia baja casi a 45°, no en horizontal.
  gradAngle: -0.72,
  // El degradé tiene que recorrer la rampa entera a lo ancho del encuadre, pero
  // JUSTO: pasado ~1.0 la mayor parte de la pantalla cae en el clamp de uno de
  // los dos extremos y toda la transición se apelmaza en una banda diagonal
  // estrecha. La referencia hace lo contrario — casi todo el cuadro son tonos
  // intermedios, y los extremos solo se rozan en las esquinas.
  gradSpread: 1.15,
  // >1 aprieta la zona clara contra la esquina iluminada y deja el resto del
  // cuadro en los verdes medios — el reparto de la referencia.
  gradGamma: 1.5,
  // Amplitud de la abolladura, no un reparto. Ver la nota de \`contrast\`: lo que
  // se calibra es el producto de los dos.
  gradMix: 0.34,

  grain: 0.032,
  drift: 1,

  ...PALETTE,
};

export const PRESETS: Record<FoliageVariant, FoliageParams> = {
  stretch: { ...BASE, blur: 3.4 },
  sweep: { ...BASE, blur: 2.1 },
  zoom: { ...BASE, blur: 1.5 },
};

export const VARIANT_LABEL: Record<FoliageVariant, string> = {
  stretch: "A · stretch",
  sweep: "B · sweep",
  zoom: "C · zoom",
};

export const VARIANT_NOTE: Record<FoliageVariant, string> = {
  stretch:
    "Una muestra por píxel: el dominio del ruido nace comprimido a lo largo del flujo. La más barata con diferencia; se lee más fibrosa porque un estirado no baja el contraste local como sí lo hace un blur.",
  sweep:
    "Blur direccional real, 13 muestras sobre la tangente del flujo, re-evaluada por muestra para que el barrido se curve. Disuelve las masas mejor que A.",
  zoom: "Blur radial desde el centro de fuga. El abanico del borde derecho sale por construcción y no por ajuste; es la más fiel a la geometría de la referencia.",
};

// Cuántas veces se evalúa el campo por píxel. Solo para mostrarlo en el panel:
// la diferencia de costo entre A y las otras dos es el dato que decide si el
// shader puede reemplazar al video en producción.
export const VARIANT_COST: Record<FoliageVariant, string> = {
  stretch: "1 muestra/px",
  sweep: "13 muestras/px",
  zoom: "13 muestras/px",
};
