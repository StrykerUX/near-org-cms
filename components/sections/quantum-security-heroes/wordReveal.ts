import { blockWordCells } from "@/components/sections/quantum-security-heroes/asciiField";

// El ciclo de "arte ASCII de bloque" que usa HeroH3 (base) y sus variantes:
// una región del MISMO grid de dígitos que cada canvas ya dibuja se ilumina
// en el patrón de una palabra, en vez de al azar. Factorizado acá porque
// tres pantallas distintas (h3 base, y las dos variantes nuevas) necesitan
// EXACTAMENTE el mismo mecanismo — solo cambia el campo de dígitos de
// fondo alrededor, nunca cómo se arma la palabra.
//
// El caller aporta las primitivas de su propio grid (una celda = un
// carácter, `drawCell` ya sabe pintar una) y este módulo no toca el canvas
// directo, ni conoce dónde vive — así sirve igual sobre un grid de rain que
// sobre cualquier otro.

const IDLE_TICKS = 60; // ~6s de ruido antes de resolver
const RESOLVE_TICKS = 30; // ~3s — barrido izq→der, no un golpe
const HOLD_TICKS = 30; // ~3s legible, sostenida
const DISSOLVE_TICKS = 16; // ~1.6s de vuelta a ruido, mismo barrido
const SWEEP_SHARE = 0.78; // parte del tramo que se va en el barrido; el resto es jitter por celda
const CELL_FADE_TICKS = 8; // ~0.8s que tarda UNA celda en pasar de gris a verde, o al revés

type Phase = "idle" | "resolving" | "held" | "dissolving";

/** Cómo se planta la caja de la palabra contra el grid del caller. */
export type WordRevealLayout = {
  /** Fracción del ancho del grid que puede ocupar la palabra. 1 = a sangre. */
  widthFraction?: number;
  /** Fracción del ALTO de la caja que queda por debajo del borde inferior
   * del grid: la palabra se corta contra el final de la sección en vez de
   * caber entera. 0.3 = un 30% afuera. */
  cutoffFraction?: number;
};

export type WordRevealOptions = {
  word: string;
  /** Carácter base (dígito) de una celda del grid — el mismo array que ya
   * alimenta el resto del efecto, para que "apagado" se vea igual que el
   * ruido ambiente de alrededor. */
  charAt: (col: number, row: number) => string;
  /** `keep` = no borrar lo que ya haya en la celda, pintar ENCIMA. Es lo
   * que permite el crossfade: primero el dígito gris, después el mismo
   * dígito en verde con alpha parcial sobre él. */
  drawCell: (col: number, row: number, text: string, style: string, keep?: boolean) => void;
  /** Solo los tres canales, sin `rgba(...)`: este módulo arma la alpha. */
  greenRgb: string;
  dimRgba: string;
  rng: () => number;
};

