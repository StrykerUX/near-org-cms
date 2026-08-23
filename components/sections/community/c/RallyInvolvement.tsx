import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";

import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import MediaFrame from "@/components/primitives/MediaFrame";
import { INVOLVEMENT, MEDIA } from "@/components/sections/community/communityContent";

// §6 of the Rally — four doors, two by two.
//
// `a/` sets these as four narrow columns and `b/` as four rows. Two by two is
// the version that gives each one a reading measure wide enough for the body to
// sit on two comfortable lines instead of four cramped ones, which is what this
// variant trades vertical space for everywhere else on the page.
//
// ── Square pictures, held small, and why they are not the full cell ───────
// The four doors get the same four commissions `a/` uses, at a different crop
// and a different size. `a/` sets them `4/3` across a 330px column, where the
// picture is most of the cell; here the cell is 700px wide and a picture that
// filled it would make each door a poster, which is four posters and no page.
//
// So: `1/1`, capped at 15rem, sitting above the title like a plate beside an
// entry. Square because it is the crop that survives being small — a wide frame
// at this width is a letterbox with a caption in it — and small because in this
// variant the type is already doing the work. The photographs are here to keep
// four similar-looking paragraphs from reading as one thing said four times.
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
                <div className="mt-8 max-w-[15rem]">
                  <MediaFrame
                    label={MEDIA.ways[w.id].label}
                    spec={MEDIA.ways[w.id].spec}
                    ratio="1/1"
                  />
                </div>
                <h3 className="mt-10 max-w-[16ch] text-h2 text-pretty">{w.title}</h3>
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
