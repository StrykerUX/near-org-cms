export type ChannelMarkProps = {
  /** Matches `CHANNEL_GROUPS[].id` in the content module. */
  family: "talk" | "build" | "follow";
};

// One 1px mark per FAMILY of channels — three, not eight.
//
// ── Why this is possible now and was not before ────────────────────────────
// Every layout of this page refuses to draw the eight channels a logo, and the
// reason is written out at length in `a/HubChannels`: `lucide-react` ships a
// real mark for two of these eight, a stale one for a third, and nothing for
// the other five, so any row of eight is part real trademark and part
// invention. That is still true and none of this changes it.
//
// What changed is the unit. `c/` is the variant that groups the eight into
// three answers — talk to someone, build and learn, follow along — and a group
// is not a brand. Nobody owns a mark for "talk to someone", so there is nothing
// to counterfeit: the mark can simply BE the behaviour, drawn, the way
// `chain/WhyItMatters`'s glyphs are the claims they sit above rather than
// pictures of them.
//
// ── The filter each of these had to pass ───────────────────────────────────
// The house rule is that a drawing earns its place only if it can carry a
// caption that is not a tautology. These three are inline glyphs and carry no
// visible caption — same as `WhyItMatters` — so the test was applied in
// writing, and the captions they would have had are:
//
//   talk   — "Two people taking turns."
//   build  — "Every step stands on the one before it."
//   follow — "A line that was already running when you arrived."
//
// Anything that came out as "a speech bubble", "a hammer" or "an RSS icon" was
// thrown away, which is what happened to the first three attempts.
//
// ── Fixed size, so the stroke is genuinely 1px ─────────────────────────────
// Unlike the city field, these render at one size in one place, so the box gets
// a fixed height and width in the class and the viewBox scale is 1: a
// `strokeWidth` of 1 is one device pixel, with no `vector-effect` needed. Same
// arrangement as `chain/WhyItMatters`'s glyph boxes.

const W = 96;
const H = 28;

// ── talk ───────────────────────────────────────────────────────────────────
// A transcript: four rules alternating between the two margins, at four
// different lengths. Turn-taking is what a conversation IS when you write it
// down, and the alternating edge does the whole job — no bubbles, no tails.
// [y, x-start, x-end]
const TURNS = [
  [4, 0, 46],
  [11, 40, W],
  [18, 0, 31],
  [25, 58, W],
] as const;

// ── build ──────────────────────────────────────────────────────────────────
// A staircase in one polyline. Four treads, each starting where the last one
// stopped and one riser higher: the shape of something that accumulates. The
// tread and riser are constants so the path and the box cannot drift apart.
const TREAD = W / 4;
const RISER = 6;
const STAIR = Array.from({ length: 4 }, (_, i) => {
  const y = H - 2 - i * RISER;
  const x = i * TREAD;
  return `${i === 0 ? "M" : "L"}${x},${y} L${x + TREAD},${y}${
    i === 3 ? "" : ` L${x + TREAD},${y - RISER}`
  }`;
}).join(" ");

// ── follow ─────────────────────────────────────────────────────────────────
// A line of evenly spaced marks that starts before the box and ends after it.
// The overhang is the entire point: the feed was running before the reader
// showed up and keeps running after. `overflow-visible` on the svg is what lets
// it leave, the same device `WhyItMatters`'s third glyph uses.
const OVERHANG = 10;
const STOP_GAP = W / 6;
const STOPS = Array.from({ length: 7 }, (_, i) => i * STOP_GAP);

function TalkMark() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-7 w-24" aria-hidden="true">
      {TURNS.map(([y, x1, x2]) => (
        <line key={y} x1={x1} y1={y} x2={x2} y2={y} stroke="currentColor" strokeWidth="1" />
      ))}
    </svg>
  );
}

function BuildMark() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-7 w-24" aria-hidden="true">
      <path d={STAIR} fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function FollowMark() {
  const y = H / 2;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-7 w-24 overflow-visible" aria-hidden="true">
      <line
        x1={-OVERHANG}
        y1={y}
        x2={W + OVERHANG}
        y2={y}
        stroke="currentColor"
        strokeWidth="1"
      />
      {STOPS.map((x) => (
        <circle key={x} cx={x} cy={y} r="1.8" fill="currentColor" />
      ))}
    </svg>
  );
}

const MARKS = {
  talk: TalkMark,
  build: BuildMark,
  follow: FollowMark,
} as const;

export default function ChannelMark({ family }: ChannelMarkProps) {
  const Mark = MARKS[family];
  return <Mark />;
}
