// El rótulo de cada transición del laboratorio.
//
// Módulo puro, sin JSX: lo consumen el shell de cada ruta, el índice y la
// metadata de las páginas.
//
// TODAS resuelven el mismo problema: el corte entre «Own Your Own» (cream) y
// «The NEAR Stack» (ink). Lo que cambia es el mecanismo y lo que cuesta.
//
// ── Dos tandas ──────────────────────────────────────────────────────────────
//
// A–E fueron la primera, y quedaron DESCARTADAS: cuatro de las cinco son la
// misma idea —algo negro llega y cubre la pantalla— y ninguna lleva contenido
// ni conecta las dos secciones. Se conservan porque un laboratorio sin lo que
// se descartó obliga a volver a proponerlo.
//
// F–L son la segunda, y todas montan sobre `SectionCut`: el solape, el
// progreso y la degradación sin motion viven ahí, y cada variante solo aporta
// el dibujo. Cambiar la transición de un corte es cambiar un componente.

export type TransitionId =
  | "wipe"
  | "counter"
  | "ascii"
  | "lattice"
  | "column"
  | "slats"
  | "fold"
  | "mosaic"
  | "halftone"
  | "melt"
  | "chapter"
  | "sidestep";

export type TransitionSpec = {
  readonly id: TransitionId;
  readonly index: string;
  readonly title: string;
  /** Coste NETO en scroll: el tramo menos el solape de atrás y el de adelante. */
  readonly cost: string;
  readonly stack: string;
  readonly pitch: string;
  /** false = primera tanda, descartada. */
  readonly current: boolean;
};

export const TRANSITIONS: readonly TransitionSpec[] = [
  /* ── Segunda tanda ───────────────────────────────────────────────────── */
  {
    id: "slats",
    index: "F",
    title: "Slats",
    cost: "50svh",
    stack: "CSS + GSAP",
    current: true,
    pitch:
      "Twelve slats tilted to 30.79° — the real angle of the top face of the stack's cube — come in staggered over the section above, which stays visible between one slat and the next. The geometry of the cut is that of the object it leads to, and the twelve edges arrive off-beat.",
  },
  {
    id: "fold",
    index: "G",
    title: "Fold",
    cost: "20svh",
    stack: "CSS 3D + GSAP",
    current: true,
    pitch:
      "The page folds backwards on its bottom edge and behind it is the next section, which was there all along. The face dims with the cosine of the turn, like a real sheet rotating out of the light: without that shading it reads as a rectangle shrinking.",
  },
  {
    id: "mosaic",
    index: "H",
    title: "Mosaic",
    cost: "50svh",
    stack: "Canvas 2D",
    current: true,
    pitch:
      "The screen is not covered in one go: it is replaced piece by piece. Cells land from the bottom up in a deterministic noise order — scroll back and forth and the mosaic rebuilds itself the same way, which is what a random order cannot give.",
  },
  {
    id: "halftone",
    index: "I",
    title: "Halftone",
    cost: "50svh",
    stack: "Canvas 2D",
    current: true,
    pitch:
      "The page prints itself. A halftone screen rotated 45° as in real print, laid OVER the section above —visible between the dots— and fattening until the dots touch. The most editorial gesture of the seven: it speaks the same language as the serif headline, not that of the technology.",
  },
  {
    id: "melt",
    index: "J",
    title: "Melt",
    cost: "50svh",
    stack: "Canvas 2D",
    current: true,
    pitch:
      "The ink floods the page from the foot with an uneven front: fingers running ahead, bays lagging behind, and above it the section that was there until the ink reaches it. The only one of the seven where the cut has matter — the rest are geometry, this one is a fluid.",
  },
  {
    id: "chapter",
    index: "K",
    title: "Chapter",
    cost: "90svh",
    stack: "CSS + GSAP",
    current: true,
    pitch:
      "The chapter label —«02 · The NEAR Stack»— appears in the middle of the background change, holds still just long enough to be read, and leaves. The only one that serves the whole page and not this one cut: with one at every boundary, the document gains an index you can see while scrolling.",
  },
  {
    id: "sidestep",
    index: "L",
    title: "Sidestep",
    cost: "30svh",
    stack: "CSS + GSAP",
    current: true,
    pitch:
      "The next section enters from the side. The whole page goes down; in this cut, and only in this one, it moves sideways. Without hijacking the wheel: what travels is the veil, and the section is what stays behind it.",
  },

  /* ── Primera tanda · descartadas ─────────────────────────────────────── */
  {
    id: "wipe",
    index: "A",
    title: "Wipe",
    cost: "60svh",
    stack: "CSS + GSAP",
    current: false,
    pitch:
      "The black rises and covers. The footer takeover gesture, between sections.",
  },
  {
    id: "counter",
    index: "B",
    title: "Counterform",
    cost: "80svh",
    stack: "DOM measurement + transform",
    current: false,
    pitch:
      "The hole in the «O» swallows the page: the black comes out from inside the type.",
  },
  {
    id: "ascii",
    index: "C",
    title: "ASCII",
    cost: "100svh",
    stack: "WebGL2, the EX3 shader",
    current: false,
    pitch:
      "A character field thickens from the centre and the palette rolls to black with the glyphs in green.",
  },
  {
    id: "lattice",
    index: "D",
    title: "Lattice",
    cost: "60svh",
    stack: "Canvas 2D, the hero-alt 05 engine",
    current: false,
    pitch:
      "~2600 dots spell «The NEAR Stack» as the background finishes going black.",
  },
  {
    id: "column",
    index: "E",
    title: "Column",
    cost: "80svh",
    stack: "the stack art",
    current: false,
    pitch: "The stack column rises and brings the black up with it.",
  },
];
