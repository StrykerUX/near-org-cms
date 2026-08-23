"use client";

import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { CHAPTERS } from "@/components/sections/about/aboutContent";

// §2 of variant C — a real index, not a decorative one.
//
// Eight rows, each one a link to its chapter. It is the piece that makes this
// variant what it claims to be: a reader who arrived wanting to know when Chain
// Signatures shipped should be able to get there in one click instead of
// scrolling past 2017.
//
// ── White, once ────────────────────────────────────────────────────────────
// The design system allows one white section per page and this is where it is
// spent. The index is the only thing on the page that is apparatus rather than
// history, and lifting it off the cream is what separates the two registers
// without drawing a box around it.
//
// ── Plain `<a>`, and no smooth scroll ──────────────────────────────────────
// These are fragment links inside the current document, not navigations, so
// `next/link` has nothing to do here — the repo's rule about `<Link>` is about
// crossing routes.
//
// `scroll-behavior: smooth` is deliberately NOT set. This route mounts Lenis
// (see `app/prototype/about-c/layout.tsx`), which drives scroll itself; a
// native smooth animation running at the same time fights it, and the section
// contract forbids reaching for the Lenis instance from here anyway. The jump
// is instant and lands correctly because every chapter carries
// `scroll-mt-[var(--site-header-block)]` for the fixed header.

const pad = (n: number) => String(n).padStart(2, "0");

export default function ChapterIndex() {
  const rootRef = useScrollReveal<HTMLElement>({ start: "top 88%", y: 16, stagger: 0.05 });

  return (
    <section ref={rootRef} className="bg-background py-[12svh]">
      <Container>
        <div data-reveal className="flex items-baseline justify-between gap-6">
          <Eyebrow className="text-gray-intermediate">Index</Eyebrow>
          <p className="text-caption-mono text-gray-intermediate">
            {pad(CHAPTERS.length)} chapters
          </p>
        </div>

        <ol className="mt-10 flex flex-col border-b border-rule">
          {CHAPTERS.map((c, i) => (
            <li key={c.id} data-reveal>
              <a
                href={`#${c.id}`}
                className="group grid-ds items-baseline border-t border-rule py-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                <span className="col-span-2 text-caption-mono text-gray-intermediate lg:col-span-1">
                  {pad(i + 1)}
                </span>
                <span className="col-span-10 text-h4-mono text-ink lg:col-span-2">
                  {c.yearLabel}
                </span>
                <span className="col-span-11 mt-3 max-w-[30ch] text-h3 text-ink text-pretty lg:col-span-8 lg:col-start-4 lg:mt-0">
                  {c.title}
                </span>
                {/* Mono arrow rather than an icon: the whole left edge of this
                    page is set in mono, and one lucide glyph in the row would
                    be the only drawn mark on a page made entirely of type. */}
                <span
                  aria-hidden="true"
                  className="col-span-1 text-right text-caption-mono text-gray-intermediate transition-transform group-hover:translate-x-1 group-focus-visible:translate-x-1"
                >
                  &rarr;
                </span>
              </a>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
