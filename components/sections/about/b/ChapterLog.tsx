"use client";

import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import Figure from "@/components/primitives/Figure";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { DEBUG_MARKERS, EASE_OUT, REVEAL } from "@/components/primitives/motion/motionTokens";
import Panel from "@/components/sections/shells/instrument/Panel";
import Readout from "@/components/sections/shells/instrument/Readout";
import ArchiveSlot from "@/components/sections/about/ArchiveSlot";
import ConvergenceSolid from "@/components/sections/about/b/ConvergenceSolid";
import {
  CHAPTERS,
  FIGURES,
  READOUTS,
} from "@/components/sections/about/aboutContent";

// §3 of variant B — the log itself: eight entries, in order, on the dark.
//
// The sequence above is the machine; this is what the machine wrote down. So
// the unit of composition here is an ENTRY and not a page of prose: a year in
// mono against the left edge, the chapter beside it, and whatever the entry
// carries — an archive frame, a reading, a figure — placed in a plate row
// underneath at a width that never repeats.
//
// ── Why a nested grid here and not in variant A ───────────────────────────
//
// A's spine keeps one flat grid on purpose, because its margin notes have to
// land in the page's own columns 10-12 or their gutters stop agreeing with the
// rail. There is no rail here, and each entry spans all twelve columns, so a
// nested `grid-ds` inside it has the same width, the same count and the same
// gutter as the page grid — it aligns exactly. What that buys is an entry that
// is one element, which is what lets the reveal below be one trigger per entry
// instead of a table of row numbers.
//
// ── Why the readings are printed twice ────────────────────────────────────
//
// The hero panel states all four numbers before the story starts, and two of
// them appear again down here, in the footer of the panel belonging to the
// chapter that earns them. That is not an oversight: an instrument that shows a
// summary the log never confirms is showing a summary of nothing. The other two
// are treated differently on purpose — `35+` sits loose in the margin of its
// chapter, and `6 months` is never repeated at all, because that chapter's last
// sentence already is the number.
//
// ── The archive ───────────────────────────────────────────────────────────
//
// The eight frames come from `ARCHIVE` via `ArchiveSlot`, at the proportion the
// content module declares for each asset — a paper is portrait, a whiteboard is
// a panorama — and on `tone="dark"` throughout, since this variant has no light
// ground. What the layout decides is only where each one lands, and the widths
// deliberately do not repeat: margin, six columns right, the full twelve,
// nine inside a panel, seven hard left, margin again, four hard left, and the
// full twelve inside the last panel of the page.
//
// None of them carries `data-reveal`. A reserved box fading up reads as an
// image that failed to load and then recovered; the frames are simply there,
// and the prose is what arrives.

type Reading = { value: string; label: string };

const READOUT_BY_CHAPTER = new Map<string, Reading>(
  READOUTS.map((r) => [r.chapter, { value: r.value, label: r.label }])
);

/**
 * Where each entry puts its archive frame, and what its plate row holds.
 *
 * A table and not a rule, for the reason A's is: the decision is per chapter —
 * it depends on what the asset is, what the chapter weighs, and above all on
 * what the previous entry did. Eight frames placed by a rule are eight frames
 * in the same place.
 *
 *   `margin` — columns 10-12, beside the prose. The narrow slot.
 *   `plate`  — the row below, bare, at whatever `plate` declares.
 *   `panel`  — the row below, inside a `Panel` with the chapter's own reading
 *              in the footer. Three of the eight, so that the panel still reads
 *              as a decision rather than as the default container.
 */
const LAYOUT: Record<
  string,
  { archive: "margin" | "plate" | "panel"; plate: string | null }
> = {
  // 2017 · the paper. Portrait, in the margin, directly above the note that is
  // about the same document.
  paper: { archive: "margin", plate: null },
  // 2018 · the founders. Off to the right, overhanging the margin column.
  problem: { archive: "plate", plate: "lg:col-span-6 lg:col-start-7" },
  // 2018-2020 · the whiteboard. Full width: a 21/9 at anything narrower is a
  // hairline, and this is the one asset that is a drawing someone made.
  sharding: { archive: "plate", plate: "lg:col-span-12" },
  // 2021 · Rainbow Bridge, in a panel, with the million accounts under it.
  unifying: { archive: "panel", plate: "lg:col-span-9 lg:col-start-4" },
  // 2023 · the slide. Hard left and narrow — the first entry that starts where
  // the prose starts and stops early.
  "chain-abstraction": { archive: "plate", plate: "lg:col-span-7" },
  // 2024 · the square in the margin; the plate row belongs to the figure.
  ai: { archive: "margin", plate: "lg:col-span-12" },
  // 2025 · four columns, hard left. The narrowest plate on the page.
  intents: { archive: "plate", plate: "lg:col-span-4" },
  // 2026 · the last panel, full width, panoramic, with the uptime under it.
  now: { archive: "panel", plate: "lg:col-span-12" },
};

