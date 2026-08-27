import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import CtaPill from "@/components/primitives/CtaPill";
import Surface from "@/components/sections/shells/stage/Surface";
import { HERO } from "@/components/sections/economics/economicsContent";

// §1 of variant C — the ground the page argues from.
//
// ── The palette is the argument, not a mood ───────────────────────────────
// The contour surface is shared by four pages and calibrated per page, and this
// is the only one of the four whose thesis is GROWTH. So it takes the warmest
// and greenest end of the range that is available: a sand-cream low plateau, a
// warm green high one, and an olive contour. Community's terrain is cooler,
// foundation's is quieter, about's is greyer — the point of the calibration is
// that a reader who has seen two of them can tell which page they are on before
// the headline resolves.
//
// The other three numbers are just as load-bearing as the colours:
//
// - `bands` is low (7). Few levels means WIDE plateaus, and a wide plateau is
//   flat colour with nothing crossing it — which is where a display headline is
//   allowed to sit. Raise it and the contours run straight through the type.
// - `scale` is low (1.5). Small scale means broad hills. This page is not about
//   a crowded landscape, it is about one that lifts.
// - `tilt` is high (0.62). The terrain rises toward the top of the screen, so
//   the surface has a direction, and the direction is up.
//
// ── Bottom-aligned, so the plateau is under the type ──────────────────────
// The content sits at the FOOT of the surface (`items-end`): with this tilt the
// lowest, flattest, most uniform band of the terrain is the bottom of the
// frame, and the busiest is the horizon. A centred hero would put the headline
// exactly where the contours crowd.
//
// ── No motion of its own ─────────────────────────────────────────────────
// The surface drifts on its own inside `GlSurface`, which also drops its cost
// on small screens and stops entirely under `prefers-reduced-motion`. Anything
// else animating here would be competing with a shader.

const PALETTE = {
  bg: "#00dc8d",
  high: "#00dc8d",
  line: "#00dc8d",
} as const;

export default function HeroTerrain() {
  return (
    <Surface
      palette={PALETTE}
      bands={7}
      scale={1.5}
      tilt={0.62}
      className="flex min-h-svh items-end pb-[12svh] pt-[calc(var(--site-header-block)+8svh)]"
    >
      <Container>
        <Eyebrow className="text-ink-soft">{HERO.eyebrow}</Eyebrow>

        <h1 className="mt-8 max-w-[14ch] text-display text-ink text-balance">{HERO.headline}</h1>

        <p className="mt-10 max-w-[48ch] text-body-lg text-ink-soft text-pretty">{HERO.sub}</p>

        <div className="mt-12 flex flex-wrap items-center gap-4">
          <CtaPill href={HERO.primary.href} tone="filled" external>
            {HERO.primary.label}
          </CtaPill>
          {/* Same-page anchor: `CtaPill` renders an `<a href>`, which is the
              right element for a fragment. `next/link` would route. */}
          <CtaPill href={HERO.secondary.href} tone="light">
            {HERO.secondary.label}
          </CtaPill>
        </div>
      </Container>
    </Surface>
  );
}
