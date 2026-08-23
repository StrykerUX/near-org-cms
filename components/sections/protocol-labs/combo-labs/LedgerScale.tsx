"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { useCountUp } from "@/components/sections/protocol-labs/countUp";
import { AI_SCALE, PROOF } from "@/components/sections/protocol-labs/protocolContent";

// COMBO H4 · Ledger — las cifras y las propiedades son EL MISMO documento.
//
// ── La tesis ────────────────────────────────────────────────────────────────
//
// La versión que hoy vive en la página pone las seis cifras en una franja
// horizontal de seis columnas y, abajo, tres propiedades con viñeta. Se leen
// como dos cosas distintas: un marcador y tres bullets.
//
// Acá son NUEVE FILAS de un solo registro, numeradas 01 a 09 sin interrupción.
// Las seis primeras traen un número; las tres últimas, una propiedad. El lector
// no cruza de una sección a otra: sigue bajando por la misma columna de índices,
// y la evidencia y la explicación quedan cosidas por la numeración.
//
// Es la lectura opuesta a la franja: vertical en vez de horizontal, documental
// en vez de titular. Va con el hero H4 —que afirma y no prueba— porque después
// de una pantalla de afirmación lo que hace falta es un documento, no otro
// cartel.
//
// ── Por qué la fila y no la columna ────────────────────────────────────────
//
// Seis cifras en seis columnas se leen de un vistazo y se olvidan de un vistazo:
// ninguna tiene lugar para su unidad, su contexto ni su nota. En fila, cada una
// tiene el ancho entero del contenedor y puede llevar su label a la izquierda,
// su valor a la derecha y su nota debajo sin apretarse.
//
// El precio es el alto: nueve filas ocupan casi dos pantallas. Se acepta porque
// esta página tiene una sola oportunidad de mostrar la evidencia completa, y
// porque el bloque que sigue —el acto— es visualmente lo contrario, así que el
// contraste juega a favor.
//
// ── El valor va alineado a la derecha, y eso hace el trabajo ───────────────
//
// Los seis valores forman una columna óptica contra el borde derecho. Es lo que
// convierte nueve filas sueltas en una tabla sin dibujar una sola línea
// vertical: el ojo ve la columna porque los valores terminan en el mismo sitio.
//
// `tabular-nums` es obligatorio acá. Con cifras proporcionales cada valor cae en
// un sitio distinto mientras el contador corre, y la columna que sostiene todo
// se deshace justo durante la animación.

// Los tres puntos de "Built for AI scale" continúan la numeración de las seis
// cifras: 07, 08, 09. No es decoración — es lo único que dice que son el mismo
// documento y no dos secciones pegadas.
const POINT_OFFSET = PROOF.length;

export default function LedgerScale() {
  const numbers = useCountUp<HTMLDListElement>({ stagger: 0.09, start: "top 85%" });
  const points = useScrollReveal<HTMLDivElement>({ y: 18, stagger: 0.1 });

  return (
    <>
      {/* ── Las seis cifras, como registro ─────────────────────────────────── */}
      <section className="bg-background text-foreground">
        <Container className="flex flex-col gap-12 py-24 lg:py-28">
          <p className="uppercase text-eyebrow-mono text-gray-intermediate">
            La evidencia
          </p>

          {/* `border-t` en el contenedor y en cada fila: la primera regla agrupa,
              las demás separan. Una fila con borde completo sería una card, y
              nueve cards no son un registro. */}
          <dl ref={numbers} className="flex flex-col border-t border-ink">
            {PROOF.map((stat, i) => (
              <div
                key={stat.id}
                className="grid grid-cols-[auto_1fr_auto] items-baseline gap-x-5 gap-y-2 border-b border-rule py-6 sm:gap-x-10"
              >
                <span className="uppercase text-micro-mono text-gray-intermediate">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex min-w-0 flex-col gap-1">
                  <dt className="text-h4">{stat.label}</dt>
                  {stat.note && (
                    <dd className="text-body-sm text-gray-intermediate text-pretty">
                      {stat.note}
                    </dd>
                  )}
                </div>
                {/* El valor cierra la fila contra el borde derecho: es la columna
                    óptica que convierte nueve filas en una tabla. */}
                <dd
                  data-count={stat.value}
                  className="justify-self-end text-h2 tabular-nums text-pretty"
                >
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* ── Built for AI scale, filas 07 a 09 del mismo registro ───────────── */}
      <section className="bg-cream text-foreground">
        <Container className="flex flex-col gap-12 py-24 lg:py-28">
          <div className="grid-ds gap-y-6">
            <h2 className="col-span-full text-h2 text-pretty lg:col-span-5">
              {AI_SCALE.title.lead}
              <br />
              <Accent>{AI_SCALE.title.accent}</Accent>
            </h2>
            <p className="col-span-full max-w-[42ch] text-body-lg text-ink-soft text-pretty lg:col-start-7 lg:col-span-6 lg:pt-2">
              {AI_SCALE.body}
            </p>
          </div>

          <div ref={points} className="flex flex-col border-t border-ink">
            {AI_SCALE.points.map((p, i) => (
              <div
                key={p.title}
                data-reveal
                className="grid grid-cols-[auto_1fr] items-baseline gap-x-5 gap-y-3 border-b border-rule py-7 sm:gap-x-10 lg:grid-cols-[auto_minmax(0,22ch)_1fr]"
              >
                <span className="uppercase text-micro-mono text-gray-intermediate">
                  {String(POINT_OFFSET + i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-h4 text-pretty">{p.title}</h3>
                {/* En desktop el cuerpo toma su propia columna, así los tres
                    títulos quedan alineados entre sí igual que los seis labels de
                    arriba. En móvil cae debajo, ocupando las dos columnas. */}
                <p className="col-start-2 max-w-[52ch] text-body text-ink-soft text-pretty lg:col-start-3">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
