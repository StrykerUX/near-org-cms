import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { EVENTS, type CommunityEvent } from "@/components/sections/community/communityContent";

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
// It stops short of cards, and the reason is the same one `a/HubEvents` gives at
// length: there are no images. A card without an image is a border drawn around
// four text fields — it adds a frame and takes away the shared left edge that
// lets the eye run down the dates. What makes these rows feel like objects
// instead is space and type size, neither of which costs the scan anything.
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
                <span className="col-span-12 flex items-baseline gap-4 lg:col-span-3 lg:flex-col lg:gap-2">
                  <span className="text-h4-mono">{e.dateLabel}</span>
                  <span className="text-micro-mono uppercase text-gray-intermediate">{e.kind}</span>
                </span>
                <span className="col-span-12 max-w-[22ch] text-h3 text-pretty lg:col-span-6">
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
