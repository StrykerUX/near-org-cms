"use client";

import Container from "@/components/primitives/Container";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { WORDMARK } from "./footerLabContent";
import { enterExit } from "./footerScene";
import { FooterHeadline, FooterLegal, FooterLinks, FooterWordmark } from "./FooterParts";
import FooterStaticFallback from "./FooterStaticFallback";

// 02 · Glyph — se entra al footer por dentro de una letra.
//
// ── El recorrido, en cuatro tiempos ────────────────────────────────────────
//
//   1. El lector llega al fondo y el wordmark aparece a ancho completo, como en
//      cualquiera de las otras cinco versiones. No pasa nada más.
//   2. Cuando el logo se ha revelado hasta LA MITAD por el borde inferior de la
//      pantalla, empieza a crecer.
//   3. Crece sesgado hacia abajo, hasta que un solo trazo cubre el viewport y
//      llegan el titular y los links.
//   4. Y en el fondo del footer vuelve a aparecer el wordmark, ahora en blanco
//      sobre el negro. Se sale por donde se entró.
//
// El logo no se muestra y después se decora: se atraviesa, y del otro lado
// está otra vez. Es el único de los seis donde la marca es el camino y no el
// destino.
//
// ── El disparo: el logo ENTERO a la vista ──────────────────────────────────
//
// `start: "bottom bottom"` sobre el bloque del wordmark: el borde inferior del
// logo tocando el borde inferior de la pantalla es, exactamente, el primer
// frame en que se ve completo. No hace falta medir nada.
//
// Antes disparaba a mitad de logo (`center bottom`) y el efecto perdía su
// premisa: lo que crece tiene que ser algo que el lector YA reconoció como el
// wordmark. Con medio logo asomando todavía no lo es —es una fila de formas
// cortadas— así que el crecimiento no se leía como "el logo se agranda" sino
// como una mancha que aparece.
//
// El disparo queda atado a cuánto se ve del logo y no a dónde cae en la
// pantalla, que es lo correcto: en un viewport bajo, "a media pantalla" llega
// cuando el logo ya está entero a la vista y el crecimiento arrancaría tarde.
//
// ── Por qué crece sesgado y no solo hacia abajo ────────────────────────────
//
// Con la máscara anclada al borde inferior (`mask-position: 18% 100%`) crece
// solo hacia arriba; anclada al superior, solo hacia abajo — y entonces la
// mitad de arriba del viewport se queda sin cubrir hasta que entra el negro
// sólido, que es un salto visible.
//
// El anclaje se ANIMA: arranca en 100% —donde coincide al píxel con el wordmark
// en pantalla, que es lo que hace que el crecimiento parezca salir del logo
// real— y llega a 25%. A 25%, tres cuartas partes del glifo crecen hacia abajo
// y una cuarta hacia arriba: cubre la pantalla entera y el gesto se sigue
// leyendo como descendente.
//
// ── Los dos números que sostienen el efecto ────────────────────────────────
//
// 1. **`18%` horizontal.** El punto que se agranda tiene que caer sobre TRAZO,
//    no sobre una contraforma: al centro del wordmark le toca el hueco entre la
//    "e" y la "a", y ampliarlo abriría un agujero de página en medio del negro.
//    18% cae dentro del asta derecha de la "n" — medido muestreando el alpha
//    del asset por columnas: 17.8%–20.4% es opaco en el 88–93% de su altura,
//    contra el 0% de las contraformas. Las otras dos bandas igual de sólidas
//    son 0–3% (el asta izquierda de la misma "n") y 82–85% (la "r").
//
//    Que ese 18% no rompa el estado de reposo es una propiedad de cómo CSS
//    resuelve `mask-position` en porcentaje: el offset es
//    `(contenedor − imagen) × p`, así que con la imagen al 100% del contenedor
//    el offset es 0 sea cual sea el porcentaje. El encuadre solo empieza a
//    importar cuando la máscara ya creció.
//
// 2. **`ease: "power2.in"` sobre el crecimiento.** El área cubierta crece con
//    el CUADRADO de la escala, así que una rampa lineal de 100% a 4000% se ve
//    quieta la primera mitad y explota al final. La curva de entrada compensa
//    esa no-linealidad y devuelve un crecimiento que se percibe parejo.

/** Ancho de la máscara al que un trazo ya cubre cualquier viewport razonable. */
const MASK_END = "4000%";

