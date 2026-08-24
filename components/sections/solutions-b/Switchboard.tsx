"use client";

import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import SwitchArt from "@/components/sections/solutions-b/switchArt";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { EASE_OUT, DEBUG_MARKERS, MQ } from "@/components/primitives/motion/motionTokens";
import { SOLUTIONS } from "@/components/sections/solutions/solutionsContent";

// §2 — el gesto firma de la propuesta B: las cinco soluciones en UNA pantalla.
//
// ── La tesis ──────────────────────────────────────────────────────────────
//
// Un hub es una interfaz, no un artículo. El lector no viene a que le cuenten
// cinco cosas en orden: viene a encontrar la suya. Así que las cinco viven en
// una sola pantalla, la lista siempre visible y clicable a la izquierda, y el
// contenido de la activa a la derecha. Elegir cuesta un clic y cero scroll.
//
// ── En qué se parece a la escena pegada que se descartó, y en qué no ──────
//
// La propuesta A tuvo un índice pegado con este mismo reparto —lista quieta,
// cuerpos en crossfade— y se borró entero. Conviene tener clarísimo por qué
// esto no es lo mismo, porque a primera vista lo parece:
//
// · Aquella escena costaba **380svh de scroll** (cinco beats de 76svh) para
//   entregar cinco párrafos, y el orden lo imponía la página. Ésta cuesta **una
//   pantalla** y el orden lo elige el lector.
// · Aquella tenía los beats centrados en un contenedor de 100svh, así que al
//   entrar en la sección lo primero que aparecía era media pantalla vacía y el
//   texto llegaba mucho después de haberla tocado. Ésta no se mueve: el panel
//   está lleno desde el primer frame.
//
// La lección, escrita para que no se repita: **una escena pegada le sirve a una
// página que quiere enseñar una mecánica, no a una que quiere que la
// consulten.**
//
// ── Accesibilidad: es un tablist de verdad ────────────────────────────────
//
// `role="tablist"` / `role="tab"` / `role="tabpanel"`, con `aria-selected`,
// `aria-controls` y navegación por flechas (↑↓←→, Home, End). No es decoración:
// un patrón de pestañas que no responde al teclado deja el contenido de cuatro
// de las cinco soluciones inalcanzable para quien no usa puntero.
//
// Los cinco paneles están SIEMPRE en el DOM y los inactivos llevan el atributo
// `hidden`. Es lo correcto para lectores de pantalla (un tabpanel inactivo no
// debe anunciarse) y además deja el contenido de las cinco en el HTML servido,
// que es lo que un rastreador necesita.

const N = SOLUTIONS.length;

