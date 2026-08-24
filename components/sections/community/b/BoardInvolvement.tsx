import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";

import Container from "@/components/primitives/Container";
import { INVOLVEMENT } from "@/components/sections/community/communityContent";

// §6 of the Board — four doors, four rows.
//
// `a/` sets these as four columns; here they are four rows, because the whole
// page reads top to bottom in one column of rules and a four-across grid would
// be the second layout idea on a page whose value is having only one.
//
// The index (01–04) is already in the content, and on this variant it carries
// more weight than in `a/`: on a page of rows, a number in the left column is
// what tells the reader these four are a closed set and not the first four of
// something longer.
//
// `id="get-involved"` is the target of the hero's first row and of the closing
// CTA — renaming it breaks two links on this page.
export default function BoardInvolvement() {
  return (
    <section
      id="get-involved"
      className="scroll-mt-[var(--site-header-block)] bg-cream pb-[10svh] pt-[10svh]"
    >
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <div>
            <p className="text-eyebrow-mono uppercase text-gray-intermediate">
              {INVOLVEMENT.eyebrow}
            </p>
            <h2 className="mt-4 max-w-[18ch] text-h2 text-pretty">{INVOLVEMENT.headline}</h2>
          </div>
        </div>

        <ul className="mt-12 border-t border-rule">
          {INVOLVEMENT.ways.map((w) => {
            const external = w.href.startsWith("http");
            const rowClass =
              "group grid-ds items-baseline gap-y-2 py-5 transition-colors hover:bg-black/[0.04] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ink";
            const inner = (
              <>
                <span className="col-span-3 text-caption-mono text-gray-intermediate lg:col-span-1">
                  {w.index}
                </span>
                <span className="col-span-9 text-h4 lg:col-span-4">{w.title}</span>
                <span className="col-span-12 text-body-sm text-ink-soft text-pretty lg:col-span-4">
                  {w.body}
                </span>
                <span className="col-span-12 flex items-center gap-2 text-label text-gray-intermediate transition-colors group-hover:text-ink lg:col-span-3 lg:justify-end">
                  {w.linkLabel}
                  {external ? (
                    <ArrowUpRight
                      className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  ) : (
                    <ArrowRight
                      className="size-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  )}
                </span>
              </>
            );

            return (
              <li key={w.id} className="border-b border-rule">
                {external ? (
                  <a
                    href={w.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={rowClass}
                  >
                    {inner}
                  </a>
                ) : (
                  <Link href={w.href} className={rowClass}>
                    {inner}
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
