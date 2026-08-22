"use client";

import Image from "next/image";
import Accent from "@/components/primitives/Accent";
import { useLoopCarousel, buildLoopCells, stepStyle } from "./useLoopCarousel";
import { CUSTOMER_STORIES as STORIES } from "@/components/sections/homepage-update/homepageUpdateContent";

// Carrusel de historias, portado del lab `/prototype/carousel-sections`.
//
// Reemplaza la versión anterior de esta sección —dos columnas fijas, imagen a
// un lado y un crossfade de títulos apilados en la misma celda de grid—, que
// mostraba UNA historia por vez sin pista de que hubiera más. Acá las vecinas
// asoman a los costados y el paso se ve, que es lo que convierte la fila de
// logos de abajo en una navegación evidente en vez de en un pie de página.
//
// El lab es un laboratorio, así que esto es una COPIA y no un import: es la
// regla del README de sections para las carpetas de prototipo ("si una versión
// gana, se COPIA a la carpeta de la página que la reciba"). Su contenido puede
// cambiar o borrarse sin aviso, y esta sección ya no depende de eso.
//
// La copy sale de `homepageUpdateContent` y no del contenido del lab: son SEIS
// historias con hrefs reales a los posts, contra las cuatro con `href: "#"`
// que el lab traía de ejemplo. El motor es genérico en N, así que el cambio
// de cantidad no lo toca.
const N = STORIES.length;
const cells = buildLoopCells(STORIES);

