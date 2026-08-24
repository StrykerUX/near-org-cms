import Container from "@/components/primitives/Container";
import CtaPill from "@/components/sections/quantum/CtaPill";
import Delta from "@/components/sections/analytics-labs/a/Delta";
import { sparkGeometry, uptimeBars } from "@/components/sections/analytics-labs/analyticsArt";
import {
  REVENUE,
  REVENUE_SERIES,
  STATUS,
  STATUS_TILES,
} from "@/components/sections/analytics-labs/analyticsContent";

// ── Proposal A · §3 + §4 ───────────────────────────────────────────────────
// The two internal link-outs, side by side, as the brief asks. In A they are
// two framed PANELS with a 1px rule and square corners, not two cards with a
// shadow and a radius: a large radius is what turns a table into a widget, and
// this is the proposal that does not want widgets.
//
// **The two panels are NOT symmetrical, and should not be forced to be.** They
// are two different things: one is a business figure with its trend, the other
// an operational state with its history. Forcing them into the same mould — two
// identical heads, two identical charts — makes the reader look for a
// comparison between them that does not exist. What they do share, and it is
// enough for them to read as a pair, is the frame, the width and the row height.
//
// **The 60-day strip instead of a bare uptime number.** A "99.71%" hides exactly
// what the reader wants: when, how long ago, once or five times. The strip
// answers that without adding a word, it is a convention anyone who has opened
// a status page already knows how to read, and the percentage stays alongside
// because the strip says the shape and the number says the magnitude.
//
// **The health headline is dynamic in the content and fixed here.** The brief
// gives two ("No problems detected" / "Investigating an issue"); this
// composition mounts the first, which is the state the placeholder tiles
// describe. Once there is an API, whoever wires it picks between the two — which
// is why both live in `analyticsContent.ts` and neither is written into the JSX.

const SPARK = { w: 320, h: 84 };
const spark = sparkGeometry(REVENUE_SERIES, SPARK);

export default function DualCards() {
  return (
    <section className="bg-cream pb-24">
      <Container>
        <div className="grid-ds gap-y-8">
          <RevenuePanel />
          <StatusPanel />
        </div>
      </Container>
    </section>
  );
}

function RevenuePanel() {
  return (
    <article className="col-span-12 flex flex-col border border-rule lg:col-span-6">
      <PanelHead eyebrow={REVENUE.eyebrow} />

      <div className="flex flex-1 flex-col gap-8 p-7">
        <div className="flex flex-col gap-3">
          <h3 className="max-w-[24ch] text-pretty text-h3">{REVENUE.title}</h3>
          <p className="text-body text-ink-soft">{REVENUE.body}</p>
        </div>

        {/* The figure and its chart share a baseline: the sparkline is not an
            illustration sitting next to the number, it is that number's
            adjective. */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <p className="max-w-[22ch] uppercase text-micro-mono text-ink-soft">
              {REVENUE.metricLabel}
            </p>
            <p className="text-h1-serif italic">{REVENUE.metricValue}</p>
            <Delta delta={REVENUE.metricDelta} />
          </div>

          <figure className="w-full max-w-[20rem]">
            <svg
              viewBox={`0 0 ${SPARK.w} ${SPARK.h}`}
              className="w-full overflow-visible"
              aria-hidden="true"
            >
              {/* Baseline first, so the area rests on something instead of
                  floating. */}
              <line
                x1="0"
                y1={SPARK.h}
                x2={SPARK.w}
                y2={SPARK.h}
                stroke="currentColor"
                strokeWidth="1"
                className="text-rule"
              />
              <path d={spark.area} className="fill-green-ink/8" />
              <path
                d={spark.line}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-green-ink"
              />
              {/* The live dot: the only part of the panel that says "the latest
                  reading is THIS one". Without it a sparkline is a shape with no
                  present tense. */}
              <circle
                cx={spark.last.x}
                cy={spark.last.y}
                r="3.5"
                className="fill-green-ink"
              />
            </svg>
            <figcaption className="mt-2 text-micro-mono text-gray-intermediate">
              Last 24 hours
            </figcaption>
          </figure>
        </div>

        <div className="mt-auto pt-2">
          <CtaPill href={REVENUE.ctaHref} size="sm" tone="filled">
            Open revenue dashboard
          </CtaPill>
        </div>
      </div>
    </article>
  );
}

function StatusPanel() {
  return (
    <article
      id="network-health"
      // `scroll-mt` because the header is fixed: without it the hero's anchor
      // leaves the panel head underneath the bar.
      className="col-span-12 flex scroll-mt-[calc(var(--site-header-block)+2rem)] flex-col border border-rule lg:col-span-6"
    >
      <PanelHead eyebrow={STATUS.eyebrow} />

      <div className="flex flex-1 flex-col gap-7 p-7">
        <h3 className="flex items-center gap-3 text-h3">
          <span aria-hidden="true" className="size-2.5 rounded-full bg-green-ink" />
          {STATUS.titleOk}
        </h3>

        <ul className="flex flex-col divide-y divide-rule border-y border-rule">
          {STATUS_TILES.map((t, i) => (
            <li key={t.id} className="flex flex-col gap-2.5 py-4">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-body-sm text-ink">{t.label}</span>
                <span className="shrink-0 text-caption-mono text-gray-intermediate">
                  {t.uptime}
                </span>
              </div>
              <UptimeStrip uptime={parseFloat(t.uptime) / 100} seed={i + 1} />
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-4">
          <p className="text-micro-mono text-gray-intermediate">
            {STATUS.updatedLabel} · 60-day window
          </p>
          <CtaPill href={STATUS.ctaHref} size="sm" tone="filled" external>
            Full status &amp; history
          </CtaPill>
        </div>
      </div>
    </article>
  );
}

function PanelHead({ eyebrow }: { eyebrow: string }) {
  return (
    <p className="border-b border-rule px-7 py-3.5 uppercase text-eyebrow-mono text-gray-intermediate">
      {eyebrow}
    </p>
  );
}

// Sixty bars as `flex` with a hairline gap: in SVG a viewBox width would have to
// be chosen and the bars would stretch differently in each panel. In the DOM
// they distribute themselves and are still one element per day.
function UptimeStrip({ uptime, seed }: { uptime: number; seed: number }) {
  const bars = uptimeBars(uptime, seed);
  return (
    <div aria-hidden="true" className="flex h-5 w-full items-end gap-px">
      {bars.map((b, i) => (
        <span
          key={i}
          className={`h-full min-w-px flex-1 ${
            b.health > 0.995
              ? "bg-green-ink/70"
              : b.health > 0.5
                ? "bg-destructive/45"
                : "bg-destructive/85"
          }`}
        />
      ))}
    </div>
  );
}
