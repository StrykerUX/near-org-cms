"use client";

import Container from "@/components/primitives/Container";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { STATS, STATS_NOTE } from "@/components/sections/community/communityContent";

// §2 of the Board — the four figures as a running strip.
//
// ── Why a strip and not a row of four ──────────────────────────────────────
// `a/` sets these as four cells on four rules, which is the right treatment for
// a page that presents them as facts to be read once. This variant wants the
// page to feel LIVE — that is the whole brief for the board — and a strip that
// is already moving when the reader arrives says "this is a feed" before a
// single word is read. It also costs almost no vertical space, which matters on
// a layout whose value is how much of the page fits in one screen.
//
// ── The one honest thing a moving figure must not do ───────────────────────
// It moves horizontally and never counts. A figure that ticks upward implies
// live telemetry, and these four are quarterly numbers wired to nothing; the
// same rejection is written up at length in `chain/ProofBand`. Translation
// carries the liveness without making a claim about the data.
//
// The provenance line sits under the strip in static type, at a reading size:
// the strip is a texture and cannot be read carefully, so the sentence that
// makes the figures accountable must not be inside it.
//
// The wrapper holds exactly two identical copies of the list, so its width is
// precisely 2× one set and −50% is exact by construction — no measuring, and it
// stays exact when the font swaps. Same construction as `ProofBand`'s
// `EcosystemStrip`; the second copy is `aria-hidden` because a screen reader
// should not hear the four figures twice.
export default function BoardTicker() {
  const rootRef = useMotionScope<HTMLDivElement>(({ q, motionOk }) => {
    if (!motionOk) return;

    const tween = gsap.fromTo(
      q("[data-marquee]"),
      { xPercent: 0 },
      { xPercent: -50, duration: 38, repeat: -1, ease: "none", force3D: true }
    );

    return () => tween.kill();
  });

  const set = (
    <>
      {STATS.map((s) => (
        <span key={s.id} className="flex items-baseline gap-4 whitespace-nowrap">
          <span className="text-h4-mono text-ink">{s.value}</span>
          <span className="text-caption-mono uppercase text-gray-intermediate">{s.label}</span>
          <span className="size-1.5 self-center rounded-full bg-near-green-accent" aria-hidden="true" />
        </span>
      ))}
    </>
  );

  return (
    <section className="bg-cream pb-[8svh]">
      <div ref={rootRef} className="overflow-hidden border-y border-rule py-4">
        {/* Both halves are structurally IDENTICAL — same wrapper, same padding.
            One copy loose in the track and the other in a div makes the track
            2× a set PLUS one gap, and −50% then slips by that gap every loop. */}
        <div data-marquee className="flex w-max">
          <div className="flex gap-8 pr-8">{set}</div>
          <div className="flex gap-8 pr-8" aria-hidden="true">
            {set}
          </div>
        </div>
      </div>

      <Container>
        <p className="mt-5 max-w-[62ch] text-caption text-gray-intermediate text-pretty">
          {STATS_NOTE}
        </p>
      </Container>
    </section>
  );
}
