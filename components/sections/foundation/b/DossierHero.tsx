import Accent from "@/components/primitives/Accent";
import Clause from "@/components/sections/foundation/b/Clause";
import {
  HERO,
  STIFTUNG_FACTS,
} from "@/components/sections/foundation/foundationContent";

// §1 of variant B — the letterhead.
//
// The rail opens with two of the four legal facts rather than all four. That is
// a real documentary convention and not a shortcut: a letterhead states who is
// filing and under what law, and the FULL record appears once, in the Stiftung
// section, as the ruled table. Two facts here and four there is the same
// distinction a document makes between its heading and its schedule; putting
// all four in both places would be the same list twice on one page.
//
// The rule above the headline is the first ruling of the document. Every block
// below repeats it at exactly the same measure — see `Clause`.
export default function DossierHero() {
  return (
    <section className="bg-cream pt-[calc(var(--site-header-block)+8svh)]">
      <Clause label={HERO.eyebrow} facts={STIFTUNG_FACTS.slice(0, 2)}>
        <h1 data-reveal className="max-w-[18ch] text-h1 text-balance">
          Enabling community-driven innovation to{" "}
          <Accent display>benefit people</Accent> around the world
        </h1>

        <p data-reveal className="mt-10 max-w-[62ch] text-body-lg text-ink-soft text-pretty">
          {HERO.sub}
        </p>
      </Clause>
    </section>
  );
}
