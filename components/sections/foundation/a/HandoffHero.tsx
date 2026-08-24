"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { gsap, SplitText } from "@/components/primitives/motion/gsapClient";
import { allowDescenders } from "@/components/primitives/motion/maskedLines";
import { EASE_OUT } from "@/components/primitives/motion/motionTokens";
import { HERO } from "@/components/sections/foundation/foundationContent";

// §1 of variant C — big by space, not by type.
//
// This variant spends all of its audacity on one scene in the middle of the
// page, so the hero has to be large without competing with it. It gets a whole
// viewport and puts almost nothing in it: eyebrow at the top, headline and
// subhead at the foot, and the empty middle is the composition. The headline
// stays at `text-statement` rather than `text-display` because it is twenty
// words long — at display scale it takes five lines on a laptop and stops being
// a headline.
export default function HandoffHero() {
  const rootRef = useMotionScope<HTMLElement>(({ q, motionOk }) => {
    if (!motionOk) return;

    const heading = q("[data-hero-heading]")[0];
    const tl = gsap.timeline({ defaults: { ease: EASE_OUT } });
    let split: SplitText | null = null;
    let cancelled = false;

    // The split waits for the fonts to measure — a line mask sized against the
    // fallback face clips the real one. Until then the headline is on screen
    // and simply not animated.
    const run = () => {
      if (cancelled || !heading) return;
      split = SplitText.create(heading, { type: "lines", mask: "lines", autoSplit: false });
      allowDescenders(split.lines);
      tl.from(split.lines, { yPercent: 112, autoAlpha: 0, duration: 1.05, stagger: 0.12 }, 0);
    };

    if (document.fonts?.ready) document.fonts.ready.then(run).catch(run);
    else run();

    tl.from(q("[data-hero-item]"), { y: 22, autoAlpha: 0, duration: 0.85, stagger: 0.14 }, 0.4);

    return () => {
      cancelled = true;
      split?.revert();
      tl.kill();
    };
  });

  return (
    <section
      ref={rootRef}
      className="flex min-h-svh flex-col justify-between bg-cream pb-[12svh] pt-[calc(var(--site-header-block)+8svh)]"
    >
      <Container>
        <div data-hero-item>
          <Eyebrow className="text-gray-intermediate">{HERO.eyebrow}</Eyebrow>
        </div>
      </Container>

      <Container className="mt-[18svh]">
        <div className="grid-ds gap-y-12">
          <h1
            data-hero-heading
            className="col-span-12 max-w-[18ch] text-h1 lg:col-span-7 lg:text-statement text-balance"
          >
            Enabling community-driven innovation to{" "}
            <Accent display>benefit people</Accent> around the world
          </h1>

          <p
            data-hero-item
            className="col-span-12 max-w-[44ch] text-body-lg text-ink-soft lg:col-span-4 lg:col-start-9 lg:self-end text-pretty"
          >
            {HERO.sub}
          </p>
        </div>
      </Container>
    </section>
  );
}
