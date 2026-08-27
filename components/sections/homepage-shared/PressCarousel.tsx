"use client";

import Image from "next/image";
import { useLoopCarousel, buildLoopCells, stepStyle } from "./useLoopCarousel";
import { PRESS_ITEMS, type PressTone } from "@/components/sections/homepage-shared/homepageUpdateContent";

// Carrusel de prensa, portado del lab `/prototype/carousel-sections`.
//
// Reemplaza a `components/sections/TestimonialMarquee` en la homepage de ab10.
// Son las mismas cinco citas, pero el gesto es otro: el marquee las desplazaba
// solo, en bucle continuo y sin forma de detenerlo ni de elegir una; este las
// pasa de a una, con la misma pausa de 7s y el mismo paso de 1.75s que el
// carrusel de historias, y responde al drag y al teclado.
//
// TestimonialMarquee NO se toca ni se borra: la montan ocho views (ab6, ab7,
// ab9, v2, v4, v5 y los dos demos de proof). Acá solo cambia lo que ab10 monta.
//
// El lab es un laboratorio, así que esto es una COPIA y no un import — la
// misma regla del README de sections que se aplicó al carrusel de historias.
//
// Los TRES tonos (gradiente verde / gris / negro) van con hex exactos y no con
// tokens del repo: no hay --green-2/--near-green-* que calcen con estos.
const TONE_CARD: Record<PressTone, string> = {
  green: "bg-[linear-gradient(155deg,#BBEF7F_0%,#37C142_100%)] text-ink",
  gray: "bg-[#f5f4f1] text-ink",
  dark: "bg-[#262626] text-white",
};

const TONE_QUOTE: Record<PressTone, string> = {
  green: "text-ink/30",
  gray: "text-ink/30",
  dark: "text-white/30",
};

const cells = buildLoopCells(PRESS_ITEMS);

export default function PressCarousel() {
  const { containerRef, trackRef, rootProps } = useLoopCarousel<HTMLDivElement>(PRESS_ITEMS.length);

  return (
    <section
      // Mismo reloj que el carrusel de historias: `--step` y `--step-ease`
      // bajan del motor. Acá no hay transición CSS que los use todavía, pero
      // las dos secciones comparten motor y conviene que compartan también la
      // fuente del tiempo — si mañana la card de prensa crece como la de
      // historias, ya está enchufado.
      style={stepStyle}
      className="overflow-hidden bg-cream py-[clamp(40px,7vh,96px)] text-foreground"
      aria-roledescription="carousel"
      // Sin titular visible, este `aria-label` es la única etiqueta de la
      // sección: quien navega por landmarks o por lista de regiones no tiene
      // otra cosa que la nombre. Por eso se queda aunque el `<h2>` se haya ido.
      aria-label="Blockchain quantum security in the news"
    >
      <div
        ref={containerRef}
        {...rootProps}
        aria-label="Cards de prensa. Usá las flechas para navegar."
        // `active:cursor-grabbing`: el carrusel se puede arrastrar y hasta acá
        // solo lo decía el cursor en reposo. Que cambie AL APRETAR es la
        // confirmación de que el gesto fue tomado — sin ella, un drag que no
        // llega al umbral (`dragMinimum`) se siente como que la página no
        // respondió.
        className="relative w-full cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing py-[clamp(8px,1.4vh,18px)] outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
      >
        <div ref={trackRef} className="flex items-stretch gap-[clamp(16px,2vw,36px)]">
          {cells.map(({ item, key, logical, hidden }) => {
            const dark = item.tone === "dark";

            return (
              <article
                key={key}
                data-cell
                data-logical={logical}
                data-active={logical === 0}
                aria-hidden={hidden || undefined}
                className={`relative flex min-h-[clamp(150px,16vw,270px)] flex-[0_0_min(78vw,400px)] flex-col gap-2 overflow-hidden rounded-[clamp(16px,1.6vw,26px)] p-[clamp(20px,2.2vw,40px)] lg:flex-[0_0_clamp(280px,33vw,560px)] ${TONE_CARD[item.tone]}`}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* `eager` en la copia central, `lazy` en las laterales.

                      Sin esto quedaban en el lazy por defecto de Next, y con las
                      tres copias del loop el navegador terminaba descargando las
                      de una copia que no era la visible: las cards se veían con
                      el hueco del logo vacío. Es el mismo criterio que usa
                      `CustomerStories` para sus fotos.

                      Cargar la copia entera no cuesta cinco descargas extra:
                      son los MISMOS cinco archivos en las tres copias, así que
                      la caché resuelve las repeticiones. */}
                  <Image
                    src={item.logo.src}
                    alt=""
                    width={item.logo.width}
                    height={item.logo.height}
                    loading={hidden ? "lazy" : "eager"}
                    draggable={false}
                    className={`w-auto ${item.logo.src.includes("venice") ? "h-9" : "h-[27px]"} ${dark ? "brightness-0 invert" : "brightness-0"}`}
                  />
                  <span aria-hidden="true" className={`shrink-0 select-none text-h1 ${TONE_QUOTE[item.tone]}`}>
                    &rdquo;
                  </span>
                </div>

                <p className="max-w-[46ch] text-body-sm text-pretty">{item.body}</p>

                <div className="mt-auto">
                  <p className="text-label">{item.name}</p>
                  <p className={`text-body-sm ${dark ? "text-white/50" : "text-ink/60"}`}>{item.role}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
