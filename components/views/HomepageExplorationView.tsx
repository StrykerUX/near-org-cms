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
        <h1 className="text-h1 mt-6 max-w-[24ch]">Bloques de transición</h1>
        <p className="text-body-lg mt-6 max-w-[62ch] opacity-70">
          Cinco pruebas sobre la misma retícula de 20 × 5 píxeles y el mismo
          recorrido de scroll. Lo único que cambia entre una y otra es qué decide
          el turno de cada píxel. Scrolleá despacio: el gesto está atado a la
          posición del scroll, no a un reloj, así que se puede parar a la mitad.
        </p>
        {/* Índice: la otra mitad de la respuesta a "qué pertenece a qué" — el
            separador te dice dónde estás, esto te lleva. Los anclas las declara
            `LabDivider` con su `index`. */}
        <nav className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
          <a className="text-label underline underline-offset-4" href="#test-01">01 Dissolve</a>
          <a className="text-label underline underline-offset-4" href="#test-02">02 Sweep</a>
          <a className="text-label underline underline-offset-4" href="#test-03">03 Escalera</a>
          <a className="text-label underline underline-offset-4" href="#test-04">04 Scatter</a>
          <a className="text-label underline underline-offset-4" href="#test-05">05 Sándwich</a>
        </nav>
      </Container>

      {/* ── 01 · dissolve ─ el par de contraste más bajo, a propósito ────────── */}
      <LabDivider
        index="01"
        title="Dissolve"
        spec="dissolve · cream → stone"
        note="Ruido sembrado: cada píxel tiene su turno y no hay frente ni dirección. Es el único de los cuatro que no se lee como un movimiento. Va sobre el par de colores más parecido porque un disolve con contraste alto se ve como estática."
      />
      <SpecimenBand bg="var(--cream)" fg="var(--ink)" caption="01 · arriba · cream" />
      <PixelTransition pattern="dissolve" from="var(--cream)" to="var(--stone)" />
      <SpecimenBand bg="var(--stone)" fg="var(--ink)" caption="01 · abajo · stone" />

      {/* ── 02 · sweep ─ el salto a oscuro ──────────────────────────────────── */}
      <LabDivider
        index="02"
        title="Sweep diagonal"
        spec="sweep · stone → ink"
        note="Diagonal con jitter. El jitter es lo que hace que el borde escalone en vez de ser una recta: sin él el gesto se lee como un barrido lineal cualquiera y los píxeles no se notan como píxeles. Cruza al negro de sección, que es el caso real más frecuente."
      />
      <SpecimenBand bg="var(--stone)" fg="var(--ink)" caption="02 · arriba · stone" />
      <PixelTransition pattern="sweep" from="var(--stone)" to="var(--ink)" />
      <SpecimenBand bg="var(--ink)" fg="var(--cream)" caption="02 · abajo · ink" />

      {/* ── 03 · stair ─ el linaje del sitio, pixelado ──────────────────────── */}
      <LabDivider
        index="03"
        title="Escalera pixelada"
        spec="stair · ink → cream · peak edges"
        note="La silueta de ZigguratDivider cuantizada a la retícula, con la cascada por velocidad de stairGeometry: la columna que llega más alto recorre más filas en el mismo progreso, o sea va más rápido. La columna del valle no tiene ni un píxel — el centro se queda del color de arriba."
      />
      <SpecimenBand bg="var(--ink)" fg="var(--cream)" caption="03 · arriba · ink" />
      <PixelTransition pattern="stair" from="var(--ink)" to="var(--cream)" peak="edges" />
      <SpecimenBand bg="var(--cream)" fg="var(--ink)" caption="03 · abajo · cream" />

      {/* ── 04 · scatter ─ el único con deriva y con acento ─────────────────── */}
      <LabDivider
        index="04"
        title="Scatter con acento"
        spec="scatter · cream → ink · 10% en verde"
        note="Los píxeles caen o suben a su celda desde fuera de la banda, y uno de cada diez entra en verde de acento. El peso vertical mantiene una dirección legible por debajo del desorden: sin él, el scatter y el dissolve se ven igual."
      />
      <SpecimenBand bg="var(--cream)" fg="var(--ink)" caption="04 · arriba · cream" />
      <PixelTransition pattern="scatter" from="var(--cream)" to="var(--ink)" />
      <SpecimenBand bg="var(--ink)" fg="var(--cream)" caption="04 · abajo · ink" />

      {/* ── 05 · el sándwich ─ no es un patrón nuevo, es enter + exit ─────────
          Tres bandas y dos transiciones: es la única prueba con la sección
          ENCERRADA en el medio. Ojo al orden de los colores de la segunda — se
          invierten, y el porqué está en la prop `mode` de PixelTransition. */}
      <LabDivider
        index="05"
        title="Antes y después"
        spec="sweep · enter arriba + exit abajo"
        note="La misma transición dos veces alrededor de una sección. Reusa sweep justamente para que no se confunda con un quinto patrón. En la de abajo los colores van al revés: from es el negro que VIENE y los píxeles son el cream que se está retirando, porque lo que se retira es el color viejo."
      />
      <SpecimenBand bg="var(--ink)" fg="var(--cream)" caption="05 · arriba · ink" />
      <PixelTransition pattern="sweep" from="var(--ink)" to="var(--cream)" />
      <SpecimenBand bg="var(--cream)" fg="var(--ink)" caption="05 · encerrada · cream" />
      <PixelTransition pattern="sweep" from="var(--ink)" to="var(--cream)" mode="exit" />
      <SpecimenBand bg="var(--ink)" fg="var(--cream)" caption="05 · abajo · ink" />

      {/* El cierre reusa el separador porque ES el mismo elemento: marca un límite.
          Lleva `FIN` y no un `06` para que el índice no se lea como una sexta
          prueba — abajo no hay ninguna transición. */}
      <LabDivider
        index="FIN"
        title="Cuándo se borra esto"
        spec="ninguna transición debajo"
        note="Cuando gane un patrón se promueve a components/primitives/PixelTransition.tsx con solo ese, y esta carpeta se borra. El camino completo está en el README de components/sections/home-exploration/."
      />
    </main>
  );
}
