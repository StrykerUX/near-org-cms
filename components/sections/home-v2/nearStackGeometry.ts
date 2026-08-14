// Geometría del objeto isométrico de NearStack.
//
// Módulo PURO: sin "use client", sin DOM, sin Math.random ni Date. Se evalúa una
// sola vez al importarlo —también del lado del servidor— y su salida son datos
// congelados. El componente solo mapea a JSX.
//
// Port de `prism()` de effects.js. El original construía el SVG con
// document.createElementNS en tiempo de render; acá se calcula la lista de caras
// y React la pinta. Como los polígonos de entrada son CONSTANTES, toda la salida
// también lo es.
//
// ── Por qué un módulo y no un script que escriba un .ts generado ─────────────
// Son ~35 paths de aritmética trivial: el costo de calcularlos es despreciable
// frente al de mantener un artefacto generado, que sería una segunda fuente de
// verdad. Alguien tocaría U_FRONT, se olvidaría de regenerar, y el SVG quedaría
// viejo en silencio dentro de un archivo de datos que nadie mira en el diff.
//
// ── El toFixed(1) NO es cosmético ────────────────────────────────────────────
// Los `d` se calculan en el servidor y se comparan con los del cliente al
// hidratar. Sin redondeo fijo, cualquier diferencia de formateo de float da un
// warning de mismatch por cada path.

type Pt = readonly [number, number];

/** Proyección isométrica: planta (x, y) + altura z → coordenadas de pantalla. */
const iso = (x: number, y: number, z: number): Pt => [(x - y) * 0.866, (x + y) * 0.5 - z];

const pathD = (pts: readonly Pt[]) =>
  "M" + pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join("L") + "Z";

const rectPlan = (x1: number, y1: number, x2: number, y2: number): Pt[] => [
  [x1, y1],
  [x2, y1],
  [x2, y2],
  [x1, y2],
];

/** Qué gradiente le toca a la cara. Solo se usa en la pieza `core`. */
export type FaceRole = "top" | "right" | "left";

export type Face = {
  /** atributo `d`, ya formateado */
  readonly d: string;
  readonly role: FaceRole;
};

/**
 * Prisma oblicuo con back-face culling.
 *
 * Para cada arista de la planta se genera una cara lateral, y se DESCARTA si
 * mira en dirección contraria al observador. Eso es lo que hace que los
 * volúmenes se lean como bloques sólidos —sin costuras internas— y oculten de
 * verdad lo que pasa por detrás.
 *
 * `planTop` distinto de `planBot` inclina el prisma (solo lo usa el núcleo).
 */
function prism(planBot: readonly Pt[], planTop: readonly Pt[] | null, z0: number, z1: number): Face[] {
  let bot = planBot;
  let top = planTop ?? planBot;

  // Se fuerza orientación antihoraria para que las normales salgan todas hacia
  // afuera; con orientación mixta el culling descartaría las caras equivocadas.
  let area = 0;
  for (let i = 0; i < bot.length; i++) {
    const a = bot[i];
    const b = bot[(i + 1) % bot.length];
    area += a[0] * b[1] - b[0] * a[1];
  }
  if (area < 0) {
    bot = bot.slice().reverse();
    top = top.slice().reverse();
  }

  const n = bot.length;
  const sides: { depth: number; nx: number; pts: Pt[] }[] = [];

  for (let i = 0; i < n; i++) {
    const a0 = bot[i];
    const b0 = bot[(i + 1) % n];
    const a1 = top[i];
    const b1 = top[(i + 1) % n];

    // Normal hacia afuera de una arista antihoraria. En esta proyección, una
    // cara es visible cuando nx + ny > 0.
    const nx = b0[1] - a0[1];
    const ny = -(b0[0] - a0[0]);
    if (nx + ny <= 0.0001) continue;

    sides.push({
      depth: (a0[0] + a0[1] + b0[0] + b0[1]) / 2,
      nx,
      pts: [iso(a1[0], a1[1], z1), iso(b1[0], b1[1], z1), iso(b0[0], b0[1], z0), iso(a0[0], a0[1], z0)],
    });
  }

  // Painter's algorithm: las caras lejanas primero, y la tapa siempre al final.
  sides.sort((u, v) => u.depth - v.depth);

  const faces: Face[] = sides.map((f) => ({
    d: pathD(f.pts),
    role: f.nx > 0 ? ("right" as const) : ("left" as const),
  }));
  faces.push({ d: pathD(top.map((p) => iso(p[0], p[1], z1))), role: "top" });

  return faces;
}

