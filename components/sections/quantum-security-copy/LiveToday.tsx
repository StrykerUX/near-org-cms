"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import CtaPill from "@/components/sections/quantum/CtaPill";
import { LIVE_TODAY_POINTS as POINTS, EXTERNAL_LINKS } from "@/components/sections/quantum-security-copy/quantumContent";

// "Post-quantum signing, live on mainnet": what exists today, in three points.

// Seconds between one card starting and the next. Long enough that the eye
// finishes each before the following one moves — the point of the sequence is
// that the three are read in order, not that they arrive together.
const BEAT = 0.34;

export default function LiveToday() {
  // The ref goes on the grid, not the section: useScrollReveal uses its own
  // scope as the trigger, and with the whole section (which starts a full py-40
  // higher) the cards would reveal while still below the fold.
  //
  // Custom choreography rather than the default stagger: the default is 0.09s
  // against a 0.9s duration, so the three cards are all in flight at once and
  // read as one block landing. Here each card is a beat of its own — its rule
  // draws left to right, the copy rises behind it, and the next card does not
  // start until this one is most of the way through.
  const gridRef = useScrollReveal<HTMLDivElement>({
    build: ({ tl, q }) => {
      const cards = q("[data-reveal]");
      cards.forEach((card, i) => {
        const at = i * BEAT;
        const rule = card.querySelector("[data-rule]");
        const copy = card.querySelectorAll("[data-copy]");
        if (rule) {
          tl.from(rule, { scaleX: 0, duration: 0.55, ease: "power2.out" }, at);
        }
        tl.from(copy, { autoAlpha: 0, y: 18, duration: 0.7, stagger: 0.08 }, at + 0.12);
      });
    },
  });

  return (
    <section className="bg-background text-foreground">
      <Container className="flex flex-col gap-[88px] py-40">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
          <div className="flex flex-col gap-5">
            <h2 className="text-h2 text-pretty">
              Post-quantum signing,
              <br />
              <Accent>live on mainnet</Accent>
            </h2>
          </div>

          <div className="flex flex-col gap-5 lg:pt-2">
            <p className="text-body-lg text-ink-soft text-pretty">
              NEAR supports FIPS-204 (ML-DSA), a NIST-approved lattice-based post-quantum
              signature scheme, at the protocol level. Any account holder rotates to
              quantum-safe keys through the NEAR CLI.
            </p>
            <CtaPill
              href={EXTERNAL_LINKS.rotateKeysCli}
              tone="filled"
              external
            >
              Rotate your keys with the NEAR CLI
            </CtaPill>
          </div>
        </div>

        <div ref={gridRef} className="grid gap-6 md:grid-cols-3">
          {POINTS.map((p) => (
            <div key={p.title} data-reveal className="relative flex flex-col gap-3 pt-6">
              {/* A span rather than `border-t`: a border cannot be drawn on.
                  `origin-left` is what makes the scaleX read as the rule
                  extending from the left edge instead of growing from centre. */}
              <span
                data-rule
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px origin-left bg-foreground"
              />
              <h3 data-copy className="text-h4">
                {p.title}
              </h3>
              <p data-copy className="text-body text-ink-soft text-pretty">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
