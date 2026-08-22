"use client";

import { gsap } from "@/components/primitives/motion/gsapClient";
import { MQ } from "@/components/primitives/motion/motionTokens";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { useCountUp } from "@/components/sections/protocol-labs/countUp";
import { PROOF } from "@/components/sections/protocol-labs/protocolContent";

// P4 · Ticker — la cinta.
//
// ── La tesis, y por qué el rol de divider le sienta ───────────────────────
//
// De las ocho, es la que ya era una juntura antes de que se lo pidiéramos: una
// línea a sangre, de un renglón, que separa dos bloques y se mueve. En una página
// cuyo argumento es "esto lleva cinco años sin caerse", que la prueba se desplace
// sola dice algo que un cuadro quieto no puede decir.
//
// Es también la única que **cruza los dos bordes de la página**. El resto respeta
// el `Container`, así que sus cifras se alinean con la retícula del hero y de lo
// que sigue; ésta se sale a propósito, porque una cinta que empieza y termina
// dentro del margen deja de leerse como cinta. Ese es su costo de sistema: rompe
// la alineación de columnas justo en el punto donde el hero se la pasa a la
// sección siguiente.
//
// ── Lo que se arriesga, y es serio ────────────────────────────────────────
//
// **Un ticker se mira, no se lee.** Nadie va a retener "1.2s de finalidad" de una
// cinta en movimiento: el formato comunica vitalidad y sacrifica comprensión. Si
// estas seis cifras son el argumento de la página —y lo son—, esta variante las
// convierte en textura. Sólo sirve si la prueba real vive en otro lado.
//
// El contador empeora eso: un número que cuenta DENTRO de algo que se desplaza es
// doblemente difícil de leer. Dura 0.9s —la mitad que en el resto— para que
// termine antes de que la cinta avance un tercio de su recorrido. Si marea, la
// conclusión no es afinar la duración: es que la variante y el contador quieren
// cosas distintas.
//
// ── Cómo se mueve ──────────────────────────────────────────────────────────
//
// La lista se renderiza DOS veces y el track se desplaza un 50%: al llegar, la
// segunda copia está exactamente donde estaba la primera, así que el reinicio es
// invisible sin medir nada. GSAP y no `@keyframes` — se borraron de `globals.css`
// justamente por esto.
//
// Con `prefers-reduced-motion` no se crea el tween: la cinta queda quieta y
// legible en su primera copia. La segunda es `aria-hidden`, así que un lector de
// pantalla escucha las seis cifras una sola vez.
export default function P4Ticker() {
  const countRef = useCountUp<HTMLDivElement>({ duration: 0.9, stagger: 0.05 });

  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const track = q("[data-track]")[0];
      if (!track) return;
      const tween = gsap.to(track, { xPercent: -50, duration: 38, ease: "none", repeat: -1 });
      return () => tween.kill();
    });

    return () => mm.revert();
  }, []);

  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-baseline gap-14 px-7">
      {PROOF.map((stat) => (
        <li key={stat.id} className="flex shrink-0 items-baseline gap-2.5">
          <span data-count={stat.value} className="text-h4 tabular-nums">
            {stat.value}
          </span>
          <span className="uppercase text-micro-mono text-gray-intermediate">{stat.label}</span>
        </li>
      ))}
    </ul>
  );

  // No usa `DividerBand`: necesita `overflow-hidden` en la sección para recortar
  // la cinta contra los bordes, y el marco compartido no lo lleva —ningún otro lo
  // necesita, y un `overflow` que no hace falta es lo que rompe un sticky más
  // arriba en la página—. Los bordes y el alto sí se replican a mano para que el
  // divider mida lo mismo que los otros siete.
  return (
    <section
      ref={rootRef}
      className="overflow-hidden border-y border-rule bg-background py-8 text-foreground lg:py-10"
    >
      <div ref={countRef} data-track className="flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