export function createWordReveal(opts: WordRevealOptions) {
  const { cells: logical, width: wordCols, height: wordRows } = blockWordCells(opts.word);

  let originCol = 0;
  let originRow = 0;
  let boxCols = 0;
  let boxRows = 0;
  let gridCols = 0;
  let gridRows = 0;
  let enabled = true;
  let phase: Phase = "idle";
  let ticks = 0;
  let lockTick: number[] = [];
  let unlockTick: number[] = [];
  const onCellLogicalIndex = new Map<string, number>();
  const cellKey = (col: number, row: number) => `${col},${row}`;

  /** Reparte los ticks de un tramo entre las celdas de la palabra como un
   * BARRIDO de izquierda a derecha con jitter: la palabra sale poco a poco,
   * columna tras columna, en vez de fijarse toda de golpe en orden al azar.
   * `SWEEP_SHARE` es cuánto del tramo se va en el barrido — el resto lo
   * reparte el azar celda a celda, para que el frente no sea una línea
   * vertical perfecta. El caller le descuenta `CELL_FADE_TICKS` al tramo,
   * para que la última celda en arrancar alcance a completar su rampa antes
   * de que la fase termine. */
  const sweepOrder = (span: number) =>
    logical.map((p) => {
      const alongWord = wordCols <= 1 ? 0 : p.col / (wordCols - 1);
      const sweep = alongWord * span * SWEEP_SHARE;
      const jitter = opts.rng() * span * (1 - SWEEP_SHARE);
      return Math.min(span - 1, Math.floor(sweep + jitter));
    });

  // Curva de una celda: ni prendida ni apagada, sino un valor 0..1 que
  // tarda `CELL_FADE_TICKS` en recorrerse. Lo que el barrido escalona es
  // CUÁNDO arranca cada celda su propia rampa, no cuándo salta de estado.
  const smooth = (t: number) => {
    const x = Math.min(1, Math.max(0, t));
    return x * x * (3 - 2 * x);
  };

  const alphaAt = (idx: number) => {
    if (phase === "held") return 1;
    if (phase === "resolving") return smooth((ticks - lockTick[idx]) / CELL_FADE_TICKS);
    if (phase === "dissolving") return 1 - smooth((ticks - unlockTick[idx]) / CELL_FADE_TICKS);
    return 0;
  };

  const drawBox = () => {
    if (!enabled) return;
    for (let r = 0; r < boxRows; r++) {
      const row = originRow + r;
      // Fuera del grid: con `cutoffFraction` la caja desborda el borde
      // inferior a propósito, y esas filas no existen como celdas.
      if (row < 0 || row >= gridRows) continue;
      for (let c = 0; c < boxCols; c++) {
        const col = originCol + c;
        if (col < 0 || col >= gridCols) continue;
        const logicalIdx = onCellLogicalIndex.get(cellKey(col, row));
        const alpha = logicalIdx === undefined ? 0 : alphaAt(logicalIdx);
        const ch = opts.charAt(col, row);
        opts.drawCell(col, row, ch, opts.dimRgba);
        if (alpha > 0.01) opts.drawCell(col, row, ch, `rgba(${opts.greenRgb},${alpha.toFixed(3)})`, true);
      }
    }
  };

  return {
    /** Recalcula tamaño/posición contra el grid actual — llamar en cada
     * build()/resize del caller. La caja se escala por ANCHO y se ancla al
     * borde inferior del grid; el alto no la limita porque `cutoffFraction`
     * la deja desbordar ese borde a propósito. */
    layout(cols: number, rows: number, layoutOpts: WordRevealLayout = {}) {
      const { widthFraction = 1, cutoffFraction = 0 } = layoutOpts;
      gridCols = cols;
      gridRows = rows;

      // Con menos celdas que columnas lógicas la palabra no se puede dibujar
      // (habría trazos de cero celdas de ancho): en esa grilla —mobile, con
      // celdas grandes— el caller se queda solo con su campo de fondo.
      enabled = cols >= wordCols;
      if (!enabled) {
        boxCols = 0;
        boxRows = 0;
        phase = "idle";
        ticks = 0;
        return;
      }

      // La caja se estira hasta el ancho pedido y las celdas del grid se
      // reparten PROPORCIONALMENTE entre las columnas de la fuente, en vez
      // de escalar por un múltiplo entero: un trazo cae en 1, 2 o 3 celdas
      // según el reparto, pero la palabra llega exactamente de borde a
      // borde. Con múltiplo entero, a 15px de celda, solo se podía elegir
      // entre media pantalla y desbordarla entera.
      boxCols = Math.max(wordCols, Math.round(cols * widthFraction));
      boxRows = Math.max(wordRows, Math.round((wordRows * boxCols) / wordCols));
      originCol = Math.round((cols - boxCols) / 2);
      // Anclada abajo: solo `1 - cutoffFraction` del alto queda dentro.
      originRow = rows - Math.round(boxRows * (1 - cutoffFraction));

      const colAt = (i: number) => Math.round((i * boxCols) / wordCols);
      const rowAt = (i: number) => Math.round((i * boxRows) / wordRows);

      onCellLogicalIndex.clear();
      logical.forEach((p, i) => {
        for (let row = rowAt(p.row); row < rowAt(p.row + 1); row++) {
          for (let col = colAt(p.col); col < colAt(p.col + 1); col++) {
            onCellLogicalIndex.set(cellKey(originCol + col, originRow + row), i);
          }
        }
      });

      phase = "idle";
      ticks = 0;
    },

    /** Avanza un tick (10Hz, el mismo ritmo que el resto de estos campos). */
    tick() {
      if (!enabled) return;
      ticks++;

      if (phase === "idle") {
        if (ticks >= IDLE_TICKS) {
          phase = "resolving";
          ticks = 0;
          lockTick = sweepOrder(RESOLVE_TICKS - CELL_FADE_TICKS);
        }
        return;
      }

      if (phase === "resolving") {
        drawBox();
        if (ticks >= RESOLVE_TICKS) {
          phase = "held";
          ticks = 0;
          drawBox();
        }
        return;
      }

      if (phase === "held") {
        if (ticks >= HOLD_TICKS) {
          phase = "dissolving";
          ticks = 0;
          unlockTick = sweepOrder(DISSOLVE_TICKS - CELL_FADE_TICKS);
          drawBox();
        }
        return;
      }

      // dissolving
      drawBox();
      if (ticks >= DISSOLVE_TICKS) {
        phase = "idle";
        ticks = 0;
        // Última pasada: la caja vuelve a ruido base parejo, para no dejar
        // un fantasma de la palabra hasta que el campo de fondo la vaya
        // "limpiando" con su propio paso.
        for (let r = 0; r < boxRows; r++) {
          const row = originRow + r;
          if (row < 0 || row >= gridRows) continue;
          for (let c = 0; c < boxCols; c++) {
            const col = originCol + c;
            if (col < 0 || col >= gridCols) continue;
            opts.drawCell(col, row, opts.charAt(col, row), opts.dimRgba);
          }
        }
      }
    },

    /** `true` mientras la caja esté "tomada" por la palabra y el caller no
     * deba pintar encima con su propio efecto — si no, el campo de fondo le
     * enciende celdas al azar por dentro y la borronea. En `idle` es `false`:
     * ahí la región es ruido común y corriente. */
    suppresses(col: number, row: number) {
      if (!enabled || phase === "idle") return false;
      return col >= originCol && col < originCol + boxCols && row >= originRow && row < originRow + boxRows;
    },

    /** `true` mientras la palabra esté saliendo, sostenida o disolviéndose
     * — el caller lo usa para apagar su propio efecto y dejarle el verde
     * sola a la palabra. */
    isActive() {
      return enabled && phase !== "idle";
    },

    /** Repinta la caja tal cual está. El caller la necesita después de
     * repintar el campo entero por su cuenta: en `held` esta caja no se
     * redibuja sola en cada tick, así que sin esto el repintado la borra. */
    redraw() {
      if (phase === "idle") return;
      drawBox();
    },

    /** Fuerza el estado "resuelto y quieto" — para prefers-reduced-motion. */
    forceHeld() {
      phase = "held";
      drawBox();
    },
  };
}
