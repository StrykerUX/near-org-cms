"use client";

import Container from "@/components/primitives/Container";
import { gsap, ScrollTrigger, SplitText } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS, EASE_OUT } from "@/components/primitives/motion/motionTokens";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
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

/* ── El ritmo de la entrada ───────────────────────────────────────────────── */

/**
 * El respiro entre "la sección ya se ve" y "la sección empieza a llegar".
 *
 * Sin él, el contenido arranca en el mismo frame en que la cortina lo
 * descubre, y las dos cosas se pisan: no se llega a leer que primero apareció
 * el sitio y después lo que va dentro. Con el respiro son dos tiempos, y el
 * segundo se deja mirar.
 */
const LEAD = 0.34;

/** La distancia entre una marca y la siguiente. */
const CARD_STAGGER = 0.2;

/**
 * Entre letra y letra.
 *
 * Chico a propósito: por encima de ~0.03 el ojo deja de leer "una palabra
 * escribiéndose" y empieza a contar letras, que es un efecto distinto y peor.
 * La cifra usa un poco más porque son menos caracteres y más grandes.
 */
const CHAR = 0.018;

export default function ProofDatum() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk }) => {
    if (!motionOk) return;

    const axis = q("[data-axis]")[0];
    const stems = q("[data-stem]");
    const cards = q("[data-card]");
    if (cards.length === 0) return;

    let tl: gsap.core.Timeline | null = null;
    let splits: SplitText[] = [];
    let cancelled = false;

    // El split espera a que las fuentes midan. Partir por LÍNEAS es geometría
    // de fuente —dónde cae cada quiebre depende de la métrica real—, y partir
    // por CARACTERES hereda el mismo problema: con la fuente de respaldo, cada
    // letra queda envuelta en un span del ancho equivocado y el reflow al
    // cambiar la fuente deja la línea rota. Es el mismo patrón del statement.
    const build = () => {
      if (cancelled || splits.length) return;

      // Local y no `tl` a secas dentro del armado: `tl` es un `let` del scope
      // de arriba y TypeScript no lo estrecha dentro del `forEach`.
      const timeline = gsap.timeline({
        defaults: { ease: EASE_OUT },
        scrollTrigger: { trigger: scope, start: "top 75%", once: true, markers: DEBUG_MARKERS },
      });
      tl = timeline;

      // El eje se traza de un extremo al otro antes que nada: es la estructura,
      // y las marcas llegan a algo que ya está. Va ANTES del respiro, no
      // dentro: lo que el respiro separa es la llegada del contenido, y el eje
      // no es contenido.
      if (axis) timeline.from(axis, { scaleX: 0, duration: 1.05 }, 0);

      cards.forEach((card, i) => {
        // El turno de esta ficha. `LEAD` es el respiro después de que la
        // sección ya se ve; `CARD_STAGGER`, la distancia entre una marca y la
        // siguiente.
        const at = LEAD + i * CARD_STAGGER;

        const stem = stems[i];
        if (stem) timeline.from(stem, { scaleY: 0, duration: 0.45 }, at);

        // ── El rótulo, letra por letra ──────────────────────────────────
        //
        // `chars` y no `words`: son tres palabras cortas y en `text-h4`, y a
        // ese tamaño el escalonado por palabra son tres saltos que se leen
        // como tres cosas. Por letra se lee como una sola escribiéndose.
        const eyebrow = card.querySelector<HTMLElement>("[data-eyebrow]");
        if (eyebrow) {
          const s = SplitText.create(eyebrow, { type: "chars" });
          splits.push(s);
          gsap.set(s.chars, { autoAlpha: 0, y: 8 });
          timeline.to(s.chars, { autoAlpha: 1, y: 0, duration: 0.4, stagger: CHAR }, at);
        }

        // ── La cifra, letra por letra ───────────────────────────────────
        //
        // Acá vivía un CONTADOR: la cifra subía desde cero hasta su valor con
        // `snap: 1`. Se fue porque las dos cosas no pueden convivir sobre el
        // mismo texto — el contador reescribe el `textContent` en cada frame y
        // eso borra los spans que el split acaba de crear, así que la primera
        // actualización deja la cifra plana y la animación de letras muerta.
        //
        // Lo que se pierde es poco: el contador decía "hay una magnitud
        // detrás", y una cifra que se escribe dice lo mismo por otra vía. El
        // split abarca el `<p>` entero, así que el número y el acento verde
        // caen en la misma tirada de letras en vez de ser dos gestos pegados.
        const figure = card.querySelector<HTMLElement>("[data-figure]");
        if (figure) {
          const s = SplitText.create(figure, { type: "chars" });
          splits.push(s);
          gsap.set(s.chars, { autoAlpha: 0, y: 14 });
          timeline.to(
            s.chars,
            { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: CHAR * 1.4 },
            at + 0.12
          );
        }

        // ── El cuerpo, línea por línea ──────────────────────────────────
        //
        // `mask: "lines"` envuelve cada línea en un contenedor con
        // `overflow: hidden`, así que el renglón sube DESDE DEBAJO de su
        // propio hueco en vez de aparecer flotando. Sin la máscara, un
        // `yPercent` de entrada se ve pasar por encima de la línea de arriba.
        const body = card.querySelector<HTMLElement>("[data-body]");
        if (body) {
          const s = SplitText.create(body, { type: "lines", mask: "lines" });
          splits.push(s);
          gsap.set(s.lines, { autoAlpha: 0, yPercent: 100 });
          timeline.to(
            s.lines,
            { autoAlpha: 1, yPercent: 0, duration: 0.65, stagger: 0.08 },
            at + 0.26
          );
        }
      });

      // Si la sección YA está en cuadro cuando el split termina —una recarga a
      // media página—, el trigger nuevo tiene que evaluarse contra el layout
      // vigente o el texto queda apagado hasta el próximo scroll.
      ScrollTrigger.refresh();
    };

    if (document.fonts?.ready) document.fonts.ready.then(build).catch(build);
    else build();

    return () => {
      cancelled = true;
      tl?.scrollTrigger?.kill();
      tl?.kill();
      // `revert()` y no `kill()`: SplitText no es un tween, es cirugía de DOM.
      // Sin revertir, un segundo mount —StrictMode lo hace en cada uno de dev—
      // splitea sobre spans ya splitteados y multiplica el árbol.
      splits.forEach((s) => s.revert());
      splits = [];
      gsap.set([...stems, ...(axis ? [axis] : [])], { clearProps: "all" });
    };
  }, []);

  // Sin `min-h-svh`: la sección mide lo que mide su contenido. Forzarla a una
  // pantalla dejaría medio viewport en blanco alrededor de un eje de 350px.
  return (
    <section
      ref={rootRef}
      // `bg-cream` y no `bg-background`: el blanco puro se leía como una hoja
      // pegada entre dos secciones crema. `--cream` es el papel de esta página
      // —lo usan la que sigue y el `main` entero—, así que el eje y las seis
      // marcas quedan sobre el mismo fondo que todo lo demás en vez de sobre un
      // rectángulo más claro que se recorta contra sus vecinas.
      //
      // El aire crece porque esta sección es lo primero que se ve al salir del
      // negro: llegar con las fichas pegadas al borde de arriba las convierte
      // en la continuación de la transición en vez de en un respiro.
      //
      // ⚠️ El de ARRIBA está acoplado al de abajo de `StackNotesSection`, que
      // es la sección negra que precede a esta en `homepage-g`. Los dos tienen
      // que medir lo mismo para que el corte entre los dos fondos se lea
      // centrado. Cambiar uno sin el otro desbalancea la costura en silencio.
      className="flex flex-col justify-center bg-cream py-32 text-ink lg:py-44"
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
              {/* Un marcador por pieza —`eyebrow`, `figure`, `body`— y no un
                  `data-line` para las tres: cada una entra de una manera
                  distinta, así que el JS necesita distinguirlas.
                  
                  Marcados desde el JSX y no buscados con un selector
                  estructural (`article > p:first-child`) porque ese selector se
                  rompe solo el día que alguien reordene o envuelva alguno, y lo
                  hace en silencio: la animación sigue corriendo, con una pieza
                  de menos. */}
              <p data-eyebrow className="text-h4 text-gray-intermediate">
                {stat.eyebrow}
              </p>
              <p data-figure className="text-h2-serif italic text-balance">
                {/* Los dos `<span>` siguen separados aunque la cuenta se haya
                    ido: el acento va en verde y el resto en tinta, y el split
                    de caracteres respeta esa frontera — cada letra hereda el
                    color de su span. Fundidos en un solo nodo habría que
                    repintar letra por letra desde el JS. */}
                <span>{stat.value}</span>
                <span className="text-green-ink">{stat.accent}</span>
              </p>
              <p data-body className="text-body-sm text-gray-intermediate text-pretty">
                {stat.body}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
