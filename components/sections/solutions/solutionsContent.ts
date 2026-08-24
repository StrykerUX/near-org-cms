// La copy de las tres propuestas para `/solutions`, fuera de los componentes
// que la pintan.
//
// Mismo criterio que `quantum/quantumContent.ts` y `protocol-labs/
// protocolContent.ts` — el razonamiento largo está ahí. Módulo puro: strings y
// arrays de objetos, `readonly`, sin JSX, sin `Date` y sin nada que no
// sobreviva un `JSON.stringify`.
//
// ── Por qué es lo ÚNICO que las tres comparten ──────────────────────────────
//
// Se acordó que cada propuesta tuviera sus secciones 100% propias, y así es:
// no hay una sola sección compartida entre `solutions-a`, `-b` y `-c`. La copy
// es la excepción, y es deliberada. El motivo lo documenta
// `protocol-labs/README.md`: varias transcripciones del mismo texto divergen a
// la primera corrección, y a partir de ahí una comparación entre propuestas
// mide el error de transcripción en vez del diseño.
//
// No le quita ninguna decisión de diseño a ninguna de las tres. Lo que sí se
// queda en el JSX de cada sección son los TITULARES, porque llevan `<Accent>`
// y `<br />` — pasarlos a datos exige elegir un esquema para "texto con un
// tramo acentuado", y esa es una decisión del modelo de contenido, no de un
// módulo de copy (ver la nota en `components/sections/README.md`).
//
// ── Dos cosas del copy original que se corrigieron acá ─────────────────────
//
// 1. **El `⚑` se cayó.** Venía pegado a «30+ chains» en la franja de cifras,
//    sin ninguna llamada al pie que lo recogiera. Es un artefacto de
//    transcripción, no un símbolo del contenido.
// 2. **El copy numera dos secciones como «3»** (el bloque de soluciones y el
//    spotlight de Confidential Intents). Son SEIS secciones, no cinco. Acá
//    están como piezas separadas y el orden real lo decide cada view.

// ── Hero ───────────────────────────────────────────────────────────────────
export const HERO = {
  // El titular vive en el JSX de cada hero (lleva `<Accent>`); esto es lo que
  // va debajo.
  subhead:
    "NEAR is where value moves across any chain, any asset, and any payment rail. Agents and users discover, negotiate, settle, and prove work on one integrated stack. Below are real-world solutions built on NEAR, and the global enterprises and DeFi leaders building them.",
  cta: { label: "Talk to the team", href: "/contact-us" },
} as const;

// ── Franja de cifras ───────────────────────────────────────────────────────
//
// Cinco, y se pintan UNIFORMES en las tres propuestas. Es el argumento que
// `chain/ProofBand` documenta largo: el trabajo de esta franja es "una mirada =
// esto es real y se usa a escala", y cinco cifras del mismo tamaño entregan el
// reclamo entero en un barrido del ojo, donde una versión escalonada obliga a
// armarlo en tres movimientos.
//
// **Ninguna cuenta hacia arriba**, por el mismo motivo que allá: `Sub-cent` no
// puede contar —tallar hasta un umbral de MENOS-QUE no significa nada— así que
// un contador cubriría cuatro de las cinco y tendría que dejar la quinta
// quieta. Cuatro números actuando mientras uno se queda es peor que cinco
// quietos, y rompe justo la uniformidad sobre la que está construida la fila.
export const PROOF_STATS = [
  { id: "volume", value: "$24B+", label: "Cross-chain volume through NEAR Intents" },
  { id: "chains", value: "30+", label: "Chains reached through one integration" },
  { id: "assets", value: "180+", label: "Assets supported cross-chain" },
  { id: "fees", value: "Sub-cent", label: "Fees, with under 1s execution" },
  { id: "years", value: "5+", label: "Years proven on mainnet" },
] as const;

