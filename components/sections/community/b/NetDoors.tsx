import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import Panel from "@/components/sections/shells/instrument/Panel";
import InstrumentSection from "@/components/sections/shells/instrument/Section";
import { INSTRUMENT, INVOLVEMENT } from "@/components/sections/community/communityContent";

// §6 of the instrument — four ways in, drawn as four taps off one line.
//
// ── The drawing is structure, not decoration ──────────────────────────────
// One 1px rule crosses the panel and four stems drop out of it, one per column,
// each ending in a node. It carries something the copy never says and a fourth
// heading could not: these are four inputs to the SAME thing. Four headings in
// four columns say "here are four items"; four taps off one bus say "pick any
// one of these and you are in", which is the only sentence this section exists
// to deliver.
//
// It is also the cheapest possible version of that: two elements per column and
// no SVG, so it reflows with the grid instead of being a picture that has to be
// kept in sync with a layout.
//
// Below `lg` the bus disappears rather than turning ninety degrees. A vertical
// spine down a phone screen is a timeline, and these four are not in an order.
// Each door keeps its own hairline and the sentence is carried by the heading.
//
// ── Four numbers, and why they stay ───────────────────────────────────────
// The mono index says there are exactly four and the reader has now seen all of
// them. An unnumbered row of four leaves them wondering whether it scrolls —
// which on a page whose entire job is routing is the worst thing it could do.
//
// ── One link per door, never one shared CTA ───────────────────────────────
// A single button underneath would make the reader pick a door and only then
// find out where it goes.
//
// `id="get-involved"` is the target of `HERO.primary`, `CLOSING.primary` and the
// fourth row of the hero's index. Renaming it breaks three links.
export default function NetDoors() {
  return (
    <InstrumentSection
      id="get-involved"
      eyebrow={INVOLVEMENT.eyebrow}
      title={INVOLVEMENT.headline}
    >
      <Panel label={INSTRUMENT.doors.label} meta={INSTRUMENT.doors.meta}>
        <div className="px-5 pb-12 pt-20 lg:px-9 lg:pb-16 lg:pt-24">
          {/* The bus. */}
          <div aria-hidden="true" className="hidden h-px w-full bg-white/12 lg:block" />

          <ul className="grid grid-cols-1 gap-y-10 lg:grid-cols-4 lg:gap-y-0">
            {INVOLVEMENT.ways.map((w) => {
              const external = w.href.startsWith("http");
              const label = (
                <>
                  {w.linkLabel}
                  {external && <ArrowUpRight className="size-4" aria-hidden="true" />}
                </>
              );
              const linkClass =
                "mt-7 inline-flex items-center gap-2 text-label text-cream underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-near-green-accent";

              return (
                <li
                  key={w.id}
                  className="min-w-0 border-t border-white/12 pt-6 lg:border-t-0 lg:pt-0"
                >
                  {/* The tap. */}
                  <div aria-hidden="true" className="relative hidden h-12 w-px bg-white/12 lg:block">
                    <span className="absolute bottom-0 left-1/2 block size-1.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-near-green-accent" />
                  </div>

                  <p className="pr-6 text-caption-mono text-white/40 lg:mt-8">{w.index}</p>
                  <h3 className="mt-5 max-w-[14ch] pr-6 text-h3 text-pretty">{w.title}</h3>
                  <p className="mt-4 max-w-[28ch] pr-6 text-body-sm text-white/60 text-pretty">
                    {w.body}
                  </p>
                  {external ? (
                    <a
                      href={w.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClass}
                    >
                      {label}
                    </a>
                  ) : (
                    <Link href={w.href} className={linkClass}>
                      {label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </Panel>
    </InstrumentSection>
  );
}
