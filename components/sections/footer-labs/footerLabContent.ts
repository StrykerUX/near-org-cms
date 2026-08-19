// La copy y la data del lab de footers, una sola vez para las seis versiones.
//
// Igual que `hero-alt/heroAltContent.ts`: si cada versión llevara su propia
// copia de los links, la comparación mediría dos cosas a la vez —el mecanismo
// y el contenido— y ya no se podría atribuir "esta se ve mejor" a nada.
//
// Los grupos son los mismos cuatro de `components/site/SiteFooter.tsx`,
// transcritos del tab Footer de "near.org - sitemap". `href: null` = la página
// todavía no existe; se renderiza como link inerte en vez de inventarle un
// destino.

export type FooterLink = { label: string; href: string | null };

export type FooterGroup = {
  title: string;
  sections: { label: string; links: FooterLink[] }[];
};

export const GROUPS: FooterGroup[] = [
  {
    title: "Products",
    sections: [
      {
        label: "",
        links: [
          { label: "near.com", href: "/nearcom" },
          { label: "Intents", href: "/intents" },
          { label: "NEAR AI", href: "/near-ai" },
        ],
      },
    ],
  },
  {
    title: "Stack",
    sections: [
      {
        label: "",
        links: [
          { label: "Protocol", href: "/blockchain" },
          { label: "Chain Abstraction", href: "/chain-abstraction" },
          { label: "Quantum Security", href: "/quantum-security" },
        ],
      },
    ],
  },
  {
    title: "Resources",
    sections: [
      {
        label: "Build",
        links: [
          { label: "Docs", href: null },
          { label: "Solutions", href: "/solutions" },
        ],
      },
      {
        label: "Learn",
        links: [
          { label: "Research", href: "/research" },
          { label: "Blog", href: "/blog" },
          { label: "Analytics", href: "/analytics" },
        ],
      },
      {
        label: "Connect",
        links: [
          { label: "Brand", href: "/brand" },
          { label: "Contact", href: "/contact-us" },
          { label: "Careers", href: null },
        ],
      },
    ],
  },
  {
    title: "About",
    sections: [
      {
        label: "Fundamentals",
        links: [
          { label: "History", href: null },
          { label: "Roadmap", href: null },
          { label: "Economics", href: "/economics" },
        ],
      },
      {
        label: "Ecosystem",
        links: [
          { label: "NEAR Foundation", href: "/near-foundation" },
          { label: "Community", href: "/community" },
          { label: "Governance", href: null },
        ],
      },
    ],
  },
  // Los links legales son un grupo más y no una línea suelta al pie.
  //
  // En el footer de producción viven abajo, en la misma fila que el
  // copyright, en cuerpo chico y sin título — o sea, tratados como letra
  // pequeña. Son páginas del sitio igual que las demás, y como grupo propio se
  // encuentran donde uno busca links: entre los links.
  //
  // Lo que queda al pie es solo el copyright, que no es un link ni un destino.
  {
    title: "Terms and Policies",
    sections: [
      {
        label: "",
        links: [
          { label: "Privacy", href: "/privacy" },
          { label: "Terms of Use", href: "/terms-of-use" },
          { label: "Cookie Policy", href: "/cookie-policy" },
        ],
      },
    ],
  },
];

/** El headline del footer, partido para que cada versión decida su quiebre. */
export const HEADLINE = { lead: "Where money", accent: "actually moves." } as const;

export const COPYRIGHT = "© 2026 NEAR. All rights reserved.";

// El wordmark vectorial y su corte óptico. Los tres números salen de medir el
// asset con getBBox(), no de estimarlo — el razonamiento completo está en
// `components/site/SiteFooter.tsx`, que es de donde vienen: el tipo está
// ópticamente corregido y alinear la caja al extremo real de los glifos deja
// una franja de página bajo la "n" y la "r". Re-medir si se redibuja el SVG.
export const WORDMARK = {
  src: "/prototype/v2/near-wordmark.svg",
  width: 981,
  height: 255,
  /** % del ANCHO a recortar abajo: resuelve igual en cualquier viewport. */
  cropPct: ((411 - 404.43) / 981) * 100,
} as const;

