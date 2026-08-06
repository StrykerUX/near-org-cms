"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import ZigguratDivider from "@/components/primitives/ZigguratDivider";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";

export default function ClosingCta() {
  const rootRef = useScrollReveal<HTMLDivElement>();

  return (
    <section className="bg-stone text-foreground">
      {/* La de abajo va `invert` para que espeje a la de arriba: sin eso las
          dos bajan hacia el centro y la banda de stone se lee inclinada en vez
          de simétrica. */}
      <ZigguratDivider from="var(--cream)" to="var(--stone)" />

      <Container className="py-24 text-center md:py-32">
        <div ref={rootRef} className="mx-auto flex max-w-2xl flex-col items-center gap-6">
          {/* Misma escala que el heading de FeatureCards. `<Accent>` sin
              `display` a propósito: el optical master de Kepler es para
              display/h1, y a escala h2 el master de texto es el correcto. */}
          <h2 data-reveal className="text-h2 text-pretty">
            NEAR
            <br />
            <Accent>belongs to you.</Accent>
          </h2>

          <p data-reveal className="max-w-lg text-body-lg text-pretty">
            Get the latest product launches, protocol milestones, and ecosystem
            updates straight to your inbox.
          </p>

          {/* Draft sin backend: el submit se cancela a mano. Sin esto el form
              sin `action` recarga la página. */}
          <form
            data-reveal
            onSubmit={(e) => e.preventDefault()}
            className="mt-4 flex w-full max-w-sm items-center gap-2 rounded-full bg-white p-1.5 pl-6"
          >
            <input
              type="email"
              placeholder="email address"
              aria-label="Email address"
              className="min-w-0 flex-1 bg-transparent text-body-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            {/* near-green-dark y no near-green: el verde puro con texto blanco
                queda en ~1.5:1 de contraste. */}
            <button
              type="submit"
              className="shrink-0 rounded-full bg-near-green-dark px-5 py-2 text-body-sm text-white transition-opacity hover:opacity-90"
            >
              sign up
            </button>
          </form>
        </div>
      </Container>

      <ZigguratDivider from="var(--stone)" to="var(--background)" invert />
    </section>
  );
}
