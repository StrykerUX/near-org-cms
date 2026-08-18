"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { gsap, SplitText } from "@/components/primitives/motion/gsapClient";
import { createSeededRandom } from "@/components/primitives/motion/seededRandom";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";

// ── 03 · Shatter ─────────────────────────────────────────────────────────────
//
// La versión que no tiene fondo. Ni video, ni shader, ni retícula: sobre crema
// liso, lo único que se mueve es el titular, y el gesto entero cabe en el
// espacio 3D de los propios glifos.
//
// Cada carácter llega desde SU posición en Z, con su rotación en los tres ejes,
// y aterriza en el plano de la página. No es un stagger de opacidad con un poco
// de `y`: los caracteres del fondo del espacio llegan visiblemente más tarde y
// más girados que los del frente, así que durante el primer medio segundo la
// palabra es una nube y recién después se resuelve.
//
// ── Por qué el desorden es sembrado y no aleatorio ──────────────────────────
//
// `createSeededRandom` y no `Math.random`: el reparto de posiciones tiene que
// ser el MISMO en cada carga. Con random puro, dos recargas dan dos coreografías
// distintas, y entonces "el gesto quedó mejor esta vez" no es una observación
// sobre el diseño sino sobre la tirada — imposible de iterar contra eso. Es la
// misma razón por la que el toolkit lo trae.
//
// ── La perspectiva va en el CONTENEDOR ──────────────────────────────────────
//
// `transformPerspective` por elemento le da a cada carácter su propio punto de
// fuga, así que todos parecen mirar al frente y la profundidad se pierde. Con
// `perspective` en el padre hay UN punto de fuga para los quince, y los de los
// extremos entran de costado — que es lo que hace que se lea como espacio y no
// como quince zooms independientes.

// Profundidad de la explosión, en px de Z. A 900 los glifos del fondo entran
// casi como puntos; más allá, tardan tanto en crecer que la palabra se lee
// incompleta demasiado tiempo.
const DEPTH = 900;

// Giro máximo por eje, en grados. Deliberadamente asimétrico: más en X que en Y
// y muy poco en Z. Con los tres iguales el conjunto se lee como un remolino, y
// un remolino tiene una dirección — que es lo contrario de "estalló".
const TILT = { x: 70, y: 55, z: 18 };

export default function ShatterHero() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk }) => {
    const title = q("[data-sh-title]")[0];
    const sub = q("[data-sh-sub]")[0];
    if (!motionOk) return;

    const split = SplitText.create(title, { type: "chars" });

    // El sembrado se consume UNA vez y en orden, así que cada carácter se queda
    // con su terna para siempre — incluida la salida, que reusa el mismo array.
    const rand = createSeededRandom();
    const seeds = split.chars.map(() => ({
      z: -DEPTH * (0.25 + 0.75 * rand()),
      rx: (rand() - 0.5) * 2 * TILT.x,
      ry: (rand() - 0.5) * 2 * TILT.y,
      rz: (rand() - 0.5) * 2 * TILT.z,
      // El retardo NO sale del índice: si saliera, la palabra se armaría de
      // izquierda a derecha y volveríamos a tener un barrido.
      delay: rand(),
    }));

    const intro = gsap.timeline();
    split.chars.forEach((char, i) => {
      const s = seeds[i];
      intro.from(
        char,
        {
          z: s.z,
          rotationX: s.rx,
          rotationY: s.ry,
          rotationZ: s.rz,
          autoAlpha: 0,
          duration: 1.25,
          // `back.out` con un overshoot chico: el glifo pasa unos grados de
          // largo y vuelve. Es lo que le da masa — sin eso, aterrizar en un
          // `power3` se ve como un fade con transform.
          ease: "back.out(1.35)",
        },
        s.delay * 0.55
      );
    });

    intro.from(sub, { autoAlpha: 0, y: 20, duration: 0.7 }, 1.0);

    // ── Salida: la misma nube, al revés ──────────────────────────────────────
    //
    // Los mismos seeds, con el signo de Z invertido: los caracteres se van HACIA
    // el lector en vez de volver al fondo. Ir hacia adelante al salir es lo que
    // hace que el hero se sienta atravesado y no abandonado.
    const exit = gsap.timeline({
      scrollTrigger: { trigger: scope, start: "top top", end: "bottom top", scrub: 0.5 },
    });
    split.chars.forEach((char, i) => {
      const s = seeds[i];
      exit.to(
        char,
        {
          z: 260 + 240 * s.delay,
          rotationX: s.rx * 0.4,
          rotationY: s.ry * 0.4,
          autoAlpha: 0,
          ease: "none",
        },
        s.delay * 0.25
      );
    });
    exit.to(sub, { autoAlpha: 0, y: -30, ease: "none" }, 0);

    return () => {
      intro.kill();
      exit.scrollTrigger?.kill();
      exit.kill();
      split.revert();
    };
  });

  return (
    <section
      ref={rootRef}
      style={{ height: "100svh" }}
      className="relative flex flex-col overflow-hidden bg-cream text-foreground"
    >
      <div aria-hidden="true" className="h-[var(--site-header-block)] shrink-0" />

      <Container className="relative flex flex-1 flex-col items-center justify-center gap-6 py-14 text-center">
        {/* La perspectiva y el `transform-style` van en el padre del titular, no
            en el titular: los caracteres son nietos —SplitText los envuelve— y
            un `preserve-3d` que no llega hasta ellos aplana la escena sin
            avisar. Los dos van inline porque son mecanismo de la animación, no
            una variante de diseño que alguien quiera tocar desde una clase. */}
        <div style={{ perspective: "1100px", transformStyle: "preserve-3d" }}>
          <h1 data-sh-title className="text-display text-pretty">
            Own your <Accent display>world.</Accent>
          </h1>
        </div>

        <p data-sh-sub className="max-w-xl text-body-lg text-muted-foreground text-pretty">
          Move cross-chain, trade perps, hold RWAs, stay confidential, and access
          all of DeFi from your own wallet.
        </p>
      </Container>
    </section>
  );
}
