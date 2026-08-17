// La escalera de `QuantumBars`: su forma, y el reloj que la hace subir.
//
// Módulo puro: cero imports de DOM, sin `"use client"`. Vive al lado de `heroGeometry.ts`
// y por el mismo motivo — la escalera la dibuja `QuantumBars` pero su unidad y su juntura
// las comparte con el hero, y un tercero que no sabe nada de ninguno de los dos evita que
// las secciones queden acopladas a nivel de módulo.
//
// ── De dónde sale ────────────────────────────────────────────────────────────
// Salió del laboratorio de `/prototype/descent`, que existió para resolver un defecto
// concreto: que lo primero que se veía al scrollear era una barra gris plana en vez de
// una escalera. Doce rutas y dos generaciones de approaches después, lo que ganó está
// acá. El laboratorio ya se retiró: el catálogo de lo que se probó y por qué falló está
// en el historial de git (`components/sections/lab/README.md`, hasta el commit que podó
// las páginas de concepto). Vale la pena mirarlo antes de proponer un cambio de ritmo —
// lo más probable es que ya se haya intentado.
//
// ── Los dos hallazgos que hay que conocer antes de tocar esto ────────────────
//
//  1. LAS TRES PIEZAS NUNCA FUERON LA FIGURA. `QuantumBars` dibujaba cada columna con un
//     escalón arriba, un bloque uniforme y un escalón espejado abajo. Como
//     `offset + height` sumaba siempre 1.5, la unión de las tres era EXACTAMENTE un solo
//     bloque de `u·offset` a `bottom: u·offset`. Eran una descomposición para poder
//     animarlas por separado — y esa descomposición era el defecto: el bloque uniforme
//     abarca las siete columnas, así que mientras crecía la silueta era un rectángulo de
//     ancho completo. `stairOffsets()` las fusiona en una, y de paso desaparecen las dos
//     costuras de `+1px` que las piezas necesitaban entre sí.
//
//  2. LA BANDA NO ERA UN PROBLEMA DE TIMING. Siete approaches intentaron arreglarla
//     retimando el crecimiento y todos fallaron, porque escalar un rectángulo obliga a
//     pasar por estados en los que la silueta todavía no existe. No se arregla con una
//     curva; se arregla no escalando un rectángulo.

export const STAIR_COLUMNS = 7;

/** Las 7 columnas son 4 anillos espejados. */
export const STAIR_RINGS = 4;

/** Anillo al que pertenece la columna `i`. 0 = el par exterior, 3 = la central. */
export const ringOf = (i: number) => Math.min(i, STAIR_COLUMNS - 1 - i);

/** `--u` en múltiplos, para escribir en estilos inline. */
export const u = (n: number) => `calc(var(--u) * ${n})`;

/**
 * Alto de la franja de escalones en unidades de `--u`: la profundidad de la FIGURA.
 * La escalera baja `STAIR_SPAN · u` desde el borde de la columna exterior hasta el valle
 * central, en tres saltos iguales.
 */
export const STAIR_SPAN = 1.5;

/**
 * Cuánto scroll dura el recorrido, en unidades de `--u` restadas al alto del hero.
 *
 * NO es lo mismo que `STAIR_SPAN` y por eso no comparten nombre: aquélla es cuánto MIDE
 * la figura, ésta es cuánto DURA su entrada. Se separaron en el laboratorio, donde
 * profundizar la escalera sin alargar el recorrido (y al revés) era justamente lo que
 * había que poder probar por separado.
 */
export const SCROLL_DEPTH = 3;

/**
 * La figura en UNA pieza por columna: cada columna es gris de `u·offset` a
 * `bottom: u·offset`.
 *
 * La columna central lleva `depth` entero — su gris empieza en la juntura, que es donde
 * antes empezaba el bloque uniforme.
 */
export function stairOffsets(depth = STAIR_SPAN): number[] {
  const step = depth / 3;
  return [0, step, step * 2, depth, step * 2, step, 0];
}

