// El rótulo de cada transición del laboratorio.
//
// Módulo puro, sin JSX: lo consumen el shell de cada ruta, el índice y la
// metadata de las páginas.
//
// Las CINCO resuelven el mismo problema: el corte entre «Own Your Own» (cream)
// y «The NEAR Stack» (ink). Lo que cambia es el mecanismo y lo que cuesta.

export type TransitionId = "wipe" | "counter" | "ascii" | "lattice" | "column";

export type TransitionSpec = {
  readonly id: TransitionId;
  readonly index: string;
  readonly title: string;
  readonly cost: string;
  readonly stack: string;
  readonly pitch: string;
};

export const TRANSITIONS: readonly TransitionSpec[] = [
  {
    id: "wipe",
    index: "A",
    title: "Wipe",
    cost: "160svh",
    stack: "CSS + GSAP, cero canvas",
    pitch:
      "El negro SUBE y tapa: un telón que entra desde abajo mientras la página de arriba se queda quieta. Es el gesto del takeover del footer, traído al corte entre secciones. La más barata de las cinco y la única que funciona igual en cualquier máquina.",
  },
  {
    id: "counter",
    index: "B",
    title: "Counterform",
    cost: "180svh",
    stack: "medición del DOM + transform",
    pitch:
      "El agujero de la «O» se traga la página. La palabra que cierra la sección de arriba se repite a tamaño de póster y su contraforma crece hasta cubrir la pantalla: el negro no llega de afuera, sale de DENTRO de la tipografía. Es el mecanismo del hero de los drafts EX.",
  },
  {
    id: "ascii",
    index: "C",
    title: "ASCII",
    cost: "200svh",
    stack: "WebGL2, el shader de EX3",
    pitch:
      "La página se vuelve texto. Un campo de caracteres arranca casi invisible sobre el cream y, a medida que se scrollea, se DENSIFICA desde el centro y la paleta entera rueda a negro con los glifos en verde. Lo que entrega al stack ya es su propio fondo.",
  },
  {
    id: "lattice",
    index: "D",
    title: "Lattice",
    cost: "160svh",
    stack: "Canvas 2D, el motor de hero-alt 05",
    pitch:
      "~2600 puntos colapsan y deletrean «The NEAR Stack» justo cuando el fondo termina de irse a negro. El título de la sección siguiente lo escriben las partículas antes de que la sección exista.",
  },
  {
    id: "column",
    index: "E",
    title: "Column",
    cost: "180svh",
    stack: "el arte del stack + máscara",
    pitch:
      "La columna del stack SUBE desde abajo y se trae el negro con ella: el fondo oscuro no es un telón aparte, es lo que la pieza va dejando atrás. La única de las cinco en la que el objeto de la sección siguiente es el que hace la transición.",
  },
];
