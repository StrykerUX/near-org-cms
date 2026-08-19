// Los rótulos de las ocho variantes de la banda "NEAR belongs to you".
//
// La COPY de la sección no está acá y no cambia en ninguna: wordmark, el claim
// "belongs to you.", el párrafo de siempre y el campo con su "email address" /
// "sign up". Es la condición del lab — las ocho dicen exactamente lo mismo y lo
// único que cambia es cómo lo muestran.

export type NewsletterVariantId =
  | "marquee"
  | "rule"
  | "split"
  | "inline"
  | "halo"
  | "grain"
  | "column"
  | "field"
  | "teletype"
  | "ascii"
  | "curtain"
  | "sonar"
  | "ticker"
  | "shutter";

export type NewsletterVariantSpec = {
  readonly id: NewsletterVariantId;
  readonly index: string;
  readonly title: string;
  /** Fondo, en una palabra: es el eje que más separa a unas de otras. */
  readonly ground: string;
  /** Qué forma toma el campo de email. */
  readonly input: string;
  /** Qué se mueve. Vacío en las ocho primeras: no se mueve nada. */
  readonly motion?: string;
  readonly pitch: string;
};

export const NEWSLETTER_VARIANTS: readonly NewsletterVariantSpec[] = [
  {
    id: "marquee",
    index: "01",
    title: "Marquee",
    ground: "stone",
    input: "wide pill",
    pitch:
      "The claim at poster scale, cropped by both edges: the sentence does not fit and that is why it reads as an announcement. The field sits below, as wide as the headline.",
  },
  {
    id: "rule",
    index: "02",
    title: "Rule",
    ground: "stone",
    input: "writing line",
    pitch:
      "The field stops being a pill and becomes a LINE: you write on a rule, as on a paper form. Editorial composition aligned left.",
  },
  {
    id: "split",
    index: "03",
    title: "Split",
    ground: "deep green + stone",
    input: "pill, on the light half",
    pitch:
      "The band split in two by a vertical cut: the claim on deep green, the field on the grey. The cut replaces the staircases that went away.",
  },
  {
    id: "inline",
    index: "04",
    title: "Inline",
    ground: "stone",
    input: "dentro de la frase",
    pitch:
      "The field lives INSIDE the headline: «near belongs to ___». Form and sentence are the same line, so there are not two things to look at.",
  },
  {
    id: "halo",
    index: "05",
    title: "Halo",
    ground: "matter · light",
    input: "large pill, centred",
    pitch:
      "The grey stops being flat: a very faint green light breathes behind the block. The composition is today’s, at another scale — it is the most direct comparison against the current section.",
  },
  {
    id: "grain",
    index: "06",
    title: "Grain",
    ground: "matter · grain + lime",
    input: "solid block",
    pitch:
      "A lime band with grain texture and the claim in ink. The field is a rectangular block with the button attached: nothing rounded, nothing soft.",
  },
  {
    id: "column",
    index: "07",
    title: "Column",
    ground: "matter · grid",
    input: "compacto, a la izquierda",
    pitch:
      "Everything in a narrow column aligned left, with the rest of the width empty over a faint grid. The exact opposite of today’s centred layout.",
  },
  {
    id: "field",
    index: "08",
    title: "Field",
    ground: "brand green, full bleed",
    input: "large white pill",
    pitch:
      "Brand green edge to edge, with all the text in ink: the system green is light and does not read on cream. The only one that turns this band into the page’s stopping point instead of a rest.",
  },

  // ── Las tres con movimiento ───────────────────────────────────────────────
  //
  // Las ocho de arriba son composición pura: entran y ya están. Estas tres
  // agregan un gesto, y por eso llevan `motion` — el campo existe para dejar a
  // la vista cuál es la variable nueva.
  {
    id: "teletype",
    index: "09",
    title: "Teletype",
    ground: "stone",
    input: "pill, enters last",
    motion: "the paragraph types itself, with a cursor",
    pitch:
      "The sentence types itself on arrival and the field appears when the cursor goes out. Nobody says where to keep writing: the order says it.",
  },
  {
    id: "ascii",
    index: "10",
    title: "Ascii",
    ground: "stone",
    input: "solid block",
    motion: "the wordmark resolves out of noise",
    pitch:
      "The wordmark stops being an SVG and gets drawn with characters: it arrives as noise and settles into the word. It says «infrastructure» with its shape, not with words.",
  },
  {
    id: "curtain",
    index: "11",
    title: "Curtain",
    ground: "stone + lime curtain",
    input: "pill, rises behind the curtain",
    motion: "a curtain sweeps the section and leaves",
    pitch:
      "The band is not there: it OPENS. A lime curtain sweeps from bottom to top, leaves through the upper edge and the block rises behind it. The only one that treats the seam as a gesture, which is what the staircases did.",
  },
  {
    id: "sonar",
    index: "12",
    title: "Sonar",
    ground: "stone",
    input: "pill, with rings of its own",
    motion: "answers FOCUS, not arrival",
    pitch:
      "The only one whose gesture the reader fires: focusing the field sends rings out of it. The rest spend their movement before the click; this one saves it for the moment that matters.",
  },
  {
    id: "ticker",
    index: "13",
    title: "Ticker",
    ground: "stone",
    input: "pill, centred",
    motion: "two ribbons that never stop",
    pitch:
      "Two character ribbons cross the band in opposite directions, above and below the block. The only one with perpetual movement — and therefore the one most at risk of competing with the field.",
  },
  {
    id: "shutter",
    index: "14",
    title: "Shutter",
    ground: "stone, behind cream slats",
    input: "pill, enters with the opening",
    motion: "eleven slats open from the centre",
    pitch:
      "The hard sister of 11: instead of a whole curtain, eleven vertical slats withdraw from the centre towards the edges. That one says «it opens»; this one, «it unlatches».",
  },
];
