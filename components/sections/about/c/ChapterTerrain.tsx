"use client";

import Container from "@/components/primitives/Container";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { DEBUG_MARKERS, EASE_OUT, REVEAL } from "@/components/primitives/motion/motionTokens";
import ArchiveSlot from "@/components/sections/about/ArchiveSlot";
import ChapterFigure from "@/components/sections/about/ChapterFigure";
import ChapterCard from "@/components/sections/about/c/ChapterCard";
import { CHAPTERS, type AboutChapter } from "@/components/sections/about/aboutContent";

// §2 of variant C — the eight chapters, as ground that formed.
//
// ── The rhythm, which is the whole layout decision ────────────────────────
//
// Eight identical cards down a page is a template, so the eight are read in
// three grounds and two registers, and neither the ground nor the register
// changes on a schedule:
//
//   cream · the founding      two cards side by side, then the sharding
//                             chapter opened out: its whiteboard runs the full
//                             width of the page, past the container, with the
//                             prose and the drawn figure under it.
//   tint  · the abstraction   three cards at three different widths and two
//                             rows, the 2024 one lit — this is the section that
//                             groups cards, which is what `tint` is for.
//   white · the operating     no cards at all. The page's one white ground is
//                             also the one place the boxes stop, so the respiro
//                             is structural and not just a lighter colour.
//
// The two full-bleed frames are the two panoramas — 21/9 and 5/2 — and only
// those two. A 3/4 portrait at page width is a screen and a half of one
// photograph; the bleed that makes a panorama monumental makes a portrait an
// obstruction. Which is also why they are the only two chapters that get
// opened out: the layout follows the assets, not a pattern.
//
// ── Which figure goes where ──────────────────────────────────────────────
//
// The sharding drawing is here, flat, at `../figures/ShardingDiagram` — the
// hairline version, unchanged, because on cream at half a column it is already
// doing its whole job and giving it volume would only make it heavier than the
// chapter it belongs to. The convergence drawing is NOT here: it is the page's
// closing image, at page scale, in `ClosingCircle`. Printing it beside the 2024
// chapter as well would spend the page's one big picture twice.
//
// ── Reveal ────────────────────────────────────────────────────────────────
//
// A card is the unit, so a card is what arrives — the whole surface, the frame
// with it. The bare frames, the ones running to the page edges, do not carry
// `data-reveal`: a reserved box on its own fading up reads as an image that
// failed and then recovered, and at full page width it would be the largest
// thing on screen doing it.

const BY_ID = new Map<string, AboutChapter>(CHAPTERS.map((c) => [c.id, c]));

/** A chapter with no box around it. The register the white section is in. */
function OpenChapter({ chapter, className = "" }: { chapter: AboutChapter; className?: string }) {
  return (
    <article
      id={chapter.id}
      className={`scroll-mt-[calc(var(--site-header-block)+2rem)] ${className}`}
    >
      <p data-reveal className="text-caption-mono text-gray-intermediate">
        {chapter.yearLabel}
      </p>
      <h2 data-reveal className="mt-4 max-w-[20ch] text-h2 text-ink text-pretty">
        {chapter.title}
      </h2>
      <p data-reveal className="mt-5 max-w-[38ch] text-body-lg text-ink text-pretty">
        {chapter.marker}
      </p>
      <div className="mt-7 flex flex-col gap-y-5">
        {chapter.body.map((p) => (
          <p
            key={p.slice(0, 32)}
            data-reveal
            className="max-w-[62ch] text-body text-ink-soft text-pretty"
          >
            {p}
          </p>
        ))}
      </div>
    </article>
  );
}

function card(id: string) {
  return BY_ID.get(id);
}

export default function ChapterTerrain() {
  const rootRef = useMotionScope<HTMLDivElement>(({ q, motionOk }) => {
    if (!motionOk) return;

    // One trigger per block, not one for the whole run: this is six screens
    // tall, and a single trigger at the top would play every stagger while most
    // of them are still below the fold.
    const blocks = q<HTMLElement>("[data-block]");
    const reveals = blocks.map((el) =>
      gsap.from(el.querySelectorAll("[data-reveal]"), {
        autoAlpha: 0,
        y: REVEAL.y,
        duration: REVEAL.duration,
        stagger: REVEAL.stagger,
        ease: EASE_OUT,
        scrollTrigger: { trigger: el, start: "top 82%", once: true, markers: DEBUG_MARKERS },
      })
    );

    return () =>
      reveals.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
  });

  const paper = card("paper");
  const problem = card("problem");
  const sharding = card("sharding");
  const unifying = card("unifying");
  const abstraction = card("chain-abstraction");
  const ai = card("ai");
  const intents = card("intents");
  const now = card("now");

  return (
    <div ref={rootRef}>
      {/* ── the founding ──────────────────────────────────────────────── */}
      <section className="bg-cream py-[14svh]">
        <Container>
          <div data-block className="grid-ds items-start gap-y-10">
            {paper && (
              <div data-reveal className="col-span-12 lg:col-span-6">
                <ChapterCard chapter={paper} />
              </div>
            )}
            {problem && (
              <div data-reveal className="col-span-12 lg:col-span-6">
                <ChapterCard chapter={problem} />
              </div>
            )}
          </div>
        </Container>

        {/* The whiteboard, at the width of the page. This asset is a drawing
            somebody made on a wall, so it is the one that most wants to be
            looked at rather than referred to. */}
        <div className="mt-[14svh]">
          <ArchiveSlot id="sharding" />
        </div>

        <Container>
          <div data-block className="grid-ds mt-16 items-start gap-y-12">
            {sharding && <OpenChapter chapter={sharding} className="col-span-12 lg:col-span-6" />}
            <div data-reveal className="col-span-12 lg:col-span-5 lg:col-start-8">
              <ChapterFigure id="sharding" />
            </div>
          </div>
        </Container>
      </section>

      {/* ── the abstraction ───────────────────────────────────────────── */}
      <section className="bg-card-tint/50 py-[14svh]">
        <Container>
          <div className="grid-ds items-start gap-y-14">
            {unifying && (
              <div data-block className="col-span-12 lg:col-span-7 lg:row-start-1">
                <div data-reveal>
                  <ChapterCard chapter={unifying} />
                </div>
              </div>
            )}
            {abstraction && (
              <div data-block className="col-span-12 lg:col-span-5 lg:col-start-8 lg:row-start-1">
                <div data-reveal>
                  <ChapterCard chapter={abstraction} />
                </div>
              </div>
            )}
            {/* 2024 is the chapter the page turns on — the models arrive and the
                network they built while waiting is the one those models need.
                It is the only lit card on the page, and lighting a second would
                stop it meaning anything. */}
            {ai && (
              <div data-block className="col-span-12 lg:col-span-6 lg:col-start-4 lg:row-start-2">
                <div data-reveal>
                  <ChapterCard chapter={ai} accent />
                </div>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* ── the operating ─────────────────────────────────────────────── */}
      <section className="bg-background py-[14svh]">
        <Container>
          <div data-block className="grid-ds items-start gap-y-12">
            {intents && <OpenChapter chapter={intents} className="col-span-12 lg:col-span-5" />}
            <div className="col-span-12 lg:col-span-4 lg:col-start-8">
              <ArchiveSlot id="intents" />
            </div>
          </div>
        </Container>

        <div className="mt-[14svh]">
          <ArchiveSlot id="now" />
        </div>

        <Container>
          <div data-block className="grid-ds mt-16">
            {now && <OpenChapter chapter={now} className="col-span-12 lg:col-span-7 lg:col-start-6" />}
          </div>
        </Container>
      </section>
    </div>
  );
}
