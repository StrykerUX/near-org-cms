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

        <p data-reveal className="mt-16 max-w-[22ch] text-h2 text-ink text-balance">
          {TRANSPARENCY.kicker}
        </p>
      </Clause>
    </section>
  );
}
