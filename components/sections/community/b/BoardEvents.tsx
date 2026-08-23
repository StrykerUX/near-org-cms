"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import Container from "@/components/primitives/Container";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { EASE_OUT, DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { EVENTS, type CommunityEvent } from "@/components/sections/community/communityContent";

export type BoardEventsProps = {
  /** The feed. Sample data today, a Luma calendar the day `page.tsx` fetches it. */
  events: readonly CommunityEvent[];
};

// §3 of the Board — the calendar as an actual table.
//
// ── The page's one signed gesture ──────────────────────────────────────────
// The board fills in: rows land top to bottom, and each row's date settles a
// beat behind its own row, character by character. It is ONE gesture, not two —
// the row arriving and its date resolving are the same event, the way a
// departures board commits a row after the row appears.
//
// What it deliberately is NOT is a split-flap. A flip-clock imitated in CSS is
// the first idea anybody has in front of a departures board and it is a costume:
// it renders a mechanical linkage this page has no reason to have, it needs a
// per-character 3D rig, and it degrades into nonsense the moment the reader has
// reduced motion on. A character settling into place says the same thing about
// live data, in the vocabulary the rest of the site already uses.
//
// ── Why `.from` and not `staggerChars()` ───────────────────────────────────
// `staggerChars` emits `.to` tweens, which means the characters have to already
// be hidden before the timeline runs. On a scrubbed timeline that is free (you
// `set` at position 0); here the timeline is a play-once triggered at
// "top 80%", so pre-hiding would either flash the finished dates first or
// require CSS that leaves them invisible forever if the JS never arrives.
// `.from` has `immediateRender: true` and applies the start state in the frame
// the timeline is BUILT, which is the same reason `useScrollReveal` refuses to
// pre-hide in CSS. Without JS, with reduced motion, or on a failed bundle, the
// table is simply a finished table.
const ROW_STEP = 0.085;
const CHAR_STEP = 0.03;

// The five columns, as one map. Two places have to agree on these widths — the
// header row and every data row — and a literal in each is how they drift.
//
// Below `lg` the row folds onto two lines: date and title on the first, then
// city and type tucked under the title (`col-start-5`) so the date keeps its own
// column and the eye can still run straight down it — which is the entire reason
// this variant uses a table.
const COL = {
  date: "col-span-4 lg:col-span-2",
  title: "col-span-8 lg:col-span-4",
  city: "col-span-4 col-start-5 lg:col-span-2 lg:col-start-auto",
  kind: "col-span-4 lg:col-span-2",
  // Hidden below `lg`, and that is a measurement rather than a preference: at
  // 375px a two-column cell is ~29px, which does not hold the word "Register"
  // at any size in the scale. The row is a link on every viewport, so what is
  // lost on a phone is a label for an affordance the whole row already carries.
  action: "hidden lg:col-span-2 lg:flex",
} as const;

export default function BoardEvents({ events }: BoardEventsProps) {
  const rootRef = useMotionScope<HTMLElement>(({ q, motionOk }) => {
    if (!motionOk) return;

    const tl = gsap.timeline({
      defaults: { ease: EASE_OUT },
      scrollTrigger: {
        trigger: q("[data-board]")[0],
        start: "top 80%",
        once: true,
        markers: DEBUG_MARKERS,
      },
    });

    q("[data-row]").forEach((row, i) => {
      const at = i * ROW_STEP;
      tl.from(row, { autoAlpha: 0, y: 16, duration: 0.5 }, at);

      // Scoped to the row, so row two's date cannot be driven by row one's slot
      // in the cascade. `q` is scoped to the section, not to the row.
      const chars = Array.from(row.querySelectorAll("[data-date-char]"));
      tl.from(
        chars,
        { autoAlpha: 0, yPercent: 55, duration: 0.3, stagger: CHAR_STEP },
        at + 0.12
      );
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  });

  return (
    <section
      ref={rootRef}
      id="events"
      className="scroll-mt-[var(--site-header-block)] bg-cream pb-[10svh] pt-[6svh]"
    >
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <div>
            <p className="text-eyebrow-mono uppercase text-gray-intermediate">{EVENTS.eyebrow}</p>
            <h2 className="mt-4 max-w-[18ch] text-h2 text-pretty">{EVENTS.headline}</h2>
          </div>
          <p className="max-w-[38ch] text-body-sm text-ink-soft text-pretty">{EVENTS.sub}</p>
        </div>

        <div data-board className="mt-12">
          {/* The header row is the thing that makes this a table rather than a
              styled list, and it is `hidden` below `lg` on purpose: at phone
              width the row wraps to two lines and a header can no longer sit
              over a column that is not there. */}
          <div
            className="hidden border-y border-rule py-3 text-micro-mono uppercase text-gray-intermediate lg:grid-ds"
            aria-hidden="true"
          >
            <span className={COL.date}>Date</span>
            <span className={COL.title}>Event</span>
            <span className={COL.city}>City</span>
            <span className={COL.kind}>Type</span>
            {/* Not `COL.action`: that one is a hidden flex row, and a lone text
                node inside a flex box ignores `text-right`. The header lives
                inside a container that is already `lg`-only. */}
            <span className="col-span-2 text-right">Action</span>
          </div>

          <ul className="border-t border-rule lg:border-t-0">
            {events.map((e) => (
              <li key={e.id} data-row className="border-b border-rule">
                <a
                  href={e.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group grid-ds items-baseline gap-y-2 py-4 transition-colors hover:bg-black/[0.04] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ink"
                >
                  {/* The characters are split for the settle, and they stay real
                      text in reading order — no `aria-label` juggling, because a
                      label on a bare span is not reliably announced and would
                      risk dropping the date from the link's name entirely. */}
                  <span className={`${COL.date} text-caption-mono uppercase text-ink`}>
                    {Array.from(e.dateLabel).map((ch, i) => (
                      <span
                        key={`${e.id}-${i}`}
                        data-date-char
                        className="inline-block whitespace-pre"
                      >
                        {ch}
                      </span>
                    ))}
                  </span>
                  <span className={`${COL.title} text-body text-pretty`}>{e.title}</span>
                  <span className={`${COL.city} text-body-sm text-ink-soft`}>{e.city}</span>
                  <span
                    className={`${COL.kind} text-caption-mono uppercase text-gray-intermediate`}
                  >
                    {e.kind}
                  </span>
                  <span
                    className={`${COL.action} items-center justify-end gap-2 text-caption-mono uppercase text-gray-intermediate transition-colors group-hover:text-ink`}
                  >
                    Register
                    <ArrowUpRight
                      className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-3">
          <a
            href={EVENTS.primary.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-label underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            {EVENTS.primary.label}
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
          <Link
            href={EVENTS.secondary.href}
            className="text-label text-gray-intermediate underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            {EVENTS.secondary.label}
          </Link>
        </div>
      </Container>
    </section>
  );
}
