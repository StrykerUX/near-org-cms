"use client";

import Container from "@/components/primitives/Container";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { enableScene } from "@/components/primitives/motion/stickyScene";
import { ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { ROADMAP_STEPS } from "./roadmapContent";
import RoadmapHeader from "./RoadmapHeader";
import NearMark from "./NearMark";
import "./roadmap.css";

// Puerto 1:1 de components/views/scroll-sections/RoadmapVertical.tsx —
// reemplaza el Roadmap original de esta carpeta (mismo nombre de export, la
// view no cambia). roadmapContent.ts/RoadmapHeader.tsx/roadmap.css son copias
// de scroll-sections; NearMark reusa el que ya vivía acá (mismo SVG, mismo
// contrato de props).
//
// Deliberately NOT `trackTimeline()` from stickyScene.ts: that helper bundles
// the sticky-track config (`start:"top top", end:"bottom bottom"`), which
// only makes sense paired with a `position: sticky` child that pins for
// exactly one viewport's worth of scroll. This section doesn't pin anymore —
// per feedback, the header should scroll away normally like the rest of the
// page, with only the line + dots reacting to scroll position as the track
// passes through the viewport. `enableScene` still applies (same "JS is live"
// attribute pattern, written only from the effect — see its own docstring),
// just without the sticky-specific CSS that used to come with it.
//
// No `--item-h`-driven positioning math either: items sit in normal document
// flow (no `gsap.set(..., {y})`), and both the fill and the active item are
// read straight from real, live geometry every frame (see `render()`) rather
// than derived from the ScrollTrigger's abstract 0–1 progress — that indirect
// route (progress × trackTotal, divided back down by an assumed item height)
// doesn't actually track "this item is at the middle of the screen" with any
// precision; it tracks "this fraction of the track has scrolled by", which
// drifted from the viewport center by enough that the last dot was lighting
// up well before it visually reached the middle. Checking each item's own
// getBoundingClientRect() against the viewport's center line IS that
// condition, exactly, with no approximation to drift.

export default function Roadmap() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk, isDesktop }) => {
    if (!motionOk || !isDesktop) return;

    const track = q("[data-track]")[0];
    const fill = q<HTMLElement>("[data-fill]")[0];
    const items = q("[data-item]");
    if (!track || !fill || items.length === 0) return;

    const sceneOff = enableScene(scope, "roadmapV");

    let lastActive = -1;

    function render() {
      const centerY = window.innerHeight / 2;
      const trackTop = track.getBoundingClientRect().top;

      // The fill's height, in the track's own coordinates, IS the distance
      // from the track's top down to wherever the viewport's center line
      // currently crosses it — so the line always visibly ends exactly at
      // the middle of the screen, never ahead of or behind it.
      const fillY = Math.max(0, Math.min(track.scrollHeight, centerY - trackTop));
      fill.style.height = `${fillY}px`;

      // The last item whose own center has scrolled past the viewport's
      // center line is "reached" — checked directly per item, not inferred
      // from a shared item-height assumption.
      let active = -1;
      items.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        if (r.top + r.height / 2 <= centerY) active = i;
      });

      if (active !== lastActive) {
        items.forEach((el, i) => {
          el.classList.toggle("is-active", i === active);
          el.classList.toggle("is-past", i < active);
        });
        lastActive = active;
      }
    }

    // Fires on every scroll tick while any part of the track is on screen —
    // wide on purpose, since `render()` itself decides what's "reached" from
    // live positions rather than from this trigger's own progress.
    const st = ScrollTrigger.create({
      trigger: track,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      markers: DEBUG_MARKERS,
      onRefresh: render,
      onUpdate: render,
    });

    render();

    return () => {
      st.kill();
      fill.style.height = "";
      items.forEach((el) => el.classList.remove("is-active", "is-past"));
      sceneOff();
    };
  }, []);

  return (
    <section ref={rootRef} className="rm-scope relative bg-background text-ink">
      <Container className="flex flex-col gap-10 py-16 lg:gap-20 lg:py-24">
        <RoadmapHeader titleId="rm-title-v" />

        <div data-track className="relative">
          {/* `left: calc(var(--rail-x) - 1px)`, not just `var(--rail-x)`: the
              dot centers itself exactly ON --rail-x (0-width grid column +
              justify-self-center). At 1px wide the line's left edge sitting
              at --rail-x was close enough to invisible, but at 2px the line's
              own CENTER is 1px to the right of its left edge — offsetting by
              half its width here is what keeps that center on --rail-x,
              under the dot, instead of drifting as the width changes. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 hidden w-[2px] bg-[var(--rm-rule-soft)] lg:block"
            style={{ left: "calc(var(--rail-x) - 1px)" }}
          >
            <span data-fill className="absolute inset-x-0 top-0 h-0 bg-[var(--rm-green)]" />
          </div>

          {ROADMAP_STEPS.map((step) => (
            <div
              key={step.title}
              data-item
              className="rm-item relative grid grid-cols-[auto_1fr] items-start gap-x-3.5 gap-y-2.5 border-t border-[var(--rm-rule-soft)] py-5 lg:grid-cols-[var(--rail-x)_0_minmax(0,1fr)] lg:items-center lg:gap-x-0 lg:border-0 lg:py-0"
            >
              {/* pr-16 matches rm-item__body's pl-16 below — same gap on
                  both sides of the dot/line. */}
              <div className="rm-item__label col-start-2 row-start-1 whitespace-normal text-ink lg:col-start-1 lg:col-end-2 lg:justify-self-end lg:whitespace-nowrap lg:pr-16 rm-big-label">
                {step.status}
              </div>
              {/* `lg:justify-self-center`: the dot's column is 0px wide by
                  design (var(--rail-x) 0 minmax(0,1fr)) — the LINE sits at
                  that boundary, and without justify-self a grid item with an
                  explicit size defaults to `start`, landing its left edge
                  (not its center) on the line. */}
              <div
                aria-hidden="true"
                className="rm-item__dot relative col-start-1 row-start-1 grid size-[18px] shrink-0 place-items-center self-center rounded-full lg:col-start-2 lg:size-12 lg:justify-self-center"
              >
                {/* `rm-item__dot-icon` (not just relying on the shared
                    `.rm-item__dot svg` rule in roadmap.css): this component
                    shares its `data-roadmap-v="on"` attribute with
                    RoadmapVerticalV2.tsx, so a change to that shared
                    selector's active-state scale would resize its icon too.
                    This extra class gives the override enough specificity to
                    apply ONLY here. */}
                <NearMark className="rm-item__dot-icon size-3/5 scale-[.55] opacity-0" />
              </div>
              <div className="rm-item__body col-start-2 row-start-2 max-w-[58ch] lg:col-start-3 lg:row-start-1 lg:pl-16">
                {/* Mobile default is full ink, not the desktop's
                    muted-until-active gray: there's no scroll-driven active
                    state on mobile to ever light it back up (the line/dot
                    are lg:block/lg:grid only). */}
                <h3 className="rm-item__title mb-2 text-h3 text-ink lg:text-[var(--rm-muted-text)]">
                  {step.title}
                </h3>
                <p className="rm-item__text max-w-[52ch] text-body text-ink lg:text-[var(--rm-muted-text)]">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
