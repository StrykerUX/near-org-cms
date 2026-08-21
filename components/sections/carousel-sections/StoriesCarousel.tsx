"use client";

import Image from "next/image";
import Accent from "@/components/primitives/Accent";
import { useLoopCarousel, buildLoopCells } from "./useLoopCarousel";
import { CUSTOMER_STORIES } from "./carouselSectionsContent";

const N = CUSTOMER_STORIES.length;
const cells = buildLoopCells(CUSTOMER_STORIES);

// .cs-card__logo del prototipo es un badge cuadrado con iniciales de 2
// letras — no acomoda un logotipo rectangular real (111x24 a 133x27) sin
// deformarlo o recortarlo. Se muestra el logo real a su proporción natural,
// alto fijo, sin el chip de fondo cuadrado (desviación respecto al layout
// exacto del prototipo, marcada en el reporte).
export default function StoriesCarousel() {
  const { containerRef, trackRef, index, goTo, rootProps } = useLoopCarousel<HTMLDivElement>(N);

  return (
    <section
      className="overflow-hidden bg-cream py-[clamp(40px,7vh,96px)] text-foreground"
      aria-roledescription="carousel"
      aria-label="What the world is building on NEAR"
    >
      <h2 className="mb-[clamp(30px,6vh,74px)] px-[clamp(24px,5vw,105px)] text-pretty text-h2">
        What the world is
        <br />
        <Accent>building on NEAR</Accent>
      </h2>

      <div
        ref={containerRef}
        {...rootProps}
        aria-label="Customer stories. Usa las flechas para navegar."
        className="relative w-full cursor-grab touch-pan-y select-none overflow-hidden py-[clamp(8px,1.4vh,18px)] outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
      >
        <div ref={trackRef} className="flex items-stretch gap-[20px]">
          {cells.map(({ item, key, logical, hidden }) => {
            const delta = ((logical - index) % N + N) % N;
            const distance = Math.min(delta, N - delta);
            const eager = !hidden && distance <= 1;
            // La celda NUNCA cambia de tamaño (grilla uniforme, motor sin tocar) —
            // la card de adentro sí, y se pega al borde INTERNO de su celda: la
            // vecina que va DESPUÉS de la activa (delta chico, físicamente a la
            // derecha) se pega a la izquierda de su celda, mirando hacia la
            // activa; la que va ANTES se pega a la derecha. El hueco vacío queda
            // del lado externo, hacia el borde de pantalla, donde no se ve.
            const isAfterActive = delta !== 0 && delta <= N / 2;

            return (
              <div
                key={key}
                data-cell
                data-logical={logical}
                data-active={logical === 0}
                aria-hidden={hidden || undefined}
                className={`group flex min-h-0 flex-[0_0_min(84vw,460px)] items-end lg:min-h-[clamp(260px,30vw,495px)] lg:flex-[0_0_clamp(300px,62vw,1010px)] ${isAfterActive ? "lg:justify-start" : "lg:justify-end"}`}
              >
                <article className="grid h-full w-full grid-cols-1 overflow-hidden rounded-[18px] bg-ink-soft text-cream transition-[width,height,opacity] duration-[550ms] ease-[cubic-bezier(.22,.61,.36,1)] motion-reduce:h-full! motion-reduce:w-full! motion-reduce:opacity-100! motion-reduce:transition-none! group-data-[active=false]:opacity-60 lg:grid-cols-[1fr_.78fr] lg:group-data-[active=false]:h-[62%] lg:group-data-[active=false]:w-[62%] lg:group-data-[active=false]:opacity-[.55] lg:group-data-[active=true]:opacity-100">
                  <div className="flex flex-col p-[clamp(20px,2.4vw,44px)]">
                    <Image
                      src={item.logo.src}
                      alt={item.company}
                      width={item.logo.width}
                      height={item.logo.height}
                      draggable={false}
                      className="mb-auto h-[clamp(12px,1.2vw,22px)] w-auto self-start brightness-0 invert"
                    />

                    <p className="mb-[clamp(8px,1.4vh,18px)] mt-[clamp(18px,3vh,40px)] text-eyebrow uppercase text-cream/82">
                      Customers stories
                    </p>
                    {/* ds-exempt: 22px/38px pedidos exactos por el usuario, no hay token de la escala en ese par de tamaños */}
                    <h3 className="max-w-[18ch] text-pretty font-medium leading-[1.15] tracking-[-0.005em] text-[22px] transition-[font-size] duration-[550ms] ease-[cubic-bezier(.22,.61,.36,1)] motion-reduce:transition-none group-data-[active=true]:text-[38px]">
                      {item.title}
                    </h3>

                    <div className="mt-[clamp(20px,3.4vh,44px)]">
                      <a
                        href={item.href}
                        className="inline-flex items-center rounded-full bg-[linear-gradient(100deg,#C4EE6E_0%,#4ECB59_100%)] px-[1.3em] py-[.66em] text-label text-ink transition-[filter,translate] duration-[250ms] ease-[cubic-bezier(.22,.61,.36,1)] hover:-translate-y-px hover:brightness-105"
                      >
                        Read the full story
                      </a>
                    </div>
                  </div>

                  <div className="relative order-first aspect-[16/10] lg:order-none lg:aspect-auto">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      loading={eager ? "eager" : "lazy"}
                      draggable={false}
                      className="object-cover"
                    />
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>

      <div
        role="tablist"
        aria-label="Elegir historia"
        className="mt-[clamp(26px,4.5vh,58px)] flex flex-wrap items-center justify-center gap-[clamp(20px,4vw,80px)] px-[clamp(24px,5vw,105px)]"
      >
        {CUSTOMER_STORIES.map((story, i) => (
          <button
            key={story.company}
            type="button"
            role="tab"
            aria-selected={i === index}
            data-active={i === index}
            onClick={() => goTo(i)}
            className="relative px-[2px] pb-[12px] pt-[6px] opacity-[.28] transition-opacity duration-[400ms] ease-[cubic-bezier(.22,.61,.36,1)] hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink data-[active=true]:opacity-100"
          >
            <Image
              src={story.logo.src}
              alt={story.company}
              width={story.logo.width}
              height={story.logo.height}
              draggable={false}
              className="h-[1.2em] w-auto brightness-0"
            />
            <span
              data-active={i === index}
              className="absolute bottom-[2px] left-0 h-[1.5px] w-full origin-left scale-x-0 bg-ink data-[active=true]:scale-x-100"
            />
          </button>
        ))}
      </div>
    </section>
  );
}
