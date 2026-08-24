"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import MediaFrame from "@/components/primitives/MediaFrame";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { PRODUCTS } from "@/components/sections/economics/economicsContent";

// §4 of variant A — where the revenue in step 1 actually comes from.
//
// ── White, and only here ───────────────────────────────────────────────────
// The page runs cream → cream → ink → WHITE → cream. This is its single lift,
// and it lands immediately after the loop for a reason: the ring is the page's
// densest passage, and the two products are the moment the argument stops being
// a diagram and names two things that exist. The ground changing under that is
// what tells the reader the register changed.
//
// ── Two blocks, stacked, not two columns ───────────────────────────────────
// Side by side, these two read as a comparison — "pick one" — and they are not
// alternatives, they are two engines feeding one loop. Stacked full width, each
// gets its own rule and its own line of sight, and the reader meets them in the
// deck's order rather than choosing between them.
//
// ── Why this is the one section on the page with real assets in it ─────────
// Everything above this is a claim about a mechanism, and mechanisms are drawn.
// These two are shipped products with interfaces, and the honest way to show a
// product that exists is to show it — a diagram of Intents would be a diagram of
// something that does not need one. So each entry reserves a capture
// (`MediaFrame`), and the label is the brief for whoever shoots it, not a
// caption.
//
// The two slots are deliberately unequal. Same size and same side, one under
// the other, is a template: it would restate the symmetry the stacked layout
// already has and change the page's rhythm not at all. So Intents takes a wide
// 16/9 under the right-hand column and NEAR AI a 4/3 under the left, which
// leaves an empty half-row after each — the same open space the rest of the
// page uses to separate things without drawing a box around them.

// Keyed by product id and not by index: a reordered deck must not be able to
// hand NEAR AI the brief written for Intents.
const SHOTS = {
  intents: {
    label:
      "NEAR Intents — cross-chain swap in progress: the stated intent, the route it takes, and settlement on both chains",
    spec: "2400×1350 · PNG @2x",
    ratio: "16/9",
    span: "col-span-12 lg:col-span-6 lg:col-start-7",
  },
  ai: {
    label:
      "NEAR AI — agent infrastructure console: one agent running in a confidential environment, execution proof in view",
    spec: "1600×1200 · PNG @2x",
    ratio: "4/3",
    span: "col-span-12 lg:col-span-5",
  },
} as const;

export default function RevenueEngines() {
  const rootRef = useScrollReveal<HTMLElement>();

  return (
    <section ref={rootRef} className="bg-background py-[14svh]">
      <Container>
        <div data-reveal>
          <Eyebrow className="text-gray-intermediate">{PRODUCTS.eyebrow}</Eyebrow>
          <h2 className="mt-12 max-w-[16ch] text-h1 text-pretty">{PRODUCTS.headline}</h2>
        </div>

        <div className="mt-20 flex flex-col gap-20">
          {PRODUCTS.items.map((p) => {
            const shot = SHOTS[p.id];
            return (
            <article key={p.id} data-reveal>
              <div className="h-px w-full bg-rule" aria-hidden="true" />

              <div className="mt-8 grid-ds gap-y-8">
                <div className="col-span-12 lg:col-span-5">
                  <p className="text-caption-mono text-gray-intermediate">{p.index}</p>
                  <h3 className="mt-6 text-h2 text-pretty">{p.name}</h3>
                  {/* The claim in serif italic and the body in sans: the claim
                      is the sentence the reader is meant to keep, and the page
                      has exactly one voice reserved for that. */}
                  <p className="mt-5 max-w-[24ch] text-h3-serif italic text-green-ink text-pretty">
                    {p.claim}
                  </p>
                </div>

                <div className="col-span-12 lg:col-span-6 lg:col-start-7">
                  <p className="max-w-[52ch] text-body-lg text-ink-soft text-pretty">{p.body}</p>
                  <Link
                    href={p.href}
                    className="mt-8 inline-flex items-center gap-2 border-b border-foreground/30 pb-1 text-label text-ink transition-colors hover:border-foreground"
                  >
                    {p.linkLabel}
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>

                <div className={`mt-6 ${shot.span}`}>
                  <MediaFrame label={shot.label} spec={shot.spec} ratio={shot.ratio} />
                </div>
              </div>
            </article>
            );
          })}
        </div>

        {/* The tie-back is the sentence that puts both products back inside the
            loop, so it sits under the pair rather than beside either one. */}
        <p
          data-reveal
          className="mt-20 max-w-[58ch] text-body-lg text-ink-soft text-pretty"
        >
          {PRODUCTS.tieBack}
        </p>
      </Container>
    </section>
  );
}
