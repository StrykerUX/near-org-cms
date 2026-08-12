"use client";

import Container from "@/components/primitives/Container";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { gsap, SplitText } from "@/components/primitives/motion/gsapClient";
import { MQ, DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";

// The transition line between the proof ribbon and the dark section. It fills
// in letter by letter as you scroll, with a lime-to-teal front running half a
// step ahead of the fill and fading out behind it.
//
// Two text layers, not a measured clone: the original duplicates the <h2> with
// `cloneNode`, positions it absolutely and syncs `left/top/width` with a
// ResizeObserver. Here both layers live in the SAME grid cell, so they share
// width and line breaking by layout — which removes the clone, the observer,
// and the drift when the font swaps or the width changes.
//
// Both layers holding the same text is what makes `split.chars` line up index
// for index between them.

const STATEMENT =
  "Every blockchain will have to replace its cryptography. NEAR designed accounts so that day is a single transaction, not a migration.";

// Stagger step, in units of the scrubbed timeline. The shine front uses the
// SAME value to start each letter: that is what keeps it glued to the fill
// instead of drifting away over the length of the sentence.
const CHAR_STEP = 0.03;

// How much scroll the wipe takes, relative to the range it would occupy if it
// ran from `top 80%` to `bottom 45%`. 1.2 is a 20% slowdown.
//
// Note this is the ONLY lever for the wipe's speed. Growing CHAR_STEP does not
// slow it down: ScrollTrigger maps the timeline's whole duration onto the
// scroll range whatever that duration is, so a longer timeline just gets
// compressed back. CHAR_STEP sets how tightly the letters are spaced against
// each letter's own fade — i.e. how WIDE the colour front is, not how fast it
// travels.
const WIPE_SLOWDOWN = 1.2;

// Mirrors `--gray-blue`, `--foreground` and `--near-teal` in app/globals.css.
// Literals because GSAP interpolates COLOURS, not declarations: a
// `var(--near-teal)` as a target value never resolves and the tween dies. Same
// call as the inline gradient in `home-v2/ProofStepper.tsx`.
const DIM = "#87959A";
const INK = "#000000";
const TEAL = "#2dd4bf";

export default function StatementWipe() {
  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add({ motionOk: MQ.motion }, (mctx) => {
      const { motionOk } = mctx.conditions as { motionOk: boolean };

      const base = q("[data-statement-base]")[0];
      const shine = q("[data-statement-shine]")[0];
      if (!base || !shine) return;

      if (!motionOk) {
        // No motion: the sentence is already in its final colour and the shine
        // front does not exist. `visibility` rather than `display` so the layer
        // keeps occupying its grid cell and the section's height is unchanged.
        gsap.set(base, { color: "" });
        gsap.set(shine, { autoAlpha: 0 });
        return;
      }

      // `smartWrap` is not optional here: splitting into chars makes every
      // letter its own inline box, so without it the browser is free to break a
      // line INSIDE a word ("transac / tion"). It re-wraps each word in a
      // nowrap span so the line breaks land between words again.
      //
      // `aria: "auto"` on the base layer moves the sentence onto an aria-label
      // and hides the individual chars, so a screen reader reads one sentence
      // instead of 130 letters. The shine layer is already aria-hidden as a
      // whole, so it needs nothing.
      const baseSplit = SplitText.create(base, { type: "chars", smartWrap: true, aria: "auto" });
      const shineSplit = SplitText.create(shine, {
        type: "chars",
        smartWrap: true,
        aria: "none",
      });
      const chars = baseSplit.chars;
      const shineChars = shineSplit.chars;
      if (!chars.length) return;

      gsap.set(shine, { autoAlpha: 1 });
      gsap.set(shineChars, { opacity: 0 });
      gsap.set(chars, { color: DIM });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: base,
          start: "top 80%",
          // The wipe is scrubbed, so its speed is not a duration — it is how
          // much scroll the range covers. `end` is written as an explicit
          // distance rather than as "bottom 45%" because that is the only way
          // to state the rate change exactly: the natural range works out to
          // `height + 0.35vh`, and nudging the 45% would be a different
          // slowdown at every window size and every line count.
          //
          // WIPE_SLOWDOWN more scroll for the same wipe = the front crosses the
          // sentence at 1/WIPE_SLOWDOWN of its old rate.
          end: () =>
            `+=${Math.round((base.offsetHeight + window.innerHeight * 0.35) * WIPE_SLOWDOWN)}`,
          scrub: 0.5,
          // The end is measured, so it has to be re-measured when the window
          // resizes or the sentence re-wraps to a different number of lines.
          invalidateOnRefresh: true,
          markers: DEBUG_MARKERS,
        },
      });

      tl.to(
        chars,
        {
          color: INK,
          duration: 0.16,
          ease: "none",
          stagger: { each: CHAR_STEP },
        },
        0
      );

      shineChars.forEach((c, i) => {
        tl.to(
          c,
          {
            keyframes: [
              { opacity: 1, duration: 0.12, ease: "none" },
              { color: TEAL, opacity: 0.85, duration: 0.2, ease: "none" },
              { color: TEAL, opacity: 0.5, duration: 0.22, ease: "none" },
              { color: TEAL, opacity: 0, duration: 0.4, ease: "none" },
            ],
          },
          i * CHAR_STEP
        );
      });

      // `revert()` on each split and not just on the context: SplitText is DOM
      // surgery, not a tween, so a second mount under StrictMode would split
      // over already-split spans.
      return () => {
        baseSplit.revert();
        shineSplit.revert();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative bg-cream text-foreground">
      {/* The vertical padding comes off the page's column unit (100vw / 7), as
          in home-v2: the air around the sentence then scales with the window
          width rather than sitting at a fixed value. */}
      <Container className="py-[calc((100vw/7)*0.65)]">
        <div className="mx-auto grid max-w-[62rem] px-10 text-center">
          <h2 data-statement-base className="text-h2 [grid-area:1/1] text-pretty">
            {STATEMENT}
          </h2>
          {/* The shine layer is the SAME text, so it is hidden from
              accessibility entirely. It starts invisible: if the JS never runs,
              the sentence shows once, in its final colour. */}
          <p
            data-statement-shine
            aria-hidden="true"
            className="invisible m-0 text-h2 text-sweep [grid-area:1/1] text-pretty"
          >
            {STATEMENT}
          </p>
        </div>
      </Container>
    </section>
  );
}
