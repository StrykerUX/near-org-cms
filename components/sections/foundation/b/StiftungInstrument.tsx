import Figure from "@/components/primitives/Figure";
import Clause from "@/components/sections/foundation/b/Clause";
import {
  TRANSPARENCY,
  STIFTUNG_FACTS,
} from "@/components/sections/foundation/foundationContent";

// §4 — the densest point of the document, and the one it is built around.
//
// The four legal facts are the page's only actual DATA, so they are filed where
// this variant files data: in the rail, term over value, running down the
// margin beside the prose that explains them. They were drafted as a ruled
// table inside the argument column, which read well on its own and was the
// wrong call twice over — it left the margin of the densest block on the page
// empty, and it made the section state the same four facts in the same column
// as the paragraph that already explains them, one under the other.
//
// Beside each other they do different jobs: the paragraph says what a Stiftung
// costs you, the margin says what it IS. The kicker then closes the wide column
// at heading scale.
//
// The order is the argument. "Transparency is not a value we chose. It is a
// condition of how we are built" is a claim about STRUCTURE, so it has to
// arrive after the reader has passed the jurisdiction, the legal form, the
// binding and the oversight — set at the top it is a slogan, set at the foot it
// is a conclusion drawn from the record running alongside it.
//
// ── The figure, and why this sentence gets one ─────────────────────────────
// "Funds given to it cannot be removed for any reason except the fulfillment of
// that purpose" is the most drawable claim on the page and until now a
// paragraph carried it alone. It is a shape before it is a sentence: an open
// vessel, and a floor with exactly one opening in it. The drawing does not
// illustrate the paragraph, it states the same thing faster, which is the only
// reason a figure is allowed here.
//
// It sits in the LAST five columns of the argument, not under the prose and not
// centred: the rail is already down the left, so a figure hung off the right
// edge puts register on both margins of the page's densest block and leaves the
// kicker the full measure underneath. A figure that lands at the same width and
// on the same axis as the paragraph above it changes nothing about the rhythm,
// which is the whole reason to have one.

// ── Geometry ──────────────────────────────────────────────────────────────
// At module scope so the JSX reads coordinates instead of carrying numbers:
// the aperture and the stroke that leaves through it have to agree, and they
// only agree if there is one number for where it is.
const W = 320;
const H = 160;
const INSET = 8;

/** Where the vessel's floor is, and where its walls turn up from. */
const FLOOR_Y = 124;
const WALL_TOP_Y = 40;

const INFLOWS = 5;
const INFLOW_TOP_Y = 6;
const SPAN = W - INSET * 2;
/** Five sources spread across the mouth, on centres rather than on edges. */
const INFLOW_X = Array.from(
  { length: INFLOWS },
  (_, i) => Math.round(INSET + (SPAN * (i + 0.5)) / INFLOWS)
);

// The fourth and not the middle one: an opening on the axis of symmetry reads
// as the drawing's centre, and this opening is not a centre — it is the one
// exception in a floor that is otherwise closed.
const EXIT_X = INFLOW_X[3];
const EXIT_HALF = 14;
const EXIT_END_Y = 152;

/** An open-topped vessel whose floor is closed except at one opening. */
function StiftungVessel() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1">
        {/* The vessel: down one wall, along the floor to the opening, and up
            the other — drawn as two paths so the opening is an absence and not
            a white rectangle laid over a line. */}
        <path d={`M ${INSET} ${WALL_TOP_Y} V ${FLOOR_Y} H ${EXIT_X - EXIT_HALF}`} />
        <path
          d={`M ${EXIT_X + EXIT_HALF} ${FLOOR_Y} H ${W - INSET} V ${WALL_TOP_Y}`}
        />

        {/* What comes in. Every stroke crosses the open mouth and stops dead on
            the floor; only the one over the opening carries on. */}
        {INFLOW_X.map((x) => (
          <line
            key={x}
            x1={x}
            y1={INFLOW_TOP_Y}
            x2={x}
            y2={x === EXIT_X ? EXIT_END_Y : FLOOR_Y}
          />
        ))}
      </g>

      {INFLOW_X.map((x) => (
        <circle key={x} cx={x} cy={INFLOW_TOP_Y} r="1.8" fill="currentColor" />
      ))}
      <circle cx={EXIT_X} cy={EXIT_END_Y} r="2.4" fill="currentColor" />
    </svg>
  );
}

export default function StiftungInstrument() {
  return (
    <section className="bg-cream">
      <Clause label={TRANSPARENCY.eyebrow} facts={STIFTUNG_FACTS}>
        <h2 data-reveal className="max-w-[20ch] text-h2 text-balance">
          {TRANSPARENCY.headline}
        </h2>

        {/* `slice(0, -1)`: the last entry of `body` IS the kicker, set apart
            below. See the note on MISSION in foundationContent.ts. */}
        {TRANSPARENCY.body.slice(0, -1).map((paragraph) => (
          <p
            key={paragraph}
            data-reveal
            className="mt-8 max-w-[62ch] text-body text-ink-soft text-pretty"
          >
            {paragraph}
          </p>
        ))}

        <div className="mt-16 grid-ds">
          {/* The figure numbers itself because everything else in this variant
              is numbered — clauses, pillars, activities, annex entries. An
              unnumbered exhibit inside an instrument that numbers its own
              paragraphs reads as loose paper, so here the index is register
              rather than cross-reference. */}
          <div data-reveal className="col-span-12 lg:col-span-5 lg:col-start-8">
            <Figure
              index="Fig. 01"
              caption="Five ways in, one way out: what enters can leave only by fulfilling the purpose."
            >
              <StiftungVessel />
            </Figure>
          </div>
        </div>

        <p data-reveal className="mt-16 max-w-[22ch] text-h2 text-ink text-balance">
          {TRANSPARENCY.kicker}
        </p>
      </Clause>
    </section>
  );
}