// ── El reloj ─────────────────────────────────────────────────────────────────
//
// `cascadeEdges` devuelve UNA cosa: la `y` en pantalla del borde superior del gris de
// cada anillo. Eso es todo lo que define el efecto.
//
// ── Los tres actos, y por qué ninguno sale de una ease con nombre ────────────
//
//  1. CASCADA POR VELOCIDAD. Cada anillo entra a una velocidad distinta, graduada de
//     afuera hacia adentro (`fast` → `slow`). La escalera se abre porque los de afuera
//     VAN más rápido, no solo porque salieron antes. Un stagger a velocidad común —lo que
//     hacía el reloj anterior— solo produce lo segundo.
//
//  2. ALCANCE. La curva de cada anillo es una Hermite con las dos pendientes prescritas
//     (`hermiteRamp`), y para los interiores esa combinación —entrada lenta, salida
//     lenta, mismo recorrido en menos progreso— OBLIGA a un pico de velocidad a mitad de
//     camino. No se programa: sale de la familia de curvas. Medido, el central llega a
//     3.4× el scroll cuando el lateral ya bajó a 1.6×.
//
//  3. ATERRIZAJE. `softFloor` amortigua los últimos `soft · u` píxeles, así que la
//     velocidad en pantalla cae a cero de forma continua. El reloj anterior detenía cada
//     anillo con un `Math.max` contra el borde: llegaba a ~2.5× la velocidad del scroll y
//     paraba EN UN FRAME, cuatro veces escalonadas.
//
// ── Lo que se derivó en vez de calibrarse ────────────────────────────────────
// Las velocidades son un pedido, pero el RECORRIDO de cada anillo sale de las medidas del
// viewport para que su borde toque el fondo del amortiguador exactamente en su `land`.
// Por eso la cobertura total al final del scroll está garantizada en cualquier pantalla
// —verificada en seis viewports y once combinaciones de perillas— y no depende de ningún
// número calibrado a ojo que pueda quedar corto en un tamaño raro.

import { hermiteRamp } from "@/components/primitives/motion/velocityRamp";
import { softFloor } from "@/components/primitives/motion/softFloor";

/** Los valores con los que está calibrada la cascada. */
export const CASCADE = {
  /** Radio del amortiguador de llegada, en `--u`. Con 0 el final vuelve a ser un choque. */
  soft: 0.25,
  /** Desfase entre arranques, en progreso. Es la perilla de "cuánta escalera". */
  spread: 0.11,
  /** Progreso en el que aterriza el anillo CENTRAL, que es el último. */
  land: 0.92,
  /** Cuánto se adelanta el aterrizaje de cada anillo hacia afuera. 0 = los cuatro juntos. */
  lag: 0.02,
  /** Velocidad de entrada del anillo EXTERIOR, en múltiplos de la velocidad del scroll. */
  fast: 2.9,
  /** Ídem del CENTRAL. Que sea menor que `fast` es, literalmente, la cascada. */
  slow: 1.35,
  /** Velocidad de llegada, común a los cuatro. Más bajo = más ease-out al final. */
  settle: 0.25,
  /**
   * Cuánto cuelga el anillo central por debajo de la juntura al arrancar, en `--u`.
   *
   * CERO, y conviene saber por qué: el approach del tallado —que anima el recorte de la
   * imagen— necesita imagen por debajo de la juntura para poder retirarla, y eso obliga a
   * estirar el vídeo y se paga en reencuadre (a 1877×1050 eran 228px, el 12% del ancho).
   * Acá el gris se mueve POR ENCIMA del hero, así que no hay nada que revelar: con 0 los
   * cuatro anillos arrancan exactamente en la juntura, la franja sin cubrir es 0px y el
   * vídeo no tiene que crecer ni un píxel. Medido en el navegador: la caja del vídeo pasa
   * de 2080×1168 a 2080×1019, o sea exactamente el hero.
   */
  drop: 0,
  /** Altura de pantalla, en fracción del viewport, donde aterrizan. 0 = el borde. */
  line: 0,
} as const;

