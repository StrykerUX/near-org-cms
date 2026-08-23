import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";

import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { INVOLVEMENT } from "@/components/sections/community/communityContent";

// §6 of the Rally — four doors, two by two.
//
// `a/` sets these as four narrow columns and `b/` as four rows. Two by two is
// the version that gives each one a reading measure wide enough for the body to
// sit on two comfortable lines instead of four cramped ones, which is what this
// variant trades vertical space for everywhere else on the page.
//
// `id="get-involved"` is the target of the hero's primary CTA and of the closing
// one — renaming it breaks two links on this page.
export default function RallyInvolvement() {
  return (
    <section
      id="get-involved"
      className="scroll-mt-[var(--site-header-block)] bg-cream pb-[14svh] pt-[14svh]"
    >
      <Container>
        <div className="max-w-[22ch]">
          <Eyebrow className="text-gray-intermediate">{INVOLVEMENT.eyebrow}</Eyebrow>
          <h2 className="mt-5 text-h1 text-pretty">{INVOLVEMENT.headline}</h2>
        </div>

        <ul className="mt-16 grid-ds gap-y-14">
          {INVOLVEMENT.ways.map((w) => {
            const external = w.href.startsWith("http");
            const label = (
              <>
                {w.linkLabel}
                {external ? (
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                ) : (
                  <ArrowRight className="size-4" aria-hidden="true" />
                )}
              </>
            );
            const linkClass =
              "mt-8 inline-flex items-center gap-2 text-label-lg underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

            return (
              <li key={w.id} className="col-span-12 border-t border-rule pt-6 lg:col-span-6">
                <p className="text-caption-mono text-gray-intermediate">{w.index}</p>
                <h3 className="mt-8 max-w-[16ch] text-h2 text-pretty">{w.title}</h3>
                <p className="mt-5 max-w-[42ch] text-body text-ink-soft text-pretty">{w.body}</p>
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
