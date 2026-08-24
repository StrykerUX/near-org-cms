// Piezas compartidas por los dos fondos ASCII hechos a medida — las
// "tuberías" de HeroH2 y el rain de HeroH3. Lo que es idéntico entre los dos
// vive acá: el pool de dígitos, la declaración de fuente del canvas (misma
// convención que protocol-labs/GlyphField.tsx — el setter
// `font` de Canvas 2D SÍ resuelve custom properties de CSS contra el estilo
// computado del propio elemento canvas, así que esto usa la fuente mono real
// en vez de duplicar su fallback stack a mano) y el dimensionado de un canvas
// a un DPR tope. La máquina de estados de cada efecto (random walk vs.
// streams por columna) es propia de cada archivo — no hay nada genérico que
// sacar de ahí sin forzar una abstracción que no comparten.

export const DIGITS = "0123456789";

export function pickDigit(rng: () => number): string {
  return DIGITS[Math.floor(rng() * DIGITS.length)];
}

export function monoFont(px: number, weight = 500): string {
  return `${weight} ${px}px var(--font-montreal-mono), ui-monospace, monospace`;
}

// Fuente de bloque 7×9 (7 columnas, 9 filas) para escribir una palabra
// DENTRO de un grid de celdas — arte ASCII de banner, no tipografía real.
// Cada entrada es una letra; cada fila es un string de 7 caracteres, "#" =
// celda encendida. Los trazos son de DOS columnas/filas de ancho: a la
// escala a la que se dibuja (a sangre del hero) una fuente de trazo simple
// se pierde contra el ruido de dígitos del fondo. Solo cubre las letras que
// este archivo necesita hoy (SECURITY) — agregar una letra es agregar una
// entrada de 9 filas acá.
const BLOCK_FONT_7X9: Record<string, string[]> = {
  S: ["#######", "#######", "##.....", "##.....", "#######", "#######", ".....##", "#######", "#######"],
  E: ["#######", "#######", "##.....", "##.....", "######.", "######.", "##.....", "#######", "#######"],
  C: ["#######", "#######", "##.....", "##.....", "##.....", "##.....", "##.....", "#######", "#######"],
  U: ["##...##", "##...##", "##...##", "##...##", "##...##", "##...##", "##...##", "#######", "#######"],
  R: ["######.", "#######", "##...##", "##...##", "#######", "######.", "##.##..", "##..##.", "##...##"],
  I: ["#######", "#######", "..##...", "..##...", "..##...", "..##...", "..##...", "#######", "#######"],
  T: ["#######", "#######", "..##...", "..##...", "..##...", "..##...", "..##...", "..##...", "..##..."],
  Y: ["##...##", "##...##", ".##.##.", "..###..", "..##...", "..##...", "..##...", "..##...", "..##..."],
};

export const BLOCK_FONT_ROWS = 9;
export const BLOCK_FONT_COLS = 7;
const BLOCK_FONT_GAP = 2;

/** Celdas "encendidas" de una palabra en coordenadas LÓGICAS (una celda de
 * font = una celda de grid; el llamador escala si quiere el bloque más
 * grande). Devuelve también el ancho/alto lógico total, letra a letra con
 * `BLOCK_FONT_GAP` columnas de separación entre una y la siguiente. */
export function blockWordCells(word: string) {
  const letters = word.toUpperCase().split("");
  const cells: { col: number; row: number }[] = [];
  let colOffset = 0;
  for (const letter of letters) {
    const glyph = BLOCK_FONT_7X9[letter];
    if (glyph) {
      for (let r = 0; r < BLOCK_FONT_ROWS; r++) {
        for (let c = 0; c < BLOCK_FONT_COLS; c++) {
          if (glyph[r][c] === "#") cells.push({ col: colOffset + c, row: r });
        }
      }
    }
    colOffset += BLOCK_FONT_COLS + BLOCK_FONT_GAP;
  }
  return { cells, width: colOffset - BLOCK_FONT_GAP, height: BLOCK_FONT_ROWS };
}

/** Ajusta el backing buffer del canvas a su caja CSS en el DPR dado, deja el
 * contexto 2D pre-escalado (las coordenadas de dibujo quedan en px CSS) y
 * devuelve el tamaño CSS real para calcular la grilla. */
export function setupCanvas(canvas: HTMLCanvasElement, dpr: number) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  canvas.width = Math.max(1, Math.round(width * dpr));
  canvas.height = Math.max(1, Math.round(height * dpr));
  const ctx = canvas.getContext("2d");
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, width, height };
}
