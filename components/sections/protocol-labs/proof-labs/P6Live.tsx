"use client";

import { gsap } from "@/components/primitives/motion/gsapClient";
import { MQ } from "@/components/primitives/motion/motionTokens";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { useCountUp } from "@/components/sections/protocol-labs/countUp";
import DividerBand from "@/components/sections/protocol-labs/proof-labs/DividerBand";
import { PROOF } from "@/components/sections/protocol-labs/protocolContent";

// P6 · Live — la juntura como panel de instrumentos.
//
// ── La tesis ────────────────────────────────────────────────────────────────
//
// Tres de las seis cifras —block time, finalidad y número de shards— son
// consultables contra el RPC público de NEAR en cualquier momento, y sin embargo
// están escritas a mano. Una franja que muestre el valor REAL de ahora dice algo
// que ninguna otra variante puede decir: no "la red hace esto", sino "la red está
// haciendo esto". Para una página cuyo argumento es "cinco años sin caerse", es
// la prueba más fuerte disponible, y la única que se verifica sola.
//
// ── Por qué es la única oscura, y qué cuesta ──────────────────────────────
//
// Como divider, el corte a negro entre el crema del hero y el blanco de lo que
// sigue es el más marcado de las ocho: separa de verdad. Y el negro es donde la
// rampa verde de la marca funciona mejor, que es lo que hace legible una lectura
// de instrumento.
//
// El costo es de ritmo y no se ve en esta banda sino en la página entera: el acto
// central y el cierre ya son oscuros, y son escasos a propósito. Un tercer negro
// —y encima en la primera juntura— le baja el rango a los otros dos.
//
// ── Esta versión NO está conectada, y eso se dice en pantalla ─────────────
//
// El rótulo `sample · not connected` está en el componente, no en un comentario.
// **Un panel que aparenta datos en vivo sin estarlo es engañoso**, y el prototipo
// existe para discutir si vale la pena conectarlo — no para fingir que ya lo
// está.
//
// El contador cuenta UNA vez al entrar y se queda quieto: eso es una animación de
// ENTRADA («esto se está cargando»), no una simulación de lectura en vivo («esto
// está cambiando ahora»), que sería inventar un dato. El indicador late sin que
// ningún número lo acompañe.
//
// Si se conecta, el contador se queda tal cual —sirve igual para el primer valor
// recibido— y lo que se agrega es la actualización posterior, con un **fallback
// obligatorio** a los valores estáticos: una franja que se rompe cuando el
// endpoint falla convierte el mejor argumento de la página en el peor.
export default function P6Live() {
  const countRef = useCountUp<HTMLDListElement>();

  const rootRef = useGsapContext<HTMLDivElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      // Un latido, no un contador: el indicador dice que hay señal; los números
      // no se tocan porque no hay ninguna lectura real detrás de ellos.
      const tween = gsap.to(q("[data-pulse]"), {
        opacity: 0.25,
        duration: 1.1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      return () => tween.kill();
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={rootRef}>
      <DividerBand tone="ink">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-baseline lg:justify-between lg:gap-12">
          {/* El estado a la izquierda y las lecturas a la derecha, en una sola
              línea en desktop: es la forma de una barra de estado, y es lo que
              hace que las cifras se lean como instrumento y no como titulares. */}
          <p className="flex shrink-0 items-center gap-3">
            <span
              data-pulse
              aria-hidden="true"
              className="size-2 rounded-full bg-[color:var(--near-green-accent)]"
            />
            <span className="uppercase text-micro-mono text-cream/60">Mainnet · live</span>
            <span className="uppercase text-micro-mono text-cream/35">sample · not connected</span>
          </p>

          <dl ref={countRef} className="flex flex-wrap items-baseline gap-x-9 gap-y-3">
            {PROOF.map((stat) => (
              <div key={stat.id} className="flex items-baseline gap-2">
                <dd data-count={stat.value} className="text-h4-mono tabular-nums text-cta-mint">
                  {stat.value}
                </dd>
                <dt className="uppercase text-micro-mono text-cream/45">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </DividerBand>
    </div>
  );
}
