"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import ArrowCircle from "@/components/sections/quantum/ArrowCircle";
import { NEAR_MARK_PATH } from "@/components/sections/quantum-security-copy/NearMark";
import { keyField, KEY_SLOTS, slotPoint, round4 } from "@/components/sections/quantum-security-labs/quantumArt";
import { PROBLEM_SOLUTION_LEAD } from "@/components/sections/quantum-security-labs/labContent";
import { SEQUENCE_BEATS as BEATS } from "@/components/sections/quantum-security-copy/quantumContent";

// ── H2 · §Problem + §Solution, as one section ──────────────────────────────
// The deck gives three pieces here and the current build carries two of them:
// a framing paragraph (`[Problem + Solution Overall]`), the threat, and the
// answer. The framing paragraph says the two are one thought — "every
// blockchain will have to upgrade… NEAR designed accounts so that becoming
// quantum-safe is a single transaction" — so this proposal puts them in one
// section, split by a rule, rather than in two sections the reader has to
// connect for themselves.
//
// **The rule down the middle is the argument.** It is the house's own divider
// (`chain-ab-propuesta-a`'s stat row, `WhyItMatters`' column rules) doing
// rhetorical work: on the left the problem, on the right the answer, and one
// hairline between them. Two separate sections cannot say "these are two halves
// of one thing" — only a shared frame can.
//
// **The figure crosses the rule, which is why it is one figure and not two.**
// A field of accounts on the left, the exposed ones marked; the field converges
// through the divider; on the right it has become ONE account with a key slot,
// the old key leaving and the quantum-safe one arriving, and the account mark
// itself never moves. The whole page is that sentence.
//
// It is the one thing the deck states three separate times and never draws:
// "addresses whose public keys are already visible onchain are the most
// exposed". Nothing in the deck gives a share, so the field carries a caption
// instead of a percentage — a lit fraction that looked measured would be
// reporting a statistic no source here supports.
//
// The reveal is the house default: `useScrollReveal`, once, no scrub. H3 is
// where this content gets the sticky treatment.

const FIELD = keyField(16, 7, 41);

// ── Figure geometry ────────────────────────────────────────────────────────
// One wide box. The left third holds the field, the middle third the
// convergence, the right third the account.
const W = 1200;
const H = 300;
const FIELD_BOX = { x: 0, y: 26, w: 420, h: 248 };
const CORE = { x: 880, y: 150 };
const R = 92;

const OUT = slotPoint(CORE.x, CORE.y, R, KEY_SLOTS.outgoing);
const IN = slotPoint(CORE.x, CORE.y, R, KEY_SLOTS.incoming);

// Placed dots, in the figure's own coordinates.
const DOTS = FIELD.map((d) => ({
  ...d,
  px: round4(FIELD_BOX.x + (d.x / 100) * FIELD_BOX.w),
  py: round4(FIELD_BOX.y + (d.y / 100) * FIELD_BOX.h),
}));

// The convergence: only the EXPOSED dots reach for the account. The unexposed
// ones stay where they are, which is the honest reading — the answer is for the
// accounts at risk, and drawing every dot converging would say the whole
// population migrates at once.
const THREADS = DOTS.filter((d) => d.exposed).map((d) => {
  // A single quadratic with its control point pulled toward the middle band, so
  // the threads bow through the divider instead of crossing it as a fan of
  // straight lines. Same shape family as the solver curves in `chainDiagram`.
  const cx = round4((d.px + CORE.x) / 2);
  const cy = round4(d.py + (CORE.y - d.py) * 0.15);
  return `M ${d.px} ${d.py} Q ${cx} ${cy} ${CORE.x - R} ${CORE.y}`;
});

