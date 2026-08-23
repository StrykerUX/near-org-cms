"use client";

import { ArrowUp } from "lucide-react";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import DescentPanel from "@/components/sections/economics/c/DescentPanel";
import { FLYWHEEL } from "@/components/sections/economics/economicsContent";

// §3 of variant C — the flywheel as four screens you fall through.
//
// ── The device, and why it is distance and not a diagram ───────────────────
// Every variant of this page has to stop the reader taking the four steps out
// of order. A rings them; B chains them by their inputs and outputs. C uses the
// bluntest instrument available: one step per screen. Step 3 is not reachable
// without passing through step 2, because there is a viewport of ink between
// them. No figure to build, no sticky lock to maintain, and it degrades to
// exactly itself with JavaScript off.
//
// ── The return is a section, not a sentence at the bottom of panel four ────
// Step 4 only means anything as the thing that restarts step 1, and on a page
// read by falling, "it starts again" has to be a place the reader arrives at —
// with the ground changing back to the one the descent started on, an arrow
// that points up rather than down, and a live link back to the first panel. A
// line of copy under panel four would be a caption on a fall that already
// ended.
//
// The panels alternate cream and ink so the descent has a beat; the return
// landing back on cream is the same alternation resolving, which is the closing
// argument made in ground rather than in words.

const STEPS = FLYWHEEL.steps;
const anchorOf = (id: string) => `step-${id}`;

export default function DescentPanels() {
  return (
    <>
      <LoopOpening />
      {STEPS.map((s, i) => (
        <DescentPanel
          key={s.id}
          index={s.index}
          short={s.short}
          title={s.title}
          body={s.body}
          anchor={anchorOf(s.id)}
          dark={i % 2 === 1}
        />
      ))}
      <LoopReturn />
    </>
  );
}

// The one place the section explains itself before performing. Short on
// purpose: four full screens follow, and a long preamble would spend the
// reader's patience on the part that argues least.
function LoopOpening() {
  const rootRef = useScrollReveal<HTMLElement>({ start: "top 80%" });

  return (
    <section ref={rootRef} id="how-it-works" className="bg-cream pb-[8svh] pt-[12svh]">
      <Container>
        <div data-reveal>
          <Eyebrow className="text-gray-intermediate">{FLYWHEEL.eyebrow}</Eyebrow>
        </div>
        <div className="mt-10 grid-ds gap-y-10">
          <h2 data-reveal className="col-span-12 max-w-[16ch] text-h1 text-pretty lg:col-span-6">
            {FLYWHEEL.headline}
          </h2>
          <p
            data-reveal
            className="col-span-12 max-w-[54ch] text-body text-ink-soft text-pretty lg:col-span-5 lg:col-start-8"
          >
            {FLYWHEEL.intro}
          </p>
        </div>
      </Container>
    </section>
  );
}

function LoopReturn() {
  const rootRef = useScrollReveal<HTMLElement>({ start: "top 78%" });

  return (
    <section className="flex min-h-svh flex-col justify-center bg-cream py-[10svh]" ref={rootRef}>
      <Container>
        <div className="grid-ds gap-y-12">
          <div className="col-span-12 lg:col-span-3">
            {/* Up, and it is the only arrow on the page that points that way. */}
            <a
              data-reveal
              href={`#${anchorOf(STEPS[0].id)}`}
              className="inline-flex items-center gap-3 border-b border-foreground/30 pb-2 text-caption-mono uppercase text-ink transition-colors hover:border-foreground"
            >
              <ArrowUp className="size-4" aria-hidden="true" />
              {STEPS[STEPS.length - 1].index} → {STEPS[0].index} {STEPS[0].short}
            </a>
          </div>

          <p
            data-reveal
            className="col-span-12 max-w-[30ch] text-h2-serif italic text-pretty lg:col-span-8 lg:col-start-5"
          >
            {FLYWHEEL.closing}
          </p>
        </div>
      </Container>
    </section>
  );
}