export default function FooterGlyph() {
  const rootRef = useMotionScope<HTMLElement>(({ q, motionOk, isDesktop }) => {
    if (!motionOk || !isDesktop) return;

    const mask = q("[data-mask]")[0];
    const panel = q("[data-panel]")[0];
    const bed = q("[data-bed]")[0];
    const intro = q("[data-intro]")[0];
    const outro = q("[data-outro]")[0];
    if (!mask || !panel || !bed || !intro || !outro) return;

    const tl = gsap.timeline({ paused: true });

    // 1 · La máscara crece. Se animan dos custom properties y no `maskSize` /
    // `maskPosition` directos: el shorthand vive bajo dos nombres
    // (`mask-*` y `-webkit-mask-*`) y escribir los dos desde el tween
    // duplicaría el target; una variable es un valor numérico con unidad, que
    // es lo que GSAP interpola sin ambigüedad.
    tl.fromTo(mask, { "--glyph": "100%" }, { "--glyph": MASK_END, duration: 1.1, ease: "power2.in" }, 0);
    tl.fromTo(mask, { "--glyph-y": "100%" }, { "--glyph-y": "25%", duration: 1.1, ease: "power1.out" }, 0);

    // El relevo entre las dos copias del logo, en 120ms.
    //
    // En reposo solo existe el wordmark REAL: la máscara está apagada. Tienen
    // que turnarse y no convivir porque no son idénticas — el real lleva el
    // corte óptico que sienta el logo sobre el borde (el `cropPct` medido con
    // `getBBox`, ver `footerLabContent`) y una `mask-image` no puede aplicarlo.
    // Con las dos encendidas se veía el logo DOBLE, con una silueta corrida
    // unos píxeles: el defecto más visible que tuvo esta versión.
    //
    // El cruce es corto y ocurre mientras la máscara ya arrancó a crecer, así
    // que la diferencia de esos píxeles no llega a leerse.
    tl.fromTo(mask, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.12, ease: "none" }, 0);
    tl.to(intro, { autoAlpha: 0, duration: 0.12, ease: "none" }, 0);

    // 2 · El negro sólido cierra el último tramo.
    //
    // No es un cinturón de seguridad: es la corrección de un error de la
    // primera versión, que confiaba en que a 4000% el asta de la "n" tapara
    // sola el viewport. Tapa el ancho, pero no siempre el alto — y depender de
    // la geometría de un glifo para cubrir una pantalla es frágil por
    // definición: cambia con el viewport, con el asset y con el contenedor.
    // Entra cuando la máscara ya perdió toda forma reconocible, así que el
    // corte no se ve.
    tl.fromTo(bed, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "none" }, 0.75);

    // 3 · Titular y columnas, ya con el negro cubriendo. Van FUERA del elemento
    // enmascarado a propósito: una máscara recorta al elemento y a toda su
    // descendencia, así que adentro los links se verían solo dentro de los
    // glifos — que suena bien y es ilegible.
    tl.fromTo(panel, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out" }, 0.9);

    // 4 · Y el wordmark vuelve, en blanco sobre el negro.
    tl.fromTo(outro, { autoAlpha: 0, y: 32 }, { autoAlpha: 1, y: 0, duration: 0.55, ease: "power3.out" }, 1.05);

    // El disparo va sobre el bloque del wordmark de entrada y no sobre el
    // footer: lo que marca el momento es cuánto se ve del LOGO, y arranca con
    // el logo entero en pantalla.
    const st = enterExit(tl, { trigger: intro, start: "bottom bottom" });

    return () => {
      st.kill();
      tl.kill();
      gsap.set([mask, panel, bed, intro, outro], { clearProps: "all" });
    };
  });

  return (
    <footer ref={rootRef} className="relative isolate z-30 bg-cream text-foreground lg:pt-[42svh]">
      <FooterStaticFallback />

      {/* Tiempo 1 · el wordmark en cream, a ancho completo. Es lo único que se
          ve al llegar, y es también el trigger de la escena. */}
      <div data-intro className="hidden lg:motion-safe:block">
        <FooterWordmark alt="NEAR" />
      </div>

      {/* Tiempo 2-3 · el negro recortado con la forma del logo. Anclado al
          fondo del footer con un viewport de alto: a máscara pequeña coincide
          con el wordmark de arriba, a máscara grande cubre la pantalla.

          Sin `alt` — es una máscara, no una imagen: el nombre de la marca lo
          aportan el wordmark de entrada y el de salida. */}
      <div
        data-mask
        aria-hidden="true"
        className="pointer-events-none invisible absolute inset-x-0 bottom-0 z-[2] hidden h-[100svh] bg-ink lg:motion-safe:block"
        style={
          {
            "--glyph": "100%",
            "--glyph-y": "100%",
            WebkitMaskImage: `url(${WORDMARK.src})`,
            maskImage: `url(${WORDMARK.src})`,
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "18% var(--glyph-y)",
            maskPosition: "18% var(--glyph-y)",
            WebkitMaskSize: "var(--glyph)",
            maskSize: "var(--glyph)",
          } as React.CSSProperties
        }
      />

      {/* El negro sólido del último tramo (ver el tween). Va DEBAJO del panel y
          ENCIMA de la máscara: cierra lo que la forma del glifo no cubre. */}
      <div
        data-bed
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] hidden h-[100svh] bg-ink opacity-0 lg:motion-safe:block"
      />

      {/* Tiempo 3 · headline y columnas, encima del negro y fuera de la máscara. */}
      <div
        data-panel
        className="invisible absolute inset-x-0 bottom-0 z-[3] hidden h-[100svh] flex-col justify-between lg:motion-safe:flex"
      >
        <Container
          style={{ "--links": "48rem" } as React.CSSProperties}
          className="grid gap-16 pt-[14svh] lg:grid-cols-[minmax(0,1fr)_minmax(0,var(--links))] lg:gap-24"
        >
          <FooterHeadline dark className="text-h2" />
          <FooterLinks dark />
        </Container>

        {/* Tiempo 4 · el wordmark otra vez, ahora en blanco. Vive dentro del
            panel para compartir su caja, pero con su propio tween: llega
            después que el titular, que es lo que hace que se lea como el
            cierre y no como parte de la misma entrada. */}
        <div>
          <Container className="pb-[2svh]">
            <FooterLegal tone="dark" />
          </Container>
          <div data-outro>
            <FooterWordmark invert alt="NEAR" />
          </div>
        </div>
      </div>
    </footer>
  );
}
