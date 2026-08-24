import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import LiveDot from "@/components/sections/analytics-labs/b/LiveDot";
import { tickField } from "@/components/sections/analytics-labs/analyticsArt";
import { CORE_STATS, HERO, STATUS } from "@/components/sections/analytics-labs/analyticsContent";

// ── Proposal B · §1 + §2, on a single screen ───────────────────────────────
// B's register is the INSTRUMENT: the page as the readout of a monitored
// system. Three decisions follow from that, and they are what separate it from
// A and C.
//
// ── 1. The hero and the figures are the SAME screen ────────────────────────
// The brief lists them as §1 and §2, and the other two proposals keep them as
// two bands. B fuses them, and not to save scroll: this page's declared job is
// to orient and route. A hero that only promises "a live view" and makes you
// scroll to see it spends the first screen — the only one everybody sees — on a
// promise. Here the claim and its evidence arrive together.
//
// ── 2. Three figures on top, two below in the strip ────────────────────────
// The brief permits it ("keep top 3 stats, if it feels crowded") but the reason
// is not that they crowd: it is that the five are not the same kind of number.
//
//   · Fees, confidential TVL and intents volume are CUMULATIVE: they measure
//     what the network did. A cumulative only goes down if something breaks, so
//     a large number there is a claim.
//   · Price and shards are AMBIENT: price is the most-watched number and the
//     one that says least about the network — it moves for reasons that are not
//     NEAR — and "6 / 6 shards" is a boolean dressed as a figure: the only
//     interesting thing about it is the day it stops saying 6/6.
//
// Setting all five at the same size tells the reader they weigh the same, and
// they do not. The strip is where ambient facts belong: always visible, never
// the lead — the ticker convention, which is exactly the role these two have.
//
// ── 3. The strip does NOT scroll ───────────────────────────────────────────
// A running ticker is the first idea and it is prop-liveness: the motion
// implies numbers are arriving as you watch, when in fact this is a snapshot
// with its cut-off time printed an inch above. This page cannot afford that,
// because the day the data IS live nobody will be able to tell real motion from
// decorative motion. The strip holds still and the life is carried by the
// status dot, which is an actual state.
//
// Server component. The only thing that moves in the whole proposal is that dot.

// The tick field: a forest of vertical hairlines, the silhouette of a time
// series without being any particular one. It is B's vector motif — it appears
// here and returns, drawn from real data, in the revenue card.
const TICKS = tickField(180, 7);

const PROMOTED = CORE_STATS.filter((s) =>
  ["fees", "confidential-tvl", "intents-volume"].includes(s.id)
);
const AMBIENT = CORE_STATS.filter((s) => ["shards", "price"].includes(s.id));

export default function Hero() {
  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden bg-white pt-[calc(var(--site-header-block)+4rem)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[46svh] text-gray-blue/35"
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="size-full"
        >
          {TICKS.map((t, i) => (
            <line
              key={i}
              x1={t.x}
              y1="100"
              x2={t.x}
              y2={100 - t.h * 100}
              stroke="currentColor"
              // `vectorEffect` so the stroke is not stretched by
              // `preserveAspectRatio="none"`: without it the ticks come out wide
              // and the field reads as a bar chart rather than a comb.
              vectorEffect="non-scaling-stroke"
              strokeWidth="1"
            />
          ))}
        </svg>
      </div>

      <Container className="relative flex flex-1 flex-col justify-between gap-16 pb-10">
        <div className="grid-ds gap-y-8">
          <div className="col-span-12 flex flex-col gap-6 lg:col-span-7">
            <p className="uppercase text-eyebrow-mono text-gray-intermediate">
              Analytics · live
            </p>
            <h1 className="text-balance text-h1">
              NEAR by the <Accent display>numbers</Accent>
            </h1>
            <p className="max-w-[50ch] text-pretty text-body-lg text-ink-soft">{HERO.lead}</p>
          </div>

          <div className="col-span-12 flex items-start lg:col-span-4 lg:col-start-9 lg:justify-end">
            <a
              href={HERO.statusHref}
              className="flex w-fit items-center gap-3 rounded-full border border-rule bg-white px-5 py-3 text-label transition-colors hover:border-green-ink"
            >
              <LiveDot />
              {HERO.statusLabel}
            </a>
          </div>
        </div>

        {/* ── The three figures that carry the claim ───────────────────── */}
        <dl className="grid-ds gap-y-10">
          {PROMOTED.map((s) => (
            <div key={s.id} className="col-span-12 flex flex-col gap-3 sm:col-span-6 lg:col-span-4">
              <dt className="uppercase text-micro-mono text-ink-soft">{s.label}</dt>
              <dd className="flex flex-col gap-2">
                <span className="text-h1-serif italic">{s.value}</span>
                <span className="flex flex-wrap items-baseline gap-x-4">
                  {s.deltas.map((d) => (
                    <DeltaInline key={d.window} window={d.window} direction={d.direction} value={d.value} />
                  ))}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </Container>

      {/* ── The ambient strip ────────────────────────────────────────────── */}
      {/* Full-bleed and outside the Container: it is the bottom edge of the
          instrument, not a row of content. */}
      <div className="relative bg-ink text-white">
        <Container>
          <dl className="flex flex-wrap items-center gap-x-10 gap-y-3 py-4">
            {AMBIENT.map((s) => (
              <div key={s.id} className="flex items-baseline gap-3">
                <dt className="uppercase text-micro-mono text-white/50">{s.label}</dt>
                <dd className="flex items-baseline gap-3">
                  <span className="text-body-sm-mono">{s.value}</span>
                  {s.deltas.map((d) => (
                    <DeltaInline
                      key={d.window}
                      window={d.window}
                      direction={d.direction}
                      value={d.value}
                      onDark
                    />
                  ))}
                </dd>
              </div>
            ))}
            <p className="ml-auto text-micro-mono text-white/45">{STATUS.updatedLabel}</p>
          </dl>
        </Container>
      </div>
    </section>
  );
}

// B's inline change indicator: no chip, no background. The glyph carries the
// data and colour only reinforces — same rule as in A, different form. A
// triangle set tight against the number reads faster than a pill, and on the
// dark strip a pill would be a third colour in a band that already has two.
const TONE = { up: "text-green-ink", down: "text-destructive", flat: "text-gray-intermediate" } as const;
const TONE_DARK = { up: "text-near-green-accent", down: "text-destructive", flat: "text-white/50" } as const;
const GLYPH = { up: "▲", down: "▼", flat: "–" } as const;

export function DeltaInline({
  window: win,
  direction,
  value,
  onDark = false,
}: {
  window: string;
  direction: "up" | "down" | "flat";
  value: string;
  onDark?: boolean;
}) {
  return (
    <span className={`inline-flex items-baseline gap-1.5 text-caption-mono ${(onDark ? TONE_DARK : TONE)[direction]}`}>
      <span className={onDark ? "text-white/45" : "text-gray-intermediate"}>{win}</span>
      <span aria-hidden="true">{GLYPH[direction]}</span>
      <span>{value}</span>
    </span>
  );
}
