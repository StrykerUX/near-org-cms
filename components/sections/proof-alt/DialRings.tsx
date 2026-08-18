"use client";

import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS, EASE_OUT } from "@/components/primitives/motion/motionTokens";
import { enableScene } from "@/components/primitives/motion/stickyScene";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { PROOF_STATS } from "@/components/sections/proof-alt/proofAltContent";

// ── 04 · Dial ────────────────────────────────────────────────────────────────
//
// Seis anillos concéntricos, uno por prueba, y una aguja que los recorre. Cero
// recorrido de scroll: la sección mide 100svh y lo que la conduce es el ÁNGULO
// del puntero respecto del centro del dial.
//
// ── Los anillos NO codifican magnitud, y eso está decidido ──────────────────
//
// La tentación obvia de un dial es que la longitud de cada arco diga cuánto
// vale el dato. No se puede: las seis pruebas están en seis unidades distintas
// —por ciento, transacciones, dólares, cadenas, y dos que ni siquiera son
// números— y no comparten escala. Un arco más largo que otro afirmaría una
// comparación que no existe.
//
// Así que los seis arcos miden LO MISMO y lo único que cambia es el radio: el
// dial es un índice circular, no un gráfico. Es la misma decisión que toma la
// versión 01 al no inventarle un contador a "Quantum-ready".
//
// ── El puntero, no el scroll ────────────────────────────────────────────────
//
// El ángulo del puntero elige el sector, así que la sección se recorre en el
// sitio: no hay que avanzar para ver las seis, y se puede volver a una sin
// scrollear hacia atrás. Es lo contrario de la 05, y están las dos para poder
// comparar exactamente eso.
//
// Sin puntero (táctil, teclado) quedan los seis botones de la lista, que hacen
// lo mismo. El dial es el atajo, no la única puerta.

const N = PROOF_STATS.length;

// Geometría del SVG. El viewBox es cuadrado y el SVG NO se estira
// (`preserveAspectRatio` por defecto), así que los círculos son círculos y el
// `stroke-dasharray` mide lo mismo en los dos ejes — el motivo por el que acá
// sí conviene SVG y en la 01 no.
const BOX = 200;
const CENTER = BOX / 2;
const R0 = 28;
const R_STEP = 11.5;

// Cuánto del círculo cubre cada arco. 0.84 deja un hueco visible que marca
// dónde empieza y termina; con 1 los seis anillos se leen como círculos
// completos y se pierde la idea de recorrido.
const ARC = 0.84;

const ringRadius = (i: number) => R0 + i * R_STEP;