export default function ChapterLog() {
  const rootRef = useMotionScope<HTMLElement>(({ q, motionOk }) => {
    if (!motionOk) return;

    // One trigger per entry rather than one for the section: the section is
    // eight screens tall, so a single trigger at its top would play all eight
    // staggers while seven of them are still below the fold.
    const entries = q<HTMLElement>("[data-entry]");
    const reveals = entries.map((el) =>
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

  return (
    <section
      ref={rootRef}
      data-nav-dark
      className="bg-ink pb-[16svh] pt-[10svh] text-cream"
    >
      <Container>
        <Eyebrow className="text-white/40">The log</Eyebrow>

        <div className="mt-14 flex flex-col">
          {CHAPTERS.map((c, i) => {
            const slot = LAYOUT[c.id];
            const readout = READOUT_BY_CHAPTER.get(c.id);
            const figure = c.id === "ai";
            // The margin column earns its place with a note, a frame or a
            // reading — never as an empty cell propping a row open.
            const marginReadout = c.id === "intents" ? readout : undefined;
            const hasMargin =
              Boolean(c.note) || slot.archive === "margin" || Boolean(marginReadout);

            return (
              <article
                key={c.id}
                data-entry
                id={c.id}
                className={`grid-ds scroll-mt-[calc(var(--site-header-block)+2rem)] ${
                  i === 0 ? "" : "mt-[14svh]"
                }`}
              >
                <div data-reveal className="col-span-12 lg:col-span-2">
                  <p className="text-caption-mono text-near-green-accent">{c.yearLabel}</p>
                  <div className="mt-4 h-px w-full bg-white/12" aria-hidden="true" />
                </div>

                <div className="col-span-12 mt-6 lg:col-span-6 lg:col-start-3 lg:mt-0">
                  <h2 data-reveal className="max-w-[20ch] text-h2 text-cream text-pretty">
                    {c.title}
                  </h2>
                  <p data-reveal className="mt-6 max-w-[44ch] text-body-lg text-cream text-pretty">
                    {c.marker}
                  </p>
                  <div className="mt-8 flex flex-col gap-y-6">
                    {c.body.map((p) => (
                      <p
                        key={p.slice(0, 32)}
                        data-reveal
                        className="max-w-[62ch] text-body text-white/55 text-pretty"
                      >
                        {p}
                      </p>
                    ))}
                  </div>
                </div>

                {hasMargin && (
                  <aside className="col-span-12 mt-10 lg:col-span-3 lg:col-start-10 lg:mt-0">
                    {slot.archive === "margin" && (
                      <ArchiveSlot id={c.id} tone="dark" className="mb-10" />
                    )}

                    {marginReadout && (
                      <div data-reveal>
                        <Readout value={marginReadout.value} label={marginReadout.label} />
                      </div>
                    )}

                    {c.note && !figure && (
                      <div data-reveal>
                        <div className="h-px w-full bg-white/12" aria-hidden="true" />
                        <p className="mt-4 text-h4-mono italic text-cream">{c.note.label}</p>
                        <p className="mt-3 text-body-sm text-white/50 text-pretty">
                          {c.note.body}
                        </p>
                      </div>
                    )}
                  </aside>
                )}

                {slot.plate && (
                  <div className={`col-span-12 mt-12 lg:row-start-2 lg:mt-16 ${slot.plate}`}>
                    {figure ? (
                      // The one drawn figure of this variant, and the only place
                      // on the page where the whole shape of the history is a
                      // single object. The chapter's note travels with it: on an
                      // instrument a trace comes with its reading, and here the
                      // reading is a sentence rather than a number.
                      <Panel label={c.yearLabel} meta="Fig.">
                        <div className="grid-ds items-center gap-y-10 p-6 pt-16 lg:p-10 lg:pt-20">
                          <div className="col-span-12 lg:col-span-7">
                            <Figure caption={FIGURES.ai.caption} tone="dark">
                              <ConvergenceSolid />
                            </Figure>
                          </div>
                          {c.note && (
                            <div className="col-span-12 lg:col-span-4 lg:col-start-9">
                              <p className="text-h3-serif italic text-near-green-accent">
                                {c.note.label}
                              </p>
                              <p className="mt-5 max-w-[34ch] text-body text-white/55 text-pretty">
                                {c.note.body}
                              </p>
                            </div>
                          )}
                        </div>
                      </Panel>
                    ) : slot.archive === "panel" ? (
                      <Panel
                        tone="slate"
                        label={c.yearLabel}
                        footer={
                          readout ? (
                            <Readout
                              value={readout.value}
                              label={readout.label}
                              accent={c.id === "unifying"}
                            />
                          ) : undefined
                        }
                      >
                        <div className="p-5 pt-16 lg:p-7 lg:pt-20">
                          <ArchiveSlot id={c.id} tone="dark" />
                        </div>
                      </Panel>
                    ) : (
                      <ArchiveSlot id={c.id} tone="dark" />
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
