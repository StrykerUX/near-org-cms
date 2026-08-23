import MediaFrame from "@/components/primitives/MediaFrame";
import Clause from "@/components/sections/foundation/b/Clause";
import {
  COUNCIL,
  COUNCIL_PORTRAITS,
} from "@/components/sections/foundation/foundationContent";

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

        {/* The portraits, attached to the clause the way a filing attaches its
            photographs: small, in a row, all at one size and one crop, under
            the entries they belong to. That register is the reason they fit
            here at all — a document that names two bodies and shows neither is
            an incomplete filing, and four identical 3/4 frames are the least
            editorial way to show a face.

            Deliberately NOT in the rail. The rail is two columns of mono and a
            frame in it would be an image in the margin of a document, which is
            a different kind of object — a stamp. These are exhibits, and
            exhibits go in the body.

            TWO columns each and not three, and no `data-reveal` on them. Both
            corrections come from the same 400px of empty cream this row put
            between "Executive team" and the next clause:

            · At three columns of the nested grid the cells came out 235 wide
              and 314 tall — the largest frames on the page — and four of them
              in a row is a band whose only ink is sixteen corner ticks. Two
              columns puts them at roughly 150 × 200, which is a filing's
              attached photograph and is what the note above claims they are.
            · `useScrollReveal` pre-hides its targets at mount, so the row sat
              at `autoAlpha: 0` while the clause it belongs to — now over a
              thousand pixels tall — staggered its way down from a trigger at
              its own top. A frame whose job is to declare a missing asset
              cannot itself be missing, so it is painted at rest. Same rule in
              the other two variants. */}
        <ul className="mt-14 grid-ds gap-y-8">
          {COUNCIL_PORTRAITS.map((seat) => (
            <li key={seat.id} className="col-span-6 sm:col-span-3 lg:col-span-2">
              <MediaFrame label={seat.label} spec={seat.spec} ratio="3/4" />
            </li>
          ))}
        </ul>
      </Clause>
    </section>
  );
}
