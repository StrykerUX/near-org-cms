"use client";

import { useRef } from "react";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { onViewportToggle } from "@/components/primitives/motion/pauseOffscreen";
import { gsap, ScrollTrigger, SplitText } from "@/components/primitives/motion/gsapClient";
import { allowDescenders } from "@/components/primitives/motion/maskedLines";
import { MQ, EASE_OUT } from "@/components/primitives/motion/motionTokens";
import CtaPill from "@/components/primitives/CtaPill";
import {
  createQuantumLattice,
  type LatticeHandle,
} from "@/components/sections/quantum-security-copy/quantumLattice";

// Hero for /quantum-security: the node field along the bottom, the
// centred headline, and a CTA that drops to the roadmap.
//
// The top gradient is not decoration: the field reaches all the way up and
// without that mask the nodes compete with the headline. It is its own layer
// rather than a `mask-image` on the canvas because it has to sit ABOVE the
// canvas but below the text, and the canvas still needs to receive the pointer.

export default function QuantumHero() {
  const fieldRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add({ motionOk: MQ.motion }, (mctx) => {
      const { motionOk } = mctx.conditions as { motionOk: boolean };

      // ── node field ──────────────────────────────────────────────────────
      // With reduced motion the field still draws, just frozen: it is the
      // section's background, not an ornament, and removing it leaves the hero
      // empty.
      let lattice: LatticeHandle | null = null;
      const field = fieldRef.current;
      const canvas = canvasRef.current;

      if (field && canvas) {
        lattice = createQuantumLattice(canvas, field, { wave: motionOk });

        if (lattice) {
          // The canvas rect is cached instead of read per event. Reading it in
          // the handler meant a forced layout on every `pointermove` — dozens a
          // second — to get a value that only changes on resize or scroll.
          //
          // `left` is refreshed on ScrollTrigger's refresh (which fires on
          // resize) and `top` on every scroll, because the field is not fixed:
          // its viewport position moves as the page scrolls, and a stale `top`
          // would put the halo above or below the cursor. `scrollY` is read from
          // the event handler, which is a cached value, not a layout read.
          let rectLeft = 0;
          let rectTop = 0;
          let rectPageTop = 0;
          const measure = () => {
            const r = canvas.getBoundingClientRect();
            rectLeft = r.left;
            rectTop = r.top;
            rectPageTop = r.top + window.scrollY;
          };
          measure();
          ScrollTrigger.addEventListener("refresh", measure);

          const onMove = (e: PointerEvent) => {
            rectTop = rectPageTop - window.scrollY;
            lattice!.setPointer(e.clientX - rectLeft, e.clientY - rectTop);
          };
          const onLeave = () => lattice!.clearPointer();
          field.addEventListener("pointermove", onMove, { passive: true });
          field.addEventListener("pointerleave", onLeave, { passive: true });

          // Off screen, the loop does not draw. The hero is the first thing on
          // the page, so without this it would keep repainting the whole field
          // while the reader is down at the roadmap.
          onViewportToggle(field, (v) => lattice!.setVisible(v));

          mctx.add(() => {
            ScrollTrigger.removeEventListener("refresh", measure);
            field.removeEventListener("pointermove", onMove);
            field.removeEventListener("pointerleave", onLeave);
          });
        }
      }

      // ── headline entrance ───────────────────────────────────────────────
      if (!motionOk) {
        return () => lattice?.destroy();
      }

      const heading = q("[data-hero-heading]")[0];
      const rest = q("[data-hero-item]");

      const tl = gsap.timeline({ defaults: { ease: EASE_OUT } });

      if (heading) {
        // `mask: "lines"` wraps each line in an overflow container, so the text
        // rises FROM behind its own line rather than floating in. `autoSplit`
        // re-splits when the width changes.
        SplitText.create(heading, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) => {
            allowDescenders(self.lines);
            return gsap.from(self.lines, {
              yPercent: 110,
              autoAlpha: 0,
              stagger: 0.12,
              duration: 1,
              ease: EASE_OUT,
            });
          },
        });
      }

      tl.from(rest, { y: 24, autoAlpha: 0, duration: 0.8, stagger: 0.12 }, 0.35);

      return () => lattice?.destroy();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-svh flex-col overflow-hidden bg-cream text-foreground"
    >
      {/* No pointer-events-none here: the pointer halo is half of what the field
          does, so this layer DOES take the mouse. The nav pill sits above with
          its own pointer-events and is not covered. */}
      <div ref={fieldRef} aria-hidden="true" className="absolute inset-0 z-0">
        <canvas ref={canvasRef} className="absolute left-0 top-0 block" />
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 z-10 h-2/5 bg-gradient-to-b from-cream to-transparent"
      />

      <Container className="relative z-20 flex flex-1 flex-col items-center justify-center gap-7 pb-36 pt-14 text-center">
        {/* The sheen wraps ONLY the sans line. On the <h1> it also ran through
            the serif line below, and `color: transparent` there flattened the
            italic into the same moving green — the two lines stopped reading as
            a statement and its accent.
            Left inline rather than inline-block: SplitText masks each line, and
            an inline-block child fights that. With the default
            `box-decoration-break: slice` the gradient still resolves across
            fragments if the line ever wraps. */}
        <h1 data-hero-heading className="text-display text-pretty">
          <span data-q-sheen>Post quantum security,</span>
          <br />
          <Accent display>live on mainnet</Accent>
        </h1>

        <p
          data-hero-item
          className="max-w-[38rem] text-body-lg text-ink-soft text-pretty"
        >
          Quantum computing threatens the cryptography that secures every blockchain. NEAR
          accounts are decoupled from cryptography by design, so upgrading to post-quantum
          security takes a single key rotation. Post-quantum signing is live on NEAR mainnet
          today.
        </p>

        {/* A native anchor rather than a JS smooth scroll: the page's scroll is
            governed by Lenis from PrototypeMotionProvider, and sections are
            forbidden from importing `@/components/site/*`, so there is no legal
            way to ask it for a `lenis.scrollTo()`. A
            `window.scrollTo({behavior:'smooth'})` here would fight the virtual
            scroll. Same limitation as NearStack's rail — see the README. */}
        <div data-hero-item>
          <CtaPill href="#roadmap" tone="filled">
            See NEAR&rsquo;s quantum roadmap
          </CtaPill>
        </div>
      </Container>
    </section>
  );
}
