"use client";

import { useRef } from "react";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { gsap, SplitText } from "@/components/primitives/motion/gsapClient";
import { allowDescenders } from "@/components/primitives/motion/maskedLines";
import { createSeededRandom } from "@/components/primitives/motion/seededRandom";
import { createGlyphShine, type GlyphShine } from "@/components/primitives/motion/glyphShine";
import { MQ, EASE_OUT, DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { CHAINS, FORWARD_BODY, FORWARD_CODA } from "@/components/sections/chain/chainContent";

// §5b — the forward turn, and the page's exhale.
//
// ── Why this is its own section and not a block inside CompletePicture ─────
// Everything above this point is the page ARGUING: diagrams that assemble,
// hairlines, mono labels, figures scrubbed to the wheel, a dark technical
// stack. This is the one place that stops arguing. The copy turns from what the
// system does to what it means for a person, and nothing about the page's
// behaviour was turning with it — same ground, same scale, same wheel-driven
// motion, so the emotional beat arrived dressed as another spec.
//
// So every register the page established is deliberately inverted here:
//
//   the page                          this section
//   ────────────────────────────────  ──────────────────────────────────────
//   cream ground                      white, and light GROWS into it
//   diagrams, rules, mono labels      none of the three
//   motion scrubbed to the wheel      self-paced: plays once, on its own clock
//   h1/h2 at a reading measure        `text-statement`, the DS role for the
//                                     short phrase that spans the section
//   marks assemble and accumulate     the marks let go
//   flat ink type                     light passes THROUGH the words
//
// The self-paced motion is the one that matters most and is easiest to undo by
// accident. Every other reveal on this page is tied to the reader's wheel — they
// turn it, the page responds. Here the reader stops steering and the section
// breathes on its own. Re-attaching this to a scrub would make it one more
// section that does what it is told.

// ── The motif, third and last time ─────────────────────────────────────────
// The hero collapses thirty-five tickers into a point. `BuildersCta` fans one
// mark back out to thirty-five. Here they simply LET GO: a handful drift upward
// and dissolve, and nothing replaces them. That is the section's sentence —
// "the chain stops being something you manage" — as a picture, and it is the
// only one of the three that resolves to empty.
const RELEASE_COUNT = 9;

const round = (n: number) => Math.round(n * 1e4) / 1e4;

const RELEASED = Array.from({ length: RELEASE_COUNT }, (_, i) => {
  // Seeded, like the hero's field: identical on server and client, stable
  // across rebuilds. See the note in ChainHero.
  const rand = createSeededRandom(7700 + i * 13);
  return {
    // Spread across the width, kept off the extreme edges.
    label: CHAINS[(i * 4 + 1) % CHAINS.length],
    left: round(6 + (i / (RELEASE_COUNT - 1)) * 84 + (rand() - 0.5) * 7),
    top: round(12 + rand() * 62),
    // How far each one rises before it is gone, in svh. The spread is what
    // stops them reading as one object moving.
    rise: round(14 + rand() * 20),
    delay: round(rand() * 1.1),
    duration: round(3.4 + rand() * 2.2),
  };
});

export default function ForwardTurn() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const shineHostRef = useRef<HTMLDivElement>(null);

  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    // `gsap.matchMedia` with MQ.motion directly, and NOT `useMotionScope`:
    // this scene does not care about the desktop breakpoint, and declaring
    // `isDesktop` as a condition would tear down and rebuild the whole thing
    // when the window crosses 1024px — which, for a `once: true` reveal, means
    // replaying it in the reader's face. The parent README calls this out.
    mm.add({ motionOk: MQ.motion }, () => {
      let shine: GlyphShine | null = null;

      // ── light grows into the section ────────────────────────────────────
      // The bloom is the whole "breath of fresh air" in one element: the page
      // has been flat ink on flat cream for five sections, and here the ground
      // gets brighter as the reader arrives. It scales as well as fades, so it
      // reads as light spreading rather than a layer being switched on.
      const tl = gsap.timeline({
        defaults: { ease: EASE_OUT },
        scrollTrigger: {
          trigger: scope,
          start: "top 74%",
          once: true,
          markers: DEBUG_MARKERS,
        },
      });

      tl.fromTo(
        q("[data-bloom]"),
        { autoAlpha: 0, scale: 0.82 },
        { autoAlpha: 1, scale: 1, duration: 2.4, ease: "power2.out" },
        0
      );

      // ── the heading, and the light inside it ────────────────────────────
      const heading = headingRef.current;
      const host = shineHostRef.current;
      const canvas = canvasRef.current;

      if (heading) {
        SplitText.create(heading, {
          // Lines for the mask reveal, chars for the shine: the mask makes each
          // line rise from behind itself, and the shine needs one element per
          // glyph to bake reading order into its mask.
          type: "lines,chars",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) => {
            allowDescenders(self.lines);

            // `autoSplit` re-splits on a width change, which throws away the
            // char elements the shine was masking. Handing it the new ones is
            // cheaper than rebuilding the WebGL context, which is exactly what
            // `setChars` exists for.
            if (shine) {
              shine.setChars(self.chars as HTMLElement[]);
              shine.remeasure();
            } else if (host && canvas) {
              shine = createGlyphShine(canvas, {
                chars: self.chars as HTMLElement[],
                host,
                observe: heading,
                // Close to white with only a bias toward mint, and dialled
                // well down. At a saturated tint the swept glyphs read as GREEN
                // TEXT — a second colour in the heading — rather than as ink
                // with light crossing it. The distinction is the whole effect:
                // the words should look lit, not recoloured.
                tint: [0.74, 0.98, 0.86],
                intensity: 0.55,
                padEm: 0.6,
              });
              // `createGlyphShine` returns null without usable WebGL2, and that
              // is a supported outcome, not a failure: the reveal below is
              // plain DOM and runs either way. The shine is an added layer.
              if (shine) shine.setVisible(true);
            }

            return gsap.from(self.lines, {
              yPercent: 108,
              autoAlpha: 0,
              // Slower and more spread out than any other reveal on the page.
              // The pace IS the register change — the same movement at the
              // page's usual speed reads as another section arriving.
              duration: 1.5,
              stagger: 0.22,
              ease: "power3.out",
            });
          },
        });

        // The light front sweeps the words ONCE, after they have landed. It
        // starts before the first glyph and ends past the last (the factory
        // takes values outside [0,1] for exactly this), so the light enters and
        // leaves the phrase instead of appearing pinned to its ends.
        const front = { f: -0.3 };
        tl.to(
          front,
          {
            f: 1.3,
            duration: 3.2,
            ease: "power1.inOut",
            onUpdate: () => shine?.setFront(front.f),
          },
          0.9
        );
      }

      // ── the marks let go ────────────────────────────────────────────────
      // Each on its own duration and delay, so they scatter in time as well as
      // in space. They are never brought back.
      q("[data-released]").forEach((el, i) => {
        const r = RELEASED[i];
        tl.fromTo(
          el,
          { autoAlpha: 0, y: 0 },
          { autoAlpha: 0.42, duration: 1.1, ease: "power1.out" },
          r.delay
        ).to(
          el,
          {
            y: `-${r.rise}svh`,
            autoAlpha: 0,
            duration: r.duration,
            ease: "power1.out",
          },
          r.delay + 0.5
        );
      });

      // ── the prose, and the line it lands on ─────────────────────────────
      tl.from(q("[data-forward]"), { y: 34, autoAlpha: 0, duration: 1.2, stagger: 0.28 }, 0.7)
        // The coda waits. It is the page's last thought, and arriving on the
        // same stagger as the paragraph above it makes it a fourth paragraph.
        .from(q("[data-coda]"), { y: 26, autoAlpha: 0, duration: 1.6 }, "+=0.35");

      return () => {
        shine?.destroy();
        shine = null;
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    // `isolate` bounds the blend group and the white ground goes INSIDE it, so
    // the shine's `screen` has a base: over white, screen is identity, which is
    // what confines the glow to the dark glyphs. Same construction as
    // `primitives/ShineField`.
    //
    // White and not cream: after five cream-and-ink sections, the plain lift to
    // #ffffff is felt before it is noticed.
    <section
      ref={rootRef}
      className="relative isolate overflow-hidden bg-white py-[22svh]"
    >
      {/* The bloom. Two stops and a lot of spread — a hard-edged glow would be
          one more drawn object, and this section's whole job is to stop drawing
          objects. */}
      <div
        data-bloom
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 aspect-square w-[140%] max-w-[1600px] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(circle, rgba(139,242,156,0.20) 0%, rgba(139,242,156,0.07) 34%, rgba(139,242,156,0) 68%)",
        }}
      />

      {/* The cream-to-white seam, dissolved.
          The lift to white is the section's opening gesture, and butted
          straight against the cream above it that gesture arrives as a hard
          horizontal edge — a panel change, which is the one thing this section
          should not read as. Fading the two grounds into each other over a
          band of scroll makes the light seem to arrive rather than switch on.
          It fades cream to TRANSPARENT, not cream to white. To white it is an
          opaque band, and an opaque band sitting over the bloom cuts the bloom
          off along its own bottom edge — trading the seam at the section
          boundary for a second, worse one in open space. Fading to nothing lets
          the white ground and the light behind it come through continuously. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[20svh] bg-gradient-to-b from-cream to-transparent"
      />

      {/* The released marks. Behind the type, never over it. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        {RELEASED.map((r, i) => (
          <span
            key={`${r.label}-${i}`}
            data-released
            className="absolute text-caption-mono text-ink"
            style={{ left: `${r.left}%`, top: `${r.top}%`, opacity: 0 }}
          >
            {r.label}
          </span>
        ))}
      </div>

      <Container>
        <div className="grid-ds">
          <div className="col-span-12 lg:col-span-9 lg:col-start-3">
            {/* The shine host: the canvas is positioned against this box, so it
                has to be the heading's `relative` ancestor and nothing else. */}
            <div ref={shineHostRef} className="relative">
              <h2 ref={headingRef} className="text-statement text-pretty">
                Built for what
                <br />
                <Accent display>transacts next</Accent>
              </h2>

              {/* After the heading in the DOM so paint order puts it on top
                  without a z-index. Starts at 0×0 via class — the styles
                  glyphShine writes imperatively always beat the class. */}
              <canvas
                ref={canvasRef}
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-0 h-0 w-0 mix-blend-screen"
              />
            </div>

            <div className="mt-16 max-w-[46rem] space-y-9">
              {FORWARD_BODY.map((p, i) => (
                <p
                  key={p.slice(0, 24)}
                  data-forward
                  // The middle paragraph is the argument; the two around it are
                  // its setup and its landing. It gets the larger size and the
                  // full ink, they recede.
                  className={
                    i === 1
                      ? "text-body-lg text-ink text-pretty"
                      : "text-body text-ink-soft text-pretty"
                  }
                >
                  {p}
                </p>
              ))}
            </div>

            {/* The coda. Serif, alone, with air on every side — the only line
                in the section that is not part of a paragraph. */}
            <p data-coda className="mt-20 max-w-[24ch] text-h2-serif text-ink text-pretty">
              {FORWARD_CODA}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
