"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import ShineField from "@/components/primitives/ShineField";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS, EASE_OUT } from "@/components/primitives/motion/motionTokens";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { BELONGS_COPY, Wordmark } from "@/components/sections/newsletter-labs/BelongsParts";

// ── 12 · Sonar ───────────────────────────────────────────────────────────────
//
// La única de las catorce cuyo movimiento **responde al lector** en vez de
// dispararse al llegar: al enfocar el campo, la sección emite un anillo que se
// abre desde él y se apaga contra los bordes.
//
// La apuesta: en una banda cuyo único trabajo es que alguien escriba, el
// momento que importa no es la entrada — es el clic en el campo. Todas las
// demás gastan su gesto antes de ese instante; esta lo guarda para él.
//
// ── Por qué es de foco y no de hover ────────────────────────────────────────
//
// El hover se dispara de paso: el puntero cruza el campo camino de otra cosa y
// la sección late sin que nadie haya decidido nada. El foco solo ocurre cuando
// el lector ya se comprometió — y llega igual por teclado, que es la mitad de
// los casos que un hover se pierde.
//
// ── El anillo NO se monta y desmonta ────────────────────────────────────────
//
// Los tres viven siempre en el DOM y el foco solo los reproduce. Montarlos al
// vuelo obligaría a medir el campo en el peor momento (justo cuando el
// navegador está resolviendo el foco y puede estar haciendo scroll para
// mostrarlo), y el primer anillo saldría desde una posición vieja.
//
// ── Se engancha por delegación, sin tocar ShineField ────────────────────────
//
// `focusin`/`focusout` burbujean —`focus` no— así que un par de listeners en la
// sección alcanza para saber que el campo se activó. `ShineField` es el
// componente de producción y esta variante no lo modifica: si mañana cambia por
// dentro, esto sigue funcionando.

// Cuántos anillos salen por pulso y cuánto se separan entre sí. Tres con 0.18s
// de diferencia se leen como UNA onda con grosor; con más, como tres cosas.
const RINGS = 3;
const RING_GAP = 0.18;

export default function Belongs12Sonar() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk }) => {
    if (!motionOk) return;

    const rings = q("[data-ring]");
    const block = q("[data-block]")[0];
    if (rings.length === 0) return;

    gsap.set(rings, { autoAlpha: 0, scale: 0.25 });

    // El pulso: los anillos salen del campo, crecen y se apagan. `paused` y
    // guardado en la ref — el foco lo rebobina y lo reproduce.
    const pulse = gsap.timeline({ paused: true });
    rings.forEach((ring, i) => {
      pulse.fromTo(
        ring,
        { autoAlpha: 0.55, scale: 0.25 },
        { autoAlpha: 0, scale: 2.6, duration: 1.5, ease: "power2.out" },
        i * RING_GAP
      );
    });
    // La entrada, aparte del pulso: el bloque sube al aparecer la sección. Es lo
    // único que esta variante hace sin que nadie se lo pida.
    const intro = gsap.timeline({
      scrollTrigger: { trigger: scope, start: "top 78%", once: true, markers: DEBUG_MARKERS },
    });
    if (block) {
      intro.from(block.children, {
        autoAlpha: 0,
        y: 20,
        duration: 0.75,
        stagger: 0.1,
        ease: EASE_OUT,
      });
    }

    // `focusin`/`focusout` y no `focus`: los segundos no burbujean, así que un
    // listener en la sección nunca los vería.
    // Solo `focusin`: al perder el foco NO se corta el pulso en curso. La onda
    // que ya salió termina su camino — cortarla dejaría un anillo congelado a
    // media pantalla.
    const onFocusIn = () => pulse.restart();
    scope.addEventListener("focusin", onFocusIn);

    return () => {
      scope.removeEventListener("focusin", onFocusIn);
      pulse.kill();
      intro.scrollTrigger?.kill();
      intro.kill();
      gsap.set(rings, { clearProps: "all" });
      if (block) gsap.set(block.children, { clearProps: "all" });
    };
  });

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-stone py-24 text-ink lg:py-32">
      <Container className="relative flex flex-col items-center gap-8 text-center">
        <div data-block className="flex flex-col items-center gap-8">
          <h2 className="flex flex-col items-center text-h1 text-pretty">
            <Wordmark height="clamp(2rem, 1.5rem + 2.4vw, 3.6rem)" className="mb-1" />
            <Accent>{BELONGS_COPY.claim}</Accent>
          </h2>

          <p className="max-w-[46ch] text-body-lg text-ink/70 text-pretty">{BELONGS_COPY.body}</p>

          {/* El campo y los anillos comparten contenedor: así el centro de la
              onda es el centro del campo sin medir nada. Los anillos van detrás
              (`-z-10` no: el campo ya crea contexto propio) y sin
              `pointer-events`, o taparían el clic que los dispara. */}
          <div className="relative w-full max-w-[32rem]">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              {Array.from({ length: RINGS }, (_, i) => (
                <span
                  key={i}
                  data-ring
                  // Cada anillo es un óvalo del tamaño del campo, centrado en él.
                  // `rounded-full` sobre una caja ancha da la elipse que un
                  // círculo perfecto no daría — y la elipse es lo que hace que la
                  // onda parezca salir del CAMPO y no de un punto.
                  className="absolute inset-0 rounded-full border border-green-ink"
                />
              ))}
            </div>

            <div className="relative">
              <ShineField
                placeholder={BELONGS_COPY.placeholder}
                label={BELONGS_COPY.label}
                buttonLabel={BELONGS_COPY.button}
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
