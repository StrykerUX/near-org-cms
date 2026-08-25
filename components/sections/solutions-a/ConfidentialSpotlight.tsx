"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import CtaPill from "@/components/primitives/CtaPill";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { MQ, EASE_OUT } from "@/components/primitives/motion/motionTokens";
import { CTA_RAMP } from "@/components/primitives/motion/motionColors";
import { SPOTLIGHT } from "@/components/sections/solutions/solutionsContent";

// §4 — el único corte duro de la propuesta A.
//
// ── Por qué el spotlight y no otra sección ────────────────────────────────
//
// La página tiene UNA sección oscura, así que hay que gastarla bien. Se la lleva
// Confidential Intents por lo que es dentro del contenido: no es un sexto bloque
// de soluciones, es confidencialidad APLICADA al movimiento de valor — el puente
// entre las dos familias que el copy nunca declara. Ponerla en el índice
// pegado la habría convertido en un hermano más de los cinco; acá el cambio de
// suelo dice que es de otro orden sin escribirlo.
//
// ── Cómo llega el negro: de golpe ─────────────────────────────────────────
//
// Sin transición. El crema termina, el negro empieza, y el corte ES el gesto —
// como pasar la página de una revista.
//
// No era el plan. Acá hubo un `InkCurtain`: un panel `fixed` del tamaño del
// viewport, recortado con `clip-path` y atado al scroll, que subía tapando el
// crema con la gramática del takeover del footer. Se descartó, y el motivo no
// se arregla afinando el número: **un panel opaco a pantalla completa ES una
// pantalla vacía mientras dure**. Se acortó su recorrido de 1357px a 620 y el
// síntoma no se movió, porque lo que se ve durante el gesto es un rectángulo de
// un color plano y, por encima de su borde, el aire de la sección que viene.
//
// El intento siguiente fue hacer que el gesto lo hicieran las secciones —la de
// arriba quieta en `sticky bottom-0`, ésta subiéndole por encima— para tener
// contenido a los dos lados del borde. No funciona con `bottom`: la spec
// constriñe el borde INFERIOR de una caja sticky a no bajar del viewport, o sea
// que empuja el elemento hacia ARRIBA, y las tres secciones saltaron al tope de
// la página. Retenerlas de verdad pide un `top` negativo del alto de cada
// sección menos el viewport — un número por sección, medido en JS y re-medido
// en cada resize. Demasiada máquina para un cambio de fondo.
//
// Así que el corte seco: es el único que no tiene forma de dejar la pantalla
// en blanco, porque no ocupa ningún tramo de scroll.
//
// ── Cómo se gana el corte ─────────────────────────────────────────────────
//
// No solo por el fondo. Lo que la separa del resto de la página es el salto de
// escala del titular (`text-statement`, un escalón por encima de cualquier otro
// heading de A) y el aire vertical grande. El color solo la enmarca.
//
// El reparto es de dos columnas, y esa fue una corrección: la primera versión
// centraba todo en `col-start-3 span-8` con la figura DEBAJO del cuerpo, y
// dejaba la mitad derecha de una sección oscura vacía mientras la sección crecía
// a lo alto sin motivo. El argumento y su dibujo tienen que leerse a la vez —eso
// es lo que un spotlight hace.
//
// ── El trigger va en la SECCIÓN, no en su primer elemento ─────────────────
//
// Es al revés que en el resto de la página, y no es un descuido. Todas las demás
// secciones cuelgan de su primer elemento animado porque el aire vertical de la
// sección haría disparar el trigger fuera de cuadro. Acá el que manda es otro
// factor: la cortina tapa el viewport hasta que el borde superior de esta
// sección toca el techo, así que ése —`top top` sobre la sección— es el único
// punto que coincide con «el lector ya puede ver esto».
//
// ── Una sola vez y sin scrub ──────────────────────────────────────────────
//
// Regla heredada de `ForwardTurn`: todo el resto de la página se mueve atado a
// la rueda, y acá el lector deja de manejar. Un scrub la convertiría en una
// sección más haciendo lo que le dicen.
//
// «Una sola vez» se escribe `toggleActions: "play none none none"` y **nunca**
// `once: true`, en toda esta propuesta. El motivo está documentado entero en
// `components/primitives/motion/useScrollReveal.ts`: `once` no es «no repetir»,
// es «matarse al terminar de cruzar», y matarse desde adentro del recorrido que
// otro ScrollTrigger hace del array global lo rompe con
// `Cannot read properties of undefined (reading 'end')`. Esta sección es de las
// que más lo provoca, porque su rango entero queda por encima del scroll apenas
// el lector pasa al muro.

// ── La figura: divulgación selectiva ──────────────────────────────────────
//
// Una fila de transacciones. Todas veladas menos una, que se revela. Es
// literalmente lo que dice el copy —«out of public view, with selective
// disclosure when institutions need it»— y es lo único que esta sección dibuja.
//
// El velado NO es un blur: es una barra partida en segmentos cortos, o sea el
// aspecto que tiene un dato ilegible, no el de un dato desenfocado. Un blur
// sugiere «no se ve bien»; los segmentos sugieren «hay algo y no sabés qué», que
// es lo que la confidencialidad hace.
const ROWS = 7;
const REVEALED = 3;
const W = 620;
const ROW_H = 26;
const H = ROWS * ROW_H;