export default function Switchboard() {
  const [active, setActive] = useState(0);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // La entrada de la sección. Una sola vez, anclada al panel y no a la sección:
  // con el trigger en el borde de la sección el disparo cae con el contenido
  // todavía fuera de cuadro y el lector llega a una sección ya terminada.
  const rootRef = useMotionScope<HTMLElement>(({ q, motionOk }) => {
    if (!motionOk) return;

    const tl = gsap.timeline({
      defaults: { ease: EASE_OUT },
      scrollTrigger: {
        trigger: q("[data-board]")[0],
        start: "top 85%",
        once: true,
        markers: DEBUG_MARKERS,
      },
    });

    tl.from(q("[data-tab]"), { autoAlpha: 0, x: -14, duration: 0.45, stagger: 0.06 }, 0)
      .from(q("[data-panel-item]"), { autoAlpha: 0, y: 16, duration: 0.5, stagger: 0.07 }, 0.2)
      // Los cables se dibujan hacia abajo, como si alguien acabara de
      // enchufarlos. Es el único movimiento del panel y le da sentido al marco.
      .fromTo(
        q("[data-cable]"),
        { strokeDasharray: 100, strokeDashoffset: 100 },
        { strokeDashoffset: 0, duration: 0.7, stagger: 0.07, ease: "power2.inOut" },
        0.35
      );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  });

  // El cambio de pestaña. Va por fuera del scope de scroll porque no depende de
  // la posición sino del gesto del lector: un fundido corto sobre el panel
  // entrante, y nada más. Se declara acá y se dispara desde el handler.
  const swap = (next: number) => {
    setActive(next);
    if (!window.matchMedia(MQ.motion).matches) return;
    // El panel que entra todavía no existe en el DOM cuando esto corre, así que
    // el tween se agenda para el frame siguiente. `requestAnimationFrame` y no
    // un `setTimeout(0)`: hace falta que React haya pintado, no sólo que la
    // cola de tareas se haya vaciado.
    requestAnimationFrame(() => {
      const panel = document.querySelector(`[data-panel="${SOLUTIONS[next].id}"]`);
      if (!panel) return;
      gsap.fromTo(
        panel,
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.35, ease: EASE_OUT }
      );
    });
  };

  const onKey = (e: React.KeyboardEvent) => {
    const map: Record<string, number> = {
      ArrowDown: active + 1,
      ArrowRight: active + 1,
      ArrowUp: active - 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: N - 1,
    };
    const raw = map[e.key];
    if (raw === undefined) return;
    e.preventDefault();
    const next = (raw + N) % N;
    swap(next);
    // El foco viaja con la selección. Es lo que el patrón de pestañas
    // «automático» exige: si el foco se queda atrás, el lector de pantalla
    // anuncia una pestaña y muestra otra.
    tabsRef.current[next]?.focus();
  };

  return (
    <section ref={rootRef} className="bg-cream pb-28 pt-24">
      <Container>
        <h2 className="max-w-[18ch] text-h2 text-pretty">
          What the world is <Accent>building on NEAR</Accent>
        </h2>

        <div data-board className="mt-14 grid-ds gap-y-10">
          {/* ── el selector ───────────────────────────────────────────────
              Filas numeradas con filete, no pastillas. Una pastilla redondeada
              es el vocabulario de un panel de control de SaaS; esta página se
              escribe en el del resto del sitio, donde lo que separa cosas es un
              filete de 1px. La activa se marca con tinta plena y una barra a la
              izquierda. */}
          <div
            role="tablist"
            aria-label="Solutions"
            aria-orientation="vertical"
            onKeyDown={onKey}
            className="col-span-12 lg:col-span-4"
          >
            {SOLUTIONS.map((s, i) => {
              const on = i === active;
              return (
                <button
                  key={s.id}
                  ref={(el) => {
                    tabsRef.current[i] = el;
                  }}
                  data-tab
                  type="button"
                  role="tab"
                  id={`tab-${s.id}`}
                  aria-selected={on}
                  aria-controls={`panel-${s.id}`}
                  // Sólo la pestaña activa es tabulable. Es la regla del patrón:
                  // el tabulador entra al grupo una vez y las flechas se mueven
                  // dentro, en vez de gastar cinco tabuladas.
                  tabIndex={on ? 0 : -1}
                  onClick={() => swap(i)}
                  className="group flex w-full items-baseline gap-5 border-t border-rule py-5 text-left transition-[padding-left] duration-300 ease-out hover:pl-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink motion-reduce:transition-none last:border-b"
                >
                  <span
                    aria-hidden="true"
                    // La barra del activo. `scale-y` y no `height`: es una barra
                    // suelta, no hay nada que relayout-ear.
                    className={`h-6 w-0.5 origin-center transition-transform duration-300 ease-out motion-reduce:transition-none ${
                      on ? "scale-y-100 bg-ink" : "scale-y-0 bg-ink"
                    }`}
                  />
                  <span className="text-caption-mono text-gray-intermediate">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`text-h4 transition-colors duration-300 motion-reduce:transition-none ${
                      on ? "text-ink" : "text-gray-intermediate group-hover:text-ink"
                    }`}
                  >
                    {s.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ── el panel ──────────────────────────────────────────────────
              `min-h` fijo para que cambiar de pestaña no mueva el layout: los
              cinco cuerpos miden entre tres y seis renglones, y sin un piso
              común la página salta cada vez que el lector elige.

              El valor es un compromiso deliberado: cubre a cuatro de los cinco
              y deja que el más largo (Cross-Chain DeFi) empuje unos píxeles.
              Calibrado para cubrirlos a los cinco quedaba un hueco permanente
              de ~200px debajo de los otros cuatro, y un hueco fijo se ve peor
              que un salto de una vez. */}
          <div className="col-span-12 lg:col-span-7 lg:col-start-6">
            {SOLUTIONS.map((s, i) => (
              <div
                key={s.id}
                data-panel={s.id}
                role="tabpanel"
                id={`panel-${s.id}`}
                aria-labelledby={`tab-${s.id}`}
                hidden={i !== active}
                className="lg:min-h-[22rem]"
              >
                <div className="grid gap-x-[var(--grid-gutter)] gap-y-10 lg:grid-cols-2">
                  <div>
                    <p data-panel-item className="text-caption-mono uppercase text-gray-intermediate">
                      {s.kicker}
                    </p>
                    <p data-panel-item className="mt-6 max-w-[46ch] text-body text-ink-soft text-pretty">
                      {s.body}
                    </p>

                    {/* Los nombres propios que el cuerpo ya menciona, extraídos
                        al pie en mono. No es información nueva: es la misma,
                        puesta donde el ojo la encuentra sin leer el párrafo.
                        Dos de las cinco no traen nombres en el copy y se quedan
                        sin pie — inventar un cliente para emparejar la columna
                        es exactamente lo que esta página no puede hacer. */}
                    {s.evidence.length > 0 && (
                      <p
                        data-panel-item
                        className="mt-7 max-w-[34ch] text-caption-mono text-gray-intermediate"
                      >
                        {s.evidence.join(" · ")}
                      </p>
                    )}

                    <a
                      data-panel-item
                      href={s.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-9 inline-flex items-center gap-2 border-b border-ink/25 pb-1 text-label text-ink transition-colors hover:border-ink"
                    >
                      {s.link.label}
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </a>
                  </div>

                  <div data-panel-item className="self-center">
                    <SwitchArt id={s.id} className="text-ink" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
