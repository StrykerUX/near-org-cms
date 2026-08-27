import { HILL, KNOLL, levels, ring, ringPoints } from "@/components/sections/foundation/c/terrain";

// The three pillar drawings, in the page's own language: level curves.
//
// ── Why these three are allowed to exist ───────────────────────────────────
// An icon per pillar is the textbook forbidden graphic, and variant A threw
// exactly that out. The test a drawing has to pass is whether it EXECUTES the
// claim instead of picturing it, and on a contour map these three do, because
// the map has a grammar for each of them:
//
//   01  a closed DEPRESSION — the one landform whose contents cannot leave it.
//       The inward ticks are what tell a basin from a summit on a real map, so
//       they are the drawing, not its ornament. "Legally bound to its purpose."
//   02  a broad shelf shedding into the small rises around it. What the shelf
//       gives up is what those rises are made of, which is the difference
//       between supporting builders and competing with them.
//   03  the same ground with no dominant rise on it: many equal knolls inside
//       the dashed outline of the single one that used to be there.
//
// None of the three would survive being redrawn as a symbol — the claim only
// holds while they are readings of the same terrain the page opened on.
//
// ── The CTA ramp is a fill here, not an accent ─────────────────────────────
// This is the variant where colour does work. What is filled is always the
// same thing: ground that belongs to someone else by the end of the drawing.

const W = 220;
const H = 164;
const CX = W / 2;
const CY = H / 2;

/** The ramp, as ground rather than as a highlight. Literals because SVG
 *  gradients take colours, not custom-property declarations. */
function Ramp({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="1" x2="1" y2="0">
        <stop offset="0%" stopColor="#ecfdb0" />
        <stop offset="55%" stopColor="#8bf29c" />
        <stop offset="100%" stopColor="#00dc8d" />
      </linearGradient>
    </defs>
  );
}

const FIELD = "w-full max-w-[15rem]";

/** 01 — a closed depression: everything that arrives stays. */
export function SealedBasin() {
  const rings = levels(5, 82, 26);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={FIELD} aria-hidden="true">
      <Ramp id="basin-ramp" />
      <path d={ring(HILL, CX, CY, rings[rings.length - 1])} fill="url(#basin-ramp)" opacity="0.75" />
      {rings.map((r, i) => (
        <path
          key={r}
          d={ring(HILL, CX, CY, r)}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity={i === 0 ? 0.75 : 0.4}
        />
      ))}
      {ringPoints(HILL, CX, CY, rings[0]).map((p) => (
        <path
          key={`${p.x}-${p.y}`}
          d={`M ${p.x} ${p.y} L ${p.x + p.ix * 7} ${p.y + p.iy * 7}`}
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.75"
        />
      ))}
    </svg>
  );
}

/** 02 — a shelf shedding into what is built around it. */
export function SheddingShelf() {
  const shelf = levels(3, 62, 34);
  const knolls = [
    { x: 176, y: 44, r: 22 },
    { x: 190, y: 108, r: 26 },
    { x: 128, y: 142, r: 19 },
  ];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={FIELD} aria-hidden="true">
      <Ramp id="shelf-ramp" />
      <g transform="translate(-34 0)">
        {shelf.map((r, i) => (
          <path
            key={r}
            d={ring(HILL, CX, CY, r)}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            opacity={i === 0 ? 0.7 : 0.4}
          />
        ))}
      </g>

      {/* What runs off the shelf. Drawn to the rim of each rise and stopping
          there: the shelf supplies them, it does not reach inside. */}
      {knolls.map((k) => (
        <path
          key={`run-${k.x}-${k.y}`}
          d={`M ${CX - 34 + 30} ${CY} Q ${(CX - 4 + k.x) / 2} ${(CY + k.y) / 2} ${k.x - k.r * 0.9} ${k.y}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.35"
          strokeDasharray="3 4"
        />
      ))}

      {knolls.map((k) => (
        <g key={`knoll-${k.x}-${k.y}`}>
          <path d={ring(KNOLL, k.x, k.y, k.r * 0.5)} fill="url(#shelf-ramp)" opacity="0.8" />
          <path
            d={ring(KNOLL, k.x, k.y, k.r)}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.5"
          />
        </g>
      ))}
    </svg>
  );
}

/** 03 — the same ground, with nothing standing above the rest of it. */
export function EvenField() {
  const rises = [
    { x: 58, y: 52 },
    { x: 112, y: 38 },
    { x: 166, y: 58 },
    { x: 44, y: 108 },
    { x: 98, y: 100 },
    { x: 152, y: 116 },
    { x: 108, y: 142 },
  ];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={FIELD} aria-hidden="true">
      <Ramp id="field-ramp" />
      {/* Where the single rise was. Dashed and unfilled: the page does not say
          the Foundation disappears, it says it stops being the high ground. */}
      <path
        d={ring(HILL, CX, CY, 92)}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.3"
        strokeDasharray="4 5"
      />

      {rises.map((p, i) => (
        <g key={`${p.x}-${p.y}`}>
          <path d={ring(KNOLL, p.x, p.y, 11)} fill="url(#field-ramp)" opacity={i % 2 ? 0.55 : 0.8} />
          <path
            d={ring(KNOLL, p.x, p.y, 20)}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.5"
          />
        </g>
      ))}
    </svg>
  );
}
