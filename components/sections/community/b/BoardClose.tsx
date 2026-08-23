"use client";

import Container from "@/components/primitives/Container";
import ShineField from "@/components/primitives/ShineField";
import CtaPill from "@/components/sections/quantum/CtaPill";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { CLOSING } from "@/components/sections/community/communityContent";

// §8 of the Board — the close, kept to two rows.
//
// The board spent the whole page being efficient, and a close that suddenly
// takes a full screen would undo that in its last gesture. So it is literally
// two more rows of the same grid: the statement and its two CTAs, then the mail
// field. `text-h1` and not the `text-statement` of `a/`'s close — the page's
// loudest moment was the Legion, and letting the footer out-shout it would move
// the emphasis to the least important thing on the page.
export default function BoardClose() {
  const rootRef = useScrollReveal<HTMLElement>();

  return (
    <section ref={rootRef} className="bg-cream pb-[12svh] pt-[4svh]">
      <Container>
        <div className="grid-ds items-end gap-y-8 border-t border-rule pt-10">
          <div data-reveal className="col-span-12 lg:col-span-6">
            <h2 className="max-w-[16ch] text-h1 text-pretty">{CLOSING.headline}</h2>
            <p className="mt-5 max-w-[42ch] text-body text-ink-soft text-pretty">{CLOSING.sub}</p>
          </div>
          <div
            data-reveal
            className="col-span-12 flex flex-wrap items-center gap-3 lg:col-span-5 lg:col-start-8 lg:justify-end"
          >
            <CtaPill href={CLOSING.primary.href} tone="filled">
              {CLOSING.primary.label}
            </CtaPill>
            <CtaPill href={CLOSING.secondary.href} tone="quiet" external>
              {CLOSING.secondary.label}
            </CtaPill>
          </div>
        </div>

        <div className="mt-10 grid-ds items-center gap-y-6 border-t border-rule pt-10">
          <div data-reveal className="col-span-12 lg:col-span-5">
            <p className="text-caption-mono uppercase text-gray-intermediate">
              {CLOSING.newsletter.title}
            </p>
            <p className="mt-3 max-w-[40ch] text-body-sm text-ink-soft text-pretty">
              {CLOSING.newsletter.body}
            </p>
          </div>
          <div data-reveal className="col-span-12 lg:col-span-6 lg:col-start-7">
            <ShineField
              placeholder={CLOSING.newsletter.placeholder}
              label={CLOSING.newsletter.fieldLabel}
              buttonLabel={CLOSING.newsletter.cta}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
