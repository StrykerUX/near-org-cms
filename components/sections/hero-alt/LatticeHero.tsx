"use client";

import Container from "@/components/primitives/Container";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import LatticeCanvas, {
  LATTICE_INTRO,
} from "@/components/sections/hero-alt/LatticeCanvas";

// ── 05 · Lattice ─────────────────────────────────────────────────────────────
//
// Una retícula de ~2600 puntos que colapsa hasta formar el titular, y cuando la
// nube aterriza sobre los glifos el titular real aparece encima: el texto se
// SOLIDIFICA a partir de los puntos. Esa es la lectura del gesto, y es lo que
// hay que ver para que la versión signifique algo.
//
// La silueta no está descrita en ningún lado — se muestrea del propio texto
// dibujado en un canvas fuera de pantalla, así que cambiar la copy cambia la
// escena sola y la nube respeta los remates reales de la tipografía del DS.
//
// ── Qué estaba roto en la primera versión ───────────────────────────────────
//
// Se veía vacía, y por dos razones que se tapaban entre sí:
//
//  1. **El gesto no ocurría.** El colapso iba atado al scroll con
//     `start: "top bottom"`, y un hero ocupa el viewport desde el frame cero:
//     el trigger ya nacía por la mitad de su recorrido, así que la nube estaba
//     formada antes de que nadie tocara nada. No había nada que mirar porque ya
//     había pasado. Ahora el colapso es una timeline que corre al montar
//     (`drive="intro"`), y al scroll le queda la SALIDA.
//  2. **No se veía.** Los puntos iban en `--bar` (#D9D9D9) sobre `--cream`
//     (#F5F4F1): 1.1:1 de contraste. Literalmente invisibles. Ahora van en
//     `--gray-intermediate`, que sobre crema da ~5:1.
//
// Las dos juntas daban una sección que parecía no tener contenido — y de las
// cinco era la que más dependía de que el gesto se leyera, porque no tiene
// fondo, ni color, ni material propio.

const LINES = ["Own your", "world."] as const;

// Literal y no `var(--gray-intermediate)`: el canvas recibe un color, y una
// declaración CSS sin resolver se pinta como transparente — que es exactamente
// el modo en que esta escena ya se rompió una vez.
const DOT = "#6c7477";

export default function LatticeHero() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk }) => {
    const title = q("[data-la-title]")[0];
    const sub = q("[data-la-sub]")[0];

    // El titular nace VISIBLE en el JSX y solo se oculta desde acá. Sin JS, o
    // con reduced-motion, lo que queda es el hero completo y legible — no un
    // titular que espera para siempre un tween que nadie va a crear.
    if (!motionOk) return;

    gsap.set([title, sub], { autoAlpha: 0 });

    const tl = gsap.timeline();
    // El titular entra en el instante en que la nube ya está sobre los glifos.
    // `LATTICE_INTRO.settle` viene del canvas y no es una constante copiada:
    // con dos números a mano, el primer ajuste del colapso desincroniza las dos
    // mitades del gesto y el texto aparece antes o después de su propia nube.
    tl.to(title, { autoAlpha: 1, duration: 0.55, ease: "power2.out" }, LATTICE_INTRO.settle);
    tl.to(sub, { autoAlpha: 1, duration: 0.5 }, LATTICE_INTRO.settle + 0.25);

    // Salida: el texto se va con la nube, que cae por su cuenta en el canvas.
    const exit = gsap.timeline({
      // `scope` y no `rootRef.current`: dentro de este callback la variable
      // todavía no está asignada — el hook la devuelve DESPUÉS de llamarlo. El
      // scope es el mismo nodo, ya desreferenciado, y es para lo que está.
      scrollTrigger: { trigger: scope, start: "top top", end: "bottom top", scrub: 0.4 },
    });
    exit.to([title, sub], { autoAlpha: 0, y: -60, ease: "none" }, 0);

    return () => {
      tl.kill();
      exit.scrollTrigger?.kill();
      exit.kill();
    };
  });

  return (
    <section
      ref={rootRef}
      style={{ height: "100svh" }}
      className="relative flex flex-col overflow-hidden bg-cream text-foreground"
    >
      <LatticeCanvas lines={LINES} target="text" drive="intro" dot={DOT} />

      <div aria-hidden="true" className="h-[var(--site-header-block)] shrink-0" />

      <Container className="relative z-[1] flex flex-1 flex-col items-center justify-center gap-6 py-14 text-center">
        {/* El titular real, encima de la nube y en negro pleno. Los dos dicen lo
            mismo y se superponen a propósito: los puntos aterrizan justo sobre
            los glifos y el texto aparece ahí, así que el eco se convierte en la
            cosa. Es lo que cierra el gesto. */}
        <h1 data-la-title className="text-display text-pretty">
          Own your world.
        </h1>

        <p data-la-sub className="max-w-xl text-body-lg text-muted-foreground text-pretty">
          Move cross-chain, trade perps, hold RWAs, stay confidential, and access
          all of DeFi from your own wallet.
        </p>
      </Container>
    </section>
  );
}
