import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import PixelTransition from "@/components/sections/home-exploration/PixelTransition";
import SpecimenBand from "@/components/sections/home-exploration/SpecimenBand";

// Laboratorio de transiciones de píxel: cuatro patrones más la demo del sándwich,
// cada uno ENTRE dos secciones de relleno.
//
// La composición está escrita a mano y no salida de un `.map()` sobre un array de
// pruebas, a propósito: lo que hay que poder leer de un tirón es la CADENA DE
// COLORES —que el `from` de cada transición sea el fondo de la banda de arriba y
// el `to` el de la de abajo—, y en un `.map()` esa cadena queda implícita en los
// índices. Es el único error de uso posible del componente, así que se deja a la
// vista.
//
// Cadena: cream → stone → ink → cream → ink → [cream] → ink
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
      </Container>

      {/* ── 01 · dissolve ─ el par de contraste más bajo, a propósito ────────── */}
      <SpecimenBand
        bg="var(--cream)"
        fg="var(--ink)"
        eyebrow="Prueba 01 ↓"
        title="Dissolve"
        note="Ruido sembrado: cada píxel tiene su turno y no hay frente ni dirección. Es el único de los cuatro que no se lee como un movimiento. Va sobre el par de colores más parecido (cream → stone) porque un disolve con contraste alto se ve como estática."
      />
      <PixelTransition pattern="dissolve" from="var(--cream)" to="var(--stone)" />

      {/* ── 02 · sweep ─ el salto a oscuro ──────────────────────────────────── */}
      <SpecimenBand
        bg="var(--stone)"
        fg="var(--ink)"
        eyebrow="Prueba 02 ↓"
        title="Sweep diagonal"
        note="Diagonal con jitter. El jitter es lo que hace que el borde escalone en vez de ser una recta: sin él el gesto se lee como un barrido lineal cualquiera y los píxeles no se notan como píxeles. Acá cruza al negro de sección, que es el caso real más frecuente."
      />
      <PixelTransition pattern="sweep" from="var(--stone)" to="var(--ink)" />

      {/* ── 03 · stair ─ el linaje del sitio, pixelado ──────────────────────── */}
      <SpecimenBand
        bg="var(--ink)"
        fg="var(--cream)"
        eyebrow="Prueba 03 ↓"
        title="Escalera pixelada"
        note="La silueta de ZigguratDivider cuantizada a la retícula, con la cascada por velocidad de stairGeometry: la columna que llega más alto recorre más filas en el mismo progreso, o sea va más rápido. La columna del valle no tiene ni un píxel — el centro se queda del color de arriba."
      />
      <PixelTransition pattern="stair" from="var(--ink)" to="var(--cream)" peak="edges" />

      {/* ── 04 · scatter ─ el único con deriva y con acento ─────────────────── */}
      <SpecimenBand
        bg="var(--cream)"
        fg="var(--ink)"
        eyebrow="Prueba 04 ↓"
        title="Scatter con acento"
        note="Los píxeles caen o suben a su celda desde fuera de la banda, y uno de cada diez entra en verde de acento. El peso vertical mantiene una dirección legible por debajo del desorden: sin él, el scatter y el dissolve se ven igual."
      />
      <PixelTransition pattern="scatter" from="var(--cream)" to="var(--ink)" />

      {/* ── 05 · el sándwich ─ no es un patrón nuevo, es enter + exit ────────── */}
      <SpecimenBand
        bg="var(--ink)"
        fg="var(--cream)"
        eyebrow="Prueba 05 ↓"
        title="Antes y después"
        note="La misma transición dos veces alrededor de una sección: arriba en enter, abajo en exit. Reusa sweep justamente para que no se confunda con un quinto patrón. Ojo al orden de los colores de la de abajo — se invierten, porque lo que se retira es el color viejo."
      />
      <PixelTransition pattern="sweep" from="var(--ink)" to="var(--cream)" />

      <SpecimenBand
        bg="var(--cream)"
        fg="var(--ink)"
        eyebrow="La sección encerrada"
        title="Se abre y se cierra"
        note="Esta sección está encerrada por dos transiciones. La de abajo lleva mode=exit y los colores al revés: from es el negro que viene, y los píxeles son el cream que se está retirando."
      />
      <PixelTransition pattern="sweep" from="var(--ink)" to="var(--cream)" mode="exit" />

      <SpecimenBand
        bg="var(--ink)"
        fg="var(--cream)"
        eyebrow="Fin del laboratorio"
        title="Cuál gana"
        note="Cuando haya uno, se promueve a components/primitives/PixelTransition.tsx con solo ese patrón y esta carpeta se borra. El camino completo está en el README de components/sections/home-exploration/."
      />
    </main>
  );
}
