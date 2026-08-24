"use client";

import Link from "next/link";
import { ArrowDown } from "lucide-react";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { HERO } from "@/components/sections/community/communityContent";

// §1 of the Board — the head of a departures board.
//
// ── The whole variant in one decision ──────────────────────────────────────
// This layout is built for the reader who is SCANNING: they arrived knowing
// roughly what they want (an event, a channel, the Legion) and their eye is
// running down the page looking for the row that matches. Everything below is
// therefore a row on a hairline, in fixed columns, with the data set in mono —
// the shape of a timetable, because a timetable is the one interface designed
// for exactly that reader.
//
// So the hero does not open with a picture or a scene. It opens with the two
// destinations, set as the first two rows of the board, under a headline that
// is one step down from `a/`'s display size — on a page this dense, a display
// headline is a different document sitting on top of a timetable.
//
// The two CTAs are rows and not pills for the same reason: a pill is a soft
// object with its own silhouette, and there are none of those on this page. A
// full-width cell with a rule under it and an arrow on the right is the same
// affordance in this page's own vocabulary, and it is a much bigger pointer
// target than a pill.
const CTA_CELL =
  "group flex items-center justify-between gap-6 border-b border-rule py-5 transition-colors hover:bg-black/[0.03] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ink";

export default function BoardHero() {
  const rootRef = useScrollReveal<HTMLElement>({ start: "top 95%" });

  return (
    <section
      ref={rootRef}
      className="bg-cream pb-[6svh] pt-[calc(var(--site-header-block)+5svh)]"
    >
      <Container>
        <p data-reveal className="text-eyebrow-mono uppercase text-gray-intermediate">
          {HERO.eyebrow}
        </p>

        <div className="mt-8 grid-ds items-end gap-y-8">
          <div className="col-span-12 lg:col-span-7">
            <h1 data-reveal className="max-w-[16ch] text-statement text-balance">
              The people building the <Accent display>open web</Accent>
            </h1>
          </div>
          <div className="col-span-12 lg:col-span-5">
            <p data-reveal className="max-w-[46ch] text-body text-ink-soft text-pretty">
              {HERO.sub}
            </p>
          </div>
        </div>

        {/* The board's first two rows. Both targets are anchors further down
            this same page, which is why the glyph is a DOWN arrow and not the
            usual right-pointing one: the arrow states where the row goes, and
            both of these go down the document rather than away from it. */}
        <div data-reveal className="mt-14 border-t border-rule">
          <Link href={HERO.primary.href} className={CTA_CELL}>
            <span className="flex items-baseline gap-6">
              <span className="text-caption-mono uppercase text-gray-intermediate">01</span>
              <span className="text-h4">{HERO.primary.label}</span>
            </span>
            <ArrowDown
              className="size-5 transition-transform group-hover:translate-y-1"
              aria-hidden="true"
            />
          </Link>
          <Link href={HERO.secondary.href} className={CTA_CELL}>
            <span className="flex items-baseline gap-6">
              <span className="text-caption-mono uppercase text-gray-intermediate">02</span>
              <span className="text-h4">{HERO.secondary.label}</span>
            </span>
            <ArrowDown
              className="size-5 transition-transform group-hover:translate-y-1"
              aria-hidden="true"
            />
          </Link>
        </div>
      </Container>
    </section>
  );
}
