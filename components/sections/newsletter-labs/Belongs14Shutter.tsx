"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import ShineField from "@/components/primitives/ShineField";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { BELONGS_COPY, Wordmark } from "@/components/sections/newsletter-labs/BelongsParts";

// ── 14 · Shutter ─────────────────────────────────────────────────────────────
//
// La banda llega tapada por once lamas verticales del color de la sección de
// abajo, y se abre: las lamas se retiran hacia arriba una tras otra, desde el
// centro hacia los extremos, y descubren el gris y el bloque.
//
// Es la hermana dura de la 11. Aquella barre con un telón entero y el gesto es
// suave; esta lo hace en once tiempos y se lee como un mecanismo. Las dos
// resuelven la juntura con movimiento —lo que hacían las escaleras— pero una
// dice «se abre» y la otra «se destraba».
//
// ── Desde el centro, y no de izquierda a derecha ────────────────────────────
//
// De izquierda a derecha, once lamas escalonadas se leen como una ola: el ojo
// sigue el frente y llega al borde derecho con el contenido ya destapado a sus
// espaldas. Desde el centro, las dos mitades se abren a la vez y el sitio donde
// termina el gesto es también donde está el texto.
//
// El retardo sale de la DISTANCIA al centro, no del índice: con `Math.abs` las
// dos lamas simétricas arrancan juntas, que es lo que hace que se lea como una
// apertura y no como dos olas seguidas.
//
// ── Las lamas se van del todo; no se desvanecen ─────────────────────────────
//
// Suben hasta salir por el borde superior de la sección, que las recorta
// (`overflow-hidden`). Un fundido las convertiría en una capa que se apaga —el
// ojo lo lee como transparencia, no como algo que se movió— y el mecanismo se
// perdería.
//
// ── Sin clases de translate en el markup ────────────────────────────────────
//
// Las lamas arrancan en su sitio (`inset-y-0`) y el estado inicial lo pone
// GSAP. En Tailwind v4, `translate-y-*` compila a la propiedad `translate` y NO
// a `transform`: se sumaría al `yPercent` del tween y las lamas terminarían
// desplazadas. Es el bug que se comió media hora en la 11 y está anotado ahí.

// Once y no diez: impar deja UNA lama en el centro exacto, y la apertura tiene
// un punto de partida en vez de una costura.
const SLATS = 11;

// Retardo entre lamas consecutivas hacia afuera, en segundos.
const SLAT_STEP = 0.055;

export default function Belongs14Shutter() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk }) => {
    if (!motionOk) return;

    const slats = q("[data-slat]");
    const block = q("[data-block]")[0];
    if (slats.length === 0) return;

    // Estado de partida desde JS: en el markup, las lamas taparían el contenido
    // para siempre si el bundle fallara.
    gsap.set(slats, { yPercent: 0 });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: scope, start: "top 80%", once: true, markers: DEBUG_MARKERS },
    });

    const mid = (SLATS - 1) / 2;
    slats.forEach((slat, i) => {
      tl.to(
        slat,
        { yPercent: -100, duration: 0.7, ease: "power3.inOut" },
        Math.abs(i - mid) * SLAT_STEP
      );
    });

    // El bloque entra cuando la apertura ya pasó por el centro, no al final:
    // esperar a la última lama deja un hueco muerto de medio segundo.
    if (block) {
      tl.from(
        block.children,
        { autoAlpha: 0, y: 22, duration: 0.7, stagger: 0.09, ease: "power3.out" },
        0.45
      );
    }

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      gsap.set(slats, { clearProps: "all" });
      if (block) gsap.set(block.children, { clearProps: "all" });
    };
  });

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-stone py-24 text-ink lg:py-32">
      {/* Las lamas, del color de la sección que viene DEBAJO: lo que se retira
          es el crema, y lo que queda es el gris de esta banda. Al revés —lamas
          grises sobre crema— la sección parecería taparse en vez de abrirse.

          `flex` con lamas de `flex-1` y no anchos calculados: once columnas
          iguales sin un solo número, y sin costuras de redondeo entre ellas. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 flex"
      >
        {Array.from({ length: SLATS }, (_, i) => (
          <span key={i} data-slat className="h-full flex-1 bg-cream" />
        ))}
      </div>

      <Container className="relative flex flex-col items-center gap-8 text-center">
        <div data-block className="flex flex-col items-center gap-8">
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
        </div>
      </Container>
    </section>
  );
}
