"use client";

import { useRef } from "react";
import Container from "@/components/primitives/Container";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { MQ } from "@/components/primitives/motion/motionTokens";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { useCountUp } from "@/components/sections/protocol-labs/countUp";
import {
  createShardField,
  type ShardFieldHandle,
} from "@/components/sections/protocol/shardField";
import { PROOF } from "@/components/sections/protocol-labs/protocolContent";

// T3 · Seam — la costura donde la red se parte. ~26svh
//
// ── La idea ─────────────────────────────────────────────────────────────────
//
// El campo de shards de `/blockchain` —celdas que se subdividen solas— recortado
// en una banda estrecha, con las cifras encima. La juntura entre el hero y el
// contenido pasa a ser el lugar donde la red se divide, que es literalmente de lo
// que habla la página.
//
// Es la variante que más liga esta página con la publicada: mismo campo, mismo
// comportamiento, otro encuadre. Si lo que se busca es que la versión nueva se
// lea como una evolución y no como un reemplazo, es esta.
//
// ── El recorte cambia lo que el campo significa ───────────────────────────
//
// En el hero de `/blockchain` el campo ocupa una pantalla y se lee como
// atmósfera. A 26svh, con las cifras encima, se lee como una MUESTRA — una
// sección transversal del sistema, no su ambiente. Es el mismo canvas diciendo
// otra cosa por el solo hecho de estar cortado.
//
// ── Por qué se importa de la página publicada y no se copia ───────────────
//
// Son 215 líneas de canvas ya medidas, con su `destroy`. La dependencia va del
// laboratorio hacia la página real, que es la dirección aceptable; lo que el
// README padre prohíbe es la inversa. Si esta variante gana, el campo se queda
// donde está y la página nueva lo importa igual.
//
// ── El velo ────────────────────────────────────────────────────────────────
//
// El campo llega hasta el texto y le pelea contraste. En vez de bajarle el alpha
// al canvas entero —que lo apagaría también en los bordes, que es donde tiene que
// verse— se apoya el color de la página sobre la banda del texto y se desvanece
// antes de llegar al borde. Mismo criterio que el hero de `/blockchain` y que el
// card de `AgentEconomy` en la homepage.
export default function T3Seam() {
  const fieldRef = useRef<HTMLDivElement>(null);
  const countRef = useCountUp<HTMLDListElement>({ stagger: 0.06 });

  const rootRef = useGsapContext<HTMLElement>(() => {
    const mm = gsap.matchMedia();

    mm.add({ motionOk: MQ.motion }, (mctx) => {
      const { motionOk } = mctx.conditions as { motionOk: boolean };
      let field: ShardFieldHandle | null = null;
      if (fieldRef.current) field = createShardField(fieldRef.current, { motionOk });
      return () => field?.destroy();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative isolate flex min-h-[26svh] flex-col justify-center overflow-hidden border-y border-rule bg-background text-foreground"
    >
      <div ref={fieldRef} aria-hidden="true" className="absolute inset-0 z-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, color-mix(in srgb, var(--background) 82%, transparent) 28%, color-mix(in srgb, var(--background) 82%, transparent) 72%, transparent 100%)",
        }}
      />

      <Container className="relative z-20 py-9">
        <dl ref={countRef} className="grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-3 lg:grid-cols-6">
          {PROOF.map((stat) => (
            <div key={stat.id} className="flex flex-col gap-0.5">
              <dd data-count={stat.value} className="text-h4 tabular-nums">
                {stat.value}
              </dd>
              <dt className="uppercase text-micro-mono text-gray-intermediate">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
