"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import Panel from "@/components/sections/shells/instrument/Panel";
import InstrumentSection from "@/components/sections/shells/instrument/Section";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { EASE_OUT, DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import {
  EVENTS,
  INSTRUMENT,
  type CommunityEvent,
} from "@/components/sections/community/communityContent";

export type NetScheduleProps = {
  /** The feed. Sample data today, a Luma calendar the day `page.tsx` fetches it. */
  events: readonly CommunityEvent[];
};

// §3 of the instrument — the calendar as the apparatus's readout.
//
// ── Why a rail and not a table ────────────────────────────────────────────
// A already renders this feed as an editorial list of rows: date left, title,
// city, kind, hairline between. Setting the same rows on a dark ground with
// column headers on top would be A in black — the exact failure this variant is
// supposed to avoid, since what separates the three is the unit of composition
// and not the palette.
//
// So the feed turns ninety degrees. Each event is a STOP on one continuous
// axis: date above the line, node on it, the event below it. That is a shape an
// instrument produces and a document does not, and it answers the one question
// a list of rows answers badly — how many are there and how far apart — before
// a single title is read.
//
// ── The axis is not to scale, and it says so ──────────────────────────────
// Stops are evenly spaced because the feed gives `dateLabel` as an already
// formatted string and never a `Date` (the sections contract, and the whole
// point of that contract). Spacing them by real elapsed time would mean parsing
// display copy, which breaks the first time the calendar formats a date any
// other way. The panel's corner says "In feed order", which is what the drawing
// actually shows.
//
// ── One node is lit ───────────────────────────────────────────────────────
// The first stop is the next event, and it is the only green mark in the panel.
// It is a real reading rather than a highlight: the axis runs forward, so the
// leftmost stop is the one that is about to happen.
//
// ── The axis is built out of the cells, not laid over them ────────────────
// Each column carries its own 1px segment at full cell width, with no gutter,
// so the five segments meet and read as one line. The alternative — one line
// under a separate grid of nodes — would need three stacked grids to stay
// aligned and would put the hover target in a different element from the thing
// that reacts to it.
export default function NetSchedule({ events }: NetScheduleProps) {
  const rootRef = useMotionScope<HTMLDivElement>(({ q, scope, motionOk }) => {
    if (!motionOk) return;

    const tl = gsap.timeline({
      defaults: { ease: EASE_OUT },
      scrollTrigger: { trigger: scope, start: "top 82%", once: true, markers: DEBUG_MARKERS },
    });

    // The axis draws left to right and the stops arrive behind it. One gesture:
    // the rail extends, and the calendar lands on it.
    tl.from(q("[data-axis]"), { scaleX: 0, duration: 0.55, stagger: 0.09 }, 0).from(
      q("[data-stop]"),
      { autoAlpha: 0, y: 16, duration: 0.7, stagger: 0.09 },
      0.22
    );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  });

  return (
    <InstrumentSection
      id="events"
      eyebrow={EVENTS.eyebrow}
      title={EVENTS.headline}
      intro={EVENTS.sub}
    >
      <div ref={rootRef}>
        <Panel
          label={INSTRUMENT.schedule.label}
          meta={INSTRUMENT.schedule.meta}
          footer={
            <div className="flex flex-wrap items-center gap-x-10 gap-y-3">
              <a
                href={EVENTS.primary.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-label text-cream underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-near-green-accent"
              >
                {EVENTS.primary.label}
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
              {/* Internal, so `next/link` — the sections contract allows it and
                  forbids `next/navigation`. */}
              <Link
                href={EVENTS.secondary.href}
                className="text-label text-white/55 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-near-green-accent"
              >
                {EVENTS.secondary.label}
              </Link>
            </div>
          }
        >
          <ol className="grid grid-cols-1 px-5 pb-12 pt-20 lg:grid-cols-5 lg:px-9 lg:pb-16 lg:pt-24">
            {events.map((e, i) => {
              const isNext = i === 0;
              return (
                <li key={e.id} className="min-w-0">
                  <a
                    href={e.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full flex-col pb-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-near-green-accent lg:pb-0"
                  >
                    <span
                      data-stop
                      className={`pr-6 text-caption-mono uppercase ${
                        isNext ? "text-near-green-accent" : "text-white/45"
                      }`}
                    >
                      {e.dateLabel}
                    </span>

                    {/* The segment and its node. `origin-left` is what makes the
                        rail extend in reading order when the timeline scales it. */}
                    <span
                      aria-hidden="true"
                      data-axis
                      className="relative mt-5 block h-px w-full origin-left bg-white/12 transition-colors group-hover:bg-white/35"
                    >
                      <span
                        className={`absolute left-0 top-1/2 block size-1.5 -translate-y-1/2 rounded-full transition-colors ${
                          isNext
                            ? "bg-near-green-accent"
                            : "bg-white/35 group-hover:bg-cream"
                        }`}
                      />
                    </span>

                    <span data-stop className="mt-7 block pr-6 text-h4 text-pretty">
                      {e.title}
                    </span>
                    <span data-stop className="mt-3 block pr-6 text-body-sm text-white/60">
                      {e.city}
                    </span>
                    <span
                      data-stop
                      // `mt-auto` and not a fixed margin: a two-line title
                      // ("Agents & Intents Hack") would otherwise push its kind
                      // one line lower than its neighbours' and the rail would
                      // lose the horizontal reading line that makes it a rail.
                      className="mt-auto flex items-center gap-2 pr-6 pt-5 text-micro-mono uppercase text-white/40"
                    >
                      {e.kind}
                      <ArrowUpRight
                        className="size-3.5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </a>
                </li>
              );
            })}
          </ol>
        </Panel>
      </div>
    </InstrumentSection>
  );
}
