import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import MediaFrame from "@/components/primitives/MediaFrame";
import { INVOLVEMENT, MEDIA } from "@/components/sections/community/communityContent";

// §6 of the Hub — four doors, four columns, one rule each.
//
// The mono index (01–04) is not ornament: these four are the page's answer to
// "what can I actually do", and numbering them says there are exactly four and
// the reader has now seen all of them. An unnumbered row of four leaves the
// reader wondering whether it scrolls.
//
// Each column ends in its own link rather than the section ending in one shared
// CTA. This is the page's routing block, and a single button underneath would
// force the reader to pick a door and then find out where it goes.
//
// ── Four pictures, because the four doors read as one paragraph otherwise ──
// Four headings over four two-line paragraphs, in four identical columns, is
// one thing said four times: the eye takes in the shape once and moves on
// without registering that hosting a meetup and shipping a pull request are
// nothing like each other. Four photographs of four visibly different
// activities do the differentiating before a word is read, which is the only
// job asked of them here.
//
// `4/3` and not the wide crops used elsewhere on this page: at three columns
// these cells are about 330px, and a wide frame there is a letterbox with a
// caption in it. The commissions live in `MEDIA.ways`, keyed by the same `id`
// as the door, so a fifth way in cannot be added without someone deciding what
// its picture is.
//
// `id="get-involved"` is the target of both the hero's primary CTA and the
// closing one — moving or renaming it breaks two links on this page.
export default function HubInvolvement() {
  return (
    <section
      id="get-involved"
      className="scroll-mt-[var(--site-header-block)] bg-background pb-[14svh] pt-[14svh]"
    >
      <Container>
        <div className="max-w-[24ch]">
          <Eyebrow className="text-gray-intermediate">{INVOLVEMENT.eyebrow}</Eyebrow>
          <h2 className="mt-5 text-h1 text-pretty">{INVOLVEMENT.headline}</h2>
        </div>

        <ul className="mt-16 grid-ds gap-y-12">
          {INVOLVEMENT.ways.map((w) => {
            const external = w.href.startsWith("http");
            const label = (
              <>
                {w.linkLabel}
                {external && <ArrowUpRight className="size-4" aria-hidden="true" />}
              </>
            );
            const linkClass =
              "mt-6 inline-flex items-center gap-2 text-label underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

            return (
              <li key={w.id} className="col-span-12 border-t border-rule pt-5 sm:col-span-6 lg:col-span-3">
                <p className="text-caption-mono text-gray-intermediate">{w.index}</p>
                <div className="mt-6">
                  <MediaFrame
                    label={MEDIA.ways[w.id].label}
                    spec={MEDIA.ways[w.id].spec}
                    ratio="4/3"
                  />
                </div>
                <h3 className="mt-8 max-w-[14ch] text-h3 text-pretty">{w.title}</h3>
                <p className="mt-4 max-w-[28ch] text-body-sm text-ink-soft text-pretty">{w.body}</p>
                {external ? (
                  <a href={w.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
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
      </Container>
    </section>
  );
}
