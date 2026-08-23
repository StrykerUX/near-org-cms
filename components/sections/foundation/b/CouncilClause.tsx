import Clause from "@/components/sections/foundation/b/Clause";
import { COUNCIL } from "@/components/sections/foundation/foundationContent";

// §5 — the governing body, filed as two entries.
//
// Variant A draws this relation as a closed loop, because that page is made of
// strokes. Here it is written down, which is what a constitution actually is:
// not a diagram of who reports to whom, but two named bodies whose powers are
// on the record.
//
// So the record goes in the margin — the two names in the order of authority,
// with the verb that runs between them on the segment that separates them —
// and the wide column carries the prose and each body's remit. Neither half
// repeats the other: the rail names the two bodies and the direction, the
// argument column says what each one does.
//
// The verbs come from `COUNCIL.relation` rather than being written here, and
// the short vertical rule beside each one is the page's own 1px stroke doing
// the work an arrowhead would do in a diagram — the rail is register, and a
// glyph arrow in it would be the one drawn thing in a document that has none.
export default function CouncilClause() {
  return (
    <section className="bg-cream">
      <Clause
        label={COUNCIL.eyebrow}
        rail={
          <ol className="flex flex-col">
            <li className="text-caption-mono text-ink">{COUNCIL.bodies[0].label}</li>
            <li className="flex items-center gap-3 py-3">
              <span className="h-6 w-px bg-rule" aria-hidden="true" />
              <span className="text-micro-mono uppercase text-gray-intermediate">
                {COUNCIL.relation.out}
              </span>
            </li>
            <li className="text-caption-mono text-ink">{COUNCIL.bodies[1].label}</li>
            <li className="flex items-center gap-3 pt-3">
              <span className="h-6 w-px bg-rule" aria-hidden="true" />
              <span className="text-micro-mono uppercase text-gray-intermediate">
                {COUNCIL.relation.back}
              </span>
            </li>
          </ol>
        }
      >
        <h2 data-reveal className="max-w-[18ch] text-h2 text-balance">
          {COUNCIL.headline}
        </h2>

        <p data-reveal className="mt-8 max-w-[62ch] text-body text-ink-soft text-pretty">
          {COUNCIL.body}
        </p>

        <div className="mt-14">
          {COUNCIL.bodies.map((body) => (
            <div
              key={body.id}
              data-reveal
              className="grid-ds items-baseline gap-y-2 border-t border-rule py-6"
            >
              <h3 className="col-span-12 text-h4 lg:col-span-4">{body.label}</h3>
              <p className="col-span-12 max-w-[48ch] text-body-sm text-gray-intermediate lg:col-span-8 text-pretty">
                {body.role}
              </p>
            </div>
          ))}
          <div className="h-px w-full bg-rule" aria-hidden="true" />
        </div>
      </Clause>
    </section>
  );
}
