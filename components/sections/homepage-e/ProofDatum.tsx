"use client";

import Container from "@/components/primitives/Container";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS, EASE_OUT } from "@/components/primitives/motion/motionTokens";
import { EASE } from "@/components/sections/homepage-e/motion";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { useRevealGate } from "@/components/sections/homepage-fold/SectionReveal";
import { PROOF_STATS } from "@/components/sections/homepage-e/homepageUpdateContent";

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
  // El gate de la transición que revela esta sección, si es que hay una.
  //
  // `null` es el caso normal —cinco de las seis vistas la montan suelta— y ahí
  // todo sigue exactamente igual que antes. Cuando existe, la escena deja de
  // decidir sola cuándo entrar: el velo que la tapa es quien le da paso, porque
  // es el único que sabe si se la está viendo.
  const gate = useRevealGate();

  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk }) => {
    if (!motionOk) return;

    const axis = q("[data-axis]")[0];
    const stems = q("[data-stem]");
    const cards = q("[data-card]");
    if (cards.length === 0) return;

    // Con gate, el timeline nace en pausa y sin trigger propio: un `top 75%`
    // dispararía mientras el velo todavía cubre la pantalla, que es justo el
    // fallo que la transición viene a cerrar. Sin gate, el trigger de siempre.
    const tl = gsap.timeline({
      defaults: { ease: EASE_OUT },
      paused: !!gate,
      scrollTrigger: gate
        ? undefined
        : { trigger: scope, start: "top 75%", once: true, markers: DEBUG_MARKERS },
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

    // ── Las cifras se CUENTAN ────────────────────────────────────────────
    //
    // Son datos, y un dato que sube hasta su valor dice algo que el mismo
    // número quieto no dice: que hay una magnitud detrás. La cuenta arranca
    // junto con el renglón de su ficha y termina antes que él —el número ya
    // está cuando el movimiento de entrada todavía frena—, así que se lee como
    // una cifra que aterriza, no como un contador de aeropuerto.
    //
    // Solo cuentan las que tienen número: "Quantum-" y "Confi" no son cifras y
    // se quedan como están. El prefijo y el sufijo se conservan literales
    // (`$`, `%`, " Million", los espacios) porque son parte del diseño de la
    // cifra — ver el docblock de `value`/`accent` en el contenido.
    //
    // `snap: 1` para que ningún frame muestre "0.37 Million": el valor
    // intermedio de un contador tiene que ser un valor posible.
    const counted: [HTMLElement, string][] = [];

    cards.forEach((card, i) => {
      const el = card.querySelector<HTMLElement>("[data-count]");
      const parts = el?.textContent?.match(/^(\D*)(\d[\d.,]*)(.*)$/s);
      if (!el || !parts) return;
      counted.push([el, el.textContent ?? ""]);

      const [, prefix, digits, suffix] = parts;
      const target = Number(digits.replace(/,/g, ""));
      if (!Number.isFinite(target)) return;

      const box = { n: 0 };
      tl.to(
        box,
        {
          n: target,
          duration: 1.1,
          ease: EASE.out,
          snap: { n: 1 },
          onUpdate: () => {
            el.textContent = `${prefix}${Math.round(box.n).toLocaleString("en-US")}${suffix}`;
          },
          // El valor final se escribe LITERAL y no formateado: `toLocaleString`
          // de 100 da "100", pero de 1000 daría "1,000" y la copy podría no
          // llevar la coma. Al terminar, lo que se ve es exactamente lo que
          // dice el contenido.
          onComplete: () => {
            el.textContent = `${prefix}${digits}${suffix}`;
          },
        },
        0.25 + i * 0.18
      );
    });

    tl.from(stems, { scaleY: 0, duration: 0.45, stagger: 0.08 }, 0.2);

    // Reversible, como el velo: si el lector sube y el negro vuelve a tapar, la
    // escena se rebobina a cubierto y se la ve entrar otra vez al bajar. Un
    // `once` acá dejaría el segundo pase con la cortina abriéndose sobre algo ya
    // montado — que es el pop original, solo que a partir de la segunda vuelta.
    const unsubscribe = gate?.subscribe(
      (instant) => {
        if (tl.progress() !== 0 || tl.isActive()) return;
        if (instant) tl.progress(1).pause();
        else tl.play();
      },
      () => {
        if (tl.progress() !== 0 || tl.isActive()) tl.pause(0);
      }
    );

    return () => {
      unsubscribe?.();
      tl.scrollTrigger?.kill();
      tl.kill();
      // `lines` y no `cards`: desde que la entrada mueve los renglones, la que
      // queda con estilos inline es cada `<p>`. Limpiar los `<article>` dejaría
      // seis fichas en `opacity: 0` para siempre — y en dev pasa en cada mount
      // por StrictMode, no solo al navegar.
      gsap.set([...lines, ...stems, ...(axis ? [axis] : [])], { clearProps: "all" });
      // Las cifras no son un estilo: `clearProps` no las devuelve. Si el
      // desmontaje cae a mitad de la cuenta —en dev pasa en cada mount por
      // StrictMode— el `<span>` se queda con el número intermedio, y React no
      // lo reescribe porque su árbol no cambió.
      counted.forEach(([el, text]) => {
        el.textContent = text;
      });
    };
  }, [gate]);

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
                {/* El tramo en tinta va en su propio `<span>` para que la cuenta
                    pueda escribirle el texto sin tocar el acento verde, que es
                    un hermano y no lleva número. Sin el span habría que
                    manipular nodos de texto sueltos del `<p>`. */}
                <span data-count>{stat.value}</span>
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
