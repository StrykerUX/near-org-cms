"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import ShineField from "@/components/primitives/ShineField";
import CtaPill from "@/components/sections/quantum/CtaPill";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { CLOSING } from "@/components/sections/community/communityContent";

// §8 of the Hub — the close and the newsletter, in one section.
//
// They were briefly two, and that was wrong for this page: the close says "pick
// a door" and the newsletter IS a door — the lowest-commitment one on the page,
// for the reader who got this far and is not ready to join anything. Split into
// two sections with their own vertical rhythm, the newsletter read as boilerplate
// arriving after the page had already ended. Sharing one ground and one rule
// makes it the third option in the same breath as the other two.
//
// The order is deliberate: the two CTAs first, the mail field after. A reader
// who knows what they want should not have to scroll past a form to reach it.
export default function HubClose() {
  const rootRef = useScrollReveal<HTMLElement>();

  return (
    <section ref={rootRef} className="bg-cream pb-[14svh] pt-[6svh]">
      <Container>
        <div className="grid-ds items-end gap-y-12 border-t border-rule pt-16">
          <div className="col-span-12 lg:col-span-6">
            <h2 data-reveal className="max-w-[14ch] text-statement text-balance">
              Start building the <Accent display>open web</Accent>
            </h2>
            <p data-reveal className="mt-8 max-w-[40ch] text-body-lg text-ink-soft text-pretty">
              {CLOSING.sub}
            </p>
            <div data-reveal className="mt-10 flex flex-wrap items-center gap-3">
              <CtaPill href={CLOSING.primary.href} tone="filled">
                {CLOSING.primary.label}
              </CtaPill>
              <CtaPill href={CLOSING.secondary.href} tone="quiet" external>
                {CLOSING.secondary.label}
              </CtaPill>
            </div>
          </div>

          <div data-reveal className="col-span-12 lg:col-span-5 lg:col-start-8">
            <p className="text-caption-mono uppercase text-gray-intermediate">
              {CLOSING.newsletter.title}
            </p>
            <p className="mt-4 max-w-[34ch] text-body text-ink-soft text-pretty">
              {CLOSING.newsletter.body}
            </p>
            <div className="mt-8">
              <ShineField
                placeholder={CLOSING.newsletter.placeholder}
                label={CLOSING.newsletter.fieldLabel}
                buttonLabel={CLOSING.newsletter.cta}
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
