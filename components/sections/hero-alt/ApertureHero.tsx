"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { hermiteRamp } from "@/components/primitives/motion/velocityRamp";

// ── 01 · Aperture ────────────────────────────────────────────────────────────
//
// La versión sin canvas, a propósito: si un gesto de esta escala se puede
// sostener con transforms y un clip-path, el resto de las versiones tienen que
// justificar su WebGL contra ESTA, no contra el video de 19MB.
//
// El gesto son dos movimientos montados sobre el mismo tiempo:
//
//   · el titular nace a 2.6× —desbordando el viewport, ilegible— y se RETRAE
//     hasta 1×. No es un zoom decorativo: durante el primer tercio lo que se ve
//     son dos curvas negras enormes, y la palabra aparece recién cuando la
//     escala baja lo suficiente. El lector reconoce la forma antes que el texto.
//   · detrás, un diafragma: una persiana de lamas verticales que se abre desde
//     el centro hacia los bordes, recortada por un `clip-path` circular que
//     crece a la vez.
//
// Los dos terminan juntos y por eso se leen como UN mecanismo: el titular llega
// a tamaño legible en el mismo frame en que el diafragma termina de abrir.
//
// ── Por qué la intro va por timeline y la salida por scroll ──────────────────
//
// Un hero tiene que impactar al CARGAR, no al scrollear: quien llega no ha
// tocado la rueda todavía. Así que la apertura es una timeline que corre sola al
// montar. Lo que sí va atado al scroll es la SALIDA — las lamas terminan de
// abrirse y el bloque de texto se despide— porque ahí el lector ya está
// conduciendo y el gesto tiene que responderle.
//
// Es la misma división que usa `home-ab7/HeroVideo`: intro por timeline, fades
// por ScrollTrigger. Lo que cambia es qué se anima, no cuándo.

// Impar a propósito: con un número par no hay lama central y el diafragma abre
// desde una junta en vez de desde un eje. La diferencia se ve.
const LAMELLAS = 13;

// El radio final del clip. Pasa de 100% porque el círculo tiene que salirse del
// viewport por las esquinas: a 100% exacto, el arco todavía se ve en las cuatro
// puntas cuando ya terminó de abrir.
const APERTURE_OPEN = "circle(88% at 50% 45%)";
const APERTURE_SHUT = "circle(0% at 50% 45%)";

// La escala de la que sale el titular. 2.6 es lo mínimo para que "Own" no entre
// entero en un viewport de 1440: por debajo se lee desde el primer frame y el
// gesto pierde su motivo.
const TITLE_SCALE = 2.6;

// Reparto del recorrido de salida entre las lamas. `hermiteRamp` con entrada
// rápida y aterrizaje lento: las lamas se sueltan de golpe cuando el scroll
// empieza y frenan contra el borde en vez de chocarlo.
const LAMELLA_RAMP = hermiteRamp(2.4, 0.3);

