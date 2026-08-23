"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import ScaleCard from "@/components/sections/protocol-labs/a/ScaleCard";
import { AI_SCALE } from "@/components/sections/protocol-labs/protocolContent";

// Sección 3 — «Built for AI scale», en cuatro columnas.
//
// El texto en la primera y una card en cada una de las otras tres, todo en una
// sola fila. Ganó a otras dos disposiciones que se montaron a la vez para
// compararlas y están en el historial de git:
//
//   · una con el titular y el cuerpo en su propia fila y las cards debajo en
//     tres columnas anchas, con el arte apilado sobre el texto dentro de cada
//     card;
//   · la misma, con las cajas ACOSTADAS —panel a la izquierda, texto a su
//     derecha— para que no crecieran de alto.
//
// ── Qué gana este reparto ─────────────────────────────────────────────────
//
// Las cards se achican: pasan de un tercio del contenedor a un cuarto —de ~380px
// a ~285px en un desktop de 1200— y con ellas su panel de arte, porque el alto
// del panel sale de una proporción y no de un valor fijo. La sección pierde una
// fila entera y queda bastante más compacta, que en una página que ya carga un
// acto de seis pantallas es alto que se paga dos veces.
//
// ── Qué paga, y hay que saberlo ───────────────────────────────────────────
//
//   · **El titular está un escalón abajo.** `text-h2` en una columna de 285px
//     quiebra en cuatro o cinco renglones y deja de leerse como titular, así que
//     va en `text-h3`. Este reparto no sólo achica las cards: también achica la
//     afirmación que las introduce.
//   · **El texto no gobierna la sección.** Es una columna más, la primera de
//     cuatro, y se lee como un rótulo al margen antes que como una tesis. Es el
//     precio de que las cuatro piezas quepan en una fila.
//
// ── El texto va arriba de su columna, no centrado ─────────────────────────
//
// `self-start`. Centrarlo verticalmente contra unas cards que miden bastante más
// que él lo dejaría flotando a media altura, sin alinearse con nada; arriba, su
// primera línea arranca a la misma altura que el borde superior de las cards y
// esa coincidencia es lo único que ata las cuatro columnas entre sí.
export default function ScaleClaim() {
  const ref = useScrollReveal<HTMLDivElement>({ y: 20, stagger: 0.08 });

  return (
    <section className="bg-cream text-foreground">
      <Container className="py-28 lg:py-36">
        <div ref={ref} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* La primera columna. En tablet ocupa las dos de la fila para no
              quedar más estrecha que una card; el reparto a cuatro sólo tiene
              sentido cuando hay ancho para cuatro. */}
          <div data-reveal className="flex flex-col gap-5 self-start md:col-span-2 lg:col-span-1">
            <h2 className="text-h3 text-pretty">
              {AI_SCALE.title.lead}
              <br />
              <Accent>{AI_SCALE.title.accent}</Accent>
            </h2>
            <p className="max-w-[34ch] text-body text-ink-soft text-pretty">{AI_SCALE.body}</p>
          </div>

          {/* Las tres cards, cada una en su columna. `contents` y no un `<ul>`
              con su propio grid: envolverlas en una lista las metería en una sola
              celda de la retícula de cuatro y volverían a repartirse entre ellas,
              que es exactamente el layout del que esta variante quiere salir.
              Con `display: contents` la lista existe para el lector de pantalla y
              no para el layout, y las cards se colocan contra la retícula de la
              sección. */}
          <ul className="contents">
            {AI_SCALE.points.map((p, i) => (
              <ScaleCard key={p.title} index={i} title={p.title} body={p.body} />
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
