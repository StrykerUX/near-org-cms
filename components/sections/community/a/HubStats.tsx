"use client";

import Container from "@/components/primitives/Container";
import CityField from "@/components/sections/community/a/CityField";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { EASE_OUT, DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { STATS, STATS_NOTE } from "@/components/sections/community/communityContent";

export type HubStatsProps = {
  /** The calendar's cities, deduplicated in feed order. Derived by the view. */
  cities: readonly string[];
};

// §2 of the Hub — four figures on four rules, immediately under the hero.
//
// ── Why the provenance line is not optional ────────────────────────────────
// "4,000+ / Contributors" is the crypto-community default and it is unreadable
// as a claim: counted over what window, from which sources, as of when. The
// reader either believes it on faith or discounts it, and both are failures for
// a page whose whole job is to be trusted enough to act on. `STATS_NOTE` answers
// all three questions in one caption, set small and subordinate — it is not
// there to be read first, it is there so the row survives being questioned.
//
// ── The rise is a mask, not a SplitText ────────────────────────────────────
// The house mechanism for a figure arriving is a line mask (see `ProofBand`),
// and here it is built out of two elements instead of `SplitText`: each figure
// is a single short string that never wraps, so there is nothing a re-split
// would fix, and a hand-rolled mask needs no `document.fonts.ready` gate before
// it can measure. The `pb` on the mask is for the comma in "4,000+", which sits
// below the baseline and would otherwise be sheared off by `overflow-hidden`.
//
// One per line below `sm` and not two: at 375px the site container leaves 255px,
// a half-width cell is ~120px, and "4,000+" at the bottom of the `text-h1` clamp
// is wider than that. Stepping the figure down instead would break the row's
// uniformity, which is the one thing this treatment cannot trade.
//
// ── The figure under the row, and why the provenance line moved ───────────
// "70+ / Countries" is the one figure of the four that can be shown rather than
// asserted, because the events calendar names actual cities. `CityField` plots
// them, directly under the row, in the same block — a figure does not get its
// own section here, it lives inside the one making the claim.
//
// Putting it in columns 1–7 pushed `STATS_NOTE` out of the full-width line it
// used to run on and into columns 9–12, at the foot of the drawing, and that is
// an improvement rather than a side effect: the note is about how all of this
// was counted, and it now sits beside the thing being counted instead of
// underneath everything as a footer. It also breaks the block's symmetry, which
// on a page of eight full-width stacks is the first place the eye gets a reason
// to stop.
//
// The rule wipes first and the figure follows it out by a fifth of a second, so
// the row reads as four rules drawing with four numbers coming up behind them
// rather than as two separate waves. Same rhythm as `ProofBand`, on purpose:
// this is one site, and a figure arriving should look the same everywhere.
export default function HubStats({ cities }: HubStatsProps) {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk }) => {
    if (!motionOk) return;

    const tl = gsap.timeline({
      defaults: { ease: EASE_OUT },
      scrollTrigger: { trigger: scope, start: "top 88%", once: true, markers: DEBUG_MARKERS },
    });

    tl.from(q("[data-stat-rule]"), { scaleX: 0, duration: 0.8, stagger: 0.11 }, 0)
      .from(q("[data-stat-rise]"), { yPercent: 115, duration: 0.9, stagger: 0.11 }, 0.2)
      .from(q("[data-stat-label]"), { autoAlpha: 0, y: 8, duration: 0.5, stagger: 0.11 }, 0.5)
      // The figure joins the timeline the section already has rather than
      // bringing a ScrollTrigger of its own. It is one fade: the drawing is not
      // an event, it is where the row's second figure lands.
      .from(q("[data-stat-figure]"), { autoAlpha: 0, y: 14, duration: 0.8 }, 0.7);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  });

  return (
    <section ref={rootRef} className="bg-cream pb-[10svh]">
      <Container>
        <div className="grid-ds gap-y-10">
          {STATS.map((s) => (
            <div key={s.id} className="col-span-12 sm:col-span-6 lg:col-span-3">
              <div data-stat-rule className="h-px w-full origin-left bg-rule" aria-hidden="true" />
              <div className="mt-5 overflow-hidden pb-[0.12em]">
                {/* Sans and not the serif italic of `ProofBand`'s row: those are
                    money and throughput, read as claims; these are head counts,
                    read as a register. The mono label under each one is what
                    marks them as data. */}
                <p data-stat-rise className="text-h1">
                  {s.value}
                </p>
              </div>
              <p
                data-stat-label
                className="mt-3 text-caption-mono uppercase text-gray-intermediate"
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid-ds items-end gap-y-10">
          <div data-stat-figure className="col-span-12 lg:col-span-7">
            <CityField cities={cities} />
          </div>

          <p className="col-span-12 max-w-[46ch] text-caption text-gray-intermediate text-pretty lg:col-span-4 lg:col-start-9">
            {STATS_NOTE}
          </p>
        </div>
      </Container>
    </section>
  );
}
