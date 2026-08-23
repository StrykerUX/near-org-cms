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

export type HubEventsProps = {
  /** The feed. Sample data today, a Luma calendar the day `page.tsx` fetches it. */
  events: readonly CommunityEvent[];
};

// §3 of the Hub — the calendar as a list of rows.
//
// ── Why rows and not cards ─────────────────────────────────────────────────
// A card grid is the default for an events feed and it is the wrong shape for
// this one. There are no images: every card would be a box with the same four
// text fields in it, so the box adds a border and a shadow and buys nothing —
// exactly the failure documented in `chain/WhyItMatters.tsx`. Worse, cards break
// the scan: with the date in a different horizontal position on each card, the
// reader cannot run one eye down a column of dates, which is the single thing
// anybody does with a list of upcoming events.
//
// Rows put the date, the city and the kind in fixed columns, so the whole feed
// is scannable in one vertical pass and the hairline between rows does the
// grouping that a border would have done around each one.
//
// ── One photograph, and it is of the next event ───────────────────────────
// The rows stay text, because the scan is the whole reason they are rows. But a
// list of five events on a page about people is still a page with nobody in it,
// so the block opens with one wide picture: not a decorative header image, the
// LEAD event's own room.
//
// Its commission is built from the feed — the event's title and city plus the
// suffix in `MEDIA.eventsLead` — which means it can never ask for a photograph
// of something the page does not list, and it re-points itself the day the Luma
// calendar replaces the sample. Same discipline as `c/RallyCities` deriving its
// strip from the feed instead of a hand-written list of impressive places.
//
// It spans columns 4–12 rather than the full width, and that offset is the
// point: the list underneath starts at the left edge, so the picture breaking
// away from it is what keeps this block from being one more full-width stack on
// a page of full-width stacks.
//
// A server component: it is a list of links with a CSS hover, and nothing here
// needs to run on the client.
export default function HubEvents({ events }: HubEventsProps) {
  // Guarded rather than assumed: an empty calendar is a real state for a feed,
  // and it should render an empty list, not a commission for a photograph of
  // nothing.
  const lead = events[0];

  return (
    <section
      id="events"
      className="scroll-mt-[var(--site-header-block)] bg-cream pb-[14svh] pt-[6svh]"
    >
      <Container>
        <div className="grid-ds items-end gap-y-8">
          <div className="col-span-12 lg:col-span-7">
            <Eyebrow className="text-gray-intermediate">{EVENTS.eyebrow}</Eyebrow>
            <h2 className="mt-5 max-w-[18ch] text-h1 text-pretty">{EVENTS.headline}</h2>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:col-start-9">
            <p className="max-w-[38ch] text-body text-ink-soft text-pretty">{EVENTS.sub}</p>
          </div>
        </div>

        {lead && (
          <div className="mt-14 grid-ds">
            <div className="col-span-12 lg:col-span-9 lg:col-start-4">
              <MediaFrame
                label={`${lead.title}, ${lead.city} ${MEDIA.eventsLead.suffix}`}
                spec={MEDIA.eventsLead.spec}
                ratio="5/2"
                src={lead.image}
              />
            </div>
          </div>
        )}

        <ul className="mt-14 border-t border-rule">
          {events.map((e) => (
            <li key={e.id} className="border-b border-rule">
              <a
                href={e.href}
                target="_blank"
                rel="noopener noreferrer"
                // The whole row is one link. A "Register" button in a fifth
                // column would put a 90px target inside a 1400px row that is
                // already unambiguously about one event.
                className="group grid-ds items-baseline gap-y-2 py-6 transition-colors hover:bg-black/[0.03] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ink"
              >
                <span className="col-span-4 text-caption-mono uppercase text-gray-intermediate lg:col-span-2">
                  {e.dateLabel}
                </span>
                <span className="col-span-8 text-h4 text-pretty lg:col-span-5">{e.title}</span>
                {/* Below `lg` the row folds onto two lines and the city tucks
                    under the title (`col-start-5`) rather than under the date,
                    so the column of dates stays unbroken — running one eye down
                    it is the reason this is a list of rows at all. */}
                <span className="col-span-4 col-start-5 text-body-sm text-ink-soft lg:col-span-2 lg:col-start-auto">
                  {e.city}
                </span>
                <span className="col-span-4 flex items-center justify-end gap-3 text-caption-mono uppercase text-gray-intermediate lg:col-span-3">
                  {e.kind}
                  {/* The arrow is the last thing to fit: at 375px this cell is
                      ~74px and "Hackathon" already fills it. The row is a link
                      either way, so the affordance is a bonus, not the cue. */}
                  <ArrowUpRight
                    className="hidden size-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:block"
                    aria-hidden="true"
                  />
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-4">
          <a
            href={EVENTS.primary.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-label underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            {EVENTS.primary.label}
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
          {/* Internal, so `next/link` and not an anchor — the sections contract
              allows `next/link` and forbids `next/navigation`. */}
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
