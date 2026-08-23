import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import MediaFrame from "@/components/primitives/MediaFrame";
import {
  EVENTS,
  MEDIA,
  type CommunityEvent,
} from "@/components/sections/community/communityContent";

export type RallyEventsProps = {
  /** The feed. Sample data today, a Luma calendar the day `page.tsx` fetches it. */
  events: readonly CommunityEvent[];
};

// §4 of the Rally — the calendar, given room.
//
// ── Bigger than `a/`, and still not cards ──────────────────────────────────
// This variant is warmer and slower than the other two, so the events get twice
// the vertical air and the title steps up to `text-h3`: at this scale a row of
// five events reads as five things happening rather than as five records.
//
// It stops short of cards, and the reason survives the arrival of photography:
// a card would take away the shared left edge that lets the eye run down the
// dates, and it would draw a border around content that is already grouped by
// the hairline between rows. What makes these rows feel like objects is space,
// type size and now a picture — none of which costs the scan anything, because
// none of them moves the date out of its column.
//
// ── A picture per event, and it comes with the event ───────────────────────
// This is the variant where photography outweighs type, and the events feed is
// where that is cheapest to honour: a Luma event ARRIVES with a cover image, so
// the picture is not an asset somebody has to go and produce, it is a field
// that is already in the payload. `CommunityEvent.image` is that field, and
// until the calendar is wired every row shows the reserved frame instead —
// same cell, same height, so the day the feed lands nothing about this layout
// has to be re-measured.
//
// The commission written into each frame is built from the row itself (title,
// city, and the suffix in `MEDIA.eventRow`), so it can never ask for a
// photograph of an event the page does not list.
//
// Two details in that cell. It is `self-start` because the row is
// `items-baseline` and a box with no text in it has its baseline at its bottom
// edge — left alone it would hang the picture off the row. And it is
// `aria-hidden`: the whole row is one link, and the frame's own label would
// otherwise be read into the link name after the event title and city that
// already say the same thing.
//
// The date is set in mono at heading scale (`text-h4-mono`) with the kind under
// it, so the left column reads as one block of "when and what sort" rather than
// as two stray labels.
export default function RallyEvents({ events }: RallyEventsProps) {
  return (
    <section
      id="events"
      className="scroll-mt-[var(--site-header-block)] bg-cream pb-[14svh] pt-[14svh]"
    >
      <Container>
        <div className="grid-ds items-end gap-y-8">
          <div className="col-span-12 lg:col-span-7">
            <Eyebrow className="text-gray-intermediate">{EVENTS.eyebrow}</Eyebrow>
            <h2 className="mt-5 max-w-[16ch] text-h1 text-pretty">{EVENTS.headline}</h2>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:col-start-9">
            <p className="max-w-[36ch] text-body text-ink-soft text-pretty">{EVENTS.sub}</p>
          </div>
        </div>

        <ul className="mt-16 border-t border-rule">
          {events.map((e) => (
            <li key={e.id} className="border-b border-rule">
              <a
                href={e.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid-ds items-baseline gap-y-4 py-10 transition-colors hover:bg-black/[0.03] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ink"
              >
                <span className="col-span-12 flex items-baseline gap-4 lg:col-span-2 lg:flex-col lg:gap-2">
                  <span className="text-h4-mono">{e.dateLabel}</span>
                  <span className="text-micro-mono uppercase text-gray-intermediate">{e.kind}</span>
                </span>
                <div
                  aria-hidden="true"
                  className="col-span-12 self-start lg:col-span-3"
                >
                  <MediaFrame
                    label={`${e.title}, ${e.city} ${MEDIA.eventRow.suffix}`}
                    spec={MEDIA.eventRow.spec}
                    ratio="16/9"
                    src={e.image}
                  />
                </div>
                <span className="col-span-12 max-w-[22ch] text-h3 text-pretty lg:col-span-4">
                  {e.title}
                </span>
                <span className="col-span-12 flex items-center justify-between gap-4 text-body text-ink-soft lg:col-span-3 lg:justify-end">
                  {e.city}
                  <ArrowUpRight
                    className="size-5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-4">
          <a
            href={EVENTS.primary.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-label-lg underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            {EVENTS.primary.label}
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
          <Link
            href={EVENTS.secondary.href}
            className="text-label text-gray-intermediate underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            {EVENTS.secondary.label}
          </Link>
        </div>
      </Container>
    </section>
  );
}
