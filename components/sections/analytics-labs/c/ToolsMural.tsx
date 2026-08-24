"use client";

import Container from "@/components/primitives/Container";
import ArrowCircle from "@/components/sections/quantum/ArrowCircle";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { TOOLS, TOOLS_HEADER } from "@/components/sections/analytics-labs/analyticsContent";

// ── Proposal C · §5 ────────────────────────────────────────────────────────
// The eight platforms as a DIRECTORY in large type: one name per line, set at
// `h2`.
//
// **What this decision is buying.** A turns them into a table (to choose fast)
// and B groups them by task (to choose well). C buys something else: that the
// block reads as a list of PEERS. Eight names at headline scale say, before any
// blurb is read, that NEAR is covered by the platforms that matter — which is
// the section's argument, and one a grid of small cards cannot make, because at
// that size the names read as menu items.
//
// **It is also the only large block on the page with no figures in it.** After
// two screens of numbers, eight lines of pure name are the change of tempo the
// editorial register needs to avoid turning into a newsletter.
//
// **No logos, for the reason already written in A and B**: the repo holds none
// of these brands as an asset, and the house precedent — `chain/ProofBand` —
// already settled it: names in the page's own typeface beat foreign logos at
// eight different optical weights. Here it is an outright advantage, because the
// name at large size IS the ornament.
//
// **The cost:** the row is tall and eight rows are a lot of scroll. Accepted
// because the brief mandates this section ("Learn more below") and because a
// reader who does not want it passes it in one gesture — while a reader who does
// finds eight destinations without reading a single blurb.

export default function ToolsMural() {
  const rootRef = useScrollReveal<HTMLElement>({ targets: "[data-reveal]", stagger: 0.07 });

  return (
    <section ref={rootRef} className="bg-white py-28">
      <Container>
        <div className="grid-ds gap-y-6">
          <h2 data-reveal className="col-span-12 text-h1 lg:col-span-5">
            {TOOLS_HEADER.title}
          </h2>
          <p
            data-reveal
            className="col-span-12 max-w-[38ch] text-pretty text-body-lg text-ink-soft lg:col-span-5 lg:col-start-8"
          >
            {TOOLS_HEADER.lead}
          </p>
        </div>

        <ul className="mt-16 border-t border-rule">
          {TOOLS.map((t) => (
            <li key={t.id} data-reveal>
              <a
                href={t.href}
                target="_blank"
                rel="noopener noreferrer"
                data-q-arrow-host
                className="group grid-ds items-center gap-y-3 border-b border-rule py-7"
              >
                {/* The name shifts on hover. It is the same gesture the arrow
                    makes — something leaves to the right — and not a second
                    effect: a row that lights up AND moves AND grows is three
                    answers to a single hover. */}
                <span className="col-span-10 text-h2 transition-[padding] duration-300 group-hover:pl-4 lg:col-span-5">
                  {t.name}
                </span>
                <span className="col-span-12 text-body text-ink-soft lg:col-span-4">
                  {t.blurb}
                </span>
                <span className="col-span-10 text-caption-mono text-gray-intermediate lg:col-span-2">
                  {t.domain}
                </span>
                <span className="col-span-2 flex justify-end lg:col-span-1">
                  <ArrowCircle />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
