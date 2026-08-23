"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { PRODUCTS } from "@/components/sections/economics/economicsContent";

// §4 of variant B — the two sources of the revenue, as two more entries.
//
// ── White, once ───────────────────────────────────────────────────────────
// The page's only lift. Everything before this is the account being kept —
// cream, cream, ink, cream — and this is the page naming the two things that
// actually earn. A clean sheet is what marks that, and it costs nothing else:
// the type, the rules and the mono are identical to the rest of the ledger.
//
// ── The revenue line is a column, not a badge ─────────────────────────────
// `claim` sits in the same position under both names, in mono, in the page's
// green. Nothing declares it as a heading and nothing boxes it; it is a
// column, and two entries that share a column position are being compared
// whether or not a label says so. That is the entire ledger idea applied to a
// pair of products.

export default function LedgerEntries() {
  const rootRef = useScrollReveal<HTMLElement>();

  return (
    <section ref={rootRef} className="bg-background py-[14svh]">
      <Container>
        <div data-reveal className="grid-ds gap-y-8">
          <p className="col-span-12 text-caption-mono uppercase text-gray-intermediate">
            {PRODUCTS.eyebrow}
          </p>
          <h2 className="col-span-12 max-w-[16ch] text-h1 text-pretty lg:col-span-6">
            {PRODUCTS.headline}
          </h2>
        </div>

        <div className="mt-20">
          {PRODUCTS.items.map((p) => (
            <article key={p.id} data-reveal>
              <div className="h-px w-full bg-rule" aria-hidden="true" />
              <div className="grid-ds gap-y-7 pb-16 pt-8">
                <p className="col-span-2 text-caption-mono text-gray-intermediate lg:col-span-1">
                  {p.index}
                </p>

                <div className="col-span-10 lg:col-span-4">
                  <h3 className="text-h3">{p.name}</h3>
                  <p className="mt-4 max-w-[26ch] text-body-sm-mono text-green-ink text-pretty">
                    {p.claim}
                  </p>
                </div>

                <div className="col-span-12 lg:col-span-6 lg:col-start-7">
                  <p className="max-w-[56ch] text-body text-ink-soft text-pretty">{p.body}</p>
                  <Link
                    href={p.href}
                    className="mt-7 inline-flex items-center gap-2 border-b border-foreground/30 pb-1 text-label text-ink transition-colors hover:border-foreground"
                  >
                    {p.linkLabel}
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
          <div className="h-px w-full bg-rule" aria-hidden="true" />
        </div>

        <p data-reveal className="mt-14 max-w-[62ch] text-body text-ink-soft text-pretty">
          {PRODUCTS.tieBack}
        </p>
      </Container>
    </section>
  );
}
