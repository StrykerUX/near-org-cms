import Container from "@/components/primitives/Container";
import CtaPill from "@/components/sections/quantum/CtaPill";
import {
  HERO,
  MATURITY,
  FLYWHEEL,
  PRODUCTS,
  CENTER,
} from "@/components/sections/economics/economicsContent";

// §1 of variant B — the account's cover page.
//
// ── Why the index is here and is not new copy ──────────────────────────────
// A ledger opens by telling you what is in it. The four lines on the right are
// the four section eyebrows, read straight out of the content module — so the
// index cannot drift from the page, and nobody had to write a second version of
// the same four labels. If a section is renamed, its entry here renames itself.
//
// This is also the variant's whole thesis in one gesture: B is for the reader
// who wants the account, not the metaphor. It offers the contents before it
// offers the argument.

const INDEX = [MATURITY, FLYWHEEL, PRODUCTS, CENTER].map((s, i) => ({
  index: String(i + 1).padStart(2, "0"),
  label: s.eyebrow,
}));

export default function LedgerHero() {
  return (
    <section className="bg-cream pb-[10svh] pt-[calc(var(--site-header-block)+8svh)]">
      <Container>
        <div className="h-px w-full bg-rule" aria-hidden="true" />
        <p className="mt-4 text-caption-mono uppercase text-gray-intermediate">{HERO.eyebrow}</p>

        <div className="mt-16 grid-ds gap-y-14">
          <div className="col-span-12 lg:col-span-7">
            <h1 className="max-w-[16ch] text-display text-balance">{HERO.headline}</h1>
            <p className="mt-12 max-w-[54ch] text-body-lg text-ink-soft text-pretty">{HERO.sub}</p>

            <div className="mt-12 flex flex-wrap items-center gap-4">
              <CtaPill href={HERO.primary.href} tone="filled" external>
                {HERO.primary.label}
              </CtaPill>
              {/* A fragment, so `CtaPill`'s `<a href>` is the right element —
                  `next/link` would route. */}
              <CtaPill href={HERO.secondary.href} tone="quiet">
                {HERO.secondary.label}
              </CtaPill>
            </div>
          </div>

          {/* The contents. Rules, mono, and nothing else — the register the
              whole variant is set in. */}
          <ol className="col-span-12 self-end lg:col-span-4 lg:col-start-9">
            {INDEX.map((row) => (
              <li key={row.index} className="border-t border-rule py-4 last:border-b">
                <div className="flex items-baseline gap-6">
                  <span className="text-caption-mono text-gray-intermediate">{row.index}</span>
                  <span className="text-body-sm-mono text-ink-soft">{row.label}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
