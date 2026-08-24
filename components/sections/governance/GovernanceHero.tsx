import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import Accent from "@/components/primitives/Accent";
import Panel from "@/components/sections/shells/instrument/Panel";
import Readout from "@/components/sections/shells/instrument/Readout";
import { HERO, LAYERS } from "@/components/sections/governance/governanceContent";

// The opening, in the instrument direction: the page states who decides, and
// immediately shows the two bodies as two readings rather than describing them.
//
// The panel goes under the headline and not beside it because the two states —
// `Binding, live` and `Devolving` — are the page's whole argument in four words,
// and putting them in the margin would make them look like metadata.
export default function GovernanceHero() {
  return (
    <section className="bg-ink pb-[12svh] pt-[calc(var(--site-header-block)+10svh)] text-cream">
      <Container>
        <Eyebrow className="text-white/40">{HERO.eyebrow}</Eyebrow>
        <h1 className="mt-8 max-w-[15ch] text-display text-balance">
          The community <Accent display>steers</Accent> the system, not a company
        </h1>
        <p className="mt-10 max-w-[52ch] text-body-lg text-white/60 text-pretty">{HERO.sub}</p>

        <Panel
          label="Who decides"
          meta="Two layers · one temporary"
          className="mt-16 lg:mt-20"
        >
          <div className="grid-ds gap-y-10 p-6 pt-20 lg:p-10 lg:pt-24">
            {LAYERS.map((layer) => (
              <div key={layer.id} className="col-span-12 lg:col-span-5 lg:[&:nth-child(2)]:col-start-8">
                <p className="text-micro-mono text-white/35">{layer.index}</p>
                <div className="mt-4">
                  <Readout
                    value={layer.state}
                    label={layer.label}
                    note={layer.title}
                    accent={layer.id === "onchain"}
                  />
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </Container>
    </section>
  );
}
