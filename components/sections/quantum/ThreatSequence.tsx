"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { enableScene, trackTimeline } from "@/components/primitives/motion/stickyScene";
import { gsap, SplitText } from "@/components/primitives/motion/gsapClient";
import { allowDescenders } from "@/components/primitives/motion/maskedLines";
import { hermiteRamp } from "@/components/primitives/motion/velocityRamp";
import CtaPill from "@/components/sections/quantum/CtaPill";
import { SEQUENCE_BEATS as BEATS } from "@/components/sections/quantum/quantumContent";

// §3 + §4 of the copy deck, as ONE pinned composition.
//
// The section locks to the viewport the moment its top reaches the top of the
// frame and holds for two beats. Nothing scrolls away: the frame — the links
// and the ring field — is constant, and only the core changes. That is
// what lets the whole argument occupy one screen while still carrying more than
// one screen's worth of material.
//
// ── Composition ────────────────────────────────────────────────────────────
// Type occupies the left ~55%; the ring system is anchored off the right edge
// and bleeds out of frame. The optical weight balances across the vertical axis
// without either half being centred, so the layout is asymmetric but level.
//
// The core takes all the space left over above the links, so the composition
// breathes on a tall window and compresses on a short one without the links ever
// moving.
// Everything hangs off the Container's left gutter — one alignment edge for the
// headline, the body and the links.
//
// Every beat is TOP-aligned, not centred in its box: the beats are different
// heights, and centring them makes the first line jump between beats. Pinning
// the top edge means "The quantum threat" and every headline after it start on
// exactly the same line, and each beat simply runs further down.
//
// The top-right quadrant is deliberately left empty — it is what stops three
// beats of material from reading as a wall.
//
// ── How a beat plays ───────────────────────────────────────────────────────
// Headline lines rise into place one after another, each revealed by its own
// mask. Once they have settled the subtext fades up beneath them. At the end of
// the beat the whole panel fades out, clearing the frame before the next one
// starts — the beats never cross-dissolve, so the reader is never asked to read
// two things at once.
//
// ── The rings ──────────────────────────────────────────────────────────────
// Not decoration. The argument is a key ROTATION, so the background performs
// one, driven by scroll. It is also the section's colour: the page's dark
// passage was otherwise monochrome-plus-green.
//
// The band is NOT faded in — it is simply parked outside the visible arc for the
// first two beats and rotates into frame at the third. Fading it up in place
// announced itself as an effect; arriving under its own rotation does not.
//
// The rings themselves are not inert either: a brightness pulse travels across
// them on the scrub, outward through beat one and inward through beat two.

// ── Copy ─────────────────────────────────────────────────────────────────────
// El copy vive en quantumContent.ts (SEQUENCE_BEATS, dictado por Lawrence,
// 2026-08-17). DOS beats: la amenaza y la respuesta — el beat introductorio
// se eliminó a pedido y la secuencia pasó de tres partes a dos.

// Pinned travel, escalado desde la versión de tres beats para conservar el
// MISMO recorrido de scroll por beat (~48svh la amenaza, ~97svh la
// respuesta): quitar un beat acorta la sección, no acelera las otras dos.
const TRAVEL_SVH = 145;
const TRAVEL = `${TRAVEL_SVH}svh`;

// ── Timeline map ─────────────────────────────────────────────────────────────
// Positions in the scrubbed timeline. Hoisted to module scope because the ring
// geometry below and the sweep's own trigger both have to agree with them.
const CUT = 0.33; // donde termina el beat de la amenaza
const TIMELINE_END = 1;
const BEAT_START = [0, CUT];
const BEAT_END = [CUT, TIMELINE_END];
/** Where the answer beat begins, measured in svh of scroll after the pin engages. */
const ANSWER_SVH = (CUT / TIMELINE_END) * TRAVEL_SVH;

