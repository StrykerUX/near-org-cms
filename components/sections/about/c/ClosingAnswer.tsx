"use client";

import Link from "next/link";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import CtaPill from "@/components/sections/quantum/CtaPill";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { CLOSING, QUESTIONS } from "@/components/sections/about/aboutContent";

// §4 of variant C — the refrain closing.
//
// The same three questions the hero listed, set the second time at heading
// scale. Nothing about them changed; what changed is that eight chapters now
// sit between the two statements, so the reader meets them having been told who
// built the infrastructure and why. That is the whole gesture, and it is the
// one thing this variant does that the other two do not: the page is a circle
// and it says so by repeating itself exactly.
//
// The numbering matches the hero's — 01, 02, 03 in the same mono — because the
// rhyme only works if the second instance is recognisably the first one.

export default function ClosingAnswer() {
  const rootRef = useScrollReveal<HTMLElement>({ start: "top 80%" });

  return (
    <section
      ref={rootRef}
      data-nav-dark
      className="bg-ink pb-[14svh] pt-[12svh] text-cream"
    >
      <Container>
        <div data-reveal className="flex items-baseline justify-between gap-6">
          <Eyebrow className="text-cream/45">The same questions</Eyebrow>
          <p className="text-caption-mono text-cream/45">Asked again</p>
        </div>

        <ol className="mt-12 flex flex-col border-b border-white/12">
          {QUESTIONS.map((question, i) => (
            <li
              key={question}
              data-reveal
              className="grid-ds items-baseline border-t border-white/12 py-8"
            >
              <span
                aria-hidden="true"
                className="col-span-2 text-caption-mono text-cream/45 lg:col-span-1"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="col-span-10 max-w-[26ch] text-h2 text-cream text-pretty lg:col-span-8 lg:col-start-4">
                {question}
              </span>
            </li>
          ))}
        </ol>

        <div className="grid-ds mt-[12svh]">
          <div className="col-span-12 lg:col-span-8 lg:col-start-4">
            <h2 data-reveal className="max-w-[20ch] text-h1 text-cream text-balance">
              The goal remains the <Accent>same</Accent> as it was in the beginning
            </h2>

            <p data-reveal className="mt-8 max-w-[46ch] text-body-lg text-cream/70 text-pretty">
              {CLOSING.body}
            </p>

            <div data-reveal className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-5">
              <CtaPill href={CLOSING.primary.href} tone="solid" external>
                {CLOSING.primary.label}
              </CtaPill>
              <Link
                href={CLOSING.secondary.href}
                className="text-label-lg text-cream underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream"
              >
                {CLOSING.secondary.label}
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
