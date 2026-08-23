// The four structural facts of /economics, drawn once.
//
// ── Why a shared module and not four glyphs per variant ────────────────────
// `MATURITY.facts` is the one block of this page that is identical in all three
// layouts — same four claims, same order, same figures — and the whole point of
// the three variants is that comparing them compares LAYOUT. A glyph is not
// layout: "supply is fully unlocked" has one right drawing, and three hand-made
// versions of it would drift apart the first time anyone touched one. So the
// drawings live here and the variants only decide how they are ARRANGED —
// a column under a rule in `a/`, a table cell in `b/`, a tight row in `c/`.
//
// ── What these are, and what they are not ─────────────────────────────────
// Same test as `chain/WhyItMatters.tsx`: each glyph EXECUTES its own claim
// instead of illustrating it. None of them is a pictogram — there is no ballot
// box for governance and no clock for uptime, because a pictogram names the
// topic and then leaves the claim to the paragraph, which is precisely the work
// the drawing was supposed to save.
//
// They read as two pairs, and that is deliberate. 01 and 02 are both supply
// magnitudes, so they share one vocabulary — a closed 1px bar — and differ only
// in what happens inside it: in 01 every compartment is occupied and the bar
// runs to its own end, in 02 a second bar stops dead at the cut. Set side by
// side, the pair states the comparison without a word. 03 and 04 are the other
// pair: a threshold crossed by discrete events, and one continuous run crossed
// by nothing.
//
// ── No motion of their own ────────────────────────────────────────────────
// They are rendered in their final state and enter with whatever reveal the
// host section already runs. A ScrollTrigger per glyph would mean twelve extra
// triggers on a page that already has a sticky scene and a drawn chart, to
// animate four objects the size of a line of type.
//
// ── Geometry is at module scope ───────────────────────────────────────────
// House rule (`loopRing.ts`, `chain/chainDiagram.ts`): numbers that more than
// one mark depends on are named, so nudging the box cannot leave two elements
// disagreeing about where the middle is. Everything here is integer or
// half-integer arithmetic — no trigonometry, so no hydration rounding needed.

import type { ReactNode } from "react";

// One box for all four, so the strokes line up across the row wherever the
// variants set them.
const W = 120;
const H = 44;
const LEFT = 2;
const RIGHT = 118;
const MID = H / 2;

// ── The bar, shared by glyphs 01 and 02 ────────────────────────────────────
// Both are supply magnitudes, so both are drawn as a closed 1px bar between the
// same two terminals. Sharing the vocabulary is what makes the two glyphs read
// as one comparison when the row is scanned — a full bar, then a bar and half a
// bar — instead of as two unrelated drawings that happen to sit next to each
// other. A bar and not a bracket: an open bracket left the middle of the box
// empty, and an empty middle is the wrong reading for a fact about a supply
// that is entirely present.

// ── 01 · supply ────────────────────────────────────────────────────────────
// Eight compartments, each with its token settled in it. The filled dot is this
// site's mark for something that has already happened (`chain/ProofBand`), so
// the claim is executed by there being NO empty compartment to find: on any
// other network the last cells would be blank and that blank stretch would be
// the tokens still to unlock. The reader looks for the gap and the drawing does
// not have one.
const BAND_TOP = 14;
const BAND_BOT = 30;
const CELLS = 8;
const CELL_W = (RIGHT - LEFT) / CELLS;

// ── 02 · inflation ─────────────────────────────────────────────────────────
// Two bars and one vertical, and the vertical is doing three jobs at once: it
// is the cut, it is the right-hand end of the lower bar, and it runs past both
// so it reads as an event rather than as an edge. The lower bar simply is not
// there after it.
//
// `CUT_X` is derived and not typed as 60 — the cut has to be exactly half of
// the span it cuts, and a literal stops being half the first time the box
// changes.
const CUT_X = LEFT + (RIGHT - LEFT) / 2;
const BAR_A_TOP = 6;
const BAR_A_BOT = 18;
const BAR_B_TOP = 26;
const BAR_B_BOT = 38;
const CUT_TOP = 2;
const CUT_BOT = 42;

// ── 03 · governance ────────────────────────────────────────────────────────
// Four proposals of unequal length arriving at one threshold, and past it one
// record carrying four points. The starts are unequal on purpose: proposals do
// not arrive from the same place, and four marks of identical length would read
// as a scale.
const GATE_X = 48;
const GATE_TOP = 4;
const GATE_BOT = 40;
const PROPOSALS = [
  [LEFT, 8],
  [12, 17],
  [6, 27],
  [16, 36],
] as const;
const BOUND = [64, 80, 96, 112] as const;
const RECORD_END = BOUND[BOUND.length - 1];

