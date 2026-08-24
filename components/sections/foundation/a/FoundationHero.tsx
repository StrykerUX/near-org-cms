"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { gsap, SplitText } from "@/components/primitives/motion/gsapClient";
import { allowDescenders } from "@/components/primitives/motion/maskedLines";
import { EASE_OUT } from "@/components/primitives/motion/motionTokens";
import { HERO } from "@/components/sections/foundation/foundationContent";

// §1 of variant A — the page's opening, and the place its one visual argument
// is set up.
//
// ── The rule at the foot is not a divider ──────────────────────────────────
// It is the page's UNIT. The hero closes on a hairline that spans the whole
// container: the full measure. `Pillars` then splits that measure into three
// equal parts, and `Devolution` takes the same rule and shortens it, line after
// line, until there is almost nothing left. Three sections, one stroke, one
// argument — an organisation that starts at full width and plans to end at
// none.
//
// That is why this rule is full-bleed to the container and not inset, and why
// it is the LAST thing in the hero rather than the first thing in the next
// section: the reader has to meet the whole measure before anything is taken
// off it.
export default function FoundationHero() {
  const rootRef = useMotionScope<HTMLElement>(({ q, motionOk }) => {
    if (!motionOk) return;

    const heading = q("[data-hero-heading]")[0];
    const tl = gsap.timeline({ defaults: { ease: EASE_OUT } });
    let split: SplitText | null = null;
    let cancelled = false;

    // The split waits for the fonts to measure. Until then the headline is on
    // screen and simply not animated: if `fonts.ready` never resolves, the worst
    // case is a hero without an entrance, never a hero without a headline.
    const run = () => {
      if (cancelled || !heading) return;
      split = SplitText.create(heading, { type: "lines", mask: "lines", autoSplit: false });
      allowDescenders(split.lines);
      tl.from(split.lines, { yPercent: 112, autoAlpha: 0, duration: 1, stagger: 0.11 }, 0);
    };

    if (document.fonts?.ready) document.fonts.ready.then(run).catch(run);
    else run();

    tl.from(q("[data-hero-item]"), { y: 22, autoAlpha: 0, duration: 0.8, stagger: 0.12 }, 0.35)
      // The measure draws itself last, and from the left, so the reader watches
      // it being laid down before the page starts taking it away.
      .from(q("[data-hero-rule]"), { scaleX: 0, duration: 1.1 }, 0.6);

    return () => {
      cancelled = true;
      split?.revert();
      tl.kill();
    };
  });

  return (
    <section
      ref={rootRef}
      className="bg-cream pb-[6svh] pt-[calc(var(--site-header-block)+6svh)]"
    >
      <Container>
        <div data-hero-item>
          <Eyebrow className="text-gray-intermediate">{HERO.eyebrow}</Eyebrow>
        </div>

        <div className="mt-12 grid-ds gap-y-12">
          {/* `text-h1` up to lg and `text-statement` past it. The headline is
              twenty words long: at `text-display` it takes five lines on a
              laptop and stops being a headline. */}
          <h1
            data-hero-heading
            className="col-span-12 max-w-[20ch] text-h1 lg:col-span-8 lg:text-statement text-balance"
          >
            Enabling community-driven innovation to{" "}
            <Accent display>benefit people</Accent> around the world
          </h1>

          <p
            data-hero-item
            className="col-span-12 max-w-[46ch] text-body-lg text-ink-soft lg:col-span-4 lg:col-start-9 lg:self-end text-pretty"
          >
            {HERO.sub}
          </p>
        </div>

        <div
          data-hero-rule
          className="mt-[10svh] h-px w-full origin-left bg-rule"
          aria-hidden="true"
        />
      </Container>
    </section>
  );
}
