"use client";

import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { enableScene } from "@/components/primitives/motion/stickyScene";
import { createSeededRandom } from "@/components/primitives/motion/seededRandom";
import { onViewportToggle } from "@/components/primitives/motion/pauseOffscreen";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { PROOF_STATS } from "@/components/sections/proof-alt/proofAltContent";

// ── 03 · Solari ──────────────────────────────────────────────────────────────
//
// El tablero de horarios de una estación: UNA cifra en pantalla y los
// caracteres girando hasta la siguiente. Cero recorrido — 100svh, sin sticky,
// sin track.
//
// La apuesta es la contraria a la de la 01: en vez de mostrar las seis a la vez
// y dejar que el ojo elija, muestra una sola y la cambia. Se lee mucho menos
// información por segundo, pero cada cifra ocupa la pantalla entera y el cambio
// obliga a mirar. Cuál de las dos es mejor depende de si estas seis pruebas son
// una TABLA (se comparan entre sí) o seis TITULARES (cada una vale sola), y esa
// es la pregunta que esta versión pone sobre la mesa.
//
// ── Nada de esto vive en estado de React ────────────────────────────────────
//
// El índice activo, el autoplay y los saltos manuales se manejan dentro del
// efecto, con listeners puestos a mano sobre los botones. Con `useState` cada
// cambio de cifra re-renderizaría la sección, y `useMotionScope` reconstruiría
// la escena entera en cada paso: los timers, el gate de viewport y las
// timelines de vuelo, cinco veces por minuto.
//
// El precio es que el DOM lo escribe el efecto (`textContent`), y por eso el
// markup renderiza las SEIS fichas en flujo normal: sin JS quedan las seis
// legibles una debajo de la otra. El `data-solari` que las superpone lo escribe
// `enableScene` desde el efecto, nunca el JSX — es la regla de
// `sections/README.md`.

// Celdas del tablero. Sale de la cifra más larga ("30 + Blockchains", 16) y es
// fijo a propósito: si el tablero se encogiera con cada cifra, el gesto que se
// vería sería el del contenedor, no el de las lamas.
const SLOTS = 16;

// Cuántos caracteres falsos pasan antes del correcto, y cuánto tarda cada giro.
const FLAPS = 3;
const FLAP_TIME = 0.09;
// Retardo por columna: es lo que hace que el tablero se resuelva de izquierda a
// derecha, como uno real, en vez de todo de golpe.
const COL_STEP = 0.045;

// Cuánto se queda quieta cada cifra antes de pasar a la siguiente.
const HOLD = 4.2;

// El alfabeto por el que giran las lamas. Solo lo que las seis cifras usan:
// girar por letras que nunca aterrizan se lee como ruido.
const ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$%+-";

