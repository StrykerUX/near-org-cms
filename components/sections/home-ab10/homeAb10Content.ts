// La copy de /prototype/homepage-ab10, fuera de los componentes que la pintan.
//
// Mismo criterio que `quantum/quantumContent.ts` — el razonamiento largo está ahí.
// El precedente en esta carpeta es `nearStackContent.ts`, que ya lo hacía bien: un
// módulo puro, `readonly`, sin JSX y sin nada que no sobreviva un JSON.stringify.
//
// Qué NO está acá:
//
//  · La geometría y el timing (velocidades del parallax, pasos del stepper, la
//    unidad `--u` del hero). Son mecánica y viven con la animación que los lee.
//  · Los TITULARES, que hoy llevan JSX (`<Accent>`, `<br />`). Ver la nota en
//    quantumContent.ts: partir un titular en datos exige decidir un esquema para
//    "texto con un tramo acentuado", y eso es una decisión del modelo de contenido.
//  · Las clases de LAYOUT de las cards de OwnYourOwn. `CARDS` mezclaba contenido
//    (título, cuerpo, imagen) con posición en el grid y tinte — dos cosas con
//    dueños distintos. Acá viaja solo el contenido; la posición se quedó en el
//    componente, indexada por el mismo orden.


// ── de CustomerStories.tsx ──
export const CUSTOMER_STORIES = [
  {
    company: "Abound",
    logo: { src: "/logos/abound.png", width: 111, height: 24 },
    image: "/prototype/v2/stories/abound.png",
    title: "Abound Is Bringing Agentic Payments to Cross-Border Finance With NEAR AI",
    href: "https://near.ai/blog/near-ai-and-the-times-of-india-groups-abound-are-bringing-agentic-payments-to-cross-border-finance",
  },
  {
    company: "Venice",
    logo: { src: "/logos/venice.png", width: 89, height: 40 },
    image: "/prototype/v2/stories/venice.png",
    title: "Venice Is Now Verifiably Private With NEAR AI",
    href: "https://near.ai/blog/venice-is-now-verifiably-private-with-near-ai",
  },
  {
    company: "Brave",
    logo: { src: "/logos/brave.png", width: 86, height: 24 },
    image: "/prototype/v2/stories/brave.png",
    title: "A New Frontier for Brave AI Privacy With NEAR AI",
    href: "https://brave.com/blog/browser-ai-tee/",
  },
  {
    company: "ZODL",
    logo: { src: "/logos/zodl.png", width: 133, height: 27 },
    image: "/prototype/v2/stories/zodl.png",
    title: "Privacy-first Zcash Wallet ZODL Uses NEAR Intents to Give Users Cross-Chain Access",
    href: "https://intents.near.org/case-studies",
  },
  {
    company: "Ledger",
    logo: { src: "/logos/ledger.png", width: 117, height: 39 },
    image: "/prototype/v2/stories/ledger.png",
    title: "Ledger Wallet Integrates NEAR Intents to Power Seamless Cross-Chain Swaps",
    href: "https://www.ledger.com/blog-near-intents-joins-ledger-wallet-via-swapkit",
  },
  {
    // Único sin logotipo en el set original: se escribe con el nombre.
    company: "Gov. of Bermuda",
    logo: null,
    image: "/prototype/v2/stories/bermuda.png",
    title: "Government of Bermuda and NEAR AI Partner to Deploy AI-Powered Public Services",
    href: "https://near.ai/blog/government-of-bermuda-and-near-ai-partner-to-deploy-ai-powered-public-services",
  },
] as const;

