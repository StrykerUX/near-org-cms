"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import Surface from "@/components/sections/shells/stage/Surface";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { gsap, SplitText } from "@/components/primitives/motion/gsapClient";
import { allowDescenders } from "@/components/primitives/motion/maskedLines";
import { EASE_OUT } from "@/components/primitives/motion/motionTokens";
import { HERO } from "@/components/sections/foundation/foundationContent";
import { TERRAIN } from "@/components/sections/foundation/c/terrain";

// §1 of variant C — the ground, and something standing on it.
//
// ── Why the page opens on terrain ──────────────────────────────────────────
// The whole variant reads the Foundation as a piece of ground it is holding
// and intends to hand over. That is a literal reading of the deck — a body
// that supports an ecosystem until the ecosystem carries itself — and it gives
// the page one continuous material: the hero is measured ground, the pillars
// are three readings of it, the thesis is a summit withdrawing from it, and
// the operations section is a slope stepping down it.
//
// ── The headline sits on a plateau, not on the curves ─────────────────────
// A contour map has flat zones between two curves, which is the reason this
// shader was chosen over the other two in the repo. The block is placed low
// and left, where the tilt keeps the field open; the subhead goes into a card
// so it holds its own ground rather than competing with the lines under it.
// That card is also the first appearance of the grammar the rest of the page
// is built out of — the reader meets a box before they meet a section of them.
export default function TerrainHero() {
  const rootRef = useMotionScope<HTMLElement>(({ q, motionOk }) => {
    if (!motionOk) return;

    const heading = q("[data-hero-heading]")[0];
    const tl = gsap.timeline({ defaults: { ease: EASE_OUT } });
    let split: SplitText | null = null;
    let cancelled = false;

    // The split waits for the fonts: a line mask measured against the fallback
    // face clips the real one.
    const run = () => {
      if (cancelled || !heading) return;
      split = SplitText.create(heading, { type: "lines", mask: "lines", autoSplit: false });
      allowDescenders(split.lines);
      tl.from(split.lines, { yPercent: 112, autoAlpha: 0, duration: 1.05, stagger: 0.12 }, 0);
    };

    if (document.fonts?.ready) document.fonts.ready.then(run).catch(run);
    else run();

    tl.from(q("[data-hero-item]"), { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.14 }, 0.45);

    return () => {
      cancelled = true;
      split?.revert();
      tl.kill();
    };
  });

  return (
    <section ref={rootRef}>
      <Surface
        palette={TERRAIN.palette}
        bands={TERRAIN.bands}
        scale={TERRAIN.scale}
        tilt={TERRAIN.tilt}
        className="flex min-h-svh flex-col justify-between pb-[10svh] pt-[calc(var(--site-header-block)+7svh)]"
      >
        <Container>
          <div data-hero-item>
            <Eyebrow className="text-ink-soft">{HERO.eyebrow}</Eyebrow>
          </div>
        </Container>

        <Container className="mt-[14svh]">
          <div className="grid-ds items-end gap-y-10">
            <h1
              data-hero-heading
              className="col-span-12 max-w-[17ch] text-h1 text-ink lg:col-span-7 lg:text-statement text-balance"
            >
              Enabling community-driven innovation to{" "}
              <Accent display>benefit people</Accent> around the world
            </h1>

            <div
              data-hero-item
              className="col-span-12 rounded-[1.75rem] bg-background/85 p-6 lg:col-span-4 lg:col-start-9 lg:p-7"
            >
              <p className="max-w-[42ch] text-body text-ink-soft text-pretty">{HERO.sub}</p>
            </div>
          </div>
        </Container>
      </Surface>
    </section>
  );
}
