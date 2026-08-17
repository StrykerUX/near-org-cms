"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { CUSTOMER_STORIES as STORIES } from "@/components/sections/home-ab6/homeAb6Content";

export default function CustomerStories() {
  const [active, setActive] = useState(0);

  return (
    <section className="bg-cream text-foreground">
      <Container className="flex flex-col gap-14 py-20">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <Eyebrow>Customer stories</Eyebrow>
            <h2 className="text-h2 text-pretty">
              What the world is building
              <br />
              <Accent>on NEAR</Accent>
            </h2>

            {/* Los 6 títulos apilados en la MISMA celda de grid. Así el bloque
                mide siempre lo que el título más largo y no salta al cambiar de
                historia — el original resolvía eso con un ResizeObserver que
                escribía minHeight, acá lo hace el layout solo. */}
            <div className="mt-4 grid">
              {STORIES.map((story, i) => (
                <div
                  key={story.company}
                  data-active={i === active}
                  // invisible (no solo opacity-0) para que los títulos ocultos
                  // no queden focuseables ni los lea un lector de pantalla.
                  className="invisible flex translate-y-2.5 flex-col gap-6 opacity-0 transition-[opacity,transform] duration-[450ms] ease-out [grid-area:1/1] motion-reduce:transition-none data-[active=true]:visible data-[active=true]:translate-y-0 data-[active=true]:opacity-100"
                >
                  <h3 className="text-h3 text-pretty">{story.title}</h3>
                  <a
                    href={story.href}
                    target="_blank"
                    rel="noopener"
                    className="group/cta flex w-fit items-center gap-3 text-label"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-near-green-accent text-black transition-transform duration-200 motion-reduce:transition-none group-hover/cta:translate-x-0.5">
                      <ArrowRight className="size-4" />
                    </span>
                    Read the full story
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Las seis imágenes viven en el DOM porque el crossfade las necesita
              todas ahí, pero solo la ACTIVA y sus vecinas se descargan.

              Los originales son PNG de 0.87 a 1.24MB — unos 6MB en total. Con las
              seis pedidas a la vez, el navegador abría seis descargas y seis
              decodificaciones en paralelo cuando la sección se acercaba, para
              mostrar una. `loading="lazy"` no alcanzaba por sí solo: las seis están
              en el mismo contenedor, así que entran al viewport juntas.

              El criterio es la activa (`eager`, porque se va a ver ya) más la
              anterior y la siguiente. Las otras tres van con `display: none`, que
              es lo que impide la descarga: un `loading="lazy"` cuyo elemento no
              entra al viewport no se pide. Al navegar de a un tab, la que entra ya
              estaba descargada por ser vecina, así que el crossfade nunca espera
              red. La vecindad es circular porque los logos permiten saltar del
              último al primero. */}
          <div className="relative aspect-[8/5] w-full overflow-hidden rounded-md border border-border bg-muted">
            {STORIES.map((story, i) => {
              const distance = Math.min(
                Math.abs(i - active),
                // Circular: desde el último, el siguiente es el primero.
                STORIES.length - Math.abs(i - active)
              );
              const wanted = distance <= 1;
              return (
                <Image
                  key={story.company}
                  src={story.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  loading={i === active ? "eager" : "lazy"}
                  data-active={i === active}
                  className={`object-cover opacity-0 transition-opacity duration-500 data-[active=true]:opacity-100 ${
                    wanted ? "" : "hidden"
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Los logos son la navegación real, no decoración: van como <button>
            con el nombre accesible, no como <img> clickeable. */}
        <div className="flex flex-wrap items-center justify-center gap-x-14 gap-y-6">
          {STORIES.map((story, i) => (
            <button
              key={story.company}
              type="button"
              aria-pressed={i === active}
              onClick={() => setActive(i)}
              data-active={i === active}
              className="flex items-center opacity-35 transition-opacity duration-300 data-[active=true]:opacity-100"
            >
              {story.logo ? (
                <Image
                  src={story.logo.src}
                  alt={story.company}
                  width={story.logo.width}
                  height={story.logo.height}
                  // grayscale → brightness-0: el activo pasa a negro sólido, el
                  // resto queda desaturado. Los PNG de marca no comparten tono,
                  // así que sin normalizar la fila se ve descoordinada.
                  className={`h-6 w-auto ${i === active ? "brightness-0" : "grayscale"}`}
                />
              ) : (
                <span className="text-eyebrow uppercase">{story.company}</span>
              )}
            </button>
          ))}
        </div>
      </Container>
    </section>
  );
}
