"use client";

import MediaFrame from "@/components/primitives/MediaFrame";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import StageSection from "@/components/sections/shells/stage/Section";
import StageCard from "@/components/sections/shells/stage/Card";
import { PRODUCTS } from "@/components/sections/economics/economicsContent";

// §4 of variant C — where the revenue in step 1 comes from.
//
// ── Two cards, and the white is spent here ───────────────────────────────
// The page runs shader → tint → cream → WHITE → cream, and white is the one
// ground a page should spend once. It lands here because this is where the
// argument stops describing a mechanism and names two things that exist: the
// register changes, so the ground does. On white the cards read as objects
// sitting on a table, which is the correct relationship to a section that is
// about products.
//
// ── The art plate holds a capture, not a drawing ─────────────────────────
// Everything above this section is a claim about how something works, and that
// gets drawn. These two are shipped products with interfaces, and the honest
// way to show a product that exists is to show it — a diagram of Intents would
// be a diagram of something that does not need one. So each card's plate
// reserves a real screenshot, with the brief for whoever shoots it written
// underneath in mono.
//
// ── The claim rides in the plate, above the capture ──────────────────────
// `Card` has a title and a body and no third text slot, and it should not grow
// one: four variant props is the shell's ceiling and this would be a fifth. The
// claim goes into the art instead, which is where it belongs anyway — it is the
// sentence the capture is evidence FOR, and the page keeps exactly one voice
// (serif italic, in the legible green) for the sentence a reader is meant to
// take away.
//
// ── The two frames are different shapes on purpose ───────────────────────
// Two identical 16/9 slots side by side are a template: they would restate the
// symmetry the two-column grid already has and change the rhythm not at all.
// Intents gets a wide strip because a cross-chain route is a horizontal thing;
// NEAR AI gets a console.

const SHOTS = {
  intents: {
    label:
      "NEAR Intents — wide strip of a cross-chain swap: the stated intent, the route between chains, and settlement",
    spec: "2500×1000 · PNG @2x",
    ratio: "5/2",
  },
  ai: {
    label:
      "NEAR AI — agent console: one agent running in a confidential environment, with its execution proof",
    spec: "2400×1350 · PNG @2x",
    ratio: "16/9",
  },
} as const;

export default function EngineCards() {
  const rootRef = useScrollReveal<HTMLDivElement>();

  return (
    <StageSection eyebrow={PRODUCTS.eyebrow} title={PRODUCTS.headline} tone="white">
      <div ref={rootRef}>
        <div className="grid-ds gap-y-8">
          {PRODUCTS.items.map((p) => {
            const shot = SHOTS[p.id];
            return (
              <div key={p.id} data-reveal className="col-span-12 lg:col-span-6">
                <StageCard
                  art={
                    <div className="flex w-full flex-col gap-7">
                      <p className="max-w-[26ch] text-h3-serif italic text-green-ink text-pretty">
                        {p.claim}
                      </p>
                      <MediaFrame label={shot.label} spec={shot.spec} ratio={shot.ratio} />
                    </div>
                  }
                  title={p.name}
                  body={p.body}
                  href={p.href}
                  linkLabel={p.linkLabel}
                />
              </div>
            );
          })}
        </div>

        {/* The tie-back puts both products back inside the loop, so it sits
            under the pair rather than beside either one. */}
        <p
          data-reveal
          className="mt-16 max-w-[58ch] text-body-lg text-ink-soft text-pretty"
        >
          {PRODUCTS.tieBack}
        </p>
      </div>
    </StageSection>
  );
}
