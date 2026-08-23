"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Container from "@/components/primitives/Container";
import MediaFrame from "@/components/primitives/MediaFrame";
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
//
// ── The one place on this page where a real asset belongs ─────────────────
// The rest of the variant argues with rules, mono and one drawn chart, because
// the rest of the variant is about a mechanism. These two are products with
// interfaces, and an entry in a book of record is worth more with the document
// attached: the `MediaFrame` is the slot for that document, and its label is
// the brief for whoever produces it.
//
// The two are shot differently on purpose, and the difference is not styling.
// Intents is used inside wallets, so its capture is PORTRAIT and it sits in the
// narrow column beside the entry — a phone-shaped hole is already half the
// brief. NEAR AI is infrastructure, so it gets a 21/9 strip across the wide
// column, which is the shape a console actually is. Two identical 16/9 boxes
// stacked would have described neither, and would have added a template where
// the section already has a rhythm.

// Keyed by product id, so reordering the deck cannot hand one product the brief
// written for the other.
const SHOTS = {
  intents: {
    label:
      "NEAR Intents inside a wallet — portrait capture of a cross-chain swap: the stated intent, the route, and the settled balance",
    spec: "1200×1600 · PNG @2x, device frame only",
    ratio: "3/4",
    span: "col-span-12 lg:col-span-4 lg:col-start-2",
  },
  ai: {
    label:
      "NEAR AI — wide crop of the agent console: active agents, their confidential environment, and the execution log",
    spec: "2520×1080 · PNG @2x",
    ratio: "21/9",
    span: "col-span-12 lg:col-span-6 lg:col-start-7",
  },
} as const;

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
          {PRODUCTS.items.map((p) => {
            const shot = SHOTS[p.id];
            return (
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

                <div className={`mt-4 ${shot.span}`}>
                  <MediaFrame label={shot.label} spec={shot.spec} ratio={shot.ratio} />
                </div>
              </div>
            </article>
            );
          })}
          <div className="h-px w-full bg-rule" aria-hidden="true" />
        </div>

        <p data-reveal className="mt-14 max-w-[62ch] text-body text-ink-soft text-pretty">
          {PRODUCTS.tieBack}
        </p>
      </Container>
    </section>
  );
}
