"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { gsap, SplitText } from "@/components/primitives/motion/gsapClient";
import { allowDescenders } from "@/components/primitives/motion/maskedLines";
import { MQ, DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import CtaPill from "@/components/sections/quantum/CtaPill";

// §3 + §4 of the copy deck, as ONE pinned composition.
//
// The section locks to the viewport the moment its top reaches the top of the
// frame and holds for three beats. Nothing scrolls away: the frame — the links
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
// Every line below is from docs/quantum-security-brief.md. Beat 1 is §3, beat 3
// is §4, and beat 2 is assembled from §3, §9 and the fourth and fifth answers of
// the §10 FAQ. Nothing here is sourced from outside the deck — see the README
// before adding anything that is.

const HEAD = "Defending against quantum attack means";
const TAIL = "rotating one key.";

// Pinned travel. Beats one and two were tightened by 20% — they set up a problem
// the reader already half-knows. Beat three's dwell AFTER the answer finishes
// writing was then halved, which is where the rest of the reduction came from:
// once the line has landed there is nothing left to read, and holding the pin
// there just makes the section feel stuck.
const TRAVEL_SVH = 196;
const TRAVEL = `${TRAVEL_SVH}svh`;

// ── Timeline map ─────────────────────────────────────────────────────────────
// Positions in the scrubbed timeline. Hoisted to module scope because the ring
// geometry below and the sweep's own trigger both have to agree with them.
const CUT = [0.28, 0.54];
const BEAT3_SPAN = 0.53;
const TIMELINE_END = CUT[1] + BEAT3_SPAN;
const BEAT_START = [0, CUT[0], CUT[1]];
const BEAT_END = [CUT[0], CUT[1], TIMELINE_END];
/** Where beat three begins, measured in svh of scroll after the pin engages. */
const BEAT3_SVH = (CUT[1] / TIMELINE_END) * TRAVEL_SVH;

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
/** Beat three's answer starts writing once its headline lines have settled. */
const WRITE_AT = CUT[1] + 0.14;
const WRITE_SPAN = 0.15;

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

// Punches the inner hole. `closest-side` is required: a circle radial-gradient
// defaults to farthest-CORNER, so on a square element 100% would land out at the
// diagonal and the hole would come out the wrong size.
const SWEEP_MASK = `radial-gradient(circle closest-side at center, transparent 0 ${(
  (R_IN / R_OUT) *
  100
).toFixed(2)}%, #000 ${((R_IN / R_OUT) * 100).toFixed(2)}% 100%)`;

// ── Ring wave ────────────────────────────────────────────────────────────────
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
const RAMP = ["#00b96f", "#8bf29c", "#ecfdb0"];
const RAMP_HEAD = RAMP[RAMP.length - 1];

function rampAt(t: number): string {
  const seg = Math.min(1, Math.max(0, t)) * (RAMP.length - 1);
  const i = Math.min(RAMP.length - 2, Math.floor(seg));
  const f = seg - i;
  const channel = (offset: number) =>
    Math.round(
      parseInt(RAMP[i].slice(1 + offset, 3 + offset), 16) * (1 - f) +
        parseInt(RAMP[i + 1].slice(1 + offset, 3 + offset), 16) * f
    );
  return `rgb(${channel(0)},${channel(2)},${channel(4)})`;
}

type Beat = {
  key: string;
  body: string;
};

const BEATS: Beat[] = [
  {
    key: "mechanism",
    body: "Most blockchains derive account ownership from elliptic-curve cryptography. The moment an address signs, the key it was derived from is visible onchain.",
  },
  {
    key: "attack",
    body: "A quantum computer running Shor’s algorithm could derive a private key from an exposed public key and take the assets it controls. Those keys can be harvested now and attacked later, so the deadline is already behind us.",
  },
  {
    key: "answer",
    body: "NEAR accounts are decoupled from cryptography, so an account holder rotates to quantum-safe keys in a single transaction and keeps the same account.",
  },
];

export default function ThreatSequence() {
  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add({ motionOk: MQ.motion, isDesktop: MQ.desktop }, (mctx) => {
      const { motionOk, isDesktop } = mctx.conditions as {
        motionOk: boolean;
        isDesktop: boolean;
      };

      // ── the band ────────────────────────────────────────────────────────
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
            const x = Math.min(1, progress.p / SWEEP_LEAD_FRAC);
            const lead = SWEEP_LEAD * (1 - Math.pow(1 - x, 3));
            setRotation(SWEEP_PARK + SWEEP_TURN * progress.p + lead);
          },
          scrollTrigger: {
            trigger: scope,
            // svh has to be resolved by hand — ScrollTrigger's offset syntax
            // takes px or a percentage of the trigger, not viewport units.
            start: () => `top top-=${(BEAT3_SVH / 100) * window.innerHeight}`,
            end: "bottom top",
            scrub: 0.3,
            invalidateOnRefresh: true,
          },
        });
      }

      // Without motion, or on a viewport too short to hold the composition, the
      // three beats fall into normal flow and stack. Every word is still on the
      // page; only the pinning is lost.
      if (!motionOk || !isDesktop) return;

      const host = scope as HTMLElement;
      host.dataset.seq = "on";

      const panels = q("[data-beat]");
      const tail = q("[data-tail]")[0];
      if (panels.length !== BEATS.length || !tail) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scope,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
          invalidateOnRefresh: true,
          markers: DEBUG_MARKERS,
        },
      });

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

      // ── the answer arrives, inside beat three ───────────────────────────
      const tailSplit = SplitText.create(tail, {
        type: "chars",
        smartWrap: true,
        aria: "none",
      });
      gsap.set(tailSplit.chars, { autoAlpha: 0 });

      const last = Math.max(1, tailSplit.chars.length - 1);
      const inStep = WRITE_SPAN / last;
      tailSplit.chars.forEach((c, i) => {
        tl.to(
          c,
          {
            keyframes: [
              // Arrives at the bright end of the ramp…
              { autoAlpha: 1, color: RAMP_HEAD, duration: 0.05, ease: "none" },
              // …then settles to its own position in it. The final letter's
              // position IS the bright end, so it does not settle at all — which
              // is what leaves the brightest point on the full stop.
              { color: rampAt(i / last), duration: 0.1, ease: "none" },
            ],
          },
          WRITE_AT + i * inStep
        );
      });

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
      // Selected structurally rather than by a data attribute: `Container` takes
      // only `as`, `width`, `children` and `className`, so an attribute passed to
      // it is silently dropped and this would never animate. The stuck wrapper
      // has exactly two children — the aria-hidden ring field and the content —
      // so "the child that is not the background" identifies it unambiguously.
      const stuck = scope.querySelector<HTMLElement>(
        "[data-seq] > div > div:not([aria-hidden])"
      );
      if (stuck) {
        tl.fromTo(
          stuck,
          { y: 0 },
          {
            y: () => -window.innerHeight * 0.055,
            ease: "power2.in",
            duration: 0.14,
          },
          TIMELINE_END - 0.14
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
        wave(0.02, CUT[0] - 0.04, true); // beat one — radiating out
        wave(CUT[0] + 0.04, CUT[1] - CUT[0] - 0.05, false); // beat two — closing in
      }

      return () => {
        delete host.dataset.seq;
        splits.forEach((s) => s.revert());
        tailSplit.revert();
        gsap.set(panels, { clearProps: "opacity,visibility" });
        if (stuck) gsap.set(stuck, { clearProps: "transform" });
        gsap.set(q("[data-ring]"), { clearProps: "borderColor" });
      };
    });

    return () => mm.revert();
  }, []);

  return (
    // No overflow-hidden on the track: an ancestor with overflow other than
    // visible becomes the sticky child's scroll container and it stops sticking.
    <section
      ref={rootRef}
      data-nav-dark
      data-seq="off"
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
              className="absolute will-change-transform"
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
        <Container className="relative flex flex-col py-20 group-data-[seq=on]/seq:h-full group-data-[seq=on]/seq:pb-[7svh] group-data-[seq=on]/seq:pt-[15svh]">
          <div className="grid min-h-0 flex-1 lg:max-w-[62%]">
            {BEATS.map((beat, i) => (
              <div
                key={beat.key}
                data-beat
                // Stacked in one cell so the frame never reflows between beats.
                // With the sequence disarmed they fall back into normal flow.
                className="flex flex-col justify-start gap-7 group-data-[seq=on]/seq:[grid-area:1/1]"
              >
                {i === BEATS.length - 1 ? (
                  <p className="max-w-[24ch] text-h1 text-balance">
                    {/* Only the HEAD is line-split — the answer below is split
                        into characters and animated separately, and one element
                        cannot be split two ways. */}
                    <span data-headline className="block">
                      <span className="block">NEAR&rsquo;s answer to</span>
                      {HEAD}
                    </span>
                    {/* `accent-serif` to match the italic accents in beats one
                        and two — same Kepler, same optical scale. It sets face
                        and size only, so the per-letter gradient GSAP writes
                        inline still comes through untouched.
                        Holds its space from the start: the letters begin at
                        `autoAlpha: 0`, which hides them without collapsing the
                        line, so the head never reflows as the answer arrives.
                        The class colour is the no-JS fallback. */}
                    <span data-tail className="block accent-serif text-near-green-accent">
                      {TAIL}
                    </span>
                  </p>
                ) : (
                  <h2 data-headline className="max-w-[24ch] text-h1 text-balance">
                    {i === 0 ? (
                      <>
                        The quantum threat
                        <br />
                        <Accent>to blockchains</Accent>
                      </>
                    ) : (
                      <>
                        Shor&rsquo;s algorithm
                        <br />
                        <Accent>reverses it</Accent>
                      </>
                    )}
                  </h2>
                )}

                <p data-sub className="max-w-[54ch] text-body text-white/60 text-pretty">
                  {beat.body}
                </p>
              </div>
            ))}
          </div>

          {/* ── meta row ────────────────────────────────────────────────── */}
          {/* Bottom-LEFT, on the same gutter as the headline and the body. That
              gives the section one uninterrupted vertical axis — type at the top
              of the column, actions at its foot — and hands the whole right of
              the frame to the ring field. Sitting them bottom-right instead put
              a second, competing anchor directly under the graphic. */}
          <div className="mt-10 flex flex-wrap items-center justify-start gap-4">
              <CtaPill
                href="https://near.org/blog/making-near-protocol-post-quantum-safe"
                size="sm"
                tone="solid"
                external
              >
                How NEAR is preparing for the quantum era
              </CtaPill>
              <CtaPill
                href="https://docs.near.org/protocol/accounts-contracts/account-model"
                size="sm"
                tone="solid"
                external
              >
                How the NEAR account model works
              </CtaPill>
          </div>
        </Container>
      </div>
    </section>
  );
}
