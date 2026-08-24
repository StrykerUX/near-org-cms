import Container from "@/components/primitives/Container";
import CtaPill from "@/components/sections/quantum/CtaPill";
import LiveDot from "@/components/sections/analytics-labs/b/LiveDot";
import { DeltaInline } from "@/components/sections/analytics-labs/b/Hero";
import { sparkGeometry, uptimeBars } from "@/components/sections/analytics-labs/analyticsArt";
import {
  REVENUE,
  REVENUE_SERIES,
  STATUS,
  STATUS_TILES,
} from "@/components/sections/analytics-labs/analyticsContent";

// ── Proposal B · §3 + §4 ───────────────────────────────────────────────────
// The pair of link-outs, and here B makes its most visible call: **the two
// cards have opposite tonal value.** Revenue goes light, health goes dark.
//
// This is not contrast for variety. They are two different questions, and the
// reader arrives looking for ONE of them, never both at once: "how much does
// the network earn?" is a business question, "is it down?" is an operational
// one. Twin cards — same ground, same head, same chart — force the reader to
// read both titles to choose. With opposite values the eye separates the blocks
// before a single word is read, and the one you wanted is already found.
//
// The assignment is not arbitrary either: dark goes to the status panel because
// a dark system monitor is the convention everybody has already learned (every
// status page, every on-call dashboard), and because the traffic-light green
// and red reach their widest separation on a dark ground — which is exactly
// where that contrast has to work.
//
// **The revenue chart is large, not a sparkline.** In A the sparkline is the
// adjective of a written figure; here the chart IS the card, and the figure
// leans on it. B is betting that seeing the shape of the curve convinces faster
// than reading "+4.6% 30d" — and that bet is part of what the comparison
// measures.
//
// **Four things are stated on the face of the status panel:** the aggregate
// state, each tile with its 60-day strip, the cut-off time and the window. A
// health panel without a time window is an adjective, not a datum.

const CHART = { w: 640, h: 200, padY: 22 };
const chart = sparkGeometry(REVENUE_SERIES, CHART);

export default function DualCards() {
  return (
    <section className="bg-white py-24">
      <Container>
        <div className="grid-ds gap-y-8">
          <RevenueCard />
          <StatusCard />
        </div>
      </Container>
    </section>
  );
}

function RevenueCard() {
  return (
    <article className="col-span-12 flex flex-col gap-8 rounded-3xl border border-rule bg-cream p-8 lg:col-span-6 lg:p-10">
      <div className="flex flex-col gap-4">
        <p className="uppercase text-eyebrow-mono text-gray-intermediate">{REVENUE.eyebrow}</p>
        <h2 className="max-w-[20ch] text-pretty text-h3">{REVENUE.title}</h2>
        <p className="text-body text-ink-soft">{REVENUE.body}</p>
      </div>

      <figure className="mt-auto flex flex-col gap-4">
        <figcaption className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
          <span className="text-h1-serif italic">{REVENUE.metricValue}</span>
          <DeltaInline
            window={REVENUE.metricDelta.window}
            direction={REVENUE.metricDelta.direction}
            value={REVENUE.metricDelta.value}
          />
          <span className="w-full max-w-[30ch] uppercase text-micro-mono text-ink-soft">
            {REVENUE.metricLabel}
          </span>
        </figcaption>

        <svg
          viewBox={`0 0 ${CHART.w} ${CHART.h}`}
          className="w-full"
          role="img"
          aria-label={`${REVENUE.metricLabel}: ${REVENUE.metricValue}, trending up over the last 24 hours`}
        >
          <defs>
            {/* The area fades out downward instead of stopping at a hard edge:
                a flat fill against the baseline draws a second horizontal line
                that competes with the axis. */}
            <linearGradient id="b-rev-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--green-ink)" stopOpacity="0.22" />
              <stop offset="100%" stopColor="var(--green-ink)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Three horizontal guides and nothing else. A full grid over a
              series with no labelled Y axis is decorative instrumentation: it
              suggests values can be read off that are written down nowhere. */}
          {[0.25, 0.5, 0.75].map((f) => (
            <line
              key={f}
              x1="0"
              y1={CHART.h * f}
              x2={CHART.w}
              y2={CHART.h * f}
              stroke="currentColor"
              strokeWidth="1"
              className="text-rule/60"
            />
          ))}

          <path d={chart.area} fill="url(#b-rev-fill)" />
          <path
            d={chart.line}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
            className="text-green-ink"
          />
          {/* A plumb line to the last point: it anchors the curve to a concrete
              "now". */}
          <line
            x1={chart.last.x}
            y1={chart.last.y}
            x2={chart.last.x}
            y2={CHART.h}
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="3 4"
            className="text-green-ink/50"
          />
          <circle cx={chart.last.x} cy={chart.last.y} r="5" className="fill-green-ink" />
        </svg>

        <div className="flex items-baseline justify-between">
          <span className="text-micro-mono text-gray-intermediate">24h ago</span>
          <span className="text-micro-mono text-gray-intermediate">now</span>
        </div>
      </figure>

      <CtaPill href={REVENUE.ctaHref} size="sm" tone="filled">
        Open revenue dashboard
      </CtaPill>
    </article>
  );
}

function StatusCard() {
  return (
    <article
      id="network-health"
      className="col-span-12 flex scroll-mt-[calc(var(--site-header-block)+2rem)] flex-col gap-8 rounded-3xl bg-ink-slate p-8 text-white lg:col-span-6 lg:p-10"
    >
      <div className="flex flex-col gap-4">
        <p className="uppercase text-eyebrow-mono text-white/50">{STATUS.eyebrow}</p>
        <h2 className="flex items-center gap-3 text-h3">
          <LiveDot />
          {STATUS.titleOk}
        </h2>
      </div>

      <ul className="flex flex-col gap-5">
        {STATUS_TILES.map((t, i) => (
          <li key={t.id} className="flex flex-col gap-2.5 rounded-xl bg-white/6 p-4">
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-body-sm text-white/90">{t.label}</span>
              <span className="shrink-0 text-caption-mono text-near-green-accent">{t.uptime}</span>
            </div>
            <UptimeStrip uptime={parseFloat(t.uptime) / 100} seed={i + 1} />
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-4">
        <p className="text-micro-mono text-white/45">{STATUS.updatedLabel} · 60-day window</p>
        <CtaPill href={STATUS.ctaHref} size="sm" tone="solid" external>
          Full status &amp; history
        </CtaPill>
      </div>
    </article>
  );
}

function UptimeStrip({ uptime, seed }: { uptime: number; seed: number }) {
  const bars = uptimeBars(uptime, seed);
  return (
    <div aria-hidden="true" className="flex h-4 w-full items-end gap-px">
      {bars.map((b, i) => (
        <span
          key={i}
          className={`h-full min-w-px flex-1 rounded-[1px] ${
            b.health > 0.995
              ? "bg-near-green-accent/70"
              : b.health > 0.5
                ? "bg-destructive/60"
                : "bg-destructive"
          }`}
        />
      ))}
    </div>
  );
}
