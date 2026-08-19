import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import AltDivider from "@/components/sections/hero-alt/AltDivider";
import { ALTS } from "@/components/sections/hero-alt/heroAltContent";

import ApertureHero from "@/components/sections/hero-alt/ApertureHero";
import ApertureBars from "@/components/sections/hero-alt/ApertureBars";
import FlowHero from "@/components/sections/hero-alt/FlowHero";
import FlowBars from "@/components/sections/hero-alt/FlowBars";
import ShatterHero from "@/components/sections/hero-alt/ShatterHero";
import ShatterBars from "@/components/sections/hero-alt/ShatterBars";
import GlassHero from "@/components/sections/hero-alt/GlassHero";
import GlassBars from "@/components/sections/hero-alt/GlassBars";
import LatticeHero from "@/components/sections/hero-alt/LatticeHero";
import LatticeBars from "@/components/sections/hero-alt/LatticeBars";
import CutoutHero from "@/components/sections/hero-alt/CutoutHero";
import CutoutBars from "@/components/sections/hero-alt/CutoutBars";

// Seis versiones alternativas de las DOS primeras secciones de la homepage —
// el hero y el statement que lo sigue— una debajo de la otra.
//
// ── Los doce componentes están escritos a mano y no salen de un .map() ──────
//
// Con un array de pares y un `.map()` esto serían ocho líneas. Pero entonces la
// correspondencia entre cada divider y su par quedaría implícita en el orden de
// dos arrays distintos, y este archivo existe para que esa correspondencia se
// pueda leer de un tirón: divider, hero, segunda sección, divider, hero,
// segunda sección. Es el mismo criterio que usa `HomepageExplorationView` para
// sus cinco pruebas de transición, y por el mismo motivo.
//
// El contrato de `sections/README.md` prohíbe que una SECCIÓN sepa de otra; una
// view sí puede, y esto es exactamente lo que una view hace.
//
// ── Apilarlas tiene un costo que conviene tener presente al mirar ───────────
//
// Un hero es lo PRIMERO que alguien ve, con la página recién cargada y sin
// haber tocado la rueda. Acá solo el 01 se ve en esas condiciones; a los otros
// cuatro se llega scrolleando, ya en movimiento, y eso los favorece o los
// perjudica según el gesto —el 05 en particular necesita que el lector ya esté
// empujando, y apilado arranca con ventaja.
//
// Para juzgar uno en frío hay que montarlo solo en una view propia. Los diez
// componentes son independientes y se pueden mezclar entre sí: el par no es una
// unidad indivisible, es una propuesta de qué va con qué.

export default function HeroAltView() {
  return (
    <main className="flex flex-col bg-cream">
      <Container as="header" className="py-20 md:py-28">
        <Eyebrow className="opacity-50">Hero lab · 6 versions</Eyebrow>
        <h1 className="text-h1 mt-6 max-w-[20ch]">
          Six heroes, the same sentence
        </h1>
        <p className="text-body-lg mt-6 max-w-[62ch] opacity-70">
          The first two sections of the homepage, six times, with identical copy
          in all of them. The only thing that changes between one and the next is
          the mechanism — if the copy changed too, the comparison would be
          measuring two things at once. Every version opens with its card: what
          technique it uses and what to watch in each half of the pair.
        </p>

        <nav className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
          {ALTS.map((alt) => (
            <a
              key={alt.id}
              href={`#${alt.id}`}
              className="text-label underline underline-offset-4"
            >
              {alt.index} {alt.title}
            </a>
          ))}
        </nav>
      </Container>

      {/* ── 01 · Aperture — CSS + GSAP, sin canvas ────────────────────────── */}
      <AltDivider spec={ALTS[0]} />
      <ApertureHero />
      <ApertureBars />

      {/* ── 02 · Flow — WebGL2, el campo reacciona a la velocidad del scroll ─ */}
      <AltDivider spec={ALTS[1]} />
      <FlowHero />
      <FlowBars />

      {/* ── 03 · Shatter — SplitText y transforms 3D, sin fondo ───────────── */}
      <AltDivider spec={ALTS[2]} />
      <ShatterHero />
      <ShatterBars />

      {/* ── 04 · Glass — WebGL2 con el titular rasterizado a textura ──────── */}
      <AltDivider spec={ALTS[3]} />
      <GlassHero />
      <GlassBars />

      {/* ── 05 · Lattice — canvas 2D, la nube muestreada del propio texto ─── */}
      <AltDivider spec={ALTS[4]} />
      <LatticeHero />
      <LatticeBars />

      {/* ── 06 · Cutout — el clip de v5, recortado a los glifos ───────────── */}
      <AltDivider spec={ALTS[5]} />
      <CutoutHero />
      <CutoutBars />
    </main>
  );
}
