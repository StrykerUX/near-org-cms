"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import ScaleCard from "@/components/sections/protocol-labs/a/ScaleCard";
import { AI_SCALE, PROOF } from "@/components/sections/protocol-labs/protocolContent";

// Sección 3 — «Built for AI scale».
//
// ── La sección es un bloque, no dos ───────────────────────────────────────
//
// El titular, el cuerpo y las tres propiedades viven dentro del MISMO contenedor
// y comparten su aire. Antes el par titular/cuerpo flotaba arriba con un hueco
// grande y las tres propiedades colgaban debajo como una lista suelta: se leían
// como dos cosas puestas una encima de la otra en vez de como una afirmación y
// sus tres condiciones.
//
// ── Las tres propiedades son cards ────────────────────────────────────────
//
// El mismo objeto que las cards de «Own Your Own» en la home: esquina de 24px,
// tinte un escalón por debajo del fondo, sombra de un píxel, desenfoque de
// fondo. No es una cita estética — es el único componente-caja que la línea de
// diseño viva tiene, y una página nueva que invente el suyo obliga a mantener
// dos.
//
// El objeto de la card vive en `ScaleCard`, compartido con la otra versión de
// esta sección: el detalle de por qué es un componente y no markup repetido está
// ahí. Su arte son tres figuras isométricas de `scaleArt.tsx`.
//
// ── La prop `proof`: dónde caen las seis cifras ───────────────────────────
//
// Tres valores, y ninguno es una preferencia visual — cada uno responde a qué
// otra parte de la página se hace cargo de la evidencia:
//
//   · `"top"`    — la franja ABRE la sección.
//   · `"bottom"` — la franja CIERRA la sección, subordinada a las propiedades.
//   · `false`    — sin franja. Es lo que usa la página hoy: las seis cifras
//                  tienen su propia sección (`ProofRow`) justo encima, y
//                  repetirlas acá sería decir dos veces lo mismo con dos formas
//                  distintas.

export type ProofSlot = "top" | "bottom" | false;

// La franja de seis cifras. Una sola regla arriba y nada más: seis reglas —una
// por cifra— la convertirían en una tabla, y una tabla vuelve a subirle el rango
// que esta sección le está bajando a propósito.
//
// Un componente y no dos bloques de JSX condicionados: arriba y abajo tiene que
// ser la MISMA franja, o la prop deja de ser "dónde cae" y pasa a ser "cuál de
// las dos versiones".
function ProofStrip() {
  return (
    <dl className="grid grid-cols-2 gap-x-8 gap-y-6 border-t border-rule pt-6 sm:grid-cols-3 lg:grid-cols-6">
      {PROOF.map((stat) => (
        <div key={stat.id} className="flex flex-col gap-1">
          <dd className="text-h4">{stat.value}</dd>
          <dt className="uppercase text-micro-mono text-gray-intermediate">{stat.label}</dt>
          {stat.note && <dd className="text-micro-mono text-gray-intermediate">{stat.note}</dd>}
        </div>
      ))}
    </dl>
  );
}

export default function ScaleClaim({ proof = "bottom" }: { proof?: ProofSlot }) {
  const ref = useScrollReveal<HTMLDivElement>({ y: 20, stagger: 0.08 });

  return (
    <section className="bg-background text-foreground">
      <Container className="flex flex-col gap-16 py-28 lg:py-36">
        {proof === "top" && <ProofStrip />}

        <div ref={ref} className="flex flex-col gap-12 lg:gap-16">
          {/* Titular y cuerpo sobre la retícula de doce, no en dos mitades: el
              cuerpo arranca en la columna 7 y así queda alineado con el borde
              izquierdo de la segunda card, que es lo que ata el bloque de arriba
              con el de abajo. Con `lg:grid-cols-2` caía en la mitad exacta, que
              no coincide con ninguna de las tres columnas de cards. */}
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
              <ScaleCard key={p.title} index={i} title={p.title} body={p.body} />
            ))}
          </ul>
        </div>

        {proof === "bottom" && <ProofStrip />}
      </Container>
    </section>
  );
}
