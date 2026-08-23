"use client";

import { useState } from "react";

import Container from "@/components/primitives/Container";
import { FAQ } from "@/components/sections/community/communityContent";

// §7 of the Board — the FAQ, as expandable rows.
//
// ── Why this is not the shared `Accordion` ─────────────────────────────────
// `a/` and `c/` both mount `components/primitives/Accordion`, and this variant
// does not, which is a deviation that needs its reason written down: the
// primitive draws its own rules in `gray-800` and sets its rows on its own
// rhythm. On those two layouts that reads as a self-contained block sitting on
// the page. Here it would be the ONE block whose hairlines are a different
// colour and whose row height is a different measure, on a page that is
// otherwise a single continuous grid of `bg-rule` rows from the hero to the
// close — the reader would see the seam without knowing why.
//
// Forking the primitive into this folder was not the alternative considered;
// two divergent accordions is exactly the failure the sections README documents.
// What is here is a plain disclosure list: eleven lines of state and the page's
// own row, with no ambition to be reusable. If a third variant ever needs the
// same thing, the fix is a `tone` prop on the primitive.
//
// `+`/`−` and not a chevron: the rest of the page has exactly one glyph family
// (the arrows), and a rotating chevron would be a second piece of iconography
// doing a job that two typographic characters do at any size.
export default function BoardFaq() {
  const [openId, setOpenId] = useState<string>(FAQ.items[0].id);

  return (
    <section className="bg-cream pb-[10svh] pt-[10svh]">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <div>
            <p className="text-eyebrow-mono uppercase text-gray-intermediate">{FAQ.eyebrow}</p>
            <h2 className="mt-4 max-w-[18ch] text-h2 text-pretty">{FAQ.headline}</h2>
          </div>
        </div>

        <div className="mt-12 border-t border-rule">
          {FAQ.items.map((item) => {
            const isOpen = item.id === openId;
            return (
              <div key={item.id} className="border-b border-rule">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? "" : item.id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-${item.id}`}
                    className="flex w-full items-baseline justify-between gap-6 py-5 text-left transition-colors hover:bg-black/[0.04] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ink"
                  >
                    <span className="max-w-[46ch] text-h4 text-pretty">{item.title}</span>
                    <span aria-hidden="true" className="text-h4-mono text-gray-intermediate">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                </h3>
                {isOpen && (
                  <p
                    id={`faq-${item.id}`}
                    className="max-w-[70ch] pb-6 text-body text-ink-soft text-pretty"
                  >
                    {item.body}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
