"use client";

import { Plus } from "lucide-react";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";

const UPDATES = [
  {
    title:
      "Move cross-chain, trade perps, hold RWAs, stay confidential, and access all of DeFi from your own wallet.",
    date: "August 02, 2026",
  },
  {
    title:
      "Move cross-chain, trade perps, hold RWAs, stay confidential, and access all of DeFi from your own wallet.",
    date: "July 24, 2026",
  },
  {
    title:
      "Move cross-chain, trade perps, hold RWAs, stay confidential, and access all of DeFi from your own wallet.",
    date: "June 15, 2026",
  },
];

export default function UpdatesList() {
  const rootRef = useScrollReveal<HTMLUListElement>();

  return (
    <section className="bg-cream text-foreground">
      <Container className="grid gap-12 py-24 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-20">
        <div className="flex flex-col gap-3">
          <Eyebrow className="text-foreground">Whats new at NEAR</Eyebrow>
          <h2 className="text-h2 text-pretty">Latest updates</h2>
        </div>

        <ul ref={rootRef}>
          {UPDATES.map((update, i) => (
            // El separador va como `border-b` de cada fila y no entre filas:
            // así hay línea también debajo de la última, como en la referencia.
            <li key={i} data-reveal className="border-b border-dotted border-border">
              <a
                href="#"
                className="group grid items-center gap-4 py-8 lg:grid-cols-[1fr_auto_auto] lg:gap-10"
              >
                {/* max-w en ch para que quiebre en tres líneas cortas: a ancho
                    completo la fila se lee como un párrafo suelto. */}
                <p className="max-w-[38ch] text-body text-pretty">{update.title}</p>

                {/* Ancho fijo para que las tres fechas queden alineadas entre
                    sí — con `auto` cada una mide distinto y el eje se rompe. */}
                <span className="text-body-sm text-muted-foreground lg:w-40 lg:text-center">
                  {update.date}
                </span>

                {/* Negro SIEMPRE, no solo al hover — pedido. */}
                <span
                  aria-hidden="true"
                  className="flex size-8 shrink-0 items-center justify-center rounded-full border border-foreground text-foreground"
                >
                  <Plus className="size-4" strokeWidth={1.5} />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
