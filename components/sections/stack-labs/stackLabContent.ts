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
  {
    id: "axis",
    index: "F",
    title: "Axis",
    travel: "260svh · sticky, siete paradas",
    pitch:
      "El rótulo de la parada activa a tamaño de póster, acostado sobre el plano isométrico del ensamble (skew de 30.79°, el ángulo real de la cara superior del cubo). Una palabra por parada — siete, con nombre propio para cada producto de AI — y el párrafo abajo, derecho, para que se pueda leer.",
  },
  {
    id: "triptych",
    index: "G",
    title: "Triptych",
    travel: "280svh · sticky, siete paradas",
    pitch:
      "Tres columnas: el índice de capas a la izquierda, el ensamble al centro dentro de su marco, y el cuerpo de la capa activa a la derecha. La activa no se marca con color sino con TAMAÑO — el estado de la sección se lee sin mirar el arte.",
  },
  {
    id: "dolly",
    index: "H",
    title: "Dolly",
    travel: "300svh · sticky, siete planos",
    pitch:
      "El cruce de A y E: el arte a sangre y las capas como renglones (de A) más la cámara que cambia de plano en cada parada (de E). Sin pantalla partida — el visor son los bordes de la ventana, así que no se mira una cámara: se está dentro.",
  },
];
