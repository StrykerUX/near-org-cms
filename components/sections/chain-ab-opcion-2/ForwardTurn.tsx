"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { MQ, EASE_OUT } from "@/components/primitives/motion/motionTokens";
import { CTA_RAMP } from "@/components/primitives/motion/motionColors";
import { FORWARD_BODY, FORWARD_CODA } from "@/components/sections/chain/chainContent";

// §5b, opción 2 — "la línea que no se corta".
//
// De las tres frases que se podían ilustrar, esta toma la del cierre:
//
//   "Nothing gets rebuilt. The foundation was always the point."
//
// Una sola hairline cruza la sección de borde a borde y se va de cuadro
// por los dos lados. No tiene principio ni final visible, y ese es todo el
// argumento: el "over time" del copy y la "foundation" de la coda son la
// misma línea. Los tres párrafos cuelgan de tres paradas sobre ella,
// alternando arriba y abajo para que el ojo zigzaguee y la línea no se
// interrumpa nunca.
//
// ── Fondo ───────────────────────────────────────────────────────────────
// Crema y sin gradiente, igual que las otras dos opciones. El original va
// en blanco con bloom y una costura crema→blanco; acá esas tres cosas se
// caen juntas porque la costura solo existía para tapar el cambio de
// fondo. Lo que separa la sección de sus vecinas crema es el aire
// (`py-[22svh]`) y el salto a `text-statement`, no el color.
//
// ── Full-bleed ──────────────────────────────────────────────────────────
// La línea NO puede vivir adentro del `Container`: el `Container` centra y
// limita, y acá el punto es escaparse de él. Va en un div `absolute
// inset-x-0`, así que se corta contra el borde del viewport y no contra
// una medida de lectura.

// Las tres paradas. `body` indexa `FORWARD_BODY`; `at` es la posición
// sobre la línea, en porcentaje del ancho de la sección.
//
// El del medio va al 50% aunque su párrafo sea bastante más largo que los
// otros dos: la línea tiene que leerse regular, y una parada corrida para
// compensar el largo del texto haría que el eje pareciera arbitrario.
const STOPS = [
  { at: 26, label: "today", body: 0, above: false },
  { at: 50, label: "as software acts for us", body: 1, above: true },
  { at: 74, label: "tomorrow", body: 2, above: false },
] as const;

