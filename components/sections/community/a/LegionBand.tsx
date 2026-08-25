"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import MediaFrame from "@/components/primitives/MediaFrame";
import CtaPill from "@/components/primitives/CtaPill";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { LEGION, MEDIA } from "@/components/sections/community/communityContent";

// §4 of the Hub — the Legion, and the page's only dark cut.
//
// ── Why this one block goes to ink ─────────────────────────────────────────
// Everything else on this page is a directory entry: an event row, a channel,
// a way in. They are peers, and they are all on cream because they ARE peers —
// flattening them is what makes the page scannable. The Legion is not a peer.
// It is the conversion the page exists for, and the deck asks for it wide and
// prominent.
//
// Given a flat page, there are only two ways to make one block louder: make it
// bigger, or change the ground under it. Bigger was tried and it just reads as a
// card that got out of hand — the type grows and the block still sits in the
// same rhythm as its neighbours. Changing the ground is absolute: full bleed,
// ink, and the reader's eye stops there on the way past whether or not they were
// looking for it. It works precisely BECAUSE it is the only one; a second dark
// section on this page would cost this one its entire effect, which is the thing
// to remember if anyone ever adds one.
//
// ── And the picture, which is the ask ──────────────────────────────────────
// The block asks the reader to join a group of people it never shows them. That
// is the single biggest hole on the page: everything else here is a destination
// you can check for yourself — a calendar, eight channels, a repo — and this is
// the one that runs on believing there is somebody on the other side.
//
// So the band ends in a wide photograph of the Legion as an actual room, at
// `5/2` across all twelve columns: the largest reserved slot anywhere in this
// variant, and deliberately below the CTA rather than beside it. Beside it, the
// picture competes with the button for the same glance; underneath, it is what
// the reader is looking at while deciding.
//
// `tone="dark"` is not cosmetic — the frame's light registration marks are tuned
// for cream and vanish on ink.
//
// `data-nav-dark` inverts the fixed site header while this band is under it —
// it is not decorative, the header would otherwise be black-on-black here.
export default function LegionBand() {
  const rootRef = useScrollReveal<HTMLElement>();

  return (
    <section ref={rootRef} data-nav-dark className="bg-ink py-[16svh] text-cream">
      <Container>
        <div className="grid-ds gap-y-12">
          <div className="col-span-12 lg:col-span-7">
            <p data-reveal className="text-eyebrow-mono uppercase text-near-green-accent">
              {LEGION.eyebrow}
            </p>
            {/* `text-statement` and not `text-display`: display is the hero's
                size, and the hero is still the page's first voice. This is the
                loudest thing BELOW it, which is exactly one step down. */}
            <h2 data-reveal className="mt-8 max-w-[12ch] text-statement text-balance">
              Join the <Accent display>Legion</Accent>
            </h2>
          </div>

          <div className="col-span-12 lg:col-span-4 lg:col-start-9 lg:self-end">
            <p data-reveal className="max-w-[44ch] text-body-lg text-cream/75 text-pretty">
              {LEGION.body}
            </p>

            <div data-reveal className="mt-10">
              {/* `solid` and not `dark`: an outlined pill on ink reads as an
                  empty shape, and this is the page's primary conversion. */}
              <CtaPill href={LEGION.cta.href} tone="solid" size="lg" external>
                {LEGION.cta.label}
              </CtaPill>
            </div>

            {/* The hairline over the stat line is `white/12`, the house rule for
                a filete on dark — `bg-rule` is tuned for cream and disappears
                here. */}
            <p
              data-reveal
              className="mt-10 border-t border-white/12 pt-5 text-caption-mono uppercase text-cream/55"
            >
              {LEGION.statLine}
            </p>
          </div>
        </div>

        <div data-reveal className="mt-20">
          <MediaFrame
            label={MEDIA.legion.label}
            spec={MEDIA.legion.spec}
            ratio="5/2"
            tone="dark"
          />
        </div>
      </Container>
    </section>
  );
}
