import type { ReactNode } from "react";
import Container from "@/components/primitives/Container";
import CtaPill from "@/components/primitives/CtaPill";
import ArrowCircle from "@/components/primitives/ArrowCircle";
import {
  LEGAL,
  PRODUCTS,
  PRODUCTS_GRID_TITLE,
  PRODUCTS_HEADER,
  SVRN,
} from "@/components/sections/analytics-labs/analyticsContent";

// ── Proposal C · §6 ────────────────────────────────────────────────────────
// **The SVRN sentence is set at `text-statement`, and that is C's decision
// here.**
//
// That sentence — "Ensuring the power of technology remains under your control
// will require the right infrastructure and the right individuals" — is the only
// line on the whole page written by a person to be read, rather than a label, a
// figure or a product descriptor. In A and B it lives inside a featured block at
// paragraph size; in C it IS the section. After thirty numbers and eight
// platform names, a single sentence at poster scale is the strongest change of
// register the page can make without adding a word.
//
// The name stays above it as an eyebrow and not as a large headline: if "SVRN"
// takes the scale, the sentence drops to a subhead and the whole effect is lost.
// What the reader has to receive first is the idea; the name picks it up
// afterwards, next to the CTA.
//
// **The ETPs, by contrast, get smaller.** Five narrow columns, hairlines, no
// box. Not neglect: they are the page's administrative close — an availability
// fact, not an argument — and giving them the same air as the sentence above
// would dilute the one thing this section wants to leave behind.
//
// The disclaimer goes before the list and not at the foot, same as in A and B
// and for the same reason: "this is not advice" has to be read before choosing.
//
// ── The `figure` slot ─────────────────────────────────────────────────────
// The left column holds only the eyebrow, so everything under it is empty
// space. That is correct for C's own page — the emptiness is what gives the
// sentence its room — but it is also a place a figure can go without touching
// the sentence, and the mix page puts A's ring aperture there.
//
// It is a SLOT (a `ReactNode` composed from outside) and not a variant prop, the
// same shape as `PageHero`'s `nav`, which the parent README names as the
// example. Two consequences worth stating: C's own page passes nothing and
// renders byte-identically to before, so the three proposals stay comparable;
// and this section never imports A, which would couple two things that have to
// be judged separately.

// ── The `productList` slot ────────────────────────────────────────────────
// Same shape and same reasoning as `figure`: the section owns the close —
// heading, lead, disclaimer, legal line — and the LIST inside it is what can be
// swapped. C's own page passes nothing and gets its five narrow columns.
//
// It is deliberately the list and not the whole close. The disclaimer and the
// legal line are compliance copy, and a slot big enough to replace them is a
// slot big enough to drop them by accident.

export type ProductsProps = {
  /** Optional figure for the empty space under the eyebrow, left column. */
  figure?: ReactNode;
  /** Replaces the five-column product strip. Omit for C's own layout. */
  productList?: ReactNode;
};

export default function Products({ figure, productList }: ProductsProps) {
  return (
    <>
      {/* ── The sentence ─────────────────────────────────────────────── */}
      <section className="bg-ink py-28 text-white lg:py-36">
        <Container>
          <div className="grid-ds gap-y-12">
            <div className="col-span-12 flex flex-col gap-12 lg:col-span-3">
              <p className="uppercase text-eyebrow-mono text-white/50">
                {PRODUCTS_HEADER.title}
              </p>
              {/* Capped and left-aligned: at full column width the figure reads
                  as a second headline and starts competing with the sentence it
                  is supposed to sit beside. */}
              {figure ? <div className="max-w-[13rem]">{figure}</div> : null}
            </div>

            <div className="col-span-12 flex flex-col gap-10 lg:col-span-9">
              <blockquote className="max-w-[22ch] text-balance text-statement">
                {SVRN.lead}
              </blockquote>

              <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
                <span className="text-h3">{SVRN.name}</span>
                <CtaPill href={SVRN.href} size="lg" tone="solid" external>
                  Learn more
                </CtaPill>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── The administrative close ─────────────────────────────────── */}
      <section className="bg-cream py-24">
        <Container>
          <div className="grid-ds gap-y-5">
            <h2 className="col-span-12 text-h3 lg:col-span-4">{PRODUCTS_GRID_TITLE}</h2>
            <div className="col-span-12 flex max-w-[48ch] flex-col gap-3 lg:col-span-6 lg:col-start-7">
              <p className="text-pretty text-body text-ink-soft">{PRODUCTS_HEADER.lead}</p>
              <p className="text-pretty text-micro-mono text-gray-intermediate">
                {PRODUCTS_HEADER.disclaimer}
              </p>
            </div>
          </div>

          <div className="mt-12">{productList ?? <ProductStrip />}</div>

          <p className="mt-12 text-micro-mono text-gray-intermediate">{LEGAL}</p>
        </Container>
      </section>
    </>
  );
}

// Five columns separated by a rule, no box: the same device as the pair of cards
// above, so the proposal has ONE way of separating things and not three.
//
// It carries no outer margin — the slot wrapper owns the spacing, so whatever
// replaces it sits in the same place.
function ProductStrip() {
  return (
    <ul className="grid grid-cols-1 border-t border-ink sm:grid-cols-2 lg:grid-cols-5 lg:divide-x lg:divide-rule">
      {PRODUCTS.map((p) => (
        <li key={p.id} className="border-b border-rule lg:border-b-0">
          <a
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            data-q-arrow-host
            className="flex h-full flex-col gap-4 py-7 lg:px-6 lg:first:pl-0"
          >
            <span className="uppercase text-micro-mono text-gray-intermediate">{p.kind}</span>
            <span className="text-h4">{p.issuer}</span>
            <span className="text-body-sm text-ink-soft">{p.product}</span>
            <span className="mt-auto pt-4">
              <ArrowCircle />
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
