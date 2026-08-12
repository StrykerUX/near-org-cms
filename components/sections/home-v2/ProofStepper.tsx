"use client";

import { ArrowUp } from "lucide-react";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { enableScene } from "@/components/primitives/motion/stickyScene";
import { pauseOffscreen } from "@/components/primitives/motion/pauseOffscreen";
import { gsap, ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";

// Stepper de 5 pruebas. Misma mecánica que components/sections/ProofStats.tsx
// —sticky de CSS y un ScrollTrigger de SOLO LECTURA, nunca `pin: true`; el
// porqué está documentado ahí— con tres diferencias de diseño del rebuild:
//
//  1. El carril alinea a la IZQUIERDA (todas las palabras arrancan en la misma
//     X) en vez de a la derecha, y se desplaza en bloque para que la más ancha
//     roce el borde del viewport. Como consecuencia el cursor queda FIJO en X:
//     ya no tiene que perseguir el borde izquierdo de cada título.
//  2. El recorrido es mucho más corto: 7svh por paso contra 65svh. Las cinco
//     pruebas pasan casi al vuelo, a propósito.
//  3. El cursor lleva el gradiente lima→verde en vez del verde plano.
const STEPS = [
  {
    word: "1+ Million",
    eyebrow: "Built on Scale",
    value: "1M+",
    label: "daily wallets",
    body: "Real people moving real value every day — not bots inflating a chart.",
  },
  {
    word: "$20B+",
    eyebrow: "Built on Volume",
    value: "$20B",
    label: "settled",
    body: "Cross-chain volume cleared on-chain, with finality in under a second.",
  },
  {
    word: "100%",
    eyebrow: "Built on Proof",
    value: "100%",
    label: "uptime",
    body: "Move cross-chain, trade perps, hold RWAs, stay confidential, and access all of DeFi from your own wallet.",
  },
  {
    word: "Quantum",
    eyebrow: "Built on Math",
    value: "0",
    label: "quantum exposure",
    body: "Post-quantum signatures from day one, so nothing you sign today expires tomorrow.",
  },
  {
    word: "Confidential",
    eyebrow: "Built on Privacy",
    value: "TEE",
    label: "on every node",
    body: "Confidential compute by default: your data stays yours, even from the validators.",
  },
] as const;

const STEP_VH = "7svh";
const DIM_WORD = 0.06;

// La palabra más ancha del set: es la que se alinea contra el borde derecho del
// viewport, y de ahí sale la X de todo el bloque. Se busca por texto y no por
// índice para que reordenar STEPS no rompa el encuadre en silencio.
const ANCHOR_WORD = "Confidential";

// Tres copias del set (relleno · reales · relleno) para que nunca se vea un
// extremo del carril. Solo el bloque del medio lleva `data-word`. Ver el
// comentario largo de ProofStats.tsx.
const RAIL_COPIES = [-1, 0, 1];

export default function ProofStepper() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk, isDesktop, self }) => {
    const arrow = q("[data-arrow]")[0];
    if (motionOk && arrow) {
      pauseOffscreen(
        gsap.to(arrow, { y: -6, duration: 1.4, repeat: -1, yoyo: true, ease: "sine.inOut" }),
        scope
      );
    }

    if (!motionOk || !isDesktop) return;

    const panels = q("[data-panel]");
    const words = q("[data-word]");
    const list = q("[data-list]")[0];
    const rail = q("[data-rail]")[0];
    const cursor = q("[data-cursor]")[0];
    if (panels.length === 0 || words.length !== panels.length || !list || !rail) return;

    const N = panels.length;
    const stepperOff = enableScene(scope, "stepper");

    let active = -1;

    // Desplazamiento horizontal del bloque entero: la palabra ancla termina
    // justo dentro del borde derecho del viewport. Se recalcula en cada
    // refreshInit porque depende de innerWidth y del ancho real del glifo
    // (que cambia cuando montreal, display:swap, termina de cargar).
    self.add("placeRail", () => {
      const anchor = words.find((w) => w.textContent?.trim() === ANCHOR_WORD) ?? words[0];
      const railLeft = rail.getBoundingClientRect().left;
      const x = Math.max(0, window.innerWidth - railLeft - anchor.offsetWidth);
      gsap.set(list, { x });
      // El cursor se recuesta a la izquierda del bloque, a poco menos de un
      // ancho de sí mismo. Su tamaño está en `em` del display fluido, así que
      // se LEE en vez de hardcodearse.
      if (cursor) gsap.set(cursor, { x: Math.max(0, x - 1.16 * cursor.offsetWidth) });
    });

    self.add("go", (i: number) => {
      const prev = active;
      active = i;

      // Se conducen TODOS los paneles en cada paso, no solo el entrante y el
      // saliente: un salto de scroll grande puede pasar de 0 a 3 y dejar los
      // intermedios a medio fade.
      panels.forEach((p, j) => {
        gsap.killTweensOf(p);
        if (j === i) gsap.to(p, { autoAlpha: 1, duration: 0.4, ease: "power1.out" });
        else if (j === prev) gsap.to(p, { autoAlpha: 0, duration: 0.2, ease: "power1.out" });
        else gsap.set(p, { autoAlpha: 0 });
      });

      const w = words[i];
      const y = rail.clientHeight / 2 - (w.offsetTop + w.offsetHeight / 2);
      // El primer posicionamiento es instantáneo: el bloque real arranca
      // debajo de un set entero de relleno, y animar hasta ahí sería un
      // desplazamiento de cientos de píxeles visible al cargar.
      if (prev < 0) gsap.set(list, { y });
      else gsap.to(list, { y, duration: 0.6, ease: "power3.out", overwrite: "auto" });

      gsap.to(words, { opacity: DIM_WORD, duration: 0.4, overwrite: "auto" });
      gsap.to(w, { opacity: 1, duration: 0.4, overwrite: "auto" });
    });

    self.placeRail();
    self.go(0);

    ScrollTrigger.addEventListener("refreshInit", self.placeRail);

    ScrollTrigger.create({
      trigger: scope,
      start: "top top",
      end: "bottom bottom",
      markers: DEBUG_MARKERS,
      // `st` y no `self`: el nombre del contexto de motion ya está tomado en este
      // scope, y sombrearlo acá dejaría `self.go` apuntando al ScrollTrigger.
      onUpdate: (st) => {
        const i = Math.min(N - 1, Math.floor(st.progress * N));
        if (i !== active) self.go(i);
      },
    });

    return () => {
      ScrollTrigger.removeEventListener("refreshInit", self.placeRail);
      stepperOff();
      const all = [...panels, ...words, list, ...(cursor ? [cursor] : [])];
      gsap.killTweensOf(all);
      gsap.set(all, { clearProps: "opacity,visibility,transform" });
    };
  });

  return (
    // Nada de overflow-hidden acá: un ancestro con overflow distinto de visible
    // se vuelve el contenedor de scroll del sticky y este deja de pegarse.
    //
    // `overflow-x-clip` es la excepción, y por eso está: `clip` recorta pero NO
    // crea un contenedor de scroll, así que el sticky sigue anclado al viewport.
    // Es lo único que puede recortar acá. Lo que recorta es el `-right-4` del
    // carril, que asoma 16px más allá del borde derecho y extendía el ancho
    // scrolleable de la página entera. Va solo en X: `clip` admite el otro eje
    // en `visible` —`hidden` no, fuerza `auto`—, y recortar en Y cortaría el
    // propio sticky.
    //
    // `data-stepper` NO se declara acá: lo escribe `enableScene` desde el efecto y
    // nadie más lo toca. Declarándolo también en el JSX, cualquier re-render lo
    // devolvería a "off" y desarmaría el sticky sin dar ningún error.
    <section
      ref={rootRef}
      style={{ "--steps": STEPS.length, "--step-vh": STEP_VH } as React.CSSProperties}
      className="group/proof relative overflow-x-clip bg-background text-foreground data-[stepper=on]:h-[calc(var(--steps)*var(--step-vh)+100svh)]"
    >
      <div className="relative group-data-[stepper=on]/proof:sticky group-data-[stepper=on]/proof:top-0 group-data-[stepper=on]/proof:flex group-data-[stepper=on]/proof:h-svh group-data-[stepper=on]/proof:items-center">
        <Container className="grid grid-cols-1 items-center gap-12 py-24 lg:py-0">
          <div className="grid gap-16">
            {STEPS.map((step) => (
              <div
                key={step.word}
                data-panel
                className="grid grid-cols-1 items-baseline gap-6 group-data-[stepper=on]/proof:invisible group-data-[stepper=on]/proof:opacity-0 group-data-[stepper=on]/proof:[grid-area:1/1] lg:grid-cols-[15rem_minmax(0,28rem)] lg:gap-x-24 lg:gap-y-10"
              >
                <Eyebrow className="text-foreground">{step.eyebrow}</Eyebrow>
                <div className="flex flex-col gap-5">
                  <p className="flex items-baseline gap-2">
                    <span className="text-display-serif italic">{step.value}</span>
                    <span className="text-h3">{step.label}</span>
                  </p>
                  <p className="max-w-xs text-body-sm text-gray-blue text-pretty">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>

        {/* El carril va fuera de Container y absoluto contra el borde del
            viewport: compensar el padding de Container no alcanza, porque es
            `max-w mx-auto` y en pantallas anchas quedaría un margen muerto.
            `-right-4` los empuja un poco más allá del borde para que se corten.
            El overflow-hidden vive acá y NO en la sección — ahí rompería el
            sticky. Decoración pura: sin aria-hidden un lector leería las cinco
            palabras tres veces, una por copia del relleno. */}
        <div
          data-rail
          aria-hidden="true"
          className="absolute inset-y-0 -right-4 hidden w-1/2 overflow-hidden lg:block"
        >
          {/* Dos nodos anidados y ningún transform de Tailwind: GSAP anima `x`
              en el wrapper e `y` en el botón, y una clase de transform se los
              sobreescribiría. Por eso el centrado vertical es `top: calc(...)`
              y no -translate-y-1/2. `text-rail` acá no pinta texto: fija el
              font-size del que cuelga el `em` del tamaño del botón. */}
          <div data-cursor className="absolute left-0 top-[calc(50%-0.19em)] z-10 text-rail">
            <span
              data-arrow
              className="flex size-[0.38em] items-center justify-center rounded-[0.075em]"
              style={{
                backgroundImage:
                  "linear-gradient(to bottom left, #cdf276 0%, #6ed554 45%, #2cb736 80%, #1ba32c 100%)",
              }}
            >
              <ArrowUp className="size-1/2 text-white" strokeWidth={1.75} />
            </span>
          </div>

          {/* items-start: en el rebuild las palabras alinean por la izquierda y
              es el bloque entero el que se corre en X. */}
          <div
            data-list
            className="absolute left-0 top-0 flex flex-col items-start gap-2 will-change-transform"
          >
            {RAIL_COPIES.map((copy) =>
              STEPS.map((step) => (
                <span
                  key={`${copy}:${step.word}`}
                  {...(copy === 0 ? { "data-word": "" } : {})}
                  className="text-rail whitespace-nowrap opacity-[0.06]"
                >
                  {step.word}
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
