"use client";

import Panel from "@/components/sections/shells/instrument/Panel";
import Readout from "@/components/sections/shells/instrument/Readout";
import InstrumentSection from "@/components/sections/shells/instrument/Section";
import NetField from "@/components/sections/community/b/NetField";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import {
  INSTRUMENT,
  STATS,
  STATS_NOTE,
} from "@/components/sections/community/communityContent";

export type NetStateProps = {
  /** The calendar's cities, deduplicated in feed order. Derived by the view. */
  cities: readonly string[];
};

// §2 of the instrument — the apparatus, and the reason this variant exists.
//
// ── One object instead of two blocks ──────────────────────────────────────
// A has a row of four figures and, under it, a drawing of the calendar's
// cities. They are the same argument delivered twice: the numbers claim reach
// and the drawing shows it. Editorially that is fine — a row and a plate, one
// after the other.
//
// Here they are one thing. The field is the display and the four figures are
// the readings beside it, inside a single bordered panel, which is what turns
// "70+ countries" from a number you are asked to believe into a number with a
// picture standing next to it. That merge IS the instrument treatment; without
// it this page is A painted black.
//
// ── Exactly one reading is lit ────────────────────────────────────────────
// `accent` goes on Countries and on nothing else, because Countries is the one
// figure the drawing to its left can corroborate. Four accents would be four
// arguments, which is none. (The shell says this too; it is repeated here
// because this is the section where getting it wrong is tempting.)
//
// ── Nothing counts up, and the panel says why ─────────────────────────────
// A dark panel with figures in it looks like a dashboard, and the reflex is to
// animate the numbers rising. These four are placeholders, and even the real
// ones will be a quarterly count — a number ticking up in front of the reader
// asserts a live feed that does not exist. So the panel prints "Declared
// figures · not telemetry" in the corner where an instrument prints its status,
// the entrance is a plain reveal, and `STATS_NOTE` sits in the footer saying
// how the count was taken. Same refusal, at length, in `chain/ProofBand`.
export default function NetState({ cities }: NetStateProps) {
  // The ref goes on a div inside the shell and not on the shell itself:
  // `InstrumentSection` is a plain function component that renders its own
  // `<section>`, and forwarding a ref through it would mean widening a shared
  // shell's props for one caller. The scope only has to CONTAIN the targets.
  const rootRef = useScrollReveal<HTMLDivElement>();

  return (
    <InstrumentSection>
      <div ref={rootRef}>
        <Panel
          label={INSTRUMENT.state.label}
          meta={INSTRUMENT.state.meta}
          grid
          footer={
            <p className="max-w-[80ch] text-micro-mono uppercase text-white/40 text-pretty">
              {STATS_NOTE}
            </p>
          }
        >
          <div className="grid-ds items-center gap-y-14 px-5 pb-12 pt-20 lg:px-9 lg:pb-16 lg:pt-24">
            <div data-reveal className="col-span-12 lg:col-span-7">
              <NetField cities={cities} />
            </div>

            {/* Two by two and not a column of four: a single column of readings
              next to a wide drawing leaves a tall empty gutter between them, and
              the panel's whole job is to look like a resolved object. */}
            <div className="col-span-12 grid grid-cols-2 gap-x-8 gap-y-12 lg:col-span-4 lg:col-start-9">
              {STATS.map((s) => (
                <div key={s.id} data-reveal>
                  <Readout
                    value={s.value}
                    label={s.label}
                    accent={s.id === "countries"}
                  />
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>
    </InstrumentSection>
  );
}
