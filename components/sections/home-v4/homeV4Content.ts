// La copy de /prototype/homepage-v4, fuera de los componentes que la pintan.
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

// ── de ProofStepper.tsx ──
// Stepper de 5 pruebas. Sticky de CSS y un ScrollTrigger de SOLO LECTURA, nunca
// `pin: true`; el porqué está en components/sections/README.md. Tres
// diferencias de diseño respecto del rebuild:
//
//  1. El carril alinea a la IZQUIERDA (todas las palabras arrancan en la misma
//     X) en vez de a la derecha, y se desplaza en bloque para que la más ancha
//     roce el borde del viewport. Como consecuencia el cursor queda FIJO en X:
//     ya no tiene que perseguir el borde izquierdo de cada título.
//  2. El recorrido es mucho más corto: 7svh por paso contra 65svh. Las cinco
//     pruebas pasan casi al vuelo, a propósito.
//  3. El cursor lleva el gradiente lima→verde en vez del verde plano.
export const PROOF_STEPS = [
  {
    word: "1+ Million",
    eyebrow: "Built on Scale",
    value: "1M+",
    label: "daily wallets",
    body: "Real people moving real value every day — not bots inflating a chart.",
  },
  {
    word: "$20B+",
    eyebrow: "Built on Volume",
    value: "$20B",
    label: "settled",
    body: "Cross-chain volume cleared on-chain, with finality in under a second.",
  },
  {
    word: "100%",
    eyebrow: "Built on Proof",
    value: "100%",
    label: "uptime",
    body: "Move cross-chain, trade perps, hold RWAs, stay confidential, and access all of DeFi from your own wallet.",
  },
  {
    word: "Quantum",
    eyebrow: "Built on Math",
    value: "0",
    label: "quantum exposure",
    body: "Post-quantum signatures from day one, so nothing you sign today expires tomorrow.",
  },
  {
    word: "Confidential",
    eyebrow: "Built on Privacy",
    value: "TEE",
    label: "on every node",
    body: "Confidential compute by default: your data stays yours, even from the validators.",
  },
] as const;

// ── de QuantumBars.tsx ──
export const BARS_STATEMENT =
  "NEAR is open infrastructure powering the agent economy. Quantum-resistant and confidential by design, NEAR empowers you to trade anything anywhere and own your intelligence.";

// ── de OwnYourOwn.tsx ──
// Solo el CONTENIDO. Las clases de posición y tinte se quedaron en el componente
// (`CARD_LAYOUT`), indexadas por el mismo orden: `place` decide en qué celda del
// grid cae cada card y cuánto se separa de la anterior, y eso es composición, no
// algo que un editor deba ver ni que un CMS deba guardar.
export const OWN_YOUR_OWN_CARDS = [
  {
    src: "/prototype/feature-assets.png",
    title: "Assets",
    body: "You Can Now Pay for AI Usage by Staking NEAR",
  },
  {
    src: "/prototype/feature-intelligence.png",
    title: "Intelligence",
    body: "Who Owns the Rails AI Runs On",
  },
  {
    src: "/prototype/feature-alpha.png",
    title: "Alpha",
    body: "Adding a New Execution Model to its Engine",
  },
  {
    // Reusa el arte de Intelligence: el mismo glifo de IA, otro titular.
    src: "/prototype/feature-intelligence.png",
    title: "Agents",
    body: "Always-On Agents Running Inside Encrypted Enclaves",
  },
] as const;
