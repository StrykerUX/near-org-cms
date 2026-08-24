"use client";

import Accent from "@/components/primitives/Accent";
import Figure from "@/components/primitives/Figure";
import InstrumentSection from "@/components/sections/shells/instrument/Section";
import Panel from "@/components/sections/shells/instrument/Panel";
import Readout from "@/components/sections/shells/instrument/Readout";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { MISSION, PLATES } from "@/components/sections/foundation/foundationContent";
import {
  FAR_EDGES,
  LEVEL_Z,
  NEAR_WALLS,
  ORIGIN,
  SETPOINT_Z,
  V,
  VIEW_BOX,
  iso,
  plane,
} from "@/components/sections/foundation/b/apparatus";

// §3 — the thesis, as a reading.
//
// ── Why a gauge and not a shape that shrinks ───────────────────────────────
// "Our goal is to make ourselves smaller" has one obvious illustration —
// something getting smaller — and variant A threw it out for a reason that
// holds here too: a shape that shrinks is a transition, and there is nothing
// to read it against. A gauge fixes exactly that. The level is where the thing
// is, the setpoint is where it says it intends to be, and the distance between
// them is the sentence. Nothing has to move for the claim to land, which also
// keeps the page honest: the copy states an intention, and an animation of the
// level dropping would state that it is already happening.
//
// It is the same vessel as the hero and the Stiftung section, read a third
// way. The instrument does not change; what changes is which of its numbers
// the page is looking at.
//
// ── No magnitudes, on purpose ──────────────────────────────────────────────
// The rail is ticked but unlabelled and neither plane carries a value. The
// deck gives no figure for the treasury, and a drawing that puts a number on
// it would be inventing the one thing this page cannot invent. Ticks give the
// two planes something to be read against; numbers would give them a claim.
//
// The one lit readout of the whole variant is here — `accent` marks what the
// section is arguing, and if every panel lights one up none of them is the
// argument.

/** The rail hangs off the near corner, where nothing else is drawn. */
const RAIL_TICKS = 8;
const TICK_LEN = 9;
const RAIL_MARK = 16;

function railPoint(z: number) {
  const [x, y] = iso(V.w, V.d, z);
  return { x, y };
}

function LevelAndSetpoint() {
  return (
    <svg viewBox={VIEW_BOX} className="w-full" aria-hidden="true">
      <g transform={ORIGIN} fill="none" stroke="currentColor" strokeWidth="1">
        {FAR_EDGES.map((d) => (
          <path key={d} d={d} opacity="0.18" />
        ))}

        {/* What is held. A face rather than a line: a level with no body under
            it is a lid, and this is a quantity. */}
        <polygon points={plane(LEVEL_Z)} fill="currentColor" opacity="0.1" stroke="none" />
        <polygon points={plane(LEVEL_Z)} opacity="0.55" />

        <polygon points={plane(V.h)} opacity="0.32" />
        {NEAR_WALLS.map((d) => (
          <path key={d} d={d} opacity="0.5" />
        ))}

        {/* The rail: eight ticks, no numbers — see the note above. */}
        {Array.from({ length: RAIL_TICKS + 1 }, (_, i) => {
          const p = railPoint((V.h * i) / RAIL_TICKS);
          return (
            <path key={i} d={`M ${p.x} ${p.y} H ${p.x + TICK_LEN}`} opacity="0.25" />
          );
        })}
        <path
          d={`M ${railPoint(0).x} ${railPoint(0).y} V ${railPoint(V.h).y}`}
          opacity="0.25"
        />

        {(() => {
          const p = railPoint(LEVEL_Z);
          return <path d={`M ${p.x} ${p.y} H ${p.x + RAIL_MARK}`} opacity="0.6" />;
        })()}

        <g className="text-near-green-accent">
          {/* The setpoint is a dashed plane and not a solid one: it is where
              the level is meant to go, and a solid plane at that height would
              read as a second quantity already sitting there. */}
          <polygon points={plane(SETPOINT_Z)} strokeDasharray="4 4" opacity="0.9" />
          {(() => {
            const p = railPoint(SETPOINT_Z);
            return <path d={`M ${p.x} ${p.y} H ${p.x + RAIL_MARK}`} />;
          })()}
        </g>
      </g>
    </svg>
  );
}

export default function DevolutionMeter() {
  const rootRef = useScrollReveal<HTMLDivElement>({ start: "top 78%" });

  return (
    <div ref={rootRef}>
      <InstrumentSection
        eyebrow={MISSION.eyebrow}
        title={
          <>
            Our goal is to make ourselves <Accent display>smaller</Accent>
          </>
        }
      >
        <Panel
          label={PLATES.mission.label}
          meta={PLATES.mission.meta}
          footer={
            // The kicker on the case rather than in the column: it is the
            // conclusion the instrument is built to support, and printing it
            // across the foot of the panel puts it where a device prints what
            // it is for.
            <p data-reveal className="max-w-[46ch] text-h4 text-cream text-balance">
              {MISSION.kicker}
            </p>
          }
        >
          <div className="grid-ds items-center gap-y-12 px-5 pb-12 pt-16 lg:px-7 lg:pb-16 lg:pt-24">
            <div className="col-span-12 lg:col-span-5">
              {/* `slice(0, -1)`: the last entry of `body` IS the kicker, set
                  apart below — see the note on MISSION in foundationContent.ts. */}
              {MISSION.body.slice(0, -1).map((paragraph) => (
                <p
                  key={paragraph}
                  data-reveal
                  className="mt-7 max-w-[42ch] text-body text-white/65 first:mt-0 text-pretty"
                >
                  {paragraph}
                </p>
              ))}

              <div data-reveal className="mt-12">
                <Readout
                  value={PLATES.mission.target.value}
                  label={PLATES.mission.target.label}
                  accent
                  size="lg"
                />
              </div>
            </div>

            <div data-reveal className="col-span-12 lg:col-span-6 lg:col-start-7">
              <Figure
                tone="dark"
                index="Fig. 01"
                caption="The level, and the setpoint set beneath it."
                className="mx-auto max-w-[30rem]"
              >
                <LevelAndSetpoint />
              </Figure>
            </div>
          </div>
        </Panel>
      </InstrumentSection>
    </div>
  );
}
