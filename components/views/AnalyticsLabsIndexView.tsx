import Link from "next/link";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import ArrowCircle from "@/components/primitives/ArrowCircle";

// Index of the /analytics lab — /prototype/analytics
//
// Three proposals for the SAME page, with the SAME copy (`analyticsContent.ts`
// is a single file and no proposal edits it). Only the composition changes, so
// the comparison measures design and not writing.
//
// The three separate along one declared axis: **how much space the page spends
// per datum**. A minimises it, C maximises it, B allocates it by the kind of
// datum. Everything else — how many figures get promoted, whether the tools go
// in a table, in groups or in a directory, how the audience seam is marked, how
// much animates — follows from that position and was not chosen separately.

const VARIANTS = [
  {
    id: "a",
    name: "Ledger",
    href: "/prototype/analytics/a",
    density: "high",
    stats: "all five, in a table",
    tools: "index table",
    motion: "none",
    thesis:
      "The page as a document: a printed statement of account. 1px rules, square corners, figures in serif italic, and all fifteen exits resolved in two identical tables.",
    why: "Speaks to the reader who consumes figures every day. Density as a form of respect: everything fits in two screens and nothing demands its own act of reading.",
  },
  {
    id: "b",
    name: "Signal",
    href: "/prototype/analytics/b",
    density: "medium",
    stats: "three on top, two in a strip",
    tools: "three groups by task",
    motion: "the status dot only",
    thesis:
      "The page as a monitored instrument. Hero and figures on one screen, an ambient strip for price and shards, light/dark cards, and tools grouped by what they are for.",
    why: "The only one that answers «which of the eight do I go to?» on the page's side instead of leaving it to the reader. Also the only one that marks the audience seam with a full-bleed band.",
  },
  {
    id: "c",
    name: "Editorial",
    href: "/prototype/analytics/c",
    density: "low",
    stats: "three full-width, two at the foot",
    tools: "directory at headline scale",
    motion: "reveals across three sections",
    thesis:
      "The page as reading. Nothing boxed — no frames, no cards — large scale, and a hero background drawn from the real revenue series instead of a texture.",
    why: "Bets that with so little real content, scale convinces more than density. It is also the one that treats the SVRN sentence best: at `text-statement` it becomes the closing change of register.",
  },
] as const;

export default function AnalyticsLabsIndexView() {
  return (
    <main className="bg-cream text-foreground">
      <Container className="flex flex-col gap-16 pb-28 pt-[calc(var(--site-header-block)+4rem)]">
        <div className="flex max-w-[68ch] flex-col gap-6">
          <p className="uppercase text-eyebrow-mono text-gray-intermediate">
            Analytics · proposals
          </p>
          <h1 className="text-balance text-h1">
            Three <Accent display>structures</Accent> for the same page
          </h1>
          <p className="text-pretty text-body-lg text-ink-soft">
            Same copy, same fifteen outbound links, same five numbers. What changes is how much
            space the page spends per datum — and everything else follows from there.
          </p>
          <p className="text-pretty text-body text-gray-intermediate">
            The figures are placeholders and are marked as such in the content. What is up for
            comparison is the hierarchy, not the values.
          </p>
        </div>

        <div className="flex flex-col border-t border-rule">
          {VARIANTS.map((v) => (
            <Link
              key={v.id}
              href={v.href}
              data-q-arrow-host
              className="grid-ds items-start gap-y-6 border-b border-rule py-10 transition-colors hover:bg-card-tint/60"
            >
              <div className="col-span-10 flex flex-col gap-2 lg:col-span-3">
                <span className="text-caption-mono text-gray-intermediate">
                  {v.id.toUpperCase()}
                </span>
                <span className="text-h3">{v.name}</span>
              </div>

              <div className="col-span-12 flex flex-col gap-4 lg:col-span-5">
                <p className="text-pretty text-body text-ink">{v.thesis}</p>
                <p className="text-pretty text-body-sm text-gray-intermediate">{v.why}</p>
              </div>

              <dl className="col-span-10 flex flex-col gap-1.5 lg:col-span-3">
                <Spec term="Density" value={v.density} />
                <Spec term="Figures" value={v.stats} />
                <Spec term="Tools" value={v.tools} />
                <Spec term="Motion" value={v.motion} />
              </dl>

              <span className="col-span-2 flex justify-end lg:col-span-1">
                <ArrowCircle />
              </span>
            </Link>
          ))}
        </div>

        {/* The assembly page sits apart from the three, and deliberately so: it
            is not a fourth position on the density axis, it is a composition
            built out of the other three. Listing it as a peer row would suggest
            there are four things to compare. */}
        <Link
          href="/prototype/analytics/mix"
          data-q-arrow-host
          className="grid-ds items-center gap-y-4 border border-ink px-6 py-8 transition-colors hover:bg-card-tint/60 lg:px-8"
        >
          <div className="col-span-10 flex flex-col gap-2 lg:col-span-3">
            <span className="text-caption-mono text-gray-intermediate">MIX</span>
            <span className="text-h3">Assembly</span>
          </div>
          <p className="col-span-12 text-pretty text-body text-ink lg:col-span-8">
            One page built out of sections taken from A, B and C — the slots and their
            alternatives are listed in <code className="text-caption-mono">AnalyticsMixView</code>.
            It grows one section at a time: an undecided slot stays empty.
          </p>
          <span className="col-span-2 flex justify-end lg:col-span-1">
            <ArrowCircle />
          </span>
        </Link>
      </Container>
    </main>
  );
}

function Spec({ term, value }: { term: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="uppercase text-micro-mono text-gray-intermediate">{term}</dt>
      <dd className="text-right text-caption-mono text-ink-soft">{value}</dd>
    </div>
  );
}