export default function DialRings() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk }) => {
    const svg = q<SVGSVGElement>("[data-dial]")[0];
    const rings = q<SVGCircleElement>("[data-ring]");
    const needle = q<SVGLineElement>("[data-needle]")[0];
    const cards = q("[data-card]");
    const shorts = q("[data-short]");
    if (!svg || rings.length !== N) return;

    const off = enableScene(scope, "dial");
    let active = -1;

    const show = (i: number) => {
      if (i === active) return;
      active = i;

      rings.forEach((ring, j) => {
        gsap.to(ring, {
          // El anillo activo engorda y se pinta; los demás vuelven al hilo
          // gris. Se conducen TODOS en cada cambio y no solo el entrante y el
          // saliente: un salto de puntero rápido puede pasar de 0 a 4 y dejar
          // los intermedios a medio camino.
          strokeWidth: j === i ? 3.6 : 1.2,
          stroke: j === i ? "#00a86b" : "#b6b2a9",
          duration: 0.35,
          ease: "power2.out",
          overwrite: "auto",
        });
      });

      gsap.to(needle, {
        // La aguja apunta al sector: cada prueba ocupa 1/6 de vuelta. El −90 es
        // porque el 0° de un SVG apunta a las tres en punto y el dial arranca
        // arriba.
        rotate: (360 / N) * i,
        transformOrigin: "center center",
        duration: 0.5,
        ease: EASE_OUT,
        overwrite: "auto",
      });

      cards.forEach((card, j) => {
        gsap.to(card, { autoAlpha: j === i ? 1 : 0, duration: 0.35, overwrite: "auto" });
      });
      shorts.forEach((s, j) => {
        gsap.to(s, { autoAlpha: j === i ? 1 : 0, duration: 0.35, overwrite: "auto" });
      });
    };

    // El dibujado de entrada. Los anillos se trazan de adentro hacia afuera; la
    // ficha del primero llega cuando el último anillo ya cerró.
    const intro = gsap.timeline({
      scrollTrigger: { trigger: scope, start: "top 75%", once: true, markers: DEBUG_MARKERS },
    });
    rings.forEach((ring, i) => {
      const len = 2 * Math.PI * ringRadius(i);
      intro.fromTo(
        ring,
        { strokeDasharray: `0 ${len}` },
        { strokeDasharray: `${len * ARC} ${len}`, duration: 0.8, ease: EASE_OUT },
        i * 0.07
      );
    });
    intro.from(needle, { autoAlpha: 0, duration: 0.4 }, 0.5);
    intro.call(() => show(0), undefined, 0.7);

    if (motionOk) {
      // El ángulo del puntero elige el sector.
      //
      // El handler NO se envuelve en `self.add`: los tweens que crea se matan a
      // mano en el cleanup (`killTweensOf` + `clearProps` sobre los mismos
      // nodos), que es lo que el context-safe daría, y así el tipo del handler
      // sigue siendo el que `addEventListener` espera en vez de un `Function`
      // que hay que castear.
      const onMove = (event: PointerEvent) => {
        const r = svg.getBoundingClientRect();
        const dx = event.clientX - (r.left + r.width / 2);
        const dy = event.clientY - (r.top + r.height / 2);
        // Un radio muerto en el centro: ahí el ángulo salta con un movimiento
        // de un píxel y la aguja se vuelve loca. Fuera de ese disco el gesto es
        // estable.
        if (Math.hypot(dx, dy) < r.width * 0.12) return;
        // atan2 devuelve −π..π con el 0 a las tres en punto; esto lo rota al
        // arranque de arriba y lo normaliza a 0..1.
        const t = ((Math.atan2(dy, dx) + Math.PI / 2) / (Math.PI * 2) + 1) % 1;
        show(Math.min(N - 1, Math.floor(t * N)));
      };
      svg.addEventListener("pointermove", onMove);

      const jumps = q("[data-jump]").map((btn, i) => {
        const handler = () => show(i);
        btn.addEventListener("pointerenter", handler);
        btn.addEventListener("focus", handler);
        return { btn, handler };
      });

      return () => {
        svg.removeEventListener("pointermove", onMove);
        jumps.forEach(({ btn, handler }) => {
          btn.removeEventListener("pointerenter", handler);
          btn.removeEventListener("focus", handler);
        });
        intro.scrollTrigger?.kill();
        intro.kill();
        gsap.killTweensOf([...rings, needle, ...cards, ...shorts]);
        gsap.set([...rings, needle, ...cards, ...shorts], { clearProps: "all" });
        off();
      };
    }

    return () => {
      intro.scrollTrigger?.kill();
      intro.kill();
      gsap.set([...rings, needle, ...cards, ...shorts], { clearProps: "all" });
      off();
    };
  });

  return (
    <section
      ref={rootRef}
      className="group/dial flex min-h-svh items-center bg-cream py-20 text-ink"
    >
      <Container className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-24">
        <div className="relative mx-auto w-full max-w-[26rem]">
          <svg
            data-dial
            viewBox={`0 0 ${BOX} ${BOX}`}
            aria-hidden="true"
            className="block w-full overflow-visible"
          >
            {/* `transform` de rotación en el grupo y no en cada círculo: los
                seis arcos tienen que arrancar en el mismo ángulo, y repetir la
                rotación seis veces es seis oportunidades de que una quede
                distinta. */}
            <g transform={`rotate(-90 ${CENTER} ${CENTER})`}>
              {PROOF_STATS.map((s, i) => (
                <circle
                  key={s.id}
                  data-ring
                  cx={CENTER}
                  cy={CENTER}
                  r={ringRadius(i)}
                  fill="none"
                  stroke="#b6b2a9"
                  strokeWidth={1}
                  strokeLinecap="round"
                />
              ))}
            </g>
            <line
              data-needle
              x1={CENTER}
              y1={CENTER}
              x2={CENTER}
              y2={CENTER - ringRadius(N - 1) - 6}
              stroke="#101010"
              strokeWidth={1.2}
            />
          </svg>

          {/* La cifra corta va en el centro del dial, en HTML y no en un
              <text> del SVG: dentro del SVG el tamaño quedaría atado al
              viewBox, o sea fuera de la escala tipográfica del DS. */}
          {/* El disco de fondo NO es decoración: sin él la cifra del centro se
              lee sobre los tres anillos interiores y los trazos le cruzan los
              contrafuertes de la itálica. Del color del fondo de la sección,
              así que lo único que hace es despejar. */}
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="grid rounded-full bg-cream p-6">
              {PROOF_STATS.map((s) => (
                <span
                  key={s.id}
                  data-short
                  className="text-h2-serif italic [grid-area:1/1] group-data-[dial=on]/dial:opacity-0"
                >
                  {s.short}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-10">
          <Eyebrow className="text-gray-intermediate">Recorré el dial</Eyebrow>

          <div className="grid grid-cols-1">
            {PROOF_STATS.map((s) => (
              <article
                key={s.id}
                data-card
                className="flex flex-col gap-4 group-data-[dial=on]/dial:[grid-area:1/1] group-data-[dial=on]/dial:opacity-0"
              >
                <p className="text-h4">{s.eyebrow}</p>
                <p className="text-h1-serif italic">
                  {s.value}
                  <span className="text-green-ink">{s.accent}</span>
                </p>
                <p className="max-w-[52ch] text-body-sm text-gray-intermediate text-pretty">
                  {s.body}
                </p>
              </article>
            ))}
          </div>

          {/* La lista es la puerta sin puntero: táctil y teclado. No es un
              duplicado del dial — es el mismo control con otra forma. */}
          <ul className="flex flex-wrap gap-2">
            {PROOF_STATS.map((s) => (
              <li key={s.id}>
                <button
                  data-jump
                  type="button"
                  className="rounded-full border border-rule px-4 py-2 text-caption-mono text-gray-intermediate transition-colors hover:border-green-ink hover:text-green-ink"
                >
                  {s.short}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
