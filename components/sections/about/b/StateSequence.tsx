"use client";

import { useState } from "react";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { gsap, ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { enableScene, trackTimeline } from "@/components/primitives/motion/stickyScene";
import { DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import ActRail from "@/components/sections/shells/instrument/ActRail";
import Panel from "@/components/sections/shells/instrument/Panel";
import StateStack from "@/components/sections/about/b/StateStack";
import { ACTS, CHAPTERS, type AboutChapter } from "@/components/sections/about/aboutContent";

// §2 of variant B — the apparatus, and the reason this variant exists.
//
// Eight chapters of prose is what variant A is for. Here the history is the
// RUN LOG of a system, so the middle of the page is the system itself: one
// bordered panel, held to the viewport, inside which the machine gains a
// stratum per era while the copy beside it changes. What existed in 2017 and
// what exists in 2026 are not the same object, and that is a thing you can
// watch rather than a thing you have to be told.
//
// ── Why four acts and not eight ───────────────────────────────────────────
//
// Eight states is a slideshow: sixteen screens of scroll to get through what a
// reader could have read in four paragraphs, and eight steps on a rail is a
// progress bar nobody waits out. The grouping is in `ACTS`, in the content
// module, with the argument for the cuts written there — each act is the span
// over which the thing they were building stays the same thing.
//
// Each act carries its two chapters' `title` and `marker`, which is exactly
// what `marker` is for: the chapter said once and short. No act headings were
// written for this, and the rail's labels are the acts' own year ranges. A
// four-part structure the deck never named should not arrive with four names
// somebody invented to justify it.
//
// ── The scene ─────────────────────────────────────────────────────────────
//
// `position: sticky` from CSS with a ScrollTrigger that only READS progress —
// never `pin: true`, for the reasons in `stickyScene.ts`. The four act panels
// are complete drawings stacked on top of each other and cross-faded, so with
// no JavaScript, on a phone, or under `prefers-reduced-motion` they simply fall
// into normal flow and every state is legible in turn. That degradation is why
// they are four drawings and not one rig that morphs.
//
// The rail's `active` comes from the same source as the fade in both modes: in
// the scene, from the track's progress; in flow, from which panel is crossing
// the reading line. Two sources for one "current step" is how a rail ends up
// disagreeing with what is on screen.

const TRAVEL_SVH = 300;

// Cross-fade width, in timeline units where each act is 0.25 wide. Narrow: the
// point of the transition is that the marks that persist between two states do
// not move, and a long dissolve turns that into a blur instead.
const FADE = 0.04;

const BY_ID = new Map<string, AboutChapter>(CHAPTERS.map((c) => [c.id, c]));

/** An act's chapters, and its label — the range its own years describe. */
const SCENES = ACTS.map((act) => {
  const chapters = act.chapters
    .map((id) => BY_ID.get(id))
    .filter((c): c is AboutChapter => Boolean(c));
  const first = chapters[0];
  const last = chapters[chapters.length - 1];
  return {
    id: act.id,
    label: first && last ? `${first.year} — ${last.year}` : "",
    chapters,
  };
});

export default function StateSequence() {
  const [active, setActive] = useState(0);

  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk, isDesktop }) => {
    const panels = q<HTMLElement>("[data-act]");
    const triggers: ReturnType<typeof ScrollTrigger.create>[] = [];

    // In flow — phone, or reduced motion — the rail is still a reading aid: it
    // says which of the four you are in. It just does not drive anything.
    if (!isDesktop || !motionOk) {
      panels.forEach((el, i) => {
        triggers.push(
          ScrollTrigger.create({
            trigger: el,
            start: "top 55%",
            end: "bottom 55%",
            markers: DEBUG_MARKERS,
            onToggle: (self) => {
              if (self.isActive) setActive(i);
            },
          })
        );
      });
      return () => triggers.forEach((t) => t.kill());
    }

    const off = enableScene(scope, "acts");

    gsap.set(panels, { autoAlpha: 0 });
    gsap.set(panels[0], { autoAlpha: 1 });

    let current = -1;
    const tl = trackTimeline(scope, {
      scrub: 0.3,
      scrollTrigger: {
        onUpdate: (self) => {
          const i = Math.min(SCENES.length - 1, Math.floor(self.progress * SCENES.length));
          if (i !== current) {
            current = i;
            setActive(i);
          }
        },
      },
    });

    // A tween on a throwaway object, only to pin the timeline's total duration
    // to 1. Without it the last fade ends around 0.8 and the scrub maps the
    // track's full travel onto that, so every position below lands early.
    tl.to({ v: 0 }, { v: 1, duration: 1, ease: "none" }, 0);

    const span = 1 / SCENES.length;
    panels.forEach((el, i) => {
      const start = i * span;
      if (i > 0) {
        tl.to(el, { autoAlpha: 1, duration: FADE, ease: "none" }, start - FADE / 2);
      }
      if (i < panels.length - 1) {
        tl.to(el, { autoAlpha: 0, duration: FADE, ease: "none" }, start + span - FADE / 2);
      }
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      gsap.set(panels, { clearProps: "opacity,visibility" });
      off();
    };
  });

  return (
    // `data-acts` is NOT declared here: `enableScene` writes it, and declaring
    // it in the JSX would let the next React render reset it and silently undo
    // the sticky layout. This section has state, so that is not hypothetical.
    <section
      ref={rootRef}
      data-nav-dark
      style={{ "--travel": `${TRAVEL_SVH}svh` } as React.CSSProperties}
      className="group/acts relative bg-ink text-cream data-[acts=on]:h-[calc(100svh+var(--travel))]"
    >
      <div className="flex flex-col justify-center py-[12svh] group-data-[acts=on]/acts:sticky group-data-[acts=on]/acts:top-0 group-data-[acts=on]/acts:h-svh group-data-[acts=on]/acts:py-0">
        <Container>
          <div className="mb-10 lg:mb-12">
            <Eyebrow className="text-white/40">System state</Eyebrow>
          </div>

          <Panel
            grid
            label={SCENES[active]?.label}
            meta={`${String(active + 1).padStart(2, "0")} / ${String(SCENES.length).padStart(2, "0")}`}
            footer={<ActRail acts={SCENES} active={active} />}
          >
            {/* The stage. A declared height when the scene is on, because four
                absolutely-stacked children leave a parent with none — and a
                height in rem rather than svh so the panel does not resize
                under the reader when a mobile URL bar collapses. */}
            <div className="relative px-5 pb-10 pt-14 group-data-[acts=on]/acts:h-[30rem] group-data-[acts=on]/acts:px-7 group-data-[acts=on]/acts:pb-0 group-data-[acts=on]/acts:pt-16">
              {SCENES.map((scene, i) => (
                <div
                  key={scene.id}
                  data-act
                  className="grid-ds items-center gap-y-10 py-10 group-data-[acts=on]/acts:absolute group-data-[acts=on]/acts:inset-x-7 group-data-[acts=on]/acts:inset-y-0 group-data-[acts=on]/acts:py-10"
                >
                  <div className="col-span-12 lg:col-span-6">
                    {/* Capped rather than fluid: the drawing is 720×560, so at
                        the full six columns of a wide window it would be taller
                        than the stage it is standing in. */}
                    <StateStack act={i} className="mx-auto w-full max-w-[32rem]" />
                  </div>

                  <div className="col-span-12 lg:col-span-5 lg:col-start-8">
                    <p className="text-caption-mono text-near-green-accent lg:hidden">
                      {scene.label}
                    </p>
                    <div className="mt-6 flex flex-col gap-y-8 lg:mt-0">
                      {scene.chapters.map((c) => (
                        <div key={c.id}>
                          <h3 className="max-w-[22ch] text-h3 text-cream text-pretty">
                            {c.title}
                          </h3>
                          <p className="mt-3 max-w-[38ch] text-body text-white/55 text-pretty">
                            {c.marker}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </Container>
      </div>
    </section>
  );
}
