"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import Surface from "@/components/sections/shells/stage/Surface";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { CHAPTERS, HERO } from "@/components/sections/about/aboutContent";

// §1 of variant C — the ground, before anything is built on it.
//
// ── The palette, and why it is the cold one ───────────────────────────────
//
// Four pages share the contour shader and each one calibrates it, so the first
// job of these numbers is to make this terrain unmistakably not the other
// three. This page is a history, and the register a history is filed in is
// archival: paper and ink, a survey sheet rather than a landscape. Hence the
// coldest palette of the set — a paper ground, a slate-grey high ground with
// no warmth in it at all, and an ink line — against the warm tans and greens
// the community and foundation pages take.
//
// More bands and a smaller feature size than the reference calibration, for
// the same reason: close-set contours read as a survey at scale, wide ones read
// as scenery. Thirteen levels over this range puts the lines near enough to
// each other that the sheet reads as measured.
//
// ── How the headline stays legible without a plate behind it ──────────────
//
// The usual failure of a shader hero is that the type crosses a value edge
// mid-word. The standard fix is to hunt for a plateau, which is a guess — the
// field drifts, and what is flat at load is not flat a minute later. This
// palette solves it structurally instead: `bg` and `high` are BOTH light, about
// eight points of value apart, so ink type reads on every band of the ramp and
// there is no edge for it to fall off. It is also why the terrain can be dense
// here and could not be on a page whose palette runs light to dark.
//
// ── Papel de archivo, y no gris-azul ──────────────────────────────────────
//
// La primera versión era `#f5f4f1 / #e1e1e1 / #e1e1e1`, y quedaba a un paso de
// la de `/prototype/foundation-c` (`#f5f4f1 / #e1e1e1 / #e1e1e1`): dos de las
// cuatro páginas abriendo con el mismo terreno mineral. El error fue del
// encargo, que le pidió «frío» a las dos.
//
// El eje que las separa es el MATIZ, no el valor: la de foundation es azul
// —mineral, suizo, institucional— y ésta se va a cálido. Papel envejecido y
// tinta sepia es lo que corresponde a una página que es un archivo, y no se
// confunde ni con el mineral de foundation, ni con el albaricoque de community,
// ni con el verde de economics. Las cuatro páginas ahora se distinguen por
// matiz de un vistazo, que es lo único que funciona cuando se las compara en
// pestañas distintas.
const PALETTE = { bg: "#f5f4f1", high: "#e1e1e1", line: "#e1e1e1" } as const;

const SPAN = `${CHAPTERS[0].year} — ${CHAPTERS[CHAPTERS.length - 1].year}`;

export default function TerrainHero() {
  const rootRef = useScrollReveal<HTMLElement>({ start: "top 90%" });

  return (
    <section ref={rootRef}>
      <Surface
        palette={PALETTE}
        bands={13}
        scale={3}
        tilt={0.28}
        className="flex min-h-svh flex-col justify-end pb-[12svh] pt-[calc(var(--site-header-block)+6svh)]"
      >
        <Container>
          <div data-reveal>
            <Eyebrow className="text-ink-soft">{HERO.eyebrow}</Eyebrow>
          </div>

          <h1 data-reveal className="mt-8 max-w-[15ch] text-display text-ink text-balance">
            The <Accent display>History</Accent> of NEAR Protocol
          </h1>

          <div className="grid-ds mt-16 gap-y-8">
            <p data-reveal className="col-span-12 text-caption-mono text-ink-soft lg:col-span-2">
              {SPAN}
            </p>
            <div className="col-span-12 lg:col-span-5 lg:col-start-4">
              <p data-reveal className="max-w-[34ch] text-h3 text-ink text-pretty">
                {HERO.sub}
              </p>
            </div>
            <div className="col-span-12 lg:col-span-4 lg:col-start-9">
              <p data-reveal className="max-w-[42ch] text-body text-ink-soft text-pretty">
                {HERO.standfirst}
              </p>
            </div>
          </div>
        </Container>
      </Surface>
    </section>
  );
}
