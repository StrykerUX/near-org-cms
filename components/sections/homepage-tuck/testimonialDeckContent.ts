// Lo que otros dicen de NEAR — la copy de `TestimonialDeck`.
//
// ⚠️ CITAS SIN VERIFICAR. Leer esto antes de sacar la sección de /prototype.
//
// Los cuatro nombres y sus roles vienen del artboard ("Saying about.png"), y
// las citas están en tres estados distintos que conviene no confundir:
//
//   · Austin Federa y Josh Swihart — la cita se lee ENTERA en el artboard y
//     está transcrita palabra por palabra.
//   · Hunter Horsley y Mumtaz — la card los muestra tapados por la de adelante
//     y solo se lee un fragmento ("…bet against NEAR." / "still feels like the
//     …ated team in cr…"). Lo que está acá es una RECONSTRUCCIÓN de ese
//     fragmento, no una transcripción.
//   · Josh Swihart no tiene rol: el artboard dice literalmente "Company xxx".
//
// Son cuatro personas reales y esto va a una página pública, así que las dos
// reconstrucciones y el rol faltante se reemplazan con la fuente delante —el
// tweet, el post, donde se haya dicho— antes de publicar. Poner palabras
// aproximadas en boca de alguien con nombre y apellido no es un detalle de
// copy pendiente, es una cita falsa.
//
// ── Por qué la cita es UNA sola por persona ────────────────────────────────
//
// El artboard muestra a Austin Federa con dos textos distintos: uno grande a la
// izquierda ("Their AI work…") y otro dentro de su card ("Mad respect…"). Son
// dos, y la sección tiene una sola: la columna de la izquierda es la card de
// adelante leída en voz alta, no un texto aparte. Si fueran dos, el mazo dejaría
// de ser el índice de lo que se está leyendo y pasaría a ser decoración al lado
// de una cita fija — que es justo lo que la profundidad del mazo viene a
// contradecir. La de la card de Federa se le asignó a Swihart, que es la otra
// que el artboard muestra completa.

export type Testimonial = {
  id: string;
  /** Quién lo dijo. Va en serif itálica cuando es la cita de adelante. */
  name: string;
  /** Su cargo. En la card va destacado; en la columna, dentro de la píldora. */
  role: string;
  /**
   * Lo que dijo, sin comillas.
   *
   * Las comillas las pone el componente —tipográficas, « " " »— y no el dato:
   * son tratamiento, no texto. Guardadas acá se escapan mal en el JSON de una
   * futura fuente de datos y, sobre todo, se olvidan en la mitad de las
   * entradas el día que alguien agregue una.
   */
  quote: string;
};

export const TESTIMONIALS: readonly Testimonial[] = [
  {
    id: "federa",
    name: "Austin Federa",
    role: "Co-founder of DoubleZero",
    quote: "Their AI work is the only AI x Crypto thing I'm looking forward to.",
  },
  {
    id: "swihart",
    name: "Josh Swihart",
    // TODO(copy): el artboard dice "Company xxx" — falta el cargo real.
    role: "Company xxx",
    quote:
      "Mad respect to @NEAR Protocol peeps for unlocking global access to encrypted wealth. Game changing at a multi-generational scale.",
  },
  {
    id: "horsley",
    name: "Hunter Horsley",
    role: "CEO of Bitwise",
    // TODO(copy): reconstruida del fragmento visible "…bet against NEAR."
    quote: "Never bet against NEAR.",
  },
  {
    id: "mumtaz",
    name: "Mumtaz",
    // TODO(copy): el artboard solo muestra "… of Helius".
    role: "Co-founder of Helius",
    // TODO(copy): reconstruida del fragmento visible.
    quote:
      "NEAR still feels like the most underrated team in crypto — feature releases every other week, on a chain that actually scales.",
  },
];