export type CascadeInput = {
  /** Progreso del recorrido en [0,1]. */
  eased: number;
  /** `y` en pantalla de la juntura, viva: `seamDoc − scroll`. */
  seamY: number;
  /** `y` en pantalla de la juntura al arrancar el recorrido. Medida, constante. */
  seamY0: number;
  /** Largo del recorrido del ScrollTrigger, en px. */
  span: number;
  viewportH: number;
  unitPx: number;
  drop: number;
  line: number;
  soft: number;
  spread: number;
  land: number;
  lag: number;
  fast: number;
  slow: number;
  settle: number;
};

/**
 * La `y` en pantalla del borde superior del gris de cada anillo, del exterior al centro.
 *
 * ── La cuenta, anillo por anillo ────────────────────────────────────────────
 *
 *   s_r    = spread · r                       arranque escalonado, de afuera hacia adentro
 *   L_r    = land − lag · (3 − r)             aterrizaje escalonado hacia atrás
 *   win_r  = L_r − s_r                        la ventana del anillo
 *   D_r    = seamY0 − span·L_r + start_r·u + k − F        ← el presupuesto, ver abajo
 *   y_r    = F + softFloor(seamY + start_r·u − D_r·g_r(t_r) − F, k)
 *
 * ── Por qué `D_r` es una derivación y no un número ──────────────────────────
 * Se pide que el borde LIBRE del anillo toque el fondo del amortiguador (`F − k`) justo
 * en `eased = L_r`. Como la juntura viaja con el scroll —`seamY(p) = seamY0 − span·p`—
 * ese pedido se despeja en una línea y da el `D_r` de arriba.
 *
 * ── Las tres garantías, demostradas y no calibradas ─────────────────────────
 *
 *  · COBERTURA TOTAL. En `eased = 1` todos los `t_r` valen 1, así que
 *    `free_r = seamY0 − span + start_r·u − D_r = (F − k) − span·(1 − L_r) ≤ F − k`,
 *    o sea `y_r = F` exacto. Vale en cualquier viewport.
 *  · MONOTONÍA (y con ella el scroll en reversa exacto). `free_r` decrece en `p` porque
 *    `hermiteRamp` garantiza `g' > 0`, y `softFloor` es creciente en su argumento. Es
 *    función PURA del progreso: no hay estado entre frames que un `refresh()` o un resize
 *    puedan ensuciar.
 */
export function cascadeEdges(input: CascadeInput): number[] {
  const {
    eased,
    seamY,
    seamY0,
    span,
    viewportH,
    unitPx,
    drop,
    line,
    soft,
    spread,
    land,
    lag,
    fast,
    slow,
    settle,
  } = input;

  const k = Math.max(0, soft) * unitPx;
  const floorY = line * viewportH;
  const last = STAIR_RINGS - 1;

  const edges: number[] = new Array(STAIR_RINGS);
  for (let ring = 0; ring < STAIR_RINGS; ring++) {
    const startAt = spread * ring;
    const landAt = land - lag * (last - ring);
    const win = Math.max(1e-3, landAt - startAt);
    // Cuánto cuelga este anillo por debajo de la juntura al arrancar. Con el `drop = 0`
    // del defecto es cero para los cuatro: arrancan todos en la juntura.
    const startPx = ((drop * ring) / 3) * unitPx;

    // El presupuesto de ascenso propio, o sea lo que este anillo sube POR ENCIMA de lo
    // que ya lo arrastra el scroll.
    const budget = Math.max(1, seamY0 - span * landAt + startPx + k - floorY);
    const v = fast + ((slow - fast) * ring) / last;
    // De "entrar a `v` veces la velocidad del scroll" a la pendiente que pide
    // `hermiteRamp`. La conversión vive acá y no en el helper porque depende del
    // recorrido concreto de este anillo; ver la nota de `velocityRamp.ts`.
    const g = hermiteRamp((span * (v - 1) * win) / budget, settle);

    edges[ring] = floorY + softFloor(seamY + startPx - budget * g((eased - startAt) / win) - floorY, k);
  }
  return edges;
}
