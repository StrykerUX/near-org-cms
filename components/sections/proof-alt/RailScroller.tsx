"use client";

import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { enableScene, trackTimeline } from "@/components/primitives/motion/stickyScene";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { PROOF_STATS } from "@/components/sections/proof-alt/proofAltContent";

// ── 05 · Rail ────────────────────────────────────────────────────────────────
//
// La única de las diez que consume recorrido de verdad: 200svh de track. Está
// para tener CONTRA QUÉ comparar — sin una versión que gaste scroll, "gasta
// poco scroll" no significa nada.
//
// Lo que hace con ese recorrido es lo contrario del stepper que esta sección
// viene a reemplazar: en vez de cambiar el contenido en el sitio, MUEVE la
// sección de lado. El scroll vertical se convierte en recorrido horizontal y
// las seis pruebas pasan como vagones.
//
// La diferencia práctica con el stepper: acá el lector ve siempre dos pruebas y
// media, así que las compara entre sí mientras avanza. En un stepper solo hay
// una en pantalla y comparar exige acordarse de la anterior.
//
// ── El costo real de 200svh, escrito ────────────────────────────────────────
//
// 200svh de track sobre seis paneles de 62vw son ~272vw de viaje. Eso es un
// panel cada 33svh de rueda, aproximadamente el doble de rápido que el stepper
// de home-ab7 (45svh por paso) y aun así son dos pantallas completas de scroll
// en las que la página no avanza. Ese es el precio, y es exactamente lo que hay
// que decidir si vale.
//
// ── Sticky de CSS, nunca `pin: true` ────────────────────────────────────────
//
// El track declara su alto en CSS y el ScrollTrigger solo LEE el progreso. El
// razonamiento largo —el pin-spacer contra Lenis, el ResizeObserver del
// provider, los spacers fantasma de StrictMode— está en
// `components/sections/README.md`.
//
// Consecuencia a no olvidar al editar esto: **ningún ancestro del hijo pegado
// puede tener `overflow` distinto de `visible`**. El `overflow-hidden` que
// recorta el carril va SOBRE el hijo pegado, que sí puede tenerlo.

const TRAVEL = "200svh";

export default function RailScroller() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk, isDesktop }) => {
    const lane = q("[data-lane]")[0];
    const panels = q("[data-panel]");
    if (!lane || panels.length === 0) return;

    // En móvil y con reduced-motion no hay carril: los seis paneles se leen
    // apilados en flujo normal, que es lo que el markup ya es sin el atributo.
    if (!motionOk || !isDesktop) return;

    const off = enableScene(scope, "rail");

    const tl = trackTimeline(scope, { scrub: 0.4 });

    // El destino se calcula con una función y no con un número: depende del
    // ancho del carril y del viewport, y los dos cambian con un resize o con el
    // swap de fuentes. `trackTimeline` ya pone `invalidateOnRefresh`, que es lo
    // que hace que GSAP vuelva a pedir el cálculo en vez de cachearlo.
    tl.to(lane, {
      x: () => -(lane.scrollWidth - window.innerWidth),
      ease: "none",
    });

    // Cada panel se aclara al acercarse al centro del viewport. Es lo que evita
    // que el carril se lea como una tira uniforme: hay un foco, y se mueve.
    //
    // El trigger es "horizontal" en el sentido de que mira la posición del
    // panel en pantalla, pero el scroll sigue siendo vertical — de ahí
    // `containerAnimation`, que le dice a ScrollTrigger que este elemento se
    // mueve por culpa de OTRA animación y que las posiciones hay que leerlas
    // contra ella.
    panels.forEach((panel) => {
      gsap.fromTo(
        panel,
        { opacity: 0.28 },
        {
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: panel,
            containerAnimation: tl,
            start: "left 82%",
            end: "center 52%",
            scrub: true,
          },
        }
      );
    });

    return () => {
      panels.forEach((p) => gsap.killTweensOf(p));
      tl.scrollTrigger?.kill();
      tl.kill();
      gsap.set([lane, ...panels], { clearProps: "all" });
      off();
    };
  });

  return (
    <section
      ref={rootRef}
      style={{ "--travel": TRAVEL } as React.CSSProperties}
      className="group/rail relative bg-ink text-cream data-[rail=on]:h-[calc(var(--travel)+100svh)]"
    >
      <div className="group-data-[rail=on]/rail:sticky group-data-[rail=on]/rail:top-0 group-data-[rail=on]/rail:flex group-data-[rail=on]/rail:h-svh group-data-[rail=on]/rail:flex-col group-data-[rail=on]/rail:justify-center group-data-[rail=on]/rail:overflow-hidden">
        <Container className="flex items-baseline justify-between gap-8 py-10">
          <Eyebrow className="text-cream/40">Built to</Eyebrow>
          <p className="text-caption-mono text-cream/40">06 pruebas · recorrido horizontal</p>
        </Container>

        {/* Sin el atributo de escena esto es una columna: `flex-col` es el
            estado base y `flex-row` lo enciende el efecto. Así el "sin JS" no
            queda con seis paneles en una fila que se sale de la pantalla. */}
        <div
          data-lane
          className="flex flex-col gap-12 px-[60px] group-data-[rail=on]/rail:w-max group-data-[rail=on]/rail:flex-row group-data-[rail=on]/rail:gap-0"
        >
          {PROOF_STATS.map((s, i) => (
            <article
              key={s.id}
              data-panel
              className="flex flex-col justify-between gap-10 border-cream/15 group-data-[rail=on]/rail:h-[58svh] group-data-[rail=on]/rail:w-[62vw] group-data-[rail=on]/rail:border-l group-data-[rail=on]/rail:px-16"
            >
              <div className="flex items-baseline gap-6">
                <span className="text-caption-mono text-near-green-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-h4 text-cream/70">{s.eyebrow}</p>
              </div>

              <p className="text-display-serif italic">
                {s.value}
                <span className="text-near-green-accent">{s.accent}</span>
              </p>

              <p className="max-w-[46ch] text-body-lg text-cream/60 text-pretty">{s.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
