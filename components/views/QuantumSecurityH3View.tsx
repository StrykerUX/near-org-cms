import HeroH3 from "@/components/sections/quantum-security-heroes/HeroH3";
import ProofList from "@/components/sections/quantum-security-labs/h3/ProofList";
import ThreatScene from "@/components/sections/quantum-security-labs/h3/ThreatScene";
import OnlyNearCard from "@/components/sections/quantum-security-labs/h3/OnlyNearCard";
import LiveToday from "@/components/sections/quantum-security-labs/h3/LiveToday";
import RotationAhead from "@/components/sections/quantum-security-labs/h3/RotationAhead";
import BeyondAccountsAccordion from "@/components/sections/quantum-security-copy/BeyondAccountsAccordion";
import ComparisonPairs from "@/components/sections/quantum-security-labs/h3/ComparisonPairs";
import Roadmap from "@/components/sections/quantum-security-copy/Roadmap";
import InTheNews from "@/components/sections/quantum-security-copy/InTheNews";
import FaqAccordion from "@/components/sections/quantum-security-labs/h3/FaqAccordion";
import ClosingCard from "@/components/sections/quantum-security-labs/h3/ClosingCard";

// /prototype/quantum-security-h3 — proposal **H3 · Editorial**.
//
// `HeroH3`, `Roadmap` and `InTheNews` are settled and untouched. Everything
// between them is this proposal's own, with one deliberate exception noted
// below.
//
// **Where the design comes from.** `/prototype/chain-ab-propuesta-b`'s
// temperament: lists separated by `gap` and not by rules, uneven two-column
// splits (`lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]`), value-and-gloss on
// one baseline joined by an em dash, and the sticky accumulating scene built on
// `enableScene`/`trackTimeline`. The two dark statement cards are
// `homepage-a/AgentEconomy`'s black card, and the FAQ badge is the current
// build's. Nothing here is a new visual idea — it is this site's parts, put in
// a different order than H2 puts them.
//
// **`BeyondAccountsAccordion` is imported, not rewritten.** It already exists in
// `quantum-security-copy/`, it is the horizontal accordion asked for, and
// building a second one here would leave two files claiming to be the same
// component — which the sections README forbids. H2 takes the same three
// surfaces onto the `WhyItMatters` staircase instead.
//
// **Where the two proposals must NOT be compared.** They share
// `quantumContent.ts` down to the comma, and the two lines the current build
// dropped come from `labContent.ts`, shared too. If a word reads differently
// between the two pages, that is a bug in one of them, not a proposal.
//
// ── Ground rhythm ──────────────────────────────────────────────────────────
// Cream almost throughout, which is what the reference pages do. This proposal
// spends its dark on three things and no more: the pinned scene, and the two
// statement cards that bookend the argument.
//
//   hero · proof                                   cream
//   threat + solution (pinned)                     ink-slate  ← the scene
//   content block                                  ink card on cream
//   live today · one rotation ahead                cream
//   beyond accounts · comparison                   cream
//   Roadmap · InTheNews                            white (as they are)
//   FAQ                                            cream
//   closing                                        ink card on cream
//
// The scene and both cards carry `data-nav-dark`, so the fixed header inverts
// over them — the contract every dark surface on the site honours.
export default function QuantumSecurityH3View() {
  return (
    <main className="flex flex-col bg-cream">
      <HeroH3 />
      <ProofList />
      <ThreatScene />
      <OnlyNearCard />
      <LiveToday />
      <RotationAhead />
      <BeyondAccountsAccordion />
      <ComparisonPairs />
      <Roadmap />
      <InTheNews />
      <FaqAccordion />
      <ClosingCard />
    </main>
  );
}
