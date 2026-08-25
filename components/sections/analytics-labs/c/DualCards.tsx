import Container from "@/components/primitives/Container";
import CtaPill from "@/components/primitives/CtaPill";
import ArrowCircle from "@/components/primitives/ArrowCircle";
import { sparkGeometry, uptimeBars } from "@/components/sections/analytics-labs/analyticsArt";
import {
  REVENUE,
  REVENUE_SERIES,
  STATUS,
  STATUS_TILES,
} from "@/components/sections/analytics-labs/analyticsContent";

// ── Proposal C · §3 + §4 ───────────────────────────────────────────────────
// The two link-outs side by side, as the brief asks, and **with no card**:
// neither a frame (A) nor a contrasting ground (B). Two columns on the same
// cream, separated by a vertical rule.
//
// **Why no box at all.** A box says "this is a widget, it is a different kind of
// thing from the text around it". In A that is correct — the register is a
// document's panel — and in B too — the register is the instrument. C's register
// is the printed page, where nothing is boxed: blocks are separated with space
// and rules, which is how things are separated on a page that gets read. Giving
// C two cards would make it an in-between proposal instead of a position.
//
// **The middle rule does all the grouping work.** It is the only reason the two
// blocks read as a pair rather than as two consecutive sections — and on mobile,
// where no vertical rule is possible, it becomes the horizontal one that
// separates the two stacked columns.
//
// **The uptime strip stays.** It is the one piece of "dashboard" vocabulary C
// keeps, and it is kept because it has no editorial replacement: a 60-day
// percentage does not say when or how many times, and this page cannot write
// that sentence in prose without real data. The convention wins.
//
// **The two CTAs do not carry the same weight.** Revenue's is filled; status's
// is inline with the disc. The brief puts both cards on the same level, but only
// one of the two is a NEAR destination: `status.near.org` is a utility, and
// whoever needs it is already looking for it. Two identical buttons spend the
// same emphasis on a brand destination and on an on-call tool.

const SPARK = { w: 520, h: 190, padY: 18 };
const spark = sparkGeometry(REVENUE_SERIES, SPARK);

export default function DualCards() {
  return (
    <section className="bg-cream py-20">
      <Container>
        <div className="grid-ds">
          <div className="col-span-12 lg:col-span-6">
            <Revenue />
          </div>

          {/* The rule: vertical on desktop, horizontal once the columns stack.
              It is a border on the right-hand block and not a free-standing
              element, so its height never has to be synchronised with anything. */}
          <div className="col-span-12 border-t border-rule pt-14 lg:col-span-5 lg:col-start-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-14">
            <Status />
          </div>
        </div>
      </Container>
    </section>
  );
}

function Revenue() {
  return (
    <article className="flex h-full flex-col gap-8">
      <p className="uppercase text-eyebrow-mono text-gray-intermediate">{REVENUE.eyebrow}</p>
      <h2 className="max-w-[18ch] text-pretty text-h2">{REVENUE.title}</h2>
      <p className="max-w-[40ch] text-body-lg text-ink-soft">{REVENUE.body}</p>

      <figure className="mt-4 flex flex-col gap-5">
        <figcaption className="flex flex-col gap-2">
          <span className="max-w-[34ch] uppercase text-micro-mono text-ink-soft">
            {REVENUE.metricLabel}
          </span>
          <span className="flex flex-wrap items-baseline gap-x-5">
            {/* The figure at headline scale: in C it is the number that carries
                the section, not a footnote to the chart. */}
            <span className="text-display-serif italic">{REVENUE.metricValue}</span>
            <span className="inline-flex items-baseline gap-1.5 text-caption-mono text-green-ink">
              <span className="text-gray-intermediate">{REVENUE.metricDelta.window}</span>
              <span aria-hidden="true">▲</span>
              <span>{REVENUE.metricDelta.value}</span>
            </span>
          </span>
        </figcaption>

        <svg
          viewBox={`0 0 ${SPARK.w} ${SPARK.h}`}
          className="w-full"
          role="img"
          aria-label={`${REVENUE.metricLabel}: ${REVENUE.metricValue}, trending up over the last 24 hours`}
        >
          {/* No axes, no grid, no fill: in C the chart is a STROKE. It is the
              same series that draws the hero background, so the echo has to stay
              recognisable — a filled area here would break the kinship. */}
          <path
            d={spark.line}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            className="text-ink"
          />
          <line
            x1="0"
            y1={SPARK.h}
            x2={SPARK.w}
            y2={SPARK.h}
            stroke="currentColor"
            strokeWidth="1"
            className="text-rule"
          />
          <circle cx={spark.last.x} cy={spark.last.y} r="4.5" className="fill-green-ink" />
        </svg>

        <div className="flex items-baseline justify-between text-micro-mono text-gray-intermediate">
          <span>24h ago</span>
          <span>now</span>
        </div>
      </figure>

      <div className="mt-auto pt-4">
        <CtaPill href={REVENUE.ctaHref} size="lg" tone="filled">
          Open revenue dashboard
        </CtaPill>
      </div>
    </article>
  );
}

function Status() {
  return (
    <article
      id="network-health"
      className="flex h-full scroll-mt-[calc(var(--site-header-block)+2rem)] flex-col gap-8"
    >
      <p className="uppercase text-eyebrow-mono text-gray-intermediate">{STATUS.eyebrow}</p>
      <h2 className="flex items-center gap-3 text-h2">
        <span aria-hidden="true" className="size-3 shrink-0 rounded-full bg-green-ink" />
        {STATUS.titleOk}
      </h2>

      <ul className="flex flex-col">
        {STATUS_TILES.map((t, i) => (
          <li key={t.id} className="flex flex-col gap-3 border-b border-rule py-5 first:border-t">
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-body text-ink">{t.label}</span>
              <span className="shrink-0 text-caption-mono text-gray-intermediate">{t.uptime}</span>
            </div>
            <UptimeStrip uptime={parseFloat(t.uptime) / 100} seed={i + 1} />
          </li>
        ))}
      </ul>

      <p className="text-micro-mono text-gray-intermediate">
        {STATUS.updatedLabel} · 60-day window
      </p>

      <a
        href={STATUS.ctaHref}
        target="_blank"
        rel="noopener noreferrer"
        data-q-arrow-host
        className="mt-auto flex w-fit items-center gap-4 text-label-lg"
      >
        Full status &amp; history
        <ArrowCircle />
      </a>
    </article>
  );
}

function UptimeStrip({ uptime, seed }: { uptime: number; seed: number }) {
  const bars = uptimeBars(uptime, seed);
  return (
    <div aria-hidden="true" className="flex h-3.5 w-full items-end gap-px">
      {bars.map((b, i) => (
        <span
          key={i}
          className={`h-full min-w-px flex-1 ${
            b.health > 0.995
              ? "bg-ink/25"
              : b.health > 0.5
                ? "bg-destructive/50"
                : "bg-destructive"
          }`}
        />
      ))}
    </div>
  );
}
