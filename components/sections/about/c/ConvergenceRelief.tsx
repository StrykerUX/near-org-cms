// The circle, at page scale — the closing image of variant C.
//
// Same drawing as `../figures/ConvergenceDiagram` and `../b/ConvergenceSolid`,
// and the third register it has been set in: flat hairline for the editorial
// variant, extruded solid for the instrument, and here a landform. Nothing
// about the argument moves — the models set out, stop in 2018, the detour
// becomes the network, the models return, the two arrive at the same point and
// the line keeps going off the right edge.
//
// ── Why it is drawn as terrain ────────────────────────────────────────────
//
// This variant's whole ground is a contour map, and a contour map is a record:
// every line on it is a level someone measured. So the network run — the thing
// that was being built during the years the models did not exist — carries
// level lines around it, and the drawing says what the page says: the era left
// relief. The two RIBBONS are the paths themselves; the hairlines are what
// accumulated around the one that was under construction.
//
// Only the network gets contours. Relief around all three runs is a hatch, and
// a hatch is texture rather than a reading — and it would be false besides: the
// models line is the one that was NOT being built.
//
// ── Why the ramp, and why it deepens rightward ────────────────────────────
//
// `--cta-lime → --cta-mint → --cta-deep` used as actual fill and not as an
// accent, which is the one thing this variant is allowed that the other two are
// not. It runs pale at 2017 and solid at the meeting point, so the ribbon gains
// substance exactly where the argument does. The direction is not decorative:
// reversed, the strongest colour would sit on the years with the least in them.
//
// Every ribbon is stroked TWICE — a 1px-wider rule underneath, then the
// gradient on top. That outline is what lets the pale end of the ramp exist at
// all: `--cta-lime` on cream is a value the eye cannot find, and an edge is
// cheaper than giving up the ramp.

const W = 1200;
const H = 400;

const Y_MODELS = 70;
const Y_NETWORK = 250;
const Y_MEET = 160;

const X_START = 30;
const X_PIVOT = 250; // the models stop; the detour drops from here
const X_RETURN = 720; // the models come back
const X_BEND = 900; // both runs start angling toward each other
const X_MEET = 1050;
const X_EDGE = 1196; // past the frame, on purpose

/** Ribbon thickness. The outline is this plus two. */
const T = 20;

/** Level spacing and how many levels the network run carries on each side. */
const STEP = 16;
const LEVELS = 6;

const MODELS = `M ${X_START} ${Y_MODELS} H ${X_PIVOT}`;
// The pivot is part of this run and not a separate mark: the drop IS the
// network's first move. Drawing it apart would make the detour something that
// happened TO the story rather than the thing the story became.
const NETWORK = `M ${X_PIVOT} ${Y_MODELS} V ${Y_NETWORK} H ${X_BEND} L ${X_MEET} ${Y_MEET} H ${X_EDGE}`;
const RETURN = `M ${X_RETURN} ${Y_MODELS} H ${X_BEND} L ${X_MEET} ${Y_MEET}`;

const GAP_X = (X_PIVOT + X_RETURN) / 2;

export default function ConvergenceRelief() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="about-c-ramp" x1={X_START} y1="0" x2={X_MEET} y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--cta-lime)" />
          <stop offset="0.55" stopColor="var(--cta-mint)" />
          <stop offset="1" stopColor="var(--cta-deep)" />
        </linearGradient>
      </defs>

      {/* ── the relief: what the detour left behind ──────────────────────── */}
      <g stroke="currentColor" strokeWidth="1" strokeLinejoin="round">
        {Array.from({ length: LEVELS }, (_, k) => k + 1).flatMap((k) =>
          [-1, 1].map((dir) => (
            <path
              key={`${dir}-${k}`}
              d={NETWORK}
              transform={`translate(0 ${dir * k * STEP})`}
              opacity={0.2 - k * 0.026}
            />
          ))
        )}
      </g>

      {/* ── the runs ─────────────────────────────────────────────────────── */}
      {[MODELS, NETWORK, RETURN].map((d, i) => (
        <path
          key={`edge-${i}`}
          d={d}
          stroke="currentColor"
          strokeOpacity="0.55"
          strokeWidth={T + 2}
          strokeLinejoin="round"
        />
      ))}
      {[MODELS, NETWORK, RETURN].map((d, i) => (
        <path
          key={`ramp-${i}`}
          d={d}
          stroke="url(#about-c-ramp)"
          strokeWidth={T}
          strokeLinejoin="round"
        />
      ))}

      {/* the years the models did not exist, marked rather than left blank */}
      <path
        d={`M ${GAP_X} ${Y_MODELS - 34} V ${Y_MODELS + 34}`}
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.4"
      />

      {/* The meeting, drawn as a survey station and not as a dot: at this point
          the ribbon is already `--cta-deep`, so a filled circle in the same
          green is invisible. A pale disc with a solid centre reads against it,
          and it is the mark a levelling sheet would actually carry. */}
      <circle cx={X_MEET} cy={Y_MEET} r="15" fill="var(--cream)" />
      <circle cx={X_MEET} cy={Y_MEET} r="15" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1" />
      <circle cx={X_MEET} cy={Y_MEET} r="5.5" fill="var(--cta-deep)" />
    </svg>
  );
}
