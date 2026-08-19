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
      "Doce lamas inclinadas a 30.79° — el ángulo real de la cara superior del cubo del stack— entran escalonadas sobre la sección de arriba, que se sigue viendo entre lama y lama. La geometría del corte es la del objeto al que lleva, y los doce bordes llegan a destiempo.",
  },
  {
    id: "fold",
    index: "G",
    title: "Fold",
    cost: "20svh",
    stack: "CSS 3D + GSAP",
    current: true,
    pitch:
      "La página se pliega hacia atrás sobre su borde inferior y detrás aparece la sección siguiente, que estaba ahí todo el tiempo. La cara se apaga con el coseno del giro, como una hoja real girando fuera de la luz: sin esa sombra se lee como un rectángulo achicándose.",
  },
  {
    id: "mosaic",
    index: "H",
    title: "Mosaic",
    cost: "50svh",
    stack: "Canvas 2D",
    current: true,
    pitch:
      "La pantalla no se cubre de golpe: se reemplaza por partes. Celdas que se posan de abajo hacia arriba, en un orden de ruido determinista — sube y baja y el mosaico se rearma igual, que es lo que un orden al azar no puede dar.",
  },
  {
    id: "halftone",
    index: "I",
    title: "Halftone",
    cost: "50svh",
    stack: "Canvas 2D",
    current: true,
    pitch:
      "La página se imprime. Trama de medio tono girada 45° como en imprenta de verdad, posada SOBRE la sección de arriba —que se ve entre los puntos— y engordando hasta tocarse. El gesto más editorial de los siete: habla el mismo idioma que el titular en serif, no el de la tecnología.",
  },
  {
    id: "melt",
    index: "J",
    title: "Melt",
    cost: "50svh",
    stack: "Canvas 2D",
    current: true,
    pitch:
      "La tinta inunda la página desde el pie con un frente irregular: dedos que se adelantan, bahías que se quedan, y por encima la sección de arriba hasta que la alcanza. El único de los siete en el que el corte tiene materia — los demás son geometría, este es un fluido.",
  },
  {
    id: "chapter",
    index: "K",
    title: "Chapter",
    cost: "90svh",
    stack: "CSS + GSAP",
    current: true,
    pitch:
      "El rótulo del capítulo —«02 · The NEAR Stack»— aparece en medio del cambio de fondo, se queda quieto lo justo para leerse, y se va. El único que sirve a la página entera y no a este corte: con uno en cada frontera, el documento gana un índice que se ve al scrollear.",
  },
  {
    id: "sidestep",
    index: "L",
    title: "Sidestep",
    cost: "30svh",
    stack: "CSS + GSAP",
    current: true,
    pitch:
      "La sección siguiente entra por el lado. Toda la página baja; en este corte, y solo en este, se mueve en horizontal. Sin secuestrar la rueda: lo que se desplaza es el velo, y detrás queda la sección.",
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
      "El negro sube y tapa. El gesto del takeover del footer, entre secciones.",
  },
  {
    id: "counter",
    index: "B",
    title: "Counterform",
    cost: "80svh",
    stack: "medir el DOM + transform",
    current: false,
    pitch:
      "El agujero de la «O» se traga la página: el negro sale de dentro de la tipografía.",
  },
  {
    id: "ascii",
    index: "C",
    title: "ASCII",
    cost: "100svh",
    stack: "WebGL2, el shader de EX3",
    current: false,
    pitch:
      "Un campo de caracteres se densifica desde el centro y la paleta rueda a negro con los glifos en verde.",
  },
  {
    id: "lattice",
    index: "D",
    title: "Lattice",
    cost: "60svh",
    stack: "Canvas 2D, el motor de hero-alt 05",
    current: false,
    pitch:
      "~2600 puntos deletrean «The NEAR Stack» cuando el fondo termina de irse a negro.",
  },
  {
    id: "column",
    index: "E",
    title: "Column",
    cost: "80svh",
    stack: "el arte del stack",
    current: false,
    pitch: "La columna del stack sube y se trae el negro con ella.",
  },
];
