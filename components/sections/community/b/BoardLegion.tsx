"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import CtaPill from "@/components/sections/quantum/CtaPill";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { LEGION } from "@/components/sections/community/communityContent";

// §4 of the Board — the one block that is not a row.
//
// ── The contrast IS the design ─────────────────────────────────────────────
// Every other section of this variant is a hairline grid: fixed columns, mono
// data, rows packed as tight as they will read. This one has no rule in it at
// all, no columns, and more vertical air than the events table and the channel
// table put together. On a page built entirely out of rows, a block that refuses
// to be a row is the loudest thing available — louder than making it bigger,
// which is what a row-shaped Legion at display size would have been.
//
// ── Why white and not ink ──────────────────────────────────────────────────
// `a/` puts its Legion on ink, and that is `a/`'s signature: one hard cut on an
// otherwise even page. Repeating it here would make the two variants agree on
// the exact axis they exist to disagree on, and would say the same thing twice
// across the set.
//
// White is the opposite move and it is the right one for THIS page. The board is
// dense, dark-ruled and busy; a full-bleed field of nothing, with one sentence in
// the middle of it, is a hole in the timetable. It also keeps the page's single
// use of `bg-background` (the design system allows one per page) for the moment
// that has to stop the scan.
//
// Centred, and the only centred type on the page — for the same reason as
// everything else here. The board is left-aligned because a scan needs a common
// left edge; this block is not being scanned.
export default function BoardLegion() {
  const rootRef = useScrollReveal<HTMLElement>({ y: 36, stagger: 0.12 });

  return (
    <section ref={rootRef} className="bg-background py-[22svh]">
      <Container>
        <div className="mx-auto flex max-w-[46rem] flex-col items-center text-center">
          <p data-reveal className="text-eyebrow-mono uppercase text-gray-intermediate">
            {LEGION.eyebrow}
          </p>
          {/* `text-display` here and `text-statement` for the hero — the only
              place on this page where a heading outranks the `h1`. That is the
              point: the hero states who is here, this is what the page wants
              the reader to do. */}
          <h2 data-reveal className="mt-10 max-w-[10ch] text-display text-balance">
            Join the <Accent display>Legion</Accent>
          </h2>
          <p data-reveal className="mt-10 max-w-[52ch] text-body-lg text-ink-soft text-pretty">
            {LEGION.body}
          </p>
          <div data-reveal className="mt-12">
            <CtaPill href={LEGION.cta.href} tone="filled" size="lg" external>
              {LEGION.cta.label}
            </CtaPill>
          </div>
          <p data-reveal className="mt-8 text-caption-mono uppercase text-gray-intermediate">
            {LEGION.statLine}
          </p>
        </div>
      </Container>
    </section>
  );
}
