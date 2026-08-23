"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import MediaFrame from "@/components/primitives/MediaFrame";
import CtaPill from "@/components/sections/quantum/CtaPill";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { LEGION, MEDIA } from "@/components/sections/community/communityContent";

// §2 of the Rally — the Legion, moved to the top, and the reason this variant
// exists.
//
// ── The inversion, and what it costs ───────────────────────────────────────
// The deck's order is hero → figures → events → Legion. That order treats the
// Legion as the thing you arrive at after being convinced, and it is the right
// order for a page that is arguing. This page is not: it is a routing page, and
// the Legion is the destination most of its traffic is worth sending to. Putting
// it fourth means a reader who came for an event finds the events, leaves, and
// never sees it.
//
// So here it is second, and it is not marked as a separate beat AT ALL — same
// cream, no rule above it, no band, no card. That is the whole device. `a/`
// separates its Legion with ink and `b/` with white; this one separates it with
// nothing, because the claim is that it is not a section of the page, it is the
// second sentence of the opening. Read together, the hero says who is here and
// this says what to do about it.
//
// What it costs is real and should be said out loud: a reader who arrived
// wanting the events calendar now scrolls past a full screen of something else
// to reach it. That is the trade this variant is proposing, and the comparison
// against `a/` is what it is for.
//
// ── The photograph, and why it is the largest thing on any of the three ───
// This variant separates the Legion by POSITION and by nothing else — no band,
// no rule, no change of ground. That works as an argument and it leaves the
// block with no visual weight of its own, which is the honest objection to the
// whole inversion: the most important thing on the page is set in the same
// cream, at one step down from the heading above it.
//
// The picture is what settles that. `16/9` across columns 2–12 is the biggest
// reserved slot in the set, and it lands between the heading and the ask, so a
// reader coming out of the hero passes through a room full of people on the way
// to "Join the Legion". That is the argument this variant is making, made in
// the one medium that can make it in a single glance.
//
// The indent (starting at column 2 rather than 1) is the same continuity device
// as everything else here: the block is the second sentence of the opening, and
// an indented picture reads as a continuation where a full-bleed one reads as a
// new chapter.
//
// One step down from the `h1` in the scale and nothing else. Matching the h1's
// `text-display` was tried and it reads as two competing openings rather than
// one continuous one — the heading has to be clearly the SECOND voice for the
// continuity to work at all.
export default function RallyLegion() {
  const rootRef = useScrollReveal<HTMLElement>({ y: 32, stagger: 0.1 });

  return (
    <section ref={rootRef} className="bg-cream pb-[12svh] pt-[10svh]">
      <Container>
        <p data-reveal className="text-eyebrow-mono uppercase text-green-ink">
          {LEGION.eyebrow}
        </p>

        <h2 data-reveal className="mt-8 max-w-[16ch] text-statement text-balance">
          Join the <Accent display>Legion</Accent>
        </h2>

        <div data-reveal className="mt-14 grid-ds">
          <div className="col-span-12 lg:col-span-11 lg:col-start-2">
            <MediaFrame label={MEDIA.legion.label} spec={MEDIA.legion.spec} ratio="16/9" />
          </div>
        </div>

        <div className="mt-16 grid-ds items-end gap-y-10">
          <div className="col-span-12 lg:col-span-7">
            <p data-reveal className="max-w-[54ch] text-body-lg text-ink-soft text-pretty">
              {LEGION.body}
            </p>
          </div>

          <div className="col-span-12 lg:col-span-4 lg:col-start-9">
            <div data-reveal>
              <CtaPill href={LEGION.cta.href} tone="filled" size="lg" external>
                {LEGION.cta.label}
              </CtaPill>
            </div>
            {/* `text-green-ink` (#00a86b) and not `near-green-accent` (#00dc8d):
                the accent green is a UI colour and fails contrast as text on
                cream. The rule of the house, written up in globals.css. */}
            <p data-reveal className="mt-6 text-caption-mono uppercase text-green-ink">
              {LEGION.statLine}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
