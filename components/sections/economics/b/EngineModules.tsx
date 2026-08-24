"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import MediaFrame from "@/components/primitives/MediaFrame";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import InstrumentSection from "@/components/sections/shells/instrument/Section";
import Panel from "@/components/sections/shells/instrument/Panel";
import { PRODUCTS } from "@/components/sections/economics/economicsContent";

// §4 of variant B — where the revenue in step 1 actually comes from.
//
// ── Two modules of one apparatus, not two products side by side ───────────
// Set in two columns these read as a comparison — "pick one" — and they are not
// alternatives, they are two engines feeding the same loop. So each one is its
// own panel, full width, one under the other, labelled as a module and
// numbered. A module is a part of a machine; two of them stacked cannot be read
// as a choice.
//
// The art swaps sides between the two. Same size and same side twice is a
// template: it would restate the symmetry the stacked layout already has, and
// change the page's rhythm not at all.
//
// ── Why this is the one place on the page with real assets ────────────────
// Everything above is a claim about a mechanism, and mechanisms get drawn.
// These two are shipped products with interfaces, and the honest way to show a
// product that exists is to show it — a diagram of Intents would be a diagram
// of something that does not need one.
//
// ── The briefs are the same ones variant A wrote ──────────────────────────
// Word for word, on purpose: the two variants have to be served by the SAME
// photograph, or the shot list doubles for a difference nobody asked for. Only
// the tone changes, because here the frame sits on ink. They are duplicated
// rather than imported because `a/` owns its file and this variant does not
// reach into it — the README carries the shot list for both.

const SHOTS = {
  intents: {
    label:
      "NEAR Intents — cross-chain swap in progress: the stated intent, the route it takes, and settlement on both chains",
    spec: "2400×1350 · PNG @2x",
    ratio: "16/9",
  },
  ai: {
    label:
      "NEAR AI — agent infrastructure console: one agent running in a confidential environment, execution proof in view",
    spec: "1600×1200 · PNG @2x",
    ratio: "4/3",
  },
} as const;

export default function EngineModules() {
  const rootRef = useScrollReveal<HTMLDivElement>();

  return (
    <InstrumentSection eyebrow={PRODUCTS.eyebrow} title={PRODUCTS.headline}>
      <div ref={rootRef} className="flex flex-col gap-10 lg:gap-14">
        {PRODUCTS.items.map((p, i) => {
          const shot = SHOTS[p.id];
          const artFirst = i % 2 === 0;

          return (
            <article key={p.id} data-reveal>
              <Panel label={`Module ${p.index}`} meta={p.name}>
                <div className="grid-ds items-center gap-y-10 px-5 pb-10 pt-20 lg:px-8 lg:pb-14 lg:pt-24">
                  <div
                    className={`col-span-12 lg:col-span-6 lg:row-start-1 ${
                      artFirst ? "lg:col-start-1" : "lg:col-start-7"
                    }`}
                  >
                    <MediaFrame
                      label={shot.label}
                      spec={shot.spec}
                      ratio={shot.ratio}
                      tone="dark"
                    />
                  </div>

                  <div
                    className={`col-span-12 lg:col-span-5 lg:row-start-1 ${
                      artFirst ? "lg:col-start-8" : "lg:col-start-1"
                    }`}
                  >
                    <h3 className="text-h2 text-pretty">{p.name}</h3>
                    {/* The claim in serif italic: it is the sentence the reader
                        is meant to keep, and the page has exactly one voice
                        reserved for that. */}
                    <p className="mt-5 max-w-[24ch] text-h3-serif italic text-near-green-accent text-pretty">
                      {p.claim}
                    </p>
                    <p className="mt-7 max-w-[48ch] text-body text-white/65 text-pretty">
                      {p.body}
                    </p>
                    <Link
                      href={p.href}
                      className="mt-8 inline-flex items-center gap-2 border-b border-white/30 pb-1 text-label text-cream transition-colors hover:border-white"
                    >
                      {p.linkLabel}
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </Panel>
            </article>
          );
        })}

        {/* The tie-back puts both modules back inside the loop, so it sits
            under the pair and outside both panels — it belongs to the machine,
            not to either part of it. */}
        <p data-reveal className="mt-6 max-w-[58ch] text-body-lg text-white/60 text-pretty">
          {PRODUCTS.tieBack}
        </p>
      </div>
    </InstrumentSection>
  );
}
