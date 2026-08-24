"use client";

import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { MARQUEE_PROOFS as PROOFS } from "@/components/sections/quantum-security-copy/quantumContent";

// ── H3 · §Proof strip ──────────────────────────────────────────────────────
// The six facts as `chain-ab-propuesta-b`'s stat list: value and gloss sharing
// one baseline, joined by an em dash, stacked with `gap` and **no rules at
// all**. That page's own note is the reason — "sin ninguna regla (pedido
// explícito)… la separación la da sola el `gap`" — and it is the difference
// between the two temperaments this pair is comparing. H2 takes the same six
// facts into the ruled block from `propuesta-a`.
//
// **`text-h3` and not `text-display`.** Also `propuesta-b`'s call, and it
// travels: in a line meant to be READ, the value has to weigh like another word
// in the sentence, not like a headline. "Post-quantum signing — live on
// mainnet" is a sentence; at display size it stops being one.
//
// **Two columns of three, and the order runs down not across.** Six items in a
// single column is a tall thin list next to a lot of empty page; six across is
// unreadable. `sm:columns-2` keeps the reading order vertical, which is what a
// list of facts wants — across-then-down makes the reader's eye jump the gutter
// on every line.
//
// **Why it stops moving.** The marquee it replaces has one structural problem:
// motion signals decoration, so a reader who has just met the hero waits for
// the band to finish before deciding whether it is worth reading, and it never
// finishes.
export default function ProofList() {
  const ref = useScrollReveal<HTMLDListElement>({ start: "top 88%", stagger: 0.06, y: 16 });

  return (
    <section className="bg-cream py-16 lg:py-24">
      <Container>
        <dl ref={ref} className="flex flex-col gap-6 sm:columns-2 sm:gap-x-16">
          {PROOFS.map((p) => (
            <div
              key={p.fact}
              data-reveal
              // `break-inside-avoid` + `mb`: inside a CSS multi-column, a flex
              // gap does not apply between column-broken items, and without the
              // avoid a two-line item splits across the gutter.
              className="mb-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 break-inside-avoid"
            >
              <dt className="text-pretty text-h3">{p.fact}</dt>
              <dd className="text-pretty text-body text-gray-intermediate">— {p.gloss}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
