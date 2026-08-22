"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { GreenCube, IsoFrame, isoAt } from "@/components/sections/protocol-labs/isoKit";
import { AI_SCALE, PROOF } from "@/components/sections/protocol-labs/protocolContent";

// Alternativa B · secciones 3 y 2, en ese orden.
//
// ── La prop `proof` ────────────────────────────────────────────────────────
//
// Enciende o apaga la banda de seis cifras. Existe por la alternativa D, que
// monta esta sección detrás del hero de A — y ese hero YA presenta las seis
// fundidas con el titular. Con la banda encendida, las mismas seis cifras
// aparecerían dos pantallas seguidas y una tercera vez como telemetría del acto:
// a la tercera dejan de leerse como prueba y pasan a leerse como relleno.
//
// El default es `true` porque en B la banda es la ÚNICA aparición completa de
// las seis antes del acto — apagarla ahí dejaría a quien no llega al acto sin
// ver ninguna. O sea: la prop no es una preferencia visual, es qué otra sección
// de la página se hace cargo de las cifras.
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

const iso = isoAt(16, 20);

function CubeBullet() {
  return (
    <IsoFrame viewBox="0 0 32 32" className="size-5 shrink-0">
      <GreenCube iso={iso} s={9} />
    </IsoFrame>
  );
}

export default function ScaleClaim({ proof = true }: { proof?: boolean }) {
  const ref = useScrollReveal<HTMLDivElement>({ y: 20, stagger: 0.08 });

  return (
    <section className="bg-background text-foreground">
      <Container className="flex flex-col gap-16 py-28 lg:py-36">
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

        {/* La banda de prueba. Una sola regla arriba y nada más: seis reglas
            —una por cifra— la convertirían en una tabla, y una tabla acá vuelve
            a subirle el rango que esta sección le está bajando a propósito. */}
        {proof && (
          <dl className="grid grid-cols-2 gap-x-8 gap-y-6 border-t border-rule pt-6 sm:grid-cols-3 lg:grid-cols-6">
            {PROOF.map((stat) => (
              <div key={stat.id} className="flex flex-col gap-1">
                <dd className="text-h4">{stat.value}</dd>
                <dt className="uppercase text-micro-mono text-gray-intermediate">{stat.label}</dt>
                {stat.note && (
                  <dd className="text-micro-mono text-gray-intermediate">{stat.note}</dd>
                )}
              </div>
            ))}
          </dl>
        )}
      </Container>
    </section>
  );
}
