// El rótulo de cada variante del laboratorio del NEAR Stack.
//
// Módulo puro, sin JSX: lo consumen el shell de cada ruta, el índice y la
// metadata de las páginas.
//
// La COPY de la sección no está acá: sale de `home-ab7/nearStackContent.ts`
// sin tocar, que es la condición del lab — las cinco variantes dicen
// exactamente lo mismo y lo único que cambia es cómo lo muestran.

export type StackVariantId =
  | "bleed"
  | "broadsheet"
  | "anchors"
  | "blueprint"
  | "traveling"
  | "axis"
  | "triptych"
  | "dolly";

export type StackVariantSpec = {
  readonly id: StackVariantId;
  readonly index: string;
  readonly title: string;
  readonly travel: string;
  readonly pitch: string;
};

export const STACK_LAB_VARIANTS: readonly StackVariantSpec[] = [
  {
    id: "bleed",
    index: "A",
    title: "Bleed",
    travel: "240svh · sticky, seven stops",
    pitch:
      "The assembly fills the screen and runs off the right and bottom edges: it does not fit, and that is why it reads big. The layers stop being pills and become typographic lines; the active one opens its body in place.",
  },
  {
    id: "broadsheet",
    index: "B",
    title: "Broadsheet",
    travel: "one screen · no sticky",
    pitch:
      "All four layers complete at once, with the three NEAR AI products in a row. Nothing opens and nothing closes: the section is a page, not an accordion. The art fills the right half end to end.",
  },
  {
    id: "anchors",
    index: "C",
    title: "Anchors",
    travel: "200svh · sticky, seven stops",
    pitch:
      "The text lives pinned to its layer: each card anchors to the piece it talks about with a short stroke, instead of sitting in a separate list. The halo lifts the assembly off the flat black.",
  },
  {
    id: "blueprint",
    index: "D",
    title: "Blueprint",
    travel: "one screen · no sticky",
    pitch:
      "The stack as an engineering drawing: a grid, leader lines running from each layer to its card, and monospaced labels. Everything annotated at once.",
  },
  {
    id: "traveling",
    index: "E",
    title: "Traveling",
    travel: "380svh · sticky, the priciest",
    pitch:
      "Split screen: the art in close-up on the active layer to the left, that layer at headline size to the right. The art does not change — what changes is where you look from.",
  },
  {
    id: "axis",
    index: "F",
    title: "Axis",
    travel: "260svh · sticky, seven stops",
    pitch:
      "The label of the active stop at poster size, lying on the assembly's isometric plane (a 30.79° skew, the real angle of the cube's top face). One word per stop — seven, each AI product with a name of its own — and the paragraph below, upright, so it can be read.",
  },
  {
    id: "triptych",
    index: "G",
    title: "Triptych",
    travel: "280svh · sticky, seven stops",
    pitch:
      "Three columns: the layer index on the left, the assembly in the centre inside its frame, and the body of the active layer on the right. The active one is marked with SIZE and not colour — the state of the section reads without looking at the art.",
  },
  {
    id: "dolly",
    index: "H",
    title: "Dolly",
    travel: "300svh · sticky, seven shots",
    pitch:
      "The crossing of A and E: bleeding art with the layers as lines (from A) plus the camera that changes shot at every stop (from E). No split screen — the viewfinder is the window's own edges, so you are not looking at a camera: you are inside it.",
  },
];
