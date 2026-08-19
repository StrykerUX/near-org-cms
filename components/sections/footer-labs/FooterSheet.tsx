"use client";

import Container from "@/components/primitives/Container";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import {
  FooterHeadlineLines,
  FooterLegal,
  FooterLinks,
  FooterWordmark,
} from "./FooterParts";
import FooterStaticFallback from "./FooterStaticFallback";
import { enterExit } from "./footerScene";

// 08 · Sheet — el takeover como una hoja que se apoya encima.
//
// Misma familia que el footer de producción —tapa la página al llegar al
// fondo— pero el negro no es un wipe que crece: es un objeto con bordes,
// esquinas y sombra que sube entero y se apoya sobre el contenido. La página no
// desaparece: se ve oscurecida por arriba y por los costados, así que el footer
// se lee como una capa y no como el final del documento.
//
// Ocupa 94svh: casi la pantalla entera, como las otras siete. Los tres puntos
// de página que quedan a la vista en los costados y arriba son lo único que la
// distingue de un takeover a sangre — y es todo lo que hace falta para que se
// lea como algo apoyado.
//
// ── La respuesta al problema de la altura: que ceda el logo ────────────────
//
// El footer de producción se corta arriba en viewports bajos, y la causa que no
// se ve es el wordmark: a ancho completo su alto es el 26% del ancho de la
// página —400px en un portátil, 870px en un monitor de 3440— así que cuanto más
// ancha la pantalla, menos presupuesto de altura queda para el texto. Cuando no
// alcanza, lo que se pierde es el titular y las primeras filas de links: lo
// único que un footer existe para mostrar.
//
// `07 · Ascend` lo resuelve achicando el logo contra el alto del viewport.
// Ésta lo resuelve al revés, y es la diferencia entre las dos: **el logo se
// queda a ancho completo y se RECORTA**. El texto tiene prioridad absoluta
// sobre el espacio; el wordmark se lleva lo que sobre, y si lo que sobra es
// menos de lo que mide, se sangra por el borde inferior de la pantalla.
//
// Un logo cortado por la base sigue siendo el logo —los hombros de la "n", la
// "e" y la "a" ya lo identifican— y además se lee como sangrado deliberado. Un
// titular cortado por arriba se lee como un bug.
//
// ── `align-items: safe flex-end` ───────────────────────────────────────────
//
// Es lo que hace que el logo se comporte de las dos maneras sin una sola línea
// de JS ni una media query:
//
//   · cuando SOBRA espacio, `flex-end` lo sienta contra el borde inferior de la
//     hoja, exactamente como en las otras siete versiones;
//   · cuando FALTA, la palabra clave `safe` invierte la alineación a `start` en
//     vez de desbordar hacia el lado que se recorta primero — así el excedente
//     sale por abajo, no por arriba.
//
// Sin `safe`, un hijo más alto que su contenedor alineado al final desborda
// hacia ARRIBA, y el recorte se comería justamente la parte del logo que lo
// hace reconocible. La palabra existe para esto: evitar la pérdida de contenido
// en el borde de inicio.

/** Tope del wordmark: a ancho completo, un monitor ultrawide lo vuelve una pared. */
const WORDMARK_MAX = "2000px";

