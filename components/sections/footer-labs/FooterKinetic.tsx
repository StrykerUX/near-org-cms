"use client";

import Container from "@/components/primitives/Container";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import {
  FooterHeadlineLines,
  FooterLegal,
  FooterLinks,
  FooterWordmark,
} from "./FooterParts";
import FooterStaticFallback from "./FooterStaticFallback";

// 05 · Kinetic — footer editorial en flujo, que se construye de abajo hacia
// arriba.
//
// ── La idea ────────────────────────────────────────────────────────────────
//
// No tapa nada y no pide scroll extra: ocupa su alto y entra una vez. Lo que
// cambió respecto de la primera versión es el ORDEN, y con él lo que el gesto
// cuenta: primero sube el fondo negro desde el borde inferior, después aparece
// el wordmark, y recién entonces llega el contenido. El footer se construye
// desde su base en vez de mostrarse entero y decorarse.
//
// Ese orden es también el que evita el momento raro de la versión anterior: el
// texto blanco existía antes que el negro sobre el que se lee.
//
// ── Cuatro tiempos, una sola timeline ──────────────────────────────────────
//
//   0.00  el fondo sube          `clip-path: inset()` desde abajo
//   0.55  el wordmark se descubre  barrido lateral, borde duro
//   0.85  el titular, por líneas   máscaras propias, escalonadas
//   1.05  columnas y legal         stagger
//
// Los tiempos son propios y no un `scrub`: es la única de las seis en flujo que
// se anima sola. Un footer que se re-arma cada vez que el lector sube dos
// líneas y vuelve a bajar es ruido, así que `once: true` y listo — entra y se
// queda en su estado final.

export default function FooterKinetic() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk, isDesktop }) => {
    if (!motionOk || !isDesktop) return;

    const bg = q("[data-bg]")[0];
    const wordmark = q("[data-wordmark]")[0];
    const lines = q("[data-line]");
    const cols = q("[data-col]");
    const legal = q("[data-legal]")[0];
    if (!bg || !wordmark || lines.length === 0) return;

    // Los estados iniciales van por `gsap.set` y no en CSS: si el bundle no
    // carga, el footer se ve entero en vez de quedarse invisible para siempre.
    // Es el mismo criterio que `useScrollReveal` documenta para su `.from()`.
    gsap.set(bg, { clipPath: "inset(100% 0% 0% 0%)" });
    gsap.set(wordmark, { clipPath: "inset(0% 100% 0% 0%)" });
    gsap.set([...lines, ...cols, legal].filter(Boolean), { autoAlpha: 0, y: 30 });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: scope, start: "top 80%", once: true, markers: DEBUG_MARKERS },
    });

    // 1 · El fondo. `clip-path` y no `scaleY`: adentro vive el wordmark, y un
    // escalado lo deformaría — el clip solo mueve el borde del recorte.
    tl.to(bg, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "power3.out" }, 0);

    // 2 · El wordmark, con un barrido de borde DURO. Se usa clip y no una
    // máscara con gradiente a propósito: un degradado lo convertiría en un fade
    // y perdería el parentesco con el corte del fondo que lo acaba de revelar.
    tl.to(wordmark, { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power4.inOut" }, 0.55);

    // 3 · El titular, línea por línea, cada una desde debajo de su máscara.
    tl.to(lines, { autoAlpha: 1, y: 0, duration: 0.85, ease: "power3.out", stagger: 0.12 }, 0.85);

    // 4 · Columnas y legal.
    tl.to(cols, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.07 }, 1.05);
    if (legal) tl.to(legal, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" }, 1.3);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      gsap.set([bg, wordmark, ...lines, ...cols, legal].filter(Boolean), {
        clearProps: "clipPath,transform,opacity,visibility",
      });
    };
  });

  return (
    <footer ref={rootRef} className="relative z-30 text-cream">
      <div className="lg:motion-safe:hidden">
        <FooterStaticFallback />
      </div>

      {/* El fondo negro, en su propia capa. Es lo que sube primero, así que no
          puede ser el `background` del footer: tiene que ser un elemento
          recortable. Va detrás de todo el contenido. */}
      <div data-bg aria-hidden="true" className="absolute inset-0 z-0 hidden bg-ink lg:motion-safe:block" />

      <div className="relative z-[1] hidden lg:motion-safe:block">
        <Container
          style={{ "--links": "48rem" } as React.CSSProperties}
          className="grid gap-20 pt-32 lg:grid-cols-[minmax(0,1fr)_minmax(0,var(--links))] lg:gap-28">
          <FooterHeadlineLines dark className="text-h1" />
          <FooterLinks dark itemAttr="data-col" />
        </Container>

        <Container className="pb-8 pt-24">
          <div data-legal>
            <FooterLegal tone="dark" />
          </div>
        </Container>

        <div data-wordmark>
          <FooterWordmark invert alt="NEAR" />
        </div>
      </div>
    </footer>
  );
}
