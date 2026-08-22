"use client";

import Container from "@/components/primitives/Container";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { enableScene, trackTimeline } from "@/components/primitives/motion/stickyScene";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { ROADMAP_STEPS } from "./roadmapContent";
import RoadmapHeader from "./RoadmapHeader";
import NearMark from "./NearMark";
import "./roadmap.css";

// Exact duplicate of RoadmapVertical.tsx — the plan is to iterate on THIS
// file for the next round of changes without touching the one already
// reviewed/committed. Once one wins, the other gets deleted; until then they
// diverge on purpose. Diff against RoadmapVertical.tsx to see what actually
// changed once this stops being a 1:1 copy.

// Was 85 — ~18% less scroll distance per milestone, per feedback.
const STEP_VH = 70;

// The milestone rests briefly (DWELL) before travelling to the next one.
// DWELL 0 -> fully continuous motion. DWELL 0.6 -> reads more like a snap.
const DWELL = 0.34;

// Where the active dot sits, as a fraction of the viewport's height from its
// top. Went 0.5 -> 0.32 -> 0.2 chasing a "too much space above" complaint
// that turned out to be the justify-center/viewport-sizing bug fixed
// separately below — with that gone, 0.2 reads as too high and off-center
// within the viewport itself. Back to 0.5 (dead center of the now-correctly-
// sized viewport, not of the whole section).
const RAIL_ANCHOR = 0.5;

// t<.5 ? 2t² : 1-(-2t+2)²/2 — this is GSAP's own "power1.inOut" written out
// by hand, because the source comp had to run standalone without gsap.utils.
function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

// Bug in the source comp, ported faithfully at first and now fixed: the last
// segment used to `return steps - 1` unconditionally, freezing `raw` (and so
// the rail position + fill height) the moment the scroll entered the last
// milestone's segment — the fill stopped growing for the rest of the scroll
// instead of reaching the end of the track. Removing that early return lets
// the same dwell+ease curve carry the last segment's `raw` from `steps - 1`
// up to `steps` as progress goes to 1, so the fill keeps drawing all the way
// down. `render()` clamps the ACTIVE INDEX separately (there's no item at
// index `steps`), so this only affects the continuous rail/fill position.
function toRaw(progress: number, steps: number) {
  const seg = 1 / steps;
  const i = Math.min(steps - 1, Math.floor(progress / seg));
  const local = (progress - i * seg) / seg;
  const t = (local - DWELL) / (1 - DWELL);
  return i + easeInOut(Math.min(1, Math.max(0, t)));
}

