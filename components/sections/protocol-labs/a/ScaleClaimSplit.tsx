"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import ScaleCard from "@/components/sections/protocol-labs/a/ScaleCard";
import { AI_SCALE } from "@/components/sections/protocol-labs/protocolContent";

// «Built for AI scale», en cuatro columnas — la variante de esta sección.
//
// ── Qué cambia respecto de `ScaleClaim` ───────────────────────────────────
//
// Una sola cosa: **el reparto horizontal**. Allá el titular y el cuerpo ocupan
// una fila propia y las tres cards otra, en tres columnas anchas. Acá las cuatro
// piezas comparten una sola fila de cuatro columnas: el texto en la primera y
// una card en cada una de las otras tres.
//
// Todo lo demás —la copy, el objeto de la card, su arte, el fondo, la
// tipografía— es literalmente el mismo componente. Es lo que hace que
// compararlas mida el layout y nada más.
//
// ── Qué gana y qué paga ───────────────────────────────────────────────────
//
// Gana lo que se pidió: las cards se achican. Pasan de un tercio del contenedor
// a un cuarto —de ~380px a ~285px en un desktop de 1200— y con ellas se achica su
// panel de arte, porque su alto sale de una proporción y no de un valor fijo. La
// sección entera pierde una fila y queda bastante más compacta.
//
// Paga dos cosas, y conviene mirarlas antes de elegir:
//
//   · **El titular baja de escala.** `text-h2` en una columna de 285px quiebra
//     en cuatro o cinco renglones y deja de leerse como titular. Acá va a
//     `text-h3`, que es un escalón menos — o sea que esta variante no sólo
//     achica las cards, también achica la afirmación que las introduce.
//   · **El texto deja de gobernar la sección.** En `ScaleClaim` ocupa el ancho
//     completo antes que nada y las cards son su consecuencia; acá es una
//     columna más, la primera de cuatro. Se lee como un rótulo al margen y no
//     como una tesis.
//
// ── El texto va arriba de su columna, no centrado ─────────────────────────
//
// `self-start`. Centrarlo verticalmente contra unas cards que miden bastante más
// que él lo dejaría flotando a media altura, sin alinearse con nada; arriba, su
// primera línea arranca a la misma altura que el borde superior de las cards y
// esa coincidencia es lo único que ata las cuatro columnas entre sí.
export default function ScaleClaimSplit() {
  const ref = useScrollReveal<HTMLDivElement>({ y: 20, stagger: 0.08 });

  return (
    <section className="bg-background text-foreground">
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
