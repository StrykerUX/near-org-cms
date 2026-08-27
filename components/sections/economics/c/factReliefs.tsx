import type { ReactNode } from "react";

// The four structural facts of /economics, again — with volume and colour.
//
// ── Why a second set and not the hairline glyphs from `../factGlyphs` ─────
// The shared glyphs are the right drawing in the wrong material for this
// variant. They are 1px marks the size of a line of type, made to sit inside a
// column of prose; variant C puts each fact in a CARD with its own art plate,
// and a hairline in the middle of a 320px white plate reads as an accident —
// the plate looks empty and the drawing looks like it lost its paragraph.
//
// So these are the same four claims executing the same four arguments, grown
// into standing blocks: same order, same geometry, same absences. What changes
// is that they are solids catching light, filled with the CTA ramp, at a size
// where the art plate has something in it. That is the one thing the brief asks
// C for that A and B do not need.
//
// **The claims did not change with the material.** Glyph 01 is still eight
// compartments with no gap to find, 02 is still a magnitude and half of it with
// the missing half simply missing, 03 is still four unequal proposals crossing
// a threshold, 04 is still five year marks and a run that does not break at any
// of them. If a redraw had made any of them say something else it would be a
// new claim, and new claims come from the copy module, not from a shape.
//
// ── The extrusion is one vector, everywhere ──────────────────────────────
// Every solid is lifted up-and-right by the same `D`, so every top face is the
// same parallelogram and the whole set is lit from one direction. Four
// drawings with four light directions read as four clip-art pieces.
//
// ── The ramp is the fill, not an accent ──────────────────────────────────
// Top face `--cta-lime`, front `--cta-mint`, side `--cta-deep`, and the outline
// is the deep end so the solids keep an edge on white. Literals and not
// `var(--token)` for the same reason the motion toolkit keeps its own colours:
// these values also have to be readable as flat SVG attributes.
//
// ── No motion of their own ───────────────────────────────────────────────
// They enter with the reveal their section already runs. Four card-sized
// drawings do not justify four ScrollTriggers on a page that already carries a
// shader hero and a full-bleed animated route.

const VB_W = 220;
const VB_H = 72;

const LEFT = 6;
const RIGHT = 204;

/** The one lift vector. Up and to the right, for every solid on this page. */
const D = 8;

const LIME = "#ecfdb0";
const MINT = "#8bf29c";
const DEEP = "#00dc8d";

type SlabProps = {
  x: number;
  y: number;
  w: number;
  h: number;
  /** The unfilled compartment case — outline only, no faces. */
  hollow?: boolean;
};

/**
 * One standing block: front face, top face, right face.
 *
 * Three faces and not a rectangle with a shadow: a shadow is a lighting effect
 * and these have to read as objects with a depth, or "grown to volume" is just
 * "made bigger". The right face is the one that is visible given the lift
 * vector, so it is the only side drawn.
 */
function Slab({ x, y, w, h, hollow = false }: SlabProps) {
  const top = `${x},${y} ${x + w},${y} ${x + w + D},${y - D} ${x + D},${y - D}`;
  const side = `${x + w},${y} ${x + w + D},${y - D} ${x + w + D},${y + h - D} ${x + w},${y + h}`;

  return (
    <g stroke={DEEP} strokeWidth="1" strokeLinejoin="round">
      <rect x={x} y={y} width={w} height={h} fill={hollow ? "none" : MINT} />
      <polygon points={top} fill={hollow ? "none" : LIME} />
      <polygon points={side} fill={hollow ? "none" : DEEP} />
    </g>
  );
}

function Box({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      className="w-full overflow-visible"
      aria-hidden="true"
      fill="none"
    >
      {children}
    </svg>
  );
}

// ── 01 · supply ────────────────────────────────────────────────────────────
// Eight compartments, edge to edge, every one of them a solid. On any other
// network the last few would be outlines and that empty stretch would be the
// tokens still to unlock. The reader goes looking for the gap and the drawing
// does not have one, which is the claim — so nothing is drawn to represent the
// absence.
const CELLS = 8;
const CELL_W = (RIGHT - LEFT) / CELLS;
const SUPPLY_TOP = 30;
const SUPPLY_H = 26;

