"use client";

import Container from "@/components/primitives/Container";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { WORDMARK } from "./footerLabContent";
import { FooterHeadline, FooterLegal, FooterLinks } from "./FooterParts";
import FooterStaticFallback from "./FooterStaticFallback";

// 03 · Glyph — se entra al footer por dentro de una letra.
//
// ── La idea ────────────────────────────────────────────────────────────────
//
// El wordmark no aparece al final del takeover: ES el takeover. La pantalla
// negra está recortada con la forma del logo y esa forma crece hasta que un
// solo trazo cubre el viewport. Es el único de los seis donde el logo no se
// muestra — se atraviesa.
//
// ── Por qué no hace falta un wordmark aparte ───────────────────────────────
//
// Con `mask-size: 100%` la máscara mide exactamente el ancho del footer y se
// ancla a su borde inferior: o sea, dibuja el wordmark negro en el mismo sitio
// donde las otras cinco versiones montan la imagen. El estado de reposo de esta
// versión ya es el footer de producción. No hay dos elementos que sincronizar.
//
// El precio es un `<div>` espaciador invisible con el aspecto del asset, porque
// el panel es `absolute` y no reserva altura. Es el mismo asset, así que no
// puede desalinearse.
//
// ── Los dos números que sostienen el efecto ────────────────────────────────
//
// 1. **`mask-position: 18% 100%`.** El punto que se agranda tiene que caer
//    sobre TRAZO, no sobre una contraforma: al centro del wordmark le toca el
//    hueco entre la "e" y la "a", y ampliarlo abriría un agujero de página en
//    medio del negro. 18% cae dentro del asta de la "n".
//
//    Que ese 18% no rompa el estado de reposo es una propiedad de cómo CSS
//    resuelve `mask-position` en porcentaje: el offset es
//    `(contenedor − imagen) × p`, así que con la imagen al 100% del contenedor
//    el offset es 0 sea cual sea el porcentaje. El encuadre solo empieza a
//    importar cuando la máscara ya creció.
//
// 2. **`ease: "power2.in"` sobre un tween con scrub.** Normalmente un ease acá
//    pelea con el scrub y se evita. Este es deliberado: el área cubierta crece
//    con el CUADRADO de la escala, así que una rampa lineal de 100% a 4000% se
//    ve quieta la primera mitad y explota al final. La curva de entrada
//    compensa esa no-linealidad y devuelve un crecimiento que se percibe
//    parejo.

/** Ancho de la máscara al que un trazo ya cubre cualquier viewport razonable. */
const MASK_END = "4000%";

export default function FooterGlyph() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk, isDesktop }) => {
    if (!motionOk || !isDesktop) return;

    const mask = q("[data-mask]")[0];
    const panel = q("[data-panel]")[0];
    const bed = q("[data-bed]")[0];
    if (!mask || !panel || !bed) return;

    if (document.documentElement.scrollHeight < window.innerHeight * 2) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scope,
        start: "top bottom",
        end: "bottom bottom",
        scrub: 0.4,
        invalidateOnRefresh: true,
        markers: DEBUG_MARKERS,
      },
    });

    // Se anima una CUSTOM PROPERTY y no `maskSize` directo. Dos motivos: el
    // shorthand vive bajo dos nombres (`mask-size` y `-webkit-mask-size`) y
    // escribir los dos desde el tween duplicaría el target; y una variable es
    // un valor numérico con unidad, que es lo que GSAP interpola sin ambigüedad
    // — un shorthand de dos valores ("100% auto") no lo es.
    tl.fromTo(mask, { "--glyph": "100%" }, { "--glyph": MASK_END, duration: 1, ease: "power2.in" }, 0);

    // El negro sólido, sin máscara, que cierra el último tramo.
    //
    // No es un cinturón de seguridad: es la corrección de un error de la
    // primera versión, que confiaba en que a 4000% el asta de la "n" tapara
    // sola el viewport. Tapa el ancho, pero NO el alto — con la máscara anclada
    // al borde inferior, la ventana visible cae sobre el espacio bajo la
    // baseline, que es transparente, y el footer terminaba con media pantalla
    // en cream.
    //
    // Depender de la geometría de un glifo para cubrir una pantalla es frágil
    // por definición: cambia con el viewport, con el asset y con el ancho del
    // contenedor. El negro entra cuando la máscara ya perdió toda forma
    // reconocible, así que el corte no se ve y la cobertura deja de ser una
    // apuesta.
    tl.fromTo(bed, { opacity: 0 }, { opacity: 1, duration: 0.14, ease: "none" }, 0.66);

    // El panel entra con el negro ya cubriendo. Va FUERA del elemento
    // enmascarado a propósito: una máscara recorta al elemento y a toda su
    // descendencia, así que adentro los links se verían solo dentro de los
    // glifos — que suena bien y es ilegible.
    tl.fromTo(panel, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.22, ease: "none" }, 0.78);

    return () => {
      gsap.killTweensOf([mask, panel, bed]);
      gsap.set(mask, { clearProps: "--glyph" });
      gsap.set(bed, { clearProps: "opacity" });
      gsap.set(panel, { clearProps: "transform,opacity,visibility" });
    };
  });

  return (
    <footer ref={rootRef} className="relative isolate z-30 bg-cream text-foreground lg:pt-[42vh]">
      <FooterStaticFallback />

      {/* El espaciador: reserva en flujo el alto que el wordmark ocuparía, ya
          que el panel enmascarado es `absolute`. Usa el aspecto del propio
          asset, así que no puede quedar desfasado si el SVG se redibuja. */}
      <div
        aria-hidden="true"
        className="hidden w-full lg:motion-safe:block"
        style={{ aspectRatio: `${WORDMARK.width} / ${WORDMARK.height}` }}
      />

      {/* El negro recortado con la forma del logo. Anclado al fondo del footer
          con un viewport de alto: a máscara pequeña se lee como el wordmark de
          producción, a máscara grande cubre la pantalla.

          `alt` no existe acá — es una máscara, no una imagen: el nombre de la
          marca lo aporta el `aria-label` del footer estático y el legal. */}
      <div
        data-mask
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] hidden h-[100svh] bg-ink lg:motion-safe:block"
        style={
          {
            "--glyph": "100%",
            WebkitMaskImage: `url(${WORDMARK.src})`,
            maskImage: `url(${WORDMARK.src})`,
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "18% 82%",
            maskPosition: "18% 82%",
            WebkitMaskSize: "var(--glyph)",
            maskSize: "var(--glyph)",
          } as React.CSSProperties
        }
      />

      {/* El negro sólido del último tramo (ver el tween). Va DEBAJO del panel
          y ENCIMA de la máscara: cierra lo que la forma del glifo no cubre. */}
      <div
        data-bed
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] hidden h-[100svh] bg-ink opacity-0 lg:motion-safe:block"
      />

      {/* Headline + columnas, encima del negro y fuera de la máscara. */}
      <div
        data-panel
        className="invisible absolute inset-x-0 bottom-0 z-[3] hidden h-[100svh] lg:motion-safe:flex lg:flex-col lg:justify-between"
      >
        <Container
          style={{ "--links": "48rem" } as React.CSSProperties}
          className="grid gap-16 pt-[18vh] lg:grid-cols-[minmax(0,1fr)_minmax(0,var(--links))] lg:gap-24">
          <FooterHeadline dark className="text-h2" />
          <FooterLinks dark />
        </Container>
        <Container className="pb-6">
          <FooterLegal tone="dark" />
        </Container>
      </div>
    </footer>
  );
}
