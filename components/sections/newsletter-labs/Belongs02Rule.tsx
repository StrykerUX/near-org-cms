"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { BELONGS_COPY, Wordmark } from "@/components/sections/newsletter-labs/BelongsParts";
import { RuleField } from "@/components/sections/newsletter-labs/NewsletterFields";

// ── 02 · Rule ────────────────────────────────────────────────────────────────
//
// Composición editorial alineada a la izquierda y el campo convertido en una
// LÍNEA: se escribe sobre una regla, como en un formulario de papel.
//
// Es la que más se aleja del gesto actual. La píldora centrada dice "widget";
// la línea dice "documento", y esta sección es, al final, una página que pide un
// dato.
//
// ── Pierde el brillo, y hay que contarlo ────────────────────────────────────
//
// El `ShineField` de producción necesita su estructura de píldora con overlay de
// glifos para que el shader tenga qué mascarar. Una línea de escritura no la
// tiene, así que esta variante **no lleva el glyph-shine**. Es una pérdida real:
// el brillo es de lo poco que hoy hace memorable a esta banda.
//
// ── El claim y el campo comparten el ancho ──────────────────────────────────
//
// Los dos a 52rem: la regla del campo termina exactamente donde termina el
// bloque de texto, y esa coincidencia es lo que hace que la composición se
// sostenga sin ninguna caja.
export default function Belongs02Rule() {
  return (
    <section className="bg-stone py-24 text-ink lg:py-32">
      <Container className="flex flex-col gap-12">
        <div className="flex max-w-[52rem] flex-col gap-6">
          <h2 className="flex flex-col items-start text-h1 text-pretty">
            <Wordmark height="clamp(2rem, 1.5rem + 2.4vw, 3.4rem)" className="mb-1" />
            <Accent>{BELONGS_COPY.claim}</Accent>
          </h2>
          <p className="max-w-[48ch] text-body-lg text-ink/70 text-pretty">{BELONGS_COPY.body}</p>
        </div>

        <div className="max-w-[52rem]">
          <RuleField
            placeholder={BELONGS_COPY.placeholder}
            label={BELONGS_COPY.label}
            buttonLabel={BELONGS_COPY.button}
          />
        </div>
      </Container>
    </section>
  );
}
