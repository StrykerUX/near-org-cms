"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { FAQS } from "@/components/sections/quantum/quantumContent";

// Quantum security FAQ. One panel open at a time.
//
// The open/close is `grid-template-rows: 0fr → 1fr` in CSS, not GSAP animating
// `height` to `scrollHeight` and then setting `auto` on complete like the
// original does. Same reason the homepage rebuild made the swap: the measured
// version has to re-measure on every reflow (font swap, viewport change, a link
// wrapping) and gets it wrong in between, while the grid version has no
// measurement to get wrong. It also means no JS at all beyond the toggle, so
// this component needs no motion context.

export default function QuantumFaq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="bg-cream text-foreground">
      <Container className="grid gap-12 pb-18 pt-40 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-24">
        {/* No eyebrow above this heading, unlike the other sections: the
            reference has one and it reads "FAQ", directly above a heading that
            already ends in "FAQ". */}
        <h2 className="text-h2 text-pretty">
          Quantum security
          <br />
          <Accent>FAQ</Accent>
        </h2>

        <div className="flex flex-col">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            const panelId = `faq-panel-${i}`;
            const buttonId = `faq-button-${i}`;
            return (
              <div key={item.q} className="border-b border-dotted border-rule">
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="group/faq grid w-full grid-cols-[1fr_auto] items-center gap-10 py-7 text-left"
                >
                  <span className="text-h4">{item.q}</span>
                  <span
                    aria-hidden="true"
                    className="flex size-8 shrink-0 items-center justify-center rounded-full border border-rule text-ink-soft transition-colors group-hover/faq:border-foreground group-hover/faq:text-foreground"
                  >
                    {/* Rotating the whole badge and not just the glyph would
                        also rotate the ring, which is a circle — no visible
                        change, and the transform would fight the hover colour
                        transition for the same compositing layer. */}
                    <Plus
                      className={`size-4 transition-transform duration-300 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                      strokeWidth={1.5}
                    />
                  </span>
                </button>

                {/* The 0fr → 1fr grid row is the whole mechanism. The inner
                    element MUST carry overflow-hidden and min-h-0: without them
                    the content refuses to be squeezed below its own height and
                    the row never collapses. */}
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`grid transition-[grid-template-rows] duration-[450ms] ease-in-out motion-reduce:transition-none ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <p className="max-w-[60ch] pb-7 text-body text-ink-soft text-pretty">
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
