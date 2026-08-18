// La copy de /prototype/hero-alt, fuera de los componentes que la pintan.
//
// Es DELIBERADAMENTE la misma de la homepage: el titular de `HeroVideo` y el
// statement de `QuantumBars`, palabra por palabra. Las cinco versiones se miran
// una detrás de otra para decidir cuál gesto queda, y con copy distinta en cada
// una la comparación mediría dos cosas a la vez.
//
// Mismo criterio de módulo puro que `home-ab7/homeAb7Content.ts`: strings y
// arrays, sin JSX, sin nada que no sobreviva un JSON.stringify. El titular no
// está acá por lo de siempre — lleva `<Accent>` y un quiebre de línea, y eso es
// una decisión del modelo de contenido, no de este refactor.

// El statement de la segunda sección. Uno solo, compartido por las cinco.
export const STATEMENT =
  "NEAR is open infrastructure powering the agent economy. Quantum-resistant and confidential by design, NEAR empowers you to trade anything anywhere and own your intelligence.";

// El rótulo de cada versión, para el divider y el índice de la página.
export type AltSpec = {
  readonly id: string;
  readonly index: string;
  readonly title: string;
  readonly stack: string;
  readonly hero: string;
  readonly second: string;
};

export const ALTS: readonly AltSpec[] = [
  {
    id: "aperture",
    index: "01",
    title: "Aperture",
    stack: "CSS + GSAP · sin canvas",
    hero: "El titular nace a 2.6× y el scroll lo retrae mientras un clip-path circular abre una persiana de lamas.",
    second: "Las lamas sobreviven al corte: se reagrupan y se aplanan detrás del statement.",
  },
  {
    id: "flow",
    index: "02",
    title: "Flow",
    stack: "WebGL2 · shader propio",
    hero: "Campo de flujo por curl noise. Lo que lo acelera no es el tiempo, es la VELOCIDAD del scroll.",
    second: "El mismo campo, cuantizado en siete columnas: las barras son el campo leído a baja resolución.",
  },
  {
    id: "shatter",
    index: "03",
    title: "Shatter",
    stack: "SplitText + transforms 3D",
    hero: "Cada carácter llega desde su propia posición en Z, con rotación. Al salir del hero se vuelve a dispersar.",
    second: "El statement se escribe como un teletipo, con el cursor recorriendo la máscara.",
  },
  {
    id: "glass",
    index: "04",
    title: "Glass",
    stack: "WebGL2 + textura de texto",
    hero: "Un panel de vidrio refracta el gradiente de atrás. La normal del vidrio sigue al puntero, con gradiente analítico para que no cueste tres evaluaciones por píxel.",
    second: "Siete columnas de vidrio con distinto índice de refracción sobre el statement.",
  },
  {
    id: "lattice",
    index: "05",
    title: "Lattice",
    stack: "Canvas 2D",
    hero: "Una retícula de puntos colapsa al montar hasta formar la silueta del titular, muestreada del propio texto; el titular aparece cuando la nube aterriza.",
    second: "Los puntos caen por columna y se compactan en las barras.",
  },
  {
    id: "cutout",
    index: "06",
    title: "Cutout",
    stack: "Canvas 2D + el clip de v5",
    hero: "El video de v5 visible SOLO dentro de los glifos: el descenso pasa por dentro de las letras, scrubbeado con el scroll.",
    second: "El mismo clip, recortado a las siete columnas. Las barras no son grises: son el video.",
  },
];
