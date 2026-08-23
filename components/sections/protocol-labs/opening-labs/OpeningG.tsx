"use client";

import Container from "@/components/primitives/Container";
import { useCountUp } from "@/components/sections/protocol-labs/countUp";
import GlyphField from "@/components/sections/protocol-labs/opening-labs/GlyphField";
import { ScaleSection } from "@/components/sections/protocol-labs/opening-labs/ScaleSection";
import { PROOF } from "@/components/sections/protocol-labs/protocolContent";
import HeroFieldLight from "@/components/sections/protocol-labs/opening-labs/HeroFieldLight";

// G · Field claro — la superficie de E, sobre crema.
//
// ── Qué prueba, que no es lo mismo que E ──────────────────────────────────
//
// E responde "¿y si la superficie es texto?". G responde una pregunta distinta y
// más incómoda: **¿hace falta que la página abra en oscuro?**
//
// Las seis aperturas anteriores abren en negro —cinco de seis— y todas heredan el
// mismo costo: el acto central ya era el único bloque oscuro largo de la página,
// y una apertura oscura le come el rango. G no tiene ese problema. Y hay un
// segundo argumento, más de fondo: el crema es el color de esta marca. Una página
// de protocolo que abre en el color del sitio y no en el negro genérico de la
// categoría dice algo que ninguna de las otras cinco puede decir.
//
// ── El tono no es un cambio de color ──────────────────────────────────────
//
// Sobre negro el ojo suma luz y un alfa de 6% ya se ve; sobre crema resta, y esa
// misma tinta se lee más marcada. El campo en claro arranca de una base más baja,
// su pico llega menos lejos, y usa DOS colores donde el oscuro usa uno —gris de
// tinta para lo apagado y `--green-ink` para el frente de la onda— porque el
// verde de la marca no llega a 3:1 sobre crema. Todo eso está en `GlyphField`.
//
// ── Lo que se arriesga ─────────────────────────────────────────────────────
//
// Volver al problema original. La queja que abrió esta ronda fue que el hero se
// veía plano, y el crema es justamente el fondo que se veía plano. La diferencia
// tiene que venir entera del campo: si a este tono no pesa lo suficiente, G es el
// hero de antes con textura encima.
//
// Es la pregunta que esta alternativa existe para contestar, y sólo se contesta
// mirándola al lado de la versión oscura.

export default function OpeningG() {
  const numbers = useCountUp<HTMLDListElement>({ stagger: 0.07 });

  return (
    <>
      <HeroFieldLight />

      {/* ── Números ───────────────────────────────────────────────────────── */}
      {/* Mismo crema y el campo más apagado. El borde superior marca el corte:
          sin él, dos secciones del mismo color pierden su frontera — que es lo
          que hace un degradé de transición, sólo que sin degradé. */}
      <section className="relative isolate overflow-hidden border-t border-ink/20 bg-cream text-foreground">
        <GlyphField tone="light" className="absolute inset-0 z-0 h-full w-full opacity-40" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 bg-[color-mix(in_srgb,var(--cream)_72%,transparent)]"
        />

        <Container className="relative z-20 py-20 lg:py-24">
          <dl
            ref={numbers}
            className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-6"
          >
            {PROOF.map((stat) => (
              <div key={stat.id} className="flex flex-col gap-2 border-t border-ink pt-4">
                {/* En mono y en `--green-ink`, igual que E lo hace en menta sobre
                    negro: es el momento en que el texto del fondo se vuelve texto
                    de verdad, y el registro tipográfico es lo que lo dice. */}
                <dd data-count={stat.value} className="text-h4-mono tabular-nums text-green-ink">
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

      {/* Blanco, no crema: es el tercer color del trío y el único corte de valor
          real que tiene esta alternativa. En crema las tres secciones serían una
          sola superficie continua de punta a punta. */}
      <ScaleSection />
    </>
  );
}
