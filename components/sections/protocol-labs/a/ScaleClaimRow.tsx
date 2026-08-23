"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import ScaleCard from "@/components/sections/protocol-labs/a/ScaleCard";
import { AI_SCALE } from "@/components/sections/protocol-labs/protocolContent";

// «Built for AI scale» con las cajas acostadas — la tercera variante.
//
// ── Qué cambia respecto de `ScaleClaim` ───────────────────────────────────
//
// El reparto de la sección es EL MISMO: titular y cuerpo en una fila propia
// sobre la retícula de doce, y las tres cards debajo en tres columnas anchas. Lo
// único distinto es lo que pasa dentro de cada card: el panel de arte va a la
// izquierda y el texto a su derecha, en vez de uno encima del otro.
//
// ── Por qué ───────────────────────────────────────────────────────────────
//
// Por el alto. En la disposición apilada la card mide el panel MÁS el texto, y
// el panel es alto porque hereda la proporción vertical de los PNG de la home
// (381×401). Tres de esas seguidas empujan la sección hacia el doble de
// pantalla, que en una página que ya tiene un acto de seis pantallas es alto que
// se paga dos veces.
//
// Acostada, los dos altos dejan de sumarse y pasan a competir: la card mide lo
// que mida el más alto de los dos. Y el panel se vuelve cuadrado, porque uno
// vertical al costado de un texto de tres líneas volvería a estirarla.
//
// ── Qué se pierde ─────────────────────────────────────────────────────────
//
// El arte se achica bastante — pasa de ocupar el ancho entero de la card a un
// 38%— y estas tres figuras están dibujadas para verse: la pila de marcos de
// `scaleArt.tsx` tiene cuatro niveles y un hairline fino, y a este tamaño los
// niveles de abajo empiezan a fundirse entre sí.
//
// O sea que la elección no es «cuál se ve mejor» sino qué vale más en esta
// sección: que la evidencia visual se lea, o que la sección quepa. Verlas
// seguidas es lo que lo contesta.
export default function ScaleClaimRow() {
  const ref = useScrollReveal<HTMLDivElement>({ y: 20, stagger: 0.08 });

  return (
    <section className="bg-background text-foreground">
      <Container className="flex flex-col gap-16 py-28 lg:py-36">
        <div ref={ref} className="flex flex-col gap-12 lg:gap-16">
          <div className="grid-ds gap-y-6">
            <h2 data-reveal className="col-span-full text-h2 text-pretty lg:col-span-5">
              {AI_SCALE.title.lead}
              <br />
              <Accent>{AI_SCALE.title.accent}</Accent>
            </h2>
            <p
              data-reveal
              className="col-span-full max-w-[40ch] text-body-lg text-ink-soft text-pretty lg:col-start-7 lg:col-span-5 lg:pt-2"
            >
              {AI_SCALE.body}
            </p>
          </div>

          <ul className="grid gap-6 md:grid-cols-3">
            {AI_SCALE.points.map((p, i) => (
              <ScaleCard key={p.title} index={i} title={p.title} body={p.body} layout="row" />
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
