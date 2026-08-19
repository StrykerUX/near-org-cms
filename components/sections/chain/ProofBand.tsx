"use client";

import Container from "@/components/primitives/Container";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { gsap, SplitText } from "@/components/primitives/motion/gsapClient";
import { allowDescenders } from "@/components/primitives/motion/maskedLines";
import { EASE_OUT, DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { CTA_RAMP } from "@/components/primitives/motion/motionColors";
import { PROOF_STATS, GROWTH, ECOSYSTEM } from "@/components/sections/chain/chainContent";

// §4 — assert nothing, show everything.
//
// ── The row is uniform on purpose ──────────────────────────────────────────
// Four figures, one row, one size. It was briefly tiered — `$20B+` leading,
// `25M+`/`35+` supporting, `<$0.01` set apart after a beat — to make the fee
// land as a punchline. The hierarchy worked and was still the wrong call here:
// this section's job is "one glance = this is real and used at scale", and four
// equal figures deliver the whole claim in a single sweep of the eye, where a
// staged version makes the reader assemble it in three moves. Uniformity IS the
// argument — these are four facts of equal standing, not a story with a
// punchline.
//
// The evenness is therefore load-bearing in both dimensions: same size, same
// row, and an even stagger. The tiered version paused before the fee, and that
// pause is what has to go with it — in a row of four equal figures a gap on the
// last one reads as a stutter, not as emphasis.
//
// ── Why there is no count-up ───────────────────────────────────────────────
// It was considered and rejected on a concrete ground, not a taste one:
// **`<$0.01` cannot count.** Tallying up to a LESS-THAN threshold is
// meaningless, so a counter treatment covers three of the four figures and has
// to special-case the fourth — three numbers performing while one sits still is
// worse than four sitting still, and it breaks exactly the uniformity the row
// is built on.
//
// Three more reasons it fights this section specifically: the deck's goal here
// is "one glance", and a counter withholds the number and makes the reader wait
// for it; the time-based story is already told directly below by the growth
// line, with real dated points, so a counter says "this grew" a second time and
// less precisely; and a tally is the genre default for crypto stats, which is
// what the rest of this page was built to avoid.
//
// What the figures do instead is arrive in the page's OWN vocabulary: the
// hairline wipes across, and the number rises out of the space beneath it. Same
// line-mask mechanism as the hero and `ForwardTurn` headings — the numbers
// become part of the drawn-stroke language rather than a widget dropped into it.

// `pathLength` is 100 and not 1 because GSAP rounds pixel values by default
// (`autoRound`), and stroke-dashoffset is a pixel property: normalised to 1 the
// draw snaps from undrawn to drawn with nothing in between. See the long note in
// CapabilityStack.tsx.
const PATH_LEN = 100;

// ── Chart box ──────────────────────────────────────────────────────────────
const W = 520;
const H = 132;
const PAD_X = 18;
const PAD_Y = 16;

const MAX = Math.max(...GROWTH.map((g) => g.value));
const POINTS = GROWTH.map((g, i) => ({
  ...g,
  x: PAD_X + (i / (GROWTH.length - 1)) * (W - PAD_X * 2),
  // Plotted from the bottom, linear against the largest value. Linear and not
  // log because the story IS the acceleration — a log axis would flatten the
  // exact curve the section is pointing at.
  y: H - PAD_Y - (g.value / MAX) * (H - PAD_Y * 2),
}));

const LINE = POINTS.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

export default function ProofBand() {
  const rootRef = useMotionScope<HTMLElement>(({ q, motionOk }) => {
    if (!motionOk) return;

    // The numbers rise out from under their own rule. `mask: "lines"` wraps each
    // line in an overflow container, so the figure comes from behind the space
    // the rule just drew rather than floating up from nowhere.
    //
    // No `autoSplit`: these are single short figures that never wrap, so there
    // is nothing for a re-split to fix, and skipping it keeps the lines stable
    // for the timeline that references them by index.
    const split = SplitText.create(q("[data-stat-value]"), {
      type: "lines",
      mask: "lines",
    });
    allowDescenders(split.lines);

    const rules = q("[data-stat-rule]");
    const labels = q("[data-stat-label]");

    // ── the four figures, one rhythm ────────────────────────────────────────
    const stats = gsap.timeline({
      defaults: { ease: EASE_OUT },
      scrollTrigger: {
        trigger: q("[data-stat-block]")[0],
        start: "top 74%",
        once: true,
        markers: DEBUG_MARKERS,
      },
    });

    stats
      .from(rules, { scaleX: 0, duration: 0.8, stagger: 0.13 }, 0)
      // The figure follows its own rule out by a fifth of a second, so the row
      // reads as four rules drawing and four numbers coming up behind them,
      // rather than as two separate waves.
      .from(split.lines, { yPercent: 112, autoAlpha: 0, duration: 0.95, stagger: 0.13 }, 0.2)
      .from(labels, { autoAlpha: 0, y: 10, duration: 0.5, stagger: 0.13 }, 0.55);

    // ── the trajectory, on its own trigger ──────────────────────────────────
    // Its own ScrollTrigger and not the section's: the chart sits well below the
    // fold when the figures animate, so on one shared trigger it played out of
    // sight and the reader arrived at a finished line.
    const growth = gsap.timeline({
      defaults: { ease: EASE_OUT },
      scrollTrigger: {
        trigger: q("[data-growth-block]")[0],
        start: "top 78%",
        once: true,
        markers: DEBUG_MARKERS,
      },
    });

    growth
      .fromTo(
        q("[data-growth-line]"),
        { strokeDasharray: PATH_LEN, strokeDashoffset: PATH_LEN },
        { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut" },
        0
      )
      // The dots land as the line reaches them, so the draw looks like it is
      // depositing them rather than passing over dots that were already there.
      .from(q("[data-growth-dot]"), { scale: 0, transformOrigin: "center", duration: 0.35, stagger: 0.34 }, 0.2)
      .from(q("[data-growth-label]"), { autoAlpha: 0, y: 8, duration: 0.4, stagger: 0.34 }, 0.3);

    return () => {
      stats.scrollTrigger?.kill();
      stats.kill();
      growth.scrollTrigger?.kill();
      growth.kill();
      split.revert();
    };
  });

  return (
    <section ref={rootRef} className="bg-cream py-[14svh]">
      <Container>
        <h2 className="max-w-[20ch] text-h1 text-pretty">
          Already the rails for cross-chain value
        </h2>

        {/* ── the figures ────────────────────────────────────────────────── */}
        <div data-stat-block className="mt-20 grid-ds gap-y-12">
          {PROOF_STATS.map((s) => (
            <div key={s.id} className="col-span-6 lg:col-span-3">
              <div data-stat-rule className="h-px w-full origin-left bg-rule" aria-hidden="true" />
              {/* `text-h1-serif` and not `text-display-serif`: display tops out
                  at 8rem, and "<$0.01" at that size overruns a quarter-width
                  column. The whole row steps down together — one of four cells
                  at a different size is the thing this layout exists to avoid. */}
              <p data-stat-value className="mt-6 text-h1-serif italic">
                {s.value}
              </p>
              <p
                data-stat-label
                className="mt-3 max-w-[22ch] text-body-sm text-gray-intermediate text-pretty"
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* ── the trajectory ─────────────────────────────────────────────── */}
        <div data-growth-block className="mt-28 grid-ds gap-y-10">
          <div className="col-span-12 lg:col-span-4">
            <p className="text-caption-mono text-gray-intermediate">Growth trajectory</p>
            <p className="mt-4 max-w-[30ch] text-body-lg text-ink-soft text-pretty">
              All-time cross-chain volume, four times over in seven months.
            </p>
          </div>

          <div className="col-span-12 lg:col-span-7 lg:col-start-6">
            <div className="relative w-full max-w-[34rem]">
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible" aria-hidden="true">
                {/* The baseline is the only rule here: gridlines on three data
                    points is instrumentation for a chart that does not need it. */}
                <line x1="0" y1={H - PAD_Y} x2={W} y2={H - PAD_Y} stroke="currentColor" strokeWidth="1" className="text-rule" />
                <path
                  data-growth-line
                  d={LINE}
                  fill="none"
                  stroke={CTA_RAMP[0]}
                  strokeWidth="2"
                  pathLength={PATH_LEN}
                />
                {POINTS.map((p) => (
                  <circle key={p.when} data-growth-dot cx={p.x} cy={p.y} r="4.5" fill={CTA_RAMP[0]} />
                ))}
              </svg>

              {/* Labels in HTML so they keep the page's mono scale instead of
                  being multiplied by the chart's viewBox scale. */}
              {POINTS.map((p) => (
                <div
                  key={p.when}
                  data-growth-label
                  className="absolute -translate-x-1/2"
                  style={{ left: `${(p.x / W) * 100}%`, top: `${(p.y / H) * 100}%` }}
                >
                  <p className="-translate-y-[2.4em] text-h4">{p.display}</p>
                  <p className="-translate-y-[1.6em] text-caption-mono text-gray-intermediate">
                    {p.when}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>

      {/* ── who is already on it ──────────────────────────────────────────── */}
      <div className="mt-28">
        <Container>
          <p className="text-caption-mono text-gray-intermediate">
            Built into the products people already use
          </p>
        </Container>
        <EcosystemStrip />
      </div>
    </section>
  );
}

// A marquee rather than a logo grid, and set in type rather than in artwork:
// this repo has exactly one of these companies as an asset (public/logos), so a
// logo row would be one real mark next to seven placeholders. Names in the
// page's own display face are honest and, at this size, more legible than
// eight foreign logos at eight different optical weights.
function EcosystemStrip() {
  const trackRef = useMotionScope<HTMLDivElement>(({ q, motionOk }) => {
    if (!motionOk) return;

    // The wrapper holds exactly two identical copies of the list, so its width
    // is precisely 2× one set and −50% is exact by construction — no measuring,
    // and it stays exact when the font swaps. Same construction as CompanyGrid.
    const tween = gsap.fromTo(
      q("[data-marquee]"),
      { xPercent: 0 },
      { xPercent: -50, duration: 42, repeat: -1, ease: "none", force3D: true }
    );

    return () => tween.kill();
  });

  const set = (
    <>
      {ECOSYSTEM.map((name) => (
        <span key={name} className="flex items-center gap-10 whitespace-nowrap text-h2 text-ink">
          {name}
          <span className="size-1.5 rounded-full bg-near-green-accent" aria-hidden="true" />
        </span>
      ))}
    </>
  );

  return (
    <div ref={trackRef} className="mt-8 overflow-hidden">
      {/* The two halves are structurally IDENTICAL — same wrapper, same padding.
          Putting one copy loose in the track and the other in a div makes the
          track 2x a set PLUS one gap, and -50% then slips by that gap on every
          loop. */}
      <div data-marquee className="flex w-max">
        <div className="flex gap-10 pr-10">{set}</div>
        {/* The second copy is presentational — the reader has already been told
            the list once, and a screen reader should not hear it twice. */}
        <div className="flex gap-10 pr-10" aria-hidden="true">
          {set}
        </div>
      </div>
    </div>
  );
}
