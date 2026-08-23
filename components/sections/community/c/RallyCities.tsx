"use client";

import Container from "@/components/primitives/Container";
import PlacesField from "@/components/sections/community/c/PlacesField";
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
// ── The drawing above the strip, and why they are one band and not two ────
// The strip alone says the names. It cannot say that they are far apart, which
// is the actual claim under "70+ countries" — a marquee of five words reads as
// a list no matter how long it runs. So the band opens with the city field: the
// same five places, plotted, and then the same five places running. One
// movement, in one ground: here is where they are, and here they come.
//
// Split into two sections it would have been a diagram followed by a marquee of
// the identical data, which is the same thing twice. Stacked inside one band it
// is a statement and its own restatement in motion, which is what a hinge in a
// page is supposed to do.
//
// `CITIES.note` moves out of the header and down beside the foot of the
// drawing, where it belongs: it is the sentence that says the list is the
// calendar and not a claim about the whole community, and it now sits against
// the thing it qualifies rather than above it.
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
    <section data-nav-dark className="bg-ink py-[12svh] text-cream">
      <Container>
        <p className="text-eyebrow-mono uppercase text-near-green-accent">{CITIES.eyebrow}</p>

        <div className="mt-12 grid-ds items-end gap-y-10">
          <div className="col-span-12 lg:col-span-7">
            <PlacesField cities={cities} />
          </div>

          <p className="col-span-12 max-w-[40ch] text-caption text-cream/60 text-pretty lg:col-span-4 lg:col-start-9">
            {CITIES.note}
          </p>
        </div>
      </Container>

      <div ref={rootRef} className="mt-20 overflow-hidden">
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
