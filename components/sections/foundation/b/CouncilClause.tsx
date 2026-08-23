import Clause from "@/components/sections/foundation/b/Clause";
import { COUNCIL } from "@/components/sections/foundation/foundationContent";

// §5 — the governing body, filed as two entries.
//
// Variant A draws this relation as a closed loop, because that page is made of
// strokes. Here it is two ruled entries with their remits set beside them and
// the circulation stated in the words themselves — which is what a constitution
// actually is: not a diagram of who reports to whom, but two named bodies whose
// powers are written down. A drawing in this variant would be the one
// illustration in a document that has none, and it would be doing a job the
// entries already do.
export default function CouncilClause() {
  return (
    <section className="bg-cream">
      <Clause label={COUNCIL.eyebrow}>
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
