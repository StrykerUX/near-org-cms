"use client";

import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";

// Section 2. A GRID, not the quantum page's marquee.
//
// These six figures are the page's credibility argument — they are meant to be
// read and compared against each other, and a continuously scrolling marquee
// gives the eye no resting position to do that from. So the motion is a
// one-shot reveal on entry and then stillness.

const PROOF = [
  { figure: "100% uptime", note: "5+ years on mainnet" },
  { figure: "1M+ TPS", note: "Publicly verifiable" },
  { figure: "600ms", note: "Block time" },
  { figure: "1.2s", note: "Finality" },
  { figure: "10 shards", note: "Plus a private shard" },
  { figure: "<$0.002", note: "Avg transaction fee" },
] as const;

export default function ProofGrid() {
  // The ref goes on the grid rather than the section: useScrollReveal triggers
  // off its own scope, and the section starts a full py higher, so the cells
  // would fire while still below the fold.
  const gridRef = useScrollReveal<HTMLDivElement>({ y: 20, stagger: 0.07 });

  return (
    <section className="border-y border-dashed border-foreground/20 bg-cream text-foreground">
      <Container className="py-11">
        <div ref={gridRef} className="grid gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
          {PROOF.map((p) => (
            <div key={p.figure} data-reveal className="flex flex-col gap-1">
              <span className="text-h4">{p.figure}</span>
              <span className="text-caption text-gray-intermediate">{p.note}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