// Type arrives QUICKLY and then the beat holds. The two halves are separate
// decisions: a fast entrance keeps the section feeling responsive to the wheel,
// and the hold afterwards is what stops a beat from scrolling away the instant
// it finishes assembling — which is what it did when the entrance filled the
// whole beat.
//
// The hold is not a tween. It is the gap between the subtext landing and the
// out-fade starting, i.e. `BEAT_END − OUT_DUR − (SUB_OFFSET + SUB_DUR)`. Widen a
// beat in CUT and the hold widens with it; that is the knob.
// Per-line speed, shared by all three beats — beat three is not faster, it just
// has three lines to the others' two. The stagger is deliberately well under the
// duration so lines OVERLAP: that lands the whole block sooner without any
// individual line moving quicker.
const LINE_DUR = 0.05;
const LINE_STAGGER = 0.013;
const SUB_OFFSET = 0.09; // after a beat starts
const SUB_DUR = 0.035;
const OUT_DUR = 0.06;

// The soft release out of the lock: how much of the timeline it takes and how far
// the content lifts, as a fraction of the viewport. Small on purpose — the point is
// only that the content is ALREADY moving when the sticky lets go, so the two
// speeds meet instead of colliding. Enough to see and not enough to read as a
// separate animation.
const RELEASE_SPAN = 0.14;
const RELEASE_LIFT = 0.055;

// ── Ring geometry ────────────────────────────────────────────────────────────
// In vw so the field scales with the window. The centre sits beyond the right
// edge, so only the left caps of each ring are in frame — the field reads as
// radiating in from off-stage rather than as a target pinned to the layout.
const CENTRE_OFFSET = 8; // vw past the right edge
const R_IN = 26.6; // vw — the band's inner edge, and the third ring
const R_OUT = 34; // vw — the band's outer edge, and the fourth ring
const RINGS = [11.9, 19.3, R_IN, R_OUT, 41.4, 48.7, 56.1];

// The sweep is an ANNULUS SECTOR, not a stroked arc: the whole band between two
// rings is filled and the band itself rotates. A conic gradient is the only way
// to get colour that varies ALONG an arc — a linear gradient runs in a straight
// line and would read as a flat wash across a curved shape.
//
// The sector has to be narrow enough to hide COMPLETELY outside the visible arc,
// because that is how it is kept off screen for the first two beats rather than
// by fading it. Because the centre sits CENTRE_OFFSET past the right edge, a
// point on a ring is only in frame while `sin θ < −CENTRE_OFFSET / R_OUT` —
// about 194°–346°, or 153° of arc. That leaves a 207° blind spot, so a 140°
// sector has a 67° window of rotations where none of it is visible.
//
// The bright end sits at the HIGH angle because the band turns clockwise, so the
// leading edge is the one at the largest angle. Putting the light end at 0deg
// would give a comet flying backwards.
const SWEEP_SECTOR = 140;

// The head is built, not blurred. A single ramp that fades up and fades out is
// the default a gradient gives you, and against this page — hairline rings,
// monospace weave, isometric wireframes, everything drawn rather than airbrushed
// — it reads as the one soft object in a hard composition. So the head is three
// parts:
//
//   1. a tail that decays NON-LINEARLY, dense just behind the head and thinning
//      out over a long dissolve, so the band has direction on its own;
//   2. a blade — the last degree before the cut goes to near-white and then
//      stops dead, which is what gives the band a front edge instead of a
//      fade-out;
//   3. two hairline rails (below) tracing the band's inner and outer edges over
//      the leading stretch only.
//
// The cut is 0.5deg wide rather than 0deg: a true hard stop in a conic gradient
// aliases into a visible staircase on the arc, and half a degree is under a
// pixel of arc length while still reading as a hard edge.
const SWEEP_ARC = [
  "conic-gradient(from 0deg",
  "rgba(0,185,111,0) 0deg",
  // Slow start: at a third of the way along the sector the tail is still barely
  // there. This is the part that used to be a straight line.
  "rgba(0,185,111,0.06) 46deg",
  "rgba(0,185,111,0.20) 82deg",
  "rgba(0,185,111,0.55) 104deg",
  "var(--cta-deep) 118deg",
  "var(--cta-mint) 130deg",
  "var(--cta-lime) 137deg",
  // The blade.
  `rgba(247,255,214,0.96) ${SWEEP_SECTOR - 0.5}deg`,
  `rgba(236,253,176,0) ${SWEEP_SECTOR}deg`,
  "rgba(236,253,176,0) 360deg)",
].join(",");