// ── Los cinco bloques ──────────────────────────────────────────────────────
//
// `family` es el campo del que salen los cortes de B y de C, y es la
// observación que el copy no declara: estos cinco NO son hermanos.
//
//   · `value` — Payments, Agentic Finance, Cross-Chain DeFi y Treasury son
//     movimiento de valor. Tres de sus cuatro enlaces apuntan al mismo destino
//     (`intents.near.org`).
//   · `ai` — Confidential AI and Agents es otro stack (`near.ai`).
//
// En B eso se vuelve el corte de familia (el riel trae el negro justo ahí) y
// en C decide el peso de las cards del bento. En A no se usa para el layout,
// pero el dato viaja igual: el día que A quiera marcarlo, el campo está.
//
// `evidence` son los nombres propios que el cuerpo de cada bloque ya menciona,
// extraídos para que C pueda ponerlos DENTRO de su card sin volver a
// transcribirlos. En A y en B no los lee nadie, y está bien: es el mismo dato
// que el cuerpo dice, no un dato nuevo.
export const SOLUTIONS = [
  {
    id: "payments",
    kicker: "Payments",
    title: "Payments",
    family: "value",
    body: "Pay with any asset on any chain: the recipient gets their currency on the chain they choose. Stripe and Tempo's Machine Payments Protocol settles across 30+ chains on NEAR, and Abound uses NEAR AI to handle cross-border remittances.",
    evidence: ["Stripe", "Tempo", "Abound"],
    link: { label: "Explore payments", href: "https://intents.near.org/use-cases/cross-pay" },
  },
  {
    id: "agentic",
    kicker: "Agentic Finance",
    title: "Agentic Finance",
    family: "value",
    body: "NEAR is where agents transact: settling trades, routing payments, and rebalancing treasuries continuously, at machine speed and micro scale. On NEAR, agents reach liquidity across chains, discover and pay each other for work, and settle with finality no human-paced rail was built for.",
    evidence: [],
    link: {
      label: "Explore how NEAR powers the agent economy",
      href: "https://near.org/blog/agent-economy",
    },
  },
  {
    id: "defi",
    kicker: "Cross-Chain DeFi",
    title: "Cross-Chain DeFi",
    family: "value",
    body: "One-click, confidential swaps across 30+ chains and 180+ assets, filled by a competitive solver network in seconds for sub-cent fees, including routes bridges cannot reach like native BTC, XRP, and Zcash. Zodl, Ledger, Brave Wallet, Infinex, SwapKit, LayerZero, and other major DeFi protocols and infrastructure providers build on NEAR.",
    evidence: ["Zodl", "Ledger", "Brave Wallet", "Infinex", "SwapKit", "LayerZero"],
    link: { label: "Explore NEAR Intents", href: "https://intents.near.org" },
  },
  {
    id: "treasury",
    kicker: "Treasury Management",
    title: "Treasury Management",
    family: "value",
    body: "Move and rebalance capital continuously across chains from one account, with assets staying in your control the whole time. The settlement layer for treasuries that operate at machine speed rather than banking hours.",
    evidence: [],
    link: { label: "Explore NEAR Intents", href: "https://intents.near.org" },
  },
  {
    id: "confidential-ai",
    kicker: "Confidential AI and Agents",
    title: "Confidential AI and Agents",
    family: "ai",
    body: "Run inference inside trusted execution environments where the host, the operator, and NEAR itself are cryptographically locked out, and deploy agents on IronClaw with credentials isolated by hardware. Abound, Venice AI, Brave, and global enterprises build on NEAR AI.",
    evidence: ["Abound", "Venice AI", "Brave"],
    link: { label: "Explore NEAR AI", href: "https://near.ai" },
  },
] as const;

// ── Spotlight: Confidential Intents ────────────────────────────────────────
//
// No es un sexto bloque. Es confidencialidad APLICADA al movimiento de valor,
// o sea el puente entre las dos familias de arriba — y por eso cada propuesta
// lo trata distinto: A le da una sección oscura propia, B lo pone del otro
// lado de su corte junto a Confidential AI, y C lo mete como card oscura
// dentro del bento.
export const SPOTLIGHT = {
  eyebrow: "Confidential Intents",
  body: "For the positions that move markets, NEAR's Confidential Intents keeps transfers, deposits, withdrawals, and swaps out of public view, with selective disclosure when institutions need it. Powered by a NEAR private shard.",
  link: { label: "Explore Confidential Intents", href: "https://intents.near.org/confidential" },
} as const;

