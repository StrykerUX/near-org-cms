"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import CtaPill from "@/components/primitives/CtaPill";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { EASE_OUT, DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { CTA_RAMP } from "@/components/primitives/motion/motionColors";
import { CHAINS, BUILDER_BODY } from "@/components/sections/chain/chainContent";

// The closing CTA, and the page's bookend.
//
// The hero collapses thirty-five chains into one mark. This fans one mark back
// out to thirty-five, which is the same picture read in the other direction and
// happens to be exactly what the copy says: write once, reach everywhere. It is
// the only ornament on the page that repeats, and it repeats on purpose — the
// reader who noticed the hero gets the rhyme, and the reader who did not still
// gets a diagram of one contract reaching many networks.
//
// `CtaPill` is imported from the quantum folder rather than copied. The section
// contract allows `@/components/sections/*`, the whole hover mechanism already
// lives in `[data-q-cta]` in globals.css, and a second copy here would be a
// second thing to keep in step with that rule.

// `pathLength` is 100 and not 1 because GSAP rounds pixel values by default
// (`autoRound`), and stroke-dashoffset is a pixel property: normalised to 1 the
// draw snaps from undrawn to drawn with nothing in between. See the long note in
// CapabilityStack.tsx.
const PATH_LEN = 100;

const W = 460;
const H = 420;
// The fan's origin, on the left edge and vertically centred: the single
// contract.
const OX = 12;
const OY = H / 2;
// Twelve rays, not thirty-five. The label column below carries the full count;
// thirty-five strokes into a 460-unit box is a solid wedge, not a fan.
const RAYS = 12;
const ENDPOINTS = Array.from({ length: RAYS }, (_, i) => ({
  x: W - 96,
  y: (i / (RAYS - 1)) * H,
}));

export default function BuildersCta() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk }) => {
    if (!motionOk) return;

    const tl = gsap.timeline({
      defaults: { ease: EASE_OUT },
      scrollTrigger: {
        trigger: scope,
        start: "top 68%",
        once: true,
        markers: DEBUG_MARKERS,
      },
    });

    tl.from(q("[data-cta-item]"), { y: 28, autoAlpha: 0, duration: 0.85, stagger: 0.12 })
      .fromTo(
        q("[data-ray]"),
        { strokeDasharray: PATH_LEN, strokeDashoffset: PATH_LEN },
        // From the middle out: the fan opens rather than sweeping from one end,
        // which is the difference between "reaches everywhere" and "scans".
        { strokeDashoffset: 0, duration: 0.9, stagger: { each: 0.05, from: "center" }, ease: "power2.out" },
        0.2
      )
      .from(
        q("[data-ray-tip]"),
        { scale: 0, transformOrigin: "center", duration: 0.3, stagger: { each: 0.05, from: "center" } },
        0.75
      )
      .from(q("[data-fan-label]"), { autoAlpha: 0, x: -8, duration: 0.5, stagger: 0.03 }, 0.9);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  });

  return (
    <section ref={rootRef} data-nav-dark className="bg-ink py-[16svh] text-white">
      <Container>
        <div className="grid-ds items-center gap-y-16">
          <div className="col-span-12 lg:col-span-6">
            <p data-cta-item className="text-caption-mono text-white/40">
              For builders
            </p>

            <h2 data-cta-item className="mt-6 max-w-[16ch] text-h1 text-pretty">
              Write once, <Accent>reach everywhere</Accent>
            </h2>

            <div className="mt-10 space-y-6">
              {BUILDER_BODY.map((p) => (
                <p
                  key={p.slice(0, 24)}
                  data-cta-item
                  className="max-w-[50ch] text-body text-white/70 text-pretty"
                >
                  {p}
                </p>
              ))}
            </div>

            <div data-cta-item className="mt-12">
              {/* Points at the docs root rather than a deep link: the deck did
                  not specify a destination for this one, and the three deep
                  links it DID specify are all in the section above. */}
              <CtaPill href="https://docs.near.org" tone="solid" external>
                Start building
              </CtaPill>
            </div>
          </div>

          {/* ── the fan ──────────────────────────────────────────────────── */}
          <div className="col-span-12 lg:col-span-5 lg:col-start-8">
            <div className="relative mx-auto w-full max-w-[28rem]">
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible" aria-hidden="true">
                {ENDPOINTS.map((p, i) => (
                  <path
                    key={i}
                    data-ray
                    d={`M ${OX} ${OY} L ${p.x} ${p.y}`}
                    fill="none"
                    stroke="rgba(255,255,255,0.28)"
                    strokeWidth="1"
                    pathLength={PATH_LEN}
                  />
                ))}
                {ENDPOINTS.map((p, i) => (
                  <circle key={`tip-${i}`} data-ray-tip cx={p.x} cy={p.y} r="3" fill="var(--sem-background-primary)" />
                ))}
                {/* The single contract. Two rings so it reads as the same kind
                    of object as the account mark in the sticky scene. */}
                <circle cx={OX} cy={OY} r="9" fill={CTA_RAMP[0]} />
                <circle cx={OX} cy={OY} r="18" fill="none" stroke={CTA_RAMP[0]} strokeWidth="1" strokeOpacity="0.45" />
              </svg>

              {ENDPOINTS.map((p, i) => (
                <span
                  key={`label-${i}`}
                  data-fan-label
                  className="absolute -translate-y-1/2 whitespace-nowrap text-caption-mono text-white/45"
                  style={{ left: `${((p.x + 12) / W) * 100}%`, top: `${(p.y / H) * 100}%` }}
                >
                  {i === RAYS - 1 ? `+${CHAINS.length - (RAYS - 1)} more` : CHAINS[i]}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
