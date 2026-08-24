"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { gsap, SplitText } from "@/components/primitives/motion/gsapClient";
import { allowDescenders } from "@/components/primitives/motion/maskedLines";
import { EASE_OUT } from "@/components/primitives/motion/motionTokens";
import {
  resample,
  sparkGeometry,
} from "@/components/sections/analytics-labs/analyticsArt";
import { HERO, REVENUE_SERIES, STATUS } from "@/components/sections/analytics-labs/analyticsContent";

// ── Proposal C · §1 ────────────────────────────────────────────────────────
// C's register is EDITORIAL: the page does not compress information, it spends
// on it. One idea per screen, large type, air. It is the opposite of A on the
// same axis — density — and that opposition is the point of having all three.
//
// **Why it can afford to.** This page has little real content: five figures,
// two link-outs, eight platforms, six products. A treats that as a table
// because it can; C bets the other way — that with so little to say, scale and
// slowness communicate confidence better than density, and that a reader
// arriving from a press piece or a tweet does not want a spreadsheet.
//
// **The background is the real revenue series, not a texture.** Resampled to
// 240 points and bled off the bottom. It was chosen over a mesh, a grain or a
// glyph field for a concrete reason: it is the only possible ornament that is
// ALSO true. An abstract decoration behind a headline reading "by the numbers"
// is exactly the kind of filler the brief's "precise, understated" tone rules
// out.
//
// It sits at full opacity of its own colour, but that colour is `--rule` on
// `--cream` — at that contrast it does not compete with the headline and does
// not pretend to be readable as a chart. The precisely drawn data lives in the
// revenue card, and this echo carries neither axes nor labels precisely so it
// never implies it can be read off.
//
// **The only one of the three that animates.** A animates nothing (a document
// is there, it does not present itself) and B only the status dot (that is
// monitoring). C reveals, because its thesis is reading tempo: the stroke draws
// itself in and the headline rises line by line. Under
// `prefers-reduced-motion` nothing is created and the screen arrives whole and
// still — which is the same hero, minus the entrance.

const CHART = { w: 1200, h: 340, padY: 30 };
const FIELD = sparkGeometry(resample(REVENUE_SERIES, 240), CHART);

// `pathLength` is 100 and not 1: GSAP rounds pixel values by default
// (`autoRound`) and `stroke-dashoffset` is a pixel property, so normalised to 1
// the stroke jumps from invisible to complete with nothing in between. The long
// note is in `chain/CapabilityStack`.
const PATH_LEN = 100;

export default function Hero() {
  const rootRef = useMotionScope<HTMLElement>(({ q, motionOk }) => {
    if (!motionOk) return;

    // `autoSplit` because the headline is set at `text-display` and reflows on
    // the font swap: without it the lines measured before the swap stay badly
    // broken.
    const split = SplitText.create(q("[data-c-title]"), {
      type: "lines",
      mask: "lines",
      autoSplit: true,
      onSplit: (self) => {
        allowDescenders(self.lines);
        return gsap.from(self.lines, {
          yPercent: 108,
          duration: 1.1,
          ease: EASE_OUT,
          stagger: 0.09,
        });
      },
    });

    const tl = gsap.timeline({ defaults: { ease: EASE_OUT } });

    tl.fromTo(
      q("[data-c-field-line]"),
      { strokeDasharray: PATH_LEN, strokeDashoffset: PATH_LEN },
      { strokeDashoffset: 0, duration: 2.2, ease: "power2.inOut" },
      0
    )
      // The fill arrives BEHIND the stroke, not with it: if they appear
      // together the area reads as a spreading stain and the gesture stops
      // being "a line is being drawn".
      .from(q("[data-c-field-area]"), { autoAlpha: 0, duration: 1.4 }, 0.8)
      .from(q("[data-c-lede]"), { autoAlpha: 0, y: 20, duration: 0.9, stagger: 0.12 }, 0.45);

    return () => {
      tl.kill();
      split.revert();
    };
  });

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-svh flex-col justify-center overflow-hidden bg-cream pt-[calc(var(--site-header-block)+4rem)] pb-24"
    >
      {/* The echo of the series, bled off the bottom. `preserveAspectRatio` with
          `slice` so it fills the width at any viewport without deforming the
          curve — `none` here flattens the shape on wide screens and turns it
          into a different curve, which in an ornament made of real data is
          precisely what cannot happen. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[52svh]"
      >
        <svg
          viewBox={`0 0 ${CHART.w} ${CHART.h}`}
          preserveAspectRatio="xMidYMax slice"
          className="size-full"
        >
          <path data-c-field-area d={FIELD.area} className="fill-rule/45" />
          <path
            data-c-field-line
            d={FIELD.line}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
            pathLength={PATH_LEN}
            className="text-gray-intermediate/60"
          />
        </svg>
      </div>

      <Container className="relative">
        <div className="grid-ds gap-y-10">
          <div className="col-span-12 flex flex-col gap-8 lg:col-span-9">
            <p data-c-lede className="uppercase text-eyebrow-mono text-gray-intermediate">
              Analytics
            </p>
            <h1 data-c-title className="text-balance text-display">
              NEAR by the <Accent display>numbers</Accent>
            </h1>
          </div>

          <div className="col-span-12 flex flex-col gap-6 lg:col-span-5">
            <p data-c-lede className="text-pretty text-body-lg text-ink-soft">
              {HERO.lead}
            </p>
          </div>

          <div className="col-span-12 flex items-end lg:col-span-4 lg:col-start-9">
            <a
              data-c-lede
              href={HERO.statusHref}
              className="group flex w-full items-center justify-between gap-4 border-t border-ink py-4 text-label"
            >
              <span className="flex items-center gap-3">
                <span aria-hidden="true" className="size-2 rounded-full bg-green-ink" />
                {HERO.statusLabel}
              </span>
              <span className="text-caption-mono text-gray-intermediate">
                {STATUS.updatedLabel.replace("Last updated ", "")}
              </span>
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
