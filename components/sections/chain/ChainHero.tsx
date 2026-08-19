"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useRef } from "react";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { gsap, ScrollTrigger, SplitText } from "@/components/primitives/motion/gsapClient";
import { subscribePointer } from "@/components/primitives/motion/pointer";
import { onViewportToggle } from "@/components/primitives/motion/pauseOffscreen";
import { allowDescenders } from "@/components/primitives/motion/maskedLines";
import { createSeededRandom } from "@/components/primitives/motion/seededRandom";
import { MQ, EASE_OUT, DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { CHAINS, HERO_SUB } from "@/components/sections/chain/chainContent";

// Hero for /chain-abstraction: the page's thesis, performed rather than stated.
//
// Thirty-five chain tickers scatter across the upper field. They assemble on
// load, and as the reader scrolls they collapse back into a single point and
// go out — the headline's "the chain disappears", happening to the chains
// themselves. What is left behind is the account: one mark where thirty-five
// labels used to be.
//
// ── Why the field is DOM and not canvas ────────────────────────────────────
// Thirty-five short strings that only ever translate and fade is a job for
// thirty-five spans on the compositor. A canvas would buy nothing and cost the
// type: these are set in the same mono face as the rest of the page, and a
// canvas would have to redraw them every frame to keep them crisp.

// ── Field layout ────────────────────────────────────────────────────────────
// A JITTERED GRID rather than free random placement. Uniform random over a
// rectangle clumps — that is what uniform random does — and clumps read as a
// mistake in a composition this empty. One ticker per cell with a bounded
// wobble keeps the spacing even while still looking unplanned.
const COLS = 7;
const ROWS = 5;
// As a fraction of a cell. Past ~0.4 neighbouring cells start trading places
// and the grid becomes visible again, from the other side.
const JITTER = 0.34;

// Not a hydration fix here — the seeded generator is plain IEEE-754 arithmetic
// and is bit-identical on both sides (unlike the trig in `chainDiagram.ts`,
// which is not). This only keeps the emitted style attributes from carrying
// seventeen digits apiece.
const round = (n: number) => Math.round(n * 1e4) / 1e4;

// ── Idle wander ────────────────────────────────────────────────────────────
// Amplitude in px. Small enough that no ticker ever visibly leaves its cell —
// the jittered grid is the composition, and a wander wide enough to break it
// would undo the spacing the grid exists to guarantee.
const WANDER_PX = 5.5;
const WANDER_MIN_S = 7;
const WANDER_MAX_S = 16;

// ── Cursor gravity ─────────────────────────────────────────────────────────
// Reach, in px, and the furthest a ticker will ever be displaced by it.
//
// The cap is the whole design of this. Unbounded attraction CLUMPS: tickers
// pile onto the cursor, which destroys the even distribution the jittered grid
// was built for, and — worse for this page — reads as the chains being captured
// by a black hole rather than as a field acknowledging you. Bounded at 16px,
// the field leans toward the pointer and never gathers.
const PULL_RADIUS = 260;
const PULL_MAX = 16;
// 1 attracts, -1 parts the field around the cursor. It is one sign because the
// two are worth trying against each other: attraction reads as interest, and
// parting reads as "the complexity gets out of your way", which is this page's
// actual thesis.
const PULL_DIR = 1;
// Follow constant in SECONDS, not a per-frame fraction: at 120Hz a per-frame
// lerp converges twice as fast as at 60Hz, so the feel would depend on the
// reader's monitor. Same reasoning as POINTER_TAU in glyphShine.
const PULL_TAU = 0.19;
// A tab restored from the background delivers one enormous delta. Clamped, the
// field eases back; unclamped, it teleports.
const MAX_FRAME_S = 0.05;

const FIELD = CHAINS.map((label, i) => {
  // One generator per ticker, seeded from the index: the values are identical on
  // the server and on the client, so there is no hydration mismatch, and they
  // survive a rebuild. `Math.random()` here would flash a different layout on
  // hydration.
  const rand = createSeededRandom(1200 + i * 7);
  const col = i % COLS;
  const row = Math.floor(i / COLS);

  return {
    label,
    x: round(((col + 0.5 + (rand() - 0.5) * 2 * JITTER) / COLS) * 100),
    y: round(((row + 0.5 + (rand() - 0.5) * 2 * JITTER) / ROWS) * 100),
    // Depth. The spread is what stops the field reading as a flat list; the
    // floor keeps every ticker legible rather than fading some to texture.
    opacity: round(0.28 + rand() * 0.46),
    // Half the field is desktop-only. At phone widths the same 35 labels in a
    // third of the width is a wall of type, not a field.
    dense: i % 2 === 1,

    // ── wander ──────────────────────────────────────────────────────────────
    // These four are drawn AFTER x/y/opacity on purpose: the generator is a
    // sequence, so appending keeps every existing position and opacity exactly
    // where it was. Inserting them above would reshuffle the whole field.
    //
    // Two sines at DIFFERENT periods trace a Lissajous figure rather than a
    // diagonal line, and the per-ticker phase keeps thirty-five of them from
    // breathing in lockstep — which is what the eye notices and what makes an
    // idle animation look mechanical.
    phaseX: round(rand() * Math.PI * 2),
    phaseY: round(rand() * Math.PI * 2),
    periodX: round(WANDER_MIN_S + rand() * (WANDER_MAX_S - WANDER_MIN_S)),
    periodY: round(WANDER_MIN_S + rand() * (WANDER_MAX_S - WANDER_MIN_S)),
  };
});

// Where the field collapses to, in % of the field box. Slightly above centre:
// the tickers should converge on a point the eye reads as ABOVE the headline,
// so the collapse feels like it is being pulled into the account mark rather
// than into the text.
const SINK_X = 50;
const SINK_Y = 42;
export default function ChainHero() {
  const fieldRef = useRef<HTMLDivElement>(null);

  // `gsap.matchMedia` with MQ.motion directly rather than `useMotionScope`.
  // This scene never asked about the desktop breakpoint, and declaring
  // `isDesktop` as a condition means every crossing of 1024px reverts and
  // rebuilds it — which now costs a torn-down ticker loop, a dropped pointer
  // subscription and a replayed entrance, all from a window resize. The parent
  // README states the rule.
  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (sel: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add({ motionOk: MQ.motion }, (mctx) => {
      const { motionOk } = mctx.conditions as { motionOk: boolean };

      const tickers = q("[data-ticker]");
      const marks = q("[data-ticker-mark]");
      const drifts = q("[data-ticker-drift]");

      if (!motionOk) {
        // Reduce: the field is the hero's composition, not an ornament, so it
        // stays — just placed, never moving. No ticker loop and no pointer
        // subscription is created at all, so the shared listener in pointer.ts
        // never attaches on this page.
        gsap.set(marks, { clearProps: "all" });
        return;
      }

      // ── assembly ──────────────────────────────────────────────────────────
      // Three layers, one owner each, because three motions overlap in time and
      // GSAP cannot hold two tweens of the same property on one element:
      //
      //   [data-ticker]        the scroll collapse       (scrubbed)
      //   [data-ticker-drift]  wander + cursor gravity   (per frame)
      //   [data-ticker-mark]   the entrance              (one shot)
      //
      // A reader who scrolls immediately is mid-assembly when the collapse
      // starts and the field is wandering throughout, so all three can be live
      // at once.
      const assembly = gsap.from(marks, {
        // Out of the sink point, i.e. the collapse played backwards. The field
        // arrives the same way it will leave.
        x: (i: number) => (SINK_X - FIELD[i].x) * 0.6 + "%",
        y: (i: number) => (SINK_Y - FIELD[i].y) * 0.6 + "%",
        autoAlpha: 0,
        duration: 1.1,
        ease: EASE_OUT,
        // Centre-out: the tickers nearest the sink land first, so the field
        // reads as expanding rather than as 35 things fading in at once.
        stagger: { each: 0.022, from: "center" },
      });

      // ── headline ──────────────────────────────────────────────────────────
      const heading = q("[data-hero-heading]")[0];
      if (heading) {
        SplitText.create(heading, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) => {
            allowDescenders(self.lines);
            return gsap.from(self.lines, {
              yPercent: 110,
              autoAlpha: 0,
              stagger: 0.12,
              duration: 1,
              ease: EASE_OUT,
            });
          },
        });
      }

      gsap.from(q("[data-hero-item]"), {
        y: 24,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.12,
        delay: 0.35,
        ease: EASE_OUT,
      });

      // ── collapse ──────────────────────────────────────────────────────────
      // Scrubbed against the hero leaving the frame. `end: "bottom 40%"` and
      // not "bottom top": the field has to be GONE while the hero is still on
      // screen, otherwise the collapse happens off stage and the reader never
      // sees the point of it.
      const collapse = gsap.to(tickers, {
        x: (i: number) => SINK_X - FIELD[i].x + "%",
        y: (i: number) => SINK_Y - FIELD[i].y + "%",
        // Not to zero: at 0.35 the labels are still readable as they converge,
        // so the collapse reads as thirty-five things becoming one rather than
        // as a fade-out that happens to move.
        scale: 0.35,
        autoAlpha: 0,
        ease: "power2.in",
        // Outside-in, the mirror of the assembly's centre-out. The far tickers
        // start moving first, so the field closes like an aperture.
        stagger: { each: 0.012, from: "edges" },
        scrollTrigger: {
          trigger: scope,
          start: "top top",
          end: "bottom 40%",
          scrub: 0.6,
          markers: DEBUG_MARKERS,
        },
      });

      // ── wander + cursor gravity ───────────────────────────────────────────
      const field = fieldRef.current;
      if (!field) {
        return () => {
          assembly.kill();
          collapse.scrollTrigger?.kill();
          collapse.kill();
        };
      }

      // One quickSetter per axis per ticker. They write straight to the
      // transform without GSAP re-parsing the property name every frame, which
      // is the difference that matters at 35 elements × 2 axes × 60fps.
      const setX = drifts.map((el) => gsap.quickSetter(el, "x", "px"));
      const setY = drifts.map((el) => gsap.quickSetter(el, "y", "px"));
      const cur = drifts.map(() => ({ x: 0, y: 0 }));

      // ── measurement ───────────────────────────────────────────────────────
      // The field's box is cached rather than read per frame: a
      // getBoundingClientRect inside the ticker is a forced layout sixty times
      // a second to get a value that only changes on resize. `pageTop` is kept
      // in document space so the per-frame update needs nothing but the already
      // cached `window.scrollY`. Same approach as QuantumHero's lattice.
      let boxLeft = 0;
      let boxW = 0;
      let boxH = 0;
      let pageTop = 0;
      const measure = () => {
        const r = field.getBoundingClientRect();
        boxLeft = r.left;
        boxW = r.width;
        boxH = r.height;
        pageTop = r.top + window.scrollY;
      };
      measure();
      ScrollTrigger.addEventListener("refresh", measure);

      // ── pointer ───────────────────────────────────────────────────────────
      // `subscribePointer` shares ONE `pointermove` for the whole page and
      // reports the position normalised to the window.
      //
      // `hasPointer` exists because that module seeds late subscribers with a
      // last-known value that defaults to dead centre. Applying gravity to that
      // default would park the whole field in a permanent lean toward the
      // middle of the screen on any device that never fires pointermove — i.e.
      // every phone. So gravity stays off until a reading proves a real pointer:
      // either the seed is not the 0.5/0.5 default, or a later move differs
      // from it. On touch, neither happens and the field only ever wanders.
      let pointerX = 0.5;
      let pointerY = 0.5;
      let hasPointer = false;
      let seeded = false;

      const unsubscribe = subscribePointer((x, y) => {
        if (!seeded) {
          seeded = true;
          hasPointer = x !== 0.5 || y !== 0.5;
        } else if (x !== pointerX || y !== pointerY) {
          hasPointer = true;
        }
        pointerX = x;
        pointerY = y;
      });

      // ── the loop ──────────────────────────────────────────────────────────
      // On gsap.ticker, never a private requestAnimationFrame — the toolkit's
      // rule, and it also means this shares the frame GSAP is already running
      // for the collapse instead of racing it.
      let visible = true;
      let elapsed = 0;

      const update = (_time: number, deltaMs: number) => {
        if (!visible) return;

        const dt = Math.min(deltaMs / 1000, MAX_FRAME_S);
        elapsed += dt;

        // Exponential follow, framerate-independent: the fraction covered this
        // frame is derived from how long the frame actually took.
        const k = 1 - Math.exp(-dt / PULL_TAU);
        const boxTop = pageTop - window.scrollY;
        const px = pointerX * window.innerWidth;
        const py = pointerY * window.innerHeight;

        for (let i = 0; i < drifts.length; i++) {
          const f = FIELD[i];

          let tx = Math.sin(elapsed / f.periodX + f.phaseX) * WANDER_PX;
          let ty = Math.cos(elapsed / f.periodY + f.phaseY) * WANDER_PX;

          if (hasPointer) {
            // Measured from the ticker's RESTING centre, not its live position.
            // Live positions feed back — a ticker pulled closer reads a shorter
            // distance, so it pulls harder, so it moves closer — and the field
            // collapses onto the cursor over a few frames. Against the resting
            // grid the force field is static and the motion is bounded by
            // construction rather than by luck.
            const cx = boxLeft + (f.x / 100) * boxW;
            const cy = boxTop + (f.y / 100) * boxH;
            const dx = px - cx;
            const dy = py - cy;
            const dist = Math.hypot(dx, dy);

            if (dist > 0.001 && dist < PULL_RADIUS) {
              // Squared falloff, so the effect has a soft shoulder at the edge
              // of its reach instead of switching on at a visible ring.
              const t = 1 - dist / PULL_RADIUS;
              const pull = t * t * PULL_MAX * PULL_DIR;
              tx += (dx / dist) * pull;
              ty += (dy / dist) * pull;
            }
          }

          const c = cur[i];
          c.x += (tx - c.x) * k;
          c.y += (ty - c.y) * k;
          setX[i](c.x);
          setY[i](c.y);
        }
      };

      gsap.ticker.add(update);

      // Off screen the loop does no work. The hero is the first thing on the
      // page, so without this it would keep computing thirty-five vectors a
      // frame while the reader is down at the proof section.
      onViewportToggle(field, (v) => {
        visible = v;
      });

      return () => {
        gsap.ticker.remove(update);
        unsubscribe();
        ScrollTrigger.removeEventListener("refresh", measure);
        assembly.kill();
        collapse.scrollTrigger?.kill();
        collapse.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-svh flex-col overflow-hidden bg-cream pb-[12svh] pt-[calc(var(--site-header-block)+2rem)]"
    >
      {/* The field is a flex ITEM that takes the leftover space, not an overlay
          at a percentage height. As an overlay it was fine on a wide window and
          a collision on a narrow one: the headline and its subhead are far
          taller at phone width, so a field measured as 52% of the section ran
          straight through them. Taking `flex-1` instead makes the field exactly
          the space the type does not use, at every size, by construction. The
          `min-h` stops it collapsing to nothing on a short window, and the
          section's `pt` already clears the fixed header.

          The gradient at its foot is what keeps the lowest tickers from
          crowding the first line of the headline. */}
      <div
        ref={fieldRef}
        aria-hidden="true"
        className="pointer-events-none relative min-h-[26svh] flex-1"
      >
        {FIELD.map((t) => (
          <span
            key={t.label}
            data-ticker
            className={`absolute -translate-x-1/2 -translate-y-1/2 ${t.dense ? "hidden lg:block" : ""}`}
            style={{ left: `${t.x}%`, top: `${t.y}%` }}
          >
            {/* The middle layer exists only to carry the wander and the cursor
                pull. It looks redundant and is not: the outer span is owned by
                the scroll collapse and the inner one by the entrance, and all
                three motions can be live in the same frame. */}
            <span data-ticker-drift className="block">
              <span
                data-ticker-mark
                className="block whitespace-nowrap text-caption-mono text-ink"
                style={{ opacity: t.opacity }}
              >
                {t.label}
              </span>
            </span>
          </span>
        ))}

        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-cream" />
      </div>

      <Container className="relative z-10 mt-10 grid grid-cols-12 items-end gap-y-10">
        <div className="col-span-12 lg:col-span-7">
          <div data-hero-item>
            <Eyebrow className="text-gray-intermediate">Chain abstraction</Eyebrow>
          </div>

          {/* Two sentences, two lines, and the turn between them is the whole
              headline: the first is what goes away, the second is what does
              not. The serif accent carries the second. */}
          {/* `text-display` bottoms out at 3.5rem, and "disappears." at that
              size is ~320px — wider than the 255px a 375px phone has left after
              the site container's fixed 60px gutters. Stepping down one role in
              the scale is the DS-sanctioned fix; hard-coding a smaller size, or
              widening the shared Container for one page, are not. */}
          <h1 data-hero-heading className="mt-6 text-h1 md:text-display text-pretty">
            The chain disappears.
            <br />
            <Accent display>You don&rsquo;t.</Accent>
          </h1>
        </div>

        <div className="col-span-12 lg:col-span-4 lg:col-start-9">
          <p
            data-hero-item
            className="max-w-[34rem] text-body-lg text-ink-soft text-pretty"
          >
            {HERO_SUB}
          </p>
        </div>
      </Container>
    </section>
  );
}
