import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import LabDivider from "@/components/sections/home-exploration/LabDivider";
import PixelTransition from "@/components/sections/home-exploration/PixelTransition";
import SpecimenBand from "@/components/sections/home-exploration/SpecimenBand";

// Laboratorio de transiciones de píxel: cuatro patrones más la demo del sándwich.
//
// ── Cada prueba es AUTOCONTENIDA, y eso es el diseño ─────────────────────────
//
// La primera versión encadenaba los colores y reusaba cada banda como el "después"
// de una prueba y el "antes" de la siguiente. Se leía como un sitio real y ahorraba
// altura, pero a mitad de scroll no había forma de saber a qué prueba pertenecía la
// animación que estabas mirando — que es lo único que esta página existe para
// responder. Ahora cada prueba abre con un `LabDivider` y trae SUS DOS bandas, sin
// compartir ninguna. El razonamiento largo está en `LabDivider`.
//
// ── La invariante que hay que poder leer de un tirón ─────────────────────────
//
// **El `from` de cada transición es el `bg` de la banda de ARRIBA, y el `to` el de
// la de ABAJO.** Es el único error de uso posible del componente, y por eso los
// cuatro bloques están escritos a mano en vez de salir de un `.map()` sobre un
// array de pruebas: en un `.map()` esa correspondencia queda implícita en los
// índices, y acá tiene que estar a la vista, línea contra línea.
//
// El contrato de `components/sections/README.md` prohíbe que una SECCIÓN sepa de
// otra; una view sí puede, y esto es exactamente lo que una view hace.

export default function HomepageExplorationView() {
  return (
    <main className="flex flex-col bg-cream pt-[var(--site-header-block)]">
      <Container as="header" className="py-20 md:py-28">
        <Eyebrow className="opacity-50">Pixel transition lab</Eyebrow>
        <h1 className="text-h1 mt-6 max-w-[24ch]">Transition blocks</h1>
        <p className="text-body-lg mt-6 max-w-[62ch] opacity-70">
          Five tests on the same 20 × 5 pixel grid and the same scroll stretch.
          The only thing that changes between them is what decides each pixel's
          turn. Scroll slowly: the gesture is tied to scroll position and not to
          a clock, so it can be stopped halfway.
        </p>
        {/* Índice: la otra mitad de la respuesta a "qué pertenece a qué" — el
            separador te dice dónde estás, esto te lleva. Los anclas las declara
            `LabDivider` con su `index`. */}
        <nav className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
          <a className="text-label underline underline-offset-4" href="#test-01">01 Dissolve</a>
          <a className="text-label underline underline-offset-4" href="#test-02">02 Sweep</a>
          <a className="text-label underline underline-offset-4" href="#test-03">03 Staircase</a>
          <a className="text-label underline underline-offset-4" href="#test-04">04 Scatter</a>
          <a className="text-label underline underline-offset-4" href="#test-05">05 Sandwich</a>
        </nav>
      </Container>

      {/* ── 01 · dissolve ─ el par de contraste más bajo, a propósito ────────── */}
      <LabDivider
        index="01"
        title="Dissolve"
        spec="dissolve · cream → stone"
        note="Seeded noise: every pixel has its turn and there is no front and no direction. It is the only one of the four that does not read as movement. It runs over the closest pair of colours, because a dissolve with high contrast looks like static."
      />
      <SpecimenBand bg="var(--cream)" fg="var(--ink)" caption="01 · above · cream" />
      <PixelTransition pattern="dissolve" from="var(--cream)" to="var(--stone)" />
      <SpecimenBand bg="var(--stone)" fg="var(--ink)" caption="01 · below · stone" />

      {/* ── 02 · sweep ─ el salto a oscuro ──────────────────────────────────── */}
      <LabDivider
        index="02"
        title="Diagonal sweep"
        spec="sweep · stone → ink"
        note="Diagonal with jitter. The jitter is what makes the edge step instead of being a straight line: without it the gesture reads as any linear wipe and the pixels are not noticed as pixels. It crosses into section black, which is the most frequent real case."
      />
      <SpecimenBand bg="var(--stone)" fg="var(--ink)" caption="02 · above · stone" />
      <PixelTransition pattern="sweep" from="var(--stone)" to="var(--ink)" />
      <SpecimenBand bg="var(--ink)" fg="var(--cream)" caption="02 · below · ink" />

      {/* ── 03 · stair ─ el linaje del sitio, pixelado ──────────────────────── */}
      <LabDivider
        index="03"
        title="Pixelated staircase"
        spec="stair · ink → cream · peak edges"
        note="The ZigguratDivider silhouette quantised to the grid, with the cascade driven by the speed of stairGeometry: the column that reaches highest crosses more rows in the same progress, so it moves faster. The valley column has no pixels at all — the centre stays the colour above."
      />
      <SpecimenBand bg="var(--ink)" fg="var(--cream)" caption="03 · above · ink" />
      <PixelTransition pattern="stair" from="var(--ink)" to="var(--cream)" peak="edges" />
      <SpecimenBand bg="var(--cream)" fg="var(--ink)" caption="03 · below · cream" />

      {/* ── 04 · scatter ─ el único con deriva y con acento ─────────────────── */}
      <LabDivider
        index="04"
        title="Scatter with accent"
        spec="scatter · cream → ink · 10% in green"
        note="The pixels fall or rise into their cell from outside the band, and one in ten arrives in accent green. The vertical bias keeps a legible direction underneath the disorder: without it, scatter and dissolve look the same."
      />
      <SpecimenBand bg="var(--cream)" fg="var(--ink)" caption="04 · above · cream" />
      <PixelTransition pattern="scatter" from="var(--cream)" to="var(--ink)" />
      <SpecimenBand bg="var(--ink)" fg="var(--cream)" caption="04 · below · ink" />

      {/* ── 05 · el sándwich ─ no es un patrón nuevo, es enter + exit ─────────
          Tres bandas y dos transiciones: es la única prueba con la sección
          ENCERRADA en el medio. Ojo al orden de los colores de la segunda — se
          invierten, y el porqué está en la prop `mode` de PixelTransition. */}
      <LabDivider
        index="05"
        title="Before and after"
        spec="sweep · enter above + exit below"
        note="The same transition twice around one section. It reuses sweep precisely so it is not mistaken for a fifth pattern. In the bottom one the colours are reversed: from is the black that is COMING and the pixels are the cream withdrawing, because what withdraws is the old colour."
      />
      <SpecimenBand bg="var(--ink)" fg="var(--cream)" caption="05 · above · ink" />
      <PixelTransition pattern="sweep" from="var(--ink)" to="var(--cream)" />
      <SpecimenBand bg="var(--cream)" fg="var(--ink)" caption="05 · enclosed · cream" />
      <PixelTransition pattern="sweep" from="var(--ink)" to="var(--cream)" mode="exit" />
      <SpecimenBand bg="var(--ink)" fg="var(--cream)" caption="05 · below · ink" />

      {/* El cierre reusa el separador porque ES el mismo elemento: marca un límite.
          Lleva `FIN` y no un `06` para que el índice no se lea como una sexta
          prueba — abajo no hay ninguna transición. */}
      <LabDivider
        index="END"
        title="When this gets deleted"
        spec="no transition below"
        note="When one pattern wins it gets promoted to components/primitives/PixelTransition.tsx with only that one, and this folder is deleted. The full path is in the README of components/sections/home-exploration/."
      />
    </main>
  );
}
