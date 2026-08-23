import { gsap } from "@/components/primitives/motion/gsapClient";
import { MQ } from "@/components/primitives/motion/motionTokens";
import { deviceRatio } from "@/components/primitives/motion/dpr";
import { createSeededRandom } from "@/components/primitives/motion/seededRandom";
import { onViewportToggle } from "@/components/primitives/motion/pauseOffscreen";
import { pickDigit, monoFont, setupCanvas } from "@/components/sections/quantum-security-heroes/asciiField";

// El ANDAMIO que comparten los fondos ASCII de estos heroes: dimensionar el
// canvas al DPR, cortar la caja en celdas, sembrar el grid de dígitos, correr
// un tick a 10Hz sobre `gsap.ticker` (nunca un rAF propio), pausar fuera de
// viewport, reconstruir en resize y decidir contra `matchMedia` si el efecto
// anima o se queda en un frame fijo.
//
// Nada de esto es la GRACIA de ningún fondo — la máquina de estados de cada
// uno (islas de ruido, dendritas, lluvia) es propia y vive en su archivo.
// Esto es lo que se repetía idéntico en los tres y no aportaba nada al
// leerlo tres veces.
//
// El rain de HeroH3 NO usa este andamio: es anterior, funciona y comparte
// canvas con `wordReveal`, así que migrarlo era riesgo sin ganancia.

export type AsciiGrid = {
  cols: number;
  rows: number;
  cell: number;
  /** Un dígito por celda, indexado por `key(col,row)`. */
  chars: string[];
  /** El mismo PRNG sembrado que usa el andamio: un efecto que dibuje igual
   * en dos cargas tiene que tomar su azar de acá, no de `Math.random`. */
  rng: () => number;
  key: (col: number, row: number) => number;
  inBounds: (col: number, row: number) => boolean;
  /** `keep` = no borrar la celda antes, pintar ENCIMA. Es lo que permite
   * cruzar dos colores en la misma celda (dígito gris abajo, el mismo
   * dígito en verde con alpha parcial arriba). */
  draw: (col: number, row: number, style: string, keep?: boolean) => void;
  /** Cambia el dígito de una celda — el "ruido que sigue vivo" sin que la
   * celda cambie de estado. */
  reroll: (col: number, row: number) => void;
  paintBase: (style: string) => void;
};

export type AsciiFieldConditions = { motionOk: boolean; desktop: boolean };

export type AsciiFieldOptions = {
  canvas: HTMLCanvasElement;
  /** El elemento que se observa para pausar fuera de viewport. */
  scope: Element;
  seed: number;
  cell: number;
  mobileCell?: number;
  fontPx?: number;
  tickS?: number;
  /** `true` = abajo de `lg:` el efecto no anima (queda en `rest`). */
  desktopOnly?: boolean;
  /** Arma el estado del efecto y PINTA el primer frame. Corre en cada
   * construcción: al montar, en cada resize y en cada cambio de media. */
  build: (grid: AsciiGrid) => void;
  tick: (grid: AsciiGrid) => void;
  /** Frame fijo para cuando no se anima (reduced-motion, o mobile si
   * `desktopOnly`). Recibe las condiciones para poder distinguir los dos
   * casos, que casi nunca quieren lo mismo. */
  rest?: (grid: AsciiGrid, conditions: AsciiFieldConditions) => void;
  /** Celda bajo el cursor, o `null` al salir. Se llama SOLO cuando el
   * cursor cruza a una celda distinta, no por cada `pointermove` crudo: el
   * costo queda atado a cuántas celdas cruza el mouse, no a la frecuencia
   * del evento nativo. */
  pointer?: (grid: AsciiGrid, at: { col: number; row: number } | null) => void;
};

