import Container from "@/components/primitives/Container";
import CtaPill from "@/components/primitives/CtaPill";
import ArrowCircle from "@/components/primitives/ArrowCircle";
import { tickField } from "@/components/sections/analytics-labs/analyticsArt";
import {
  LEGAL,
  PRODUCTS,
  PRODUCTS_GRID_TITLE,
  PRODUCTS_HEADER,
  SVRN,
} from "@/components/sections/analytics-labs/analyticsContent";

// ── Proposal B · §6 ────────────────────────────────────────────────────────
// **The audience seam is marked with a full-bleed band, and it is the only one
// on the page.** Above this line everything speaks to whoever is watching the
// network; below it, to whoever wants exposure to the asset. Two readers who
// barely overlap, and the brief puts them on the same page with no separator at
// all.
//
// The device is the cheapest one there is and the most effective: width. Every
// other section of B lives inside the Container; this one breaks out. The reader
// does not read a heading to understand the subject changed — they see it.
//
// **The tick field comes back here, and the repetition is deliberate.** It
// appears once in the hero and once here, at the two ends of the page. It is the
// only ornament B allows itself twice, and it is what makes the products band
// read as part of this page rather than a block pasted in from another site. If
// one is edited, look at the other.
//
// **The ETPs do carry a logo square and the tools do not.** That is not
// inconsistency: there are five and not eight, in a shorter row, and — the
// deciding reason — an ETP is chosen by its ISSUER. Bitwise and 21Shares are the
// primary information in that row; Dune and DefiLlama were not in theirs, where
// the primary information was what you will find. The placeholder declares
// itself as one (rule + initials) instead of impersonating a real logo: a
// convincing placeholder is a placeholder nobody replaces.

const TICKS = tickField(220, 23);

export default function Products() {
  return (
    <section className="bg-cream pb-28">
      {/* ── Featured, full-bleed ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-ink py-20 text-white lg:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] text-white/12"
        >
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="size-full">
            {TICKS.map((t, i) => (
              <line
                key={i}
                x1={t.x}
                y1="100"
                x2={t.x}
                y2={100 - t.h * 100}
                stroke="currentColor"
                vectorEffect="non-scaling-stroke"
                strokeWidth="1"
              />
            ))}
          </svg>
        </div>

        <Container className="relative">
          <div className="grid-ds gap-y-8">
            <div className="col-span-12 flex flex-col gap-5 lg:col-span-6">
              <p className="uppercase text-eyebrow-mono text-white/50">
                {PRODUCTS_HEADER.title}
              </p>
              <h2 className="text-h1">{SVRN.name}</h2>
            </div>
            <div className="col-span-12 flex flex-col gap-6 lg:col-span-5 lg:col-start-8">
              <p className="text-pretty text-body-lg text-white/80">{SVRN.lead}</p>
              <CtaPill href={SVRN.href} size="lg" tone="solid" external>
                Learn more
              </CtaPill>
            </div>
          </div>
        </Container>
      </div>

      {/* ── ETPs and trusts ──────────────────────────────────────────────── */}
      <Container className="pt-20">
        <div className="grid-ds gap-y-6">
          <h3 className="col-span-12 text-h3 lg:col-span-4">{PRODUCTS_GRID_TITLE}</h3>
          <div className="col-span-12 flex max-w-[46ch] flex-col gap-3 lg:col-span-6 lg:col-start-6">
            <p className="text-pretty text-body text-ink-soft">{PRODUCTS_HEADER.lead}</p>
            {/* Before the list and not at the foot: "this is not advice" has to
                be read before choosing, not after. */}
            <p className="text-pretty text-micro-mono text-gray-intermediate">
              {PRODUCTS_HEADER.disclaimer}
            </p>
          </div>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-5">
          {PRODUCTS.map((p) => (
            <li key={p.id} className="first:col-span-2 lg:first:col-span-1">
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                data-q-arrow-host
                className="flex h-full flex-col gap-4 rounded-2xl border border-rule bg-white p-5 transition-colors hover:border-green-ink"
              >
                <span className="flex items-start justify-between gap-3">
                  <LogoPlaceholder name={p.issuer} />
                  <span className="text-micro-mono text-gray-intermediate">{p.kind}</span>
                </span>
                <span className="text-h4">{p.issuer}</span>
                <span className="mt-auto text-body-sm text-ink-soft">{p.product}</span>
                <ArrowCircle className="mt-1" />
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-micro-mono text-gray-intermediate">{LEGAL}</p>
      </Container>
    </section>
  );
}

function LogoPlaceholder({ name }: { name: string }) {
  return (
    <span
      aria-hidden="true"
      className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-rule text-caption-mono text-gray-intermediate"
    >
      {name.slice(0, 2).toUpperCase()}
    </span>
  );
}
