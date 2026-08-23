import Figure from "@/components/primitives/Figure";
import Clause from "@/components/sections/foundation/b/Clause";
import { OPERATIONS } from "@/components/sections/foundation/foundationContent";

// §6 — the mandate, and the second place this variant numbers something.
//
// The numbers restart at 01 here rather than continuing from the pillars, and
// that is deliberate: this section has a head of its own (the rail label plus
// the h2), so the three below it read as its sub-clauses, the way 2.1/2.2/2.3
// do. Continuing the count from the pillars would imply the six items belong to
// one list, and they do not — three are standings, three are duties.
//
// This is also the only numbering on the page that is a genuine mandate: the
// content module says the pillars' order is an argument, but these three are
// what the treasury is actually spent on.
//
// Same rail convention as the pillars: number over key, the key being the
// activity's `id` and not its title.
//
// ── The figure ────────────────────────────────────────────────────────────
// The intro states an allocation — one lever, the treasury, spent on exactly
// three things — and an allocation is a shape. It goes BESIDE the intro rather
// than under it, in the last four columns of the argument, which is a different
// arrangement from the Stiftung figure on purpose: two figures hung the same
// way at the same width would make a template out of two exhibits.
//
// The third leg is the one that carries an argument rather than a count. The
// first two land on a mark — a destination that stays — and the third runs off
// the bottom of the frame with nothing at its end, because "support the
// continuing devolution of functions and operations to the ecosystem itself"
// is the one activity whose output does not come back to the Foundation. It is
// the same move as the third glyph in `chain/WhyItMatters`, and for the same
// reason: a line that stops inside its box is a quantity, a line that leaves it
// is a direction.

// ── Geometry ──────────────────────────────────────────────────────────────
const W = 320;
const H = 152;
const INSET = 8;

/** The lever: one source, one line, three points where it is drawn from. */
const BAR_Y = 24;
const LEG_X = [96, 198, 300] as const;
/** Where the two legs that terminate come to rest. The third has no rest. */
const LEG_END_Y = 100;

function AllocationFigure() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <line x1={INSET} y1={BAR_Y} x2={LEG_X[2]} y2={BAR_Y} />
        {LEG_X.map((x, i) => (
          <line key={x} x1={x} y1={BAR_Y} x2={x} y2={i === 2 ? H : LEG_END_Y} />
        ))}
      </g>

      {/* The source, and the two destinations that are destinations. */}
      <circle cx={INSET} cy={BAR_Y} r="2.4" fill="currentColor" />
      {LEG_X.slice(0, 2).map((x) => (
        <circle key={x} cx={x} cy={LEG_END_Y} r="1.8" fill="currentColor" />
      ))}
    </svg>
  );
}

export default function OperationsClauses() {
  return (
    <section className="bg-cream">
      <Clause label={OPERATIONS.eyebrow}>
        <div className="grid-ds gap-y-12">
          <div className="col-span-12 lg:col-span-7">
            <h2 data-reveal className="max-w-[18ch] text-h2 text-balance">
              {OPERATIONS.headline}
            </h2>
            <p data-reveal className="mt-8 max-w-[62ch] text-body text-ink-soft text-pretty">
              {OPERATIONS.intro}
            </p>
          </div>

          {/* See the note above on why this figure is numbered. */}
          <div
            data-reveal
            className="col-span-12 self-end lg:col-span-4 lg:col-start-9"
          >
            <Figure
              index="Fig. 02"
              caption="The treasury, split three ways. The third leaves the frame and does not come back."
            >
              <AllocationFigure />
            </Figure>
          </div>
        </div>
      </Clause>

      {OPERATIONS.activities.map((activity) => (
        <Clause key={activity.id} clause={activity.index} label={activity.id}>
          <div data-reveal className="grid-ds gap-y-4">
            <h3 className="col-span-12 max-w-[16ch] text-h3 lg:col-span-4 text-pretty">
              {activity.title}
            </h3>
            <p className="col-span-12 max-w-[58ch] text-body text-ink-soft lg:col-span-7 lg:col-start-6 text-pretty">
              {activity.body}
            </p>
          </div>
        </Clause>
      ))}
    </section>
  );
}
