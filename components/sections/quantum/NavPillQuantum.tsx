"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";
import Container from "@/components/primitives/Container";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { MQ } from "@/components/primitives/motion/motionTokens";

// The quantum rebuild's nav pill. It differs from `home-v2/NavPillV2` in the
// three ways that matter — frosted light background instead of solid black,
// full width with separated groups instead of shrink-to-fit, and ink that
// inverts over dark sections — so it is its own file, not a variant. See the
// rule in `components/sections/home-v2/README.md`: two folders holding the same
// file diverge in silence.
//
// The retract gesture IS the same as NavPillV2's, because in the original it
// comes from `effects.js` (NearFx), which both pages load.

// Order is deliberate and not alphabetical: Developers first because it is the
// most-used, About last because it is the least. Every one of them is a
// dropdown, hence the chevron on each.
const LINKS = [
  { label: "Developers" },
  { label: "Stack" },
  { label: "Founders" },
  { label: "About" },
];

// Extra clearance below the pill as it retracts, so no edge stays peeking.
const HIDE_MARGIN = 12;

export default function NavPillQuantum() {
  const rootRef = useGsapContext<HTMLDivElement>((_self, scope) => {
    const mm = gsap.matchMedia();
    const nav = scope.querySelector<HTMLElement>("[data-nav]");

    // ── ink over dark sections ───────────────────────────────────────────
    // Runs ALWAYS, reduced-motion included: this is not an animation, it is
    // legibility. Without it the 72%-black label sits on a mid-grey frosted
    // panel while the pill crosses the `--ink-slate` section.
    //
    // Fidelity note: the original has all of this wiring (the `data-nav-dark`
    // attribute on sections, the logo filter, the link colours) but its
    // `apply()` writes the light values down both branches, so the flip never
    // actually happens. It is restored here, because an attribute with no
    // effect is clearly a bug rather than a decision.
    let raf = 0;
    let tone: string | null = null;

    const measure = () => {
      raf = 0;
      if (!nav) return;
      const r = nav.getBoundingClientRect();
      const mid = r.top + r.height / 2;
      // The DOM is queried on every measurement rather than once on mount: the
      // dark sections are siblings of this component, not descendants, so they
      // may not exist yet when it mounts.
      const dark = Array.from(document.querySelectorAll("[data-nav-dark]")).some((sec) => {
        const sr = sec.getBoundingClientRect();
        return sr.top <= mid && sr.bottom >= mid;
      });
      const next = dark ? "dark" : "light";
      if (next === tone) return;
      tone = next;
      nav.dataset.tone = next;
    };

    // A data-attribute is written instead of calling setState: this reacts to
    // every scroll event, and re-rendering React per event to change two
    // colours is exactly what the rest of the toolkit avoids.
    const onScrollTone = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScrollTone, { passive: true });
    window.addEventListener("resize", onScrollTone);

    // ── 1:1 retraction with the gesture ──────────────────────────────────
    mm.add(MQ.motion, () => {
      // quickSetter and not gsap.to(): this runs on every scroll event, and a
      // tween per event would mean instantiating hundreds of objects a second
      // to write one property.
      const setY = gsap.quickSetter(scope, "y", "px") as (v: number) => void;

      let last = window.scrollY;
      let offset = 0;

      const onScroll = () => {
        const y = window.scrollY;
        const delta = y - last;
        last = y;

        const hidden = -(scope.offsetHeight + HIDE_MARGIN);
        offset = Math.min(0, Math.max(hidden, offset - delta));
        // Always visible at the very top: without this, a negative scroll
        // bounce on iOS can leave it hidden at the top of the page.
        if (y <= 2) offset = 0;

        setY(offset);
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        window.removeEventListener("scroll", onScroll);
        setY(0);
      };
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScrollTone);
      window.removeEventListener("resize", onScrollTone);
      mm.revert();
    };
  }, []);

  return (
    // pointer-events-none on the wrapper and auto on the pill: the wrapper spans
    // the full viewport width and without this would swallow clicks meant for
    // whatever is underneath (the hero occupies that same band, and its canvas
    // listens for the pointer).
    <div
      ref={rootRef}
      className="pointer-events-none fixed inset-x-0 top-0 z-50 will-change-transform"
    >
      <Container className="pt-6">
        <nav
          data-nav
          data-tone="light"
          // No border: the frosted panel carries its own edge against the page.
          // Near-black rather than a light fill, so the type is light in both
          // states and the tone flip never has to swap it.
          // The alpha is high because the composite is what the eye judges, not
          // the declared colour: rgba(10,10,10) at 0.68 over the cream page
          // resolves to #555 — a mid grey. 0.9 lands it at #1f1f1f, which reads
          // as near-black while the blur still picks up what passes underneath.
          // The flip earns its keep by holding that appearance constant: the
          // same alpha over the `--ink-slate` section would be indistinguishable
          // from the ground, so that state eases off to keep an edge.
          className="group/nav pointer-events-auto mx-auto flex w-full max-w-[1240px] items-center justify-between gap-10 rounded-full py-2 pl-7 pr-2 backdrop-blur-[18px] backdrop-saturate-150 transition-colors duration-300 bg-[rgba(10,10,10,0.9)] text-white data-[tone=dark]:bg-[rgba(10,10,10,0.72)]"
        >
          <a href="#" className="flex items-center">
            {/* The wordmark is a black SVG flipped to white with a filter, rather
                than shipping a second copy of the asset. The fluid height is
                inline — it is an image, not text, so no typographic scale role
                applies to it. */}
            <Image
              src="/prototype/v2/near-wordmark.svg"
              alt="NEAR"
              width={80}
              height={21}
              // Always inverted now: the wordmark asset is black and the pill
              // is charcoal in both states.
              className="block w-auto brightness-0 invert"
              style={{ height: "clamp(1rem, 0.92rem + 0.35vw, 1.3rem)" }}
              priority
            />
          </a>

          <div className="flex items-center gap-10">
            <div className="hidden items-center gap-8 md:flex">
              {LINKS.map((link) => (
                <a
                  key={link.label}
                  href="#"
                  className="group/link flex items-center gap-1 text-eyebrow uppercase text-white/70 transition-colors hover:text-white"
                >
                  {link.label}
                  <ChevronDown className="size-3.5 transition-transform duration-300 group-hover/link:rotate-180" />
                </a>
              ))}
            </div>

            <a
              href="#"
              data-q-cta
              data-q-cta-fill-white
              className="inline-flex w-fit items-center gap-2 rounded-full border border-transparent px-5 py-2 text-label"
            >
              Get started
            </a>
          </div>
        </nav>
      </Container>
    </div>
  );
}
