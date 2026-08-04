"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const ROWS_PER_COLUMN = 6;
// One duration per column so each scrolls at its own rhythm instead of in lockstep.
const COLUMN_DURATIONS = [14, 19, 16, 22];

function CompanyColumn({
  duration,
  columnIndex,
}: {
  duration: number;
  columnIndex: number;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    // Without this, GSAP's ticker tries to "catch up" after any main-thread
    // stall (very common in dev with HMR) by jumping the animation forward —
    // on an infinite loop that reads as a stutter/jump instead of a pause.
    gsap.ticker.lagSmoothing(0);

    // The wrapper holds exactly two identical copies of the same list back
    // to back, so its natural height is always precisely 2x one set's
    // height — -50% is exact by construction, independent of card size,
    // aspect ratio, or gap.
    const tween = gsap.fromTo(
      el,
      { yPercent: -50 },
      { yPercent: 0, duration, repeat: -1, ease: "none", force3D: true }
    );

    return () => {
      tween.kill();
    };
  }, [duration]);

  const columnLetter = String.fromCharCode(65 + columnIndex);
  const labels = Array.from({ length: ROWS_PER_COLUMN }, (_, row) =>
    `${columnLetter}${String.fromCharCode(65 + row)}`
  );
  // Duplicated verbatim: the second set must render the exact same labels so
  // a looped card visually matches the one that just scrolled out.
  const cards = [...labels, ...labels];

  return (
    <div className="relative h-full min-h-0 overflow-hidden">
      <div ref={wrapperRef} className="flex will-change-transform flex-col gap-6">
        {cards.map((label, i) => (
          <div
            key={i}
            className="flex aspect-[3/4] w-full items-center justify-center rounded-xl border border-secondary-foreground/10 bg-secondary-foreground/10"
          >
            <div className="flex size-8 items-center justify-center rounded-full bg-secondary-foreground/20">
              <span className="text-body-sm font-medium">{label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CompanyGrid() {
  return (
    <div className="grid h-full min-h-0 grid-cols-4 gap-6">
      {COLUMN_DURATIONS.map((duration, i) => (
        <CompanyColumn key={i} duration={duration} columnIndex={i} />
      ))}
    </div>
  );
}