// ── 04 · uptime ────────────────────────────────────────────────────────────
// Five year marks and one stroke that crosses all of them. The marks are where
// a break WOULD show — that is their only job — and the run overshoots the box
// because five years is a floor and not a total.
const RUN_START = 4;
const RUN_END = W + 4;
const YEAR_MARKS = [26, 48, 70, 92, 114] as const;
const YEAR_TOP = 8;
const YEAR_BOT = 36;
const LAUNCH_TOP = 12;
const LAUNCH_BOT = 32;

const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1,
} as const;

function Box({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-11 w-30 overflow-visible"
      aria-hidden="true"
      {...STROKE}
    >
      {children}
    </svg>
  );
}

/**
 * 01 — the whole span is accounted for.
 *
 * Total supply on top, circulating supply beneath it, and the closing terminal
 * belongs to both. On any other network the lower measure would stop short and
 * the gap after it would be the tokens still to unlock; here the subdivisions
 * run into the closing terminal and there is no gap to point at. The absence is
 * the content, so nothing is drawn to represent it.
 */
function SupplyGlyph() {
  return (
    <Box>
      <rect x={LEFT} y={BAND_TOP} width={RIGHT - LEFT} height={BAND_BOT - BAND_TOP} />
      {Array.from({ length: CELLS }, (_, i) => {
        const x = LEFT + i * CELL_W;
        return (
          <g key={i}>
            {i > 0 ? <line x1={x} y1={BAND_TOP} x2={x} y2={BAND_BOT} /> : null}
            <circle
              cx={x + CELL_W / 2}
              cy={(BAND_TOP + BAND_BOT) / 2}
              r="1.8"
              fill="currentColor"
              stroke="none"
            />
          </g>
        );
      })}
    </Box>
  );
}

/**
 * 02 — one magnitude, and half of it.
 *
 * The same two rows as 01, and the cut is the tallest stroke in the box because
 * the cut is the event: the upper measure carries on past it, the lower one
 * ends against it. No percentage is drawn and no arrow points down — the
 * quantity that is missing is missing, which is the only way to say "halved"
 * without asking the reader to trust a label.
 */
function InflationGlyph() {
  return (
    <Box>
      <rect x={LEFT} y={BAR_A_TOP} width={RIGHT - LEFT} height={BAR_A_BOT - BAR_A_TOP} />
      <rect x={LEFT} y={BAR_B_TOP} width={CUT_X - LEFT} height={BAR_B_BOT - BAR_B_TOP} />
      <line x1={CUT_X} y1={CUT_TOP} x2={CUT_X} y2={CUT_BOT} />
    </Box>
  );
}

/**
 * 03 — proposal becomes binding.
 *
 * Four loose marks of unequal length converge on one threshold; past it they
 * are a single line carrying four filled points. The filled dot is this site's
 * mark for something settled (`chain/ProofBand`), so the crossing is what
 * changes their status, which is exactly what "onchain and binding" means.
 * The record stops at its most recent point rather than running to the edge:
 * governance is a sequence of discrete decisions, and the last one has a date.
 */
function GovernanceGlyph() {
  return (
    <Box>
      {PROPOSALS.map(([x, y]) => (
        <line key={y} x1={x} y1={y} x2={GATE_X} y2={y} />
      ))}
      <line x1={GATE_X} y1={GATE_TOP} x2={GATE_X} y2={GATE_BOT} />
      <line x1={GATE_X} y1={MID} x2={RECORD_END} y2={MID} />
      {BOUND.map((x) => (
        <circle key={x} cx={x} cy={MID} r="1.8" fill="currentColor" stroke="none" />
      ))}
    </Box>
  );
}

/**
 * 04 — five years, and nothing across them.
 *
 * The five verticals exist so that the horizontal has somewhere to break, and
 * it does not break at any of them. A drawing of continuity needs the places
 * where a discontinuity would have been visible, or it is just a line. It
 * leaves the box on the right because the run has not ended.
 */
function UptimeGlyph() {
  return (
    <Box>
      <line x1={RUN_START} y1={LAUNCH_TOP} x2={RUN_START} y2={LAUNCH_BOT} />
      {YEAR_MARKS.map((x) => (
        <line key={x} x1={x} y1={YEAR_TOP} x2={x} y2={YEAR_BOT} />
      ))}
      <line x1={RUN_START} y1={MID} x2={RUN_END} y2={MID} />
    </Box>
  );
}

/** Keyed by `MATURITY.facts[].id`, so a renamed fact fails to compile. */
const GLYPHS = {
  supply: SupplyGlyph,
  inflation: InflationGlyph,
  governance: GovernanceGlyph,
  uptime: UptimeGlyph,
} as const;

export type FactGlyphId = keyof typeof GLYPHS;

export type FactGlyphProps = {
  id: FactGlyphId;
};

export default function FactGlyph({ id }: FactGlyphProps) {
  const Glyph = GLYPHS[id];
  return <Glyph />;
}
