"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { MISSION } from "@/components/sections/foundation/foundationContent";

// §3 — the thesis, and variant A's signed gesture.
//
// ── A measure that retreats ────────────────────────────────────────────────
// The hero lays down one hairline across the whole container. Here that same
// stroke is repeated down the section and each repetition stops earlier than
// the one above it, until the last is a tick. Nothing is added, nothing grows,
// nothing points anywhere: a scale simply runs out. That is the whole picture,
// and it is meant to be read before the headline is — an organisation whose
// plan is to occupy less.
//
// What was rejected, because both are the illustration rather than the thing:
// arrows radiating outward from a centre (that is a distribution diagram, and
// it is variant C's job), and a box that shrinks (a shape getting smaller is a
// transition, not a measure — there is nothing to read it against).
//
// The kicker sits directly under the shortest rule, in the space the measure
// gave up. The sentence lands where the line ran out, which is the one piece of
// composition here that has to survive any edit.
//
// ── Why the draw is scrubbed ───────────────────────────────────────────────
// Every other reveal in this variant plays once on entry. This one is tied to
// the wheel for the reason `chain/CompletePicture` gives: the animation and the
// sentence are the same statement, so the retreat has to happen at the pace the
// reader descends it. Played once, the whole scale is spent before the reader
// has read the first paragraph.

// The rules, as percentages of their column. The exponent is what makes this
// read as a retreat and not as a ramp: at 1 the widths fall in equal steps and
// the stack looks like a triangle, which is a SHAPE. Past 1 each step gives up
// more than the one before, so the eye reads a diminishing quantity.
const STEPS = 11;
const FLOOR = 3;
const CURVE = 1.6;

const WIDTHS = Array.from({ length: STEPS }, (_, i) => {
  const t = i / (STEPS - 1);
  return Math.round((FLOOR + (100 - FLOOR) * (1 - t) ** CURVE) * 100) / 100;
});

export default function Devolution() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk }) => {
    if (!motionOk) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scope,
        start: "top 78%",
        end: "bottom 72%",
        scrub: 0.8,
        markers: DEBUG_MARKERS,
      },
    });

    tl.from(q("[data-measure-rule]"), {
      scaleX: 0,
      duration: 0.5,
      stagger: 0.16,
      ease: "power2.out",
    });

    const copy = gsap.from(q("[data-devolution-item]"), {
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
    <section ref={rootRef} className="bg-cream py-[14svh]">
      <Container>
        <div className="grid-ds gap-y-16">
          <div className="col-span-12 lg:col-span-5">
            <div data-devolution-item>
              <Eyebrow className="text-gray-intermediate">{MISSION.eyebrow}</Eyebrow>
            </div>

            <h2 data-devolution-item className="mt-10 max-w-[15ch] text-h1 text-balance">
              Our goal is to make ourselves <Accent display>smaller</Accent>
            </h2>

            {/* The last entry of `body` is the kicker, and it is set apart
                below — see the note on MISSION in foundationContent.ts. */}
            {MISSION.body.slice(0, -1).map((paragraph) => (
              <p
                key={paragraph}
                data-devolution-item
                className="mt-8 max-w-[42ch] text-body text-ink-soft text-pretty"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            {/* Every rule is anchored to the same left edge, so what varies is
                only where each one STOPS. Right-aligned, or centred, the stack
                becomes a shape with two moving edges and stops reading as a
                measurement. */}
            <div className="flex flex-col gap-6" aria-hidden="true">
              {WIDTHS.map((w, i) => (
                <div
                  key={i}
                  data-measure-rule
                  className="h-px origin-left bg-rule"
                  style={{ width: `${w}%` }}
                />
              ))}
            </div>

            <p
              data-devolution-item
              className="mt-14 max-w-[26ch] text-h3 text-ink text-balance"
            >
              {MISSION.kicker}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
