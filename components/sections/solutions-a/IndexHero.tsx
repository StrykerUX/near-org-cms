"use client";

import { ArrowUpRight } from "lucide-react";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import CtaPill from "@/components/sections/quantum/CtaPill";
import ColumnRule from "@/components/sections/solutions-a/ColumnRule";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { EASE_OUT } from "@/components/primitives/motion/motionTokens";
import { HERO, SOLUTIONS } from "@/components/sections/solutions/solutionsContent";

// §1 — el hero que ES el índice.
//
// ── La tesis de la propuesta A, en una sola pantalla ───────────────────────
//
// El lector de un hub de soluciones no llega a descubrir qué hay: llega con un
// caso de uso ya en la cabeza —"¿esto sirve para pagos?"— y su único trabajo es
// encontrarlo. Un hub que lo obliga a atravesar cinco pantallas antes de
// enseñarle el menú falló en lo único que tenía que hacer.
//
// Así que el índice completo entra ACÁ, sobre el fold, y las cinco entradas son
// anclas de verdad. Quien sepa lo que busca salta; quien no, sigue scrolleando y
// las recorre en orden.
//
// Es el criterio de `protocol-labs/a/Hero`: el hero AFIRMA y no argumenta, sin
// una sola cifra. La diferencia es que allá lo que sigue es la prueba, y acá lo
// que sigue es el mapa.
//
// ── Por qué no hay superficie ──────────────────────────────────────────────
//
// Ni shader ni campo de caracteres, a propósito, y es la apuesta de A frente a
// las otras dos. La textura es la RETÍCULA (`ColumnRule`): las doce columnas del
// sistema, dibujadas. Un índice que muestra su propia estructura es coherente;
// un índice sobre un paisaje generativo es un índice con un fondo bonito.
//
// El riesgo está anotado en `SolutionsAView`: sobriedad puede leerse como
// documentación. Es exactamente lo que la comparación tiene que resolver.

export default function IndexHero() {
  const rootRef = useMotionScope<HTMLElement>(({ q, motionOk }) => {
    if (!motionOk) return;

    // **Sin `scrollTrigger`.** El hero ya está en pantalla cuando la página
    // carga, así que no hay nada que disparar — y atarlo a uno lo vuelve frágil:
    // un trigger que nace con su punto de partida YA pasado no cruza nada, así
    // que no dispara al crearse y queda esperando al `ScrollTrigger.refresh()`
    // que el provider hace cuando terminan de cargar fuentes e imágenes. Con
    // suerte llega enseguida; sin ella, la primera pantalla se queda vacía
    // varios segundos. No es teórico: pasó, y se midió, en un hero de esta
    // misma familia que sí lo llevaba.
    //
    // Con la timeline suelta, entra en el mismo frame en que se crea.
    const tl = gsap.timeline({ defaults: { ease: EASE_OUT } });

    tl.from(q("[data-hero-item]"), { autoAlpha: 0, y: 24, duration: 0.85, stagger: 0.12 }, 0)
      // Las entradas del índice entran DESPUÉS del titular y en su propio
      // ritmo: son una lista, no parte del bloque de la izquierda. El filete de
      // cada una se dibuja y el texto la sigue, que es la misma gramática con
      // la que `ProofRow` va a presentar las cifras una sección más abajo.
      .from(q("[data-entry-rule]"), { scaleX: 0, duration: 0.6, stagger: 0.09 }, 0.45)
      .from(q("[data-entry-body]"), { autoAlpha: 0, y: 14, duration: 0.55, stagger: 0.09 }, 0.6);

    return () => tl.kill();
  });

  return (
    <section
      ref={rootRef}
      // `pt-[var(--site-header-block)]` porque el header es `fixed` y esta
      // página SÍ quiere despejarlo: el índice tiene que leerse entero, y una
      // primera entrada por debajo de la barra rompe justo la promesa de la
      // sección.
      className="relative flex min-h-svh flex-col justify-center bg-cream pb-[12svh] pt-[calc(var(--site-header-block)+8svh)]"
    >
      <ColumnRule />

      <Container className="relative">
        <div className="grid-ds items-start gap-y-16">
          {/* ── la afirmación ──────────────────────────────────────────── */}
          <div className="col-span-12 lg:col-span-5">
            <p data-hero-item className="text-caption-mono uppercase text-gray-intermediate">
              Solutions
            </p>

            <h1 data-hero-item className="mt-8 max-w-[13ch] text-h1 text-pretty">
              Use cases <Accent>powered by NEAR</Accent>
            </h1>

            <p
              data-hero-item
              className="mt-10 max-w-[52ch] text-body text-ink-soft text-pretty"
            >
              {HERO.subhead}
            </p>

            <div data-hero-item className="mt-12">
              <CtaPill href={HERO.cta.href} tone="filled">
                {HERO.cta.label}
              </CtaPill>
            </div>
          </div>

          {/* ── el índice ──────────────────────────────────────────────────
              Anclas reales (`#id`), no botones: el lector puede copiar el
              enlace de una solución y compartirlo, y sin JS siguen navegando.
              Los destinos los declara `SolutionsIndex`, que pone el mismo `id`
              en cada uno de sus beats. */}
          <nav
            aria-label="Solutions index"
            className="col-span-12 lg:col-span-6 lg:col-start-7"
          >
            <ul>
              {SOLUTIONS.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
                  >
                    <span
                      data-entry-rule
                      className="block h-px w-full origin-left bg-rule"
                      aria-hidden="true"
                    />
                    {/* La fila CIERRA a la derecha, y eso no es adorno.
                        El filete mide el ancho entero de la columna mientras que
                        el título ocupa menos de la mitad: sin nada en la otra
                        punta, cada renglón se lee como una línea que sobra, y
                        seis renglones así hacen que la sección entera parezca
                        sin terminar. La flecha es el remate — es además la
                        convención de un directorio, que dice «esto lleva a algún
                        lado» sin gastar una palabra.

                        `justify-between` y no un margen: el remate tiene que
                        quedar pegado al final del filete midan lo que midan los
                        títulos. */}
                    <span
                      data-entry-body
                      className="flex items-baseline justify-between gap-6 py-5 transition-[padding-left] duration-300 ease-out group-hover:pl-3 motion-reduce:transition-none"
                    >
                      <span className="flex items-baseline gap-6">
                        <span className="text-caption-mono text-gray-intermediate">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-h3 text-ink">{s.title}</span>
                      </span>
                      <ArrowUpRight
                        className="size-6 shrink-0 self-center text-gray-intermediate transition-[transform,color] duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink motion-reduce:transition-none"
                        aria-hidden="true"
                      />
                    </span>
                  </a>
                </li>
              ))}
              {/* El filete de cierre. Sin él la última entrada queda abierta y
                  la lista se lee como cortada, no como terminada. */}
              <li aria-hidden="true">
                <span data-entry-rule className="block h-px w-full origin-left bg-rule" />
              </li>
            </ul>
          </nav>
        </div>
      </Container>
    </section>
  );
}
