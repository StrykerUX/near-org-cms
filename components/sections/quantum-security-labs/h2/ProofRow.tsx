import Container from "@/components/primitives/Container";
import { MARQUEE_PROOFS as PROOFS } from "@/components/sections/quantum-security-copy/quantumContent";

// ── H2 · §Proof strip ──────────────────────────────────────────────────────
// The six facts as the house's compact ruled row: `divide` between cells,
// `border-y` around the block, value at `text-h3`, label in mono small caps.
// It is the same object as `chain-ab-propuesta-a/Proof`'s stat block, and using
// it here is the point — this page and that one are the same site.
//
// **Why it stops moving.** The marquee it replaces has one structural problem:
// motion signals decoration, so a reader who has just met the hero waits for
// the band to finish before deciding whether it is worth reading, and it never
// finishes. Six one-line facts are a spec, and a spec is read, not watched.
//
// **Value above, label below.** The house order (chain-A's stat row, chain-B's
// stat list, `ProofBand`) — the number leads and the gloss qualifies it. Worth
// noting because these six are not all numbers: "Account-level" is the value
// and "Default path, not an opt-in tool" is its gloss, and keeping the same
// slots for both kinds is what lets the eye read six cells with one habit.
//
// Server component. Nothing here animates, and nothing needs to.
export default function ProofRow() {
  return (
    <section className="bg-cream py-14 lg:py-20">
      <Container>
        <dl className="grid grid-cols-1 divide-y divide-rule border-y border-rule sm:grid-cols-2 lg:grid-cols-3 lg:divide-x">
          {PROOFS.map((p) => (
            <div key={p.fact} className="flex flex-col gap-1.5 py-6 lg:px-8 lg:first:pl-0">
              <dt className="text-h3 text-pretty">{p.fact}</dt>
              <dd className="uppercase text-caption-mono text-gray-intermediate">{p.gloss}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
