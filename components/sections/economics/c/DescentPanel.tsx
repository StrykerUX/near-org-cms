"use client";

import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";

export type DescentPanelProps = {
  /** The step's own numeral. It is set colossal, so it must stay two digits. */
  index: string;
  short: string;
  title: string;
  body: string;
  /** `id` for the fragment the return at the end of the loop points back to. */
  anchor: string;
  /** Ink ground instead of cream. The panels alternate; see `DescentPanels`. */
  dark?: boolean;
};

// One beat of the flywheel, as one screen.
//
// ── Its own component, and its own ScrollTrigger ───────────────────────────
// Four panels of `min-h-svh` are taller than four viewports, so a single reveal
// timeline on the parent would fire once — while three of the four were still
// far below the fold — and the reader would arrive at three finished screens.
// A component per panel gives each one a trigger measured against itself. Same
// reasoning as the split trigger in `chain/ProofBand`, applied structurally.
//
// ── The numeral is the panel's largest element, and that is the point ──────
// This variant's device is that the four steps CANNOT be read out of order,
// and it does not enforce that with a diagram or a sticky lock — it enforces it
// with distance. One step per screen means step 3 is unreachable without
// passing through step 2, and a numeral at `text-mural` means the reader always
// knows which one they are standing in. On a page read by falling, the numeral
// is the altimeter.
//
// `--text-mural` measures its body in `cqw`, so the block MUST declare
// `@container` — without one, `cqw` resolves against the viewport and the
// numeral keeps growing after the `Container` has hit its `max-width`. That is
// the agreement the token's own comment in `app/globals.css` states.

export default function DescentPanel({
  index,
  short,
  title,
  body,
  anchor,
  dark = false,
}: DescentPanelProps) {
  const rootRef = useScrollReveal<HTMLElement>({ start: "top 72%", stagger: 0.14 });

  return (
    <section
      ref={rootRef}
      id={anchor}
      {...(dark ? { "data-nav-dark": "" } : {})}
      className={`flex min-h-svh flex-col justify-center py-[12svh] ${
        dark ? "bg-ink text-cream" : "bg-cream text-ink"
      }`}
    >
      <Container className="@container">
        <div className="grid-ds gap-y-12">
          <div className="col-span-12 lg:col-span-8">
            <div data-reveal className="flex items-baseline gap-6">
              <p className="text-mural">{index}</p>
              <p
                className={`text-caption-mono uppercase ${
                  dark ? "text-near-green-accent" : "text-green-ink"
                }`}
              >
                {short}
              </p>
            </div>

            {/* One line, and it is the step's own sentence — not a shortened
                label for it. The narrow measure is what forces it to break
                across three or four lines at this size, which is what makes a
                single sentence occupy a screen without being padded. */}
            <h3 data-reveal className="mt-10 max-w-[15ch] text-statement text-balance">
              {title}
            </h3>
          </div>

          {/* Beside, not below: the body is the footnote to the line, and a
              narrow column set against a very wide one is this variant's whole
              typographic argument. */}
          <div className="col-span-12 lg:col-span-3 lg:col-start-10 lg:self-end">
            <div
              className={`h-px w-full ${dark ? "bg-white/20" : "bg-rule"}`}
              aria-hidden="true"
            />
            <p
              data-reveal
              className={`mt-6 max-w-[34ch] text-body text-pretty ${
                dark ? "text-white/70" : "text-ink-soft"
              }`}
            >
              {body}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