export default function CustomerStories() {
  const { containerRef, trackRef, index, goTo, rootProps } =
    useLoopCarousel<HTMLDivElement>(N);

  return (
    <section
      // `stepStyle` baja `--step` y `--step-ease` desde el motor. Las
      // transiciones CSS de las cards los consumen, así que el tamaño de la
      // card y el desplazamiento del track salen del MISMO reloj y la MISMA
      // curva. Ver la nota larga de `STEP_SECONDS` en useLoopCarousel.
      style={{
        ...stepStyle,
        // El ancho de una celda al frente, y cuánto queda cuando no lo está.
        //
        // Van como custom properties y no sueltos en la clase porque el ancho
        // encogido se DERIVA del otro (`calc(var(--cell-w) * var(--cell-idle))`)
        // y los dos tienen que salir del mismo lugar: si el clamp y su fracción
        // viven en clases separadas, la primera vez que alguien mueva el clamp
        // se olvida de la otra y la fila queda descalibrada sin síntoma obvio.
        "--cell-w": "clamp(300px, 62vw, 1010px)",
        "--cell-idle": "0.62",
      } as React.CSSProperties}
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
        aria-label="Customer stories. Usá las flechas para navegar."
        className="relative w-full cursor-grab touch-pan-y select-none overflow-hidden py-[clamp(8px,1.4vh,18px)] outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
      >
        <div ref={trackRef} className="flex items-stretch gap-[20px]">
          {cells.map(({ item, key, logical, hidden }) => {
            const delta = (((logical - index) % N) + N) % N;
            const distance = Math.min(delta, N - delta);
            const eager = !hidden && distance <= 1;

            return (
              // La que cambia de ancho es la CELDA, no la card de adentro.
              //
              // Fue al revés hasta el 2026-08-22: celda de ancho fijo, card al
              // 62% de ella, alineada al borde interno de su celda para que el
              // 38% sobrante quedara hacia el borde de pantalla. En reposo eso
              // cierra. Durante el paso no: el borde de la card se desplaza a
              // distinta velocidad que el track, así que el hueco entra en cuadro
              // y se abre hasta ~200px de crema entre dos cards. Y en los saltos
              // de más de una card el efecto era peor, porque la alineación se
              // calculaba contra un `index` que no se actualizaba hasta terminar
              // el paso — las dos vecinas se pegaban al borde equivocado y el
              // hueco aparecía a los dos lados de la activa.
              //
              // Encogiendo la celda, flex corre a las vecinas y el hueco no
              // existe en ningún instante. `data-active` es lo único que lo
              // gobierna, y sale del mismo sitio que el `paint()` del motor.
              //
              // `flex-[0_0_auto]` en vez de una base: el ancho lo pone `width`,
              // que es lo que transiciona. Una `flex-basis` animada obliga al
              // padre a repartir en cada frame.
              <div
                key={key}
                data-cell
                data-logical={logical}
                // `logical === index` y no `logical === 0`: React tiene que
                // coincidir con lo que `paint()` escribe, o el primer re-render
                // a mitad de paso pisa el atributo y devuelve la fila al estado
                // inicial. Con el `setIndex` temprano del motor, los dos dicen lo
                // mismo desde el primer frame.
                data-active={logical === index}
                aria-hidden={hidden || undefined}
                className="group flex min-h-0 w-[min(84vw,460px)] flex-[0_0_auto] items-end transition-[width] duration-[var(--step)] ease-[var(--step-ease)] motion-reduce:transition-none lg:min-h-[clamp(260px,30vw,495px)] lg:w-[var(--cell-w)] lg:data-[active=false]:w-[calc(var(--cell-w)*var(--cell-idle))]"
              >
                {/* Las transiciones toman su duración y su curva de las vars de
                    la sección, no de números propios. Antes eran 550ms con otra
                    cubic-bezier mientras el track tardaba 850ms con otra curva
                    más, y ese desfase era el movimiento "en dos tiempos". */}
                {/* La card llena su celda SIEMPRE. El ancho lo maneja la celda
                    —ver su nota— y acá quedan el alto y la opacidad, que no
                    generan hueco horizontal: el alto lo absorbe el `items-end`
                    de la celda y la card inactiva se apoya abajo. */}
                <article className="grid h-full w-full grid-cols-1 overflow-hidden rounded-[18px] bg-ink-soft text-cream transition-[height,opacity] duration-[var(--step)] ease-[var(--step-ease)] motion-reduce:h-full! motion-reduce:opacity-100! motion-reduce:transition-none! group-data-[active=false]:opacity-60 lg:grid-cols-[1fr_.78fr] lg:group-data-[active=false]:h-[62%] lg:group-data-[active=false]:opacity-[.55] lg:group-data-[active=true]:opacity-100">
                  <div className="flex flex-col p-[clamp(20px,2.4vw,44px)]">
                    {/* Gov. of Bermuda no tiene logotipo en el contenido, y su
                        `logo` es `null` a propósito. El fallback es el nombre en
                        el mismo rol de rótulo, no un hueco: sin él la card se
                        quedaría sin identificar. Lo mismo abajo, en la fila de
                        navegación. */}
                    {item.logo ? (
                      <Image
                        src={item.logo.src}
                        alt={item.company}
                        width={item.logo.width}
                        height={item.logo.height}
                        draggable={false}
                        className="mb-auto h-[clamp(12px,1.2vw,22px)] w-auto self-start brightness-0 invert"
                      />
                    ) : (
                      <span className="mb-auto self-start text-eyebrow uppercase text-cream">
                        {item.company}
                      </span>
                    )}

                    <p className="mb-[clamp(8px,1.4vh,18px)] mt-[clamp(18px,3vh,40px)] text-eyebrow uppercase text-cream/82">
                      Customer stories
                    </p>
                    {/* El titular CRECE con la card, de 22px a 38px, y ese
                        cambio de cuerpo es buena parte del gesto: no es que la
                        card activa tenga otro estilo, es que el mismo titular se
                        agranda. La escala no tiene un par de tokens que dé ese
                        salto exacto, y meterlo a la fuerza en dos niveles
                        rompería la interpolación — `transition-[font-size]`
                        necesita dos valores en la misma unidad.

                        La duración y la curva sí salen de las vars, como todo lo
                        demás de este paso. */}
                    {/* ds-exempt: ver la nota de arriba — el salto 22→38px es el gesto y no hay tokens que lo cubran */}
                    <h3 className="max-w-[18ch] text-pretty font-medium leading-[1.15] tracking-[-0.005em] text-[22px] transition-[font-size] duration-[var(--step)] ease-[var(--step-ease)] motion-reduce:transition-none group-data-[active=true]:text-[38px]">
                      {item.title}
                    </h3>

                    <div className="mt-[clamp(20px,3.4vh,44px)]">
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener"
                        // `tabIndex -1` en las copias: el loop renderiza 3 veces
                        // la lista, así que sin esto el tabulador pasa por seis
                        // enlaces repetidos. Solo la copia central es navegable.
                        tabIndex={hidden ? -1 : undefined}
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
                      // La card activa ocupa hasta 62vw y la imagen es su
                      // columna derecha (.78fr de 1fr+.78fr ≈ 44%), o sea ~28vw
                      // — no los 40vw que declaraba el lab, que hacía pedir una
                      // variante más grande de la necesaria en cada paso.
                      sizes="(min-width: 1024px) 28vw, 100vw"
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

      {/* Los logos son la navegación real, no decoración: van como <button> con
          nombre accesible. `role="tab"` + `aria-selected` los ata a la historia
          que está al frente. */}
      <div
        role="tablist"
        aria-label="Elegir historia"
        className="mt-[clamp(26px,4.5vh,58px)] flex flex-wrap items-center justify-center gap-[clamp(20px,4vw,80px)] px-[clamp(24px,5vw,105px)]"
      >
        {STORIES.map((story, i) => (
          <button
            key={story.company}
            type="button"
            role="tab"
            aria-selected={i === index}
            data-active={i === index}
            onClick={() => goTo(i)}
            className="relative px-[2px] pb-[12px] pt-[6px] opacity-[.28] transition-opacity duration-[400ms] ease-[cubic-bezier(.22,.61,.36,1)] hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink data-[active=true]:opacity-100"
          >
            {story.logo ? (
              <Image
                src={story.logo.src}
                alt={story.company}
                width={story.logo.width}
                height={story.logo.height}
                draggable={false}
                className="h-[1.2em] w-auto brightness-0"
              />
            ) : (
              <span className="text-eyebrow uppercase">{story.company}</span>
            )}
            {/* El subrayado del activo. Se anima con `scale-x` y no con `width`
                porque acá no hay nada que relayout-ear: es una barra suelta. */}
            <span
              data-active={i === index}
              className="absolute bottom-[2px] left-0 h-[1.5px] w-full origin-left scale-x-0 bg-ink transition-transform duration-[var(--step)] ease-[var(--step-ease)] motion-reduce:transition-none data-[active=true]:scale-x-100"
            />
          </button>
        ))}
      </div>
    </section>
  );
}