export default function ApertureHero() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk }) => {
    const lamellas = q("[data-ap-lamella]");
    const diaphragm = q("[data-ap-diaphragm]")[0];
    const title = q("[data-ap-title]")[0];
    const sub = q("[data-ap-sub]")[0];

    // Con reduced-motion no hay intro ni salida: el estado final, pintado de una
    // vez. El JSX ya nace en ese estado (ver el `style` de abajo), así que acá
    // no hay nada que deshacer — solo no crear los tweens.
    if (!motionOk) return;

    // ── Intro ────────────────────────────────────────────────────────────────
    const intro = gsap.timeline({ defaults: { ease: "power3.out" } });

    intro.fromTo(
      diaphragm,
      { clipPath: APERTURE_SHUT },
      { clipPath: APERTURE_OPEN, duration: 1.5, ease: "power2.inOut" },
      0
    );

    // Las lamas entran desde su propio borde, alternando arriba/abajo. El
    // `transformOrigin` lo decide la paridad y no el índice absoluto: lo que
    // tiene que alternar es lama sí, lama no, mirado desde el centro.
    intro.fromTo(
      lamellas,
      { scaleY: 0 },
      {
        scaleY: 1,
        duration: 1.1,
        // `from: "center"` es lo que hace que el diafragma se lea como diafragma
        // y no como un barrido de izquierda a derecha.
        stagger: { each: 0.045, from: "center" },
      },
      0.1
    );

    intro.fromTo(
      title,
      { scale: TITLE_SCALE, autoAlpha: 0 },
      { scale: 1, autoAlpha: 1, duration: 1.7, ease: "power3.out" },
      0.15
    );

    intro.fromTo(
      sub,
      { autoAlpha: 0, y: 18 },
      { autoAlpha: 1, y: 0, duration: 0.7 },
      "-=0.55"
    );

    // ── Salida, atada al scroll ──────────────────────────────────────────────
    //
    // Sin `pin: true` — regla del repo, razonamiento en sections/README.md. Acá
    // ni siquiera hace falta un track: el recorrido es la altura del propio
    // hero saliendo de cuadro.
    const exit = gsap.timeline({
      scrollTrigger: {
        trigger: scope,
        start: "top top",
        end: "bottom top",
        scrub: 0.4,
      },
    });

    // Cada lama sale a su propia velocidad, repartida por la rampa. El índice se
    // normaliza contra el CENTRO, así que las de los bordes salen primero y la
    // central se queda hasta el final — la persiana se abre, no se desliza.
    const mid = (LAMELLAS - 1) / 2;
    lamellas.forEach((lamella, i) => {
      const fromCenter = Math.abs(i - mid) / mid;
      exit.to(
        lamella,
        { scaleY: 1 - 0.85 * LAMELLA_RAMP(fromCenter), ease: "none" },
        0
      );
    });

    exit.to(title, { y: -80, autoAlpha: 0.15, ease: "none" }, 0);
    exit.to(sub, { y: -40, autoAlpha: 0, ease: "none" }, 0);

    return () => {
      intro.kill();
      exit.scrollTrigger?.kill();
      exit.kill();
    };
  });

  return (
    <section
      ref={rootRef}
      // svh y no vh: en móvil `vh` mide contra el viewport con la address bar
      // colapsada, así que el hero sobresale y salta al scrollear. Mismo
      // criterio que el resto de los heroes del repo.
      style={{ height: "100svh" }}
      className="relative flex flex-col overflow-hidden bg-cream text-foreground"
    >
      {/* El diafragma. `clipPath` en el estilo inline y no en una clase: es el
          valor que GSAP interpola, y tenerlo declarado en los dos lados hace que
          el primer re-render lo devuelva al de la clase.

          Nace ABIERTO. Es la degradación correcta: sin JS, o con reduced-motion,
          lo que queda es la persiana quieta y completa — que es el estado final
          de la intro, no un rectángulo vacío. */}
      <div
        data-ap-diaphragm
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 flex"
        style={{ clipPath: APERTURE_OPEN }}
      >
        {Array.from({ length: LAMELLAS }, (_, i) => (
          <div key={i} className="relative flex-1">
            <div
              data-ap-lamella
              className="absolute inset-x-0 top-0 h-full bg-bar"
              style={{
                // Alterna el borde del que crece cada lama. Va inline porque es
                // geometría derivada del índice, no una variante de diseño que
                // alguien vaya a querer cambiar desde una clase.
                transformOrigin: i % 2 === 0 ? "top" : "bottom",
                // Las lamas no son opacas: el gris pleno de 13 columnas juntas
                // tapa el crema y el hero deja de ser claro. A 0.55 el conjunto
                // se lee como una textura y no como un bloque.
                opacity: 0.55,
              }}
            />
          </div>
        ))}
      </div>

      {/* Reserva el alto del header, que es fixed y no ocupa flujo. Sin esto el
          bloque de texto se centra contra el hero entero y queda más alto de lo
          que la composición pide. */}
      <div aria-hidden="true" className="h-[var(--site-header-block)] shrink-0" />

      <Container className="relative z-[1] flex flex-1 flex-col items-center justify-center gap-6 py-14 text-center">
        {/* `will-change: transform` acá y no en las lamas: este es el único
            elemento que anima escala sobre un área grande durante toda la intro,
            y es el que se ve escalonado sin la promoción a capa. */}
        <h1
          data-ap-title
          className="text-display text-pretty"
          style={{ willChange: "transform" }}
        >
          Own your <Accent display>world.</Accent>
        </h1>

        <p data-ap-sub className="max-w-xl text-body-lg text-muted-foreground text-pretty">
          Move cross-chain, trade perps, hold RWAs, stay confidential, and access
          all of DeFi from your own wallet.
        </p>
      </Container>
    </section>
  );
}