// ── Las seis versiones ──────────────────────────────────────────────────────
//
// `takeover` no es decorativo: separa las dos familias que el lab compara. Las
// tres primeras TAPAN la última sección de la página (el footer se apropia del
// viewport); las tres últimas no la tocan nunca — ocupan su propio espacio o
// se descubren por debajo.

export type FooterLabSpec = {
  id: string;
  slug: string;
  index: string;
  title: string;
  takeover: boolean;
  technique: string;
  bet: string;
  watch: string;
};

export const LABS: FooterLabSpec[] = [
  {
    id: "sheet",
    slug: "sheet",
    index: "01",
    title: "Sheet",
    takeover: true,
    technique: "a sheet resting, the logo gives way",
    bet: "The black does not grow: it is an object with corners, margins and a shadow that rises whole and rests on the page, which stays visible and dimmed above and to the sides. It takes 94svh and inside it looks like the rest of the lab — same headline, same four columns, same full-width wordmark.",
    watch: "What gives way when height runs short. Here the text is never touched: the wordmark stays full width (capped at 2000px) and gets CROPPED, bleeding off the bottom edge. It is the opposite answer to 07, which shrinks the logo so it fits whole.",
  },
  {
    id: "glyph",
    slug: "glyph",
    index: "02",
    title: "Glyph",
    takeover: true,
    technique: "wordmark mask-image, scaled",
    bet: "The wordmark IS the transition. The black screen is clipped to the shape of the logo and that shape grows until a single stroke covers the viewport: you enter the footer from inside a letter.",
    watch: "The middle stretch, while the N is still recognisable. It is the only one of the six where the logo does not appear: you pass through it.",
  },
  {
    id: "ascend",
    slug: "ascend",
    index: "03",
    title: "Ascend",
    takeover: true,
    technique: "the production wipe, without the tug",
    bet: "The takeover that already exists, with the two things it lacks: it does not take the scroll away from the reader (it starts once they reach the bottom on their own, without pulling the page) and the content cascades in instead of appearing all at once. It keeps the best of the original: the hard cut between the black logo on cream and its white copy on black, and the bounce on landing.",
    watch: "The air: the whole panel is measured in svh and the headline steps down a token through HEIGHT media queries, so in a short viewport it compresses instead of being cut off at the top. Shrink the window vertically and compare it against the first three.",
  },
  {
    id: "reveal",
    slug: "reveal",
    index: "04",
    title: "Reveal",
    takeover: false,
    technique: "position: fixed behind, zero scrub",
    bet: "The footer was down there from the start, still and at full size; the page is a sheet that slides up and uncovers it. There is no driven animation: the movement is the scroll.",
    watch: "How much the parallax weighs against the three choreographed versions. It is the cheapest of the six and the only one that cannot fall out of sync.",
  },
  {
    id: "kinetic",
    slug: "kinetic",
    index: "05",
    title: "Kinetic",
    takeover: false,
    technique: "SplitText + masks, one entrance",
    bet: "It builds from the bottom up: first the black background rises from the bottom edge, then the wordmark is uncovered with a lateral sweep, and only then do the headline and the links arrive. The footer assembles from its base instead of showing up whole and decorating itself.",
    watch: "Whether a footer that does not take over the screen still closes the page. And the order: the white text never exists before the black it is read on.",
  },
  {
    id: "stack",
    slug: "stack",
    index: "06",
    title: "Stack",
    takeover: false,
    technique: "position: sticky, its own timeline",
    bet: "The footer sticks to the viewport and the scene runs ON ITS OWN: the headline arrives large, shrinks into place while the columns come in, and the wordmark settles at the end. Three beats with a rhythm of their own, not tied to the wheel.",
    watch: "The difference against the three with scrub: here the rhythm belongs to the design and not to each reader gesture. Scrolling fast accelerates nothing.",
  },
];
