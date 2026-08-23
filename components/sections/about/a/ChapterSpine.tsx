"use client";

import { Fragment } from "react";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { gsap, ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { EASE_OUT, REVEAL, DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { CHAPTERS } from "@/components/sections/about/aboutContent";

// §2 of variant A — the eight chapters, read against a rail of years.
//
// ── Why not a timeline of dots ─────────────────────────────────────────────
// The obvious drawing for eight dated chapters is a vertical line with a node
// per year. It was rejected for a specific reason, not for taste: a dotted
// timeline gives all eight chapters the same visual weight and the same visual
// shape, so a page whose whole argument is that the story BENDS — research,
// detour, infrastructure, return — renders as eight identical beads. It also
// spends a column on an ornament that carries no words.
//
// The rail carries the years themselves. It is a table of contents that happens
// to be pinned, so it does two jobs a dot column cannot: it says where you are,
// and it lets you go somewhere else. Each year is an anchor.
//
// ── One mechanism marks the current chapter, and it is the rule ────────────
// The obvious candidates were colour, weight, an indent, and the length of the
// hairline. Using two of them at once is what makes a marker look designed
// rather than read as information, so this uses ONE: the hairline under the
// active year runs the full width of the rail, and the other seven stay at a
// short tick. Nothing else changes — the years are all the same colour, size
// and position at rest.
//
// Colour is still used, but for a different job: hover and keyboard focus. That
// separation is deliberate — the reader's own pointer gets colour, the reading
// position gets length — and it is why `aria-current` is set from the same
// place, so the state is not carried by a visual property alone.
//
// ── Mobile: the rail disappears, and each chapter carries its own year ─────
// The other option was a horizontal ribbon of years pinned to the top. Two
// reasons against it. First, the site header is already `fixed`, so a second
// sticky strip on a 375px screen spends a third of the viewport on chrome
// before a word of the chapter is visible. Second, the rail's actual job is
// "where am I among eight", and on a phone only one chapter is ever on screen —
// the question the rail answers is one the reader is not asking there. So the
// year moves inside the chapter, where it is a dateline, and the rail is gone.

// The resting length of a year's hairline, as a fraction of the rail's width.
// It also has to be right WITHOUT JavaScript: the class below is the resting
// state and the tween only ever moves away from it, so a reader with no JS gets
// eight short ticks rather than eight full rules or none.
const LEAD = 0.18;

// Explicit row placement. `grid-ds` gives the page's 12 columns; the rows are
// declared here because the rail, the prose and the margin notes are SIBLINGS
// in one grid rather than a rail beside a nested grid of chapters. That is what
// makes a note land in columns 10-12 of the page grid instead of in columns
// 10-12 of some sub-grid whose gutters no longer match anything.
const ROW_START = [
  "lg:row-start-1",
  "lg:row-start-2",
  "lg:row-start-3",
  "lg:row-start-4",
  "lg:row-start-5",
  "lg:row-start-6",
  "lg:row-start-7",
  "lg:row-start-8",
] as const;

export default function ChapterSpine() {
  const rootRef = useMotionScope<HTMLElement>(({ q, motionOk, isDesktop }) => {
    const chapters = q<HTMLElement>("[data-chapter]");

    // The reveal is per chapter and not one timeline for the section: the
    // section is eight screens tall, so a single trigger on its top would play
    // all eight staggers while seven of them are still below the fold, and the
    // reader would arrive at every chapter already finished.
    // A chapter's margin note is a SIBLING of its article in the grid — that is
    // the whole point of the flat grid — so it cannot be picked up by querying
    // inside the article. It is matched back to its chapter by index so it
    // arrives with the prose it belongs to instead of sitting there already
    // visible while the chapter fades in beside it.
    const notes = q<HTMLElement>("[data-note-for]");

    const reveals = motionOk
      ? chapters.map((el, i) => {
          const note = notes.find((n) => n.dataset.noteFor === String(i));
          const targets: Element[] = [...el.querySelectorAll("[data-reveal]")];
          if (note) targets.push(note);

          return gsap.from(targets, {
            autoAlpha: 0,
            y: REVEAL.y,
            duration: REVEAL.duration,
            stagger: REVEAL.stagger,
            ease: EASE_OUT,
            scrollTrigger: { trigger: el, start: "top 82%", once: true, markers: DEBUG_MARKERS },
          });
        })
      : [];

    const triggers: ReturnType<typeof ScrollTrigger.create>[] = [];
    const rules = q<HTMLElement>("[data-rail-rule]");

    if (isDesktop) {
      const items = q<HTMLAnchorElement>("[data-rail-item]");
      // With reduced motion the rail still marks — it is a reading aid, not an
      // ornament — it just arrives instead of growing.
      const duration = motionOk ? 0.5 : 0;
      let current = -1;

      const mark = (i: number) => {
        if (i === current) return;
        current = i;
        rules.forEach((rule, k) => {
          gsap.to(rule, {
            scaleX: k === i ? 1 : LEAD,
            duration,
            ease: EASE_OUT,
            overwrite: true,
          });
        });
        items.forEach((item, k) => {
          if (k === i) item.setAttribute("aria-current", "true");
          else item.removeAttribute("aria-current");
        });
      };

      chapters.forEach((el, i) => {
        triggers.push(
          // Reads only: no pin, no scrub, no scroll written. The trigger's whole
          // output is which index is crossing the 55% line.
          ScrollTrigger.create({
            trigger: el,
            start: "top 55%",
            end: "bottom 55%",
            markers: DEBUG_MARKERS,
            onToggle: (self) => {
              if (self.isActive) mark(i);
            },
          })
        );
      });

      // Above the first chapter nothing is crossing the line, and an unmarked
      // rail on arrival reads as broken rather than as "not yet".
      mark(0);
    }

    return () => {
      reveals.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
      triggers.forEach((t) => t.kill());
      gsap.killTweensOf(rules);
    };
  });

  return (
    <section ref={rootRef} className="bg-cream pb-[14svh] pt-[6svh]">
      <Container>
        <div className="grid-ds">
          {/* ── the rail ──────────────────────────────────────────────────── */}
          <nav
            aria-label="Chapters"
            className="hidden lg:sticky lg:top-[calc(var(--site-header-block)+3rem)] lg:col-span-2 lg:row-start-1 lg:row-end-9 lg:block lg:self-start"
          >
            <Eyebrow className="text-gray-intermediate">Contents</Eyebrow>
            <ol className="mt-8 flex flex-col gap-y-6">
              {CHAPTERS.map((c) => (
                <li key={c.id}>
                  <a
                    data-rail-item
                    href={`#${c.id}`}
                    className="group block text-caption-mono text-ink-soft transition-colors hover:text-ink focus-visible:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
                  >
                    {c.yearLabel}
                    <span
                      data-rail-rule
                      aria-hidden="true"
                      className="mt-2 block h-px w-full origin-left scale-x-[0.18] bg-rule group-hover:bg-ink"
                    />
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* ── the chapters, and their margin notes ───────────────────────── */}
          {CHAPTERS.map((c, i) => (
            <Fragment key={c.id}>
              <article
                data-chapter
                id={c.id}
                className={`col-span-12 scroll-mt-[calc(var(--site-header-block)+2rem)] lg:col-span-6 lg:col-start-4 ${ROW_START[i]} ${
                  i === 0 ? "" : "pt-[14svh]"
                }`}
              >
                {/* The dateline the rail replaces on desktop. `lg:hidden` is
                    display:none, so it leaves the accessibility tree there too
                    and the year is never announced twice. */}
                <p data-reveal className="text-caption-mono text-gray-intermediate lg:hidden">
                  {c.yearLabel}
                </p>

                <h2 data-reveal className="mt-4 max-w-[20ch] text-h2 text-ink text-pretty lg:mt-0">
                  {c.title}
                </h2>

                <p data-reveal className="mt-6 max-w-[46ch] text-body-lg text-ink text-pretty">
                  {c.marker}
                </p>

                <div className="mt-8 flex flex-col gap-y-6">
                  {c.body.map((p) => (
                    <p
                      key={p.slice(0, 32)}
                      data-reveal
                      className="max-w-[65ch] text-body text-ink-soft text-pretty"
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </article>

              {c.note && (
                <aside
                  data-note-for={i}
                  className={`col-span-12 pt-8 lg:col-span-3 lg:col-start-10 ${ROW_START[i]} ${
                    i === 0 ? "lg:pt-0" : "lg:pt-[14svh]"
                  }`}
                >
                  <div className="h-px w-full bg-rule" aria-hidden="true" />
                  <p className="mt-4 uppercase text-micro-mono text-gray-intermediate">Note</p>
                  <p className="mt-3 text-body-sm text-ink text-pretty">{c.note.label}</p>
                  <p className="mt-3 text-body-sm text-gray-intermediate text-pretty">
                    {c.note.body}
                  </p>
                </aside>
              )}
            </Fragment>
          ))}
        </div>
      </Container>
    </section>
  );
}
