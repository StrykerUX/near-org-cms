"use client";

import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import CtaPill from "@/components/primitives/CtaPill";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import Surface from "@/components/sections/shells/stage/Surface";
import { CENTER } from "@/components/sections/economics/economicsContent";

// §5 of variant C — one asset, three jobs, and the close.
//
// ── This section has no figure, and that is a decision ───────────────────
// The page has already spent four graphic moments: a shader terrain, four
// coloured solids, a full-bleed climb and two product captures. A fifth drawing
// here would be the second circular-ish figure on a page that already has one,
// and readers hunt for a relationship between two such figures that does not
// exist. The rule is that a graphic has to be evidence, argument or structure;
// "the close looked bare" is none of the three. A short close is allowed to be
// short.
//
// ── `reinforces` is set apart from `body` ────────────────────────────────
// Each role has a definition and a consequence, and the consequence is the half
// that argues ("more usage means more settlement in NEAR"). Run together they
// blur into a description; split — body in ink-soft, consequence in the page's
// legible green — the three read as three claims instead of three glossary
// entries.
//
// ── The page ends back on the terrain it opened on ───────────────────────
// The forward line and the CTA sit on a band of the same contour surface as the
// hero, with the same palette and a stronger tilt. That return is the page's
// own version of the gesture its central figure makes, at the scale of the
// whole document — and it is the reason the close is split into two grounds
// instead of running to the bottom on cream.
//
// The band is short and its content sits on the low, flat end of the terrain,
// for the same reason the hero does: that is where a plateau is, and a plateau
// is the only part of a contour map a line of type can sit on.

const PALETTE = {
  bg: "#00dc8d",
  high: "#00dc8d",
  line: "#00dc8d",
} as const;

export default function CenterClose() {
  const rootRef = useScrollReveal<HTMLElement>();

  return (
    <>
      <section ref={rootRef} className="bg-cream pb-[12svh] pt-[14svh] text-ink">
        <Container>
          <div className="grid-ds items-end gap-y-6">
            <div data-reveal className="col-span-12 lg:col-span-7">
              <Eyebrow className="text-gray-intermediate">{CENTER.eyebrow}</Eyebrow>
              <h2 className="mt-6 max-w-[16ch] text-h1 text-balance">{CENTER.headline}</h2>
            </div>
            <div data-reveal className="col-span-12 lg:col-span-4 lg:col-start-9">
              <p className="max-w-[42ch] text-body text-ink-soft text-pretty">{CENTER.intro}</p>
            </div>
          </div>

          <ol role="list" className="mt-20 grid-ds gap-y-12">
            {CENTER.roles.map((r) => (
              <li key={r.id} data-reveal className="col-span-12 md:col-span-6 lg:col-span-4">
                <div className="h-px w-full bg-rule" aria-hidden="true" />
                <p className="mt-5 text-caption-mono text-gray-intermediate">{r.index}</p>
                <h3 className="mt-6 max-w-[14ch] text-h3 text-pretty">{r.role}</h3>
                <p className="mt-4 max-w-[34ch] text-body text-ink-soft text-pretty">{r.body}</p>
                <p className="mt-6 max-w-[30ch] text-body-sm-mono text-green-ink text-pretty">
                  {r.reinforces}
                </p>
              </li>
            ))}
          </ol>

          <p
            data-reveal
            className="mt-20 max-w-[58ch] text-body-lg text-ink-soft text-pretty"
          >
            {CENTER.body}
          </p>
        </Container>
      </section>

      <Surface
        palette={PALETTE}
        bands={6}
        scale={1.35}
        tilt={0.78}
        className="flex min-h-[60svh] items-end pb-[12svh] pt-[16svh]"
      >
        <Container>
          <div className="grid-ds items-end gap-y-10">
            {/* The forward line is the only sentence on the page about what has
                not happened yet, so it is the only one set in the serif. */}
            <p className="col-span-12 max-w-[20ch] text-display-serif italic text-ink text-pretty lg:col-span-7">
              {CENTER.forward}
            </p>
            <div className="col-span-12 lg:col-span-4 lg:col-start-9">
              <CtaPill href={CENTER.cta.href} tone="filled" external>
                {CENTER.cta.label}
              </CtaPill>
            </div>
          </div>
        </Container>
      </Surface>
    </>
  );
}