// ── de ProofDatum.tsx ──
// Las seis pruebas que cuelgan del eje.
//
// Antes esto era `PROOF_STEPS`: cinco pruebas que el `ProofStepper` pasaba de a
// una, cada una con su `value` y su `label` sueltos para el cursor del carril.
// Son OTROS datos, no los mismos con otro formato — cambia la cantidad, cambian
// las cifras y cambian los rótulos.
//
// La copy es la de `proof-alt/proofAltContent.ts`, que es de donde viene la
// estructura. Se copió y no se importa, por lo que dice el README de esa
// carpeta: es un laboratorio y su contenido puede cambiar o borrarse sin aviso.
// Lo que sí se dejó afuera son tres campos que allá existen para las OTRAS dos
// versiones del lab (`plain`, `short`, `count`, para aria-labels, carriles y
// contadores): acá no los lee nadie, y un campo que nadie lee es una promesa de
// que alguien lo mantiene.
export const PROOF_STATS = [
  {
    id: "uptime",
    eyebrow: "Built to last",
    // La cifra viene partida en DOS tramos porque así está diseñada: el primero
    // en tinta, el segundo en verde. El corte es ÓPTICO, no semántico, y en dos
    // de los seis cae a mitad de palabra ("Confi" + "dential"). Por eso son
    // `value`/`accent` y no `number`/`unit` — esos nombres prometerían una
    // semántica que estos datos no tienen.
    value: "100% ",
    accent: "uptime",
    body: "NEAR has run for more than five years on mainnet without a single outage. Every network upgrade has shipped without downtime.",
  },
  {
    id: "tps",
    eyebrow: "Built to scale",
    value: "1 Million ",
    accent: "TPS",
    body: "NEAR's architecture handles over a million transactions per second on consumer-grade hardware and scales automatically through dynamic resharding.",
  },
  {
    id: "volume",
    eyebrow: "Built to connect",
    value: "$24 + ",
    accent: "Billion",
    body: "More than $24 billion in cross-chain volume has settled through NEAR Intents. Swaps clear in seconds for less than a cent, with no manual bridging required.",
  },
  {
    id: "chains",
    eyebrow: "Built to reach",
    value: "30 + ",
    accent: "Blockchains",
    body: "A single integration reaches Bitcoin, Ethereum, Solana, and more than thirty other chains. Transactions execute natively, so users never hold a wrapped asset.",
  },
  {
    id: "quantum",
    eyebrow: "Built to resist",
    value: "Quantum-",
    accent: "ready",
    body: "NEAR is one of the first blockchains to add a NIST-approved post-quantum signature scheme in production.",
  },
  {
    id: "privacy",
    eyebrow: "Built to privacy",
    value: "Confi",
    accent: "dential",
    body: "Trades settle inside a private shard and AI workloads run inside encrypted enclaves, where no operator or outside observer can see them.",
  },
] as const;

// ── de AgentEconomy.tsx ──
// El statement va PARTIDO en cuatro porque dos de sus tramos son acentos serif
// y esto es un módulo puro: no puede llevar el `<Accent>` que los pinta. Lo que
// no puede pasar es que el texto se guarde entero y el componente lo re-parta
// con un `split` o un índice — ahí la copy y su tratamiento quedan acoplados por
// una posición de carácter, y cambiar una palabra rompe el acento en silencio.
//
// Es la misma frase que en ab7 pintaba `QuantumBars` (`BARS_STATEMENT`, en un
// solo string porque ahí el acento no existía: lo que se movía era un barrido
// de gradiente sobre la línea entera).
export const AGENT_ECONOMY = {
  lead: "NEAR is open infrastructure powering",
  accentA: "the agent economy.",
  body: "Quantum-resistant and confidential by design, NEAR empowers you to trade anything anywhere and",
  accentB: "own your intelligence.",
} as const;

