// El rótulo de cada variante del laboratorio del NEAR Stack.
//
// Módulo puro, sin JSX: lo consumen el shell de cada ruta, el índice y la
// metadata de las páginas.
//
// La COPY de la sección no está acá: sale de `home-ab7/nearStackContent.ts`
// sin tocar, que es la condición del lab — las cinco variantes dicen
// exactamente lo mismo y lo único que cambia es cómo lo muestran.

export type StackVariantId = "bleed" | "broadsheet" | "anchors" | "blueprint" | "traveling";

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
    travel: "240svh · sticky, siete paradas",
    pitch:
      "El ensamble ocupa la pantalla y se sale por el borde derecho y por el inferior: no cabe, y por eso se lee grande. Las capas dejan de ser pills y pasan a renglones tipográficos; la activa despliega su cuerpo en el sitio.",
  },
  {
    id: "broadsheet",
    index: "B",
    title: "Broadsheet",
    travel: "una pantalla · sin sticky",
    pitch:
      "Las cuatro capas completas a la vez, con los tres productos de NEAR AI en línea. Nada se abre ni se cierra: la sección es una página, no un acordeón. El arte ocupa la mitad derecha de punta a punta.",
  },
  {
    id: "anchors",
    index: "C",
    title: "Anchors",
    travel: "200svh · sticky, siete paradas",
    pitch:
      "El texto vive pegado a su capa: cada ficha se ancla a la pieza de la que habla con un trazo corto, en vez de vivir en una lista aparte. El halo saca al ensamble del negro plano.",
  },
  {
    id: "blueprint",
    index: "D",
    title: "Blueprint",
    travel: "una pantalla · sin sticky",
    pitch:
      "El stack como plano de ingeniería: retícula, líneas guía que salen de cada capa hacia su ficha y rótulos en monoespaciada. Todo anotado a la vez.",
  },
  {
    id: "traveling",
    index: "E",
    title: "Traveling",
    travel: "380svh · sticky, el más caro",
    pitch:
      "Pantalla partida: a la izquierda el arte en plano cerrado sobre la capa activa, a la derecha esa capa a tamaño de titular. El arte no cambia — cambia desde dónde se mira.",
  },
];
