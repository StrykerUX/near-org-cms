"use client";

import Container from "@/components/primitives/Container";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { gsap, SplitText } from "@/components/primitives/motion/gsapClient";
import { MQ, DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import Accent from "@/components/primitives/Accent";
import CtaPill from "@/components/sections/quantum/CtaPill";
import NearMark from "@/components/sections/quantum/NearMark";

// §4 of the copy deck — "A key rotation, not a migration".
//
// The two deck sections share a premise and differ only in how they finish. So
// write the premise once and let the ending change under it: the head of the
// sentence never moves while its tail is replaced, word by word, on scroll. What
// the reader watches is the cost of the same problem being rewritten.
//
// Pairs with `ThreatLede` directly above it, on the same ground, which carries
// §3. That is why there is no eyebrow here and no threat copy — the section
// above already said it. Together they replace the paired-rows treatment that
// shipped first; see the README.
//
// NOTHING TRANSLATES VERTICALLY in this section, by decision. Every transition is
// a fade or a colour change in place. A drifting line pulls the eye off the pivot
// word, which is the one thing the reader is meant to be watching.

const HEAD = "Defending against quantum attack means";
const TAIL_BEFORE = "migrating the address itself.";
const TAIL_AFTER = "rotating one key.";

const TRAVEL = "100svh";

// Literals because GSAP interpolates COLOURS, not declarations — a var() as a
// tween target never resolves. Same call as StatementWipe.
//
// GROUND is the section's own background. The old ending does not fade out and it
// does not go grey: each letter's colour is driven to the exact background value,
// so it dissolves into the page rather than dimming and then vanishing. Fading
// opacity instead reads as the text going black first, because what shows through
// mid-fade is the dark ground.
const GROUND = "#222627"; // --ink-slate
// White at 45% flattened onto GROUND. Set explicitly so the dissolve interpolates
// opaque → opaque; from a translucent start GSAP has to move alpha as well, and
// the midpoint goes muddy.
const FADED = "#858888";
const SWEEP = "#f4ff7a";
const TEAL = "#2dd4bf";
const ACCENT = "#00DC8D";

// Timeline positions, in the scrubbed timeline's own units. The whole thing is
// mapped onto TRAVEL, so these are proportions of the scroll, not seconds.
const OUT_START = 0.08;
const OUT_SPAN = 0.3; // first letter dissolving → last letter starting
const IN_START = 0.5;
const IN_SPAN = 0.28;

export default function RotationStatement() {
  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add({ motionOk: MQ.motion, isDesktop: MQ.desktop }, (mctx) => {
      const { motionOk, isDesktop } = mctx.conditions as {
        motionOk: boolean;
        isDesktop: boolean;
      };

      const before = q("[data-tail-before]")[0];
      const after = q("[data-tail-after]")[0];
      const notes = q("[data-note]");
      if (!before || !after) return;

      // Without motion the two endings simply stack — struck through, then the
      // replacement. The argument survives with no scroll at all, which is the
      // test any scroll-driven idea has to pass.
      if (!motionOk || !isDesktop) return;

      const host = scope as HTMLElement;
      host.dataset.swap = "on";

      // Chars, not words. Both halves of the swap are letter-by-letter: the old
      // ending erases a letter at a time and the new one is written a letter at
      // a time. Word-level granularity made the erase read as three chunks
      // disappearing rather than as text being rewritten.
      //
      // `smartWrap` is not optional with chars — every letter becomes its own
      // inline box, so without it the browser may break a line mid-word.
      const beforeSplit = SplitText.create(before, {
        type: "chars",
        smartWrap: true,
        aria: "none",
      });
      const afterSplit = SplitText.create(after, {
        type: "chars",
        smartWrap: true,
        aria: "none",
      });

      gsap.set(beforeSplit.chars, { color: FADED });
      gsap.set(afterSplit.chars, { autoAlpha: 0 });
      gsap.set(notes, { autoAlpha: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scope,
          start: "top top",
          end: "bottom bottom",
          // Tighter than the usual 0.6: a long scrub lags behind the wheel and
          // the whole interaction feels heavier than it is.
          scrub: 0.3,
          invalidateOnRefresh: true,
          markers: DEBUG_MARKERS,
        },
      });

      // The old ending dissolves left to right, in reading order, each letter's
      // colour driven to the background. The stagger span is normalised by the
      // character count so the erase always takes the same share of the scroll
      // no matter how long the string is.
      tl.to(
        beforeSplit.chars,
        {
          color: GROUND,
          duration: 0.16,
          ease: "none",
          stagger: { each: OUT_SPAN / Math.max(1, beforeSplit.chars.length - 1) },
        },
        OUT_START
      );

      // The new ending is written in the same direction, each letter arriving
      // through the page's own lime → teal → green ramp, so it reads as the same
      // light that wipes the statements elsewhere.
      const inStep = IN_SPAN / Math.max(1, afterSplit.chars.length - 1);
      afterSplit.chars.forEach((c, i) => {
        tl.to(
          c,
          {
            keyframes: [
              { autoAlpha: 1, color: SWEEP, duration: 0.08, ease: "none" },
              { color: TEAL, duration: 0.1, ease: "none" },
              { color: ACCENT, duration: 0.14, ease: "none" },
            ],
          },
          IN_START + i * inStep
        );
      });

      // Placed after the last letter has finished its ramp. The timeline runs
      // past 1.0 here, which is fine — scrub normalises whatever total it gets
      // onto the scroll range.
      tl.to(notes, { autoAlpha: 1, duration: 0.14, stagger: 0.05, ease: "none" }, ">0.04");

      return () => {
        delete host.dataset.swap;
        beforeSplit.revert();
        afterSplit.revert();
        gsap.set(notes, { clearProps: "opacity,visibility" });
      };
    });

    return () => mm.revert();
  }, []);

  return (
    // No overflow-hidden: an ancestor with overflow other than visible becomes
    // the sticky child's scroll container and it stops sticking.
    <section
      ref={rootRef}
      data-nav-dark
      data-swap="off"
      style={{ "--travel": TRAVEL } as React.CSSProperties}
      className="group/swap relative bg-ink-slate text-white data-[swap=on]:h-[calc(100svh+var(--travel))]"
    >
      {/* Anchored to the TOP of the sticky viewport, not centred. Centring a
          block that is much shorter than the viewport pushes the statement into
          the middle of the screen, which opens a hole between it and the lede
          above — the two are one passage and should sit close. */}
      <div className="group-data-[swap=on]/swap:sticky group-data-[swap=on]/swap:top-0 group-data-[swap=on]/swap:flex group-data-[swap=on]/swap:h-svh group-data-[swap=on]/swap:items-start">
        {/* Statement pinned to the top, evidence to the bottom, air between them.
            Stacking both at the top instead leaves a third of the viewport empty
            under the footnote, which reads as a hole rather than as space. */}
        <Container className="flex w-full flex-col gap-12 pb-40 pt-16 group-data-[swap=on]/swap:h-full group-data-[swap=on]/swap:justify-between group-data-[swap=on]/swap:pb-[9svh] group-data-[swap=on]/swap:pt-[9svh]">
          <p className="max-w-[18ch] text-statement text-balance">
            {HEAD}{" "}
            {/* The two endings occupy one grid cell while the swap is armed, so
                the head never reflows as the tail changes length. With the swap
                off they fall back to normal flow and stack. */}
            <span className="grid">
              <span
                data-tail-before
                className="text-white/45 line-through decoration-1 group-data-[swap=on]/swap:no-underline group-data-[swap=on]/swap:[grid-area:1/1]"
              >
                {TAIL_BEFORE}
              </span>
              <span
                data-tail-after
                className="text-near-green-accent group-data-[swap=on]/swap:[grid-area:1/1]"
              >
                {TAIL_AFTER}
              </span>
            </span>
          </p>

          {/* §4's body and link, at footnote scale. The headline compresses the
              argument; this carries the evidence. §3 is not repeated here — the
              section above owns it. */}
          <div className="grid gap-6 border-t border-white/14 pt-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
            {/* Not an Eyebrow: this is the section's own signature, so it is set
                in Kepler at heading scale with the mark beside it rather than as
                a small uppercase label.
                `text-h4` sits on the WRAPPER so the mark can be sized in `em` and
                track the type — a fixed px size would drift away from the text at
                the ends of the fluid range. `Accent` supplies Kepler italic at
                1.18× the wrapper, which is the DS's serif-inside-sans rule. */}
            <div
              data-note
              className="flex items-center gap-4 text-h4 text-near-green-accent"
            >
              <NearMark className="size-[0.85em] shrink-0" />
              <span>
                <Accent>NEAR&rsquo;s answer</Accent>
              </span>
            </div>
            <div data-note className="flex flex-col items-start gap-5">
              <p className="max-w-[58ch] text-body text-white/65 text-pretty">
                On most chains, an address is derived from a keypair, so defending against
                quantum attack means migrating the address itself. NEAR accounts are
                decoupled from cryptography, so an account holder rotates to quantum-safe
                keys in a single transaction and keeps the same account.
              </p>
              <CtaPill
                href="https://docs.near.org/protocol/accounts-contracts/account-model"
                size="sm"
                tone="dark"
                external
              >
                How the NEAR account model works
              </CtaPill>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
