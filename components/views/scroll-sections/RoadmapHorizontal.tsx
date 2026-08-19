"use client";

import Container from "@/components/primitives/Container";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { enableScene, trackTimeline } from "@/components/primitives/motion/stickyScene";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { ROADMAP_STEPS, ROADMAP_ROW_GEOMETRY } from "./roadmapContent";
import RoadmapHeader from "./RoadmapHeader";
import NearMark from "./NearMark";
import "./roadmap.css";

const STEP_VH = 85;

// Same anchor idea as RoadmapVertical, tuned separately: 0.2 sat row 0's big
// label close enough to the viewport's top that the mask's fade (11% in
// roadmap.css) was already eating into it at rest, before any scroll. 0.28
// gives it enough clearance to sit fully inside the unmasked zone.
const RAIL_ANCHOR = 0.28;

// Same dwell-then-ease curve as RoadmapVertical. Reusing it here — rather
// than a flat linear ramp — is what makes this rail's slide feel like the
// same gesture as the vertical version's, not a different animation
// language for what's meant to be two skins on one mechanism.
const DWELL = 0.34;
function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}
function toRaw(progress: number, steps: number) {
  const seg = 1 / steps;
  const i = Math.min(steps - 1, Math.floor(progress / seg));
  const local = (progress - i * seg) / seg;
  const t = (local - DWELL) / (1 - DWELL);
  return i + easeInOut(Math.min(1, Math.max(0, t)));
}

export default function RoadmapHorizontal() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk, isDesktop }) => {
    if (!motionOk || !isDesktop) return;

    const track = q("[data-track]")[0];
    const viewport = q("[data-viewport]")[0];
    const rail = q("[data-rail]")[0];
    const rows = q("[data-row]");
    const segs = rows.map((row) => Array.from(row.querySelectorAll<HTMLElement>(".rm-seg")));
    if (!track || !viewport || !rail || rows.length === 0) return;

    // Same fix as RoadmapVertical: camelCase dataset key, not a hyphenated
    // value on a shared attribute — see roadmap.css's [data-roadmap-h="on"].
    const sceneOff = enableScene(scope, "roadmapH");

    let rowH = 0;
    let viewH = 0;
    let railPad = 0;
    let lastActive = -1;

    function measure() {
      rowH = rows[0].getBoundingClientRect().height;
      viewH = viewport.getBoundingClientRect().height;
      railPad = parseFloat(getComputedStyle(rail).paddingTop) || 0;
    }

    function render(progress: number) {
      const raw = toRaw(progress, rows.length);

      // Slides the whole rail so the active row centers at RAIL_ANCHOR — the
      // one thing this version was missing: with all 4 rows sitting at
      // fixed, unmoving positions, the whole 4-row scroll distance read as
      // "stuck" (only colors changed). Same transform math as
      // RoadmapVertical's rail, just against row height instead of item
      // height, and with no entrance-from-zero special case: that one was
      // specifically for the FILL bar starting unpainted, not for this
      // translate, and row 0 centering immediately at rest is the correct
      // resting state here (it's already "Live now").
      const centerY = railPad + (raw + 0.5) * rowH;
      gsap.set(rail, { y: viewH * RAIL_ANCHOR - centerY });

      // Continuous crossfade, not a hard cut: row i's fill is 1 exactly at
      // raw===i and falls off linearly to 0 as raw moves a full segment away
      // in either direction — so as `raw` eases from i toward i+1, row i's
      // green visibly drains out while row i+1's fills in, instead of both
      // switching in one frame.
      segs.forEach((rowSegs, i) => {
        const fill = Math.max(0, 1 - Math.abs(raw - i));
        rowSegs.forEach((seg) => seg.style.setProperty("--rm-fill", String(fill)));
      });

      // The discrete is-active/is-past classes (title color, dot size) still
      // switch at the natural halfway point — only the bar's fill and the
      // rail's position needed to stop being hard toggles.
      const active = Math.min(rows.length - 1, Math.max(0, Math.round(raw)));
      if (active !== lastActive) {
        rows.forEach((el, i) => {
          el.classList.toggle("is-active", i === active);
          el.classList.toggle("is-past", i < active);
        });
        lastActive = active;
      }
    }

    measure();

    const tl = trackTimeline(track, {
      scrollTrigger: {
        onRefresh: (self) => {
          measure();
          render(self.progress);
        },
        onUpdate: (self) => render(self.progress),
      },
    });

    render(0);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      gsap.set(rail, { clearProps: "transform" });
      rows.forEach((el) => el.classList.remove("is-active", "is-past"));
      segs.flat().forEach((seg) => seg.style.removeProperty("--rm-fill"));
      sceneOff();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      aria-labelledby="rm-title-h"
      style={{ "--steps": ROADMAP_STEPS.length, "--step-vh": STEP_VH } as React.CSSProperties}
      className="rm-scope relative overflow-x-clip bg-cream text-ink"
    >
      <div data-track className="rm-track">
        <div className="rm-stage py-14 lg:py-0">
          <Container className="flex flex-1 flex-col lg:min-h-0">
            <RoadmapHeader titleId="rm-title-h" />

            {/* Bounded + masked viewport, same shape as RoadmapVertical's:
                the rail (below) slides inside it instead of the 4 rows
                sitting at fixed positions across the whole stage height. */}
            <div
              data-viewport
              className="rm-rows-viewport relative mt-8 flex-1 lg:mt-24 lg:h-[calc(var(--row-h)*2)] lg:flex-none lg:min-h-0"
            >
              <div data-rail className="rm-rows-rail relative flex w-full flex-col gap-10 lg:block">
                {ROADMAP_STEPS.map((step, i) => {
                  const geo = ROADMAP_ROW_GEOMETRY[i];
                  return (
                    <div
                      key={step.title}
                      data-row
                      data-rule={geo.ruleStartsRight ? "right" : undefined}
                      style={{ "--x": geo.x, "--dot": geo.dot } as React.CSSProperties}
                      className="rm-row relative flex flex-col justify-center"
                    >
                      <div className="rm-row__head relative flex flex-col gap-2 py-3 lg:grid lg:h-[clamp(38px,6.6vh,84px)] lg:grid-cols-[var(--x,0%)_auto_minmax(0,1fr)] lg:items-center lg:gap-x-6 lg:py-0">
                        <span aria-hidden="true" className="rm-seg rm-seg--l block h-px" />
                        <span className="rm-row__label rm-big-label block whitespace-normal text-ink lg:col-start-2 lg:whitespace-nowrap">
                          {step.status}
                        </span>
                        <span aria-hidden="true" className="rm-seg rm-seg--r hidden h-px lg:col-start-3 lg:block" />
                        {/* position/size/margin/background/transitions all
                            live in roadmap.css — this class list is just
                            visibility + icon centering + stacking + shape. */}
                        <span
                          aria-hidden="true"
                          className="rm-row__dot z-[3] hidden rounded-full lg:grid lg:place-items-center"
                        >
                          <NearMark className="size-[58%] scale-50 opacity-0" />
                        </span>
                      </div>
                      <div className="rm-row__body max-w-[62ch] pb-6 pt-1 lg:ml-[calc(var(--x,0%)+1.5rem)] lg:pb-0">
                        <h3 className="rm-row__title mb-2 text-h3 text-ink lg:text-gray-intermediate">
                          {step.title}
                        </h3>
                        <p className="rm-row__text text-body text-ink lg:text-gray-intermediate">{step.body}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}
