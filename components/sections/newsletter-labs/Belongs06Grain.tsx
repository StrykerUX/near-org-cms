"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { BELONGS_COPY, Wordmark } from "@/components/sections/newsletter-labs/BelongsParts";
import { SlabField } from "@/components/sections/newsletter-labs/NewsletterFields";

// ── 06 · Grain ───────────────────────────────────────────────────────────────
//
// Banda en lima con textura de grano y el claim en tinta. El campo es un bloque
// rectangular con el botón adosado: nada redondeado, nada suave.
//
// Es la única de las ocho que usa el lima de la rampa del CTA como FONDO y no
// como acento. Sobre él, el verde del sistema no se ve, así que todo —claim,
// párrafo, campo— va en tinta: la banda se sostiene con un solo color y su
// negativo.
//
// ── El grano es un SVG inline, no una imagen ────────────────────────────────
//
// `feTurbulence` genera el ruido en el navegador: cero bytes de red, cualquier
// tamaño sin pixelarse, y el mismo grano en retina que en 1×. Va como
// `background-image` con una data URI porque un `<svg>` hermano tendría que
// pintarse por encima y robaría el hit-area del formulario.
//
// La opacidad es la perilla: por encima de 0.18 el grano empieza a ensuciar el
// texto en vez de dar textura al fondo.
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

export default function Belongs06Grain() {
  return (
    <section className="relative overflow-hidden bg-cta-lime py-24 text-ink lg:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-multiply"
        style={{ backgroundImage: GRAIN }}
      />

      <Container className="relative grid grid-cols-1 items-end gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-16">
        <h2 className="flex flex-col items-start text-display text-pretty">
          <Wordmark height="clamp(2.6rem, 1.8rem + 4vw, 5.6rem)" className="mb-1" />
          <Accent display>{BELONGS_COPY.claim}</Accent>
        </h2>

        <div className="flex flex-col gap-5 lg:pb-3">
          <p className="text-body text-ink/75 text-pretty">{BELONGS_COPY.body}</p>
          <SlabField
            placeholder={BELONGS_COPY.placeholder}
            label={BELONGS_COPY.label}
            buttonLabel={BELONGS_COPY.button}
          />
        </div>
      </Container>
    </section>
  );
}
