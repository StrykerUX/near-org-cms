// Las cinco direcciones, descritas una sola vez.
//
// Las cuatro páginas de comparación muestran las MISMAS cinco direcciones en el
// MISMO orden, y ese orden es parte de la comparación: quien recorra las cuatro
// páginas tiene que encontrar `grid` siempre primero y `slab` siempre última, o
// deja de poder comparar entre páginas y solo compara adentro de cada una.
//
// Con la descripción copiada en cuatro views, la primera corrección entra en
// una y las otras tres empiezan a mentir. Acá vive una vez.

export type Direction = {
  /** El nombre de la carpeta. Es también como se la nombra en una conversación. */
  name: string;
  /** La referencia de la que salió. */
  source: string;
  /** Qué está probando, en una línea. */
  note: string;
};

export const DIRECTIONS: readonly Direction[] = [
  {
    name: "grid",
    source: "armory.framer.ai",
    note: "Retícula visible a sangre: cuatro columnas de filetes que atraviesan la página, mono para todo rótulo, y ni una esquina redondeada. Nada flota — todo ocupa una celda.",
  },
  {
    name: "reveal",
    source: "alura · spartan · armory",
    note: "Sin cajas: papel, texto y una plica numerada al margen. El párrafo se enciende palabra por palabra al ritmo del scroll, que es el device que las tres referencias repiten.",
  },
  {
    name: "card",
    source: "alura.framer.website",
    note: "Fichas blancas sobre gris, con el numeral fantasma cortado por el borde superior y las cuatro marcas de registro en las esquinas. Las puertas se vuelven un acordeón horizontal.",
  },
  {
    name: "night",
    source: "dreammotion.framer.website",
    note: "Negro, cards de un punto más claro con filete al 10%, píldora de rótulo con punto verde y titular en serif a dos tonos. El único tramo donde el verde de marca aparece como luz.",
  },
  {
    name: "slab",
    source: "spartanai.framer.website",
    note: "Cada sección es una losa de canto blando apoyada sobre el suelo de la página, alternando oscura y clara. Adentro, tablas separadas por filetes en vez de cajas.",
  },
];
