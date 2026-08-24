"use client";

import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { EASE_OUT, DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { FLYWHEEL } from "@/components/sections/economics/economicsContent";
import {
  W,
  H,
  CONTOURS,
  STATIONS,
  RESTART,
  ROUTE,
  RETURN,
  CIRCUIT,
  RELIEF_FILL,
} from "@/components/sections/economics/c/ascentRoute";

// §3 of variant C — the flywheel as a climb, in one screen.
//
// ── The rule this section has to satisfy, and how C satisfies it ──────────
// Step 4 only means anything as the thing that restarts step 1, so any layout
// that lets the four be read out of order has broken the section. A and B solve
// it by making the reader travel: a sticky scene where the third beat is
// unreachable without the second. C is not allowed that solution — the brief
// for this variant is one screen, not five — so it solves it in the figure
// instead. The four stations sit on ONE route that climbs left to right, in
// numbered order, with the return sweeping back under them; reading them out of
// order means reading the route backwards, which the drawing makes obviously
// wrong.
//
// ── Why the return is the point ──────────────────────────────────────────
// The route ends at station 04 and comes back to station 01's column one band
// HIGHER than station 01. A ring returns to exactly where it started, which is
// the diagram of a cycle; this one returns to a better place, which is the
// diagram of a flywheel — and it is the claim `FLYWHEEL.closing` makes, drawn
// rather than restated.
//
// ── The carrier does not stop ────────────────────────────────────────────
// One bead runs climb-then-return, forever, on its own tween with no
// relationship to the scroll. It is why the loop reads as something running and
// not as a route someone once walked. It asserts nothing measurable: no rate,
// no quantity, nothing counting. On `prefers-reduced-motion` there is no tween
// at all and the bead simply sits at the start of the climb.
//
// ── Full bleed, and the text row is not aligned to the stations ───────────
// The figure runs edge to edge and the four blocks under it sit on the
// container's grid, so a station and its block do NOT line up on a vertical.
// That was tried and abandoned: the container's padding is a different number
// at every breakpoint, so any alignment true at one width is false at the next,
// and a tick that nearly connects is worse than no tick. What carries the
// mapping instead is the numbering and the stagger — each block sits higher
// than the one before it, in the same proportion as its station.

const STEPS = FLYWHEEL.steps;

// Literals: GSAP interpolates colours, not declarations, and these are also
// read straight into SVG attributes.
const ROUTE_STROKE = "#00a86b";
const RETURN_STROKE = "#00b96f";
const CARRIER = "#ecfdb0";
const CONTOUR_STROKE = "rgba(78,122,63,0.28)";
const STATION_RING = "#00a86b";

const PATH_LEN = 100;

/** One full trip of the carrier, climb plus return, in seconds. */
const CARRIER_SECONDS = 12;

/**
 * How far each block hangs below the top of the row, as a share of the tallest
 * drop. Read off the stations so the stagger and the climb cannot drift apart:
 * the first block sits lowest because its station does.
 */
const TOP = STATIONS[STATIONS.length - 1].y;
const DROP = STATIONS[0].y - TOP;
const OFFSET = STATIONS.map((s) => (s.y - TOP) / DROP);
/** The tallest block sits this far down, in rem. */
const STAGGER_REM = 5;

export default function AscentLoop() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk }) => {
    if (!motionOk) return;

    const carrier = q<SVGPathElement>("[data-carrier]");
    const trip = gsap.to(carrier, {
      strokeDashoffset: -PATH_LEN,
      duration: CARRIER_SECONDS,
      ease: "none",
      repeat: -1,
    });

    const climb = q<SVGPathElement>("[data-climb]");
    const back = q("[data-return]");
    const marks = q("[data-mark]");
    const relief = q("[data-relief]");

    gsap.set(climb, { strokeDasharray: PATH_LEN, strokeDashoffset: PATH_LEN });
    gsap.set([...marks, ...back, ...relief], { autoAlpha: 0 });

    const tl = gsap.timeline({
      defaults: { ease: EASE_OUT },
      scrollTrigger: { trigger: scope, start: "top 62%", once: true, markers: DEBUG_MARKERS },
    });

    // The climb draws, the stations land behind it, and only then does the
    // return sweep back. Drawing the return first would show the reader the
    // answer before the question.
    tl.to(climb, { strokeDashoffset: 0, duration: 1.6, ease: "power1.inOut" }, 0)
      .to(marks, { autoAlpha: 1, duration: 0.4, stagger: 0.12 }, 0.35)
      .to(relief, { autoAlpha: 1, duration: 1.2 }, 0.5)
      // The return FADES in and is not drawn. It carries a dash pattern, and
      // `strokeDasharray` is also the mechanism a draw-on uses — animating the
      // offset would overwrite the pattern and leave the return solid, which is
      // exactly the weight it must not have.
      .to(back, { autoAlpha: 1, duration: 0.9 }, 1.6);

    return () => {
      trip.kill();
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  });

  return (
    <section
      ref={rootRef}
      id="how-it-works"
      className="bg-cream py-[12svh] text-ink scroll-mt-[var(--site-header-block)]"
    >
      <Container>
        <div className="grid-ds items-end gap-y-6">
          <div className="col-span-12 lg:col-span-7">
            <Eyebrow className="text-gray-intermediate">{FLYWHEEL.eyebrow}</Eyebrow>
            <h2 className="mt-6 max-w-[16ch] text-h1 text-balance">{FLYWHEEL.headline}</h2>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:col-start-9">
            <p className="max-w-[44ch] text-body text-ink-soft text-pretty">{FLYWHEEL.intro}</p>
          </div>
        </div>
      </Container>

      {/* Full bleed: no Container. The terrain has to reach both edges or it is
          a picture of a landscape instead of the ground the page stands on. */}
      <div className="relative mt-16 w-full lg:mt-24">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="block w-full"
          // The box is far wider than it is tall and it is a drawing, not a
          // photograph: letting it fill the width and crop nothing is what
          // keeps the climb readable on a phone.
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <defs>
            {/* The CTA ramp as an actual fill, which is this variant's licence
                and nowhere else's: the ground under the climb is what rises. */}
            <linearGradient id="economics-c-relief" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8bf29c" stopOpacity="0.55" />
              <stop offset="60%" stopColor="#ecfdb0" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ecfdb0" stopOpacity="0" />
            </linearGradient>
          </defs>

          {CONTOURS.map((d, i) => (
            <path
              key={`contour-${i}`}
              d={d}
              fill="none"
              stroke={CONTOUR_STROKE}
              strokeWidth="1"
            />
          ))}

          <path data-relief d={RELIEF_FILL} fill="url(#economics-c-relief)" stroke="none" />

          <path
            data-climb
            d={ROUTE}
            fill="none"
            stroke={ROUTE_STROKE}
            strokeWidth="2"
            pathLength={PATH_LEN}
          />

          {/* The return is dashed: it is the same movement as the climb but it
              is not a fifth step, and a solid line of equal weight would be
              counted as one.
              The dash is in PATH-LENGTH units, not pixels — `pathLength={100}`
              renormalises the whole path to 100, so "8 7" is an 8% dash and the
              return arrives as six enormous fragments. It has to be read as a
              percentage of the path or it is not a dash pattern at all. */}
          <path
            data-return
            d={RETURN}
            fill="none"
            stroke={RETURN_STROKE}
            strokeWidth="2"
            strokeDasharray="1.3 1.5"
            pathLength={PATH_LEN}
          />

          {/* One short dash on a 100-unit path: the gap is the rest of the
              circuit, so there is never more than one bead on it. */}
          <path
            data-carrier
            d={CIRCUIT}
            fill="none"
            stroke={CARRIER}
            strokeWidth="7"
            strokeLinecap="round"
            pathLength={PATH_LEN}
            strokeDasharray="1.2 98.8"
          />

          {STATIONS.map((s, i) => (
            <g key={STEPS[i].id} data-mark>
              <circle cx={s.x} cy={s.y} r="9" fill="#f5f4f1" stroke={STATION_RING} strokeWidth="1.5" />
              <circle cx={s.x} cy={s.y} r="3.5" fill={STATION_RING} stroke="none" />
            </g>
          ))}

          {/* The landing of the return: hollow, and above station 01. Hollow
              because it is where the next turn STARTS, not a fifth event that
              has happened. */}
          <circle
            data-mark
            cx={RESTART.x}
            cy={RESTART.y}
            r="7"
            fill="none"
            stroke={RETURN_STROKE}
            strokeWidth="1.5"
          />
        </svg>

        {/* Labels in HTML and not <text>: inside a viewBox scaled to the full
            width, an SVG label is multiplied by the figure's scale and stops
            matching the mono scale on the rest of the page. */}
        {STATIONS.map((s, i) => (
          <span
            key={STEPS[i].id}
            data-mark
            className="pointer-events-none absolute hidden -translate-x-1/2 whitespace-nowrap text-micro-mono uppercase text-ink-soft sm:block"
            style={{ left: `${(s.x / W) * 100}%`, top: `${((s.y - 34) / H) * 100}%` }}
          >
            {STEPS[i].index} {STEPS[i].short}
          </span>
        ))}

        <span
          data-mark
          className="pointer-events-none absolute hidden -translate-x-1/2 whitespace-nowrap text-micro-mono uppercase text-green-ink sm:block"
          style={{ left: `${(RESTART.x / W) * 100}%`, top: `${((RESTART.y - 32) / H) * 100}%` }}
        >
          {FLYWHEEL.restart.label}
        </span>
      </div>

      <Container>
        {/* Each block sits at its station's height. `items-start` and a padding
            read off the geometry, so the row is ragged in exactly the shape of
            the climb above it. */}
        <ol role="list" className="mt-8 grid-ds items-start gap-y-12 lg:mt-4">
          {STEPS.map((s, i) => (
            <li
              key={s.id}
              className="col-span-12 md:col-span-6 lg:col-span-3"
              style={{ "--rise": `${(OFFSET[i] * STAGGER_REM).toFixed(2)}rem` } as React.CSSProperties}
            >
              <div className="lg:pt-[var(--rise)]">
                <div className="h-px w-full bg-rule" aria-hidden="true" />
                <p className="mt-5 text-caption-mono text-gray-intermediate">
                  {s.index} — {s.short}
                </p>
                <h3 className="mt-5 max-w-[16ch] text-h4 text-pretty">{s.title}</h3>
                <p className="mt-4 max-w-[34ch] text-body-sm text-ink-soft text-pretty">
                  {s.body}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-20 grid-ds gap-y-8">
          <p className="col-span-12 max-w-[30ch] text-h2-serif italic text-pretty lg:col-span-6">
            {FLYWHEEL.closing}
          </p>
          <p className="col-span-12 max-w-[36ch] text-body-sm-mono text-green-ink text-pretty lg:col-span-4 lg:col-start-8">
            {FLYWHEEL.restart.note}
          </p>
        </div>
      </Container>
    </section>
  );
}