export default function ForwardTurn() {
  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add({ motionOk: MQ.motion }, (mctx) => {
      const { motionOk } = mctx.conditions as { motionOk: boolean };

      const heading = q("[data-turn-heading]");
      const rail = q("[data-turn-rail]");
      const ticks = q("[data-turn-tick]");
      const stops = q("[data-turn-stop]");
      const coda = q("[data-turn-coda]");

      if (!motionOk) {
        gsap.set([heading, rail, ticks, stops, coda], { clearProps: "all" });
        return;
      }

      // Auto-pautado y `once: true`, nunca `scrub`: es la regla que el
      // original documenta para esta sección. Todo lo de arriba se mueve
      // con la rueda; acá el lector suelta el volante.
      const tl = gsap.timeline({
        defaults: { ease: EASE_OUT },
        scrollTrigger: { trigger: scope, start: "top 65%", once: true },
      });

      tl.from(heading, { autoAlpha: 0, y: 24, duration: 0.8 }, 0)
        // La línea se dibuja de izquierda a derecha. `transformOrigin` en
        // el borde izquierdo y no en el centro: si crece desde el medio
        // hacia los dos lados deja de leerse como algo que AVANZA.
        .from(rail, { scaleX: 0, transformOrigin: "0% 50%", duration: 1.6, ease: "power2.inOut" }, 0.4);

      // Cada parada aparece cuando la línea la pasa. El offset sale de la
      // posición de la parada sobre la línea, así que mover un `at` mueve
      // también su tiempo de entrada — el sincronismo no se mantiene a
      // mano.
      STOPS.forEach((stop, i) => {
        const at = 0.4 + (stop.at / 100) * 1.6;
        tl.from(ticks[i], { scaleY: 0, transformOrigin: "50% 50%", duration: 0.3 }, at);
        tl.from(stops[i], { autoAlpha: 0, y: stop.above ? -14 : 14, duration: 0.6 }, at);
      });

      tl.from(coda, { autoAlpha: 0, y: 16, duration: 0.7 }, 2.2);
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-cream py-[22svh]">
      <Container>
        <div className="grid-ds">
          <div className="col-span-12 lg:col-span-10 lg:col-start-2">
            <h2 data-turn-heading className="max-w-[16ch] text-statement text-pretty">
              Built for what
              <br />
              <Accent display>transacts next</Accent>
            </h2>
          </div>
        </div>
      </Container>

      {/* ── El eje, de `lg` para arriba ───────────────────────────────────
          Full-bleed a propósito (ver la nota de arriba). El alto fijo es lo
          que le da lugar a los párrafos de los dos lados; la línea se
          ancla al centro de esa caja. */}
      <div className="relative mt-24 hidden h-[34rem] lg:block">
        <div
          data-turn-rail
          aria-hidden="true"
          className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-rule"
        />

        {STOPS.map((stop, i) => (
          <div key={stop.label} className="absolute inset-y-0" style={{ left: `${stop.at}%` }}>
            <span
              data-turn-tick
              aria-hidden="true"
              className="absolute left-0 top-1/2 h-4 w-px -translate-x-1/2 -translate-y-1/2"
              style={{ backgroundColor: CTA_RAMP[0] }}
            />
            {/* Cada parada se centra sobre su tick (`-translate-x-1/2`) y
                se empuja hacia arriba o hacia abajo de la línea según
                `above`.

                `flex-col-reverse` cuando va arriba: el orden del DOM es
                siempre label → párrafo (que es el orden en que se leen),
                pero una caja que crece HACIA ARRIBA deja su primer hijo en
                el extremo más lejano de la línea. Invirtiendo solo el eje
                visual, el label queda pegado al tick en los dos casos y el
                lector no tiene que buscar a qué parada pertenece.

                El del medio va más ancho: es el párrafo largo de la
                sección y a la medida de los otros dos caía en una cinta de
                doce renglones. Puede pisarlos horizontalmente sin
                problema — está del otro lado de la línea, así que nunca se
                tocan. */}
            <div
              data-turn-stop
              className={`absolute left-0 flex -translate-x-1/2 flex-col ${
                i === 1 ? "w-[30rem]" : "w-[22rem]"
              } ${stop.above ? "bottom-1/2 mb-10 flex-col-reverse" : "top-1/2 mt-10"}`}
            >
              <p
                className={`text-caption-mono uppercase text-gray-intermediate ${
                  stop.above ? "mt-3" : "mb-3"
                }`}
              >
                {stop.label}
              </p>
              <p
                className={`text-pretty ${
                  i === 1 ? "text-body-lg text-ink" : "text-body text-ink-soft"
                }`}
              >
                {FORWARD_BODY[stop.body]}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── El mismo eje, vertical, abajo de `lg` ─────────────────────────
          No es el layout de escritorio encogido: a 375px un eje horizontal
          con tres párrafos no entra de ninguna manera, y forzarlo lo
          convierte en tres cajas apretadas. La línea sigue siendo una y
          sigue sin cortarse — solo que ahora corre hacia abajo, que es la
          dirección en la que se lee la página en un teléfono. */}
      <div className="relative mt-16 lg:hidden">
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-[1.125rem] top-0 w-px bg-rule sm:left-[1.625rem]"
        />
        <Container>
          <ol className="flex flex-col gap-12">
            {STOPS.map((stop, i) => (
              <li key={stop.label} className="relative pl-10">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-2 h-px w-4"
                  style={{ backgroundColor: CTA_RAMP[0] }}
                />
                <p className="text-caption-mono uppercase text-gray-intermediate">{stop.label}</p>
                <p
                  className={`mt-3 text-pretty ${
                    i === 1 ? "text-body-lg text-ink" : "text-body text-ink-soft"
                  }`}
                >
                  {FORWARD_BODY[stop.body]}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </div>

      <Container>
        <div className="grid-ds">
          <div className="col-span-12 lg:col-span-10 lg:col-start-2">
            {/* La coda cierra centrada, ya sin eje: la línea la dejó acá y
                siguió de largo. */}
            <p
              data-turn-coda
              className="mx-auto mt-24 max-w-[26ch] text-center text-h2-serif text-ink text-pretty"
            >
              {FORWARD_CODA}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
