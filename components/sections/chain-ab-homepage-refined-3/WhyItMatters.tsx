"use client";

import Image from "next/image";
import Container from "@/components/primitives/Container";
import BentoGrid, { BentoCard } from "@/components/primitives/BentoGrid";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { WHY_IT_MATTERS } from "@/components/sections/chain-abstraction-proposals/content";

// Tercer estilo para esta sección (ni las filas en escalera de la primera
// copia, ni las 3 columnas de la segunda): bento asimétrico, reusando
// `BentoGrid`/`BentoCard` — el primitivo ya existente para justo este
// patrón ("una card ancha + una cuadrada + una barra de ancho completo",
// documentado en su propio archivo). Mismo copy e íconos de siempre
// (`WHY_IT_MATTERS`, `icon-*.webp`), ningún dato nuevo — solo la
// composición cambia.
const ICONS = [
  "/prototype/homepage-update/icon-data.webp",
  "/prototype/homepage-update/icon-assets.webp",
  "/prototype/homepage-update/icon-intelligence.webp",
] as const;

// "wide" (2 columnas) + "tall" (1 columna, incógnita: comparte el mismo
// `row-span-2` que "wide", así que las dos quedan a la MISMA altura) llenan
// las 3 columnas de la primera fila sin hueco ni descalce — "square" habría
// dejado a la wide más alta que su vecina (2 filas contra 1), con un bloque
// de aire de más debajo de la chica. "full" es la barra de abajo.
const SPANS = ["wide", "tall", "full"] as const;

export default function WhyItMatters() {
  const rootRef = useScrollReveal<HTMLElement>();

  return (
    <section ref={rootRef} className="bg-cream py-20 lg:py-28">
      <Container>
        <BentoGrid>
          {WHY_IT_MATTERS.map((item, i) => (
            <BentoCard key={item.title} span={SPANS[i]} tone="tint" data-reveal>
              {SPANS[i] === "full" ? (
                // La barra de abajo es ancha y baja — icono a la izquierda,
                // texto a la derecha aprovecha esa forma en vez de apilar
                // como las dos de arriba (altas, angostas).
                <div className="flex items-center gap-6">
                  <Image
                    src={ICONS[i]}
                    alt=""
                    width={56}
                    height={59}
                    sizes="56px"
                    className="h-14 w-14 flex-none object-contain"
                  />
                  <div className="flex flex-col gap-1">
                    <h3 className="text-h3-serif italic text-pretty">{item.title}</h3>
                    <p className="text-body text-foreground/75 text-pretty">{item.body}</p>
                  </div>
                </div>
              ) : (
                <>
                  <Image
                    src={ICONS[i]}
                    alt=""
                    width={56}
                    height={59}
                    sizes="56px"
                    className="h-14 w-14 object-contain"
                  />
                  <div className="flex flex-col gap-3">
                    <h3 className="text-h3-serif italic text-pretty">{item.title}</h3>
                    <p className="text-body text-foreground/75 text-pretty">{item.body}</p>
                  </div>
                </>
              )}
            </BentoCard>
          ))}
        </BentoGrid>
      </Container>
    </section>
  );
}
