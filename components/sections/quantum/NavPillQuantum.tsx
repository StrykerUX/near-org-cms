"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";
import Container from "@/components/primitives/Container";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { gsap, ScrollTrigger } from "@/components/primitives/motion/gsapClient";
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

// Where the pill's middle sits, as a percentage of viewport height. It is fixed
// at `top-6` with ~50px of pill, so its centre lands around 5% down. This is what
// decides which section the ink flip reads: the tone has to change when the pill
// crosses the boundary, not when the section's own midpoint does.
const PILL_BAND = 5;

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
    //
    // ── Why ScrollTrigger and not a scroll listener ──────────────────────
    // This used to run `document.querySelectorAll("[data-nav-dark]")` plus one
    // getBoundingClientRect() per dark section on every animation frame of
    // scroll, to answer a question ScrollTrigger already tracks: is this band of
    // the viewport inside that element? One trigger per dark section with an
    // `onToggle` answers it with zero layout reads per frame, and it comes off
    // the same ticker Lenis is on.
    //
    // The count, not a boolean: two dark sections can overlap the pill's band
    // during a handover, and a boolean would flip to light in between.
    //
    // The triggers are created here and not on mount-order grounds: the dark
    // sections are siblings of this component, so they exist by the time the
    // parent provider's coordinated refresh runs.
    if (nav) {
      let darkCount = 0;
      const applyTone = () => {
        nav.dataset.tone = darkCount > 0 ? "dark" : "light";
      };
      applyTone();

      document.querySelectorAll<HTMLElement>("[data-nav-dark]").forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          // The pill sits at the top of the viewport, so the band that matters
          // is a sliver at `top`. `PILL_BAND` is where its middle falls, as a
          // fraction of viewport height.
          start: `top ${PILL_BAND}%`,
          end: `bottom ${PILL_BAND}%`,
          onToggle: (self) => {
            darkCount += self.isActive ? 1 : -1;
            applyTone();
          },
        });
      });
    }

    // ── 1:1 retraction with the gesture ──────────────────────────────────
    mm.add(MQ.motion, () => {
      // quickSetter and not gsap.to(): this runs on every scroll update, and a
      // tween per update would mean instantiating hundreds of objects a second
      // to write one property.
      const setY = gsap.quickSetter(scope, "y", "px") as (v: number) => void;

      // Hoisted out of the handler. Reading `offsetHeight` inside it forced a
      // layout on every scroll event — and immediately after writing a transform,
      // which is the read-after-write that makes it a forced synchronous reflow.
      // The pill's height only changes when the viewport does, so it is measured
      // on refresh (which ScrollTrigger fires on resize) instead.
      let hidden = 0;
      const measureHeight = () => {
        hidden = -(scope.offsetHeight + HIDE_MARGIN);
      };
      measureHeight();
      ScrollTrigger.addEventListener("refresh", measureHeight);

      let last = 0;
      let offset = 0;

      // One ScrollTrigger over the whole document rather than a raw scroll
      // listener: it already batches into the shared ticker (so this write lands
      // in the same frame slot as every other GSAP write instead of interleaving
      // with them) and it already knows the scroll position without asking layout.
      const st = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const y = self.scroll();
          const delta = y - last;
          last = y;

          offset = Math.min(0, Math.max(hidden, offset - delta));
          // Always visible at the very top: without this, a negative scroll
          // bounce on iOS can leave it hidden at the top of the page.
          if (y <= 2) offset = 0;

          setY(offset);
        },
      });
      last = st.scroll();

      return () => {
        ScrollTrigger.removeEventListener("refresh", measureHeight);
        setY(0);
      };
    });

    return () => mm.revert();
  }, []);

  return (
    // pointer-events-none on the wrapper and auto on the pill: the wrapper spans
    // the full viewport width and without this would swallow clicks meant for
    // whatever is underneath (the hero occupies that same band, and its canvas
    // listens for the pointer).
    <div
      ref={rootRef}
      // `will-change` here IS permanent, unlike everywhere else on the page: the
      // pill transforms on every scroll update, so it is animating essentially all
      // the time. Toggling it would promote and demote the layer continuously,
      // which is worse than keeping it reserved.
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
