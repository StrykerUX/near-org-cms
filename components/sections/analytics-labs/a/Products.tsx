import Container from "@/components/primitives/Container";
import CtaPill from "@/components/sections/quantum/CtaPill";
import ArrowCircle from "@/components/sections/quantum/ArrowCircle";
import Aperture from "@/components/sections/analytics-labs/a/Aperture";
import {
  LEGAL,
  PRODUCTS,
  PRODUCTS_GRID_TITLE,
  PRODUCTS_HEADER,
  SVRN,
} from "@/components/sections/analytics-labs/analyticsContent";

// ── Proposal A · §6 ────────────────────────────────────────────────────────
// The bottom half of this page speaks to a DIFFERENT reader: whoever came for
// the ETPs did not come for Dune, and the other way round. A handles the seam
// with the only device its register allows: the SVRN panel is the one dark
// thing on the entire page. There is no transition section and no change of
// grid — the ground changes once, and that is enough for the reader to know
// something else has started.
//
// **SVRN is the only thing that gets bigger.** The brief asks for it featured,
// and the design reason agrees: it is the one human sentence on the whole page.
// Surrounded by figures, setting it at the size of an ETP row buries it.
//
// **The ETPs stay a table, and the SAME table as the tools.** That is a
// deliberate economy of learning: the reader solved how to read one of these
// rows fifty pixels further up (name · descriptor · destination · arrow), and
// repeating the pattern costs them nothing. Five new cards here would force
// them to learn a second format for five items.
//
// **The disclaimer sits ABOVE the products, not at the foot.** That is the order
// the obligation implies: "this is not advice" has to be read BEFORE the list,
// not after the reader has chosen. The legal line at the very end stays where it
// is, because the brief asks for it and because it closes the page, not the
// section.
//
// The square with the issuer's initials is a declared LOGO PLACEHOLDER. Here
// they do appear — unlike in the tools table — because there are five and not
// eight, the row is shorter, and an ETP is recognised by its issuer.

// The SVRN panel's figure lives in `a/Aperture` and not here: the mix page
// mounts the same figure inside C's products section, and a second copy would
// drift from this one.

export default function Products() {
  return (
    <section className="bg-cream pb-28">
      <Container>
        <div className="grid-ds gap-y-6">
          <h2 className="col-span-12 text-h2 lg:col-span-5">{PRODUCTS_HEADER.title}</h2>
          <div className="col-span-12 flex max-w-[46ch] flex-col gap-4 lg:col-span-6 lg:col-start-7">
            <p className="text-pretty text-body-lg text-ink-soft">{PRODUCTS_HEADER.lead}</p>
            <p className="text-pretty text-micro-mono text-gray-intermediate">
              {PRODUCTS_HEADER.disclaimer}
            </p>
          </div>
        </div>

        {/* ── Featured ──────────────────────────────────────────────────── */}
        <article className="mt-12 grid-ds items-center gap-y-10 bg-ink-slate px-8 py-12 text-white lg:px-14">
          <div className="col-span-12 flex flex-col gap-6 lg:col-span-7">
            <p className="uppercase text-eyebrow-mono text-white/55">Featured</p>
            <h3 className="text-h1">{SVRN.name}</h3>
            <p className="max-w-[46ch] text-pretty text-body-lg text-white/80">{SVRN.lead}</p>
            <CtaPill href={SVRN.href} size="lg" tone="solid" external className="mt-2">
              Learn more
            </CtaPill>
          </div>
          <div className="col-span-6 col-start-4 text-white/35 lg:col-span-3 lg:col-start-10">
            <Aperture />
          </div>
        </article>

        {/* ── ETPs and trusts ───────────────────────────────────────────── */}
        <h3 className="mt-16 uppercase text-eyebrow-mono text-gray-intermediate">
          {PRODUCTS_GRID_TITLE}
        </h3>

        <div className="mt-5">
          <EtpRows />
        </div>

        <p className="mt-10 text-micro-mono text-gray-intermediate">{LEGAL}</p>
      </Container>
    </section>
  );
}

// The five ETP rows on their own, without the section around them.
//
// A named export because the mix page mounts these rows inside C's products
// section, which supplies its own heading, lead and disclaimer. Carrying no
// outer margin is part of that: whoever mounts it decides the spacing, the same
// rule the parent README states for fallbacks.
//
// It is the SAME table as `a/ToolsIndex` on purpose — name · descriptor ·
// destination · arrow. The reader solves how to read one of these rows once,
// and repeating the pattern costs them nothing.
export function EtpRows() {
  return (
    <ul className="border-t border-rule">
      {PRODUCTS.map((p) => (
        <li key={p.id}>
          <a
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            data-q-arrow-host
            className="grid-ds items-center gap-y-2 border-b border-rule py-5 transition-colors hover:bg-card-tint/60"
          >
            <span className="col-span-2 flex items-center gap-4 lg:col-span-4">
              <LogoPlaceholder name={p.issuer} />
              <span className="hidden text-h4 lg:inline">{p.issuer}</span>
            </span>
            <span className="col-span-8 text-h4 lg:col-span-4 lg:text-body-sm lg:text-ink-soft">
              {p.product}
            </span>
            <span className="col-span-10 text-caption-mono text-gray-intermediate lg:col-span-3">
              {p.kind}
            </span>
            <span className="col-span-2 flex justify-end lg:col-span-1">
              <ArrowCircle />
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

// A logo placeholder, declared as one: a ruled square with the issuer's
// initials in mono. It does not try to look like the brand — a placeholder that
// disguises itself as a real logo is worse than a hole, because nobody replaces
// it.
function LogoPlaceholder({ name }: { name: string }) {
  return (
    <span
      aria-hidden="true"
      className="flex size-11 shrink-0 items-center justify-center border border-rule bg-white text-caption-mono text-gray-intermediate"
    >
      {name.slice(0, 2).toUpperCase()}
    </span>
  );
}