export default function RoadmapVerticalV2() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk, isDesktop }) => {
    if (!motionOk || !isDesktop) return;

    const track = q("[data-track]")[0];
    const viewport = q("[data-viewport]")[0];
    const rail = q("[data-rail]")[0];
    const fill = q<HTMLElement>("[data-fill]")[0];
    const items = q("[data-item]");
    if (!track || !viewport || !rail || !fill || items.length === 0) return;

    // enableScene's `name` is a camelCase dataset KEY (-> data-roadmap-v),
    // not a value assigned to a shared data-scene attribute — a hyphen in it
    // throws at runtime (DOMStringMap property names must be valid JS
    // identifiers). See roadmap.css's [data-roadmap-v="on"] selectors.
    const sceneOff = enableScene(scope, "roadmapV");

    let itemH = 0;
    let viewH = 0;
    let railPad = 0;
    let railTotal = 0;
    let lastActive = -1;

    function measure() {
      itemH = items[0].getBoundingClientRect().height;
      viewH = viewport.getBoundingClientRect().height;
      // Measured, not assumed: the rail's top/bottom padding (the "extremes"
      // of the line, before the first dot and after the last) is a plain
      // CSS value in roadmap.css, not something this file hardcodes — so
      // shortening it there (feedback: "los extremos... más cortos") never
      // requires touching this formula.
      railPad = parseFloat(getComputedStyle(rail).paddingTop) || 0;
      railTotal = rail.scrollHeight;
    }

    function render(progress: number) {
      const raw = toRaw(progress, items.length);
      const seg = 1 / items.length;

      let dotY: number;
      // The item a dot belongs to should only turn active (green title +
      // green dot) once the fill has actually reached it — not before.
      // `reached` is that: the index of the last item the line has fully
      // drawn up to, or -1 if it hasn't reached item 0 yet.
      let reached: number;

      if (raw <= 0) {
        // Item 0 doesn't get a "travel" from a previous item the way 1..N-1
        // do — without this the line starts pre-filled to item 0's position
        // the instant the section pins, instead of growing from zero as you
        // scroll.
        //
        // `raw` is pinned at exactly 0 for the DWELL fraction of segment 0
        // ONLY (that's all `raw <= 0` actually covers) — past that, segment
        // 0 is already travelling from item 0 to item 1 and falls into the
        // `else` branch below. The first version of this ramp used the
        // FULL segment (`progress / seg`) as its span, so it only reached
        // its target at the very end of segment 0 — but the `else` branch
        // takes over already at `raw === 0` (right when DWELL ends), where
        // it evaluates to the FULL target immediately. Result: the fill
        // jumped from ~23% of the way there straight to 100% at the
        // DWELL/travel boundary. Spanning just the DWELL fraction here
        // means this ramp finishes exactly when the `else` branch takes
        // over, so the handoff is seamless.
        const dwellEnd = DWELL * seg;
        const introT = dwellEnd > 0 ? Math.min(1, Math.max(0, progress / dwellEnd)) : 1;
        const eased = easeInOut(introT);
        dotY = (railPad + itemH * 0.5) * eased;
        // `raw` can't tell "hasn't reached item 0 yet" from "just reached
        // it" here (it's 0 either way) — only `eased` (the actual fill
        // progress) can. Without this, item 0 read as reached (and turned
        // green) from the very first frame, before the line had drawn any
        // distance at all.
        reached = eased >= 1 ? 0 : -1;
      } else {
        dotY = railPad + (raw + 0.5) * itemH;
        // `Math.floor`, not `Math.round`: an item counts as reached only
        // once the fill's continuous position has actually arrived AT it
        // (raw === i exactly), not at the halfway point of the travel from
        // the item before it.
        reached = Math.floor(raw);
      }
      // Safety clamp: past the last item, `raw` can run slightly past what
      // maps exactly onto railTotal when the padding isn't itemH/2 (it no
      // longer is, now that it's shorter) — never draw past the rail's own
      // measured height.
      dotY = Math.min(dotY, railTotal);

      // The active dot sits at ANCHOR·viewH from the viewport's top, not
      // dead center (0.5): at rest (dotY=0) the rail's y is `anchor - 0`, so
      // whatever fraction of the viewport sits ABOVE that anchor renders as
      // empty space before item 0 ever appears. Centering (0.5) meant HALF
      // the viewport was blank above the header on first paint — moving the
      // anchor up shrinks that directly, and still leaves more room below
      // the active item than above it to peek at what's coming next.
      gsap.set(rail, { y: viewH * RAIL_ANCHOR - dotY });
      fill.style.height = `${dotY}px`;

      // `reached` runs up to `items.length` at progress=1 (see toRaw's
      // comment) and down to -1 before item 0 is reached — clamp both ends
      // so an out-of-range index never reaches a real item.
      const active = Math.min(items.length - 1, reached);
      if (active !== lastActive) {
        items.forEach((el, i) => {
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
      fill.style.height = "";
      items.forEach((el) => el.classList.remove("is-active", "is-past"));
      sceneOff();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      aria-labelledby="rm-title-v2"
      style={{ "--steps": ROADMAP_STEPS.length, "--step-vh": STEP_VH } as React.CSSProperties}
      className="rm-scope relative overflow-x-clip bg-cream text-ink"
    >
      <div data-track className="rm-track">
        <div className="rm-stage py-14 lg:py-0">
          {/* A BOUNDED viewport height (not `flex-1`): flex-1 used to stretch
              the viewport to fill 100% of whatever height the h-svh stage
              had left over, and since the rail centers its active item at
              viewH/2, a tall viewport meant a lot of dead air between the
              header and the first visible dot. Capping it at ~2.6 items
              tall keeps that gap proportional to the content instead.
              NOT `justify-center` on this Container: centering a short block
              inside the full 100svh stage just moves the same problem to
              BOTH sides of the header+viewport block (and stacks with any
              padding added to the stage, which doesn't participate in the
              centering calc) — plain top-aligned flow with the viewport's
              own bounded height is what actually keeps the gap fixed and
              small. */}
          <Container className="flex flex-1 flex-col lg:min-h-0">
            <RoadmapHeader titleId="rm-title-v2" />

            <div
              data-viewport
              className="rm-viewport relative mt-6 flex-1 lg:mt-6 lg:h-[calc(var(--item-h)*2)] lg:flex-none lg:min-h-0"
            >
              <div data-rail className="rm-rail relative w-full">
                <div
                  aria-hidden="true"
                  className="rm-line absolute bottom-0 top-0 hidden w-px lg:block"
                >
                  <span data-fill className="rm-line__fill absolute left-0 top-0 h-0 w-full" />
                </div>

                {ROADMAP_STEPS.map((step) => (
                  <div
                    key={step.title}
                    data-item
                    className="rm-item relative grid grid-cols-[auto_1fr] items-start gap-x-3.5 gap-y-2.5 border-t border-[var(--rm-rule-soft)] py-5 lg:grid-cols-[var(--rail-x)_0_minmax(0,1fr)] lg:items-center lg:gap-x-0 lg:border-0 lg:py-0"
                  >
                    {/* pr-16 matches rm-item__body's pl-16 below — same gap
                        on both sides of the dot/line, instead of the label
                        sitting almost flush against it while the body had
                        room to breathe. */}
                    <div className="rm-item__label col-start-2 row-start-1 whitespace-normal text-ink lg:col-start-1 lg:col-end-2 lg:justify-self-end lg:whitespace-nowrap lg:pr-16 rm-big-label">
                      {step.status}
                    </div>
                    {/* `lg:justify-self-center` is the fix: the dot's column
                        is 0px wide by design (var(--rail-x) 0 minmax(0,1fr)) —
                        the LINE sits at that 0-width boundary (--rail-x), but
                        without justify-self a grid item with an explicit size
                        defaults to `start`, so the dot's LEFT edge (not its
                        center) landed on the line, pushing the whole circle
                        to its right. */}
                    <div
                      aria-hidden="true"
                      className="rm-item__dot relative col-start-1 row-start-1 grid size-[18px] shrink-0 place-items-center self-center rounded-full lg:col-start-2 lg:size-12 lg:justify-self-center"
                    >
                      <NearMark className="size-3/5 scale-[.55] opacity-0" />
                    </div>
                    <div className="rm-item__body col-start-2 row-start-2 max-w-[58ch] lg:col-start-3 lg:row-start-1 lg:pl-16">
                      {/* Mobile default is full ink, not the desktop's
                          muted-until-active gray: there's no scroll-driven
                          active state on mobile to ever light it back up. */}
                      <h3 className="rm-item__title mb-2 text-h3 text-ink lg:text-gray-intermediate">
                        {step.title}
                      </h3>
                      <p className="rm-item__text max-w-[52ch] text-body text-ink lg:text-gray-intermediate">
                        {step.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}