function SupplyRelief() {
  return (
    <Box>
      {Array.from({ length: CELLS }, (_, i) => (
        <Slab key={i} x={LEFT + i * CELL_W} y={SUPPLY_TOP} w={CELL_W} h={SUPPLY_H} />
      ))}
    </Box>
  );
}

// ── 02 · inflation ─────────────────────────────────────────────────────────
// One magnitude and half of it, and the cut is the tallest stroke in the box
// because the cut is the EVENT: the upper block runs past it, the lower one
// ends against it. No percentage is drawn and no arrow points down — the
// quantity that is missing is missing, which is the only way to say "halved"
// without asking the reader to take a label on trust.
//
// `CUT_X` is derived and never typed as a number: the cut has to be exactly
// half of the span it cuts, and a literal stops being half the first time the
// box changes.
const CUT_X = LEFT + (RIGHT - LEFT) / 2;
const BAR_H = 18;
const BAR_A_Y = 14;
const BAR_B_Y = 46;

function InflationRelief() {
  return (
    <Box>
      <Slab x={LEFT} y={BAR_A_Y} w={RIGHT - LEFT} h={BAR_H} />
      <Slab x={LEFT} y={BAR_B_Y} w={CUT_X - LEFT} h={BAR_H} />
      <line x1={CUT_X} y1={2} x2={CUT_X} y2={70} stroke={DEEP} strokeWidth="1.5" />
    </Box>
  );
}

// ── 03 · governance ────────────────────────────────────────────────────────
// Four proposals of unequal length arrive at one threshold; past it they are a
// single record carrying four settled points. They start from different places
// on purpose — proposals do not queue up from one margin, and four marks of
// equal length would read as a scale. Neither a ballot box nor a gavel: a
// pictogram names the topic and leaves the claim to the paragraph, which is the
// work the drawing was supposed to save.
const GATE_X = 84;
const PROPOSALS = [
  [LEFT, 12],
  [22, 24],
  [12, 36],
  [30, 48],
] as const;
const RECORD_X = 100;
const RECORD_Y = 32;
const RECORD_W = 96;
const BOUND = [116, 140, 164, 188] as const;

function GovernanceRelief() {
  return (
    <Box>
      {PROPOSALS.map(([x, y]) => (
        <line key={y} x1={x} y1={y} x2={GATE_X} y2={y} stroke={DEEP} strokeWidth="1.5" />
      ))}
      <Slab x={GATE_X} y={6} w={8} h={58} />
      <Slab x={RECORD_X} y={RECORD_Y} w={RECORD_W} h={14} />
      {/* Settled points, on the record's top face. A filled dot is this site's
          mark for something that has already happened. */}
      {BOUND.map((x) => (
        <circle
          key={x}
          cx={x + D / 2}
          cy={RECORD_Y - D / 2}
          r="2.6"
          fill={DEEP}
          stroke="none"
        />
      ))}
    </Box>
  );
}

// ── 04 · uptime ────────────────────────────────────────────────────────────
// Five year marks and one run that crosses all of them. The marks exist so that
// the run has somewhere to break, and it does not break at any of them — a
// drawing of continuity needs the places where a discontinuity would have shown
// or it is just a line. The run leaves the box on the right because five years
// is a floor and not a total, which is why the svg keeps `overflow-visible`.
const YEAR_MARKS = [30, 72, 114, 156, 198] as const;
const RUN_Y = 34;
const RUN_H = 14;

function UptimeRelief() {
  return (
    <Box>
      {YEAR_MARKS.map((x) => (
        <line key={x} x1={x} y1={12} x2={x} y2={62} stroke={DEEP} strokeWidth="1" />
      ))}
      <Slab x={LEFT} y={RUN_Y} w={RIGHT - LEFT + 14} h={RUN_H} />
    </Box>
  );
}

/** Keyed by `MATURITY.facts[].id`, so a renamed fact fails to compile. */
const RELIEFS = {
  supply: SupplyRelief,
  inflation: InflationRelief,
  governance: GovernanceRelief,
  uptime: UptimeRelief,
} as const;

export type FactReliefId = keyof typeof RELIEFS;

export type FactReliefProps = {
  id: FactReliefId;
};

export default function FactRelief({ id }: FactReliefProps) {
  const Relief = RELIEFS[id];
  return <Relief />;
}
