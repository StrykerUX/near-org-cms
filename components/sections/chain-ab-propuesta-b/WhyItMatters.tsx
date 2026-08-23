"use client";

import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { WHY_IT_MATTERS } from "@/components/sections/chain-abstraction-proposals/content";

// Misma estructura de 3 columnas (regla fina arriba, título, cuerpo,
// escalera vertical por columna) — sin ícono esta vez, pedido explícito.
// Mismo copy de siempre (`WHY_IT_MATTERS`), ningún dato nuevo.
const STEP = ["lg:mt-0", "lg:mt-14", "lg:mt-28"] as const;

export default function WhyItMatters() {
  const rootRef = useScrollReveal<HTMLElement>({ start: "top 90%" });

  return (
    <section ref={rootRef} className="bg-cream py-20 lg:py-28">
      <Container className="flex flex-col gap-14">
        <Eyebrow>Why it matters</Eyebrow>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {WHY_IT_MATTERS.map((item, i) => (
            <div key={item.title} data-reveal className={`flex flex-col gap-5 ${STEP[i]}`}>
              <div className="h-px w-full bg-rule" aria-hidden="true" />
              <h3 className="text-h3 text-pretty">{item.title}</h3>
              <p className="text-body text-foreground/75 text-pretty">{item.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
