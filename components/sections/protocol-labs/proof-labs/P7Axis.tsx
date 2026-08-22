"use client";

import { gsap } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS, EASE_OUT } from "@/components/primitives/motion/motionTokens";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { useCountUp } from "@/components/sections/protocol-labs/countUp";
import DividerBand from "@/components/sections/protocol-labs/proof-labs/DividerBand";
import { PROOF } from "@/components/sections/protocol-labs/protocolContent";

// P7 · Axis — la forma que el sitio YA usa para estas mismas seis pruebas.
//
// ── La tesis ────────────────────────────────────────────────────────────────
//
// `components/sections/homepage-update/ProofDatum` resuelve exactamente este
// problema —seis pruebas que hay que mostrar juntas— con un eje que cruza la
// página y seis marcas alternadas arriba y abajo. Está en la homepage, es la
// línea de diseño viva, y funciona.
//
// La pregunta que hace es de SISTEMA, no de composición: cuando dos páginas
// tienen el mismo problema, ¿lo resuelven igual? Repetir la forma convierte "seis
// pruebas" en un patrón reconocible del sitio; inventar una distinta en cada
// página deja seis soluciones y ningún sistema.
//
// ── Por qué encaja tan bien en el rol de divider ──────────────────────────
//
// Porque su idea central YA es una línea que separa. En la homepage el eje es una
// figura dentro de una sección; acá es, literalmente, la juntura entre el hero y
// el contenido, con las cifras colgando de ella. La variante no tuvo que
// adaptarse al rol — el rol le vino a buscar.
//
// La alternancia arriba/abajo, que en la homepage es una decisión de composición,
// acá gana un significado extra: tres cifras miran hacia el hero y tres hacia lo
// que sigue.
//
// ── Qué cambió al comprimirse ─────────────────────────────────────────────
//
// La versión anterior daba a cada mitad el alto de la ficha más alta —valor en
// serif a `text-h2`, etiqueta y nota— y medía como una sección. Acá el valor baja
// a `text-h4`, la nota se va, y los tallos se acortan a la mitad. Lo que se
// conserva es lo único que no se puede perder: que el eje quede ENTRE las fichas
// y haya que cruzarlo para seguir leyendo. Poner las seis del mismo lado deja una
// fila con una raya debajo, que es una tabla con adorno.
//
// ── Qué NO se copió de la homepage ────────────────────────────────────────
//
// La retícula de trece columnas con fichas de tres y desfase de dos. Ahí el
// calibre es el PAR ancho/desfase y mover uno sin el otro rompe el efecto — está
// documentado en `ProofDatum`. Acá las cifras son un valor y una etiqueta, sin
// párrafo, así que entran en seis columnas parejas y el solape deja de hacer
// falta. Copiar la retícula sin su contenido habría sido copiar el número sin la
// razón.

// Las impares arriba, las pares abajo; la fila del medio es el eje. Mapa literal
// de clases: Tailwind v4 no ve las clases construidas en tiempo de ejecución.
const PLACE = [
  "lg:row-start-1 lg:justify-end lg:pb-3",
  "lg:row-start-3 lg:pt-3",
  "lg:row-start-1 lg:justify-end lg:pb-3",
  "lg:row-start-3 lg:pt-3",
  "lg:row-start-1 lg:justify-end lg:pb-3",
  "lg:row-start-3 lg:pt-3",
] as const;

// El tallo va al final de la ficha en las de arriba y al principio en las de
// abajo, para que toque el eje por el lado correcto. `order`, no dos markups.
const STEM = [
  "lg:order-last",
  "lg:order-first",
  "lg:order-last",
  "lg:order-first",
  "lg:order-last",
  "lg:order-first",
] as const;

export default function P7Axis() {
  // Umbral más tardío que el de la escena: las fichas entran desde `autoAlpha: 0`
  // y un contador sincronizado correría mientras la cifra todavía es invisible.
  const countRef = useCountUp<HTMLDivElement>({ start: "top 68%", stagger: 0.07 });

  const rootRef = useMotionScope<HTMLDivElement>(({ q, scope, motionOk }) => {
    if (!motionOk) return;

    const axis = q("[data-axis]")[0];
    const cards = q("[data-card]");
    const stems = q("[data-stem]");
    if (cards.length === 0) return;

    const tl = gsap.timeline({
      defaults: { ease: EASE_OUT },
      scrollTrigger: { trigger: scope, start: "top 85%", once: true, markers: DEBUG_MARKERS },
    });

    // El eje se traza primero: es la estructura, y las fichas llegan a algo que
    // ya está.
    if (axis) tl.from(axis, { scaleX: 0, duration: 0.9 }, 0);
    // Cada ficha entra HACIA el eje — las de arriba bajan, las de abajo suben. El
    // signo sale del índice; con un `y` único, tres se alejarían al entrar.
    cards.forEach((card, i) => {
      tl.from(card, { autoAlpha: 0, y: i % 2 === 0 ? -14 : 14, duration: 0.55 }, 0.2 + i * 0.06);
    });
    tl.from(stems, { scaleY: 0, duration: 0.35, stagger: 0.06 }, 0.18);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      gsap.set([...cards, ...stems, ...(axis ? [axis] : [])], { clearProps: "all" });
    };
  });

  return (
    <div ref={rootRef}>
      <DividerBand>
        {/* En móvil el CONTENEDOR es el eje: su borde izquierdo, con las seis
            colgando en orden. Seis columnas no existen a 375px, y la respuesta no
            es apilar y tirar el eje, es girarlo. Lo hace CSS solo: un cambio de
            layout que dependiera de JS dejaría la sección sin eje mientras carga. */}
        <div
          ref={countRef}
          className="flex flex-col gap-5 border-l border-ink pl-5 lg:grid lg:grid-cols-6 lg:grid-rows-[1fr_1px_1fr] lg:gap-x-8 lg:gap-y-0 lg:border-l-0 lg:pl-0"
        >
          <span
            data-axis
            aria-hidden="true"
            className="hidden origin-left border-t border-ink lg:col-span-full lg:row-start-2 lg:block"
          />

          {PROOF.map((stat, i) => (
            <div key={stat.id} data-card className={`flex min-w-0 flex-col gap-1 ${PLACE[i]}`}>
              <span
                data-stem
                aria-hidden="true"
                className={`hidden h-3 w-px origin-center bg-rule lg:block ${STEM[i]}`}
              />
              <p data-count={stat.value} className="text-h4 tabular-nums">
                {stat.value}
              </p>
              <p className="uppercase text-micro-mono text-gray-intermediate">{stat.label}</p>
            </div>
          ))}
        </div>
      </DividerBand>
    </div>
  );
}
