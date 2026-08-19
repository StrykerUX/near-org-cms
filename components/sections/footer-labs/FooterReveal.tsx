"use client";

import Container from "@/components/primitives/Container";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { FooterHeadline, FooterLegal, FooterLinks, FooterWordmark } from "./FooterParts";
import FooterStaticFallback from "./FooterStaticFallback";
import { enterExit } from "./footerScene";

// 04 · Reveal — el footer ya estaba ahí; la página se corre.
//
// ── La idea ────────────────────────────────────────────────────────────────
//
// Es la más barata de las seis y la única sin coreografía: el footer está
// `fixed` al fondo del viewport desde el primer frame, quieto y a tamaño
// completo, y la página es una hoja opaca que se desliza hacia arriba y lo
// descubre. El movimiento no lo conduce nadie — es el scroll, directamente.
//
// Vale como control del lab: cualquier versión con timeline tiene que ganarle
// a esto por un margen que justifique su complejidad.
//
// ── Cómo queda detrás de la página ─────────────────────────────────────────
//
// Tres piezas, y las tres son necesarias:
//
// 1. `FooterLabShell` envuelve todo lo que va encima en una hoja con fondo
//    propio y `z-10`. Un `position: fixed` sin eso se pintaría ENCIMA del
//    texto en flujo: los elementos posicionados van después del contenido en
//    flujo en el orden de pintado, y no alcanza con ponerlo antes en el DOM.
// 2. Este footer se monta en `z-0`, dentro del mismo contexto que la hoja.
// 3. El espaciador de abajo es un hueco EN FLUJO, sin fondo, del alto del
//    footer. Es lo que hace que el documento tenga scroll de sobra y, a la
//    vez, la ventana por la que se ve el footer fijo — no hay una tercera capa
//    que revele nada, es literalmente el agujero que deja la hoja.
//
// El único JS de la versión es el stagger de entrada de las columnas, que
// corre una sola vez. Sin él la versión sigue funcionando entera.
//
// ── Un viewport entero, no 80svh ───────────────────────────────────────────
//
// Empezó midiendo 80svh, con el argumento de que dejar página a la vista
// arriba hacía legible que el footer estaba DEBAJO. En pantalla no se leía así:
// se leía como un footer que no termina de llegar, con una franja de contenido
// muerto arriba que ya nadie estaba mirando. A pantalla completa el paralaje se
// entiende igual —lo cuenta el movimiento de la hoja al correrse, no el hueco—
// y el footer usa el espacio que tiene.

/** Alto del footer fijo: el viewport entero. */
const FOOTER_H = "100svh";

export default function FooterReveal() {
  const rootRef = useMotionScope<HTMLElement>(({ q, motionOk, isDesktop }) => {
    if (!motionOk || !isDesktop) return;

    const gap = q("[data-gap]")[0];
    const items = q("[data-in]");
    if (!gap || items.length === 0) return;

    // El trigger va sobre el ESPACIADOR y no sobre el footer: el footer es
    // `fixed`, así que su caja no se mueve con el scroll y un ScrollTrigger
    // anclado a él mediría siempre lo mismo. El hueco sí viaja.
    const tl = gsap.timeline({ paused: true });

    // `set` + `to` y no `from`: `from` aplica su estado inicial en el frame en
    // que se crea, y con la timeline pausada eso dejaba las columnas
    // invisibles hasta que alguien scrolleara. Con `set` explícito el estado
    // inicial es una escritura sola y el tween sabe de dónde sale.
    gsap.set(items, { autoAlpha: 0, y: 22 });
    tl.to(items, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.07 });

    const st = enterExit(tl, { trigger: gap, start: "top 85%" });

    return () => {
      st.kill();
      tl.kill();
      gsap.set(items, { clearProps: "transform,opacity,visibility" });
    };
  });

  return (
    <>
      {/* El footer fijo. `aria-hidden` no va: es el footer real, solo que
          pintado detrás. En mobile y con reduced-motion no se monta —ahí manda
          el estático de abajo, en flujo. */}
      <footer
        ref={rootRef}
        className="fixed inset-x-0 bottom-0 z-0 hidden flex-col justify-between bg-ink lg:motion-safe:flex"
        style={{ height: FOOTER_H }}
      >
        <Container
          style={{ "--links": "48rem" } as React.CSSProperties}
          className="grid gap-16 pt-[9vh] lg:grid-cols-[minmax(0,1fr)_minmax(0,var(--links))] lg:gap-24"
        >
          <div data-in>
            <FooterHeadline dark className="text-h2" />
          </div>
          {/* El `itemAttr` marca cada COLUMNA, no el bloque: el stagger
              reparte las cuatro. Un `data-in` también en el wrapper haría que
              el selector lo tomara junto con sus hijas y las animara dos
              veces. */}
          <FooterLinks dark itemAttr="data-in" />
        </Container>

        <div>
          <Container className="pb-6">
            <FooterLegal tone="dark" />
          </Container>
          <FooterWordmark invert alt="" />
        </div>
      </footer>

      {/* El hueco en flujo: sin fondo, del alto exacto del footer fijo. */}
      <div data-gap aria-hidden="true" className="hidden lg:motion-safe:block" style={{ height: FOOTER_H }} />

      {/* Mobile / reduced-motion: el footer en flujo, sin nada fijo. Va en su
          propio `footer` porque el de arriba no se monta en esas condiciones. */}
      <footer className="relative z-10 lg:motion-safe:hidden">
        <FooterStaticFallback />
      </footer>
    </>
  );
}
