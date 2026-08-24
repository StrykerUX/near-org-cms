// Lines from the `/quantum-security` copy deck that the current build does not
// carry, plus the two labels these proposals had to name themselves.
//
// **The deck is still the source of truth and `quantumContent.ts` is still
// where it lands.** Nothing here overrides anything there: both proposals import
// `quantumContent` for every headline, body, FAQ, comparison row and link, and
// neither edits it — it is shared with `/prototype/quantum-security-copy` and
// with the real page.
//
// This file exists for one reason: the deck has a `[Problem + Solution Overall]`
// paragraph that sits above the two beats and frames them, and it is not in the
// build. Rather than quietly dropping a paragraph the deck asks for, or editing
// a shared module from a lab, it lands here and is marked as what it is.

/**
 * `[Problem + Solution Overall]` — verbatim from the deck. It introduces the
 * threat and the answer as ONE thought before either is stated, which is what
 * lets both proposals put the two beats in a single section instead of two
 * unconnected ones.
 */
export const PROBLEM_SOLUTION_LEAD =
  "Every blockchain will have to upgrade its cryptography to prepare for the quantum threat. NEAR designed accounts so that becoming quantum-safe is a single transaction, not a full migration.";

/**
 * `[Content Block]` — also verbatim. It is already in the build inside
 * `MathStatement`'s JSX rather than in data, split around its `<Accent>`. Both
 * proposals set it differently, so the two halves live here and each decides
 * where the accent falls.
 */
export const CONTENT_BLOCK = {
  before: "Every blockchain will have to upgrade its cryptography.",
  accent: "Only NEAR",
  after:
    "was architected from day one to become quantum-safe in a single transaction, not a full migration.",
} as const;

/**
 * The signature schemes on the agility figure.
 *
 * Not deck copy, and the only place either proposal names something the deck
 * does not. It is not invented either: the deck's own bullet says "The protocol
 * already supported EdDSA and ECDSA", and the page names FIPS-204 / ML-DSA
 * throughout. What the figure adds is the CURVE NAMES for those two families,
 * which is what makes the row legible as a list of schemes rather than as a list
 * of acronyms.
 */
export const SCHEMES = [
  { name: "Ed25519", family: "EdDSA", pq: false },
  { name: "secp256k1", family: "ECDSA", pq: false },
  { name: "ML-DSA-65", family: "FIPS-204", pq: true },
] as const;

/**
 * The maturity of the three surfaces in `[Beyond accounts]`.
 *
 * Read off `ROADMAP_STAGES` in `quantumContent.ts`, which places wallets and
 * cross-chain "in progress" and ownership proofs "in research". Nothing new is
 * claimed — it is the page's own roadmap section agreeing with its own beyond-
 * accounts section, which as the deck stands it silently does not.
 */
export const BEYOND_STAGES = ["In progress", "In progress", "In research"] as const;
