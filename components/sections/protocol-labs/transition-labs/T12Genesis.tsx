"use client";

import Container from "@/components/primitives/Container";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { EASE_OUT, MQ } from "@/components/primitives/motion/motionTokens";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { useCountUp } from "@/components/sections/protocol-labs/countUp";
import {
  GreenCube,
  IsoFrame,
  SolidCube,
  WireCube,
  isoAt,
  plane,
  planeGrid,
} from "@/components/sections/protocol-labs/isoKit";
import { PROOF } from "@/components/sections/protocol-labs/protocolContent";

// T12 · Genesis — el objeto de la página se arma por primera vez. ~90svh
//
// ── La idea ─────────────────────────────────────────────────────────────────
//
// El acto central de la página está protagonizado por una plancha isométrica de
// diez shards que cambia de estado seis veces. Esta transición es su **nacimiento**:
// el plano vacío, los diez shards apareciendo uno a uno, el privado apoyándose al
// final. Las seis cifras se escriben al costado mientras eso pasa.
//
// El sentido narrativo es el que ninguna otra de las doce puede dar: la
// transición deja de ser un intervalo y pasa a ser el prólogo del acto. Cuando el
// lector llegue allá, la pieza ya le fue presentada — y su primera aparición fue
// exactamente la prueba de que la red existe.
//
// ── Por qué la plancha se dibuja acá y no se importa de `machineArt` ─────
//
// Porque tiene que MOVERSE por partes, y ese archivo entrega la pieza entera con
// sus capas conmutadas por `data-beat`. Animar sus cubos de a uno pediría hooks
// por cubo que sólo esta variante necesita, y agregárselos volvería a
// `machineArt` responsable de una coreografía que no es suya. Las dos versiones
// comparten lo único que no puede divergir: la proyección y las piezas de
// `isoKit`.
//
// Si esta variante gana, lo correcto no es unificar los dos archivos: es que
// `machineArt` exponga un estado "vacío" y que esta escena lo llene.
//
// ── El orden de aparición no es aleatorio ─────────────────────────────────
//
// Los shards entran de atrás hacia adelante en el eje isométrico —el orden en que
// están dibujados— así que la plancha se construye alejándose del lector en vez
// de brotar en desorden. Con un stagger `random`, el mismo movimiento se lee como
// ruido: la profundidad isométrica sólo se sostiene si el orden la respeta.
//
// El shard privado llega último, sólido y opaco, después de una pausa. Es el
// único que no es de alambre y el único que espera.

const iso = isoAt(210, 150);
const SHARDS: Array<[number, number]> = [];
for (const y of [-16, 16]) for (const x of [-56, -28, 0, 28, 56]) SHARDS.push([x, y]);

export default function T12Genesis() {
  const countRef = useCountUp<HTMLDListElement>({ start: "top 62%", stagger: 0.08 });

  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const tl = gsap.timeline({
        defaults: { ease: EASE_OUT },
        scrollTrigger: { trigger: scope, start: "top 75%", once: true },
      });

      // El plano primero: el terreno antes que lo que se apoya en él.
      tl.from(q("[data-ground]"), { autoAlpha: 0, duration: 0.7 }, 0);
      // Los diez shards, en el orden en que están dibujados. `y` positivo: caen
      // sobre el plano, no brotan de él.
      tl.from(
        q("[data-shard]"),
        { autoAlpha: 0, y: -14, duration: 0.5, stagger: 0.07 },
        0.35
      );
      // El privado espera. La pausa es lo que lo separa de los otros diez.
      tl.from(q("[data-private]"), { autoAlpha: 0, y: -22, duration: 0.8 }, "+=0.25");
      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      data-nav-dark
      className="flex min-h-[90svh] flex-col justify-center bg-ink text-cream"
    >
      <Container className="grid items-center gap-12 py-20 lg:grid-cols-2 lg:gap-20">
        <IsoFrame viewBox="0 0 420 300" className="h-[38svh] w-full lg:h-[52svh]">
          <g data-ground>
            <path d={plane(iso, 78, -14)} className="stroke-cream/20" />
            <path d={planeGrid(iso, 78, -14, 6)} className="stroke-cream/10" />
          </g>
          {SHARDS.map(([x, y]) => (
            <g key={`${x}:${y}`} data-shard>
              <WireCube iso={iso} x={x} y={y} s={9} className="stroke-cream/45" />
            </g>
          ))}
          <g data-private>
            <SolidCube iso={iso} x={0} y={56} s={11} className="text-cream" />
            {/* El único canto encendido: la divulgación selectiva. Lo mismo que
                dice la figura del shard privado en el acto. */}
            <path
              d={`M ${iso(-11, 67, 22)} L ${iso(11, 67, 22)}`}
              className="stroke-cta-lime"
            />
          </g>
          {/* Un shard vivo entre los diez, para que la plancha no se lea apagada
              — es la red funcionando, no una maqueta. */}
          <g data-shard>
            <GreenCube iso={iso} x={0} y={-16} s={9} />
          </g>
        </IsoFrame>

        <div className="flex flex-col gap-8">
          <p className="uppercase text-eyebrow-mono text-cream/45">Ten shards, plus one</p>
          <dl ref={countRef} className="grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3">
            {PROOF.map((stat) => (
              <div key={stat.id} className="flex flex-col gap-1 border-t border-cream/20 pt-3">
                <dd data-count={stat.value} className="text-h3 tabular-nums text-cream">
                  {stat.value}
                </dd>
                <dt className="uppercase text-micro-mono text-cream/50">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}
