import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import MediaFrame from "@/components/primitives/MediaFrame";
import StageSection from "@/components/sections/shells/stage/Section";
import {
  EVENTS,
  MEDIA,
  type CommunityEvent,
} from "@/components/sections/community/communityContent";

export type RallyEventsProps = {
  /** The feed. Sample data today, a Luma calendar the day `page.tsx` fetches it. */
  events: readonly CommunityEvent[];
};

// §4 of the stage — the calendar, with a picture per event.
//
// ── The one variant where the photographs carry the block ─────────────────
// A renders this feed as rows and gives the section a single lead picture,
// because the row is what makes a calendar scannable. B turns it into a rail on
// an axis. This variant does the thing neither of them can afford: every event
// gets its own photograph, at `16/9`, above its own date.
//
// The reason is what this variant is for. It is the warm one, the one that
// argues the community is people rather than a directory of destinations, and
// five reserved photographs of five actual rooms is the most direct possible
// version of that argument. It costs the vertical scan — you can no longer run
// one eye down a column of dates — and that cost is the trade being tested.
//
// ── Each commission is built from its own row ─────────────────────────────
// The label is the event's title, its city, and the suffix in `MEDIA.eventRow`.
// So the brief can never ask for a photograph of an event the page does not
// list, and it re-points itself the day the Luma calendar replaces the sample.
// The field the picture lands in is `CommunityEvent.image`, which is the cover
// image Luma already ships with every event: the frames stop being frames one
// cell at a time, with no layout change at all.
//
// ── The sixth cell ────────────────────────────────────────────────────────
// Five events in a grid of three leaves a hole, and a hole in a grid reads as a
// missing item. The two section-level links move into that cell and complete the
// block: the calendar's own two doors, in the shape of the things they sit next
// to. It is also where the grid absorbs a feed of four or seven without anybody
// rewriting it.
//
// A server component: cells are links with a CSS hover.
export default function RallyEvents({ events }: RallyEventsProps) {
  return (
    <StageSection
      id="events"
      tone="tint"
      eyebrow={EVENTS.eyebrow}
      title={EVENTS.headline}
      intro={EVENTS.sub}
    >
      <ul className="grid-ds gap-y-14">
        {events.map((e) => (
          <li key={e.id} className="col-span-12 md:col-span-6 lg:col-span-4">
            <a
              href={e.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
            >
              <MediaFrame
                label={`${e.title}, ${e.city} ${MEDIA.eventRow.suffix}`}
                spec={MEDIA.eventRow.spec}
                ratio="16/9"
                src={e.image}
              />
              <span className="mt-7 flex items-baseline justify-between gap-4">
                <span className="text-caption-mono uppercase text-gray-intermediate">
                  {e.dateLabel}
                </span>
                <span className="text-caption-mono uppercase text-gray-intermediate">
                  {e.kind}
                </span>
              </span>
              <span className="mt-5 block max-w-[20ch] text-h3 text-pretty group-hover:underline">
                {e.title}
              </span>
              <span className="mt-3 block text-body text-ink-soft">{e.city}</span>
            </a>
          </li>
        ))}

        <li className="col-span-12 flex flex-col justify-end md:col-span-6 lg:col-span-4">
          <div className="border-t border-rule pt-8">
            <a
              href={EVENTS.primary.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-h3 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              {EVENTS.primary.label}
              <ArrowUpRight className="size-5" aria-hidden="true" />
            </a>
            {/* Internal, so `next/link` — the sections contract allows it and
                forbids `next/navigation`. */}
            <Link
              href={EVENTS.secondary.href}
              className="mt-6 block text-label text-gray-intermediate underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              {EVENTS.secondary.label}
            </Link>
          </div>
        </li>
      </ul>
    </StageSection>
  );
}
