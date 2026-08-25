// La copy de los nueve heroes X, en un solo módulo.
//
// ── Por qué existe, si cada página ya tiene la suya ────────────────────────
//
// Porque el hero X necesita una FORMA que ninguna de las nueve tiene hoy. Cada
// página guarda su hero como le convino: `about` usa `headline` + `sub` +
// `standfirst`, `community` y `economics` traen `primary`/`secondary`,
// `chain` guarda solo el subtítulo y el titular vive dentro del componente,
// `quantum` y `protocol` no tienen módulo de copy para el hero. Nueve formas
// para el mismo bloque.
//
// El hero X pide siempre las mismas cinco piezas —rótulo, titular en dos
// tramos, cuerpo y salida— así que acá se normalizan. **Las palabras son las
// que ya estaban**: esto no inventa copy, la reacomoda.
//
// ── Lo único que sí es nuevo: dónde corta el titular ───────────────────────
//
// El hero parte el titular en dos: el primer tramo va en sans y el segundo en
// serif itálica. Tres páginas ya venían partidas así en su propio componente
// (`protocol`, `chain`, `quantum`) y sus cortes están transcritos tal cual. Las
// otras seis tenían el titular como una sola cadena, así que el corte se
// eligió acá.
//
// Es una decisión de COMPOSICIÓN y por eso vive con el layout y no con la copy:
// el corte separa el sujeto de lo que se afirma de él —«The community steers
// the system, / not a company»— y moverlo cambia qué se enfatiza, no qué se
// dice. Si alguien reescribe un titular en el módulo de su página, este corte
// hay que revisarlo a mano: no hay forma de derivarlo.
//
// ── La salida es opcional ──────────────────────────────────────────────────
//
// Cuatro de las nueve páginas no tienen CTA en su hero actual, y no se les
// inventa uno: un botón que lleva a ningún lado es peor que la ausencia de
// botón. El layout se recompone sin él — el bloque derecho queda solo con el
// cuerpo.

export type HeroXContent = {
  /** El rótulo en versalitas mono, arriba del titular. */
  eyebrow: string;
  /** El primer tramo del titular, en sans. */
  lead: string;
  /** El segundo tramo, en serif itálica. Ver la nota sobre el corte. */
  accent: string;
  /** El párrafo de la derecha. */
  body: string;
  /** La salida. Ausente cuando la página no tiene una. */
  cta?: { label: string; href: string; external?: boolean };
};

/** Las nueve páginas que estrenan el hero. El id es el de su preset. */
export type HeroXPage =
  | "protocol"
  | "chain"
  | "quantum"
  | "about"
  | "community"
  | "economics"
  | "ecosystem"
  | "governance"
  | "foundation";

export const HERO_X: Record<HeroXPage, HeroXContent> = {
  // Transcrito de `protocol/ProtocolHero`. Es el hero del que sale todo esto,
  // así que su copy es la referencia contra la que se leen las otras ocho.
  protocol: {
    eyebrow: "NEAR Protocol",
    lead: "The settlement layer",
    accent: "for the agent economy",
    body: "1 million TPS scalability, confidential by default, quantum ready. Proven on mainnet for five years.",
    cta: { label: "Start building", href: "https://docs.near.org", external: true },
  },

  // El corte ya venía partido en `chain/ChainHero` y es el más cargado de los
  // nueve: la primera mitad es lo que desaparece y la segunda lo que no.
  chain: {
    eyebrow: "Chain abstraction",
    lead: "The chain disappears.",
    accent: "You don’t.",
    body: "Chain abstraction makes every chain feel like one system. Hold, swap, and move any asset across 35+ chains from a single account. No bridges, no wrapped tokens, no gas to juggle. The complexity goes away. Your control over it never does.",
  },

  // `quantum/QuantumHero` no tiene rótulo —su hero va centrado y no lo
  // necesita— y el hero X sí: la columna izquierda arranca con él. «Quantum
  // security» es el label con que el sitemap nombra a la página, no una
  // etiqueta nueva.
  quantum: {
    eyebrow: "Quantum security",
    lead: "Post quantum security,",
    accent: "live on mainnet",
    body: "Quantum computing threatens the cryptography that secures every blockchain. NEAR accounts are decoupled from cryptography by design, so upgrading to post-quantum security takes a single key rotation.",
    cta: { label: "See NEAR’s quantum roadmap", href: "#roadmap" },
  },

  // El corte deja el nombre entero en la serif. Partirlo antes («The History /
  // of NEAR Protocol») rompería «of» contra el nombre, que es lo único que la
  // página tiene por titular.
  about: {
    eyebrow: "History",
    lead: "The History of",
    accent: "NEAR Protocol",
    body: "Illia Polosukhin and Alexander Skidanov founded NEAR Protocol in 2018 with the goal of building a scalable, usable blockchain.",
  },

  community: {
    eyebrow: "Community",
    lead: "The people building",
    accent: "the open web",
    body: "NEAR is built in the open by a global community of developers, creators, and contributors. Join the Legion, find your local crew, and help build the user-owned internet.",
    cta: { label: "Get involved", href: "#get-involved" },
  },

  // El corte cae en la bisagra de la frase: qué es la economía, y de qué
  // depende. Es la única de las nueve donde el segundo tramo es una condición y
  // no un complemento.
  economics: {
    eyebrow: "NEAR economics",
    lead: "An economy that grows stronger",
    accent: "the more it’s used",
    body: "NEAR isn’t just a blockchain, it’s an economic system where real usage generates real revenue, and that value flows back to the network itself. The more people and applications build and transact on NEAR, the more the whole system compounds.",
    cta: { label: "See the live numbers", href: "https://revenue.near.org", external: true },
  },

  ecosystem: {
    eyebrow: "The ecosystem",
    lead: "Built by an ecosystem,",
    accent: "not a company",
    body: "Hundreds of applications, wallets, and protocols build on NEAR. The Foundation supports the ecosystem that builds them. The builders own what they make.",
  },

  governance: {
    eyebrow: "Governance",
    lead: "The community steers the system,",
    accent: "not a company",
    body: "NEAR’s economic decisions are made through House of Stake, an onchain governance system that’s already passing binding proposals.",
  },

  // El titular de la Fundación es el más largo de los nueve y por eso el corte
  // cae tan tarde: lo que la serif tiene que llevarse es el PARA QUÉ, y ese
  // tramo no empieza hasta «to benefit».
  foundation: {
    eyebrow: "NEAR Foundation",
    lead: "Enabling community-driven innovation",
    accent: "to benefit people around the world",
    body: "NEAR Foundation is a Swiss nonprofit supporting the open infrastructure for the agent economy, where you own your assets, your intelligence, and your world.",
  },
};
