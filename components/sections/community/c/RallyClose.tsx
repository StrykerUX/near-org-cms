"use client";

import Container from "@/components/primitives/Container";
import ShineField from "@/components/primitives/ShineField";
import CtaPill from "@/components/sections/quantum/CtaPill";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { CLOSING } from "@/components/sections/community/communityContent";

// §8 of the Rally — the close, sober on purpose.
//
// `a/` closes at `text-statement` with a serif accent, because on that page the
// close is the last chance to convert. Here the conversion happened in the
// second section, and a big finish would ask the reader to be excited about the
// Legion for a second time, twelve screens later. So: one `h2`, the two CTAs the
// deck asks for, the mail field for whoever is not ready to commit to any of it,
// and nothing else.
//
// The newsletter sits under a hairline in the same column as the close rather
// than beside it, because centred is the shape the rest of the bottom of this
// page has (see `RallyFaq`) and a two-column footer would restart a layout the
// page already put down.
export default function RallyClose() {
  const rootRef = useScrollReveal<HTMLElement>();

  return (
    <section ref={rootRef} className="bg-cream pb-[14svh] pt-[4svh]">
      <Container>
        <div className="mx-auto max-w-[52rem]">
          <div data-reveal>
            <h2 className="max-w-[16ch] text-h1 text-pretty">{CLOSING.headline}</h2>
            <p className="mt-6 max-w-[46ch] text-body-lg text-ink-soft text-pretty">
              {CLOSING.sub}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <CtaPill href={CLOSING.primary.href} tone="filled">
                {CLOSING.primary.label}
              </CtaPill>
              <CtaPill href={CLOSING.secondary.href} tone="quiet" external>
                {CLOSING.secondary.label}
              </CtaPill>
            </div>
          </div>

          <div data-reveal className="mt-16 border-t border-rule pt-10">
            <p className="text-caption-mono uppercase text-gray-intermediate">
              {CLOSING.newsletter.title}
            </p>
            <p className="mt-4 max-w-[44ch] text-body text-ink-soft text-pretty">
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
