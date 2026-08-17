// La retícula de las transiciones de píxel de `/prototype/homepage-exploration`:
// su forma y su reloj. Módulo puro — cero imports de DOM, sin `"use client"`.
//
// Vive al lado de `PixelTransition.tsx` por el mismo motivo que
// `stairGeometry.ts` vive al lado de `QuantumBars`: el pintado y la geometría se
// separan para poder cambiar el reloj sin tocar el DOM, y para que los cuatro
// patrones sean cuatro FUNCIONES en un archivo en vez de cuatro componentes.
//
// ── El linaje, y en qué se aparta ────────────────────────────────────────────
//
// `primitives/ZigguratDivider` y `primitives/StairTransition` ya resuelven la
// transición entre dos secciones, y los dos lo hacen con SIETE COLUMNAS anchas
// que escalan en Y. Esto no es una tercera copia de eso: la unidad acá es una
// retícula 2D de píxeles cuadrados, y lo que se anima es CUÁNDO da vuelta cada
// píxel — no la altura de una columna. Es la diferencia entre una silueta que
// crece y una imagen que se revela.
//
// Consecuencia de diseño: toda la variación entre los cuatro patrones cabe en un
// solo número por celda —su `threshold`, el progreso en el que le toca— así que
// agregar un patrón nuevo es agregar un `case`, no un componente.
//
// ── Los dos hallazgos que hay que conocer antes de tocar esto ────────────────
//
//  1. EL UMBRAL SE NORMALIZA, SIEMPRE. Cada patrón produce su `threshold` en la
//     escala que le sale natural (el ruido en [0,1), la diagonal en [0,1], la
//     escalera en fracciones de columna). Si se usaran crudos, el gesto
//     terminaría antes o después del final del recorrido según el patrón, y
//     comparar dos patrones dejaría de ser comparar dos patrones. `normalize`
//     los mapea a [0, 1 − PIXEL_WINDOW] para que los cuatro arranquen en
//     `progress = 0` y cierren exactamente en `1`.
//
//  2. `Infinity` NO ES "TARDE", ES "NUNCA". La escalera deja píxeles FUERA de la
//     silueta (la columna del valle no tiene ninguno). Esos llevan
//     `threshold = Infinity` y quedan excluidos de la normalización, porque si
//     entraran al min/max estirarían la escala de todos los demás. Es la razón
//     de que `normalize` filtre por `Number.isFinite` en vez de recorrer el
//     array entero.

import { createSeededRandom } from "@/components/primitives/motion/seededRandom";

/**
 * 20 × 5 y no un número libre, mismo criterio que la altura única de
 * `ZigguratDivider`: mientras la retícula fue una prop, dos tests terminaron con
 * píxeles de tamaños distintos y dejaron de ser comparables entre sí — que es lo
 * único que esta página existe para hacer.
 *
 * El número sale de la proporción: con 20 columnas, el píxel mide 1/20 del ancho
 * (72px a 1440, 19px a 390) y la banda mide 5 de esos de alto. Ese ratio 20:5 es
 * el `aspect-ratio` del bloque, y es lo que hace que los píxeles sean CUADRADOS
 * en cualquier viewport sin una sola media query ni una medición en JS.
 */
export const PIXEL_COLS = 20;
export const PIXEL_ROWS = 5;

/**
 * Cuánto progreso dura la vuelta de UN píxel.
 *
 * Es la perilla de "qué tan duro es el borde": con 0 el frente sería una línea
 * perfecta de píxeles encendidos/apagados, y con 1 los 100 píxeles cruzarían
 * todos a la vez y no habría patrón. 0.16 deja ver ~6 filas de frente.
 */
export const PIXEL_WINDOW = 0.16;

/** Fracción de píxeles que `scatter` pinta con el verde de acento. */
export const PIXEL_ACCENT_RATE = 0.1;