export type PieceKind = "core" | "shell";

export type Piece = {
  /** id estable: key de React, clave de hover y de popover */
  readonly id: string;
  readonly kind: PieceKind;
  readonly faces: readonly Face[];
};

/**
 * Un grupo animable, en ORDEN DE PINTADO. El orden del array ES el z-order del
 * SVG y no se puede reordenar: los anillos tienen una parte por detrás del eje
 * central y otra por delante, y ese cruce es todo el efecto de profundidad.
 */
export type Layer = {
  /** 0..3 — coincide con el índice del item del carril de copy */
  readonly tier: number;
  readonly pieces: readonly Piece[];
};

export const VIEW_BOX = "-330 -350 660 680";

// Recentra un anillo sobre la planta del núcleo a su altura: el núcleo está
// inclinado, así que cada nivel se corre en la misma diagonal.
const sh = (pts: readonly Pt[], d: number): Pt[] => pts.map((p) => [p[0] + d, p[1] - d]);

const slant = (p: Pt): Pt => [p[0] + 42, p[1] - 42];

const CORE_PLAN = rectPlan(-36, -36, 36, 36);

// Planta en U: el frente del anillo, con los quiebres de esquina.
const U_FRONT: Pt[] = [
  [-118, -30],
  [-72, -30],
  [-72, 72],
  [72, 72],
  [72, -30],
  [118, -30],
  [118, 118],
  [-118, 118],
];

// La barra que cierra el anillo por detrás, tapada por el eje.
const BAR_BACK: Pt[] = [
  [-60, -118],
  [60, -118],
  [60, -72],
  [-60, -72],
];

// El anillo de NEAR AI se parte en tres piezas, una por producto. Herencia del
// diseño anterior (que las resaltaba por separado); hoy las tres llevan el
// mismo tier y se encienden juntas, pero partirlas sigue siendo inocuo y
// re-unirlas obligaría a recalcular el z-order.
const AI_A: Pt[] = [
  [6, 72],
  [72, 72],
  [72, -54],
  [118, -54],
  [118, 118],
  [6, 118],
];
const AI_B: Pt[] = [
  [-6, 72],
  [-6, 118],
  [-118, 118],
  [-118, -54],
  [-72, -54],
  [-72, 72],
];
const AI_C: Pt[] = [
  [-118, -66],
  [-118, -118],
  [118, -118],
  [118, -66],
  [72, -66],
  [72, -72],
  [-72, -72],
  [-72, -66],
];

const piece = (id: string, kind: PieceKind, faces: Face[]): Piece => ({ id, kind, faces });

export const LAYERS: readonly Layer[] = [
  // ── Partes traseras: se pintan ANTES del núcleo, así el eje las tapa ──
  { tier: 1, pieces: [piece("intents-back", "shell", prism(sh(BAR_BACK, 8), null, -78, -44))] },
  { tier: 2, pieces: [piece("ai-market", "shell", prism(sh(AI_C, 26), null, 20, 54))] },
  { tier: 3, pieces: [piece("com-back", "shell", prism(sh(BAR_BACK, 37), null, 76, 110))] },

  // ── El núcleo ES el tier 1 (NEAR Protocol): un cuadrado extruido e inclinado ──
  { tier: 0, pieces: [piece("core", "core", prism(CORE_PLAN, CORE_PLAN.map(slant), -100, 118))] },

  // ── Partes delanteras ──
  { tier: 1, pieces: [piece("intents-front", "shell", prism(sh(U_FRONT, 8), null, -78, -44))] },
  {
    tier: 2,
    pieces: [
      piece("ai-cloud", "shell", prism(sh(AI_A, 26), null, 20, 54)),
      piece("ai-ironclaw", "shell", prism(sh(AI_B, 26), null, 20, 54)),
    ],
  },
  { tier: 3, pieces: [piece("com-front", "shell", prism(sh(U_FRONT, 37), null, 76, 110))] },
];
