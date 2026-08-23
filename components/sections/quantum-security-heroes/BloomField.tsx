"use client";

import { useRef } from "react";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { mountAsciiField, type AsciiGrid } from "@/components/sections/quantum-security-heroes/asciiCanvas";

const CELL = 15;
const MOBILE_CELL = 22;
const DIM_RGBA = "rgba(17,17,17,0.3)";
const GREEN_RGB = "0,220,141"; // = --near-green-accent, el mismo verde de toda la página

const T_STEP = 0.085; // cuánto avanza el campo por tick — el "viento" de las islas
const BAND = 0.155; // medio ancho de la franja de valores que se enciende
const EDGE_FEATHER = 8; // celdas en las que la banda se cierra contra el borde del campo
const HOVER_RADIUS = 8.5; // celdas de alcance del cursor
const HOVER_GAIN = 1.6; // cuánto ensancha la banda en el centro del cursor
const FLICKER_SHARE = 0.02; // celdas encendidas que re-tiran su dígito por tick

// Fondo de HeroH2 — "bloom": islas de verde que se forman, derivan, se
// funden entre sí y se disuelven. Reemplaza a las tuberías (`PipesField`,
// borrado 2026-08-23: el equipo pidió rehacerlo de cero).
//
// No hay partículas ni entidades: hay un CAMPO. Cada celda evalúa una suma
// de cuatro senos de frecuencias y derivas distintas —ruido de valor barato,
// sin librería— y se enciende según qué tan cerca esté su valor de la mitad
// de la franja. Como la franja es un rango y no un umbral, el borde de cada
// isla sale con alpha parcial: aparece y desaparece en rampa, nunca de
// golpe, y la silueta no puede ser recta porque no la dibuja nadie — la deja
// el ruido.
//
// Las cuatro capas están en frecuencias que no son múltiplos entre sí (0.13,
// 0.17, 0.09, 0.07) justamente para que el patrón no se cierre sobre sí
// mismo: si se repitiera, se leería el loop.
//
// `EDGE_FEATHER` cierra la banda contra los cuatro bordes del canvas para
// que las islas no queden cortadas por una línea recta; del lado izquierdo,
// además, la máscara en gradiente del wrapper las desvanece contra el texto.
// Esa máscara es DIAGONAL (2026-08-23): en horizontal pura, sus curvas de
// nivel eran rectas verticales de alto completo y se leía una raya que
// cruzaba la sección de arriba abajo.
//
// El panel ocupa el 78% del ancho desde la derecha, no el 46% con el que
// nació: con 46% el campo terminaba en el canto vertical de su propia caja
// a mitad de pantalla, y la máscara diagonal no tenía nada que recortar de
// ese lado. Ahora el borde que se ve es el del degradado, no el del panel.
//
// Interactivo: el cursor no dibuja nada propio — ENSANCHA la banda a su
// alrededor, así que la masa florece donde pasás con la forma que el ruido
// ya tenía ahí. Un disco de brillo se leería como un objeto pegado encima;
// esto se lee como el campo reaccionando.
//
// El campo entero se repinta en cada tick — acá sí, a diferencia del rain de
// HeroH3: no hay "celdas que cambiaron", cambian todas un poco. Son 10 veces
// por segundo, no 60.
export default function BloomField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const rootRef = useGsapContext<HTMLDivElement>((_self, scope) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let t = 0;
    let hover: { col: number; row: number } | null = null;

    const smooth = (x: number) => {
      const v = Math.min(1, Math.max(0, x));
      return v * v * (3 - 2 * v);
    };

    // Ruido de valor: cuatro senos cruzados, normalizado a 0..1.
    const fieldAt = (col: number, row: number) => {
      const v =
        Math.sin(col * 0.13 + t * 0.7) * 0.5 +
        Math.sin(row * 0.17 - t * 0.5) * 0.5 +
        Math.sin((col + row) * 0.09 + t * 0.31) * 0.6 +
        Math.sin((col - row) * 0.07 - t * 0.23) * 0.6;
      return v / 4.4 + 0.5;
    };

    const edgeFade = (grid: AsciiGrid, col: number, row: number) => {
      const d = Math.min(col, row, grid.cols - 1 - col, grid.rows - 1 - row);
      return smooth(d / EDGE_FEATHER);
    };

    const hoverBoost = (col: number, row: number) => {
      if (!hover) return 0;
      const dx = col - hover.col;
      const dy = row - hover.row;
      const d2 = dx * dx + dy * dy;
      return Math.exp(-d2 / (2 * HOVER_RADIUS * HOVER_RADIUS));
    };

    const paint = (grid: AsciiGrid) => {
      for (let r = 0; r < grid.rows; r++) {
        for (let c = 0; c < grid.cols; c++) {
          grid.draw(c, r, DIM_RGBA);
          const band = BAND * edgeFade(grid, c, r) * (1 + HOVER_GAIN * hoverBoost(c, r));
          if (band <= 0) continue;
          const alpha = smooth(1 - Math.abs(fieldAt(c, r) - 0.5) / band);
          if (alpha > 0.02) grid.draw(c, r, `rgba(${GREEN_RGB},${alpha.toFixed(3)})`, true);
        }
      }
    };

    return mountAsciiField({
      canvas,
      scope,
      seed: 5170,
      cell: CELL,
      mobileCell: MOBILE_CELL,
      desktopOnly: true,
      build: (grid) => paint(grid),
      tick: (grid) => {
        t += T_STEP;
        // Parpadeo: un puñado de celdas re-tira su dígito sin cambiar de
        // estado — el ruido sigue vivo aunque la isla esté quieta.
        const flickers = Math.round(grid.cols * grid.rows * FLICKER_SHARE);
        for (let i = 0; i < flickers; i++) {
          grid.reroll(Math.floor(grid.rng() * grid.cols), Math.floor(grid.rng() * grid.rows));
        }
        paint(grid);
      },
      // Con reduced-motion queda un frame de islas quieto (es contenido, no
      // movimiento). En mobile el campo cae detrás del texto a ancho
      // completo, así que ahí solo queda el ruido base.
      rest: (grid, conditions) => {
        if (conditions.desktop) paint(grid);
        else grid.paintBase(DIM_RGBA);
      },
      pointer: (grid, at) => {
        hover = at;
        paint(grid);
      },
    });
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 right-0 z-0 w-full overflow-hidden lg:w-[78%] lg:[mask-image:var(--bloom-fade)] lg:[-webkit-mask-image:var(--bloom-fade)]"
      style={{
        // Eje del degradado: de arriba a la izquierda hacia la mitad del
        // borde inferior de la sección. En una sección de 16:9 ese vector
        // cae a ~141deg; 145 es el redondeo, y como el ángulo va contra la
        // caja del panel y no contra la de la sección, es una aproximación
        // fija — no se puede atar a la proporción del viewport desde CSS.
        // Sigue siendo recto y lineal, pero sus curvas de nivel quedan
        // inclinadas en vez de ser verticales de alto completo.
        //
        // La rampa se queda casi en cero durante el primer tercio y recién
        // ahí sube: el panel entra bien por debajo de la columna de texto
        // (78% del ancho), así que ese tramo plano es lo que la mantiene
        // limpia. Si el degradado subiera parejo desde 0%, el campo
        // asomaría detrás del titular y del CTA.
        ["--bloom-fade" as string]:
          "linear-gradient(145deg, transparent 0%, rgba(0,0,0,0.01) 20%, rgba(0,0,0,0.04) 32%, rgba(0,0,0,0.1) 42%, rgba(0,0,0,0.2) 52%, rgba(0,0,0,0.34) 62%, rgba(0,0,0,0.52) 72%, rgba(0,0,0,0.72) 82%, rgba(0,0,0,0.89) 91%, #000 100%)",
      }}
    >
      <canvas ref={canvasRef} className="block size-full pointer-events-auto" />
    </div>
  );
}
