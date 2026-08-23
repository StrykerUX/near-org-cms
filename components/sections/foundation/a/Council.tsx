"use client";

import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { EASE_OUT, DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import MediaFrame from "@/components/primitives/MediaFrame";
import {
  COUNCIL,
  COUNCIL_PORTRAITS,
} from "@/components/sections/foundation/foundationContent";

// §5 — the separation of powers, drawn with one stroke.
//
// The copy holds a loop the reader has to assemble in their head: the Council
// empowers the executive team, and the executive team reports back to the
// Council. Two named blocks and ONE closed path between them put both halves on
// screen at once.
//
// The path is a racetrack — one continuous stroke, out along the top and back
// along the bottom — rather than two arrows. Two arrows would be two objects
// and the reader would count them as two relationships; one closed loop is the
// single circulation the copy describes. Direction comes from the two labels
// sitting against their own leg, which also means the drawing needs no
// arrowheads and stays in the same 1px vocabulary as every rule on the page.
//
// The `viewBox` is deliberately wide and short: the same path stretches into
// the gap between the two columns on a laptop and into the gap between the two
// stacked blocks on a phone, so there is one drawing and not a desktop one plus
// a mobile fallback.

// `pathLength` is 100 and not 1 because GSAP rounds pixel values by default
// (`autoRound`), and stroke-dashoffset is a pixel property: normalised to 1 the
// draw snaps from undrawn to drawn with nothing in between. Same note as
// `chain/CapabilityStack`.
const PATH_LEN = 100;

const W = 240;
const H = 120;
const INSET = 10;
const R = (H - INSET * 2) / 2;

// A stadium: two horizontal legs joined by half-circles. Written as one `d` so
// it is one stroke in the DOM as well as one gesture on screen.
const LOOP = [
  `M ${INSET + R} ${INSET}`,
  `H ${W - INSET - R}`,
  `A ${R} ${R} 0 0 1 ${W - INSET - R} ${H - INSET}`,
  `H ${INSET + R}`,
  `A ${R} ${R} 0 0 1 ${INSET + R} ${INSET}`,
  "Z",
].join(" ");

export default function Council() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk }) => {
    if (!motionOk) return;

    const tl = gsap.timeline({
      defaults: { ease: EASE_OUT },
      scrollTrigger: { trigger: scope, start: "top 74%", once: true, markers: DEBUG_MARKERS },
    });

    tl.from(q("[data-council-item]"), { y: 24, autoAlpha: 0, duration: 0.85, stagger: 0.12 }, 0)
      .from(q("[data-council-rule]"), { scaleX: 0, duration: 0.8, stagger: 0.14 }, 0)
      .fromTo(
        q("[data-loop]"),
        { strokeDasharray: PATH_LEN, strokeDashoffset: PATH_LEN },
        { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut" },
        0.4
      )
      // The labels arrive once the stroke has passed their own leg, so the loop
      // reads as being drawn and then named, not as a diagram fading up.
      .from(q("[data-loop-label]"), { autoAlpha: 0, duration: 0.5, stagger: 0.2 }, 1.1);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  });

  return (
    <section ref={rootRef} className="bg-cream pb-[14svh] pt-[6svh]">
      <Container>
        <div className="grid-ds gap-y-10">
          <div data-council-item className="col-span-12">
            <Eyebrow className="text-gray-intermediate">{COUNCIL.eyebrow}</Eyebrow>
          </div>

          <h2 data-council-item className="col-span-12 max-w-[16ch] text-h2 lg:col-span-5 text-balance">
            {COUNCIL.headline}
          </h2>

          <p
            data-council-item
            className="col-span-12 max-w-[52ch] text-body text-ink-soft lg:col-span-6 lg:col-start-7 lg:self-end text-pretty"
          >
            {COUNCIL.body}
          </p>
        </div>

        <div className="mt-[10svh] grid-ds items-center gap-y-12">
          <div className="col-span-12 lg:col-span-4">
            <Body body={COUNCIL.bodies[0]} />
          </div>

          {/* The drawing sits between the two on a laptop and between the two
              stacked blocks on a phone — same cell either way, so the loop is
              never orphaned at one end of the row. */}
          <div className="relative col-span-12 lg:col-span-3 lg:col-start-5">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="w-full overflow-visible text-ink"
              aria-hidden="true"
            >
              <path
                data-loop
                d={LOOP}
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                pathLength={PATH_LEN}
              />
            </svg>

            {/* Labels in HTML rather than <text>: inside the SVG their size
                would be multiplied by the viewBox scale and would no longer be
                the page's mono scale. Same reason as `chain/ProofBand`. */}
            <p
              data-loop-label
              className="absolute inset-x-0 top-0 -translate-y-full pb-2 text-center text-micro-mono uppercase text-gray-intermediate"
            >
              {COUNCIL.relation.out}
            </p>
            <p
              data-loop-label
              className="absolute inset-x-0 bottom-0 translate-y-full pt-2 text-center text-micro-mono uppercase text-gray-intermediate"
            >
              {COUNCIL.relation.back}
            </p>
          </div>

          <div className="col-span-12 lg:col-span-4 lg:col-start-9">
            <Body body={COUNCIL.bodies[1]} />
          </div>
        </div>

        {/* The faces, reserved.
            A foundation that argues transparency is structural and shows
            nobody who governs it is the contradiction this section names, so
            the portraits get their place before the people exist.

            They hang off the RIGHT half of the grid and start at column five.
            Two reasons, and neither is taste: the loop above is a small
            drawing that lives on air, and a full-width row of four frames
            directly under it would close that air; and everything else on this
            page is a measure that runs from the left margin, so a block that
            starts inboard reads as attached to the section rather than as
            another course of the page.

            They are NOT on `[data-council-item]`, which is what would have
            hooked them into the section's existing stagger without touching the
            drawing's choreography. That tween pre-hides its targets at mount,
            and a frame whose whole job is to declare a missing asset cannot be
            missing itself — it would leave a hole the exact size of what is not
            there yet. So they are painted at rest, and the loop's timeline is
            untouched for the simpler reason that nothing was added to it. */}
        <div className="mt-[12svh] grid-ds gap-y-8">
          {COUNCIL_PORTRAITS.map((seat, i) => (
            <div
              key={seat.id}
              className={`col-span-6 sm:col-span-3 lg:col-span-2 ${
                i === 0 ? "lg:col-start-5" : ""
              }`}
            >
              <MediaFrame label={seat.label} spec={seat.spec} ratio="3/4" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

type BodyProps = {
  body: (typeof COUNCIL.bodies)[number];
};

function Body({ body }: BodyProps) {
  return (
    <div>
      <div data-council-rule className="h-px w-full origin-left bg-rule" aria-hidden="true" />
      <div data-council-item>
        <h3 className="mt-5 text-h3">{body.label}</h3>
        <p className="mt-3 max-w-[32ch] text-body-sm text-gray-intermediate text-pretty">
          {body.role}
        </p>
      </div>
    </div>
  );
}
