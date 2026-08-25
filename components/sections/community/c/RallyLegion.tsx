"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import MediaFrame from "@/components/primitives/MediaFrame";
import CtaPill from "@/components/primitives/CtaPill";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { LEGION, MEDIA } from "@/components/sections/community/communityContent";

// §2 of the stage — the Legion, second, and continuous with the hero.
//
// ── The variant's one structural bet ──────────────────────────────────────
// The deck's order puts the Legion fourth, after the figures and the calendar,
// and A keeps that order exactly so the other two have something to be read
// against. This variant moves it to second and proposes that the Legion is the
// page's THESIS rather than one of its blocks: NEAR's community is a programme
// you can join, and everything after this is detail about it.
//
// What that costs is real and worth stating: somebody who came for the calendar
// now scrolls a full screen past an ask before they reach a date. That is the
// trade the variant exists to test, and if the client says the calendar is what
// people come for, this is the layout that loses.
//
// ── No band, no card, no rule ─────────────────────────────────────────────
// A makes the Legion loud by cutting the ground to ink. If this one did the same
// thing one screen after the hero, the page would be two loud openings in a row
// and neither would land. Here the block is on the page's own cream with nothing
// separating it from the surface above — hero and Legion read as one opening,
// two sentences long, and the emphasis comes from POSITION, which is the axis
// this variant is testing.
//
// ── The photograph is indented by one column, and that is the point ───────
// `16/9` across columns 2–12: the largest picture in the set, and the only one
// on this page that does not start at the left margin. A full-bleed picture
// reads as a new chapter; an indented one reads as the continuation of the
// sentence above it, which is exactly what this block is. It is also what gives
// weight to a block whose only other distinction is where it sits.
//
// Same commission as A's and B's — one photograph, three crops, listed once in
// `MEDIA`.
export default function RallyLegion() {
  const rootRef = useScrollReveal<HTMLElement>();

  return (
    <section ref={rootRef} id="legion" className="bg-cream pb-[14svh] pt-[12svh]">
      <Container>
        <div className="grid-ds items-end gap-y-10">
          <div className="col-span-12 lg:col-span-7">
            <p data-reveal className="text-eyebrow-mono uppercase text-green-ink">
              {LEGION.eyebrow}
            </p>
            <h2 data-reveal className="mt-8 max-w-[12ch] text-statement text-balance">
              Join the <Accent display>Legion</Accent>
            </h2>
          </div>

          <div className="col-span-12 lg:col-span-4 lg:col-start-9">
            <p data-reveal className="max-w-[44ch] text-body-lg text-ink-soft text-pretty">
              {LEGION.body}
            </p>
            <div data-reveal className="mt-10">
              <CtaPill href={LEGION.cta.href} tone="filled" size="lg" external>
                {LEGION.cta.label}
              </CtaPill>
            </div>
            <p
              data-reveal
              className="mt-10 border-t border-rule pt-5 text-caption-mono uppercase text-gray-intermediate"
            >
              {LEGION.statLine}
            </p>
          </div>
        </div>

        <div className="mt-20 grid-ds">
          <div data-reveal className="col-span-12 lg:col-span-11 lg:col-start-2">
            <MediaFrame label={MEDIA.legion.label} spec={MEDIA.legion.spec} ratio="16/9" />
          </div>
        </div>
      </Container>
    </section>
  );
}