/**
 * Sobreescala del píxel ya formado. Mata las costuras, y no es cosmético.
 *
 * Con 20 columnas en un viewport de 1801px cada celda mide 90.05px, o sea que los
 * bordes caen en posiciones fraccionarias y el navegador deja hairlines de menos
 * de 1px entre celdas vecinas. Medido en el navegador: la retícula formada se veía
 * como una grilla de líneas claras sobre el negro, no como un plano sólido — que
 * es exactamente lo que una transición NO puede parecer, porque la banda tiene que
 * leerse como la continuación del color de la sección de abajo.
 *
 * 1.02 sobre 90px son 1.8px de solape, suficiente para cubrir la fracción en
 * cualquier ancho y demasiado poco para que se note en el píxel a medio entrar.
 * No se arregla con `gap: 0` ni con `outline`: el hueco no es un gap, es redondeo
 * de subpíxel.
 */
export const PIXEL_BLEED = 1.02;

export const PIXEL_PATTERNS = ["dissolve", "sweep", "stair", "scatter"] as const;
export type PixelPattern = (typeof PIXEL_PATTERNS)[number];

/** Dónde queda el escalón más alto. Solo lo lee `stair`. */
export type PixelPeak = "edges" | "center";

/** Si la figura se arma al entrar o se desarma al salir. */
export type PixelMode = "enter" | "exit";

export type PixelCell = {
  col: number;
  row: number;
  /** Progreso en el que este píxel arranca su vuelta. `Infinity` = nunca entra. */
  threshold: number;
  /** Desplazamiento de entrada, en múltiplos del lado del píxel. 0 = aparece en su celda. */
  drift: number;
  /** El píxel entra con el color de acento en vez del color destino. */
  accent: boolean;
};

/**
 * Cuántas filas llena la columna `col` cuando la escalera está formada.
 *
 * Es la silueta de `ZigguratDivider` (`[100, 70, 40, 0, 40, 70, 100]`) pero
 * CUANTIZADA a la retícula: el redondeo a filas enteras es justamente lo que la
 * convierte en escalera de píxeles en vez de rampa. Con `peak = "edges"` el
 * valle cae en el centro; dos transiciones que encierran una misma sección
 * tienen que llevar valores OPUESTOS para leerse como espejo.
 */
export function stairFill(
  col: number,
  peak: PixelPeak,
  cols = PIXEL_COLS,
  rows = PIXEL_ROWS
): number {
  const mid = (cols - 1) / 2;
  const t = mid === 0 ? 1 : Math.abs(col - mid) / mid; // 0 centro, 1 bordes
  return Math.round((peak === "edges" ? t : 1 - t) * rows);
}

/**
 * La retícula entera, con el umbral de cada píxel ya normalizado.
 *
 * Orden garantizado: fila por fila de arriba hacia abajo, y dentro de cada fila
 * de izquierda a derecha. El componente se apoya en ese orden para emparejar el
 * array de celdas con el de nodos del DOM por índice, sin buscar por selector en
 * cada frame.
 */
