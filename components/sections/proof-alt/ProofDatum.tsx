"use client";

import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS, EASE_OUT } from "@/components/primitives/motion/motionTokens";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { PROOF_STATS } from "@/components/sections/proof-alt/proofAltContent";

// ── B · Datum ────────────────────────────────────────────────────────────────
//
// Un eje y seis marcas. Las pruebas cuelgan de una línea que cruza el ancho
// completo, alternando arriba y abajo, y cada una baja hasta el eje por su
// propio tallo.
//
// Es la más baja de las tres —le sobra alto en cualquier pantalla— y la que
// menos estorba: si esta sección tiene que decir seis cosas y salir del paso,
// es esta. El precio es el tamaño: seis columnas de un sexto del ancho dejan la
// cifra a escala de h2 y con quiebre de línea en casi todas.
//
// ── La alternancia no es decoración ─────────────────────────────────────────
//
// Poner las seis del mismo lado del eje deja una fila de seis fichas y una raya
// debajo, que es una tabla con adorno. Alternando, el eje queda ENTRE las
// fichas y hay que cruzarlo para seguir leyendo: es lo que hace que la línea
// signifique algo en vez de subrayar.
//
// ── El eje cae centrado sin que nadie lo coloque ───────────────────────────
//
// Las filas son `1fr 1px 1fr`: las dos mitades se igualan a la ficha más alta,
// así que el eje queda a la mitad exacta del bloque sin una sola altura
// declarada. Si un cuerpo crece, las dos mitades crecen con él y el eje sigue
// centrado — que es lo que un alto fijo habría roto en el primer cambio de copy.
//
// ── En móvil el eje gira ─────────────────────────────────────────────────────
//
// Seis columnas no existen a 375px, y la respuesta no es apilar las fichas y
// tirar el eje: es girarlo. En móvil la línea es VERTICAL, corre por la
// izquierda, y las seis fichas cuelgan de ella en orden. Se conserva la idea
// —una línea con marcas— con la única geometría que cabe.
//
// Eso lo hace CSS solo, sin JS: el borde izquierdo del contenedor es el eje en
// móvil, el `<span>` del eje horizontal solo aparece en `lg`. Un cambio de
// layout que dependiera de JS dejaría la sección sin eje mientras carga.

// Dónde cae cada ficha en la retícula de desktop. Mapa literal de clases —
// nunca un template string: Tailwind v4 no detecta clases construidas en
// tiempo de ejecución y las purga del CSS.
//
// Las impares arriba (fila 1) y las pares abajo (fila 3); la fila 2 es el eje.
const PLACE = [
  "lg:col-start-1 lg:row-start-1 lg:justify-end lg:pb-5",
  "lg:col-start-2 lg:row-start-3 lg:pt-5",
  "lg:col-start-3 lg:row-start-1 lg:justify-end lg:pb-5",
  "lg:col-start-4 lg:row-start-3 lg:pt-5",
  "lg:col-start-5 lg:row-start-1 lg:justify-end lg:pb-5",
  "lg:col-start-6 lg:row-start-3 lg:pt-5",
] as const;

// El tallo va al final de la ficha en las de arriba (toca el eje por abajo) y
// al principio en las de abajo. `order` y no dos markups distintos.
const STEM = [
  "lg:order-last",
  "lg:order-first",
  "lg:order-last",
  "lg:order-first",
  "lg:order-last",
  "lg:order-first",
] as const;

export default function ProofDatum() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk }) => {
    if (!motionOk) return;

    const axis = q("[data-axis]")[0];
    const stems = q("[data-stem]");
    const cards = q("[data-card]");
    if (cards.length === 0) return;

    const tl = gsap.timeline({
      defaults: { ease: EASE_OUT },
      scrollTrigger: { trigger: scope, start: "top 75%", once: true, markers: DEBUG_MARKERS },
    });

    // El eje se traza de un extremo al otro antes que nada: es la estructura, y
    // las fichas llegan a algo que ya está.
    if (axis) tl.from(axis, { scaleX: 0, duration: 1.05 }, 0);

    // Cada ficha entra HACIA el eje: las de arriba bajan, las de abajo suben.
    // Signo por índice y no un valor único — con el mismo `y` para las seis,
    // tres de ellas se alejarían del eje al entrar.
    cards.forEach((card, i) => {
      tl.from(
        card,
        { autoAlpha: 0, y: i % 2 === 0 ? -20 : 20, duration: 0.7 },
        0.25 + i * 0.08
      );
    });

    tl.from(stems, { scaleY: 0, duration: 0.45, stagger: 0.08 }, 0.2);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      gsap.set([...cards, ...stems, ...(axis ? [axis] : [])], { clearProps: "all" });
    };
  });

  // Esta es la ÚNICA de las tres sin `min-h-svh`, y es su razón de ser: mide lo
  // que mide su contenido. Forzarla a una pantalla dejaba medio viewport en
  // blanco alrededor de un eje de 350px — la sección que existe para estorbar
  // poco, ocupando lo mismo que las que no.
  return (
    <section
      ref={rootRef}
      className="flex flex-col justify-center bg-background py-24 text-ink lg:py-28"
    >
      <Container className="flex flex-col gap-10">
        <Eyebrow className="text-gray-intermediate">Built to</Eyebrow>

        {/* En móvil el contenedor ES el eje: su borde izquierdo. En desktop ese
            borde desaparece y el eje pasa a ser el span horizontal de la fila 2. */}
        <div className="flex flex-col gap-10 border-l border-ink pl-6 lg:grid lg:grid-cols-6 lg:grid-rows-[1fr_1px_1fr] lg:gap-x-8 lg:gap-y-0 lg:border-l-0 lg:pl-0">
          <span
            data-axis
            aria-hidden="true"
            className="hidden origin-left border-t border-ink lg:col-span-full lg:row-start-2 lg:block"
          />

          {PROOF_STATS.map((stat, i) => (
            <article
              key={stat.id}
              data-card
              className={`flex min-w-0 flex-col gap-3 ${PLACE[i]}`}
            >
              <span
                data-stem
                aria-hidden="true"
                className={`hidden h-5 w-px origin-center bg-rule lg:block ${STEM[i]}`}
              />
              <p className="text-h4 text-gray-intermediate">{stat.eyebrow}</p>
              <p className="text-h2-serif italic text-balance">
                {stat.value}
                <span className="text-green-ink">{stat.accent}</span>
              </p>
              <p className="text-body-sm text-gray-intermediate text-pretty">{stat.body}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