// How much of the leading arc the hairline rails cover. Long enough to read as a
// drawn bracket on the front of the band, short enough that the band still has a
// bare tail behind it.
const RAIL_ARC = 44;
// The rails are real 1px rings — the same construction as the field's other
// rings, so they match them stroke for stroke — windowed by a conic MASK to the
// leading RAIL_ARC degrees. Drawing them as gradient bands instead would make
// their thickness a percentage of the radius, i.e. a different weight from every
// other ring on screen, and at that point they stop tying into the field.
const RAIL_WINDOW = [
  "conic-gradient(from 0deg",
  "transparent 0deg",
  `transparent ${SWEEP_SECTOR - RAIL_ARC}deg`,
  `rgba(0,0,0,0.35) ${SWEEP_SECTOR - RAIL_ARC * 0.45}deg`,
  `#000 ${SWEEP_SECTOR - 0.5}deg`,
  `transparent ${SWEEP_SECTOR}deg`,
  "transparent 360deg)",
].join(",");

// Parked inside the blind spot: the sector spans 35°–175°, entirely clear of the
// visible 194°–346°. Its leading edge crosses into frame after ~19° of turn,
// which is a few percent of scroll into beat three.
const SWEEP_PARK = 35;
// One revolution from the moment it starts turning to the moment the section
// clears the top of the frame. This is the SETTLED rate.
const SWEEP_TURN = 360;

// On top of that base rate, a burst of extra angle delivered up front so the
// band arrives quickly instead of creeping in. It decays to nothing over the
// first SWEEP_LEAD_FRAC of the range, by which point the band is roughly a
// third of the way into frame and turning at exactly the base rate.
//
// This is why it is not simply an ease on the tween: an ease-out decays to ZERO
// velocity, so the band would visibly stall before the linear phase picked it
// up again. Adding a decaying term to a constant one keeps the velocity going
// from high to base without ever passing through a stop.
const SWEEP_LEAD = 29;
const SWEEP_LEAD_FRAC = 0.1;

// The burst's shape: enters at 3× and decays to a standstill, so it hands the band over
// to the base rate without a step in velocity. `hermiteRamp` states that as the two
// endpoint slopes instead of leaving it implicit in an expanded cubic.
//
// This used to be written by hand as `1 - (1 - x) ** 3`, which is the SAME curve —
// hermiteRamp(3, 0) expands to `3t - 3t² + t³`, identical to a floating-point epsilon.
// It moved to the shared helper because the argument above ("decay to zero velocity
// exactly where the clamp lands, so the seam is invisible") is a general one, and two
// other scenes needed it and re-derived it separately.
//
// Hoisted: the ramp is a closure over its coefficients, so building it per frame would
// allocate for nothing.
const SWEEP_LEAD_RAMP = hermiteRamp(3, 0);

// Punches the inner hole. `closest-side` is required: a circle radial-gradient
// defaults to farthest-CORNER, so on a square element 100% would land out at the
// diagonal and the hole would come out the wrong size.
const SWEEP_MASK = `radial-gradient(circle closest-side at center, transparent 0 ${(
  (R_IN / R_OUT) *
  100
).toFixed(2)}%, #000 ${((R_IN / R_OUT) * 100).toFixed(2)}% 100%)`;