// Anchos deterministas: `Math.sin` sobre el índice y nunca `Math.random()` en
// módulo, que daría un markup distinto en servidor y en cliente y rompería la
// hidratación.
const rowWidth = (i: number) => 0.52 + (Math.sin(i * 12.9898) * 0.5 + 0.5) * 0.42;

export default function ConfidentialSpotlight() {
  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add({ motionOk: MQ.motion }, (mctx) => {
      const { motionOk } = mctx.conditions as { motionOk: boolean };

      const items = q("[data-spot-item]");
      const masked = q("[data-spot-masked]");
      const clear = q("[data-spot-clear]");

      if (!motionOk) {
        gsap.set([items, masked, clear], { clearProps: "all" });
        return;
      }

      // El trigger cuelga del PRIMER elemento animado, no de la sección: la
      // sección lleva `py-[18svh]` de aire antes del eyebrow, y anclado a ella
      // el disparo cae mientras el contenido todavía está fuera de cuadro.
      //
      // (Con la cortina esto tuvo que ser `top top`, porque hasta ese instante
      // no se veía nada. Sin cortina, la sección sube a la vista de verdad y el
      // anclaje normal vuelve a ser el correcto.)
      const tl = gsap.timeline({
        defaults: { ease: EASE_OUT },
        scrollTrigger: { trigger: items[0], start: "top 85%", toggleActions: "play none none none" },
      });

      tl.from(items, { autoAlpha: 0, y: 22, duration: 0.55, stagger: 0.08 }, 0)
        // Las filas veladas entran primero y todas iguales: hasta acá no hay
        // nada que distinga a ninguna, que es el punto de partida.
        .from(masked, { autoAlpha: 0, scaleX: 0, transformOrigin: "left", duration: 0.4, stagger: 0.045 }, 0.26)
        // Y recién entonces una se revela. Llega sola y al final, porque el
        // sentido del dibujo es el contraste con las otras seis — apareciendo
        // junto a ellas no habría contraste que ver.
        .from(clear, { autoAlpha: 0, duration: 0.45 }, 0.7);
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      data-nav-dark
      className="bg-ink-slate py-[18svh] text-white"
    >
      <Container>
        {/* Dos columnas, no una centrada.
            La primera versión metía todo en `col-start-3 span-8` con la figura
            DEBAJO del cuerpo, y eso dejaba la mitad derecha de una sección
            oscura completamente vacía mientras la sección crecía a lo alto sin
            necesidad. Repartido, el argumento y su dibujo se leen a la vez —que
            es lo que un spotlight tiene que hacer— y la sección deja de medir
            dos pantallas. */}
        <div className="grid-ds items-center gap-y-16">
          <div className="col-span-12 lg:col-span-5">
            <p data-spot-item className="text-caption-mono uppercase text-white/40">
              {SPOTLIGHT.eyebrow}
            </p>

            <h2 data-spot-item className="mt-8 max-w-[16ch] text-statement text-pretty">
              Give your users
              <br />
              <Accent display>confidentiality</Accent>
            </h2>

            <p data-spot-item className="mt-10 max-w-[46ch] text-body-lg text-white/70 text-pretty">
              {SPOTLIGHT.body}
            </p>

            <div data-spot-item className="mt-14">
              <CtaPill href={SPOTLIGHT.link.href} tone="solid" external>
                {SPOTLIGHT.link.label}
              </CtaPill>
            </div>
          </div>

          {/* ── la figura ─────────────────────────────────────────────────
              Columna propia. Es el único dibujo de la sección y dice
              literalmente lo que el cuerpo afirma —«out of public view, with
              selective disclosure»—: siete transacciones veladas, una legible.

              El velado NO es un blur: son segmentos cortos, o sea el aspecto de
              un dato ILEGIBLE y no el de un dato desenfocado. Un blur sugiere
              «no se ve bien»; los segmentos sugieren «hay algo y no sabés qué»,
              que es lo que la confidencialidad hace. */}
          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="w-full overflow-visible"
              aria-hidden="true"
            >
              {Array.from({ length: ROWS }, (_, i) => {
                const y = i * ROW_H + ROW_H / 2;
                const width = rowWidth(i) * W;

                if (i === REVEALED) {
                  return (
                    <g key={i} data-spot-clear>
                      <rect x="0" y={y - 4} width={width} height="8" rx="4" fill={CTA_RAMP[0]} />
                      {/* El punto al final es lo único que dice «esta se puede
                          leer entera». Sin él, la barra verde solo se distingue
                          por color y podría leerse como «esta está resaltada». */}
                      <circle cx={width + 14} cy={y} r="3.5" fill={CTA_RAMP[0]} />
                    </g>
                  );
                }

                // Los segmentos: trozos cortos con hueco, el aspecto de un dato
                // ilegible. `strokeDasharray` en vez de N rects sueltos porque
                // son decorativos y no hay nada que animar por segmento.
                return (
                  <line
                    key={i}
                    data-spot-masked
                    x1="0"
                    y1={y}
                    x2={width}
                    y2={y}
                    stroke="#ffffff"
                    strokeOpacity="0.22"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="3 11"
                  />
                );
              })}
            </svg>
          </div>
        </div>
      </Container>
    </section>
  );
}
