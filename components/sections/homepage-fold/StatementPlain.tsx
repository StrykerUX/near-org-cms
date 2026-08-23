"use client";

import Image from "next/image";

import Container from "@/components/primitives/Container";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { gsap, ScrollTrigger, SplitText } from "@/components/primitives/motion/gsapClient";
import { MQ } from "@/components/primitives/motion/motionTokens";
import { AGENT_ECONOMY as COPY } from "@/components/sections/homepage-e/homepageUpdateContent";

// El statement, como sección PROPIA y siempre re-legible.
//
// En `homepage-e` (y en la línea viva) esta frase vive dentro de la secuencia
// congelada del hero (`AgentEconomy`): el hero dispara, el scroll se traba ~2.2s
// y el icono viaja hasta el texto. Acá esa secuencia no existe — el hero tiene
// su propio gesto (`HeroFold`) y no le entrega nada a nadie— así que el
// statement necesita ser una sección que se sostenga sola.
//
// Acá es una sección normal de una pantalla: el icono apoyado en la baseline y
// el texto entrando línea por línea CUANDO LA SECCIÓN LLEGA, con un
// ScrollTrigger de solo lectura, `once: true`. Al volver a subir, el texto está
// ahí, quieto y entero. Sin JS o con `prefers-reduced-motion`, también.
//
// El verde del acento es el mismo literal que en el statement vivo — hoja,
// tomado del gradiente del icono; no existe en los tokens (ver la nota de
// `AgentEconomy`).
const PALETTE = {
  "--statement-accent": "#5cb946",
} as React.CSSProperties;

export default function StatementPlain() {
  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const copy = scope.querySelector<HTMLElement>("[data-statement-copy]");
      if (!copy) return;

      let split: SplitText | null = null;
      let tl: gsap.core.Timeline | null = null;
      let cancelled = false;

      // Igual que el statement vivo: el split espera a que las fuentes midan
      // (parte por LÍNEAS y una línea es geometría de fuente), y el flag cubre
      // el cleanup que corre antes de que la promesa resuelva — StrictMode lo
      // hace en cada mount de dev.
      const prepare = () => {
        if (cancelled || split) return;
        split = SplitText.create(copy, { type: "lines", mask: "lines" });
        const lines = split.lines;
        gsap.set(lines, { autoAlpha: 0, yPercent: 110 });

        tl = gsap.timeline({
          scrollTrigger: { trigger: scope, start: "top 55%", once: true },
        });
        tl.to(lines, {
          autoAlpha: 1,
          yPercent: 0,
          stagger: 0.14,
          duration: 0.85,
          ease: "power2.out",
        });
        // Si la sección YA está en cuadro cuando el split termina (recarga a
        // media página), el trigger nuevo tiene que evaluarse contra el layout
        // vigente o el texto queda apagado hasta el próximo scroll.
        ScrollTrigger.refresh();
      };

      if (document.fonts?.ready) document.fonts.ready.then(prepare).catch(prepare);
      else prepare();

      return () => {
        cancelled = true;
        tl?.scrollTrigger?.kill();
        tl?.kill();
        split?.revert();
        gsap.set(copy, { clearProps: "opacity,visibility" });
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      // Sin aire arriba, y sin `min-h` con el contenido centrado dentro.
      //
      // El statement venía de `min-h-[88svh] items-center py-24`: casi una
      // pantalla de alto con la frase flotando en el medio. Eso funcionaba
      // cuando lo anterior era un hero a sangre —el aire lo separaba de la
      // imagen—, pero acá lo que queda arriba es el lockup del pliegue sobre
      // crema, o sea el MISMO fondo. Sumados el hueco de abajo del hero y este
      // de arriba, entre una cosa y la otra quedaban casi dos pantallas de
      // crema vacío, y la frase se leía como si perteneciera a otra página.
      //
      // Queda el `pb`, que sí separa: lo que sigue es `OwnYourOwn`, que trae su
      // propio encabezado.
      className="relative overflow-hidden bg-cream pb-24 text-foreground lg:pb-32"
      style={PALETTE}
    >
      <Container>
        {/* El `@container` es la mitad del acuerdo con `--text-manifesto`, que
            mide su cuerpo en `cqw` — ver el statement vivo. */}
        <div className="@container">
          <div className="mx-auto flex w-fit items-baseline gap-[0.52em] text-manifesto">
            {/* El icono del flujo: reserva su caja y da el anclaje de baseline.
                800 es el viewBox del archivo; el tamaño real lo pone el `em`. */}
            <Image
              src="/prototype/homepage-update/near-icon.svg"
              alt=""
              aria-hidden="true"
              width={800}
              height={800}
              unoptimized
              className="h-[1.07em] w-[1.07em] shrink-0"
            />

            <h2 data-statement-copy className="max-w-[17em]">
              {COPY.body}{" "}
              {/* ds-exempt: acento más pesado que su propia frase */}
              <strong className="font-bold text-[color:var(--statement-accent)]">
                {COPY.accent}
              </strong>
            </h2>
          </div>
        </div>
      </Container>
    </section>
  );
}
