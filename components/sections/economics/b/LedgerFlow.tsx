"use client";

import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { EASE_OUT, DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { FLYWHEEL } from "@/components/sections/economics/economicsContent";

// §3 of variant B — the flywheel as four ENTRIES, not a ring.
//
// ── Why a flow and not a circle ────────────────────────────────────────────
// This variant is for the reader who wants the account rather than the
// metaphor, and a ring is a metaphor: it says "cycle" before it says anything
// about what moves. Four entries stacked in reading order say the same thing in
// the register the rest of the page is set in — each one takes something in,
// puts something out, and the next one starts from that output.
//
// ── Where the circularity lives ────────────────────────────────────────────
// In the MARGIN, and nowhere else. There is no second diagram off to the side
// explaining that the list is really a loop. The fourth entry's output leaves
// the row, turns into the left margin, travels back up past all four, and
// re-enters at the first — which is a thing ledgers actually do, and which
// makes the closure structural rather than illustrated.
//
// The stroke is three 1px rules and not one SVG path, because the rail's height
// is whatever four entries happen to measure: an SVG stretched to an unknown
// box either needs `preserveAspectRatio="none"` (which would distort the stroke
// weight) or a measurement pass. Three rules with three transform origins get
// the same drawn gesture — out, up, back in — with no measuring at all.
//
// ── The in/out pairs are derived, not written ──────────────────────────────
// Entry `i` takes the PREVIOUS step's `short` as its input. Entry 01's input is
// therefore step 04's output, which is the loop stated in data before it is
// stated in a rule. If the steps are reordered, the pairing follows.

const STEPS = FLYWHEEL.steps;

const ENTRIES = STEPS.map((s, i) => ({
  ...s,
  from: STEPS[(i + STEPS.length - 1) % STEPS.length].short,
}));

export default function LedgerFlow() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk }) => {
    if (!motionOk) return;

    const rows = gsap.timeline({
      defaults: { ease: EASE_OUT },
      scrollTrigger: {
        trigger: scope,
        start: "top 70%",
        once: true,
        markers: DEBUG_MARKERS,
      },
    });

    rows
      .from(q("[data-entry-rule]"), { scaleX: 0, duration: 0.7, stagger: 0.13 }, 0)
      .from(q("[data-entry-body]"), { autoAlpha: 0, y: 20, duration: 0.75, stagger: 0.13 }, 0.15);

    // The return gets its own trigger rather than sharing the section's: four
    // entries are taller than a viewport, so on one shared trigger the rail
    // drew while it was still off screen and the reader arrived at a finished
    // line. Same reasoning as the growth chart in `chain/ProofBand`.
    const entries = q("[data-entry]");
    const last = entries[entries.length - 1];
    const back = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      scrollTrigger: {
        trigger: last,
        start: "top 62%",
        once: true,
        markers: DEBUG_MARKERS,
      },
    });

    // Out of the last entry, left into the margin, up past all four, back in at
    // the first. The order IS the argument, so the three legs are sequential
    // and never overlap.
    back
      .from(q("[data-rail-out]"), { scaleX: 0, duration: 0.35 })
      .from(q("[data-rail-up]"), { scaleY: 0, duration: 0.9 })
      .from(q("[data-rail-in]"), { scaleX: 0, duration: 0.35 })
      .from(q("[data-rail-head]"), { autoAlpha: 0, duration: 0.25 }, "-=0.1")
      .from(q("[data-rail-label]"), { autoAlpha: 0, duration: 0.4 }, "-=0.5");

    return () => {
      rows.scrollTrigger?.kill();
      rows.kill();
      back.scrollTrigger?.kill();
      back.kill();
    };
  });

  return (
    <section
      ref={rootRef}
      id="how-it-works"
      data-nav-dark
      className="bg-ink py-[14svh] text-cream"
    >
      <Container>
        <Eyebrow className="text-white/45">{FLYWHEEL.eyebrow}</Eyebrow>

        <div className="mt-12 grid-ds gap-y-8">
          <h2 className="col-span-12 max-w-[18ch] text-h1 text-pretty lg:col-span-5">
            {FLYWHEEL.headline}
          </h2>
          <p className="col-span-12 max-w-[56ch] text-body text-white/65 text-pretty lg:col-span-6 lg:col-start-7">
            {FLYWHEEL.intro}
          </p>
        </div>

        {/* The rail occupies the left padding, so the entries keep the page's
            grid and only the return sits outside it. */}
        <div className="relative mt-24 lg:pl-16">
          <div
            className="pointer-events-none absolute inset-y-0 left-0 hidden w-10 lg:block"
            aria-hidden="true"
          >
            <div
              data-rail-out
              className="absolute bottom-0 left-0 h-px w-full origin-right bg-near-green-accent"
            />
            <div
              data-rail-up
              className="absolute inset-y-0 left-0 w-px origin-bottom bg-near-green-accent"
            />
            <div
              data-rail-in
              className="absolute left-0 top-0 h-px w-full origin-left bg-near-green-accent"
            />
            {/* The head points RIGHT, back into the first entry — the direction
                is the only thing that distinguishes a return from a bracket. */}
            <svg
              data-rail-head
              viewBox="0 0 10 10"
              className="absolute right-0 top-0 size-2.5 -translate-y-1/2 translate-x-1/2"
            >
              <path d="M 0 0 L 10 5 L 0 10 Z" fill="#00dc8d" />
            </svg>
            <span
              data-rail-label
              className="absolute left-3 top-1/2 -translate-y-1/2 rotate-180 whitespace-nowrap text-micro-mono uppercase text-near-green-accent [writing-mode:vertical-rl]"
            >
              {STEPS[STEPS.length - 1].index} → {STEPS[0].index}
            </span>
          </div>

          <ol>
            {ENTRIES.map((e) => (
              <li key={e.id} data-entry>
                <div
                  data-entry-rule
                  className="h-px w-full origin-left bg-white/12"
                  aria-hidden="true"
                />
                <div data-entry-body className="grid-ds gap-y-7 pb-14 pt-8">
                  <p className="col-span-2 text-caption-mono text-white/45 lg:col-span-1">
                    {e.index}
                  </p>

                  {/* In and out, in the same two positions in every entry —
                      which is what lets the reader run a finger down the column
                      and see that each output is the next input. */}
                  <div className="col-span-10 lg:col-span-3">
                    <p className="text-micro-mono uppercase text-white/40">in</p>
                    <p className="mt-1 text-body-sm-mono text-white/75">{e.from}</p>
                    <p className="mt-4 text-micro-mono uppercase text-white/40">out</p>
                    <p className="mt-1 text-body-sm-mono text-near-green-accent">{e.short}</p>
                  </div>

                  <div className="col-span-12 lg:col-span-7 lg:col-start-6">
                    <h3 className="max-w-[22ch] text-h3 text-pretty">{e.title}</h3>
                    <p className="mt-5 max-w-[58ch] text-body text-white/70 text-pretty">
                      {e.body}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <div className="h-px w-full bg-white/12" aria-hidden="true" />
        </div>

        {/* Below `lg` the rail is not drawn — a 40px margin does not exist on a
            phone — so the closure is stated in the same mono the rail carries.
            The sentence itself runs on every width. */}
        <div className="mt-14 grid-ds gap-y-6">
          <p className="col-span-12 text-caption-mono uppercase text-near-green-accent lg:hidden">
            {STEPS[STEPS.length - 1].index} → {STEPS[0].index}
          </p>
          <p className="col-span-12 max-w-[40ch] text-h3-serif italic text-pretty lg:col-span-7 lg:col-start-6">
            {FLYWHEEL.closing}
          </p>
        </div>
      </Container>
    </section>
  );
}
