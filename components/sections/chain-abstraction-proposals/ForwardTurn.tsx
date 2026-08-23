"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { MQ, EASE_OUT } from "@/components/primitives/motion/motionTokens";
import { CTA_RAMP } from "@/components/primitives/motion/motionColors";
import { FORWARD_BODY, FORWARD_CODA } from "@/components/sections/chain/chainContent";

// §5b — "el relevo". La versión elegida de esta sección.
//
// Se probaron tres tratamientos del mismo copy (`/prototype/chain-ab-opcion-1`,
// `-2` y `-3`), cada uno ilustrando una frase distinta. Ganó este, que toma la
// del tercer párrafo:
//
//   "The account that simplifies crypto for a person today is the account
//    an agent operates through tomorrow."
//
// Y la vuelve dibujo: dos actores distintos arriba, un solo nodo abajo. El
// nodo se dibuja UNA vez y las dos columnas bajan a él — eso es "nothing
// gets rebuilt" sin tener que decirlo debajo.
//
// ── Por qué vive acá y no adentro de una propuesta ──────────────────────
// Las tres propuestas (A, B y C) montan ESTA sección, así que meterla en la
// carpeta de cualquiera de ellas obligaría a las otras dos a importar de la
// vecina. `chain-abstraction-proposals/` ya es la carpeta común de la
// familia — es donde vive `content.ts`, el copy que las tres comparten.
//
// ── Fondo ───────────────────────────────────────────────────────────────
// Crema, como las secciones claras vecinas, y sin gradiente. El original
// de la página real (`chain/ForwardTurn.tsx`) va en blanco con un bloom
// verde y una costura crema→blanco arriba; acá esas tres cosas se caen
// juntas, porque la costura existía SOLO para disimular el cambio de
// fondo que ya no hay.
//
// Perder el blanco es perder el único respiro claro de la página — el
// comentario de `ChainAbstractionView` lo dice. La contrapartida: la
// sección tiene que ganarse el corte por composición, así que se queda con
// el aire vertical grande (`py-[22svh]`) y el salto a `text-statement`.
// Son esos dos, y no el color, los que la hacen leer como un tiempo
// aparte.
//
// ── Por qué dos columnas PARES y no texto+figura ────────────────────────
// `CompletePicture`, justo arriba, ya es texto a la izquierda y diagrama a
// la derecha. Repetir ese reparto haría que las dos secciones se leyeran
// como una sola, más larga. Acá las dos columnas pesan lo mismo porque
// son dos actores del mismo rango, no un argumento y su ilustración.

// Los dos actores. El párrafo de cada uno sale de `FORWARD_BODY`: el
// primero ("Today, people use this…") es el presente, el segundo (el giro
// hacia el software que actúa solo) es el que viene.
const ACTORS = [
  { when: "Today", who: "a person", body: 0 },
  { when: "Next", who: "an agent", body: 1 },
] as const;

// Geometría del conector, en el viewBox del SVG. Las dos líneas bajan de
// los centros de columna (25% y 75%) hasta el nodo del medio.
const W = 800;
const H = 120;
const NODE_X = W / 2;
const NODE_Y = H - 14;