// ── Ring wave ────────────────────────────────────────────────────────────────
// These animate `borderColor`, which is a paint property, on elements up to
// 112vw square. That looks like the most expensive thing in the section and it
// was flagged as such — but the reasoning behind the flag was wrong and it is
// worth writing down rather than acting on it.
//
// A ring is a `border: 1px` circle: everything inside it is transparent. What
// gets rasterised is the STROKE, whose cost scales with the perimeter (~5300px on
// a 1693px circle), not with the 2.8 million pixels of its bounding box.
//
// The alternative — two pre-coloured layers with `opacity` animated instead of
// the colour — is exactly equivalent, not approximately: with the bright layer at
// alpha 0.46237, source-over composition gives 0.07 + 0.43a for every value of
// `a`, which is the same straight line as interpolating 0.07 → 0.5. (Verified
// numerically; the ease curves carry over unchanged.)
//
// It was NOT done, for two reasons: `opacity` only becomes cheaper than a paint
// property if the element is promoted to its own compositing layer, and promoting
// seven 1693px-square layers costs on the order of 80MB of GPU memory to avoid
// repainting seven 1px strokes. Without promotion, animating opacity repaints the
// same area that animating the border colour does — so the change would add seven
// DOM nodes and buy nothing.
//
// If a profile ever shows this passage costing real paint time, the equivalence
// above is the recipe. Measure first.
const RING_DIM = "rgba(255,255,255,0.07)";
const RING_BRIGHT = "rgba(255,255,255,0.5)";
// Roughly how many rings are lit at once — the single number that decides
// whether this reads as a travelling wave or as the whole field swelling
// together. Below about 2 the wave stutters; above about 3.5 it stops
// travelling. The pulse length is derived from it, so both waves keep the same
// character even though their beats are different lengths.
const RINGS_LIT = 2.5;
// A pulse spends longer falling than rising, so the wave has a leading edge and
// a trail rather than reading as a symmetrical blink.
const RISE_SHARE = 0.36;

// ── The answer's colour ──────────────────────────────────────────────────────
// The letters do NOT all land on the same green. Their final colours sample the
// CTA ramp across the phrase — deep at the first letter, brightest at the last —
// so the finished line carries the gradient instead of reading as one flat
// colour. The bright end lands on the full stop, which is where the phrase ends
// and where the eye stops; the animation resolves there rather than running the
// whole line up to lime.
//

