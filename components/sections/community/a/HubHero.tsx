"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import CtaPill from "@/components/sections/quantum/CtaPill";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { HERO } from "@/components/sections/community/communityContent";

// §1 of the Hub — the opening of the canonical directory.
//
// ── This page routes; it does not argue ────────────────────────────────────
// Every other page in this set spends its first screen making a case. This one
// spends it pointing: the headline states who is here, and the two CTAs are the
// two doors most people arrive wanting. So the hero is deliberately SHORT — no
// field of marks, no scene, no scroll-driven anything. A reader who lands here
// with a destination in mind should be able to leave the hero in one gesture,
// and anything that has to finish playing before the page settles is working
// against that.
//
// The subhead sits in the right-hand column at the baseline of the headline
// rather than under it, so the CTAs land in the first screen at every width
// instead of being pushed below the fold by a three-line paragraph.
export default function HubHero() {
  const rootRef = useScrollReveal<HTMLElement>({ start: "top 95%" });

  return (
    <section
      ref={rootRef}
      className="bg-cream pb-[8svh] pt-[calc(var(--site-header-block)+6svh)]"
    >
      <Container>
        <div className="grid-ds items-end gap-y-10">
          <div className="col-span-12 lg:col-span-7">
            <div data-reveal>
              <Eyebrow className="text-gray-intermediate">{HERO.eyebrow}</Eyebrow>
            </div>
            {/* The accent lands on "open web" and not on "people": the serif is
                the page's emphasis mark, and what this page is about is the
                thing being built, with the people as the subject doing it. */}
            <h1 data-reveal className="mt-6 max-w-[15ch] text-display text-balance">
              The people building the <Accent display>open web</Accent>
            </h1>
          </div>

          <div className="col-span-12 lg:col-span-4 lg:col-start-9">
            <p data-reveal className="max-w-[42ch] text-body-lg text-ink-soft text-pretty">
              {HERO.sub}
            </p>
            <div data-reveal className="mt-8 flex flex-wrap items-center gap-3">
              <CtaPill href={HERO.primary.href} tone="filled">
                {HERO.primary.label}
              </CtaPill>
              <CtaPill href={HERO.secondary.href} tone="quiet">
                {HERO.secondary.label}
              </CtaPill>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
