"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { BUILDERS } from "@/components/sections/solutions/solutionsContent";

// §5 — quién ya construyó esto.
//
// El único respiro CLARO de la página: llega justo después del spotlight
// oscuro, y ese contraste es lo que lo convierte en un respiro en vez de en una
// sección más. Es la misma función que el blanco cumple en `/chain-abstraction`
// —donde el argumento para y la página exhala— y por eso va en `bg-background`
// y no en crema: sobre crema sería la cuarta sección seguida del mismo tono.
//
// ── Grid y no marquee ─────────────────────────────────────────────────────
//
// El copy pide «a nice flow of company logos», y esta propuesta lo desobedece a
// propósito. El motivo es el DATO: cada constructor trae una descripción de dos
// o tres renglones, y un marquee de logos no puede llevarla — o la tira, o la
// hace pasar en movimiento, que es ilegible. Con ocho fichas quietas el lector
// puede comparar dos casos sin volver a esperar a que el carrusel dé la vuelta.
//
// Es una diferencia deliberada con las otras dos propuestas: B lo pinta con su
// riel por detrás y C lo convierte en carrusel de historias. Las tres tienen el
// mismo contenido y tres respuestas distintas.
//
// ── Cinco marcas reales de ocho ───────────────────────────────────────────
//
// Bermuda, NVIDIA e Intel llegan con `logo: null` desde el módulo de copy y caen
// al nombre puesto en tipo. El razonamiento completo está allá; lo que importa
// acá es que el fallback **no es un hueco**: es el nombre en el mismo rol de
// rótulo que ocupa el logotipo, así que la ficha queda identificada igual. Es lo
// que `homepage-update/CustomerStories` ya hace con Bermuda.

export default function BuilderWall() {
  // El scope es la SECCIÓN y no la grilla: así el titular entra CON las fichas.
  // Es lo único que hay arriba, y una sección que empieza con su título ya
  // escrito y sus ocho tarjetas subiendo se lee a dos tiempos sin motivo.
  const ref = useScrollReveal<HTMLElement>({ y: 22, stagger: 0.07 });

  return (
    <section ref={ref} className="bg-background py-[16svh]">
      <Container>
        {/* Sin `<br />` manual y con `text-balance`: el titular del copy es una
            enumeración de cuatro términos sin punto natural de corte en dos, y
            forzarlo dejaba una línea de una sola palabra en el medio. */}
        <h2 data-reveal className="max-w-[34ch] text-h2 text-balance">
          Integrated across enterprises, governments,{" "}
          <Accent>wallets, and global infrastructure</Accent>
        </h2>

        <div
          className="mt-20 grid grid-cols-1 gap-x-[var(--grid-gutter)] gap-y-14 sm:grid-cols-2 lg:grid-cols-4"
        >
          {BUILDERS.map((b) => (
            <article key={b.id} data-reveal className="flex flex-col">
              {/* La caja del logotipo tiene alto FIJO y el logo se ajusta
                  dentro. Ocho marcas ajenas vienen con ocho proporciones y ocho
                  pesos ópticos distintos; sin una caja común, la fila de arriba
                  de las fichas queda dentada y la grilla deja de leerse como
                  grilla. */}
              <div className="flex h-12 items-center">
                {b.logo ? (
                  <Image
                    src={b.logo.src}
                    alt={b.name}
                    width={b.logo.width}
                    height={b.logo.height}
                    // `brightness-0` lleva cualquier logotipo a negro plano: son
                    // marcas de ocho paletas distintas, y en color esta sección
                    // se vuelve un muestrario. En negro, la que resalta es la que
                    // el lector está mirando.
                    className="h-7 w-auto brightness-0"
                  />
                ) : (
                  <span className="text-eyebrow uppercase text-ink">{b.name}</span>
                )}
              </div>

              <div className="mt-6 h-px w-full bg-rule" aria-hidden="true" />

              <h3 className="mt-6 text-h4 text-ink">{b.name}</h3>
              <p className="mt-3 text-body-sm text-gray-intermediate text-pretty">{b.body}</p>

              <a
                href={b.href}
                target="_blank"
                rel="noopener noreferrer"
                // `mt-auto` para que los ocho enlaces queden a la misma altura
                // aunque las descripciones midan distinto. Sin él, la fila de
                // «Learn more» serpentea y la grilla se deshace por abajo.
                className="mt-auto inline-flex w-fit items-center gap-1.5 pt-6 text-label text-ink underline-offset-4 hover:underline"
              >
                Learn more
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
