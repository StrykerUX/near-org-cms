"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { gsap, SplitText } from "@/components/primitives/motion/gsapClient";
import { allowDescenders } from "@/components/primitives/motion/maskedLines";
import { EASE_OUT, DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { MISSION } from "@/components/sections/foundation/foundationContent";

// §3 — the one page in the file that is not in the file.
//
// Everything above and below this section is ruled, numbered and railed. This
// block has no rule, no clause number, no rail, and it is on white rather than
// on the document's cream. It is the only such block in the variant, and it
// gets that treatment for a literal reason: it is the sentence in which the
// organisation says it intends to stop being the thing the rest of the document
// describes. The layout does not illustrate that — the layout is the exception,
// which is what the sentence is.
//
// Consequences to keep if this is edited: it must stay the ONLY break. Two
// exceptions are a rhythm, and a rhythm is a format, and then the page is back
// to having one register with a loud variant instead of a document with one
// escape. And it stays on white — the DS allows the white ground once per page,
// and this is what it is for.
export default function DevolutionBreak() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk }) => {
    if (!motionOk) return;

    const heading = q("[data-break-heading]")[0];
    const tl = gsap.timeline({
      defaults: { ease: EASE_OUT },
      scrollTrigger: { trigger: scope, start: "top 74%", once: true, markers: DEBUG_MARKERS },
    });
    let split: SplitText | null = null;
    let cancelled = false;

    // Fonts first: a line mask measured against the fallback face clips the
    // real one. Until it resolves the headline is simply on screen, unanimated.
    const run = () => {
      if (cancelled || !heading) return;
      split = SplitText.create(heading, { type: "lines", mask: "lines", autoSplit: false });
      allowDescenders(split.lines);
      tl.from(split.lines, { yPercent: 112, autoAlpha: 0, duration: 1.05, stagger: 0.12 }, 0);
    };

    if (document.fonts?.ready) document.fonts.ready.then(run).catch(run);
    else run();

    tl.from(q("[data-break-item]"), { y: 24, autoAlpha: 0, duration: 0.85, stagger: 0.14 }, 0.45);

    return () => {
      cancelled = true;
      split?.revert();
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  });

  return (
    <section ref={rootRef} className="bg-background py-[18svh]">
      <Container>
        <h2
          data-break-heading
          className="max-w-[13ch] text-statement text-balance"
        >
          Our goal is to make ourselves <Accent display>smaller</Accent>
        </h2>

        <div className="mt-[10svh] grid-ds gap-y-10">
          {/* The last entry of `body` is the kicker and is set apart below —
              see the note on MISSION in foundationContent.ts. */}
          {MISSION.body.slice(0, -1).map((paragraph, i) => (
            <p
              key={paragraph}
              data-break-item
              className={`col-span-12 max-w-[46ch] text-body-lg text-ink-soft lg:col-span-4 text-pretty ${
                i === 0 ? "" : "lg:col-start-6"
              }`}
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* The serif is the second half of the escape: the document is set in
            sans and mono from end to end, so the one line that leaves the
            format leaves the face as well. */}
        <p
          data-break-item
          className="mt-[10svh] max-w-[22ch] text-h2-serif italic text-ink lg:ml-[42%] text-balance"
        >
          {MISSION.kicker}
        </p>
      </Container>
    </section>
  );
}
