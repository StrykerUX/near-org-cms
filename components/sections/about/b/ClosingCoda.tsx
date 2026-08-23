"use client";

import Link from "next/link";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import CtaPill from "@/components/sections/quantum/CtaPill";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { CLOSING, QUESTIONS } from "@/components/sections/about/aboutContent";

// §3 of variant B — the coda.
//
// The three questions get one beat each, and a beat is most of a screen. That
// is the whole idea: the questions are the page's refrain, and a refrain read
// three-in-a-list is a bullet list, while a refrain read one-screen-at-a-time
// is a refrain. The reader has to keep scrolling to finish the thought, which
// is the same demand the eight chapters made.
//
// The ground is ink and the chapter above it is white — the page's hardest cut,
// spent on its last turn.

/**
 * One beat. A component and not a `map` inside the parent because each beat
 * needs its OWN scroll trigger: three beats share a section that is two screens
 * tall, and one trigger on the section would fire all three while two of them
 * are still below the fold. A hook cannot be called in a loop, so the loop
 * becomes a component.
 */
function QuestionBeat({ question, index }: { question: string; index: number }) {
  const ref = useScrollReveal<HTMLDivElement>({ start: "top 72%", stagger: 0.14 });

  return (
    <li>
      <div
        ref={ref}
        className="flex min-h-[56svh] flex-col justify-center border-t border-white/12 py-[8svh]"
      >
        <p data-reveal className="text-caption-mono text-cream/45">
          {String(index + 1).padStart(2, "0")}
        </p>
        <p data-reveal className="mt-8 max-w-[22ch] text-h1 text-cream text-balance">
          {question}
        </p>
      </div>
    </li>
  );
}

export default function ClosingCoda() {
  const headRef = useScrollReveal<HTMLDivElement>({ start: "top 85%" });
  const codaRef = useScrollReveal<HTMLDivElement>({ start: "top 78%", stagger: 0.12 });

  return (
    <section data-nav-dark className="bg-ink pb-[16svh] pt-[14svh] text-cream">
      <Container>
        {/* No standfirst under the eyebrow. Everything that could be said here
            —that these are the questions the first chapter asked— the page has
            already said, and inventing a sentence for the slot would be copy
            that exists because a layout had a hole in it. */}
        <div ref={headRef}>
          <div data-reveal>
            <Eyebrow className="text-cream/45">The questions, again</Eyebrow>
          </div>
        </div>

        <ol className="mt-[8svh] flex flex-col">
          {QUESTIONS.map((question, i) => (
            <QuestionBeat key={question} question={question} index={i} />
          ))}
        </ol>

        <div ref={codaRef} className="mt-[16svh] flex flex-col items-center text-center">
          <h2 data-reveal className="max-w-[18ch] text-statement text-cream text-balance">
            The goal remains the <Accent display>same</Accent> as it was in the beginning
          </h2>

          <p data-reveal className="mt-10 max-w-[40ch] text-body-lg text-cream/70 text-pretty">
            {CLOSING.body}
          </p>

          <div data-reveal className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-5">
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
      </Container>
    </section>
  );
}
