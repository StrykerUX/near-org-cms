"use client";

import Accent from "@/components/primitives/Accent";
import ShineField from "@/components/primitives/ShineField";
import Panel from "@/components/sections/shells/instrument/Panel";
import InstrumentSection from "@/components/sections/shells/instrument/Section";
import CtaPill from "@/components/sections/quantum/CtaPill";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { CLOSING, INSTRUMENT } from "@/components/sections/community/communityContent";

// §8 of the instrument — the close and the newsletter, in one panel.
//
// They were briefly two sections, and that is wrong for this page: the close
// says "pick a door" and the newsletter IS a door — the lowest-commitment one on
// the page, for the reader who got this far and is not ready to join anything.
// Given their own vertical rhythm, the newsletter reads as boilerplate arriving
// after the page has already ended. Inside one panel it is the third option in
// the same breath as the other two.
//
// The order is deliberate: the two CTAs first, the mail field after. A reader
// who knows what they want should not have to scroll past a form to reach it.
//
// ── The white field on the dark panel ─────────────────────────────────────
// `ShineField` is a white capsule with black type and it needs no dark variant:
// on ink it reads as the one lit control on the panel, which is what a mail
// field at the end of an instrument should be. Its shine masks the glyphs
// themselves, so the surrounding ground never enters into it.
export default function NetClose() {
  const rootRef = useScrollReveal<HTMLDivElement>();

  return (
    <InstrumentSection wide>
      <div ref={rootRef}>
        <Panel label={INSTRUMENT.close.label} meta={INSTRUMENT.close.meta}>
          <div className="grid-ds items-end gap-y-14 px-5 pb-14 pt-20 lg:px-9 lg:pb-16 lg:pt-24">
            <div className="col-span-12 lg:col-span-6">
              <h2 data-reveal className="max-w-[14ch] text-statement text-balance">
                Start building the <Accent display>open web</Accent>
              </h2>
              <p data-reveal className="mt-8 max-w-[40ch] text-body-lg text-white/65 text-pretty">
                {CLOSING.sub}
              </p>
              <div data-reveal className="mt-10 flex flex-wrap items-center gap-3">
                <CtaPill href={CLOSING.primary.href} tone="solid">
                  {CLOSING.primary.label}
                </CtaPill>
                <CtaPill href={CLOSING.secondary.href} tone="dark" external>
                  {CLOSING.secondary.label}
                </CtaPill>
              </div>
            </div>

            <div data-reveal className="col-span-12 lg:col-span-4 lg:col-start-9">
              <p className="text-caption-mono uppercase text-white/40">
                {CLOSING.newsletter.title}
              </p>
              <p className="mt-4 max-w-[34ch] text-body text-white/60 text-pretty">
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
        </Panel>
      </div>
    </InstrumentSection>
  );
}
