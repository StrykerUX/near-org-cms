"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { GreenCube, IsoFrame, isoAt } from "@/components/sections/protocol-labs/isoKit";
import { AI_SCALE, PROOF } from "@/components/sections/protocol-labs/protocolContent";

// Alternativa B · secciones 3 y 2, en ese orden.
//
// ── La prop `proof`: dónde caen las seis cifras ───────────────────────────
//
// Tres valores, y ninguno es una preferencia visual — cada uno responde a qué
// otra parte de la página se hace cargo de la evidencia:
//
//   · `"top"`    — la franja ABRE la sección. Es lo que la página usa hoy: el
//                  hero afirma sin probar nada, así que la evidencia tiene que
//                  ser lo primero que aparece al moverse — antes que las tres
//                  propiedades, que son la explicación y no la prueba.
//   · `"bottom"` — la franja CIERRA la sección, subordinada a las tres
//                  propiedades. Para un hero que ya afirmó pero no probó nada.
//   · `false`    — sin franja. Para un hero que ya trae las seis cifras adentro.
//
// El aire de arriba NO cambia con el valor, y eso es deliberado: la prop dice
// dónde cae la franja, no cuánto respira la sección.
//
// Hubo una versión en que `"top"` recortaba el `pt` a un tercio, y tenía un
// motivo concreto: el hero medía 78svh y la franja tenía que asomar cortada por
// el borde inferior del viewport, así que cada píxel de padding la empujaba
// fuera del asomo. Con el hero a pantalla completa ya no hay nada que asomar y
// ese recorte solo dejaba la sección apretada contra el hero. Si alguna vez
// vuelve un hero más corto que la pantalla, esto vuelve con él.
//
// ── Por qué la franja de prueba baja hasta acá y en este tamaño ───────────
//
// En B las seis cifras son telemetría del objeto y aparecen repartidas en el
// acto, una por beat. Eso deja un agujero: quien no llega al acto no ve
// ninguna. Esta banda lo cubre —las seis, temprano, completas— y a la vez se
// niega a competir: van a cuerpo de nota, bajo las tres propiedades, sin
// figura propia.
//
// Es exactamente el error que el brief de la página viva anotó al revés: su
// primer intento puso la franja a `text-h3` en seis columnas y quedó más fuerte
// que el hero. Acá la jerarquía es hero → propiedades → cifras, y el tamaño lo
// dice.
//
// ── La viñeta es un cubo ──────────────────────────────────────────────────
//
// Cada propiedad lleva el mismo cubo verde con el que está construido el objeto
// del acto. No es un ícono: es una pieza del dibujo, a escala de viñeta. Sirve
// para que las tres propiedades se lean como partes de la máquina que la página
// va a mostrar, y no como tres bullets de marketing.

export type ProofSlot = "top" | "bottom" | false;

const iso = isoAt(16, 20);

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

function CubeBullet() {
  return (
    <IsoFrame viewBox="0 0 32 32" className="size-5 shrink-0">
      <GreenCube iso={iso} s={9} />
    </IsoFrame>
  );
}

export default function ScaleClaim({ proof = "bottom" }: { proof?: ProofSlot }) {
  const ref = useScrollReveal<HTMLDivElement>({ y: 20, stagger: 0.08 });

  return (
    <section className="bg-background text-foreground">
      <Container className="flex flex-col gap-16 py-28 lg:py-36">
        {proof === "top" && <ProofStrip />}
        <div ref={ref} className="flex flex-col gap-12">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-24">
            <h2 data-reveal className="text-h2 text-pretty">
              {AI_SCALE.title.lead}
              <br />
              <Accent>{AI_SCALE.title.accent}</Accent>
            </h2>
            <p
              data-reveal
              className="max-w-[40ch] text-body-lg text-ink-soft text-pretty lg:pt-3"
            >
              {AI_SCALE.body}
            </p>
          </div>

          <ul className="grid gap-8 md:grid-cols-3 md:gap-12">
            {AI_SCALE.points.map((p) => (
              <li key={p.title} data-reveal className="flex gap-4">
                <CubeBullet />
                <div className="flex flex-col gap-2">
                  <h3 className="text-h4">{p.title}</h3>
                  <p className="max-w-[36ch] text-body text-ink-soft text-pretty">{p.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {proof === "bottom" && <ProofStrip />}
      </Container>
    </section>
  );
}
