"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { EASE_OUT, DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { BUILDERS } from "@/components/sections/solutions/solutionsContent";

// §4 — los ocho constructores, como registro.
//
// ── Por qué filas y no una grilla de fichas ───────────────────────────────
//
// Es lo que separa este muro del de las otras propuestas, y no es una variación
// de estilo. D habla en el vocabulario de una interfaz: filetes, mono, filas
// numeradas, nada de cards con sombra. Ocho fichas en grilla meterían un
// segundo lenguaje en la última sección clara de la página.
//
// Y hay un motivo de lectura además del de tono: en filas, la columna del
// logotipo queda alineada verticalmente y las ocho marcas se leen como una
// lista de referencias — que es lo que son. En grilla, cada logotipo cae a una
// altura distinta según el largo de su descripción y el muro se lee dentado.
//
// ── El único respiro claro ────────────────────────────────────────────────
//
// Va en blanco, no en crema, y llega justo después del corte oscuro. Es el
// mismo papel que el blanco cumple en `/chain-abstraction`: la página deja de
// argumentar y respira. Sobre crema sería la tercera sección seguida del mismo
// tono y el respiro no existiría.
//
// ── Cinco marcas reales de ocho ───────────────────────────────────────────
//
// Bermuda, NVIDIA e Intel llegan con `logo: null` desde el módulo de copy y caen
// al nombre puesto en tipo. El razonamiento largo está allá; lo que importa acá
// es que el fallback ocupa el mismo rol de rótulo que el logotipo, así que la
// fila queda identificada igual.

export default function BuilderTable() {
  const rootRef = useMotionScope<HTMLElement>(({ q, motionOk }) => {
    if (!motionOk) return;

    // Un timeline por fila: el registro mide más de una pantalla, y con un
    // trigger compartido las últimas filas animarían fuera de vista.
    const timelines = q("[data-builder]").map((row) => {
      const tl = gsap.timeline({
        defaults: { ease: EASE_OUT },
        scrollTrigger: { trigger: row, start: "top 92%", once: true, markers: DEBUG_MARKERS },
      });
      tl.from(row.querySelectorAll("[data-builder-item]"), {
        autoAlpha: 0,
        y: 12,
        duration: 0.45,
        stagger: 0.05,
      });
      return tl;
    });

    return () => {
      timelines.forEach((tl) => {
        tl.scrollTrigger?.kill();
        tl.kill();
      });
    };
  });

  return (
    <section ref={rootRef} className="bg-background py-28">
      <Container>
        {/* Sin `<br />` manual y con `text-balance`: el titular del copy es una
            enumeración de cuatro términos sin punto natural de corte en dos, y
            forzarlo deja una línea de una sola palabra en el medio. */}
        <h2 className="max-w-[34ch] text-h2 text-balance">
          Integrated across enterprises, governments,{" "}
          <Accent>wallets, and global infrastructure</Accent>
        </h2>

        <div className="mt-14">
          {BUILDERS.map((b) => (
            <a
              key={b.id}
              data-builder
              href={b.href}
              target="_blank"
              rel="noopener noreferrer"
              // La fila ENTERA es el enlace, no un «Learn more» al final. En un
              // registro de ocho, ocho enlaces de dos palabras obligan a apuntar
              // a un blanco chico ocho veces; la fila completa es un blanco de
              // 1400px de ancho.
              className="group grid-ds items-center gap-y-3 border-t border-rule py-7 transition-[padding-left] duration-300 ease-out hover:pl-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink motion-reduce:transition-none last:border-b"
            >
              {/* Caja de alto fijo para el logotipo: ocho marcas ajenas traen
                  ocho proporciones y ocho pesos ópticos distintos, y sin una
                  caja común la columna se dienta. */}
              <span data-builder-item className="col-span-6 flex h-8 items-center lg:col-span-2">
                {b.logo ? (
                  <Image
                    src={b.logo.src}
                    alt={b.name}
                    width={b.logo.width}
                    height={b.logo.height}
                    // `brightness-0` lleva cualquier logotipo a negro plano: en
                    // color, ocho paletas distintas convierten la sección en un
                    // muestrario.
                    className="h-6 w-auto brightness-0"
                  />
                ) : (
                  <span className="text-eyebrow uppercase text-ink">{b.name}</span>
                )}
              </span>

              <span data-builder-item className="col-span-6 lg:col-span-2">
                <span className="text-h4 text-ink">{b.name}</span>
              </span>

              <span
                data-builder-item
                className="col-span-12 lg:col-span-7 lg:col-start-5"
              >
                <span className="block max-w-[62ch] text-body-sm text-gray-intermediate text-pretty">
                  {b.body}
                </span>
              </span>

              <span
                data-builder-item
                className="hidden lg:col-span-1 lg:col-start-12 lg:flex lg:justify-end"
              >
                <ArrowUpRight
                  className="size-5 text-gray-intermediate transition-[transform,color] duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink motion-reduce:transition-none"
                  aria-hidden="true"
                />
              </span>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