export default function ForwardTurn() {
  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add({ motionOk: MQ.motion }, (mctx) => {
      const { motionOk } = mctx.conditions as { motionOk: boolean };

      const heading = q("[data-turn-heading]");
      const columns = q("[data-turn-column]");
      const lines = q("[data-turn-line]");
      const node = q("[data-turn-node]");
      const tail = q("[data-turn-tail]");

      if (!motionOk) {
        gsap.set([heading, columns, lines, node, tail], { clearProps: "all" });
        return;
      }

      // `once: true` y sin `scrub`, a propósito. Es la regla que el
      // original documenta para esta sección: todo el resto de la página
      // se mueve atado a la rueda, y acá el lector deja de manejar y la
      // sección corre a su propio ritmo. Volver a atarla a un scrub la
      // convertiría en una sección más que hace lo que le dicen.
      const tl = gsap.timeline({
        defaults: { ease: EASE_OUT },
        scrollTrigger: { trigger: scope, start: "top 70%", once: true },
      });

      tl.from(heading, { autoAlpha: 0, y: 24, duration: 0.8 }, 0)
        .from(columns, { autoAlpha: 0, y: 20, duration: 0.7, stagger: 0.18 }, 0.35)
        // Las líneas se DIBUJAN hacia el nodo. `pathLength={100}` en el
        // markup hace que el dash se pueda escribir en unidades fijas sin
        // medir el path real.
        .fromTo(
          lines,
          { strokeDasharray: 100, strokeDashoffset: 100 },
          { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut", stagger: 0.1 },
          0.9
        )
        // El nodo llega último: es el punto al que las dos bajan, así que
        // aparecer antes le sacaría el sentido al orden.
        .from(node, { scale: 0, transformOrigin: "center", duration: 0.45 }, 1.6)
        .from(tail, { autoAlpha: 0, y: 16, duration: 0.7, stagger: 0.12 }, 1.75);
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={rootRef} className="bg-cream py-[22svh]">
      <Container>
        <div className="grid-ds">
          <div className="col-span-12 lg:col-span-10 lg:col-start-2">
            <h2 data-turn-heading className="max-w-[16ch] text-statement text-pretty">
              Built for what
              <br />
              <Accent display>transacts next</Accent>
            </h2>

            <div className="mt-20 grid gap-x-12 gap-y-14 sm:grid-cols-2">
              {ACTORS.map((actor) => (
                <div key={actor.who} data-turn-column className="flex flex-col gap-6">
                  <ActorMark who={actor.who} />
                  <p className="text-caption-mono uppercase text-gray-intermediate">
                    {actor.when} · {actor.who}
                  </p>
                  <p className="text-body text-ink-soft text-pretty">
                    {FORWARD_BODY[actor.body]}
                  </p>
                </div>
              ))}
            </div>

            {/* El conector. Vive fuera de las columnas y no adentro de
                ninguna: pertenece a las dos, que es justamente lo que
                tiene que mostrar. Se oculta abajo de `sm`, donde las
                columnas se apilan y "bajar de las dos hasta un punto"
                deja de tener geometría posible. */}
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="mt-4 hidden w-full overflow-visible sm:block"
              aria-hidden="true"
            >
              {[0.25, 0.75].map((at) => (
                <path
                  key={at}
                  data-turn-line
                  d={`M ${W * at} 0 L ${W * at} ${NODE_Y - 34} Q ${W * at} ${NODE_Y} ${
                    NODE_X + (at < 0.5 ? -18 : 18)
                  } ${NODE_Y}`}
                  fill="none"
                  stroke="currentColor"
                  strokeOpacity="0.32"
                  strokeWidth="1.5"
                  pathLength={100}
                  className="text-ink"
                />
              ))}
              {/* El único acento verde de la sección, y el único objeto
                  que se dibuja una sola vez para los dos actores.
                  `CTA_RAMP[0]` es el mismo token con el que
                  `CompletePicture` pinta su punto de encuentro. */}
              <circle data-turn-node cx={NODE_X} cy={NODE_Y} r="7" fill={CTA_RAMP[0]} />
            </svg>

            <p
              data-turn-tail
              className="mt-6 text-center text-caption-mono uppercase text-gray-intermediate"
            >
              one account
            </p>

            <div className="mx-auto mt-16 max-w-[46rem]">
              <p data-turn-tail className="text-body-lg text-ink text-pretty">
                {FORWARD_BODY[2]}
              </p>
              {/* La coda: serif, sola y con aire. Es la única línea de la
                  sección que no forma parte de un párrafo. */}
              <p
                data-turn-tail
                className="mt-14 max-w-[24ch] text-h2-serif text-ink text-pretty"
              >
                {FORWARD_CODA}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

// Íconos de trazo, inline y sin dependencias: el mismo lenguaje de
// hairline que ya usan la convergencia de `CompletePicture` y la gráfica
// del `Proof`. Un set de íconos rellenos acá metería una textura que la
// página no tiene en ningún otro lado.
function ActorMark({ who }: { who: string }) {
  const person = who === "a person";
  return (
    <svg
      viewBox="0 0 48 48"
      className="h-12 w-12 text-ink"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      {person ? (
        <>
          <circle cx="24" cy="17" r="7" />
          <path d="M11 39c0-7.2 5.8-13 13-13s13 5.8 13 13" strokeLinecap="round" />
        </>
      ) : (
        <>
          <rect x="10" y="12" width="28" height="24" rx="6" />
          {[18, 24, 30].map((cx) => (
            <circle key={cx} cx={cx} cy="24" r="1.6" fill="currentColor" stroke="none" />
          ))}
        </>
      )}
    </svg>
  );
}
