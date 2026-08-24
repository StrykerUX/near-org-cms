// The sharding drawing: the same twelve units of work, under one boundary and
// then under four.
//
// ── What the drawing has to beat ───────────────────────────────────────────
// The chapter says it in four lines: "sharding: a technique that partitions
// computation and storage across parallel subsets of the network. By
// distributing work instead of requiring every node to process every
// transaction…". A reader has to assemble that sentence into a picture. This is
// the picture, and it is the only chapter on the page where the prose is doing
// work a drawing does faster.
//
// ── Why the twelve marks do not move ───────────────────────────────────────
// The first sketch redistributed the marks: twelve dots in one lane sliding
// into four. It was wrong, and wrong in a way that mattered — it read as the
// work being divided up and therefore reduced. Sharding does not reduce the
// work. The marks are in the SAME twelve x positions in both bands; the only
// thing that changes between the top and the bottom of the drawing is how many
// boundaries there are. That is the claim, and it is why the connecting ticks
// are perfectly vertical: a slanted connector would say something travelled.
//
// ── Why it does not animate ────────────────────────────────────────────────
// The house rule is that a figure draws itself only when the trace IS the
// claim. Here the claim is a comparison between two states, so an animation
// would have to hold one of them as the resting state — and the resting state
// is what a reader without JavaScript, or with reduced motion, is left with.
// Half of a comparison is not a smaller version of the argument, it is a
// different and false one. The figure enters with whatever reveal its host
// section already runs.

// Geometry at module scope, in one coordinate space, so the bands and the ticks
// cannot drift apart when one of them is adjusted.
const W = 640;
const H = 164;
const PAD = 8;
const INNER = W - PAD * 2; // 624
const WORK = 12;
const SHARDS = 4;

const STEP = INNER / WORK; // 52 — one unit of work
const BAND_H = 44;
const TOP_Y = 0;
const BOT_Y = 120;
const TICK = 16;

// The gap between shards. It has to be visible at 1px stroke and at any render
// width: touching boxes read as one box with dividers in it, which is the
// opposite of four independent subsets.
const GAP = 14;
const SHARD_W = INNER / SHARDS - GAP; // 142

/** x of unit `i`, identical in both bands. Integers — no trig, no rounding. */
const unitX = (i: number) => PAD + (i + 0.5) * STEP;

/** Left edge of shard `k`, centred on the three units it holds. */
const shardX = (k: number) => PAD + (k * INNER) / SHARDS + GAP / 2;

const UNITS = Array.from({ length: WORK }, (_, i) => unitX(i));

export default function ShardingDiagram() {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden="true"
    >
      {/* one boundary, all twelve */}
      <rect x={PAD} y={TOP_Y} width={INNER} height={BAND_H} />
      {UNITS.map((x) => (
        <circle key={`t${x}`} cx={x} cy={TOP_Y + BAND_H / 2} r="1.8" fill="currentColor" stroke="none" />
      ))}

      {/* the correspondence, as two rows of stubs rather than twelve full drops:
          a full comb of verticals between the bands out-weighs the bands
          themselves and the drawing turns into a barcode. */}
      {UNITS.map((x) => (
        <line key={`d${x}`} x1={x} y1={TOP_Y + BAND_H} x2={x} y2={TOP_Y + BAND_H + TICK} />
      ))}
      {UNITS.map((x) => (
        <line key={`u${x}`} x1={x} y1={BOT_Y - TICK} x2={x} y2={BOT_Y} />
      ))}

      {/* four boundaries, three each */}
      {Array.from({ length: SHARDS }, (_, k) => (
        <rect key={k} x={shardX(k)} y={BOT_Y} width={SHARD_W} height={BAND_H} />
      ))}
      {UNITS.map((x) => (
        <circle key={`b${x}`} cx={x} cy={BOT_Y + BAND_H / 2} r="1.8" fill="currentColor" stroke="none" />
      ))}
    </svg>
  );
}
