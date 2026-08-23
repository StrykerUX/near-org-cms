"use client";

import Container from "@/components/primitives/Container";
import CtaPill from "@/components/sections/quantum/CtaPill";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { CENTER } from "@/components/sections/economics/economicsContent";

// §5 of variant B — the balance: one asset, three jobs, and out.
//
// Back on cream, and deliberately the quietest section of the variant: no
// figure, no rail, no chart. B has already made every argument it is going to
// make in the register of a record, and a book of record closes by totalling,
// not by raising its voice.
//
// The three roles stay in the table shape the rest of the page has used — role,
// definition, consequence, in the same three positions — so the reader can run
// the same eye down them that they ran down the four facts and the four
// entries. That repetition is the variant.

export default function LedgerClose() {
  const rootRef = useScrollReveal<HTMLElement>();

  return (
    <section ref={rootRef} className="bg-cream py-[14svh]">
      <Container>
        <div data-reveal className="grid-ds gap-y-8">
          <p className="col-span-12 text-caption-mono uppercase text-gray-intermediate">
            {CENTER.eyebrow}
          </p>
          <h2 className="col-span-12 max-w-[16ch] text-h1 text-pretty lg:col-span-5">
            {CENTER.headline}
          </h2>
          <p className="col-span-12 max-w-[48ch] text-body text-ink-soft text-pretty lg:col-span-6 lg:col-start-7">
            {CENTER.intro}
          </p>
        </div>

        <div className="mt-20">
          {CENTER.roles.map((r) => (
            <div key={r.id} data-reveal>
              <div className="h-px w-full bg-rule" aria-hidden="true" />
              <div className="grid-ds gap-y-5 pb-10 pt-7">
                <p className="col-span-2 text-caption-mono text-gray-intermediate lg:col-span-1">
                  {r.index}
                </p>
                <h3 className="col-span-10 max-w-[16ch] text-h4 text-pretty lg:col-span-3">
                  {r.role}
                </h3>
                <p className="col-span-12 max-w-[46ch] text-body-sm text-ink-soft text-pretty lg:col-span-4">
                  {r.body}
                </p>
                {/* The consequence, in the same column for all three: it is the
                    half of each role that argues, and stacking the three of
                    them in one column is what makes "each reinforces the
                    others" visible instead of asserted. */}
                <p className="col-span-12 max-w-[36ch] text-body-sm-mono text-green-ink text-pretty lg:col-span-4">
                  {r.reinforces}
                </p>
              </div>
            </div>
          ))}
          <div className="h-px w-full bg-rule" aria-hidden="true" />
        </div>

        <div className="mt-20 grid-ds gap-y-12">
          <p
            data-reveal
            className="col-span-12 max-w-[56ch] text-body text-ink-soft text-pretty lg:col-span-5"
          >
            {CENTER.body}
          </p>
          <div data-reveal className="col-span-12 lg:col-span-6 lg:col-start-7">
            <p className="max-w-[26ch] text-h2-serif italic text-pretty">{CENTER.forward}</p>
            <CtaPill href={CENTER.cta.href} tone="filled" external className="mt-10">
              {CENTER.cta.label}
            </CtaPill>
          </div>
        </div>
      </Container>
    </section>
  );
}
