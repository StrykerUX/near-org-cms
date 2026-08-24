"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { FAQS } from "@/components/sections/quantum-security-copy/quantumContent";

// ── H3 · §FAQ ──────────────────────────────────────────────────────────────
// Still collapsible, and deliberately so: H2 opens all five, so between the two
// proposals both bets are on the table rather than one being assumed.
//
// Three things change from the current build, and they are the reason this is
// not just the same component again.
//
// **1. The heading moves above the list instead of beside it.** The current
// version puts the heading in a `minmax(0,22rem)` column on the left with the
// questions to its right, which at `lg` leaves the questions on a ~55ch measure
// and the heading column empty from its second line down. Full width, the
// questions get the page and the heading gets the section.
//
// **2. The question is `text-h3`, not `text-h4`.** These are the reader's own
// words ("Is NEAR quantum-safe?") and they are the only thing to aim at in a
// closed list. At `h4` five closed rows read as a table of contents; at `h3`
// they read as five questions.
//
// **3. Dotted rules become plain `gap`.** Same call as this proposal's proof
// list and comparison — the `propuesta-b` temperament separates with space, not
// with lines. It is also what makes the open panel feel like it belongs to its
// question rather than to a row of a table.
//
// The open/close stays `grid-template-rows: 0fr → 1fr`, which is the current
// build's own mechanism and the right one: there is no height to measure, so
// there is nothing to get wrong on a font swap or a reflow. Kept verbatim.
export default function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-cream py-20 lg:py-28">
      <Container className="flex flex-col gap-12">
        {/* No eyebrow, for the reason the current build states: the reference
            has one reading "FAQ" directly above a heading that ends in "FAQ". */}
        <h2 className="text-pretty text-h2">
          Quantum security <Accent>FAQ</Accent>
        </h2>

        <div className="flex flex-col gap-2">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            const panelId = `q-panel-${i}`;
            const buttonId = `q-button-${i}`;
            return (
              <div key={item.q} className="flex flex-col">
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="group/faq grid w-full grid-cols-[1fr_auto] items-start gap-10 py-6 text-left"
                >
                  <span
                    className={`max-w-[30ch] text-pretty text-h3 transition-colors ${
                      isOpen ? "text-foreground" : "text-foreground group-hover/faq:text-ink-soft"
                    }`}
                  >
                    {item.q}
                  </span>
                  <span
                    aria-hidden="true"
                    className="mt-2 flex size-9 shrink-0 items-center justify-center rounded-full border border-rule text-ink-soft transition-colors group-hover/faq:border-foreground group-hover/faq:text-foreground"
                  >
                    {/* Rotating the glyph and not the badge: the badge is a
                        circle, so rotating it changes nothing visible while
                        fighting the hover colour for the same layer. */}
                    <Plus
                      className={`size-4 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                      strokeWidth={1.5}
                    />
                  </span>
                </button>

                {/* The 0fr → 1fr grid row IS the mechanism. The inner element
                    must carry `overflow-hidden` and `min-h-0`, or the content
                    refuses to be squeezed below its own height and the row never
                    collapses. */}
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`grid transition-[grid-template-rows] duration-[450ms] ease-in-out motion-reduce:transition-none ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <p className="max-w-[64ch] pb-8 text-pretty text-body-lg text-ink-soft">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
