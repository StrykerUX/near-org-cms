"use client";

import { gsap, ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";

// ── B · Counterform ──────────────────────────────────────────────────────────
//
// El agujero de la «O» se traga la página. La palabra que cierra la sección de
// arriba —«Own»— se repite a tamaño de póster, y su contraforma crece hasta
// cubrir la pantalla: el negro no llega de afuera, sale de DENTRO de la
// tipografía.
//
// Es el mecanismo del hero de los drafts EX, con una diferencia que importa:
// allá la «o» es un path horneado y su contraforma se recorta con un
// `clipPath`; acá la palabra es TEXTO de verdad —seleccionable, traducible— y
// no hay path del que sacar el agujero.
//
// ── La solución: un círculo medido, no recortado ────────────────────────────
//
// La contraforma de una «O» de palo seco es, con muy buena aproximación, un
// círculo. Así que en vez de extraer la forma real se MIDE la caja del glifo en
// el DOM y se crece un disco desde su centro, con el radio del ojo. El disco va
// por ENCIMA de la palabra, de modo que la come de adentro hacia afuera, que es
// exactamente lo que hace el agujero cuando crece.
//
// El precio de no ser el clip real: en una tipografía con el ojo muy ovalado el
// disco se desalinea del trazo. Con esta —Montreal— la diferencia no se ve, y a
// cambio el texto sigue siendo texto.

// ── La transición SOLAPA la sección de arriba ───────────────────────────────
//
// `-mt-[100svh]` y `z-[2]`: el tramo empieza una pantalla ANTES de donde
// terminaría la sección anterior, así que el gesto ocurre encima de ella —
// todavía con las cards en pantalla— y no sobre un rectángulo vacío.
//
// Sin eso, el primer viewport del tramo es una pantalla de cream con nada, el
// gesto arranca recién después, y lo que se lee no es una transición: es una
// pausa y después un efecto. El coste real en scroll es también menor: el
// recorrido menos la pantalla que solapa.

const TRAVEL = "180svh";

// El ojo de la «O» como fracción de su caja. Medido contra el glifo real: la
// caja incluye el trazo, y el hueco es bastante más chico que ella.
const EYE = 0.3;

export default function TransCounter() {
  const rootRef = useMotionScope<HTMLElement>(({ scope, motionOk }) => {
    const veil = scope.querySelector<HTMLElement>("[data-veil]");
    const hole = scope.querySelector<HTMLElement>("[data-hole]");
    const glyph = scope.querySelector<HTMLElement>("[data-glyph]");
    const word = scope.querySelector<HTMLElement>("[data-word]");
    const stageEl = scope.querySelector<HTMLElement>("[data-stage]");
    if (!veil || !hole || !glyph || !word || !stageEl) return;

    // Sin motion no hay agujero ni palabra: el tramo es negro y ya. Es la
    // degradación correcta — lo que el gesto tenía para decir es el cambio de
    // fondo, y ese se entrega sin mover nada. El velo hace de telón porque el
    // disco, sin medir, no tiene ni tamaño ni sitio.
    if (!motionOk) {
      veil.style.backgroundColor = "var(--ink)";
      gsap.set(veil, { autoAlpha: 1 });
      gsap.set(word, { autoAlpha: 0 });
      gsap.set(hole, { autoAlpha: 0 });
      return;
    }

    // El disco se monta con un radio fijo y crece por `scale`: escalar es
    // composición, y animar `width`/`height` sería layout en cada frame.
    const R0 = 40;
    let kEnd = 1;

    const measure = () => {
      const g = glyph.getBoundingClientRect();
      const s = stageEl.getBoundingClientRect();
      const cx = g.left + g.width / 2 - s.left;
      const cy = g.top + g.height / 2 - s.top;
      // El radio del ojo, y desde ahí cuánto hay que crecer para tapar la
      // esquina más lejana de la pantalla.
      const r = (Math.min(g.width, g.height) / 2) * EYE;
      const far = Math.max(
        Math.hypot(cx, cy),
        Math.hypot(s.width - cx, cy),
        Math.hypot(cx, s.height - cy),
        Math.hypot(s.width - cx, s.height - cy)
      );
      // El centrado va por MARGEN negativo y la posición por `left/top`
      // escritos a mano, sin tocar el `transform`. Dos motivos, los dos
      // aprendidos a golpes acá:
      //
      // 1. Con `-translate-x-1/2` de Tailwind, el primer `scale` que escribe
      //    GSAP reemplaza el `transform` entero y el centrado desaparece.
      // 2. Con `xPercent/yPercent` de GSAP la posición es correcta, pero este
      //    `gsap.set` corre también en cada refresh y deja huérfano al
      //    `quickSetter` creado antes: sus escrituras van a una caché de
      //    transform que ya no es la del elemento, y el disco se queda en
      //    escala 1 para siempre.
      //
      // Con margen, el `transform` es SOLO del quickSetter y nadie más lo toca.
      hole.style.left = `${cx}px`;
      hole.style.top = `${cy}px`;
      hole.style.width = `${R0 * 2}px`;
      hole.style.height = `${R0 * 2}px`;
      hole.style.marginLeft = `${-R0}px`;
      hole.style.marginTop = `${-R0}px`;
      kEnd = (far * 1.06) / R0;
      // El disco arranca EXACTAMENTE del tamaño del ojo: si arrancara de cero,
      // el primer frame sería un punto apareciendo en medio de la letra en vez
      // de el hueco que ya está ahí.
      return r / R0;
    };

    let k0 = measure();

    // `gsap.set` y no `quickSetter`: en esta versión, un quickSetter sobre
    // `scale` no escribe nada —el `transform` del disco se quedaba en `none`
    // frame tras frame— mientras que `scaleY` (el del telón de A) sí funciona.
    // No vale la pena averiguar por qué: es UNA escritura por frame.
    const set = (k: number) => gsap.set(hole, { scale: k });
    const setVeil = gsap.quickSetter(veil, "opacity");
    set(k0);
    setVeil(0);
    // La palabra arranca apagada: hasta que el velo no despeje lo de arriba,
    // dos titulares en pantalla a la vez.
    gsap.set(word, { autoAlpha: 0 });

    const t = ScrollTrigger.create({
      trigger: scope,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const p = self.progress;
        // El velo despeja lo de arriba antes de que la palabra entre: la «O»
        // tiene que aparecer sobre cream limpio, o compite con las cards.
        setVeil(Math.min(1, p / 0.1));
        // Exponencial y no lineal: el área crece con el cuadrado del radio, así
        // que un crecimiento lineal se siente parado al principio y disparado
        // al final.
        set(k0 * Math.pow(kEnd / k0, Math.min(1, p / 0.8)));
        // La palabra ENTRA con el velo y se apaga tarde. Entrando junto al
        // velo, nunca se la ve encima de las cards —serían dos titulares en
        // pantalla a la vez—; y apagándose tarde, el agujero llega a comerse
        // buena parte de ella antes de que desaparezca, que es el gesto.
        const inn = Math.min(1, p / 0.12);
        const out = Math.min(1, Math.max(0, (p - 0.5) / 0.3));
        gsap.set(word, { autoAlpha: inn * (1 - out) });
      },
    });

    const onResize = () => {
      k0 = measure();
    };
    ScrollTrigger.addEventListener("refreshInit", onResize);

    return () => {
      t.kill();
      ScrollTrigger.removeEventListener("refreshInit", onResize);
    };
  });

  return (
    <section
      ref={rootRef}
      style={{ "--travel": TRAVEL } as React.CSSProperties}
      className="relative z-[2] -mt-[100svh] h-[var(--travel)] bg-transparent"
    >
      <div data-stage className="sticky top-0 flex h-svh items-center justify-center overflow-hidden">
        <div data-veil aria-hidden="true" className="absolute inset-0 bg-cream" />

        <p data-word className="relative text-display text-ink">
          <span data-glyph className="inline-block">O</span>wn
        </p>

        {/* El disco. `absolute` con `left/top` en px escritos por la medición y
            el centrado por transform: así el punto de anclaje es el centro del
            ojo y no su esquina. */}
        <span
          data-hole
          aria-hidden="true"
          className="absolute rounded-full bg-ink"
        />
      </div>
    </section>
  );
}
