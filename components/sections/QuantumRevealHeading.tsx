"use client";

import Container from "@/components/primitives/Container";
import ZigguratDivider from "@/components/primitives/ZigguratDivider";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { gsap, SplitText } from "@/components/primitives/motion/gsapClient";
import { MQ, DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { onViewportToggle } from "@/components/primitives/motion/pauseOffscreen";
import { subscribePointer } from "@/components/primitives/motion/pointer";
import { createGlyphShine } from "@/components/primitives/motion/glyphShine";

// Dos líneas, cada una su propio <h2> en flujo normal, pero UN SOLO efecto
// para el bloque completo: un stagger de opacidad continuo que arranca en la
// "T" de "The" y termina en el punto de "Design.", y un único frente de luz
// que lo recorre entero. No hay nada por línea — ni timeline, ni canvas, ni
// contexto WebGL.
//
// TODOS los caracteres van de 10% a 100% de opacidad, letra por letra, ligado
// al scroll (scrub). Eso es GSAP plano y corre SIEMPRE, también con
// prefers-reduced-motion: es opacidad, no desplazamiento.
//
// Encima, y SOLO cuando el usuario no pidió reducir movimiento, el bloque
// lleva un shine WebGL2 recortado a la silueta exacta de sus glifos (máscara
// alfa por texto-a-textura, no background-clip). El frente de luz va clavado
// sobre el borde del reveal — sin adelanto ni retraso: es la luz del propio
// reveal, no un barrido aparte. Además responde al mouse en toda la pantalla,
// también mientras el frente sigue barriendo.
const LINES = ["The First Quantum-Secure Network.", "Confidential by Design."] as const;

const DIM = 0.1; // opacidad de arranque de TODOS los caracteres
const CHAR = 0.16; // cuánto tarda UNA letra en ir de DIM a 1
const EACH = 0.03; // paso del stagger entre letra y letra

export default function QuantumRevealHeading() {
  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    // Una sola rama: el reveal de opacidad se construye igual en los dos
    // casos y `motionOk` solo decide si además se monta el shine.
    mm.add({ motionOk: MQ.motion }, (mctx) => {
      const { motionOk } = mctx.conditions as { motionOk: boolean };

      const host = q("[data-quantum='stage']")[0];
      const headings = q("[data-quantum='line']");
      const canvas = q("[data-quantum='gl']")[0] as HTMLCanvasElement | undefined;
      if (!host || headings.length === 0) return;

      const teardown: Array<() => void> = [];

      // Un SplitText por <h2> (SplitText no cruza elementos), pero los chars
      // se concatenan en UN array en orden de lectura. Ese array es lo único
      // que ven el stagger y la máscara: de ahí que el efecto sea uno para
      // todo el texto y no uno por línea.
      //
      // type:"chars" + smartWrap: sin word-divs pero cada palabra envuelta en
      // un <span white-space:nowrap>. Sin eso "Quantum-Secure" puede cortarse
      // a mitad de palabra (los chars de SplitText son puntos de quiebre).
      // autoSplit:false a propósito — con type:"chars" el split es estable
      // frente a carga de fuente y resize (son inline-blocks, el navegador
      // remaqueta solo); revert() recrearía nodos y dejaría al shine
      // apuntando a chars muertos.
      const chars: HTMLElement[] = [];
      for (const h2 of headings) {
        const split = SplitText.create(h2, {
          type: "chars",
          smartWrap: true,
          autoSplit: false,
          aria: "auto", // aria-label en el h2 + aria-hidden en cada char
        });
        teardown.push(() => split.revert());
        chars.push(...(split.chars as HTMLElement[]));
      }
      if (chars.length === 0) return;

      // Devuelve null sin lanzar si no hay WebGL2 utilizable. El reveal de
      // opacidad corre igual: el shine es una capa aditiva, no un requisito.
      const shine =
        motionOk && canvas
          ? createGlyphShine(canvas, {
              chars, // el bloque entero, las 2 líneas juntas
              host,
              observe: host,
              tint: [0.34, 0.97, 0.72], // en la línea de --near-green
              intensity: 1.0,
              padEm: 0.3,
            })
          : null;

      if (shine) {
        teardown.push(() => shine.destroy());
        // Un solo pointermove (ver pointer.ts).
        teardown.push(subscribePointer((x, y) => shine.setPointer(x, y)));
        // Gate del loop de rAF. El ScrollTrigger que crea lo revierte el ctx.
        onViewportToggle(host, (v) => shine.setVisible(v));
      }

      // ── Sincronización frente-de-luz ↔ frente-de-opacidad ───────────────
      // El stagger reparte el fade así: la letra i arranca en `i*EACH` y
      // termina en `i*EACH + CHAR`, o sea que está a MITAD de su fade en
      // `i*EACH + CHAR/2`. Invirtiendo eso se obtiene, para cualquier instante
      // t del tramo, cuál es el índice normalizado que está cambiando justo
      // ahora — que es exactamente lo que el shader espera como posición del
      // frente. Derivarlo de las mismas 2 constantes (y no tweenear un 0→1
      // aparte) es lo que garantiza que no haya desfase: si se toca EACH o
      // CHAR, las dos cosas se mueven juntas.
      const stagger = EACH * Math.max(chars.length - 1, 0);
      const span = stagger + CHAR;
      const frontAt = (t: number) => (stagger > 0 ? (t * span - CHAR / 2) / stagger : 0.5);

      const fp = { t: 0 };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: host, // el bloque completo, no una línea
          start: "top 80%",
          end: "bottom 45%",
          scrub: 0.5,
          // SIN invalidateOnRefresh: no hay ningún valor derivado del layout
          // acá (son opacidades fijas), así que no aporta nada — y sí rompe.
          // Cada refresh (y el provider dispara varios: mount, fonts.ready,
          // load, ResizeObserver) invalidaría los tweens y les haría re-leer
          // sus valores del DOM, perdiendo el estado inicial del reveal.
          markers: DEBUG_MARKERS,
          // sin pin, sin pinSpacing, sin anticipatePin
        },
        // onUpdate del TIMELINE, no del ScrollTrigger: corre en el mismo tick
        // en que el valor se escribió, y también durante el catch-up del
        // scrub numérico.
        onUpdate: shine ? () => shine.setFront(frontAt(fp.t)) : undefined,
      });

      // gsap.set() + .to() y NO un .from(): el estado inicial tiene que vivir
      // FUERA del tween. En un `from` vive adentro, y cualquier invalidate()
      // (ScrollTrigger.refresh lo hace si se lo pide, y otras secciones sí lo
      // piden) lo re-lee del DOM y lo pierde — el texto arranca al 100% y el
      // reveal no se ve nunca. Con el set separado el peor caso es que el
      // tween re-lea su punto de partida, que ya es 0.1.
      //
      // Se sigue conservando la propiedad importante del `from`: sin JS o con
      // el bundle todavía cargando, el texto se ve al 100% (legible), no
      // invisible — el 0.1 lo aplica este set recién cuando GSAP corre.
      gsap.set(chars, { opacity: DIM });

      tl.to(chars, { opacity: 1, duration: CHAR, ease: "none", stagger: { each: EACH } }, 0)
        // Mismo slot y misma duración total que el stagger de arriba: `fp.t`
        // es literalmente el reloj de ese tramo, normalizado.
        .to(fp, { t: 1, duration: span, ease: "none" }, 0);

      return () => {
        for (const fn of teardown) fn();
        // (tweens y ScrollTrigger los revierte mm/ctx por su cuenta)
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={rootRef} className="bg-stone text-foreground">
      <Container className="py-28 md:py-40">
        {/* `isolate` acota el grupo de blending del canvas a este bloque y
            `bg-stone` mete el fondo DENTRO del grupo aislado, para que screen
            tenga una base contra la que trabajar. `relative` es el ancestro
            posicionado contra el que glyphShine ubica el canvas.

            `overflow-hidden` + padding generoso no son decorativos: el canvas
            se dimensiona con un pad alrededor del texto, así que puede quedar
            más ancho que el bloque. Donde asome fuera de este fondo, el
            backdrop del grupo aislado es transparente y ahí `screen` deja de
            ser identidad — se vería el negro opaco del canvas como dos barras
            verticales a los lados. El padding evita que asome; el
            overflow-hidden lo garantiza. */}
        <div
          data-quantum="stage"
          className="relative isolate mx-auto flex max-w-5xl flex-col items-center overflow-hidden bg-stone px-10 py-12 text-center"
        >
          {LINES.map((line) => (
            <h2 key={line} data-quantum="line" className="text-h2 text-pretty">
              {line}
            </h2>
          ))}

          {/* Va después de los h2 en el DOM: el orden de pintado lo pone
              encima sin z-index. Arranca en 0x0 vía CLASE (h-0 w-0), no vía
              style inline — así los estilos que glyphShine escribe
              imperativamente siempre ganan y ningún re-render de React los
              clobberea. Sin JS, sin WebGL2, o en reduced-motion nunca crece:
              el fallback es "no hacer nada", sin ninguna rama condicional en
              el JSX. */}
          <canvas
            data-quantum="gl"
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 h-0 w-0 mix-blend-screen"
          />
        </div>
      </Container>

      {/* `invert` para que espeje al divider de arriba (el del HeroBanner) en
          vez de repetir su dirección: los dos bajaban hacia el centro y la
          banda de stone se leía inclinada. */}
      <ZigguratDivider from="var(--stone)" to="var(--background)" invert />
    </section>
  );
}
