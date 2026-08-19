"use client";

import Container from "@/components/primitives/Container";
import { BELONGS_COPY, Wordmark } from "@/components/sections/newsletter-labs/BelongsParts";
import { InlineField } from "@/components/sections/newsletter-labs/NewsletterFields";

// ── 04 · Inline ──────────────────────────────────────────────────────────────
//
// El campo vive DENTRO del titular: «near belongs to ▁▁▁». Formulario y frase
// son la misma línea, así que no hay dos cosas que mirar ni un salto entre
// "leer" y "actuar".
//
// Es la idea más arriesgada de las ocho y la más fácil de romper: el campo
// hereda el tamaño del heading, y el heading es fluido. Si en algún ancho el
// campo empuja la línea y la frase se parte por un sitio raro, la variante se
// cae — mirarlo en varios anchos es parte de la prueba.
//
// ── El claim cambia de forma, no de palabras ────────────────────────────────
//
// La copy es la misma ("belongs to you.") con el "you." sustituido por el campo:
// el lector escribe literalmente a quién pertenece. Es un juego que solo
// funciona con ESTA frase, y por eso vale la pena probarlo acá.
//
// ── Pierde el brillo ────────────────────────────────────────────────────────
//
// Igual que la 02: el `ShineField` necesita su overlay de glifos, y un input
// dentro de un heading no puede llevarlo.
export default function Belongs04Inline() {
  return (
    <section className="bg-stone py-24 text-ink lg:py-32">
      <Container className="flex flex-col items-center gap-8 text-center">
        {/* `flex-wrap` con `items-baseline`: el campo se sienta sobre la misma
            línea de base que las palabras, y si no cabe baja entero en vez de
            partir la frase por la mitad. */}
        <h2 className="flex flex-wrap items-baseline justify-center gap-x-1 text-h1 text-pretty">
          <Wordmark height="clamp(1.8rem, 1.4rem + 2vw, 3rem)" className="mr-2 self-end" />
          <span>belongs to</span>
          <InlineField
            placeholder={BELONGS_COPY.placeholder}
            label={BELONGS_COPY.label}
            buttonLabel={BELONGS_COPY.button}
          />
        </h2>

        <p className="max-w-[46ch] text-body-lg text-ink/70 text-pretty">{BELONGS_COPY.body}</p>
      </Container>
    </section>
  );
}
