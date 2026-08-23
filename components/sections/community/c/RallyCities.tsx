"use client";

import Container from "@/components/primitives/Container";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { CITIES } from "@/components/sections/community/communityContent";

export type RallyCitiesProps = {
  /** Deduplicated, in feed order. Derived from the events feed by the view. */
  cities: readonly string[];
};

// §3 of the Rally — the places, running.
//
// ── The list is the calendar, and that is the point ────────────────────────
// The obvious version of this band is a hand-written list of thirty impressive
// cities. It would look better today and it would be a claim nobody can check,
// and it would go stale the first month a city drops off the calendar. This one
// is derived from the same events feed the section below renders, so it cannot
// name a city the page does not also show, and it grows on its own the day the
// Luma calendar is wired. `CITIES.note` says so in one line, which is what turns
// a short list from a weak claim into an accurate one.
//
// ── Where it sits, and why it is the page's only dark ground ───────────────
// The opening (hero plus Legion) is one continuous field of cream, deliberately
// undivided. Something has to close it, or the events table below simply
// continues it and the opening never ends. A band of moving type on ink does
// that in about a fifth of a screen, and it earns the cut by being the hinge of
// the page's argument: those are the figures' countries turning into actual
// places, and the calendar of what happens in them starts immediately below.
//
// `data-nav-dark` inverts the fixed site header over it — the band is tall
// enough that the header is fully inside it for a while, so without the flag the
// nav would be black on black.
//
// The marquee mechanism is `ProofBand`'s `EcosystemStrip`, unchanged: exactly two
// identical copies of the list, so the track is precisely 2× one set and −50% is
// exact by construction rather than by measurement. The second copy is
// `aria-hidden` — the reader has been told the list once.
export default function RallyCities({ cities }: RallyCitiesProps) {
  const rootRef = useMotionScope<HTMLDivElement>(({ q, motionOk }) => {
    if (!motionOk) return;

    const tween = gsap.fromTo(
      q("[data-marquee]"),
      { xPercent: 0 },
      { xPercent: -50, duration: 34, repeat: -1, ease: "none", force3D: true }
    );

    return () => tween.kill();
  });

  const set = (
    <>
      {cities.map((city) => (
        <span key={city} className="flex items-center gap-8 whitespace-nowrap text-h2 text-cream">
          {city}
          <span className="size-2 rounded-full bg-near-green-accent" aria-hidden="true" />
        </span>
      ))}
    </>
  );

  return (
    <section data-nav-dark className="bg-ink py-[8svh] text-cream">
      <Container>
        <div className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-3">
          <p className="text-eyebrow-mono uppercase text-near-green-accent">{CITIES.eyebrow}</p>
          <p className="max-w-[44ch] text-caption text-cream/60 text-pretty">{CITIES.note}</p>
        </div>
      </Container>

      <div ref={rootRef} className="mt-10 overflow-hidden">
        <div data-marquee className="flex w-max">
          <div className="flex gap-8 pr-8">{set}</div>
          <div className="flex gap-8 pr-8" aria-hidden="true">
            {set}
          </div>
        </div>
      </div>
    </section>
  );
}