export default function ThreatAnswer() {
  const ref = useScrollReveal<HTMLDivElement>({ start: "top 84%", stagger: 0.1 });

  return (
    <section className="bg-cream py-20 lg:py-28">
      <Container className="flex flex-col gap-14">
        <div ref={ref} className="flex flex-col gap-14">
          <div className="flex flex-col gap-5">
            <Eyebrow data-reveal>The quantum threat</Eyebrow>
            <p data-reveal className="max-w-[62ch] text-pretty text-h3">
              {PROBLEM_SOLUTION_LEAD}
            </p>
          </div>

          {/* ── the two halves ───────────────────────────────────────────── */}
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-0">
            {BEATS.map((beat, i) => (
              <div
                key={beat.key}
                data-reveal
                className={`flex flex-col gap-5 border-t border-rule pt-6 lg:border-t-0 ${
                  i === 0
                    ? "lg:border-r lg:border-rule lg:pr-14"
                    : "lg:pl-14"
                }`}
              >
                <span className="uppercase text-caption-mono text-gray-intermediate">
                  {i === 0 ? "The problem" : "On NEAR"}
                </span>
                <h2 className="max-w-[22ch] text-pretty text-h2">
                  {beat.heading[0]}
                  <br />
                  <Accent>{beat.heading[1]}</Accent>
                </h2>
                <p className="max-w-[52ch] text-pretty text-body text-foreground/75">
                  {beat.body}
                </p>
                {beat.link ? (
                  <a
                    href={beat.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-q-arrow-host
                    className="mt-auto flex w-fit items-center gap-3 pt-2 text-label"
                  >
                    <ArrowCircle />
                    {beat.link.label}
                  </a>
                ) : null}
              </div>
            ))}
          </div>

          {/* ── the figure that crosses the rule ─────────────────────────── */}
          <figure data-reveal className="flex flex-col gap-4">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="w-full"
              role="img"
              aria-label="A population of accounts with the exposed ones marked, converging into one NEAR account whose key rotates while the account itself stays the same"
            >
              {/* The threads first, so the dots and the account sit on top. */}
              {THREADS.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-rule"
                />
              ))}

              {DOTS.map((d, i) => (
                <circle
                  key={i}
                  cx={d.px}
                  cy={d.py}
                  r={d.exposed ? 4.2 : 2.6}
                  className={d.exposed ? "fill-destructive" : "fill-foreground/25"}
                />
              ))}

              {/* The orbit the keys ride. Dashed, because it is a path and not
                  a boundary: the account is not inside anything. */}
              <circle
                cx={CORE.x}
                cy={CORE.y}
                r={R}
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="4 7"
                className="text-foreground/30"
              />

              {/* Outgoing key: hollow, leaving to the left. */}
              <g className="text-gray-intermediate">
                <circle cx={OUT.x} cy={OUT.y} r="11" fill="none" stroke="currentColor" strokeWidth="1.4" />
                <line x1={OUT.x - 13} y1={OUT.y} x2={OUT.x - 34} y2={OUT.y} stroke="currentColor" strokeWidth="1.4" />
              </g>

              {/* Arriving key: filled, green. The page's accent spent once, on
                  the one mark that is the answer. */}
              <g>
                <circle cx={IN.x} cy={IN.y} r="11" className="fill-near-green-accent" />
                <line
                  x1={IN.x + 34}
                  y1={IN.y}
                  x2={IN.x + 13}
                  y2={IN.y}
                  stroke="currentColor"
                  strokeWidth="1.4"
                  className="text-near-green-accent"
                />
              </g>

              {/* The fixed point. The raw path and not <NearMark>: that
                  component renders its own <svg>, and a nested <svg> with no
                  explicit dimensions resolves to 100% of the parent viewport
                  instead of honouring this transform. The numbers place the
                  path's own 108..459 box into a 74-unit square centred on the
                  core — `tx = cx − 37 − 108 × s`. */}
              <g transform={`translate(${round4(CORE.x - 37 - 108 * 0.2108)} ${round4(CORE.y - 37 - 108 * 0.2108)}) scale(0.2108)`}>
                <path d={NEAR_MARK_PATH} fill="currentColor" className="text-foreground" />
              </g>
            </svg>

            <figcaption className="flex flex-wrap items-center gap-x-8 gap-y-2 uppercase text-caption-mono text-gray-intermediate">
              <span className="flex items-center gap-2 normal-case">
                <span aria-hidden="true" className="size-2 rounded-full bg-destructive" />
                exposed public key
              </span>
              <span className="flex items-center gap-2 normal-case">
                <span aria-hidden="true" className="size-2 rounded-full bg-near-green-accent" />
                quantum-safe key, added in one transaction
              </span>
              <span className="normal-case">Illustrative — the deck states no share.</span>
            </figcaption>
          </figure>
        </div>
      </Container>
    </section>
  );
}
