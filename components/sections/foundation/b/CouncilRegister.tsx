"use client";

import InstrumentSection from "@/components/sections/shells/instrument/Section";
import Panel from "@/components/sections/shells/instrument/Panel";
import Readout from "@/components/sections/shells/instrument/Readout";
import MediaFrame from "@/components/primitives/MediaFrame";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import {
  COUNCIL,
  COUNCIL_PORTRAITS,
  PLATES,
} from "@/components/sections/foundation/foundationContent";

// §5 — the governing body, filed rather than drawn.
//
// ── Why the one relation on the page is NOT a diagram here ─────────────────
// Two bodies and a loop between them is a drawing that wants to be made, and
// variant C makes it: two terraces with a ramp running each way. Making it
// twice would give the two variants the same picture with different paint,
// and the whole point of three layouts over one copy is that the difference is
// never decoration.
//
// So this variant files it. `empowers` and `reports to` are the two verbs the
// deck itself uses, and here they are readings — the state of the relation,
// stated in the direction it runs, in the band where this shell puts a
// device's live values. It is the same information as C's drawing and a
// different claim about what kind of document you are reading.
//
// ── The portraits, and why four ────────────────────────────────────────────
// A page arguing that its transparency is structural, naming two bodies and
// showing neither, is the contradiction the section itself points at. So the
// faces get a place. What they do not get is invented people: the deck never
// says how many members the Council has, and a roster made up on this page
// would be fabricating the record it claims to keep. Four is the count that
// composes at every width (4 · 2 · 1) and nothing more is being said by it.
//
// The cells carry no `data-reveal`, like every `MediaFrame` in this folder:
// the reveal pre-hides its targets at mount, so a reserved cell inside one is
// a hole the exact size of the missing asset until the stagger reaches it —
// the one failure a placeholder cannot have. See `EcosystemMark`.
//
// The panel is `slate` and not `ink`: reserved cells are drawn with hairlines
// and corner marks, and against #262626 those read as holes rather than as
// frames. Same reason `/quantum-security` has its own dark.
export default function CouncilRegister() {
  const rootRef = useScrollReveal<HTMLDivElement>({ start: "top 80%" });

  const [council, executive] = COUNCIL.bodies;

  return (
    <div ref={rootRef}>
      <InstrumentSection
        eyebrow={COUNCIL.eyebrow}
        title={COUNCIL.headline}
        intro={COUNCIL.body}
      >
        <Panel
          tone="slate"
          label={PLATES.council.label}
          meta={PLATES.council.meta}
          footer={
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <Readout
                value={COUNCIL.relation.out}
                label={`${council.label} → ${executive.label}`}
              />
              <Readout
                value={COUNCIL.relation.back}
                label={`${executive.label} → ${council.label}`}
              />
            </div>
          }
        >
          <div className="grid-ds gap-y-12 px-5 pb-12 pt-16 lg:px-7 lg:pb-16 lg:pt-24">
            <div className="col-span-12 lg:col-span-4">
              {COUNCIL.bodies.map((body) => (
                <div key={body.id} data-reveal className="mt-10 first:mt-0">
                  <div className="h-px w-full bg-white/12" aria-hidden="true" />
                  <h3 className="mt-5 text-h3">{body.label}</h3>
                  <p className="mt-3 max-w-[32ch] text-body-sm text-white/55 text-pretty">
                    {body.role}
                  </p>
                </div>
              ))}
            </div>

            <ul className="col-span-12 grid grid-cols-2 gap-5 sm:grid-cols-4 lg:col-span-7 lg:col-start-6">
              {COUNCIL_PORTRAITS.map((seat) => (
                <li key={seat.id}>
                  <MediaFrame label={seat.label} spec={seat.spec} ratio="3/4" tone="dark" />
                </li>
              ))}
            </ul>
          </div>
        </Panel>
      </InstrumentSection>
    </div>
  );
}