export default function FooterSheet() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk, isDesktop }) => {
    if (!motionOk || !isDesktop) return;

    const sheet = q("[data-sheet]")[0];
    const scrim = q("[data-scrim]")[0];
    const items = q("[data-item]");
    if (!sheet || !scrim) return;

    const tl = gsap.timeline({ paused: true });

    // La hoja sube entera. `power4.out` sin overshoot: un rebote acá la haría
    // parecer liviana, y lo que tiene que transmitir es que se APOYA.
    tl.fromTo(sheet, { yPercent: 100 }, { yPercent: 0, duration: 0.78, ease: "power4.out" }, 0);

    // El oscurecido de la página, un poco por delante de la hoja: la sombra
    // llega antes que el objeto, que es lo que hace que se lea como volumen.
    tl.fromTo(scrim, { opacity: 0 }, { opacity: 0.62, duration: 0.6, ease: "power2.out" }, 0);

    // El contenido, escalonado y ya con la hoja casi apoyada.
    tl.fromTo(
      items,
      { autoAlpha: 0, y: 20 },
      { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.05 },
      0.42
    );

    // Arranca cuando el lector llegó al fondo por su cuenta —nadie tira del
    // scroll— y se deshace al subir, más rápido de lo que entró. Ver
    // `footerScene.ts`.
    const st = enterExit(tl, { trigger: scope, start: "bottom bottom+=40" });

    return () => {
      st.kill();
      tl.kill();
      gsap.set([sheet, scrim, ...items], { clearProps: "transform,opacity,visibility" });
    };
  });

  return (
    <footer ref={rootRef} className="relative isolate z-30 bg-cream text-foreground">
      <FooterStaticFallback />

      {/* Antes de que suba la hoja no se ve NADA del footer: solo el aire de
          página que le da recorrido al trigger.

          Acá vivía una copia del wordmark en cream, heredada del resto del lab,
          y sobraba: el logo ya está DENTRO de la hoja, así que el de abajo era
          un segundo logo puesto ahí para que la hoja lo tapara 700ms después.
          Dos veces la misma marca en la misma pantalla, y la primera solo para
          cubrirla. */}
      <div aria-hidden="true" className="hidden h-[28svh] lg:motion-safe:block" />

      {/* El oscurecido de la página. `fixed` y no `absolute`: tiene que cubrir
          el viewport, y el fondo del footer todavía no es el borde de la
          pantalla cuando la escena arranca. */}
      <div
        data-scrim
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[2] hidden bg-ink opacity-0 lg:motion-safe:block"
      />

      {/* La hoja. 94svh y un margen lateral de 3: casi toda la pantalla, con lo
          justo de página a la vista para que se lea como un objeto apoyado.

          Sin `box-shadow`. La tenía —una sombra difusa de 120px hacia arriba—
          y el efecto en pantalla no era una sombra sino un degradado gris que
          subía por encima del contenido de la página mucho antes de que la
          hoja llegara: se leía como suciedad, no como profundidad. El
          oscurecido del `scrim` ya da la separación, y lo hace parejo. */}
      <div
        data-sheet
        className="fixed inset-x-3 bottom-0 z-[3] hidden h-[94svh] flex-col overflow-hidden rounded-t-[2rem] bg-ink text-cream lg:motion-safe:flex"
      >
        {/* Los dos bloques de texto son `shrink-0`: no ceden espacio nunca.
            Todo lo que falte se lo lleva el wordmark, que es el único que puede
            recortarse sin costo. */}
        <Container
          className="grid shrink-0 gap-[5svh] pt-[7svh] lg:grid-cols-[minmax(0,1fr)_minmax(0,var(--links))] lg:gap-x-28"
          style={{ "--links": "48rem" } as React.CSSProperties}
        >
          <div data-item>
            <FooterHeadlineLines dark className="text-h1 [@media(max-height:820px)]:text-h2" />
          </div>
          <FooterLinks dark itemAttr="data-item" />
        </Container>

        <Container className="shrink-0 pb-[2svh] pt-[4svh]">
          <div data-item>
            <FooterLegal tone="dark" />
          </div>
        </Container>

        {/* El wordmark se lleva el espacio que queda —`flex-1 min-h-0`— y se
            recorta si no le alcanza. Ver el comentario de `safe flex-end`
            arriba: sentado cuando sobra, sangrado por abajo cuando falta. */}
        <div
          className="flex min-h-0 flex-1 overflow-hidden"
          style={{ alignItems: "safe flex-end" }}
        >
          <FooterWordmark
            invert
            alt=""
            style={{ maxWidth: WORDMARK_MAX }}
            className="mx-auto w-full shrink-0"
          />
        </div>
      </div>
    </footer>
  );
}
