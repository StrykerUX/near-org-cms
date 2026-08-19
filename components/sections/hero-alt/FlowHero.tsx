"use client";

import Container from "@/components/primitives/Container";
import { gsap, SplitText } from "@/components/primitives/motion/gsapClient";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import FlowCanvas from "@/components/sections/hero-alt/FlowCanvas";

// ── 02 · Flow ────────────────────────────────────────────────────────────────
//
// La única de las cinco que invierte el valor del hero: fondo `--ink` en vez de
// `--cream`. No es capricho de contraste — el campo de flujo vive de las
// crestas, y sobre crema las crestas claras no tienen dónde brillar. Sobre
// negro, el mismo shader con los mismos tres verdes se lee como luz.
//
// ── Lo que hace distinto a esto de "un fondo animado" ───────────────────────
//
// El campo NO avanza con el reloj. Avanza con el scroll —fase integrada sobre
// el desplazamiento, en `FlowCanvas`— y lo que la velocidad del scroll controla
// no es la rapidez sino el CONTRASTE: quieto, el campo es una bruma; empujando,
// se enciende en filamentos. Es la diferencia entre una animación que corre
// sola delante del lector y una que responde a lo que el lector hace.
//
// Un hero que se mueve solo compite con el titular. Este se queda quieto hasta
// que lo tocan.
//
// El titular va por caracteres y no por palabras porque acá no hay máscara que
// lo recorte: sobre un campo vivo, una máscara rectangular se ve. Los glifos
// entran por sí mismos, desde abajo y con blur, que es un gesto que no necesita
// borde.

// Los tres verdes del DS, literales y no `var(--token)`: el shader recibe
// números, y el toolkit ya lo advierte para los colores que se animan — un
// `var()` sin resolver llega como string vacío y el uniform queda en negro.
const PALETTE = ["#101010", "#00b96f", "#8bf29c", "#ecfdb0"] as const;

// Lo que se ve si no hay WebGL2. No intenta imitar al shader —imposible— pero
// sí deja la sección con su forma: oscura, con luz naciendo del centro bajo.
const FALLBACK =
  "radial-gradient(120% 90% at 50% 100%, #00b96f 0%, #0a3d2a 45%, #101010 80%)";

export default function FlowHero() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk }) => {
    const title = q("[data-fl-title]")[0];
    const sub = q("[data-fl-sub]")[0];
    if (!motionOk) return;

    const split = SplitText.create(title, { type: "chars" });

    const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
    intro.from(split.chars, {
      yPercent: 60,
      autoAlpha: 0,
      // El blur entra y sale con el mismo tween: es lo que hace que el glifo
      // parezca condensarse del campo en vez de deslizarse sobre él. Cuesta un
      // repaint por frame y por eso está solo en la intro, nunca en el scrub.
      filter: "blur(12px)",
      duration: 1.1,
      stagger: 0.045,
      // Limpiar el filtro al terminar: un `blur(0px)` residual mantiene al
      // elemento en su propia capa de compositing para siempre.
      clearProps: "filter",
    });
    intro.from(sub, { autoAlpha: 0, y: 16, duration: 0.7 }, "-=0.5");

    // Salida por scroll. Sin track y sin pin: el recorrido es el hero saliendo.
    const exit = gsap.timeline({
      scrollTrigger: { trigger: scope, start: "top top", end: "bottom top", scrub: 0.4 },
    });
    // Los caracteres se van escalonados en el MISMO orden en que entraron, así
    // que la salida se lee como la reversa del ensamblado y no como un fade.
    exit.to(split.chars, { yPercent: -45, autoAlpha: 0, ease: "none", stagger: 0.012 }, 0);
    exit.to(sub, { autoAlpha: 0, ease: "none" }, 0);

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
      className="relative flex flex-col overflow-hidden bg-ink text-cream"
    >
      <FlowCanvas palette={PALETTE} fallback={FALLBACK} floor={0.3} />

      {/* Velo sobre el campo. Sin él el titular pelea contra las crestas más
          brillantes, que son justamente las que pasan por el centro. Es un
          gradiente y no un tinte plano para que los bordes del hero queden
          limpios y el campo se vea entero donde no hay texto. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          backgroundImage:
            "radial-gradient(60% 45% at 50% 50%, rgba(16,16,16,0.72) 0%, rgba(16,16,16,0.35) 55%, rgba(16,16,16,0) 100%)",
        }}
      />

      <div aria-hidden="true" className="h-[var(--site-header-block)] shrink-0" />

      <Container className="relative z-[2] flex flex-1 flex-col items-center justify-center gap-6 py-14 text-center">
        {/* Sin `<Accent>`: el acento de esta versión lo pone el campo, y una
            segunda palabra en verde encima de verdes en movimiento se pierde.
            Es la única de las cinco que renuncia a la itálica del DS, y es una
            decisión de esta versión — no un olvido. */}
        <h1 data-fl-title className="text-display text-pretty">
          Own your world.
        </h1>

        <p data-fl-sub className="max-w-xl text-body-lg text-cream/70 text-pretty">
          Move cross-chain, trade perps, hold RWAs, stay confidential, and access
          all of DeFi from your own wallet.
        </p>
      </Container>
    </section>
  );
}
