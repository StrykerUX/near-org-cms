import Clause from "@/components/sections/foundation/b/Clause";
import { PILLARS } from "@/components/sections/foundation/foundationContent";

// §2 — the three pillars, filed as clauses.
//
// The numbering is not a decoration borrowed from legal documents: `index` is
// already in the content module, and the note there states why the three are
// read in order — what the Foundation IS, what it DOES and what it is FOR make
// one sentence. Numbering them says out loud what that note asserts.
//
// The rail carries the number and nothing else. It was drafted with the
// pillar's key in it as well ("NONPROFIT", "GROWTH"), which turned out to be
// the heading repeated in a smaller face two columns to its left. Density in
// this variant is spent where there is something to be dense ABOUT, which is
// the Stiftung block; here it would only be texture.
export default function DossierPillars() {
  return (
    <section className="bg-cream">
      {PILLARS.map((pillar) => (
        <Clause key={pillar.id} clause={pillar.index}>
          <div data-reveal className="grid-ds gap-y-5">
            <h2 className="col-span-12 max-w-[14ch] text-h3 lg:col-span-4 text-pretty">
              {pillar.title}
            </h2>
            <p className="col-span-12 max-w-[58ch] text-body text-ink-soft lg:col-span-7 lg:col-start-6 text-pretty">
              {pillar.body}
            </p>
          </div>
        </Clause>
      ))}
    </section>
  );
}
