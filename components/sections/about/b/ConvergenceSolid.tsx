// The convergence, with a body.
//
// `../figures/ConvergenceDiagram` is this same drawing at one pixel: two lines,
// a gap, a meeting, and a stroke that leaves the frame instead of closing into
// a ring. Nothing about the argument changes here — the marks are in the same
// order and mean the same things — but variant B is an instrument, and a trace
// on an instrument has a gauge. So each line is extruded into a bar with a lit
// top face and a wall, lit from the same angle as the four-act machine, and the
// only accent in the frame is the segment that runs off the right edge.
//
// It is a duplicate rather than a prop on the flat one, and deliberately: the
// two differ in construction, not in configuration. Bolting a `solid` flag onto
// the flat version would leave one file drawing two unrelated things behind a
// boolean, and the flat one has to stay exactly as it is — variant A ships it.
//
// ── Why straight segments where the flat one curves ───────────────────────
//
// The flat drawing bends the two lines together with a bezier. A bezier with a
// wall on it needs its offset curve computed, and an approximated offset makes
// the bar's thickness breathe along the bend — which reads as the trace
// changing weight, i.e. as a measurement. Straight segments have exact offsets,
// and an instrument that draws in straight runs is not a compromise here: it is
// the register this variant is written in.

const W = 640;
const H = 220;

const Y_MODELS = 40;
const Y_NETWORK = 170;
const Y_MEET = 105;

const X_START = 10;
const X_PIVOT = 140; // the models stop, and the detour drops from here
const X_RETURN = 380; // the models come back
const X_BEND = 470; // both runs start angling toward each other
const X_MEET = 580;
const X_EDGE = 636; // past the frame, on purpose

/** Bar thickness, and the offset of the lit top face. */
const T = 12;
const DX = 11;
const DY = -8;

// Same palette as the machine, and for the same reason: the two figures are one
// object seen twice. Literals rather than tokens — these are SVG fills and half
// of them are alpha variants the token set has no channel for.
const WALL = "rgba(245,244,241,0.05)";
const LID = "rgba(245,244,241,0.13)";
const LINE = "rgba(245,244,241,0.5)";
const ACCENT = "#00dc8d";
const ACCENT_LID = "rgba(0,220,141,0.28)";
const ACCENT_WALL = "rgba(0,220,141,0.1)";

type Pt = [number, number];

const pts = (p: Pt[]) => p.map(([x, y]) => `${x} ${y}`).join(" L ");

/** The wall of a run: the centreline offset by half a thickness, both ways. */
function wall(line: Pt[]): string {
  const upper = line.map(([x, y]) => [x, y - T / 2] as Pt);
  const lower = [...line].reverse().map(([x, y]) => [x, y + T / 2] as Pt);
  return `M ${pts(upper)} L ${pts(lower)} Z`;
}

/** The lit face on top of it: the upper edge, pushed back along the camera. */
function lid(line: Pt[]): string {
  const upper = line.map(([x, y]) => [x, y - T / 2] as Pt);
  const back = [...upper].reverse().map(([x, y]) => [x + DX, y + DY] as Pt);
  return `M ${pts(upper)} L ${pts(back)} Z`;
}

/** The end cap, so a run that stops looks cut rather than faded. */
function cap([x, y]: Pt): string {
  return `M ${x} ${y - T / 2} L ${x + DX} ${y - T / 2 + DY} L ${x + DX} ${y + T / 2 + DY} L ${x} ${y + T / 2} Z`;
}

const MODELS: Pt[] = [
  [X_START, Y_MODELS],
  [X_PIVOT, Y_MODELS],
];
const NETWORK: Pt[] = [
  [X_PIVOT, Y_NETWORK],
  [X_BEND, Y_NETWORK],
  [X_MEET, Y_MEET],
];
const RETURN: Pt[] = [
  [X_RETURN, Y_MODELS],
  [X_BEND, Y_MODELS],
  [X_MEET, Y_MEET],
];
const EXIT: Pt[] = [
  [X_MEET, Y_MEET],
  [X_EDGE, Y_MEET],
];

/** The pivot is vertical, so its offsets run in x and it needs its own pair. */
const PIVOT_WALL = `M ${X_PIVOT - T / 2} ${Y_MODELS} L ${X_PIVOT + T / 2} ${Y_MODELS} L ${X_PIVOT + T / 2} ${Y_NETWORK} L ${X_PIVOT - T / 2} ${Y_NETWORK} Z`;
const PIVOT_LID = `M ${X_PIVOT + T / 2} ${Y_MODELS} L ${X_PIVOT + T / 2 + DX} ${Y_MODELS + DY} L ${X_PIVOT + T / 2 + DX} ${Y_NETWORK + DY} L ${X_PIVOT + T / 2} ${Y_NETWORK} Z`;

function Run({ line, accent = false }: { line: Pt[]; accent?: boolean }) {
  return (
    <g stroke={accent ? ACCENT : LINE} strokeWidth="1">
      <path d={wall(line)} fill={accent ? ACCENT_WALL : WALL} />
      <path d={lid(line)} fill={accent ? ACCENT_LID : LID} />
      <path d={cap(line[line.length - 1])} fill={accent ? ACCENT_WALL : WALL} />
    </g>
  );
}

export default function ConvergenceSolid() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" fill="none" aria-hidden="true">
      {/* the models: set out, stop */}
      <Run line={MODELS} />

      {/* the pivot — the obstacle becoming the project */}
      <g stroke={LINE} strokeWidth="1">
        <path d={PIVOT_WALL} fill={WALL} />
        <path d={PIVOT_LID} fill={LID} />
      </g>

      {/* the network, unbroken from the pivot on */}
      <Run line={NETWORK} />

      {/* the years the models did not exist, marked rather than left blank */}
      <path
        d={`M ${(X_PIVOT + X_RETURN) / 2} ${Y_MODELS - 22} V ${Y_MODELS + 22}`}
        stroke="rgba(245,244,241,0.22)"
        strokeWidth="1"
      />

      {/* the models, returning */}
      <Run line={RETURN} />

      {/* and out of the frame — the only lit run in the drawing */}
      <Run line={EXIT} accent />
      <circle cx={X_MEET} cy={Y_MEET} r="4.5" fill={ACCENT} stroke="none" />
    </svg>
  );
}
