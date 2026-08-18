"use client";

import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { EASE_OUT } from "@/components/primitives/motion/motionTokens";
import { enableScene } from "@/components/primitives/motion/stickyScene";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { PROOF_STATS } from "@/components/sections/proof-alt/proofAltContent";

// ── 08 · Deck ────────────────────────────────────────────────────────────────
//
// Seis cartas apiladas que se hojean con el puntero: arrastrar la de arriba (o
// hacer clic) la manda al fondo y descubre la siguiente. El scroll no participa
// en absoluto — es la única de las diez con la que se JUEGA.
//
// La apuesta: una sección que responde al gesto se mira más tiempo que una que
// se consume pasando. El riesgo, que hay que mirar de frente: **nadie está
// obligado a tocarla**. Quien pasa scrolleando ve una sola cifra de seis y se
// va. La 01 entrega las seis sin pedir nada; esta entrega una y ofrece cinco.
// Cuál conviene depende de si estas seis pruebas son el argumento de la página
// o un adorno del argumento.
//
// ── El arrastre está escrito a mano ─────────────────────────────────────────
//
// Sin `Draggable`: el plugin no está registrado en `gsapClient` y sumarlo por
// esto sería cargar un plugin entero para un eje, un umbral y un soltar. Son
// tres handlers de pointer y `setPointerCapture`, que además es lo que hace que
// el gesto sobreviva a que el puntero se salga de la carta a mitad de
// movimiento.
//
// ── Por qué no hay estado de React ──────────────────────────────────────────
//
// El orden de la pila vive en un array dentro del efecto. Con `useState`, cada
// carta hojeada re-renderizaría la sección y `useMotionScope` reconstruiría la
// escena: los listeners, la pila y el layout, una vez por gesto — justo durante
// el gesto.

const N = PROOF_STATS.length;

// Cuánto se separa cada carta de la que tiene delante.
const STEP_X = 26;
const STEP_Y = 16;
const STEP_SCALE = 0.045;

// Cuánto hay que arrastrar para que la carta se vaya. Por debajo, vuelve. 110px
// es lo bastante para no disparar con un temblor y lo bastante poco para que el
// gesto no se sienta pesado.
const THROW = 110;

