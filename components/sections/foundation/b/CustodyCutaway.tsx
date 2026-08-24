"use client";

import Figure from "@/components/primitives/Figure";
import InstrumentSection from "@/components/sections/shells/instrument/Section";
import Panel from "@/components/sections/shells/instrument/Panel";
import Readout from "@/components/sections/shells/instrument/Readout";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import {
  PLATES,
  STIFTUNG_FACTS,
  TRANSPARENCY,
} from "@/components/sections/foundation/foundationContent";
import {
  FAR_EDGES,
  LEVEL_Z,
  NEAR_WALLS,
  ORIGIN,
  V,
  VIEW_BOX_DEEP,
  at,
  face,
  plane,
} from "@/components/sections/foundation/b/apparatus";

// §4 — the vessel, cut open.
//
// ── Why this sentence gets the page's largest drawing ──────────────────────
// "Funds given to it cannot be removed for any reason except the fulfillment
// of that purpose" is the most drawable claim on the page, and a paragraph
// carries it slowly: the reader has to hold four clauses at once to see the
// shape. The shape is simple — a body with a wide mouth and a floor with
// exactly one opening in it. Five strokes come in over the mouth; four stop on
// the floor and only the one standing over the opening carries on through and
// out of the frame. The drawing does not illustrate the paragraph, it states
// the same thing faster, which is the only argument that gets a figure past
// the three-classes rule.
//
// The first version of this drawing, in the editorial variant, was a flat
// 1px vessel seen from the front. Here it has walls, a floor and a level,
// because in this variant the vessel is an OBJECT the page has been reading
// since the hero: closed on the nameplate, gauged under the mission, and open
// here. Same footprint, same height, same point of view — see `apparatus.ts`.
//
// ── The exit is not on the axis ────────────────────────────────────────────
// The fourth inflow of five, not the middle one. An opening on the axis of
// symmetry reads as the centre of the drawing, and this opening is not a
// centre: it is the single exception in a floor that is otherwise closed.
//
// ── The record beside the drawing ──────────────────────────────────────────
// The four legal facts sit in the column next to the figure as readouts, which
// is what an instrument shows: not a re-telling of the paragraph, the same
// four facts stated as state. `Bound to — its stated purpose` is the lit one,
// because it is the fact the drawing is about; the other three are the
// conditions around it.

const INFLOWS = 5;
const INFLOW_TOP_Z = V.h + 52;
/** Where the inflows cross the mouth: on centres along the vessel's mid-line. */
const INFLOW_X = Array.from(
  { length: INFLOWS },
  (_, i) => Math.round((V.w * (i + 0.5)) / INFLOWS)
);
const INFLOW_Y = V.d / 2;

const EXIT_X = INFLOW_X[3];
const EXIT_HALF = 13;
/** How far past the floor the one that leaves keeps going. Off the canvas, on purpose. */
const EXIT_DROP = 74;

const APERTURE = face([
  [EXIT_X - EXIT_HALF, INFLOW_Y - EXIT_HALF, 0],
  [EXIT_X + EXIT_HALF, INFLOW_Y - EXIT_HALF, 0],
  [EXIT_X + EXIT_HALF, INFLOW_Y + EXIT_HALF, 0],
  [EXIT_X - EXIT_HALF, INFLOW_Y + EXIT_HALF, 0],
]);

function Cutaway() {
  return (
    <svg viewBox={VIEW_BOX_DEEP} className="w-full" aria-hidden="true">
      <g transform={ORIGIN} fill="none" stroke="currentColor" strokeWidth="1">
        {FAR_EDGES.map((d) => (
          <path key={d} d={d} opacity="0.18" />
        ))}

        {/* The floor, which is the subject of the sentence: closed everywhere
            it is drawn, and drawn everywhere. */}
        <polygon points={plane(0)} fill="currentColor" opacity="0.05" stroke="none" />
        <polygon points={plane(0)} opacity="0.4" />

        <polygon points={plane(LEVEL_Z)} fill="currentColor" opacity="0.09" stroke="none" />
        <polygon points={plane(LEVEL_Z)} opacity="0.4" />

        <polygon points={plane(V.h)} opacity="0.32" />
        {NEAR_WALLS.map((d) => (
          <path key={d} d={d} opacity="0.5" />
        ))}

        {/* What comes in. Each stroke crosses the open mouth and stops dead on
            the floor; the one over the opening is the only one that does not. */}
        {INFLOW_X.map((x) => (
          <path
            key={x}
            d={`M ${at(x, INFLOW_Y, INFLOW_TOP_Z)} L ${at(x, INFLOW_Y, 0)}`}
            opacity={x === EXIT_X ? "0.75" : "0.55"}
          />
        ))}
        {INFLOW_X.map((x) => {
          const [cx, cy] = at(x, INFLOW_Y, INFLOW_TOP_Z).split(",");
          return <circle key={x} cx={cx} cy={cy} r="2" fill="currentColor" stroke="none" />;
        })}

        <g className="text-near-green-accent">
          <polygon points={APERTURE} />
          <path
            d={`M ${at(EXIT_X, INFLOW_Y, 0)} L ${at(EXIT_X, INFLOW_Y, -EXIT_DROP)}`}
          />
        </g>
      </g>
    </svg>
  );
}

export default function CustodyCutaway() {
  const rootRef = useScrollReveal<HTMLDivElement>({ start: "top 78%" });

  return (
    <div ref={rootRef}>
      <InstrumentSection
        eyebrow={TRANSPARENCY.eyebrow}
        title={TRANSPARENCY.headline}
        // `slice(0, -1)`: the last entry of `body` IS the kicker, which the
        // panel prints across its foot. See the note in foundationContent.ts.
        intro={TRANSPARENCY.body.slice(0, -1).join(" ")}
      >
        <Panel
          label={PLATES.stiftung.label}
          meta={PLATES.stiftung.meta}
          footer={
            <p data-reveal className="max-w-[46ch] text-h4 text-cream text-balance">
              {TRANSPARENCY.kicker}
            </p>
          }
        >
          <div className="grid-ds items-center gap-y-12 px-5 pb-12 pt-16 lg:px-7 lg:pb-16 lg:pt-24">
            <div data-reveal className="col-span-12 lg:col-span-7">
              <Figure
                tone="dark"
                index="Fig. 02"
                caption="Five ways in, one way out, and a floor closed elsewhere."
                className="mx-auto max-w-[38rem]"
              >
                <Cutaway />
              </Figure>
            </div>

            <div className="col-span-12 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:col-span-4 lg:col-start-9 lg:grid-cols-1">
              {STIFTUNG_FACTS.map((fact) => (
                <div key={fact.id} data-reveal>
                  <Readout
                    value={fact.value}
                    label={fact.term}
                    accent={fact.id === "purpose"}
                  />
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </InstrumentSection>
    </div>
  );
}
