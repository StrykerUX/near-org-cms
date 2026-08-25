"use client";

import Container from "@/components/primitives/Container";
import { Counter } from "@/components/sections/closing-labs/shared";
import NightHeader from "@/components/sections/closing-labs/night/NightHeader";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import {
  LEDGER_NOTES,
  LEDGER_ROWS,
} from "@/components/sections/homepage-tuck/proofLedgerContent";

// Las seis pruebas sobre negro.
//
// ── El fondo hace la mitad del trabajo y por eso las cards casi no existen ───
//
// Sobre crema, una card necesita un borde o una sombra para separarse del
// papel. Sobre negro alcanza con subir el fondo tres puntos: `bg-cream/[0.03]`
// es un gris apenas más claro que el fondo, y con un borde de 1px al 10% la
// card ya está. Nada de sombras — una sombra sobre negro es un halo, y un halo
// es exactamente lo que la referencia no tiene.
//
// La consecuencia es que esta dirección puede permitirse SEIS cards seguidas
// sin que la sección se vuelva un tablero pesado: cada una pesa muy poco. Es lo
// contrario de `card/`, donde el blanco sobre gris obliga a variar los anchos
// para que la grilla no se vuelva un damero.
//
// ── El contador es lo único que se mueve, y llega escalonado ────────────────
//
// Cuatro cifras subiendo a la vez son cuatro ruidos simultáneos. Cada `Counter`
// tiene su propio trigger contra su propia card, así que a la altura a la que
// entran —cuatro cards en una fila— arrancan casi juntas pero no exactamente, y
// eso alcanza: el `stagger` del reveal las separa lo suficiente como para que
// se lean como cuatro cuentas y no como una animación de fondo.
export default function NightNumbers() {
  const rootRef = useScrollReveal<HTMLDivElement>();

  return (
    <section className="bg-ink py-28 text-cream lg:py-40">
      <Container className="flex flex-col gap-16">
        <NightHeader
          eyebrow="Statistics"
          lead="Five years on mainnet,"
          tail="measured every block."
        />

        <div ref={rootRef} className="flex flex-col gap-4">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LEDGER_ROWS.map((row) => (
              <li
                key={row.id}
                data-reveal
                className="flex min-h-[clamp(14rem,26vh,19rem)] flex-col justify-between gap-8 rounded-[24px] border border-cream/10 bg-cream/[0.03] p-6"
              >
                <p className="text-caption-mono uppercase text-cream/45">{row.eyebrow}</p>

                <div className="flex flex-col gap-3">
                  <p className="text-h1 flex items-baseline">
                    <Counter row={row} />
                    <span>{row.unit}</span>
                  </p>
                  <p className="text-h3-serif italic text-cream/70">{row.gloss}</p>
                  <p className="text-caption text-cream/50 text-pretty">{row.body}</p>
                </div>
              </li>
            ))}
          </ul>

          <ul className="grid gap-4 sm:grid-cols-2">
            {LEDGER_NOTES.map((note) => (
              <li
                key={note.id}
                data-reveal
                className="flex flex-col gap-4 rounded-[24px] border border-cream/10 bg-cream/[0.03] p-6"
              >
                <p className="text-caption-mono uppercase text-cream/45">{note.eyebrow}</p>
                <p className="text-h3-serif italic">{note.gloss}</p>
                <p className="text-caption max-w-[52ch] text-cream/50 text-pretty">
                  {note.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
