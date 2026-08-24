"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { MISSION } from "@/components/sections/foundation/foundationContent";
import { HILL, levels, ring } from "@/components/sections/foundation/c/terrain";

// §3 — the thesis, as the one full-bleed drawing on the page.
//
// ── The summit withdraws, and the ground does not ─────────────────────────
// "Our goal is to make ourselves smaller" is the hardest sentence on the page
// and the easiest one to illustrate badly. What is being claimed is not that
// the Foundation vanishes and not that it shrinks in place: it is that the
// high ground it occupies passes to the terrain around it. A contour map can
// say exactly that and almost nothing else can — the outer curves are the
// ground, the inner ones are the mass standing on it, and when the inner ones
// draw in, the map still describes the same country.
//
// So the animation is not decoration here: the drawing IS the sentence, which
// is the only condition under which a figure on this site animates itself.
// Everything else on this page enters with the section's reveal.
//
// ── Why it is scrubbed and not played ─────────────────────────────────────
// Same reason `chain/CompletePicture` gives: the animation and the sentence
// are one statement, so the retreat has to happen at the pace the reader
// descends it. Played once on entry, the whole withdrawal is spent before the
// first paragraph has been read.
//
// ── What the markup renders ───────────────────────────────────────────────
// The FINAL state — summit drawn in, fills drained, spot height still marked —
// and the scene winds it back to the full peak. Without JS or with reduced
// motion the reader gets a resolved drawing whose caption is true of it, which
// is the whole point of rendering the end and not the beginning.

const W = 1440;
const H = 440;
/** Off centre: a summit in the middle of a wide frame reads as a target. */
const CX = 604;
const CY = 268;

const RINGS = 16;
/** The outer curves run past the frame on both sides — this is the bleed. */
const OUTER = 880;
const INNER = 44;
const FLAT = 0.34;

const LEVELS = levels(RINGS, OUTER, INNER);
/** How many of the innermost curves are the mass rather than the ground. */
const SUMMIT = 7;
const GROUND = RINGS - SUMMIT;

/**
 * What is left of the summit at the end. Not zero: the page says smaller, and
 * a peak that goes to nothing says gone.
 */
const RESIDUE = 0.38;

export default function DevolutionRelief() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk }) => {
    if (!motionOk) {
      gsap.set(q("[data-relief-item]"), { clearProps: "all", autoAlpha: 1 });
      return;
    }

    const summit = q<SVGPathElement>("[data-summit]");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scope,
        start: "top 74%",
        end: "bottom 76%",
        scrub: 0.7,
        markers: DEBUG_MARKERS,
      },
    });

    tl.from(summit, {
      // `svgOrigin` and not `transformOrigin`: every curve has to scale about
      // the summit of the hill, and each path's own bbox centre is a slightly
      // different point — enough for the rings to drift apart as they close in.
      svgOrigin: `${CX} ${CY}`,
      scale: 1 / RESIDUE,
      fillOpacity: 0.9,
      strokeOpacity: 0.55,
      ease: "none",
      duration: 1,
      stagger: { each: 0.02, from: "end" },
    });

    const copy = gsap.from(q("[data-relief-item]"), {
      y: 26,
      autoAlpha: 0,
      duration: 0.9,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: { trigger: scope, start: "top 72%", once: true, markers: DEBUG_MARKERS },
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      copy.scrollTrigger?.kill();
      copy.kill();
    };
  });

  return (
    <section ref={rootRef} className="overflow-hidden bg-cream pb-[10svh] pt-[14svh]">
      <Container>
        <div className="grid-ds gap-y-10">
          <div data-relief-item className="col-span-12">
            <Eyebrow className="text-gray-intermediate">{MISSION.eyebrow}</Eyebrow>
          </div>

          <h2
            data-relief-item
            className="col-span-12 max-w-[14ch] text-h1 lg:col-span-5 text-balance"
          >
            Our goal is to make ourselves <Accent display>smaller</Accent>
          </h2>

          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            {/* `slice(0, -1)`: the last entry of `body` IS the kicker, set apart
                under the drawing — see the note in foundationContent.ts. */}
            {MISSION.body.slice(0, -1).map((paragraph) => (
              <p
                key={paragraph}
                data-relief-item
                className="mt-7 max-w-[46ch] text-body text-ink-soft first:mt-0 text-pretty"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </Container>

      {/* Full bleed, and outside the Container on purpose: this drawing is
          measured against the viewport rather than against a column, which is
          also why it does not use `Figure` — that shell's rule and caption are
          set to the width of the art, and a 1px rule running the whole width of
          the page reads as a section divider, not as the top of a figure. The
          caption below does the same job at the measure of the grid. */}
      <div className="mt-[8svh] text-ink">
        {/* Cropped rather than shrunk on a phone: scaled to fit, this drawing
            becomes a 110px band and the summit — the whole point of it — stops
            being visible. `xMin` and not `xMid` because the summit sits left of
            centre, so a centred crop would cut it off. */}
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMinYMid slice"
          className="h-[48svh] w-full lg:h-auto"
          aria-hidden="true"
        >
          {/* Filled with the CTA ramp: on this page colour marks ground that
              belongs to somebody else by the end of the drawing. */}
          <defs>
            <linearGradient id="relief-ramp" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#ecfdb0" />
              <stop offset="55%" stopColor="#8bf29c" />
              <stop offset="100%" stopColor="#00b96f" />
            </linearGradient>
          </defs>

          {LEVELS.slice(0, GROUND).map((r) => (
            <path
              key={`ground-${r}`}
              d={ring(HILL, CX, CY, r, FLAT)}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeOpacity="0.45"
            />
          ))}

          {LEVELS.slice(GROUND).map((r) => (
            <path
              key={`summit-${r}`}
              data-summit
              d={ring(HILL, CX, CY, r * RESIDUE, FLAT)}
              fill="url(#relief-ramp)"
              fillOpacity="0"
              stroke="currentColor"
              strokeWidth="1"
              strokeOpacity="0.22"
            />
          ))}

          {/* The spot height. It is the one mark that does not move: the point
              was surveyed, and it stays surveyed after the mass on it is gone. */}
          <g stroke="currentColor" strokeWidth="1" strokeOpacity="0.6">
            <path d={`M ${CX - 7} ${CY} H ${CX + 7}`} />
            <path d={`M ${CX} ${CY - 7} V ${CY + 7}`} />
          </g>
        </svg>
      </div>

      <Container className="mt-8">
        <div className="grid-ds gap-y-10">
          <p
            data-relief-item
            className="col-span-12 text-caption-mono text-gray-intermediate lg:col-span-5"
          >
            The summit draws in; the ground it stood on stays surveyed.
          </p>

          <p
            data-relief-item
            className="col-span-12 max-w-[24ch] text-h3 text-ink lg:col-span-6 lg:col-start-7 text-balance"
          >
            {MISSION.kicker}
          </p>
        </div>
      </Container>
    </section>
  );
}
