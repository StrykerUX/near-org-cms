"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { CTA_RAMP } from "@/components/primitives/motion/motionColors";
import { CONVERGENCE, COMPLETE_BODY } from "@/components/sections/chain/chainContent";

// §5a — four parts → one system.
//
// The deck's "forward turn" was a block at the foot of this section and is now
// `ForwardTurn.tsx`. It moved because it is where the page stops arguing, and a
// change of register that large needs its own ground, scale and motion — see
// the long note at the top of that file.
//
// The convergence is SCRUBBED rather than played once, and it is the only
// scrubbed reveal outside the sticky scene. The reason is that this is the one
// place where the animation and the sentence are the same statement: four lines
// become one line at exactly the pace the reader descends the four labels. A
// one-shot version fires before the reader has read the first label and the
// point is spent.

// `pathLength` is 100 and not 1 because GSAP rounds pixel values by default
// (`autoRound`), and stroke-dashoffset is a pixel property: normalised to 1 the
// draw snaps from undrawn to drawn with nothing in between. See the long note in
// CapabilityStack.tsx.
const PATH_LEN = 100;

const W = 640;
const H = 300;
const MEET_X = W - 26; // where the four become one
const MEET_Y = H / 2;

// Evenly spaced entries down the left edge. The inset keeps the outermost lines
// off the very top and bottom of the box, so the fan reads as a group rather
// than as something cropped.
const INSET = 26;
const PATHS = CONVERGENCE.map((_, i) => {
  const y = INSET + (i / (CONVERGENCE.length - 1)) * (H - INSET * 2);
  // A cubic with both handles pulled horizontally: the line leaves the label
  // flat, bends once, and arrives flat. One bend is what makes four different
  // curves look like one family.
  return `M 0 ${y} C ${W * 0.42} ${y} ${W * 0.58} ${MEET_Y} ${MEET_X} ${MEET_Y}`;
});

export default function CompletePicture() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk }) => {
    if (!motionOk) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scope,
        start: "top 78%",
        end: "top 22%",
        scrub: 0.8,
        markers: DEBUG_MARKERS,
      },
    });

    tl.fromTo(
      q("[data-converge]"),
      { strokeDasharray: PATH_LEN, strokeDashoffset: PATH_LEN },
      { strokeDashoffset: 0, duration: 1, stagger: 0.12, ease: "none" }
    )
      .fromTo(q("[data-meet]"), { scale: 0, transformOrigin: "center" }, { scale: 1, duration: 0.25 }, 0.85)
      .fromTo(q("[data-converge-label]"), { autoAlpha: 0.25 }, { autoAlpha: 1, duration: 0.2, stagger: 0.12 }, 0);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  });

  return (
    <section ref={rootRef} className="bg-cream pb-[16svh] pt-[6svh]">
      <Container>
        <Eyebrow className="text-gray-intermediate">The complete picture</Eyebrow>

        <div className="mt-14 grid-ds gap-y-16">
          <div className="col-span-12 lg:col-span-5">
            <h2 className="max-w-[14ch] text-h1 text-pretty">
              Four capabilities.
              <br />
              <Accent>One system.</Accent>
            </h2>

            <div className="mt-10 space-y-6">
              {COMPLETE_BODY.map((p) => (
                <p key={p.slice(0, 24)} className="max-w-[52ch] text-body text-ink-soft text-pretty">
                  {p}
                </p>
              ))}
            </div>
          </div>

          {/* ── the convergence ────────────────────────────────────────────── */}
          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            <div className="relative w-full">
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible" aria-hidden="true">
                {PATHS.map((d, i) => (
                  <path
                    key={CONVERGENCE[i].id}
                    data-converge
                    d={d}
                    fill="none"
                    stroke={i === CONVERGENCE.length - 1 ? CTA_RAMP[0] : "currentColor"}
                    strokeOpacity={i === CONVERGENCE.length - 1 ? 1 : 0.32}
                    strokeWidth="1.5"
                    pathLength={PATH_LEN}
                    className="text-ink"
                  />
                ))}
                <circle data-meet cx={MEET_X} cy={MEET_Y} r="7" fill={CTA_RAMP[0]} />
              </svg>

              {/* At `lg` the labels sit ON the left end of their own line,
                  positioned from the same numbers the paths are built from, so
                  a change to INSET moves both.

                  Below `lg` they are NOT positioned at all — they fall into
                  normal flow as a list under the figure. The anchoring is only
                  legible while the figure is tall enough to separate four
                  two-line labels: at 375px wide the box renders ~176px tall, so
                  the four anchor points land ~48px apart while each label is
                  ~36px tall AND translated fully above its own point, and they
                  pile on top of one another. `top`/`left` are simply ignored on
                  a static element, so the same style object is safe in both
                  layouts. */}
              {CONVERGENCE.map((c, i) => {
                const y = INSET + (i / (CONVERGENCE.length - 1)) * (H - INSET * 2);
                return (
                  <div
                    key={c.id}
                    data-converge-label
                    // The padding IS the clearance: the block is translated so
                    // its bottom edge sits exactly on its own line, and the
                    // padding is what lifts the type off it. At pb-2 the green
                    // curve grazed "a single identity".
                    className="mt-5 lg:mt-0 lg:absolute lg:-translate-y-full lg:pb-4"
                    style={{ left: 0, top: `${(y / H) * 100}%` }}
                  >
                    <p className="text-label text-ink">{c.label}</p>
                    <p className="text-caption-mono text-gray-intermediate">{c.note}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