// ── de OwnYourOwn.tsx ──
// Solo el CONTENIDO. Las clases de posición y tinte se quedaron en el componente
// (`CARD_LAYOUT`), indexadas por el mismo orden: `place` decide en qué celda del
// grid cae cada card y cuánto se separa de la anterior, y eso es composición, no
// algo que un editor deba ver ni que un CMS deba guardar.
// El arte vive en `public/prototype/ab10/` y no en `public/prototype/`, que es
// donde están los `feature-*.png` de las versiones anteriores: esos cuatro los
// comparten ab6, ab7, ab9, v2 y v4, así que no se podían reemplazar en su sitio
// sin cambiarle las cards a cinco páginas de una vez.
//
// Cada card tiene AHORA su propio glifo. Antes Traces reusaba el de
// Intelligence, y esa reutilización era el motivo de que las dos se leyeran como
// la misma idea contada dos veces.
//
// ⚠️ El ORDEN de este array es el orden de FILAS en pantalla, no un orden de
// lectura libre. Está emparejado por índice con `CARD_LAYOUT` y con `SPEEDS`, y
// además el `end` del ScrollTrigger se calcula con `cards[cards.length - 1]`
// asumiendo que el último elemento es el de la fila 4. Reordenar acá sin mover
// los otros dos intercambia las cards de posición y descalibra ese `end`.
export const OWN_YOUR_OWN_CARDS = [
  {
    src: "/prototype/ab10/icon-data.webp",
    title: "Data",
    body: "Keep your transactions, prompts, and identity confidential, even from the infrastructure that runs them.",
  },
  {
    src: "/prototype/ab10/icon-traces.webp",
    title: "Traces",
    body: "Capture the value your agents create for labs and institutions while keeping your records confidential.",
  },
  {
    src: "/prototype/ab10/icon-assets.webp",
    title: "Assets",
    body: "Move cross-chain, trade perps, earn yield, hold RWAs, and access all of DeFi from your own wallet.",
  },
  {
    src: "/prototype/ab10/icon-intelligence.webp",
    title: "Intelligence",
    body: "Run private inference, deploy agents in a secure harness, and keep real sovereignty over your AI.",
  },
] as const;

// ── de PressCarousel.tsx ────────────────────────────────────────────────────
// Los cinco testimonios, copiados del lab `/prototype/carousel-sections` junto
// con la sección que los pinta. Son los MISMOS que muestra
// `components/sections/TestimonialMarquee` —la sección compartida que este
// carrusel reemplaza en ab10— pero no se importan de ahí: ese módulo lo montan
// ocho views y su forma es suya, no de ab10.
//
// El tono es de PRESENTACIÓN y no del testimonio: se reparte en ciclo
// (green, gray, dark, green, gray…) para que la fila alterne, no porque la
// cita diga nada sobre el color.
export type PressTone = "green" | "gray" | "dark";

// Contenido: los 5 testimonios de TestimonialMarquee
// (components/sections/TestimonialMarquee.tsx), no importados —mismo
// criterio que CUSTOMER_STORIES abajo. Tono intercalado en ciclo de a tres
// (green, gray, dark, green, gray…) — no el light/dark de la fuente. Sin
// bandas de fondo: eso era decoración de TestimonialMarquee, no se pidió acá.
export const PRESS_ITEMS = [
  {
    tone: "green",
    logo: { src: "/logos/venice.png", width: 89, height: 40 },
    body: "Near still feels like the most underrated team in crypto to me. New feature releases basically every other week on an actually scalable chain.",
    name: "Mert Mumtaz",
    role: "CEO of Helius",
  },
  {
    tone: "gray",
    logo: { src: "/logos/abound.png", width: 111, height: 24 },
    body: "We shipped confidential payouts in a week. The part that surprised us was not needing a separate trust story to sell it.",
    name: "Dana Ferris",
    role: "CTO of Abound",
  },
  {
    tone: "dark",
    logo: { src: "/logos/brave.png", width: 86, height: 24 },
    body: "Privacy that has to be explained is privacy nobody uses. Here it is the default, and that changed how we onboard.",
    name: "Iris Kowalski",
    role: "Head of Product, Brave",
  },
  {
    tone: "green",
    logo: { src: "/logos/zodl.png", width: 133, height: 27 },
    body: "Cross-chain used to mean three integrations and a bridge we did not control. Now it is one account and it settles.",
    name: "Tomás Rivera",
    role: "Founder of ZODL",
  },
  {
    tone: "gray",
    logo: { src: "/logos/ledger.png", width: 117, height: 39 },
    body: "Self custody stopped being the hard sell. Our users keep their keys and still get the experience they expected.",
    name: "Amara Osei",
    role: "VP Engineering, Ledger",
  },
] as const;
