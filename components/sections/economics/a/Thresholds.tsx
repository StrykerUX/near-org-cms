"use client";

import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { EASE_OUT, DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import FactGlyph from "@/components/sections/economics/factGlyphs";
import { MATURITY } from "@/components/sections/economics/economicsContent";

// §2 of variant A — the four thresholds already crossed.
//
// ── Why columns under a rule, and not cards ────────────────────────────────
// The house doctrine is in `chain/WhyItMatters.tsx` and it applies here for an
// extra reason of this page's own: the section immediately below is a RING, and
// a ring is the least box-like figure there is. Four bordered rectangles
// leading into it would make the page look like two different arguments stapled
// together. The hairline separates without enclosing, so the eye crosses from
// four open columns into an open circle.
//
// ── Why the figure leads and the claim follows ─────────────────────────────
// These four are the page's checkable facts — the reason nothing downstream has
// to be hedged. A reader who scans only the figures gets `100% · −50% · Onchain
// · 5 yrs` and has already received the section. Leading with the claim would
// make the same reader assemble four sentences to get there.
//
// ── No count-up ───────────────────────────────────────────────────────────
// Two of these four cannot count at all: `Onchain` is not a number, and `−50%`
// is a cut, so a tally would run it the wrong way up. That is the same concrete
// objection `chain/ProofBand.tsx` documents for `<$0.01` — a counter treatment
// covers half the row and has to special-case the rest, which destroys exactly
// the evenness that lets the row be read in one sweep. And on a tokenomics page
// specifically, a rising number is the genre default this whole page was built
// to avoid.
//
// ── The glyph sits between the figure and the claim ────────────────────────
// Each column now carries the drawing of its own fact (`../factGlyphs`), and it
// goes in the one position where it is doing work: the figure states the
// quantity, the glyph shows its SHAPE, and only then does the sentence arrive to
// name it. Above the figure it would be an ornament introducing a number;
// under the body it would be an afterthought nobody reaches. In between, a
// reader who scans the row gets `100% · a full span · Supply is fully unlocked`
// in one downward sweep per column.
//
// It enters on this section's existing timeline — the four glyphs are the third
// wave, after the rules and the figures and before the claims — because four
// hairline drawings the size of a line of type do not need four ScrollTriggers
// of their own.

export default function Thresholds() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk }) => {
    if (!motionOk) return;

    const tl = gsap.timeline({
      defaults: { ease: EASE_OUT },
      scrollTrigger: {
        trigger: scope,
        start: "top 72%",
        once: true,
        markers: DEBUG_MARKERS,
      },
    });

    tl.from(q("[data-rule]"), { scaleX: 0, duration: 0.8, stagger: 0.12 }, 0)
      // The figure follows its own rule out by a fifth of a second, so the row
      // reads as four rules drawing with four figures coming up behind them and
      // not as two separate waves crossing the section.
      .from(q("[data-figure]"), { autoAlpha: 0, y: 22, duration: 0.85, stagger: 0.12 }, 0.2)
      .from(q("[data-glyph]"), { autoAlpha: 0, duration: 0.55, stagger: 0.12 }, 0.34)
      .from(q("[data-claim]"), { autoAlpha: 0, y: 14, duration: 0.6, stagger: 0.12 }, 0.42);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  });

  return (
    <section ref={rootRef} className="bg-cream pb-[14svh] pt-[6svh]">
      <Container>
        <Eyebrow className="text-gray-intermediate">{MATURITY.eyebrow}</Eyebrow>

        <div className="mt-12 grid-ds gap-y-10">
          <h2 className="col-span-12 max-w-[18ch] text-h1 text-pretty lg:col-span-6">
            {MATURITY.headline}
          </h2>
          <p className="col-span-12 max-w-[52ch] text-body-lg text-ink-soft text-pretty lg:col-span-5 lg:col-start-8">
            {MATURITY.intro}
          </p>
        </div>

        <div className="mt-24 grid-ds gap-y-14">
          {MATURITY.facts.map((f) => (
            <div key={f.id} className="col-span-12 sm:col-span-6 lg:col-span-3">
              <div data-rule className="h-px w-full origin-left bg-rule" aria-hidden="true" />

              <p className="mt-5 text-caption-mono text-gray-intermediate">{f.index}</p>

              <div data-figure>
                <p className="mt-6 text-h1">{f.figure}</p>
                <p className="mt-3 max-w-[20ch] text-caption-mono text-gray-intermediate">
                  {f.figureLabel}
                </p>
              </div>

              <div data-glyph className="mt-9 text-ink">
                <FactGlyph id={f.id} />
              </div>

              <div data-claim>
                <h3 className="mt-9 max-w-[18ch] text-h4 text-pretty">{f.title}</h3>
                <p className="mt-4 max-w-[34ch] text-body-sm text-ink-soft text-pretty">
                  {f.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
