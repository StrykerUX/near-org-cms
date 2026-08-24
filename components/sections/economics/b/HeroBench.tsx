import Container from "@/components/primitives/Container";
import CtaPill from "@/components/sections/quantum/CtaPill";
import Panel from "@/components/sections/shells/instrument/Panel";
import { HERO, FLYWHEEL } from "@/components/sections/economics/economicsContent";

// §1 of variant B — the apparatus, declared before it runs.
//
// ── Why the hero is a panel and not a dark section ────────────────────────
// A section with `bg-ink` is a change of ground: the page is the same surface,
// painted. A panel has an edge, and an edge turns what is inside it into an
// object. That is the whole premise of this variant — the economy as a machine
// on a bench — and it has to be true from the first screen, or the panels
// further down read as a device that arrived late.
//
// ── The footer strip is the machine's stage list, not a page index ────────
// An instrument declares its stages before it runs; that is why a rig has a
// legend and a manual has a contents page. The four steps of the flywheel run
// across the bottom of the panel, in order, with the arrows between them — so
// the reader knows this page ends in a loop before a single leg is drawn.
//
// It is `FLYWHEEL.steps` read straight out of the copy module and not four
// strings typed here, so a reordered deck reorders the strip and cannot leave
// the hero promising an order the scene does not deliver.
//
// ── No motion ─────────────────────────────────────────────────────────────
// Server component, deliberately. This variant spends its entire structural
// budget on `LoopBench`, which is sticky, drawn and scrubbed. A hero with its
// own animated field arrives first and spends the reader's attention on the
// wrong section.

export default function HeroBench() {
  return (
    <section className="bg-ink pb-[12svh] pt-[calc(var(--site-header-block)+5svh)] text-cream">
      <Container>
        <Panel
          label={HERO.eyebrow}
          meta="Mainnet since 2020"
          footer={
            <ol
              role="list"
              className="flex flex-wrap items-baseline gap-x-3 gap-y-2 text-micro-mono uppercase text-white/45"
            >
              {FLYWHEEL.steps.map((s, i) => (
                <li key={s.id} className="flex items-baseline gap-3">
                  {i > 0 ? (
                    <span aria-hidden="true" className="text-white/25">
                      →
                    </span>
                  ) : null}
                  <span>
                    <span className="text-white/30">{s.index}</span> {s.short}
                  </span>
                </li>
              ))}
              {/* The strip closes the way the loop does. The arrow points back
                  because the fourth stage is not the end of a list. */}
              <li className="flex items-baseline gap-3 text-near-green-accent">
                <span aria-hidden="true" className="text-white/25">
                  ↩
                </span>
                <span>{FLYWHEEL.restart.label}</span>
              </li>
            </ol>
          }
        >
          <div className="px-5 pb-14 pt-20 lg:px-10 lg:pb-16 lg:pt-28">
            {/* No eyebrow inside: the panel's corner label IS the eyebrow, and
                printing it twice on one screen is the kind of thing a shell
                makes easy and nobody notices until it ships. */}
            <h1 className="max-w-[15ch] text-display text-balance">{HERO.headline}</h1>

            <div className="mt-14 grid-ds gap-y-10">
              <p className="col-span-12 max-w-[52ch] text-body-lg text-white/65 text-pretty lg:col-span-6 lg:col-start-7">
                {HERO.sub}
              </p>
            </div>

            <div className="mt-14 flex flex-wrap items-center gap-4">
              <CtaPill href={HERO.primary.href} tone="solid" external>
                {HERO.primary.label}
              </CtaPill>
              {/* Same-page anchor: `CtaPill` renders an `<a href>`, which is the
                  right element for a fragment. `next/link` would route. */}
              <CtaPill href={HERO.secondary.href} tone="dark">
                {HERO.secondary.label}
              </CtaPill>
            </div>
          </div>
        </Panel>
      </Container>
    </section>
  );
}
