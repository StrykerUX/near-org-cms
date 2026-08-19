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
  | "curtain";

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
    input: "píldora ancha",
    pitch:
      "El claim a escala de cartel, cortado por los dos bordes: la frase no cabe y por eso se lee como un anuncio. El campo va debajo, tan ancho como el titular.",
  },
  {
    id: "rule",
    index: "02",
    title: "Rule",
    ground: "stone",
    input: "línea de escritura",
    pitch:
      "El campo deja de ser una píldora y pasa a ser una LÍNEA: se escribe sobre una regla, como en un formulario de papel. Composición editorial alineada a la izquierda.",
  },
  {
    id: "split",
    index: "03",
    title: "Split",
    ground: "verde profundo + stone",
    input: "píldora, en la mitad clara",
    pitch:
      "La banda partida en dos por un corte vertical: el claim sobre verde profundo, el campo sobre el gris. El corte reemplaza a las escaleras que se fueron.",
  },
  {
    id: "inline",
    index: "04",
    title: "Inline",
    ground: "stone",
    input: "dentro de la frase",
    pitch:
      "El campo vive DENTRO del titular: «near belongs to ___». Formulario y frase son la misma línea, así que no hay dos cosas que mirar.",
  },
  {
    id: "halo",
    index: "05",
    title: "Halo",
    ground: "materia · luz",
    input: "píldora grande, centrada",
    pitch:
      "El gris deja de ser plano: una luz verde muy tenue respira detrás del bloque. La composición es la de hoy, a otra escala — es la comparación más directa contra la sección actual.",
  },
  {
    id: "grain",
    index: "06",
    title: "Grain",
    ground: "materia · grano + lima",
    input: "bloque sólido",
    pitch:
      "Banda en lima con textura de grano y el claim en tinta. El campo es un bloque rectangular con el botón adosado: nada redondeado, nada suave.",
  },
  {
    id: "column",
    index: "07",
    title: "Column",
    ground: "materia · retícula",
    input: "compacto, a la izquierda",
    pitch:
      "Todo en una columna estrecha alineada a la izquierda, con el resto del ancho vacío sobre una retícula tenue. Lo contrario exacto del centrado de hoy.",
  },
  {
    id: "field",
    index: "08",
    title: "Field",
    ground: "verde de marca, a sangre",
    input: "píldora blanca grande",
    pitch:
      "Verde de marca de borde a borde, con todo el texto en tinta: el verde del sistema es claro y en crema no se lee. La única que convierte esta banda en el punto de parada de la página en vez de un descanso.",
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
    input: "píldora, entra al final",
    motion: "el párrafo se escribe, con cursor",
    pitch:
      "La frase se escribe al llegar y el campo aparece cuando el cursor se apaga. Nadie dice dónde seguir escribiendo: lo dice el orden.",
  },
  {
    id: "ascii",
    index: "10",
    title: "Ascii",
    ground: "stone",
    input: "bloque sólido",
    motion: "el wordmark se resuelve desde ruido",
    pitch:
      "El wordmark deja de ser un SVG y pasa a estar dibujado con caracteres: llega hecho ruido y se estabiliza en la palabra. Dice «infraestructura» con la forma, no con palabras.",
  },
  {
    id: "curtain",
    index: "11",
    title: "Curtain",
    ground: "stone + telón lima",
    input: "píldora, sube detrás del telón",
    motion: "un telón barre la sección y se va",
    pitch:
      "La banda no está: se ABRE. Un telón de lima barre de abajo arriba, se va por el borde superior y el bloque sube detrás. La única que trata la juntura como un gesto, que es lo que hacían las escaleras.",
  },
];
