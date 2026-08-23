import Clause from "@/components/sections/foundation/b/Clause";
import {
  TRANSPARENCY,
  STIFTUNG_FACTS,
} from "@/components/sections/foundation/foundationContent";

// §4 — the densest point of the document, and the one it is built around.
//
// Three registers stacked in one block, smallest to largest: the mono rail, the
// prose, and the schedule of four facts on hairlines. The kicker then comes out
// of that stack at heading scale, on its own line, with nothing beside it.
//
// The order is the argument. "Transparency is not a value we chose. It is a
// condition of how we are built" is a claim about STRUCTURE, so it has to
// arrive after the reader has seen the structure — the jurisdiction, the legal
// form, the binding, the oversight — rather than before it. Set at the top it
// is a slogan; set under the schedule it is a conclusion drawn from the four
// lines above it.
export default function StiftungInstrument() {
  return (
    <section className="bg-cream">
      <Clause label={TRANSPARENCY.eyebrow}>
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

        {/* The schedule. Term and value on one ruled line each, mono on both
            sides: this is the only place on the page where the two columns of a
            record are set at the same weight, because these four entries are
            the page's only actual data. */}
        <dl className="mt-14">
          {STIFTUNG_FACTS.map((fact) => (
            <div
              key={fact.id}
              data-reveal
              className="grid-ds items-baseline gap-y-1 border-t border-rule py-4"
            >
              <dt className="col-span-12 text-micro-mono uppercase text-gray-intermediate lg:col-span-4">
                {fact.term}
              </dt>
              <dd className="col-span-12 text-body-sm-mono text-ink lg:col-span-8">
                {fact.value}
              </dd>
            </div>
          ))}
          <div className="h-px w-full bg-rule" aria-hidden="true" />
        </dl>

        <p data-reveal className="mt-16 max-w-[22ch] text-h2 text-ink text-balance">
          {TRANSPARENCY.kicker}
        </p>
      </Clause>
    </section>
  );
}
