import { ArrowUpRight } from "lucide-react";

import Container from "@/components/primitives/Container";
import { SOCIALS } from "@/components/sections/community/communityContent";

// §5 of the Board — the channels, as a second table.
//
// Same shape as the events table on purpose: name, what it is for, handle,
// action. A reader who has already learned how to read one table on this page
// reads this one without learning anything new, which is the whole return on
// committing to a single layout idea.
//
// No logos, for the reason spelled out at length in `a/HubChannels`: of these
// eight destinations `lucide-react` has real marks for two, a stale one for a
// third, and nothing for the rest. In a table the absence is not even a
// compromise — a handle set in mono in a right-hand column is more useful than
// an icon, because it is the thing you would actually type or search for.
export default function BoardChannels() {
  return (
    <section className="bg-cream pb-[10svh] pt-[10svh]">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <div>
            <p className="text-eyebrow-mono uppercase text-gray-intermediate">{SOCIALS.eyebrow}</p>
            <h2 className="mt-4 max-w-[18ch] text-h2 text-pretty">{SOCIALS.headline}</h2>
          </div>
          <p className="max-w-[34ch] text-body-sm text-ink-soft text-pretty">{SOCIALS.sub}</p>
        </div>

        <ul className="mt-12 border-t border-rule">
          {SOCIALS.channels.map((c) => (
            <li key={c.id} className="border-b border-rule">
              <a
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid-ds items-baseline gap-y-1 py-4 transition-colors hover:bg-black/[0.04] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ink"
              >
                <span className="col-span-12 text-h4 lg:col-span-3">{c.name}</span>
                <span className="col-span-12 text-body-sm text-ink-soft text-pretty lg:col-span-5">
                  {c.body}
                </span>
                <span className="col-span-9 text-caption-mono text-gray-intermediate lg:col-span-3 lg:text-right">
                  {c.handle}
                </span>
                <span className="col-span-3 flex justify-end lg:col-span-1">
                  <ArrowUpRight
                    className="size-4 text-gray-intermediate transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
