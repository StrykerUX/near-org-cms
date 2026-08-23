"use client";

import Container from "@/components/primitives/Container";
import { useCountUp } from "@/components/sections/protocol-labs/countUp";
import { PROOF } from "@/components/sections/protocol-labs/protocolContent";

// Sección 2 — las seis cifras.
//
// ── De dónde sale ─────────────────────────────────────────────────────────
//
// Estaba dentro del hero, asomando cortada por el borde inferior de la pantalla:
// el hero medía `100svh + 7.5rem` y las cifras entraban a opacidad baja,
// subiendo de a una al scrollear. Salió a sección propia sin cambiar el layout —
// misma retícula de seis, mismo cuerpo, mismos rótulos.
//
// Lo que se fue con el asomo es el revelado escalonado de opacidad. Existía
// porque las cifras estaban CORTADAS: empezar al 26% era lo que las convertía en
// un anuncio en vez de en una fila a medio tapar. Como sección entera no hay
// nada que anunciar, y una fila de datos que arranca atenuada sin motivo es
// ruido. El contador se queda, que es lo que pone el movimiento sobre el
// argumento y no sobre la decoración.
//
// ── Sin adornos ───────────────────────────────────────────────────────────
//
// Ni regla superior, ni separadores verticales, ni viñetas. Lo que agrupa a las
// seis es la retícula y el aire alrededor, y nada más. Una regla arriba las
// convertiría en una tabla, y una tabla le sube el rango a un bloque que la
// página quiere que se lea rápido y siga.
//
// ── El fondo es el mismo que el de la sección siguiente ───────────────────
//
// A propósito: la evidencia y su explicación —«Built for AI scale»— se leen como
// un solo movimiento, primero el dato y después qué lo sostiene. Separarlas con
// un cambio de valor las convertiría en dos temas, que es justo lo que no son.
//
// El corte que sí importa es el de arriba, contra el hero: ahí el cambio de la
// superficie al papel limpio lo marca solo.
//
// Y ese papel es CREMA y no blanco, como el resto de las secciones claras de la
// página. El blanco puro se usaba acá y en dos secciones más, y era el único
// valor que no salía del sistema: `--cream` es el papel de este sitio y
// `--background` existe para el admin y para los pocos sitios que necesitan un
// blanco de verdad.
export default function ProofRow() {
  const countRef = useCountUp<HTMLDListElement>({ start: "top 82%" });

  return (
    // Sólo padding vertical, que es lo que impide que la fila choque con el hero
    // arriba y con la sección siguiente abajo. Sin `min-h`: la sección mide lo
    // que mide su contenido.
    <section className="bg-cream text-foreground">
      <Container className="py-20 lg:py-24">
        <dl
          ref={countRef}
          className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6"
        >
          {PROOF.map((stat) => (
            <div key={stat.id} className="flex flex-col gap-1">
              {/* El valor de partida es el FINAL, escrito en el HTML: sin JS o
                  con reduced-motion la cifra ya está bien. El contador lo pisa en
                  el primer frame si va a correr. */}
              <dd data-count={stat.value} className="text-h2 tabular-nums">
                {stat.value}
              </dd>
              <dt className="uppercase text-micro-mono text-gray-intermediate">{stat.label}</dt>
              {stat.note && (
                <dd className="text-micro-mono text-gray-intermediate">{stat.note}</dd>
              )}
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
