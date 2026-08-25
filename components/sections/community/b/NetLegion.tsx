"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import MediaFrame from "@/components/primitives/MediaFrame";
import CtaPill from "@/components/primitives/CtaPill";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { LEGION, MEDIA } from "@/components/sections/community/communityContent";

// §4 of the instrument — the Legion, and the only block on this page with no
// walls.
//
// ── How a block gets louder on a page that is already dark ────────────────
// A makes the Legion prominent by changing the ground under it: everything else
// is cream, this one is ink, and the eye stops there whether or not it was
// looking. That move is unavailable here, because this variant is ink from the
// hero to the footer — a darker dark is not a contrast, it is a smudge.
//
// What this page has instead is a FORMAT. Every other section is a panel: a
// rounded, bordered rectangle inset from the page, holding its content in a box
// that announces "this is an object you are looking at". The Legion is the one
// section that is not in a box. No border, no radius, no inset — the headline
// runs at mural size and the photograph runs to both edges of the viewport.
//
// It works for the same reason A's ink band works, and it fails the same way:
// it is absolute BECAUSE it is the only one. A second unpanelled section on
// this page costs this one its entire effect, which is the thing to remember if
// anyone ever adds one.
//
// ── The picture is the ask ────────────────────────────────────────────────
// This block asks the reader to join a group of people it never shows them —
// the only claim on a page of checkable destinations that runs on believing
// somebody is on the other side. So the section ends in the Legion as an actual
// room, at `21/9`, wider than anything else on the page: the widest reserved
// slot in the variant, and deliberately below the CTA rather than beside it.
// Beside it, the photograph competes with the button for the same glance;
// underneath, it is what the reader is looking at while deciding.
//
// It is the same commission as A's and C's — one photograph, three crops. The
// list lives in `MEDIA`, and `tone="dark"` is not cosmetic: the frame's light
// registration marks are tuned for cream and vanish on ink.
//
export default function NetLegion() {
  const rootRef = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={rootRef}
      id="legion"
      className="scroll-mt-[var(--site-header-block)] bg-ink py-[18svh] text-cream"
    >
      <Container>
        <p data-reveal className="text-eyebrow-mono uppercase text-near-green-accent">
          {LEGION.eyebrow}
        </p>

        {/* `text-mural` measures itself in `cqw`, so the block that carries it
            has to declare a container — that is the standing agreement with the
            token, not an option. Without it the type resolves against the
            nearest ancestor container and silently lands at the clamp floor. */}
        <div data-reveal className="@container mt-10">
          <h2 className="max-w-[11ch] text-mural text-balance">
            Join the <Accent display>Legion</Accent>
          </h2>
        </div>

        <div className="mt-16 grid-ds items-end gap-y-10">
          <div data-reveal className="col-span-12 lg:col-span-5">
            <p className="max-w-[46ch] text-body-lg text-white/70 text-pretty">{LEGION.body}</p>
          </div>

          <div data-reveal className="col-span-12 lg:col-span-4 lg:col-start-9">
            {/* `solid` and not `dark`: an outlined pill on ink reads as an empty
                shape, and this is the page's primary conversion. */}
            <CtaPill href={LEGION.cta.href} tone="solid" size="lg" external>
              {LEGION.cta.label}
            </CtaPill>
            <p className="mt-10 border-t border-white/12 pt-5 text-caption-mono uppercase text-white/55">
              {LEGION.statLine}
            </p>
          </div>
        </div>
      </Container>

      {/* Outside the container on purpose. Every other picture and panel on this
          page stops at the 60px gutter; this one does not, and that is the whole
          argument of the section restated in one element. */}
      <div data-reveal className="mt-24">
        <MediaFrame
          label={MEDIA.legion.label}
          spec={MEDIA.legion.spec}
          ratio="21/9"
          tone="dark"
        />
      </div>
    </section>
  );
}
