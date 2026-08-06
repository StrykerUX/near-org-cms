"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import ShineField from "@/components/primitives/ShineField";
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

          <div data-reveal className="mt-4 flex w-full justify-center">
            <ShineField
              label="Email address"
              placeholder="email address"
              buttonLabel="sign up"
            />
          </div>
        </div>
      </Container>

      <ZigguratDivider from="var(--stone)" to="var(--background)" invert />
    </section>
  );
}
