"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { lattice } from "@/components/sections/quantum-security-labs/quantumArt";
import { CONTENT_BLOCK as C } from "@/components/sections/quantum-security-labs/labContent";

// ── H3 · §Content block ────────────────────────────────────────────────────
// The deck's `[Content Block]` is one sentence with no heading and no eyebrow.
// This proposal gives it the site's statement card: an `--ink` panel on cream at
// `--text-manifesto`, which is the treatment `homepage-update/AgentEconomy`
// uses for the homepage's one manifesto line.
//
// **`--text-manifesto` and its condition.** The token exists for "a paragraph
// statement read large INSIDE a box", and its ramp is in `cqw` — measured
// against the CARD, not the viewport — precisely so the proportion between the
// text and its box survives a wide monitor, where the card stops growing at the
// Container's max width and `vw` type would not. **That only works if the block
// declares `@container`**; without one, `cqw` resolves against the viewport and
// the sentence breaks out of the card. Hence the container query on the panel.
//
// **Why a card and not a rule.** This is the one place the two proposals take
// the same sentence to opposite ends of the same axis: H2 sets it between two
// hairlines on cream, as an aside the page pauses to make; H3 puts it in a
// black box, as the page raising its voice once. Both are house treatments —
// the ruled statement is `ForwardTurn`'s, the black card is `AgentEconomy`'s —
// and picking between them is the kind of decision these prototypes exist to
// make.
//
// The lattice behind it is the one honest picture available: ML-DSA is a
// lattice-based scheme, so a point lattice with its two basis vectors is the
// right family of shape, where a mesh or a grain would be atmosphere standing
// in for mathematics. It is not a diagram of the algorithm — no picture is —
// and it sits at a contrast where it cannot be read as one.
const LATTICE = lattice(16, 9, 0.34);

export default function OnlyNearCard() {
  const ref = useScrollReveal<HTMLDivElement>({ start: "top 82%", y: 30 });

  return (
    <section className="bg-cream py-16 lg:py-24">
      <Container>
        <div
          ref={ref}
          data-nav-dark
          className="@container relative overflow-hidden rounded-[clamp(20px,2vw,32px)] bg-ink px-8 py-20 text-white lg:px-16 lg:py-28"
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="size-full">
              {LATTICE.points.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="0.22" className="fill-white/25" />
              ))}
              <g className="text-near-green-accent/60">
                <line
                  x1={LATTICE.points[0].x}
                  y1={LATTICE.points[0].y}
                  x2={LATTICE.points[0].x + LATTICE.basis.x1}
                  y2={LATTICE.points[0].y + LATTICE.basis.y1}
                  stroke="currentColor"
                  strokeWidth="0.4"
                  vectorEffect="non-scaling-stroke"
                />
                <line
                  x1={LATTICE.points[0].x}
                  y1={LATTICE.points[0].y}
                  x2={LATTICE.points[0].x + LATTICE.basis.x2}
                  y2={LATTICE.points[0].y + LATTICE.basis.y2}
                  stroke="currentColor"
                  strokeWidth="0.4"
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            </svg>
          </div>

          <p data-reveal className="relative max-w-[24ch] text-pretty text-manifesto">
            {C.before} <Accent display>{C.accent}</Accent> {C.after}
          </p>
        </div>
      </Container>
    </section>
  );
}
