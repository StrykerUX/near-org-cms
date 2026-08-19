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
    stack: "CSS + GSAP · no canvas",
    hero: "The headline is born at 2.6× and the scroll pulls it back while a circular clip-path opens a blind of slats.",
    second: "The slats survive the cut: they regroup and flatten out behind the statement.",
  },
  {
    id: "flow",
    index: "02",
    title: "Flow",
    stack: "WebGL2 · custom shader",
    hero: "A curl-noise flow field. What accelerates it is not time, it is the SPEED of the scroll.",
    second: "The same field, quantised into seven columns: the bars are the field read at low resolution.",
  },
  {
    id: "shatter",
    index: "03",
    title: "Shatter",
    stack: "SplitText + 3D transforms",
    hero: "Every character arrives from its own position in Z, with rotation. Leaving the hero it scatters again.",
    second: "The statement types itself out like a ticker, with the cursor running along the mask.",
  },
  {
    id: "glass",
    index: "04",
    title: "Glass",
    stack: "WebGL2 + text texture",
    hero: "A panel of glass refracts the gradient behind it. The glass normal follows the pointer, computed analytically so it does not cost three evaluations per pixel.",
    second: "Seven columns of glass with different refraction indices over the statement.",
  },
  {
    id: "lattice",
    index: "05",
    title: "Lattice",
    stack: "Canvas 2D",
    hero: "A lattice of dots collapses on mount into the silhouette of the headline, sampled from the text itself; the headline appears when the cloud lands.",
    second: "The dots fall by column and pack themselves into the bars.",
  },
  {
    id: "cutout",
    index: "06",
    title: "Cutout",
    stack: "Canvas 2D + the v5 clip",
    hero: "The v5 video visible ONLY inside the glyphs: the descent runs through the letters, scrubbed with the scroll.",
    second: "The same clip, masked to the seven columns. The bars are not grey: they are the video.",
  },
];
