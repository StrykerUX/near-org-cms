"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import ShineField from "@/components/primitives/ShineField";
import { gsap, SplitText } from "@/components/primitives/motion/gsapClient";
import { allowDescenders } from "@/components/primitives/motion/maskedLines";
import { DEBUG_MARKERS, EASE_OUT } from "@/components/primitives/motion/motionTokens";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { BELONGS_COPY, Wordmark } from "@/components/sections/newsletter-labs/BelongsParts";

// ── 11 · Curtain ─────────────────────────────────────────────────────────────
//
// La banda no está: se ABRE. Un telón de lima barre la sección de abajo hacia
// arriba, descubre el fondo stone a su paso, y el bloque sube detrás con las
// líneas saliendo de su propia máscara.
//
// Es la única de las once que trata la juntura como un GESTO. Las otras diez
// resuelven el corte contra las secciones vecinas con una decisión de color; esta
// lo resuelve con movimiento — que es, al final, lo que hacían las
// `StairTransition` que quedaron fuera del lab, con otro vocabulario.
//
// ── El telón sube y se va; no se queda ──────────────────────────────────────
//
// Sube cubriendo, y al llegar arriba sigue de largo y sale por el borde
// superior. Ese "sigue de largo" es lo que lo hace un telón y no un fundido: si
// se quedara arriba y se desvaneciera, el ojo lo leería como una capa que se
// apaga, no como algo que pasó por delante.
//
// El lima es el mismo de la rampa del CTA. Un barrido en un color que la página
// no usa se leería como un flash de otra marca.
//
// ── Se conduce con scroll, pero no cuesta scroll ────────────────────────────
//
// El trigger es `once` sobre la entrada de la sección, así que la apertura corre
// sola en su propio tiempo: la sección mide lo que mide y no hay track. Un scrub
// haría que el lector pudiera dejar el telón a medio camino, congelado sobre el
// contenido — que es exactamente lo que no puede pasar en una sección cuyo
// trabajo es que alguien deje su correo.

export default function Belongs11Curtain() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk }) => {
    if (!motionOk) return;

    const curtain = q("[data-curtain]")[0];
    const head = q("[data-head]")[0];
    const rest = q("[data-rise]");
    if (!curtain || !head) return;

    const split = SplitText.create(head, {
      type: "lines",
      mask: "lines",
      // La máscara mide exactamente el alto de la línea, y a los interlineados
      // cerrados de la escala display eso siega la cola de la "y" de "you" —
      // permanentemente, no solo durante el gesto.
      onSplit: (self) => allowDescenders(self.lines),
    });

    const tl = gsap.timeline({
      defaults: { ease: EASE_OUT },
      scrollTrigger: { trigger: scope, start: "top 78%", once: true, markers: DEBUG_MARKERS },
    });

    // El telón: de tapar la sección entera a haberse ido por arriba. Dos tramos
    // encadenados y no uno solo — la subida entra rápida y la salida acelera,
    // que es lo que lo hace pasar por delante en vez de deslizarse.
    // El telón vive DEBAJO de la sección (`top-full`), fuera de su
    // `overflow-hidden`. Los tres estados, en yPercent sobre esa posición:
    //   0     — reposo: debajo, invisible
    //  −100   — cubriendo la sección entera
    //  −200   — se fue por el borde superior
    tl.to(curtain, { yPercent: -100, duration: 0.55, ease: "power2.out" }, 0);
    tl.to(curtain, { yPercent: -200, duration: 0.7, ease: "power2.in" }, 0.55);

    // El titular sale de su máscara cuando el telón ya lo destapó, no antes: si
    // entra debajo del lima, el gesto se pierde y solo se ve el barrido.
    tl.from(split.lines, { yPercent: 110, duration: 0.8, stagger: 0.08 }, 0.75);
    tl.from(rest, { autoAlpha: 0, y: 18, duration: 0.7, stagger: 0.1 }, 0.95);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      split.revert();
      gsap.set([curtain, ...rest], { clearProps: "all" });
    };
  });

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden bg-stone py-24 text-ink lg:py-32"
    >
      {/* El telón arranca DEBAJO de la sección (`top-full`) y no dentro con un
          `translate-y-full`, y la diferencia no es de estilo: en Tailwind v4 esa
          clase compila a la propiedad `translate`, NO a `transform`. GSAP anima
          `yPercent` por `transform`, así que las dos se SUMAN — el telón acababa
          su recorrido "fuera por arriba" (−100%) desplazado otro +100% por la
          clase, o sea justo encima del contenido, cubriéndolo para siempre. Es
          el mismo bug que `home-ab7/NearStackV2` documenta en sus capas.
          
          Además así degrada bien: sin JS o con reduced-motion el telón se queda
          debajo, fuera del `overflow-hidden`, y no tapa nada.
          
          Sin `pointer-events` para que el campo siga siendo clicable al pasar. */}
      <div
        data-curtain
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-full z-10 h-full bg-cta-lime"
      />

      <Container className="relative flex flex-col items-center gap-8 text-center">
        <h2 data-head className="flex flex-col items-center text-h1 text-pretty">
          <Wordmark height="clamp(2rem, 1.5rem + 2.4vw, 3.6rem)" className="mb-1" />
          <Accent>{BELONGS_COPY.claim}</Accent>
        </h2>

        <p data-rise className="max-w-[46ch] text-body-lg text-ink/70 text-pretty">
          {BELONGS_COPY.body}
        </p>

        <div data-rise className="w-full max-w-[32rem]">
          <ShineField
            placeholder={BELONGS_COPY.placeholder}
            label={BELONGS_COPY.label}
            buttonLabel={BELONGS_COPY.button}
          />
        </div>
      </Container>
    </section>
  );
}
