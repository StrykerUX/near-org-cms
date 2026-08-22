"use client";

import Container from "@/components/primitives/Container";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS, EASE_OUT } from "@/components/primitives/motion/motionTokens";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { PROOF_STATS } from "@/components/sections/homepage-update/homepageUpdateContent";

// Un eje y seis marcas. Las pruebas cuelgan de una línea que cruza el ancho
// completo, alternando arriba y abajo, y cada una baja hasta el eje por su
// propio tallo.
//
// Reemplaza al `ProofStepper`, que gastaba 325svh —cinco pasos de 45svh más un
// viewport pegado— para entregar cinco datos de a uno. Acá las seis se ven de
// un vistazo, desde el primer frame, y la sección mide lo que mide su contenido.
//
// ── De dónde sale, y por qué es una copia ────────────────────────────────────
//
// Es la versión **B · Datum** de `components/sections/proof-alt/`, el
// laboratorio donde se compararon tres estructuras para estas mismas seis
// pruebas. Se copió y no se importa, y eso lo pide el README de esa carpeta:
// es un laboratorio, su contenido puede cambiar o borrarse sin aviso, y ya pasó
// dos veces. Los datos vienen de `homepageUpdateContent.ts` por el mismo motivo.
//
// ── El cambio respecto del lab: las fichas son más anchas, y desfasadas ─────
//
// En el lab la retícula es de SEIS columnas y cada ficha ocupa una, o sea un
// sexto del ancho. A esa medida la cifra queda apretada y quiebra de línea en
// casi todas — el propio README del lab lo anota como el precio de esta versión.
//
// Acá la retícula es de TRECE columnas y cada ficha ocupa TRES, arrancando en
// 1, 5 y 9 arriba y en 3, 7 y 11 abajo. Dos cosas salen de ahí:
//
//   · cada ficha pasa de 1/6 (16.7%) a 3/13 (23%) del ancho — con el Container
//     de la página son ~365px contra ~250px, y la cifra deja de pelear;
//   · las de abajo arrancan DOS columnas después de la de arriba que las
//     precede, así que cada una se solapa en X con sus vecinas de la otra fila
//     por un tercio de su ancho. No colisionan —están en filas distintas— y ese
//     solape parcial es lo que hace que las seis se lean intercaladas.
//
// El número de columnas parece arbitrario y no lo es: es el mínimo que deja
// hacer las dos cosas a la vez. Con un desfase de dos columnas sobre fichas de
// tres, la última de abajo arranca en 11 y termina en 13 — trece es justo lo que
// hace falta para que entre sin desbordar.
//
// El calibre de esto es el par ANCHO/DESFASE, no el ancho solo. Con fichas de
// tres y desfase de una columna el solape sube a dos tercios y las fichas se
// leen encimadas; con desfase de tres desaparece el solape y vuelven a ser dos
// filas de tres. Mover uno de los dos sin el otro rompe el efecto.
//
// El ancho total sigue siendo el del `Container`, así que la sección respira lo
// mismo que el resto de la página.
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
// Trece columnas no existen a 375px, y la respuesta no es apilar las fichas y
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
// El tramo va con `col-start`/`col-end` y no con `col-span`: el final explícito
// deja ver de un vistazo que la última llega justo a 13, que es la restricción
// que fija el número de columnas. Con `span` habría que sumar mentalmente.
const PLACE = [
  "lg:col-start-[1] lg:col-end-[4] lg:row-start-1 lg:justify-end lg:pb-5",
  "lg:col-start-[3] lg:col-end-[6] lg:row-start-3 lg:pt-5",
  "lg:col-start-[5] lg:col-end-[8] lg:row-start-1 lg:justify-end lg:pb-5",
  "lg:col-start-[7] lg:col-end-[10] lg:row-start-3 lg:pt-5",
  "lg:col-start-[9] lg:col-end-[12] lg:row-start-1 lg:justify-end lg:pb-5",
  "lg:col-start-[11] lg:col-end-[14] lg:row-start-3 lg:pt-5",
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
    //
    // Lo que se mueve son los RENGLONES, no la ficha. Animar el `<article>`
    // entero desplaza también su tallo —el `data-stem`, que ya tiene su propio
    // tween— y sobre todo mueve una caja: se lee como un panel entrando. Por
    // renglón se lee como un dato que se escribe, que es lo que estas fichas
    // son. El escalonado interno es corto (0.07) porque las tres piezas son UNA
    // ficha; el que separa fichas entre sí es el de abajo, y tiene que ser
    // claramente mayor o las seis se funden en una cortina.
    //
    // `expo.out` y no el `EASE_OUT` del timeline (`power3.out`): el renglón sale
    // disparado y frena largo, casi deteniéndose antes de llegar. `power3`
    // reparte el frenado de forma más pareja y la entrada se lee como un
    // desplazamiento; `expo` gasta más de la mitad del recorrido en el primer
    // 20% del tiempo, y lo que queda es la cola. Va con `duration` alta a
    // propósito: el tramo lento ES el gesto, y en 0.7s no se llega a ver.
    //
    // 0.18 entre fichas —más del doble que antes— para que se lean como seis
    // llegadas y no como una sola cosa que aparece de a partes.
    const lines: HTMLElement[] = [];
    cards.forEach((card, i) => {
      const rows = Array.from(card.querySelectorAll<HTMLElement>("[data-line]"));
      if (rows.length === 0) return;
      lines.push(...rows);

      tl.from(
        rows,
        {
          autoAlpha: 0,
          y: i % 2 === 0 ? -20 : 20,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.07,
        },
        0.25 + i * 0.18
      );
    });

    tl.from(stems, { scaleY: 0, duration: 0.45, stagger: 0.08 }, 0.2);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      // `lines` y no `cards`: desde que la entrada mueve los renglones, la que
      // queda con estilos inline es cada `<p>`. Limpiar los `<article>` dejaría
      // seis fichas en `opacity: 0` para siempre — y en dev pasa en cada mount
      // por StrictMode, no solo al navegar.
      gsap.set([...lines, ...stems, ...(axis ? [axis] : [])], { clearProps: "all" });
    };
  });

  // Sin `min-h-svh`: la sección mide lo que mide su contenido. Forzarla a una
  // pantalla dejaría medio viewport en blanco alrededor de un eje de 350px.
  return (
    <section
      ref={rootRef}
      className="flex flex-col justify-center bg-background py-24 text-ink lg:py-28"
    >
      {/* Sin `flex flex-col gap-10`: el `Container` tuvo dos hijos mientras el
          eyebrow "Built to" estaba arriba, y un gap entre un solo hijo y nada no
          separa nada. El "Built to" salió porque las seis fichas ya lo dicen —
          cada una empieza con esas mismas dos palabras. */}
      <Container>
        {/* En móvil el contenedor ES el eje: su borde izquierdo. En desktop ese
            borde desaparece y el eje pasa a ser el span horizontal de la fila 2. */}
        <div className="flex flex-col gap-10 border-l border-ink pl-6 lg:grid lg:grid-cols-[repeat(13,minmax(0,1fr))] lg:grid-rows-[1fr_1px_1fr] lg:gap-x-6 lg:gap-y-0 lg:border-l-0 lg:pl-0">
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
              {/* `data-line` en las tres: la entrada ya no mueve la ficha como
                  un bloque, mueve sus renglones uno detrás de otro. Van marcados
                  desde el JSX y no buscados con un selector estructural
                  (`article > p`) porque ese selector se rompe solo el día que
                  alguien agregue un cuarto párrafo o envuelva alguno en un div,
                  y lo hace en silencio: la animación sigue corriendo, con una
                  pieza de menos. */}
              <p data-line className="text-h4 text-gray-intermediate">
                {stat.eyebrow}
              </p>
              <p data-line className="text-h2-serif italic text-balance">
                {stat.value}
                <span className="text-green-ink">{stat.accent}</span>
              </p>
              <p data-line className="text-body-sm text-gray-intermediate text-pretty">
                {stat.body}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
