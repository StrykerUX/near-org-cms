// Copy for /governance.
//
// ── Por qué esta página no inventó una sola frase ──────────────────────────
//
// (Nota de proceso, en español; el resto de la carpeta comenta en inglés.)
//
// `/governance` estaba enlazada en el footer con `href: null` — un link muerto.
// Nadie me pasó un deck para ella, y ese suele ser el final del asunto: sin
// contenido no hay página.
//
// Salvo que acá el contenido YA ESTABA, repartido en dos módulos que lo dicen de
// paso. Economics describe la capa onchain porque necesita explicar que las
// decisiones económicas no las toma una empresa; foundation describe sus propios
// cuerpos porque necesita explicar que su transparencia es estructural. Ninguna
// de las dos páginas existe para hablar de gobernanza, y por eso lo dicen
// incompleto — pero entre las dos está entero.
//
// Así que esta página es una COMPOSICIÓN y no una redacción: cada afirmación de
// abajo viene textual de un módulo que ya estaba, con su origen anotado al lado.
// Lo único escrito acá son los tres rótulos de sección, que son navegación y no
// afirmaciones.
//
// La consecuencia práctica: cuando alguien corrija la descripción de House of
// Stake en economics, esta página se corrige sola. Si en cambio hubiera copiado
// el texto, las dos divergirían en el primer ajuste.

export const META = {
  title: "Governance",
  description:
    "Who decides what on NEAR: the onchain layer that passes binding proposals, and the foundation that is working to hand its own functions over.",
} as const;

/**
 * §1 — el hero.
 *
 * El titular es textual la última oración de `economics.MATURITY.facts[2].body`.
 * No se eligió por sonar bien: es la única frase del material existente que
 * contesta la pregunta con la que alguien llega a una página de gobernanza —
 * quién manda— y la contesta por descarte, que es como se contesta de verdad.
 */
export const HERO = {
  eyebrow: "Governance",
  headline: "The community steers the system, not a company",
  sub: "NEAR's economic decisions are made through House of Stake, an onchain governance system that's already passing binding proposals.",
} as const;

/**
 * §2 — las dos capas, y la asimetría entre ellas.
 *
 * Es lo que la página existe para mostrar y lo que ninguna de las dos fuentes
 * puede mostrar sola: hay una capa que decide y otra que se está retirando. Cada
 * `body` es textual de su módulo de origen.
 */
export const LAYERS = [
  {
    id: "onchain",
    index: "01",
    label: "Onchain",
    title: "House of Stake",
    body: "NEAR's economic decisions are made through House of Stake, an onchain governance system that's already passing binding proposals. The community steers the system, not a company.",
    source: "economics · MATURITY.facts[2]",
    state: "Binding, live",
  },
  {
    id: "foundation",
    index: "02",
    label: "Foundation",
    title: "Council and executive team",
    body: "The NEAR Foundation Council is the governing body of the Foundation, responsible for its ultimate oversight and its most significant decisions. The Council is separate from the executive team, which the Council empowers to manage day-to-day operations and which reports back to it.",
    source: "foundation · COUNCIL",
    state: "Devolving",
  },
] as const;

/** Los dos verbos de la relación interna de la Foundation. Textual de `foundation.COUNCIL.relation`. */
export const RELATION = { out: "empowers", back: "reports to" } as const;

/**
 * §3 — hacia dónde va.
 *
 * Las dos frases de remate de la Foundation, que en su página son el argumento
 * y acá son la conclusión. La segunda es la que hace que la página no sea un
 * organigrama: dice que una de las dos capas planea desaparecer.
 */
export const DIRECTION = {
  eyebrow: "Direction",
  headline: "One of these two is temporary",
  kicker: "We support the network. We do not control it, and by design we could not.",
  body: "Most organizations exist to grow. The NEAR Foundation exists to devolve. Our purpose is to support the ecosystem until it operates without us, moving functions and resources into the hands of the community and the decentralized infrastructure that carries them.",
  source: "foundation · MISSION",
} as const;

/** §4 — el cierre. Los tres destinos son páginas que existen. */
export const CLOSING = {
  headline: "Read the rest",
  links: [
    { id: "foundation", label: "How the Foundation operates", href: "/near-foundation" },
    { id: "economics", label: "The economics it governs", href: "/economics" },
    { id: "community", label: "The community that steers it", href: "/community" },
  ],
} as const;
