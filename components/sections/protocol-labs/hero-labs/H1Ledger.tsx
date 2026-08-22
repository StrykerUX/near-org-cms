import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import CtaPill from "@/components/sections/quantum/CtaPill";
import ColumnRule from "@/components/sections/protocol-labs/a/ColumnRule";
import { HERO, PROOF } from "@/components/sections/protocol-labs/protocolContent";

// H1 · Ledger — prueba DENTRO, sin movimiento.
//
// ── La tesis ────────────────────────────────────────────────────────────────
//
// Las seis cifras en COLUMNA y no en fila: un registro, no un marcador. Una fila
// de seis números se lee como el panel de un estadio —todo a la vez, nada en
// particular—; una columna se lee de arriba abajo, cada asiento con su regla, y
// eso es lo que hace un libro contable. El contenido lo pide: son cinco años de
// operación, no un récord.
//
// ── Por qué NO se mueve, y es la decisión principal ────────────────────────
//
// Es el único hero del sitio sin una sola animación: ni entrada, ni sheen, ni
// campo. La razón no es de rendimiento — es que la abstinencia significa algo
// acá. Todo protocolo nuevo se presenta moviéndose; el que lleva cinco años
// corriendo puede permitirse estar quieto, y esa quietud es un argumento que
// ninguna otra variante puede hacer.
//
// El riesgo, dicho de frente: sin movimiento la primera pantalla depende
// enteramente de la composición y del contraste tipográfico. Si el bloque se ve
// flojo, no hay nada que lo rescate. Es exactamente lo que hay que juzgar.
//
// Server component, sin `"use client"` — que es la consecuencia técnica de lo
// anterior y la prueba de que la decisión es real.
export default function H1Ledger() {
  return (
    <section className="relative isolate flex min-h-svh flex-col bg-cream pt-[var(--site-header-block)] text-foreground">
      <ColumnRule />

      <Container className="relative z-10 grid-ds flex-1 items-center gap-y-16 py-20">
        <div className="col-span-full flex flex-col gap-8 lg:col-span-6">
          <p className="uppercase text-eyebrow-mono text-gray-intermediate">{HERO.eyebrow}</p>
          <h1 className="text-h1 text-balance">
            {HERO.lead}
            <br />
            <Accent display>{HERO.accent}</Accent>
          </h1>
          <p className="max-w-[34ch] text-body-lg text-ink-soft text-pretty">{HERO.body}</p>
          <CtaPill href={HERO.cta.href} tone="filled" external>
            {HERO.cta.label}
          </CtaPill>
        </div>

        {/* El registro. Cada asiento es una fila de tres campos con la unidad
            arriba y el valor alineado a la derecha, que es como se lee una
            tabla de cifras: los dígitos se comparan por su columna, no por su
            comienzo. */}
        <dl className="col-span-full lg:col-start-8 lg:col-span-5">
          {PROOF.map((stat) => (
            <div
              key={stat.id}
              className="flex items-baseline justify-between gap-6 border-t border-rule py-4 last:border-b"
            >
              <div className="flex flex-col gap-0.5">
                <dt className="uppercase text-caption-mono">{stat.label}</dt>
                {stat.note && (
                  <dd className="text-micro-mono text-gray-intermediate">{stat.note}</dd>
                )}
              </div>
              {/* Serif itálica para el valor, igual que en `ProofDatum` de la
                  homepage: es el registro tipográfico con el que este sitio dice
                  "cifra". */}
              <dd className="text-h3-serif italic tabular-nums">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
