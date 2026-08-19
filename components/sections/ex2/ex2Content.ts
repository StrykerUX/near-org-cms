// La copy de /prototype/ex2 — DRAFT.
//
// Módulo puro, sin JSX, como el resto del repo. Lo que hay acá es de relleno a
// propósito: el objetivo de esta pasada es la ESTRUCTURA y el mecanismo de la
// transición, no el texto. Cuando el contenido esté decidido, este archivo es
// el único sitio que hay que tocar.
//
// El titular NO está acá y sigue la regla de siempre: lleva dos escalas y un
// `<span>` de medición alrededor de la O, así que partirlo en datos exigiría un
// esquema para "texto con un tramo medible" — una decisión del modelo de
// contenido, no de este draft.

export const EX2_HERO = {
  // Los dos renglones del cartel, para referencia — el JSX los escribe con sus
  // dos escalas distintas.
  lead: "Own your",
  word: "WORLD",

  sub: "Draft: subtítulo de relleno. Acá va la frase que sostiene al titular.",

  cta: {
    label: "Get Started",
    // Sin destino todavía: adónde lleva es una decisión de contenido.
    href: "#",
  },

  // El clip de ab7, en loop. Mismo asset — no se duplica nada.
  video: "/prototype/v2/hero-descent-v2.mp4",
  poster: "/prototype/v2/hero-descent-v2-poster.jpg",

  // Lo que se ve por el agujero de la O. Placeholder: sirve para juzgar el
  // gesto, no para leerlo.
  next: {
    kicker: "Sección 02 · placeholder",
    title: "Lo que aparece por dentro de la O.",
    body: "Draft. Este bloque existe para ver la transición con algo que ocupe espacio real: un kicker, un titular de dos renglones y un párrafo. El contenido definitivo se decide después.",
  },
} as const;