export default function DeckStack() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk }) => {
    const cards = q("[data-card]");
    if (cards.length !== N) return;

    const off = enableScene(scope, "deck");

    // `order[p]` es el índice de la carta que ocupa la posición p. La de
    // adelante es la 0.
    let order = PROOF_STATS.map((_, i) => i);
    let busy = false;

    const layout = (instant: boolean) => {
      order.forEach((cardIndex, p) => {
        const card = cards[cardIndex];
        card.style.zIndex = String(N - p);
        // `aria-hidden` y `inert` en las de atrás: apiladas, sus textos siguen
        // en el árbol de accesibilidad y un lector leería seis cifras
        // superpuestas como si fueran una lista.
        card.toggleAttribute("inert", p !== 0);
        gsap.to(card, {
          x: p * STEP_X,
          y: p * STEP_Y,
          scale: 1 - p * STEP_SCALE,
          rotate: 0,
          autoAlpha: p > 3 ? 0 : 1,
          duration: instant ? 0 : 0.5,
          ease: EASE_OUT,
          overwrite: "auto",
        });
      });
    };

    // Manda la de arriba al fondo. La carta sale por donde la empujaron
    // (`dir`), no siempre hacia el mismo lado: si volviera siempre por la
    // derecha, arrastrar a la izquierda se sentiría como que el gesto no se
    // registró.
    const cycle = (dir: number) => {
      if (busy) return;
      busy = true;
      const top = cards[order[0]];
      gsap
        .timeline({
          onComplete: () => {
            busy = false;
          },
        })
        .to(top, {
          x: dir * (window.innerWidth * 0.5),
          rotate: dir * 14,
          autoAlpha: 0,
          duration: 0.4,
          ease: "power2.in",
        })
        .add(() => {
          order = [...order.slice(1), order[0]];
          // La carta que se fue aterriza al FONDO sin animación: viajar de
          // vuelta por la pantalla mostraría el truco.
          gsap.set(top, { x: (N - 1) * STEP_X, y: (N - 1) * STEP_Y, rotate: 0, autoAlpha: 0 });
          layout(false);
        });
    };

    layout(true);

    if (!motionOk) {
      // Con reduced-motion la pila se despliega: las seis cartas en columna, sin
      // gesto y sin nada que arrastrar. Es la degradación correcta — lo que la
      // sección tiene para decir son seis pruebas, y se pueden decir quietas.
      order.forEach((cardIndex) => {
        const card = cards[cardIndex];
        card.removeAttribute("inert");
        gsap.set(card, { clearProps: "all" });
      });
      off();
      return;
    }

    // ── El arrastre ──────────────────────────────────────────────────────────
    let dragging = false;
    let startX = 0;

    const onDown = (event: PointerEvent) => {
      if (busy) return;
      const top = cards[order[0]];
      if (!top.contains(event.target as Node)) return;
      dragging = true;
      startX = event.clientX;
      // La captura es lo que permite soltar fuera de la carta sin que el gesto
      // quede colgado con la carta a medio camino.
      top.setPointerCapture(event.pointerId);
    };

    const onMove = (event: PointerEvent) => {
      if (!dragging) return;
      const dx = event.clientX - startX;
      gsap.set(cards[order[0]], { x: dx, rotate: dx * 0.035 });
    };

    const onUp = (event: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      const dx = event.clientX - startX;
      if (Math.abs(dx) > THROW) cycle(Math.sign(dx));
      else layout(false);
    };

    // Un clic sin arrastre también hoja: es lo que hace la sección usable con
    // un trackpad, con un tap y con el teclado (el botón emite `click`).
    const onClick = () => {
      if (!dragging) cycle(1);
    };

    scope.addEventListener("pointerdown", onDown);
    scope.addEventListener("pointermove", onMove);
    scope.addEventListener("pointerup", onUp);
    scope.addEventListener("pointercancel", onUp);

    const next = q("[data-next]")[0];
    next?.addEventListener("click", onClick);

    return () => {
      scope.removeEventListener("pointerdown", onDown);
      scope.removeEventListener("pointermove", onMove);
      scope.removeEventListener("pointerup", onUp);
      scope.removeEventListener("pointercancel", onUp);
      next?.removeEventListener("click", onClick);
      gsap.killTweensOf(cards);
      gsap.set(cards, { clearProps: "all" });
      cards.forEach((c) => c.removeAttribute("inert"));
      off();
    };
  });

  return (
    <section
      ref={rootRef}
      className="group/deck flex min-h-svh items-center bg-cream py-20 text-ink"
    >
      <Container className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)]">
        <div className="flex flex-col gap-8">
          <Eyebrow className="text-gray-intermediate">Built to</Eyebrow>
          <h3 className="text-h2 max-w-[16ch]">Seis pruebas, una a la vez</h3>
          <p className="max-w-[46ch] text-body-lg text-gray-intermediate text-pretty">
            Arrastrá la carta de arriba hacia cualquier lado, o usá el botón. El
            scroll no mueve nada acá.
          </p>
          <button
            data-next
            type="button"
            className="w-fit rounded-full border border-ink px-6 py-3 text-label transition-colors hover:bg-ink hover:text-cream"
          >
            Siguiente prueba
          </button>
        </div>

        {/* Sin JS la pila es una columna de seis cartas: el apilado lo enciende
            `data-deck`, que escribe el efecto. La altura fija de la pila
            (`h-[26rem]`) también es condicional — sin ella, en flujo normal las
            seis cartas quedarían recortadas dentro de un contenedor de una. */}
        <div className="flex flex-col gap-6 group-data-[deck=on]/deck:relative group-data-[deck=on]/deck:h-[26rem] group-data-[deck=on]/deck:gap-0">
          {PROOF_STATS.map((s) => (
            <article
              key={s.id}
              data-card
              className="flex touch-pan-y flex-col justify-between gap-8 rounded-lg border border-rule bg-background p-10 group-data-[deck=on]/deck:absolute group-data-[deck=on]/deck:inset-0 group-data-[deck=on]/deck:cursor-grab group-data-[deck=on]/deck:active:cursor-grabbing"
            >
              <p className="text-h4 text-gray-intermediate">{s.eyebrow}</p>
              <p className="text-h1-serif italic">
                {s.value}
                <span className="text-green-ink">{s.accent}</span>
              </p>
              <p className="text-body-sm text-gray-intermediate text-pretty">{s.body}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
