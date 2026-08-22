"use client";

import Container from "@/components/primitives/Container";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { EASE_OUT, MQ } from "@/components/primitives/motion/motionTokens";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { useCountUp } from "@/components/sections/protocol-labs/countUp";
import { GreenCube, IsoFrame, isoAt, plane, planeGrid } from "@/components/sections/protocol-labs/isoKit";
import { PROOF } from "@/components/sections/protocol-labs/protocolContent";

// T5 · Fan — seis planos que se despliegan. ~50svh
//
// ── La idea ─────────────────────────────────────────────────────────────────
//
// Cada cifra viaja sobre un plano isométrico, y los seis llegan APILADOS en el
// centro para abrirse en abanico. Es la primera aparición del mundo gráfico que
// después protagoniza el acto central: cuando el lector llegue allá, ya vio estas
// piezas.
//
// El gesto dice algo además de verse: seis planos que salen de uno solo es lo que
// hace la red de la que habla la página. La transición no ilustra las cifras,
// ilustra el sistema que las produce.
//
// ── Por qué se despliegan y no aparecen ───────────────────────────────────
//
// Un stagger de opacidad diría "acá hay seis cosas". El despliegue dice "acá
// había una y se volvieron seis", que es la diferencia entre decorar y explicar.
// Por eso el estado inicial es apilado en el centro y no disperso con opacidad
// cero.
//
// ── La rotación es mínima a propósito ─────────────────────────────────────
//
// Cuatro grados en las de los extremos, cero en las del medio. Un abanico
// pronunciado convierte a los planos en naipes y el eje isométrico deja de
// leerse; lo que se busca es que se abran, no que se barajen. La geometría
// isométrica no tolera rotación libre — con más de unos pocos grados los ejes de
// dos piezas vecinas dejan de coincidir y el conjunto se ve como un error de
// dibujo, no como una baraja.

const iso = isoAt(60, 34);
// Grados por posición. Mapa literal: es una decisión de composición, no una
// fórmula, y una fórmula escondería que el centro va derecho a propósito.
const TILT = [-4, -2.2, -0.8, 0.8, 2.2, 4];

export default function T5Fan() {
  const countRef = useCountUp<HTMLDivElement>({ start: "top 70%", stagger: 0.07 });

  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const cards = q("[data-card]");
      if (cards.length === 0) return;

      const tl = gsap.timeline({
        defaults: { ease: EASE_OUT },
        scrollTrigger: { trigger: scope, start: "top 80%", once: true },
      });

      // El estado inicial es APILADO: cada plano parte del centro de la fila.
      // `xPercent` en función del índice y no un valor fijo — el del extremo
      // izquierdo tiene que recorrer tres anchos y el del centro casi ninguno.
      cards.forEach((card, i) => {
        const fromCentre = i - (cards.length - 1) / 2;
        tl.from(
          card,
          {
            xPercent: -fromCentre * 100,
            rotate: -TILT[i],
            autoAlpha: 0,
            duration: 0.9,
          },
          i * 0.06
        );
      });

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
        gsap.set(cards, { clearProps: "all" });
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="flex min-h-[50svh] flex-col justify-center border-y border-rule bg-background text-foreground"
    >
      <Container className="py-14">
        <div ref={countRef} className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
          {PROOF.map((stat, i) => (
            <div
              key={stat.id}
              data-card
              style={{ rotate: `${TILT[i]}deg` }}
              className="flex flex-col items-center gap-3"
            >
              <IsoFrame viewBox="0 0 120 68" className="h-16 w-full">
                <path d={plane(iso, 30, 0)} className="stroke-ink/30" />
                <path d={planeGrid(iso, 30, 0, 3)} className="stroke-ink/12" />
                <GreenCube iso={iso} s={5} />
              </IsoFrame>
              <div className="flex flex-col items-center gap-0.5">
                <p data-count={stat.value} className="text-h3 tabular-nums">
                  {stat.value}
                </p>
                <p className="uppercase text-micro-mono text-gray-intermediate">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