export function pixelCells(
  pattern: PixelPattern,
  peak: PixelPeak = "edges",
  cols = PIXEL_COLS,
  rows = PIXEL_ROWS
): PixelCell[] {
  // Un generador propio por llamada: dos bloques con el mismo patrón dan el
  // MISMO desorden, y un rebuild por resize no reshuffea nada. Es exactamente
  // para lo que existe `createSeededRandom` (ver su nota).
  const rnd = createSeededRandom();
  const cells: PixelCell[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // `depth` cuenta filas desde ABAJO (1 = la de abajo) porque las dos
      // transiciones que ya existen crecen desde el borde inferior, y una
      // tercera que creciera al revés no se leería como el mismo patrón.
      const depth = rows - row;
      const fromBottom = depth / rows; // (0, 1]
      const acrossX = cols === 1 ? 0 : col / (cols - 1);
      const downY = rows === 1 ? 0 : row / (rows - 1);

      let threshold: number;
      let drift = 0;
      let accent = false;

      switch (pattern) {
        // Ruido puro: cada píxel tiene su turno y no hay frente. Es el disolve
        // clásico, y el único de los cuatro sin dirección.
        case "dissolve":
          threshold = rnd();
          break;

        // Diagonal con jitter. El jitter no es decoración: sin él la diagonal es
        // una recta perfecta y el gesto se lee como un barrido lineal cualquiera
        // — los píxeles solo se notan como píxeles cuando el borde escalona.
        case "sweep":
          threshold = acrossX * 0.8 + downY * 0.2 + (rnd() - 0.5) * 0.08;
          break;

        // La escalera, con la cascada POR VELOCIDAD del linaje de `stairGeometry`:
        // el divisor es `fill`, así que la columna que llega más alto recorre más
        // filas en el mismo progreso, o sea VA más rápido. Un stagger a velocidad
        // común solo lograría que salgan escalonadas, que es la mitad del efecto.
        //
        // El `− 0.5` no es un ajuste fino, es lo que pone la cascada en el sentido
        // correcto, y la primera versión lo tenía mal. Con `(depth − 1) / fill` el
        // píxel de abajo de TODA columna arranca en 0 y el último en `(fill−1)/fill`:
        // las columnas de una sola fila (las del valle) terminan en el primer frame
        // y las de cinco tardan todo el recorrido, así que a mitad de gesto el
        // centro está lleno y los bordes vacíos — la escalera crece al REVÉS de la
        // silueta que tiene que formar, y se lee como manchas.
        //
        // Con `(depth − 0.5) / fill` cada columna llega a su propio techo en
        // `progress = 1`: las cuatro alturas suben en proporción, así que la silueta
        // ES una escalera en todo momento y las columnas altas van más rápido
        // porque recorren más filas en el mismo progreso. El medio píxel es lo que
        // deja el último turno por debajo de 1 para que la ventana entre entera.
        case "stair": {
          const fill = stairFill(col, peak, cols, rows);
          threshold = depth <= fill ? (depth - 0.5) / fill : Number.POSITIVE_INFINITY;
          break;
        }

        // Los píxeles caen o suben a su celda desde fuera. El peso de `fromBottom`
        // mantiene una dirección legible por debajo del desorden: sin él, el
        // scatter y el dissolve se ven igual.
        case "scatter":
          threshold = fromBottom * 0.62 + rnd() * 0.38;
          drift = (rnd() < 0.5 ? -1 : 1) * (1 + rnd() * 2.4);
          accent = rnd() < PIXEL_ACCENT_RATE;
          break;
      }

      cells.push({ col, row, threshold, drift, accent });
    }
  }

  return normalize(cells);
}

/** Mapea los umbrales finitos a [0, 1 − PIXEL_WINDOW]. Ver el hallazgo 1 de arriba. */
function normalize(cells: PixelCell[]): PixelCell[] {
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;

  for (const cell of cells) {
    if (!Number.isFinite(cell.threshold)) continue;
    if (cell.threshold < min) min = cell.threshold;
    if (cell.threshold > max) max = cell.threshold;
  }

  if (!Number.isFinite(min)) return cells; // retícula sin un solo píxel: nada que escalar
  const span = max - min || 1;
  const ceiling = 1 - PIXEL_WINDOW;

  return cells.map((cell) =>
    Number.isFinite(cell.threshold)
      ? { ...cell, threshold: ((cell.threshold - min) / span) * ceiling }
      : cell
  );
}

/**
 * Cuánto está dado vuelta el píxel `cell` en `progress`, de 0 a 1.
 *
 * Función PURA del progreso, no una timeline con eases: es la misma decisión que
 * documenta `StairTransition` y por el mismo motivo — probado como reveal
 * cronometrado, el gesto disparaba con el bloque casi fuera de cuadro y se
 * acababa antes de que el lector pudiera mirarlo.
 *
 * Lineal a propósito. Una ease acá suavizaría el borde de cada píxel, que es
 * justo lo que un píxel no tiene que tener; el suavizado del CONJUNTO ya lo da
 * `PIXEL_WINDOW`, que desfasa las vueltas entre celdas vecinas.
 */
export function cellReveal(
  progress: number,
  cell: PixelCell,
  mode: PixelMode = "enter"
): number {
  // Fuera de la silueta: ni entra ni se retira, en ninguno de los dos modos.
  if (!Number.isFinite(cell.threshold)) return 0;

  const t = Math.min(1, Math.max(0, (progress - cell.threshold) / PIXEL_WINDOW));

  // En `exit` los píxeles se van en el MISMO orden espacial en que entrarían, no
  // en el inverso: así la ola sigue cruzando en la misma dirección y las dos
  // transiciones que encierran una sección se leen como un solo gesto continuo.
  return mode === "exit" ? 1 - t : t;
}
