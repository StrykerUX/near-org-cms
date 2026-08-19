"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import ShineField from "@/components/primitives/ShineField";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { pauseOffscreen } from "@/components/primitives/motion/pauseOffscreen";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { BELONGS_COPY, Wordmark } from "@/components/sections/newsletter-labs/BelongsParts";

// ── 13 · Ticker ──────────────────────────────────────────────────────────────
//
// Dos cintas de caracteres cruzan la banda en direcciones opuestas, por encima y
// por debajo del bloque, y no paran nunca. El claim y el campo quedan en medio,
// quietos.
//
// Es la única de las catorce con movimiento PERPETUO. Las demás entran y se
// detienen; esta sigue. La apuesta: una banda que respira sin parar convierte el
// final de la página en algo que está VIVO, y en una homepage larga es lo último
// que el lector ve antes del footer.
//
// El riesgo es el mismo que la apuesta, dado vuelta: algo que nunca para compite
// con todo lo que hay alrededor, y acá alrededor está el campo. Por eso las
// cintas van al 12% de opacidad y a velocidad de reloj de pared — si al leer el
// párrafo el ojo se va a los bordes, está mal calibrado.
//
// ── El texto de las cintas es la propia frase ───────────────────────────────
//
// No un relleno decorativo: es «near belongs to you» repetida, en versalitas
// mono, separada por rombos. Es un eco de lo que ya está escrito en grande —
// como el marquee de `hero-alt/FlowBars`— y por eso va `aria-hidden`: un lector
// de pantalla no debería oír la frase ocho veces.
//
// ── El loop, sin costura ────────────────────────────────────────────────────
//
// Contenido duplicado y `xPercent` de −50: al llegar a la mitad, la cinta está
// en un estado visualmente idéntico al del principio, así que el salto no se ve.
// Es el mismo mecanismo de siempre en el repo.
//
// `pauseOffscreen` corta las dos cintas cuando la sección sale de pantalla. Dos
// tweens infinitos repintando fuera de cuadro son exactamente lo que el toolkit
// de motion existe para evitar — y además liberan el `will-change`, que si no se
// queda reservando capas de GPU toda la sesión.

const TAPE = `${"near belongs to you"} ◆ `;

// Cuánto tarda una cinta en recorrer su ciclo. 46s a este ancho son ~35px por
// segundo: se ve que se mueve si uno lo mira, no se nota si uno lee.
const CYCLE = 46;

export default function Belongs13Ticker() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk }) => {
    if (!motionOk) return;

    const lanes = q("[data-lane]");
    if (lanes.length === 0) return;

    lanes.forEach((lane, i) => {
      // La de arriba va a la izquierda y la de abajo a la derecha: en el mismo
      // sentido, las dos se leerían como una sola cosa muy alta.
      const toLeft = i === 0;
      gsap.set(lane, { xPercent: toLeft ? 0 : -50 });
      pauseOffscreen(
        gsap.to(lane, {
          xPercent: toLeft ? -50 : 0,
          duration: CYCLE,
          ease: "none",
          repeat: -1,
        }),
        scope
      );
    });

    return () => {
      gsap.killTweensOf(lanes);
      gsap.set(lanes, { clearProps: "all" });
    };
  });

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-stone py-20 text-ink lg:py-24">
      {/* Las dos cintas. `select-none` para que no se puedan seleccionar por
          accidente al arrastrar sobre la sección: no son texto que nadie quiera
          copiar. */}
      <div aria-hidden="true" className="select-none">
        <Tape />
      </div>

      <Container className="relative flex flex-col items-center gap-8 py-10 text-center">
        <h2 className="flex flex-col items-center text-h1 text-pretty">
          <Wordmark height="clamp(2rem, 1.5rem + 2.4vw, 3.6rem)" className="mb-1" />
          <Accent>{BELONGS_COPY.claim}</Accent>
        </h2>

        <p className="max-w-[46ch] text-body-lg text-ink/70 text-pretty">{BELONGS_COPY.body}</p>

        <div className="w-full max-w-[32rem]">
          <ShineField
            placeholder={BELONGS_COPY.placeholder}
            label={BELONGS_COPY.label}
            buttonLabel={BELONGS_COPY.button}
          />
        </div>
      </Container>

      <div aria-hidden="true" className="select-none">
        <Tape reverse />
      </div>
    </section>
  );
}

/* ── Una cinta ────────────────────────────────────────────────────────────── */

function Tape({ reverse = false }: { reverse?: boolean }) {
  return (
    <div className="overflow-hidden">
      {/* `w-max` y el contenido duplicado son lo que hace que el −50% caiga
          justo sobre la costura. Sin `w-max`, la cinta mide lo que el
          contenedor y el bucle se rompe. */}
      <div data-lane className="flex w-max">
        {[0, 1].map((copy) => (
          <p
            key={copy}
            className={`text-eyebrow-mono whitespace-nowrap uppercase ${
              reverse ? "text-green-ink/25" : "text-ink/12"
            }`}
          >
            {TAPE.repeat(8)}
          </p>
        ))}
      </div>
    </div>
  );
}
