"use client";

import Image from "next/image";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import ShineField from "@/components/primitives/ShineField";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { DUR, STAGGER, enterTimeline } from "@/components/sections/homepage-shared/motion";

// "Join our Newsletter" — una card gris apoyada sobre el crema.
//
// ── Qué cambió, y qué se fue con el cambio ───────────────────────────────────
//
// Fue una BANDA a corte recto: `bg-stone` de borde a borde del viewport, sin
// contenedor propio, con el wordmark "near" como primera línea de un titular que
// terminaba en "belongs to you." Ahora es una caja: ancho contenido, esquinas
// redondeadas, y el crema de las secciones vecinas respirando alrededor.
//
// Eso se llevó tres cosas:
//
//   · **El wordmark como titular.** Vivía DENTRO del `<h2>` porque era la
//     primera línea de la frase —su `alt` aportaba la palabra que faltaba para
//     que "NEAR belongs to you" se leyera entero—. El titular nuevo no lo
//     necesita: se lee solo. El icono de arriba es un glifo de marca, no parte
//     de una oración, así que va `aria-hidden` y fuera del heading.
//   · **`bg-stone`.** #d8d6d0 es el gris de una banda que ocupa el ancho entero;
//     en una card sobre crema se lee sucio, porque hay un borde contra el que
//     compararlo. `--card-surface` es el mismo gris subido y desaturado hasta
//     quedar a mitad de camino entre `--cream` (#f5f4f1) y `--stone`.
//   · **El corte duro contra las vecinas.** Era a propósito mientras la sección
//     fuera una banda; con una card, lo que la separa es el aire.
//
// El primitivo `StairTransition` sigue sin usarse acá — ver el historial de ab7.
const PALETTE = {
  // El gris de la card. No sale de los tokens porque no existe ahí: `--stone`
  // (#d8d6d0) es una superficie de banda y `--card-tint` (#eae9e6) es el escalón
  // apenas perceptible de las cards de `OwnYourOwn`. Esta card tiene que leerse
  // como un objeto apoyado sobre el crema, que es más contraste que el segundo y
  // menos peso que el primero.
  "--card-surface": "#e2e1de",
} as React.CSSProperties;

export default function BelongsNewsletter() {
  // La entrada, con la gramática de la página (ver `motion.ts`).
  //
  // Era la única sección del recorrido que no tenía ninguna: aparecía puesta,
  // entre dos vecinas que sí entran. Ese hueco es de lo que hacía que la página
  // se sintiera despareja — no porque la card estuviera mal, sino porque el
  // pulso se cortaba justo antes del cierre.
  //
  // La card sube entera y su contenido entra escalonado por dentro. Son dos
  // movimientos y no uno porque son dos cosas distintas: la card es un objeto
  // que se apoya, y lo de adentro es texto que se lee.
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk }) => {
    if (!motionOk) return;

    const card = q("[data-card]")[0];
    const lines = q("[data-line]");
    if (!card) return;

    const tl = enterTimeline(scope);
    tl.from(card, { autoAlpha: 0, y: 34 }, 0);
    tl.from(lines, { autoAlpha: 0, y: 16, duration: DUR.base, stagger: STAGGER }, 0.18);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      gsap.set([card, ...lines], { clearProps: "all" });
    };
  });

  return (
    <section
      ref={rootRef}
      className="bg-cream py-16 text-foreground md:py-20"
      style={PALETTE}
    >
      <Container>
        {/* El aire vertical va en `%` del ancho y no en rem: la card conserva su
            proporción al ensancharse en vez de achatarse. Mismo criterio que
            tenía el card negro del statement antes de que se fuera. */}
        <div
          data-card
          className="rounded-[32px] bg-[var(--card-surface)] px-6 py-[7%] text-center sm:px-10"
        >
          <div className="mx-auto flex max-w-2xl flex-col items-center">
            {/* El glifo de marca. `aria-hidden` y fuera del `<h2>`: acá no
                aporta una palabra a la frase —el titular se lee solo— así que
                anunciarlo sería ruido. La altura en `em` del titular lo ata a la
                escala tipográfica sin darle un rol propio. */}
            <Image
              data-line
              src="/prototype/homepage-a/near-squircle.svg"
              alt=""
              aria-hidden="true"
              width={800}
              height={800}
              unoptimized
              // `mb-9` contra el `mt-1` del párrafo de abajo, y esa asimetría es
              // el punto: el titular tiene aire heredado por ABAJO —el line-box
              // reserva las descendentes, que "Join our Newsletter" casi no
              // usa— y nada por arriba, porque el icono es una imagen y su caja
              // termina donde termina el dibujo. Márgenes iguales arriba y abajo
              // se leen desparejos.
              className="mb-9 h-[clamp(2.75rem,4.5vw,3.75rem)] w-auto"
            />

            {/* `text-h2` y no `text-h1`: en h1 el titular mide ~830px de línea
                —19 caracteres de serif italic a 5.5rem, que `Accent` sube a
                1.18em— contra los 672px del `max-w-2xl` de esta columna, así que
                se partía en dos. En h2 entra en una con ~110px de sobra.

                El `nowrap` arranca en `sm` y no antes: por debajo de eso el
                ancho disponible cae a ~200px y una línea de 19 caracteres no
                entra a ningún tamaño de la escala. Ahí envolver es lo correcto,
                y forzarlo sería scroll lateral en toda la página. */}
            <h2 data-line className="text-h2 sm:whitespace-nowrap">
              <Accent>Join our Newsletter</Accent>
            </h2>

            {/* `mt` y no un `gap` del flex: el titular en serif italic ya trae su
                propio descuelgue bajo la última línea —el line-box del `text-h2`
                reserva el espacio de las descendentes, y "Join our Newsletter"
                solo usa la "J"— así que el aire declarado se suma a un hueco que
                ya existe. Por eso `mt-1` y no el `mt-4` de antes: lo que separa
                de verdad estas dos líneas es casi todo interlineado. */}
            <p data-line className="mt-1 max-w-lg text-body text-pretty">
              Get the latest product launches, protocol milestones, and ecosystem
              updates straight to your inbox.
            </p>

            <div data-line className="mt-8 flex w-full justify-center">
              <ShineField
                placeholder="email address"
                label="Email address"
                buttonLabel="sign up"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