// ── El muro de constructores ───────────────────────────────────────────────
//
// Los ocho de la captura de la homepage viva, con su descripción.
//
// ── Cinco marcas reales de ocho ────────────────────────────────────────────
//
// `public/logos/` tiene cinco archivos: `abound.png`, `brave.png`,
// `ledger.png`, `venice.png` y `zodl.png`. **Government of Bermuda, NVIDIA e
// Intel no tienen asset en el repo.** Van con `logo: null` y caen al nombre
// puesto en tipo.
//
// No es un hueco esperando a que alguien lo llene con un placeholder de otra
// marca: es la decisión que `chain/ProofBand` argumenta para su strip —una
// marca real al lado de siete ajenas es menos honesto y menos legible que
// ocho nombres bien compuestos, a ocho pesos ópticos distintos— y la que
// `homepageUpdateContent.ts` ya aplica a Bermuda en `CUSTOMER_STORIES`.
//
// Cuando lleguen los tres logotipos que faltan: se sueltan en `public/logos/`
// y se cambia `logo: null` por `{ src, width, height }`. Los tres componentes
// que lo pintan ya tienen el fallback, así que no hay que tocar ninguno.
export const BUILDERS = [
  {
    id: "venice",
    name: "Venice AI",
    logo: { src: "/logos/venice.png", width: 89, height: 40 },
    body: "Venice uses NEAR AI's private inference for verifiably private text and image generation, with prompts processed inside hardware-enforced enclaves.",
    href: "https://near.ai/blog/venice-is-now-verifiably-private-with-near-ai",
  },
  {
    id: "zodl",
    name: "Zodl",
    logo: { src: "/logos/zodl.png", width: 133, height: 27 },
    body: "Zodl wallet integrated NEAR Intents to enable cross-chain swaps from BTC, USDC, and Solana into shielded ZEC.",
    href: "https://intents.near.org/case-studies",
  },
  {
    id: "abound",
    name: "Abound",
    logo: { src: "/logos/abound.png", width: 111, height: 24 },
    body: "Backed by the Times of India Group, Abound is deploying IronClaw AI-powered financial services in India's $155B remittance market.",
    href: "https://near.ai/blog/near-ai-and-the-times-of-india-groups-abound-are-bringing-agentic-payments-to-cross-border-finance",
  },
  {
    id: "bermuda",
    name: "Government of Bermuda",
    logo: null,
    body: "The Government of Bermuda partnered with NEAR AI to deploy confidential AI for public services, starting with a secure assistant for processing sensitive citizen data.",
    href: "https://near.ai/blog/government-of-bermuda-and-near-ai-partner-to-deploy-ai-powered-public-services",
  },
  {
    id: "brave",
    name: "Brave",
    logo: { src: "/logos/brave.png", width: 86, height: 24 },
    body: "Brave Nightly uses NEAR AI for private inference. Brave Wallet integrated NEAR Intents for cross-chain swaps.",
    href: "https://brave.com/blog/browser-ai-tee/",
  },
  {
    id: "ledger",
    name: "Ledger",
    logo: { src: "/logos/ledger.png", width: 117, height: 39 },
    body: "Ledger Wallet integrated NEAR Intents as a swap provider via SwapKit, bringing cross-chain execution to hardware wallet users.",
    href: "https://www.ledger.com/blog-near-intents-joins-ledger-wallet-via-swapkit",
  },
  {
    id: "nvidia",
    name: "NVIDIA",
    logo: null,
    body: "NEAR AI joined the NVIDIA Inception program to accelerate enterprise-grade, verifiable AI with confidential compute.",
    href: "https://near.ai",
  },
  {
    id: "intel",
    name: "Intel",
    logo: null,
    body: "NEAR AI uses Intel TDX gateways for CPU-level confidential compute, securing inference from edge to cloud.",
    href: "https://near.ai",
  },
] as const;

// ── Cierre ─────────────────────────────────────────────────────────────────
//
// Dos botones y no uno: el copy los pide explícitamente, y son dos públicos
// distintos (quien va a leer docs no va a escribir a ventas). El titular vive
// en el JSX, como el resto.
export const CLOSING = {
  subhead:
    "Developer, protocol, or enterprise, start with the solution that fits, or talk to our team of experts.",
  primary: { label: "Read the docs", href: "https://docs.near.org" },
  secondary: { label: "Talk to the team", href: "/contact-us" },
} as const;

// El tipo de un bloque, para las secciones que mapean sobre `SOLUTIONS` y
// necesitan tipar el parámetro. `(typeof SOLUTIONS)[number]` y no una interfaz
// escrita a mano: así el tipo no puede separarse del dato.
export type Solution = (typeof SOLUTIONS)[number];
export type Builder = (typeof BUILDERS)[number];
export type ProofStat = (typeof PROOF_STATS)[number];
