"use client";

import Container from "@/components/primitives/Container";
import { gsap, ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { WORDMARK } from "./footerLabContent";
import {
  FooterHeadlineLines,
  FooterLegal,
  FooterLinks,
  FooterWordmark,
} from "./FooterParts";
import FooterStaticFallback from "./FooterStaticFallback";

// 07 · Ascend — el takeover de producción, con las dos cosas que le faltan.
//
// Es la versión más cercana a `components/site/SiteFooter.tsx`: mismo wipe
// negro que sube desde el borde inferior, mismo truco de la copia blanca del
// wordmark recortada por el borde del negro, mismo bote al aterrizar. Lo que
// cambia son dos decisiones, y las dos son de comportamiento, no de estilo.
//
// ── 1. No le saca el scroll al lector ──────────────────────────────────────
//
// El original detecta un umbral a 100px del fondo y ahí TIRA de la página:
// `gsap.to(scroller, { scrollTop: maxScroll })`. Funciona, pero durante esos
// 450ms el scroll no es del lector — y si su gesto iba a otro lado, pelea.
//
// Acá el disparo es `bottom bottom`: la escena arranca cuando el lector llegó
// al fondo por su cuenta. Nadie lo empuja. El costo es que la escena ya no
// puede asumir que la página está exactamente en el borde, así que el margen de
// 40px del `start` es el que absorbe la diferencia — y, a cambio, el wipe y el
// wordmark del footer siguen coincidiendo al píxel, que es de donde sale el
// corte duro blanco/negro.
//
// Se revierte al subir, como el original: `onEnter` reproduce, `onLeaveBack`
// invierte. Un takeover que no se puede deshacer deja la página tapada.
//
// ── 2. El contenido no se corta nunca ──────────────────────────────────────
//
// El problema que este lab tiene que resolver: el panel del takeover se ancla
// al borde inferior y crece hacia arriba, así que en un viewport bajo —un
// portátil de 13", una ventana a media pantalla, un navegador con muchas
// barras— el titular y las primeras filas de links se salen por el borde
// superior y quedan cortados. Y arriba es el peor sitio donde perder contenido:
// no hay forma de llegar a él, porque el takeover ocupa la pantalla entera.
//
// La respuesta acá es COMPACTAR, en dos capas:
//
//   · CSS primero. Todo el aire del panel está en `svh`, no en `rem`: al bajar
//     el viewport, los paddings y los gaps bajan con él. Y a partir de 820px de
//     alto el titular cambia de token (`text-h1` → `text-h2` → `text-h3`) con
//     media queries de ALTURA. Sigue siendo la escala del DS — no hay tamaños
//     a mano, que es lo que `pnpm lint:typography` verifica.
//
//     **El wordmark se mide contra el ALTO, y es la mitad del arreglo.** A
//     ancho completo su altura es el 26% del ancho de la página: 400px en un
//     portátil y 870px en un monitor de 3440 — o sea que el logo solo se come
//     el presupuesto entero, y cuanto más ancha la pantalla, peor. Es la razón
//     real de que el footer de producción se corte, y no se arregla comprimiendo
//     el texto, que es la parte barata.
//
//     La expresión es `w-[min(100%,calc(26svh*3.847))]`: el ancho del logo es
//     el menor entre el ancho disponible y el que corresponde a 26svh de alto,
//     donde 3.847 es la relación del asset (981÷255). Dicho al revés, el
//     wordmark nunca pasa de un cuarto de la pantalla de alto, en cualquier
//     viewport y sin media queries.
//
//   · JS como red. Si aun así el panel no entra —viewports absurdamente bajos,
//     una traducción que alargue los labels— el takeover directamente no se
//     monta y el footer se lee en flujo, scrolleando. Es la degradación
//     correcta: perder el efecto es barato, perder los links no.
//
// La comparación con `08 · Sheet` es a propósito: aquella resuelve lo mismo
// rediseñando el layout para que no pueda desbordar. Dos respuestas distintas a
// la misma pregunta.

/** Margen bajo el fondo del documento en el que la escena ya puede arrancar. */
const TRIGGER_SLACK = 40;

export default function FooterAscend() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk, isDesktop }) => {
    if (!motionOk || !isDesktop) return;

    const wipe = q("[data-wipe]")[0];
    const panel = q("[data-panel]")[0];
    const bounce = q("[data-bounce]");
    const items = q("[data-item]");
    const mark = q("[data-mark]")[0];
    if (!wipe || !panel || !mark || bounce.length === 0) return;

    // La red de seguridad de la altura.
    //
    // Mide el bloque COMPLETO —panel más wordmark— y no solo el panel, que fue
    // el error de la primera versión: el panel entraba de sobra y el takeover
    // se montaba igual, pero el logo que va debajo empujaba todo hacia arriba y
    // el titular quedaba cortado por el borde superior.
    //
    // `scrollHeight` del panel es su alto natural aunque esté invisible:
    // `visibility: hidden` no lo saca del layout, así que se puede medir sin
    // mostrarlo.
    //
    // Se evalúa en cada `onEnter` y no una sola vez al montar porque el
    // viewport se sigue moviendo — y porque el efecto se reconstruye en cada
    // cambio de condición de `matchMedia`.
    const fits = () => panel.scrollHeight + mark.offsetHeight + 24 <= window.innerHeight;
    if (!fits()) return;

    const tl = gsap.timeline({ paused: true });

    // El wipe: se anima la ALTURA y no `scaleY`, porque adentro vive la copia
    // blanca del wordmark y un escalado la deformaría. La altura solo mueve el
    // borde del recorte, que es justo lo que produce el corte duro entre el
    // logo negro sobre cream y el blanco sobre el negro.
    tl.fromTo(
      wipe,
      { height: 0 },
      { height: () => window.innerHeight, duration: 0.62, ease: "power3.out" },
      0
    );

    // El bote del wordmark: un salto corto y una caída con `bounce.out`. Es el
    // "golpe" de llegar al fondo, y es lo mejor del footer original.
    tl.to(bounce, { y: -11, duration: 0.18, ease: "power2.out" }, 0.04);
    tl.to(bounce, { y: 0, duration: 0.75, ease: "bounce.out" }, 0.22);

    // El contenido en cascada, no de golpe: el panel entero apareciendo con un
    // solo fade es lo que hace que un takeover se lea como una diapositiva.
    tl.set(panel, { autoAlpha: 1 }, 0.34);
    tl.fromTo(
      items,
      { autoAlpha: 0, y: 26 },
      { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.06 },
      0.34
    );

    // El trigger se crea al final: si la página ya está en el fondo al montar,
    // `onEnter` dispara en esta misma línea, y para entonces la timeline tiene
    // que estar completa.
    const st = ScrollTrigger.create({
      trigger: scope,
      start: `bottom bottom+=${TRIGGER_SLACK}`,
      end: "bottom top",
      markers: DEBUG_MARKERS,
      onEnter: () => {
        if (fits()) tl.play();
      },
      onLeaveBack: () => tl.reverse(),
    });

    return () => {
      st.kill();
      tl.kill();
      gsap.set([wipe, panel, ...bounce, ...items], {
        clearProps: "height,transform,opacity,visibility",
      });
    };
  });

  return (
    <footer ref={rootRef} className="relative isolate z-30 bg-cream text-foreground lg:pt-[30svh]">
      <FooterStaticFallback />

      {/* El wipe. Anclado al fondo del footer —que es el fondo del documento— y
          creciendo hasta un viewport de alto: con la página en el borde, cubre
          la pantalla exacta.

          Adentro, la copia BLANCA del wordmark anclada al mismo fondo. El borde
          superior del negro la recorta al píxel, así que congelado a mitad de
          camino el logo queda partido en dos colores en vez de fundirse. */}
      <div
        aria-hidden="true"
        data-wipe
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] hidden h-0 overflow-hidden bg-ink lg:motion-safe:block"
      >
        {/* Las dos copias del wordmark llevan EXACTAMENTE las mismas clases de
            ancho: si una encogiera y la otra no, el corte entre el negro sobre
            cream y el blanco sobre el negro dejaría de coincidir, que es el
            único efecto que esta versión hereda intacto del original. */}
        <div data-bounce className="absolute bottom-0 left-0 w-[min(100%,calc(26svh*3.847))]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={WORDMARK.src}
            alt=""
            width={WORDMARK.width}
            height={WORDMARK.height}
            className="block h-auto w-full invert"
            style={{ marginBottom: `-${WORDMARK.cropPct}%` }}
          />
        </div>
      </div>

      {/* El panel del takeover.
          Todo su aire está en `svh` y no en `rem`: es lo que hace que en un
          viewport bajo el contenido se comprima en vez de salirse por arriba.
          El titular baja de token con media queries de ALTURA por el mismo
          motivo — y son tokens de la escala, no tamaños a mano. */}
      <div
        data-panel
        className="invisible absolute inset-x-0 bottom-[calc(100%-30svh)] z-[3] hidden lg:motion-safe:block"
      >
        {/* El ancho del bloque de links va declarado y no `auto`: con `auto`
            los links piden todo lo que sus líneas pueden usar y el titular se
            queda con el resto, que lo parte en cuatro renglones. Fijándolo, lo
            que sobra es del titular. Mismo criterio que en `06 · Stack`. */}
        <Container
          className="grid gap-[6svh] pb-[7svh] lg:grid-cols-[minmax(0,1fr)_minmax(0,var(--links))] lg:gap-x-24"
          style={{ "--links": "48rem" } as React.CSSProperties}
        >
          <div data-item>
            <FooterHeadlineLines
              dark
              className="text-h1 [@media(max-height:820px)]:text-h2 [@media(max-height:680px)]:text-h3"
            />
          </div>
          {/* 07 · Ascend monta `inline`, igual que Fold: es la variante que
              mejor resuelve el alto sin perder los sub-labels, y ésta es la
              versión donde el alto es el problema central. */}
          <FooterLinks dark itemAttr="data-item" />
        </Container>
      </div>

      {/* El wordmark negro sobre cream: lo único visible antes del takeover.
          Comparte `data-bounce` con la copia blanca de adentro del wipe — los
          dos tienen que saltar juntos o el corte deja de coincidir. */}
      <div
        data-bounce
        data-mark
        className="relative z-[1] hidden w-[min(100%,calc(26svh*3.847))] lg:motion-safe:block"
      >
        <FooterWordmark alt="NEAR" />
      </div>

      {/* El legal por encima del negro. `mix-blend-difference` con source gris
          resuelve los dos estados sin saber en cuál está. */}
      <div className="absolute inset-x-0 bottom-[2svh] z-[4] hidden mix-blend-difference lg:motion-safe:block">
        <Container>
          <FooterLegal tone="blend" />
        </Container>
      </div>
    </footer>
  );
}
