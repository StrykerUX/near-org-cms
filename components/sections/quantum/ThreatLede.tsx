"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { gsap, SplitText } from "@/components/primitives/motion/gsapClient";
import { MQ, EASE_OUT } from "@/components/primitives/motion/motionTokens";
import CtaPill from "@/components/sections/quantum/CtaPill";

// §3 of the copy deck, restored as its own section.
//
// The shipped section folded §3 and §4 together and lost both headlines. Here §3
// stands on its own, ahead of the statement that answers it — which is the deck's
// own order. It is deliberately quiet: it states the problem and gets out of the
// way, so the sentence below it is the only loud thing in this passage.
//
// Same ground as ConceptRewrite (`--ink-slate`) and directly adjacent to it, so
// the two read as one dark movement rather than two sections.
//
// No eyebrow. The heading already opens with "The quantum threat" and an eyebrow
// above it would say the same words twice — the thing that was just removed from
// the FAQ.

export default function ThreatLede() {
  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const heading = q("[data-lede-heading]")[0];
      const items = q("[data-lede-item]");

      if (heading) {
        SplitText.create(heading, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              autoAlpha: 0,
              stagger: 0.1,
              duration: 0.9,
              ease: EASE_OUT,
              scrollTrigger: { trigger: scope, start: "top 75%", once: true },
            }),
        });
      }

      if (items.length) {
        // Fade only, no rise — the whole passage is meant to sit still so the
        // sentence below is the one thing that moves.
        gsap.from(items, {
          autoAlpha: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "none",
          scrollTrigger: { trigger: scope, start: "top 68%", once: true },
        });
      }
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={rootRef} data-nav-dark className="bg-ink-slate text-white">
      {/* Tight bottom padding on purpose: the statement below opens near the top
          of its own sticky viewport, so anything generous here reads as a hole
          between the two halves of one passage rather than as breathing room. */}
      <Container className="grid gap-12 pb-12 pt-36 lg:grid-cols-2 lg:gap-24">
        <h2 data-lede-heading className="text-h2 text-pretty">
          The quantum threat
          <br />
          <Accent>to blockchains</Accent>
        </h2>

        <div className="flex flex-col gap-8">
          <p data-lede-item className="max-w-[52ch] text-body text-white/65 text-pretty">
            Most blockchains derive account ownership from elliptic-curve cryptography,
            which a quantum computer running Shor&rsquo;s algorithm could reverse to steal
            assets from any address with an exposed public key.
          </p>

          {/* The deck's closing sentence for §3 — "Bloomberg puts as much as
              $470 billion of Bitcoin at risk" — set as a figure rather than run
              on in the paragraph. Same words, promoted; not a rewrite. */}
          <div
            data-lede-item
            className="flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-white/14 pt-6"
          >
            <p className="text-h2">
              <Accent display>$470B</Accent>
            </p>
            {/* No max-width: the label reads as one line beside the figure at
                every width the two-column layout is on. Constraining it wraps it
                to two cramped lines under a number four times its size. */}
            <p className="text-caption text-white/50">
              of Bitcoin at risk to the quantum threat — Bloomberg
            </p>
          </div>

          <div data-lede-item>
            <CtaPill
              href="https://near.org/blog/making-near-protocol-post-quantum-safe"
              size="sm"
              tone="dark"
              external
            >
              How NEAR is preparing for the quantum era
            </CtaPill>
          </div>
        </div>
      </Container>
    </section>
  );
}
