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
    technique: "hoja apoyada, el logo cede",
    bet: "El negro no crece: es un objeto con esquinas, márgenes y sombra que sube entero y se apoya sobre la página, que queda visible y oscurecida por arriba y por los costados. Ocupa 94svh y por dentro se ve como el resto del lab — mismo titular, mismas cuatro columnas, mismo wordmark a ancho completo.",
    watch: "Qué cede cuando falta altura. Acá el texto no se toca nunca: el wordmark se queda a ancho completo (tope 2000px) y se RECORTA, sangrando por el borde inferior. Es la respuesta opuesta a la de 07, que achica el logo para que entre entero.",
  },
  {
    id: "glyph",
    slug: "glyph",
    index: "02",
    title: "Glyph",
    takeover: true,
    technique: "mask-image del wordmark, escala",
    bet: "El wordmark ES la transición. La pantalla negra está recortada con la forma del logo y esa forma crece hasta que un solo trazo cubre el viewport: se entra al footer por dentro de una letra.",
    watch: "El tramo medio, cuando todavía se reconoce la N. Es el único de los seis donde el logo no aparece: se atraviesa.",
  },
  {
    id: "ascend",
    slug: "ascend",
    index: "03",
    title: "Ascend",
    takeover: true,
    technique: "el wipe de producción, sin tirón",
    bet: "El takeover que ya existe, con las dos cosas que le faltan: no le saca el scroll al lector (arranca cuando llegó solo al fondo, sin tirar de la página) y el contenido entra en cascada en vez de aparecer de golpe. Conserva lo mejor del original: el corte duro entre el logo negro sobre cream y su copia blanca sobre el negro, y el bote al aterrizar.",
    watch: "El aire: todo el panel está medido en svh y el titular baja de token con media queries de ALTURA, así que en un viewport bajo se comprime en vez de cortarse por arriba. Achicá la ventana a lo alto y comparala con las tres primeras.",
  },
  {
    id: "reveal",
    slug: "reveal",
    index: "04",
    title: "Reveal",
    takeover: false,
    technique: "position: fixed detrás, cero scrub",
    bet: "El footer estuvo abajo desde el principio, quieto y a tamaño completo; la página es una hoja que se desliza hacia arriba y lo descubre. No hay animación conducida: el movimiento es el scroll.",
    watch: "Cuánto pesa el paralaje contra las tres versiones con coreografía. Es la más barata de las seis y la única que no puede desincronizarse.",
  },
  {
    id: "kinetic",
    slug: "kinetic",
    index: "05",
    title: "Kinetic",
    takeover: false,
    technique: "SplitText + máscaras, entrada única",
    bet: "Se construye de abajo hacia arriba: primero sube el fondo negro desde el borde inferior, después el wordmark se descubre con un barrido lateral, y recién entonces llegan el titular y los links. El footer se arma desde su base en vez de mostrarse entero y decorarse.",
    watch: "Si un footer que no se apropia de la pantalla igual cierra la página. Y el orden: el texto blanco nunca existe antes que el negro sobre el que se lee.",
  },
  {
    id: "stack",
    slug: "stack",
    index: "06",
    title: "Stack",
    takeover: false,
    technique: "position: sticky, timeline propia",
    bet: "El footer se pega al viewport y ahí la escena corre SOLA: el titular llega grande, se encoge a su sitio mientras entran las columnas, y el wordmark asienta al final. Tres tiempos con ritmo propio, no atados a la rueda.",
    watch: "La diferencia contra las tres con scrub: acá el ritmo es del diseño y no del gesto de cada lector. Scrollear rápido no acelera nada.",
  },
];