export default function SolariBoard() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk }) => {
    const cells = q("[data-cell]");
    const cards = q("[data-card]");
    const dots = q("[data-jump]");
    if (cells.length !== SLOTS) return;

    const off = enableScene(scope, "solari");
    const rand = createSeededRandom();
    let index = 0;
    let hover = false;

    // El texto de una cifra, centrado en el tablero, y desde qué columna empieza
    // el tramo verde. Se calcula acá y no en los datos porque depende de SLOTS,
    // que es geometría del tablero.
    const layout = (i: number) => {
      const { value, accent } = PROOF_STATS[i];
      const text = `${value}${accent}`;
      const pad = Math.max(0, Math.floor((SLOTS - text.length) / 2));
      return { text, pad, accentFrom: pad + value.length };
    };

    const paint = (i: number, instant: boolean) => {
      const { text, pad, accentFrom } = layout(i);

      cells.forEach((cell, col) => {
        const target = (text[col - pad] ?? " ").toUpperCase();
        const green = col >= accentFrom && col < pad + text.length;
        // El color se pone al empezar el giro y no al terminar: la lama que
        // está girando ya pertenece a la palabra nueva, y esperar al final deja
        // un frame donde el color viejo y el carácter nuevo conviven.
        cell.classList.toggle("text-near-green-accent", green);

        // Las celdas FUERA de la cifra no giran: se ponen en blanco y ya. Girar
        // una lama que va a aterrizar en un espacio es ruido puro — y en un
        // tablero de dieciséis celdas para cifras de once, son cinco lamas
        // girando para no decir nada.
        if (instant || target === " ") {
          cell.textContent = target;
          return;
        }

        const state = { step: 0 };
        let written = -1;
        gsap.to(state, {
          step: FLAPS,
          duration: FLAPS * FLAP_TIME,
          ease: "none",
          snap: { step: 1 },
          delay: col * COL_STEP,
          overwrite: "auto",
          onUpdate: () => {
            const step = Math.round(state.step);
            if (step === written) return;
            written = step;
            cell.textContent =
              step >= FLAPS ? target : ALPHABET[Math.floor(rand() * ALPHABET.length)];
            // El pulso de escala es la única pista de que la lama tiene grosor.
            // Un `rotateX` real necesitaría dos caras por celda y perspectiva
            // heredada; a este tamaño la diferencia no se ve y el costo sí.
            gsap.fromTo(cell, { scaleY: 0.72 }, { scaleY: 1, duration: FLAP_TIME, ease: "power2.out" });
          },
          onComplete: () => {
            // Igual que en la 01: si la pestaña se va a segundo plano GSAP puede
            // saltar al final sin pasar por el último `onUpdate`, y la lama
            // quedaría en un carácter falso.
            cell.textContent = target;
          },
        });
      });

      cards.forEach((card, j) => {
        gsap.to(card, {
          autoAlpha: j === i ? 1 : 0,
          duration: instant ? 0 : 0.45,
          ease: "power2.out",
          overwrite: "auto",
        });
      });

      dots.forEach((dot, j) => {
        dot.setAttribute("aria-current", j === i ? "true" : "false");
      });
    };

    const advance = () => {
      index = (index + 1) % PROOF_STATS.length;
      paint(index, false);
    };

    // El autoplay es un `delayedCall` que se re-arma solo. Un `setInterval`
    // seguiría corriendo con la pestaña en segundo plano y con la sección fuera
    // de vista; los timers de GSAP se pausan con el ticker.
    let timer: gsap.core.Tween | null = null;
    const schedule = () => {
      timer?.kill();
      if (hover || !motionOk) return;
      timer = gsap.delayedCall(HOLD, () => {
        advance();
        schedule();
      });
    };

    const goto = (i: number) => {
      index = i;
      paint(index, false);
      schedule();
    };

    const jumpHandlers = dots.map((dot, i) => {
      const handler = () => goto(i);
      dot.addEventListener("click", handler);
      return { dot, handler };
    });

    // El hover pausa: quien está leyendo el cuerpo de una cifra no quiere que
    // se la cambien a mitad de frase. Va sobre la sección entera y no sobre el
    // tablero — el cuerpo está debajo, y salir del tablero para leerlo no debe
    // reanudar el ciclo.
    const onEnter = () => {
      hover = true;
      timer?.kill();
    };
    const onLeave = () => {
      hover = false;
      schedule();
    };
    scope.addEventListener("mouseenter", onEnter);
    scope.addEventListener("mouseleave", onLeave);

    paint(0, true);

    // Fuera de vista el tablero no gira. Es un loop que escribe al DOM cinco
    // veces por minuto; con tres secciones así en una página, todas corriendo
    // fuera de cuadro, se nota.
    const gate = onViewportToggle(scope, (visible) => {
      if (visible) schedule();
      else timer?.kill();
    });

    return () => {
      timer?.kill();
      gate.kill();
      jumpHandlers.forEach(({ dot, handler }) => dot.removeEventListener("click", handler));
      scope.removeEventListener("mouseenter", onEnter);
      scope.removeEventListener("mouseleave", onLeave);
      gsap.killTweensOf([...cells, ...cards]);
      gsap.set([...cells, ...cards], { clearProps: "all" });
      off();
    };
  });

  return (
    <section
      ref={rootRef}
      className="group/solari flex min-h-svh flex-col justify-center gap-12 bg-ink-slate py-20 text-cream"
    >
      <Container className="flex flex-col gap-10">
        <Eyebrow className="text-cream/40">Built to</Eyebrow>

        {/* El tablero. Cada celda tiene ancho fijo en `em` del propio tamaño,
            así que la rejilla no se mueve cuando cambia el carácter — que es la
            mitad del efecto. En `em` y no en px para que siga al token cuando
            la escala cambie de tamaño con el viewport. */}
        <div
          aria-hidden="true"
          className="flex flex-wrap gap-x-[0.04em] gap-y-2 text-h1"
        >
          {Array.from({ length: SLOTS }, (_, i) => (
            <span
              key={i}
              data-cell
              className="flex w-[0.62em] justify-center rounded-[0.04em] bg-cream/5 py-[0.06em] text-center"
            >
              {" "}
            </span>
          ))}
        </div>

        {/* El texto real para lectores de pantalla y para el "sin JS". El
            tablero de arriba es `aria-hidden`: dieciséis nodos de un carácter
            cada uno no son una cifra, son ruido. */}
        <p className="sr-only">
          {PROOF_STATS.map((s) => `${s.eyebrow}: ${s.plain}.`).join(" ")}
        </p>

        {/* Las seis fichas. En flujo normal sin JS —las seis legibles, una
            debajo de la otra—; superpuestas y en crossfade cuando el efecto
            enciende `data-solari`. */}
        <div className="grid grid-cols-1 gap-8">
          {PROOF_STATS.map((s) => (
            <article
              key={s.id}
              data-card
              className="flex max-w-[62ch] flex-col gap-3 group-data-[solari=on]/solari:[grid-area:1/1]"
            >
              <p className="text-caption-mono text-near-green-accent">{s.eyebrow}</p>
              <p className="text-body-lg text-cream/70 text-pretty">{s.body}</p>
            </article>
          ))}
        </div>

        <div className="flex gap-3">
          {PROOF_STATS.map((s) => (
            <button
              key={s.id}
              data-jump
              type="button"
              // El `aria-label` dice la cifra y no "ir al paso 3": el número de
              // paso no significa nada para quien no ve el tablero.
              aria-label={`Mostrar ${s.plain}`}
              className="h-1.5 w-10 rounded-full bg-cream/20 transition-colors aria-[current=true]:bg-near-green-accent"
            >
              <span className="sr-only">{s.plain}</span>
            </button>
          ))}
        </div>
      </Container>
    </section>
  );
}