export function mountAsciiField(opts: AsciiFieldOptions): () => void {
  const { canvas, scope, seed, fontPx = 11, tickS = 0.1 } = opts;
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  const rng = createSeededRandom(seed);

  const key = (col: number, row: number) => row * grid.cols + col;
  const inBounds = (col: number, row: number) =>
    col >= 0 && col < grid.cols && row >= 0 && row < grid.rows;

  const draw = (col: number, row: number, style: string, keep = false) => {
    const x = col * grid.cell;
    const y = row * grid.cell;
    if (!keep) ctx.clearRect(x, y, grid.cell, grid.cell);
    ctx.font = monoFont(fontPx);
    ctx.textBaseline = "top";
    ctx.fillStyle = style;
    ctx.fillText(grid.chars[key(col, row)], x + 2, y + 2);
  };

  const reroll = (col: number, row: number) => {
    grid.chars[key(col, row)] = pickDigit(rng);
  };

  const paintBase = (style: string) => {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    ctx.font = monoFont(fontPx);
    ctx.textBaseline = "top";
    ctx.fillStyle = style;
    for (let r = 0; r < grid.rows; r++) {
      for (let c = 0; c < grid.cols; c++) {
        ctx.fillText(grid.chars[key(c, r)], c * grid.cell + 2, r * grid.cell + 2);
      }
    }
  };

  const grid: AsciiGrid = {
    cols: 0,
    rows: 0,
    cell: opts.cell,
    chars: [],
    rng,
    key,
    inBounds,
    draw,
    reroll,
    paintBase,
  };

  let conditions: AsciiFieldConditions = { motionOk: true, desktop: true };
  let animating = false;
  let visible = true;
  let acc = 0;
  let lastT = 0;
  let hoverKey = -2;

  const build = () => {
    grid.cell =
      opts.mobileCell && window.matchMedia(MQ.mobile).matches ? opts.mobileCell : opts.cell;
    const dpr = deviceRatio(1.5);
    const { width, height } = setupCanvas(canvas, dpr);
    grid.cols = Math.max(1, Math.floor(width / grid.cell));
    grid.rows = Math.max(1, Math.floor(height / grid.cell));
    grid.chars = new Array(grid.cols * grid.rows);
    for (let i = 0; i < grid.chars.length; i++) grid.chars[i] = pickDigit(rng);
    opts.build(grid);
  };

  const onFrame = (time: number) => {
    const dt = time - lastT;
    lastT = time;
    if (!visible || !animating) return;
    acc += dt;
    if (acc >= tickS) {
      acc = 0;
      opts.tick(grid);
    }
  };

  gsap.ticker.add(onFrame);
  onViewportToggle(scope, (v) => {
    visible = v;
  });

  const onPointerMove = (e: PointerEvent) => {
    const box = canvas.getBoundingClientRect();
    const col = Math.floor((e.clientX - box.left) / grid.cell);
    const row = Math.floor((e.clientY - box.top) / grid.cell);
    const k = inBounds(col, row) ? key(col, row) : -1;
    if (k === hoverKey) return;
    hoverKey = k;
    opts.pointer?.(grid, k === -1 ? null : { col, row });
  };
  const onPointerLeave = () => {
    if (hoverKey === -1) return;
    hoverKey = -1;
    opts.pointer?.(grid, null);
  };
  if (opts.pointer) {
    canvas.addEventListener("pointermove", onPointerMove, { passive: true });
    canvas.addEventListener("pointerleave", onPointerLeave, { passive: true });
  }

  const ro = new ResizeObserver(() => {
    build();
    if (!animating) opts.rest?.(grid, conditions);
  });
  ro.observe(canvas);

  const mm = gsap.matchMedia();
  mm.add({ motionOk: MQ.motion, desktop: MQ.desktop }, (mctx) => {
    conditions = mctx.conditions as AsciiFieldConditions;
    build();
    animating = conditions.motionOk && (!opts.desktopOnly || conditions.desktop);
    if (!animating) opts.rest?.(grid, conditions);
  });

  return () => {
    gsap.ticker.remove(onFrame);
    canvas.removeEventListener("pointermove", onPointerMove);
    canvas.removeEventListener("pointerleave", onPointerLeave);
    ro.disconnect();
    mm.revert();
  };
}