export default function ThreatSequence() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk, isDesktop }) => {
    // ── the band ──────────────────────────────────────────────────────────
    // Its own ScrollTrigger, starting where BEAT THREE starts rather than
    // where the section pins. For the first two beats it simply sits parked
    // in the blind spot with no tween running, which is why it needs no
    // opacity gate: there is nothing to hide.
    const sweep = q("[data-sweep]")[0];
    if (sweep && motionOk) {
      // A proxy object carries linear scroll progress and the angle is derived
      // from it, because the profile — constant plus a decaying burst — is not
      // expressible as a GSAP ease. quickSetter rather than a tween per frame.
      const setRotation = gsap.quickSetter(sweep, "rotation", "deg") as (
        v: number
      ) => void;
      const progress = { p: 0 };
      gsap.set(sweep, { rotation: SWEEP_PARK });

      gsap.to(progress, {
        p: 1,
        ease: "none",
        onUpdate: () => {
          // No `Math.min` here any more: `hermiteRamp` clamps its input to [0,1], so the
          // burst saturates on its own once the lead window is spent.
          const lead = SWEEP_LEAD * SWEEP_LEAD_RAMP(progress.p / SWEEP_LEAD_FRAC);
          setRotation(SWEEP_PARK + SWEEP_TURN * progress.p + lead);
        },
        scrollTrigger: {
          trigger: scope,
          // svh has to be resolved by hand — ScrollTrigger's offset syntax
          // takes px or a percentage of the trigger, not viewport units.
          start: () => `top top-=${(ANSWER_SVH / 100) * window.innerHeight}`,
          end: "bottom top",
          // `will-change` only while the band is actually turning. It used to be
          // a permanent class in the JSX, which meant this element — 68vw square,
          // a 10-stop conic gradient, two conic masks and a radial mask — was
          // promoted to its own compositing layer for the whole session,
          // including the first two beats when it does not move at all and the
          // rest of the page when the section is nowhere near the viewport. A
          // promoted layer costs GPU memory whether or not anything animates.
          onToggle: (self) => {
            sweep.style.willChange = self.isActive ? "transform" : "auto";
          },
          scrub: 0.3,
          invalidateOnRefresh: true,
        },
      });
    }

    // Without motion, or on a viewport too short to hold the composition, the
    // three beats fall into normal flow and stack. Every word is still on the
    // page; only the pinning is lost.
    if (!motionOk || !isDesktop) return;

    const panels = q("[data-beat]");
    if (panels.length !== BEATS.length) return;

    const sceneOff = enableScene(scope, "seq");
    const tl = trackTimeline(scope, { scrub: 0.3 });

    // ── each beat: lines rise, subtext follows, panel clears ────────────
    // `autoSplit: false` on purpose. These splits feed a shared scrubbed
    // timeline, and re-splitting on resize would leave that timeline holding
    // references to elements that no longer exist.
    const splits: SplitText[] = [];
    gsap.set(panels.slice(1), { autoAlpha: 0 });

    panels.forEach((panel, i) => {
      const headline = panel.querySelector<HTMLElement>("[data-headline]");
      const sub = panel.querySelector<HTMLElement>("[data-sub]");
      if (!headline) return;

      const split = SplitText.create(headline, {
        type: "lines",
        mask: "lines",
        autoSplit: false,
        aria: "auto",
      });
      allowDescenders(split.lines);
      splits.push(split);

      // The panel is revealed instantly and the lines do the entrance. Fading
      // the panel in as well would double the transition and blunt it.
      if (i > 0) tl.set(panel, { autoAlpha: 1 }, BEAT_START[i]);

      tl.fromTo(
        split.lines,
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: LINE_DUR,
          stagger: LINE_STAGGER,
          ease: "power3.out",
        },
        BEAT_START[i]
      );

      if (sub) {
        tl.fromTo(
          sub,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: SUB_DUR, ease: "none" },
          BEAT_START[i] + SUB_OFFSET
        );
      }

      // Every beat but the last clears itself before the next one starts.
      if (i < panels.length - 1) {
        tl.to(
          panel,
          { autoAlpha: 0, duration: OUT_DUR, ease: "none" },
          BEAT_END[i] - OUT_DUR
        );
      }
    });

    // (La pieza de "the answer arrives" — el tail escrito letra a letra sobre
    // el ramp del CTA — se retiró junto con el markup especial del beat final:
    // los tres beats comparten la misma entrada de líneas + sub.)

    // ── easing out of the lock ──────────────────────────────────────────
    // A sticky element releases instantly: one frame it is held, the next it
    // travels at full scroll speed, and the jolt is the most conspicuous thing
    // in the section. Lifting the stuck child slightly over the last stretch
    // means it is ALREADY moving when the release happens, so the two speeds
    // meet instead of colliding. `power2.in` starts it near zero and builds.
    //
    // It lifts the CONTENT, not the whole stuck child. Moving the child moves
    // the ring field with it and uncovers a strip of bare section background
    // along the bottom edge — a hard horizontal seam right where the reader is
    // looking. The field stays put; only the type and links ease away.
    //
    // Function-based value + `invalidateOnRefresh` on the timeline's trigger:
    // GSAP does not parse `svh`, and the distance has to survive a resize.
    //
    // This used to be selected structurally — `[data-seq] > div > div:not([aria-hidden])`
    // — because `Container` accepts only `as`, `width`, `children` and `className`
    // and silently drops any other prop, so a data attribute passed to it never
    // reached the DOM. That selector depended on `Container` rendering a `div` AND
    // on the stuck wrapper having exactly two children: reordering the background
    // layer or wrapping the content one level deeper would have stopped this
    // animating, with no error. The wrapper now carries the attribute itself.
    const stuck = q("[data-seq-content]")[0];
    if (stuck) {
      tl.fromTo(
        stuck,
        { y: 0 },
        {
          y: () => -window.innerHeight * RELEASE_LIFT,
          ease: "power2.in",
          duration: RELEASE_SPAN,
        },
        TIMELINE_END - RELEASE_SPAN
      );
    }

    // Holds the timeline open to beat three's full span. Without it the
    // timeline would end on the last letter and every unit would stretch.
    tl.to({}, { duration: 0.01 }, TIMELINE_END);

    // ── the ring wave ───────────────────────────────────────────────────
    // Scroll-driven, not a loop: the pulse is the reader's own progress
    // through the beat made visible, so it has to be on the scrub.
    const rings = q("[data-ring]");
    if (rings.length > 1) {
      gsap.set(rings, { borderColor: RING_DIM });

      const wave = (start: number, span: number, outward: boolean) => {
        // The last ring has to finish inside the beat, so the span covers
        // (n − 1) steps plus one whole pulse.
        const step = span / (RINGS_LIT + rings.length - 1);
        const pulse = step * RINGS_LIT;
        rings.forEach((ring, i) => {
          // `rings` is ordered innermost → outermost, so ascending index
          // radiates out and descending closes in.
          const order = outward ? i : rings.length - 1 - i;
          tl.to(
            ring,
            {
              keyframes: [
                {
                  borderColor: RING_BRIGHT,
                  duration: pulse * RISE_SHARE,
                  ease: "power2.out",
                },
                {
                  borderColor: RING_DIM,
                  duration: pulse * (1 - RISE_SHARE),
                  ease: "power1.in",
                },
              ],
            },
            start + order * step
          );
        });
      };

      // Spans derived from the cuts, with clearance either side, so retiming a
      // beat re-fits its wave instead of leaving it running past the handover.
      // Un solo wave ahora: el beat de la amenaza radia hacia afuera; en el
      // de la respuesta el protagonismo es del sweep que entra rotando.
      wave(0.02, CUT - 0.04, true);
    }

    return () => {
      sceneOff();
      splits.forEach((s) => s.revert());
      gsap.set(panels, { clearProps: "opacity,visibility" });
      if (stuck) gsap.set(stuck, { clearProps: "transform" });
      gsap.set(rings, { clearProps: "borderColor" });
    };
  });

  return (
    // No overflow-hidden on the track: an ancestor with overflow other than
    // visible becomes the sticky child's scroll container and it stops sticking.
    // `data-seq` is NOT declared here on purpose: `enableScene` writes it from the
    // effect and nothing else touches it. Declared in the JSX as well, any future
    // re-render would reset it to "off" and silently undo the sticky layout.
    <section
      ref={rootRef}
      data-nav-dark
      style={{ "--travel": TRAVEL } as React.CSSProperties}
      className="group/seq relative bg-ink-slate text-white data-[seq=on]:h-[calc(100svh+var(--travel))]"
    >
      <div className="relative overflow-hidden group-data-[seq=on]/seq:sticky group-data-[seq=on]/seq:top-0 group-data-[seq=on]/seq:h-svh">
        {/* ── background ────────────────────────────────────────────────── */}
        {/* HTML and not SVG: the sweep needs a conic gradient, which SVG has no
            native equivalent for. The alternative is slicing the band into
            dozens of solid-filled sectors to fake the ramp. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 104% 50%, rgba(45,212,191,0.13) 0%, rgba(45,212,191,0.035) 46%, rgba(45,212,191,0) 72%)",
            }}
          />

          {/* Zero-size anchor at the ring centre. Every ring hangs off it with a
              negative offset of its own radius, so one value positions each. */}
          <div
            className="absolute right-0 top-1/2 size-0"
            style={{ transform: `translateX(${CENTRE_OFFSET}vw)` }}
          >
            {RINGS.map((r) => (
              <span
                key={r}
                data-ring
                className="absolute rounded-full border border-white/[0.07]"
                style={{
                  width: `${r * 2}vw`,
                  height: `${r * 2}vw`,
                  left: `${-r}vw`,
                  top: `${-r}vw`,
                }}
              />
            ))}

            {/* A bare wrapper: it carries the rotation and nothing else. The
                band's annulus mask cannot live here, because a mask clips an
                element's DESCENDANTS too — and the rails sit exactly ON the two
                radii that mask cuts at, so they would come out half a stroke
                wide. The inline `rotate` is the parked angle, so the whole
                assembly is already out of frame on the first paint, before any
                JS runs. */}
            <div
              data-sweep
              // No `will-change` here: the effect adds it via the band's
              // ScrollTrigger while it is turning and removes it after. See the
              // onToggle in the motion block.
              className="absolute"
              style={{
                width: `${R_OUT * 2}vw`,
                height: `${R_OUT * 2}vw`,
                left: `${-R_OUT}vw`,
                top: `${-R_OUT}vw`,
                transform: `rotate(${SWEEP_PARK}deg)`,
              }}
            >
              {/* `rounded-full` clips the outer edge, the mask punches the inner
                  one; between them the conic gradient becomes an annulus
                  sector. */}
              <span
                className="absolute inset-0 rounded-full"
                style={{
                  background: SWEEP_ARC,
                  WebkitMaskImage: SWEEP_MASK,
                  maskImage: SWEEP_MASK,
                }}
              />

              {/* The rails. Same 1px ring construction as the field behind them,
                  windowed to the leading arc. */}
              {[R_IN, R_OUT].map((r) => (
                <span
                  key={r}
                  className="absolute rounded-full border"
                  style={{
                    width: `${r * 2}vw`,
                    height: `${r * 2}vw`,
                    left: `${R_OUT - r}vw`,
                    top: `${R_OUT - r}vw`,
                    borderColor: "rgba(236,253,176,0.9)",
                    WebkitMaskImage: RAIL_WINDOW,
                    maskImage: RAIL_WINDOW,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── composition ───────────────────────────────────────────────── */}
        {/* Asymmetric padding on purpose. The nav pill is fixed at the top of
            the viewport and reappears whenever the reader scrolls up — which,
            inside a pinned section, happens constantly. At 7svh the headline sat
            directly under it. 15svh clears the pill plus its own top offset and
            leaves the gap reading as deliberate rather than as a near-miss.
            The foot keeps the smaller value: nothing overlaps it there. */}
        <Container
          data-seq-content
          className="relative flex flex-col py-20 group-data-[seq=on]/seq:h-full group-data-[seq=on]/seq:pb-[7svh] group-data-[seq=on]/seq:pt-[15svh]"
        >
          <div className="grid min-h-0 flex-1 lg:max-w-[62%]">
            {/* Los tres beats comparten ahora UNA misma anatomía (pedido de
                Lawrence, 2026-08-17): H2 en dos líneas (la segunda en Accent),
                body, y el link DEL beat — ya no hay meta row compartida al pie
                ni pieza especial de "rotating one key." en el beat final. El
                link vive dentro del wrapper data-sub para fundir con el body. */}
            {BEATS.map((beat) => (
              <div
                key={beat.key}
                data-beat
                // Stacked in one cell so the frame never reflows between beats.
                // With the sequence disarmed they fall back into normal flow.
                className="flex flex-col justify-start gap-7 group-data-[seq=on]/seq:[grid-area:1/1]"
              >
                <h2 data-headline className="max-w-[24ch] text-h1 text-balance">
                  {beat.heading[0]}
                  <br />
                  <Accent>{beat.heading[1]}</Accent>
                </h2>

                {/* Design change from Figma (NEARORG_CLAUDE_QUANTUM): the beat
                    copy moved up one step of the scale and lost its
                    transparency. At `text-body` on a 60% white it was the
                    quietest thing in the sequence while carrying the whole
                    explanation; full white at body-lg makes it read as the
                    second voice rather than a footnote. */}
                <div data-sub className="flex flex-col items-start gap-8">
                  <p className="max-w-[54ch] text-body-lg text-white text-pretty">
                    {beat.body}
                  </p>
                  {beat.link && (
                    <CtaPill href={beat.link.href} size="sm" tone="solid" external>
                      {beat.link.label}
                    </CtaPill>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}
