"use client";

import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import MediaFrame from "@/components/primitives/MediaFrame";
import {
  COUNCIL,
  COUNCIL_PORTRAITS,
} from "@/components/sections/foundation/foundationContent";

// §5 — the governing body, as two named blocks and nothing else.
//
// The relation between them is drawn in variant A and filed in variant B. Here
// it is only written, because the section immediately below this one is a
// three-screen figure on black, and a second diagram in the run-up to it would
// spend the reader's attention on the wrong one. The last thing before the
// scene has to be quiet.
//
// The portraits do not break that rule, and it is worth saying why they are the
// one thing allowed in: a reserved frame is evidence, not a gesture. It makes
// no claim, it holds still, and it does the job the section could not do
// otherwise — put the faces of the body being described on the page before the
// page hands everything over. Four of them, in a row, under the two remits and
// against the right of the grid so the block below them keeps its run-up.
//
// They carry no `data-reveal`, unlike everything else in this section: the
// reveal pre-hides its targets at mount, and a frame that exists to declare a
// missing asset must not be missing while it waits its turn in a stagger. The
// rule holds for every `MediaFrame` in this folder — see `EcosystemMark`.
export default function HandoffCouncil() {
  const rootRef = useScrollReveal<HTMLElement>({ start: "top 80%" });

  return (
    <section ref={rootRef} className="bg-cream pb-[16svh] pt-[6svh]">
      <Container>
        <div className="grid-ds gap-y-10">
          <div data-reveal className="col-span-12">
            <Eyebrow className="text-gray-intermediate">{COUNCIL.eyebrow}</Eyebrow>
          </div>

          <h2 data-reveal className="col-span-12 max-w-[16ch] text-h2 lg:col-span-5 text-balance">
            {COUNCIL.headline}
          </h2>

          <p
            data-reveal
            className="col-span-12 max-w-[56ch] text-body text-ink-soft lg:col-span-6 lg:col-start-7 text-pretty"
          >
            {COUNCIL.body}
          </p>
        </div>

        <div className="mt-16 grid-ds gap-y-10">
          {COUNCIL.bodies.map((body, i) => (
            <div
              key={body.id}
              data-reveal
              className={`col-span-12 lg:col-span-5 ${i === 0 ? "" : "lg:col-start-7"}`}
            >
              <div className="h-px w-full bg-rule" aria-hidden="true" />
              <h3 className="mt-5 text-h3">{body.label}</h3>
              <p className="mt-3 max-w-[34ch] text-body-sm text-gray-intermediate text-pretty">
                {body.role}
              </p>
            </div>
          ))}
        </div>

        <ul className="mt-[12svh] grid-ds gap-y-8">
          {COUNCIL_PORTRAITS.map((seat, i) => (
            <li
              key={seat.id}
              className={`col-span-6 sm:col-span-3 lg:col-span-2 ${
                i === 0 ? "lg:col-start-5" : ""
              }`}
            >
              <MediaFrame label={seat.label} spec={seat.spec} ratio="3/4" />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
