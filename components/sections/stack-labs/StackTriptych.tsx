"use client";

import Accent from "@/components/primitives/Accent";
import StackAssembly, {
  STAGE_ORDER,
  type StackStop,
} from "@/components/sections/stack-labs/stackAssembly";
import StackCursorTag from "@/components/sections/stack-labs/StackCursorTag";
import { useStackScene } from "@/components/sections/stack-labs/useStackScene";
import {
  AI_BLOCK,
  INTENTS_BLOCK,
  NEARCOM_BLOCK,
  PROTOCOL_BLOCK,
} from "@/components/sections/home-ab7/nearStackContent";

// ── G · Triptych ─────────────────────────────────────────────────────────────
//
// Tres columnas: el ÍNDICE de capas a la izquierda, el ensamble al centro
// dentro de su marco, y el cuerpo de la capa activa a la derecha. El título
// arriba, centrado, sobre todo.
//
// Lo que la distingue de las otras siete: acá el estado de la sección se lee de
// un vistazo SIN mirar el arte. La lista de la izquierda muestra las cuatro
// capas siempre, y la activa está más grande — no resaltada con color, más
// GRANDE. Es la diferencia entre "cuál está encendida" y "en cuál voy": lo
// primero lo dice un acento, lo segundo lo dice el tamaño.
//
// ── Por qué el tamaño y no el color ─────────────────────────────────────────
//
// El acento verde ya significa otra cosa en esta sección: es el color del
// material del que está hecho el arte. Usarlo también para "activo" en el texto
// hace que dos cosas distintas se digan igual. El cuerpo tipográfico es un canal
// libre, y además sobrevive al daltonismo y a una captura en blanco y negro.
//
// El precio es que la lista se MUEVE al cambiar de parada — el renglón que
// crece empuja a los de abajo. Va con transición sobre `font-size` para que sea
// un movimiento y no un salto, y la lista está anclada arriba (`items-start`)
// para que el empuje vaya siempre en la misma dirección.
//
// ── Las tres columnas no son iguales ────────────────────────────────────────
//
// El centro pesa más que los lados (`1.5fr` contra `1fr`) y los lados tienen
// mínimo en rem: sin ese mínimo, en una ventana de 1024 el cuerpo de la derecha
// caía a cuatro palabras por línea.
//
// ── Recorrido: 280svh ───────────────────────────────────────────────────────
//
// Sticky de CSS y el ScrollTrigger solo LEE el progreso — nunca `pin: true`
// (ver `components/sections/README.md`).

const TRAVEL = "280svh";

const BODIES: Record<StackStop, string> = {
  protocol: PROTOCOL_BLOCK.body,
  intents: INTENTS_BLOCK.body,
  ai: AI_BLOCK.intro,
  ironclaw: AI_BLOCK.subs[0].body,
  cloud: AI_BLOCK.subs[1].body,
  market: AI_BLOCK.subs[2].body,
  nearcom: NEARCOM_BLOCK.body,
};

const LINKS: Record<StackStop, { label: string; href: string } | undefined> = {
  protocol: PROTOCOL_BLOCK.link,
  intents: INTENTS_BLOCK.link,
  ai: AI_BLOCK.link,
  ironclaw: AI_BLOCK.link,
  cloud: AI_BLOCK.link,
  market: AI_BLOCK.link,
  nearcom: NEARCOM_BLOCK.link,
};

const LAYERS = [
  { key: "protocol", name: PROTOCOL_BLOCK.name },
  { key: "intents", name: INTENTS_BLOCK.name },
  { key: "ai", name: AI_BLOCK.name },
  { key: "nearcom", name: NEARCOM_BLOCK.name },
] as const;

export default function StackTriptych() {
  const { rootRef, stageRef, stage, stop, hover, enhanced, goTo, stageProps, tagRef } =
    useStackScene();

  // Antes de arrancar el recorrido, la capa activa es la columna: es lo único
  // que hay en escena.
  const key: StackStop = stop ?? "protocol";
  const inAi = AI_BLOCK.subs.some((s) => s.key === key);
  // La lista de productos se abre YA en la parada de la capa, no recién al
  // entrar en el primer producto: si esperara, los tres productos serían
  // inalcanzables con el puntero — solo el scroll podría llegar a ellos.
  const aiOpen = key === "ai" || inAi;
  const stepIndex = Math.max(0, STAGE_ORDER.indexOf(key));

  // Qué renglón de la lista está grande. En las paradas de producto el renglón
  // grande es el del producto, no el de la capa: si "NEAR AI" siguiera siendo
  // el grande mientras el cuerpo habla de IronClaw, la lista estaría diciendo
  // una cosa y el texto otra.
  const big = (k: string) => k === key;

  return (
    <section
      ref={rootRef}
      style={{ "--travel": TRAVEL } as React.CSSProperties}
      className="group/tri relative bg-ink text-cream data-[mode=track]:h-[calc(var(--travel)+100svh)]"
    >
      <div className="relative overflow-hidden group-data-[mode=track]/tri:sticky group-data-[mode=track]/tri:top-0 group-data-[mode=track]/tri:h-svh">
        {/* El ancho de la sección está TOPEADO y centrado. Sin tope, las dos
            columnas de texto se van a los bordes de la ventana y en un monitor
            ancho la lectura cruza medio metro de negro para llegar del índice
            al cuerpo. El tope es lo que mantiene el tríptico como una sola
            figura. */}
        <div className="mx-auto flex h-full w-full max-w-[1500px] flex-col px-[60px] pb-16 pt-[calc(var(--site-header-block)+2rem)]">
          <div className="grid flex-1 grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(15rem,1fr)_minmax(0,1.6fr)_minmax(15rem,1fr)]">
            {/* ── Izquierda: el título y el índice ─────────────────────── */}
            <div className="hidden flex-col gap-8 self-center lg:flex">
              {/* El título vive ACÁ y no centrado arriba: arriba se comía una
                  franja de alto que el gráfico necesita, y encima quedaba
                  compitiendo con el rótulo de la capa activa, que es el que
                  manda mientras se recorre la sección. */}
              <h2 className="text-h2 text-pretty">
                The NEAR <Accent>Stack</Accent>
              </h2>

              <ul className="flex flex-col gap-3">
              {LAYERS.map((l) => (
                <li key={l.key} className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => goTo(l.key as StackStop)}
                    disabled={!enhanced}
                    className={`w-fit cursor-pointer text-left transition-[font-size,color] duration-500 ease-out focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cta-mint motion-reduce:transition-none ${
                      big(l.key)
                        ? "text-h3 text-cream"
                        : l.key === "ai" && aiOpen
                          ? "text-body-lg text-cream/80"
                          : "text-body-lg text-cream/45 hover:text-cream/75"
                    }`}
                  >
                    {l.name}
                  </button>

                  {/* Los tres productos cuelgan de NEAR AI y solo se despliegan
                      cuando el recorrido entra en ellos. Fuera de ahí, prometer
                      una jerarquía de siete niveles en una lista de cuatro es
                      hacer la sección más difícil de leer, no más completa.

                      `0fr → 1fr`: el navegador interpola la altura sin que
                      nadie mida nada. */}
                  {l.key === "ai" && (
                    <div
                      data-open={aiOpen}
                      className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out data-[open=true]:grid-rows-[1fr] motion-reduce:transition-none"
                    >
                      <div className="overflow-hidden">
                        <ul className="mt-2 flex flex-col gap-2 border-l border-cream/15 pl-4">
                          {AI_BLOCK.subs.map((sub) => (
                            <li key={sub.key}>
                              <button
                                type="button"
                                onClick={() => goTo(sub.key as StackStop)}
                                disabled={!enhanced}
                                tabIndex={aiOpen ? 0 : -1}
                                className={`w-fit cursor-pointer text-left transition-[font-size,color] duration-500 ease-out focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cta-mint motion-reduce:transition-none ${
                                  big(sub.key)
                                    ? "text-h4 text-cream"
                                    : "text-body-sm text-cream/45 hover:text-cream/75"
                                }`}
                              >
                                {sub.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </li>
              ))}
              </ul>
            </div>

            {/* ── Centro: el ensamble ─────────────────────────────────── */}
            <div className="relative flex h-full items-center justify-center">
              {/* El alto lo topa TAMBIÉN el ancho: el ensamble es casi cuadrado
                  y su columna del grid no crece con la altura de la ventana.
                  Solo con `svh`, en una ventana baja y angosta el arte se salía
                  de su columna y se montaba sobre los dos textos. */}
              <div
                ref={stageRef}
                {...stageProps}
                className="pointer-events-auto relative h-[46svh] lg:h-[min(72svh,39vw)]"
              >
                <StackAssembly stage={stage} hover={hover} className="h-full w-auto" />
                <StackCursorTag ref={tagRef} hover={hover} />
              </div>
            </div>

            {/* ── Derecha: el cuerpo de la parada ──────────────────────── */}
            {/* `justify-self-end`: sin esto el bloque se apoya en el borde
                IZQUIERDO de su columna y queda flotando lejos del margen
                derecho — el índice pegado a su borde y el cuerpo a media
                columna del suyo. */}
            <div className="flex flex-col gap-6 self-center lg:justify-self-end">
              {/* El nombre NO se repite acá: ya está en la lista, y grande. */}
              <p className="max-w-[36ch] text-body text-cream/70 text-pretty">{BODIES[key]}</p>

              {LINKS[key] && (
                <a
                  href={LINKS[key]!.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-fit text-body-sm text-cta-mint transition-colors duration-200 hover:text-cta-lime"
                >
                  {LINKS[key]!.label} <span aria-hidden="true">→</span>
                </a>
              )}
            </div>
          </div>

          {/* El progreso: siete paradas. Dentro de un sticky el lector no tiene
              otra pista de cuánto falta. */}
          <div className="hidden gap-1.5 lg:flex">
            {STAGE_ORDER.map((k, i) => (
              <button
                key={k}
                type="button"
                aria-label={`Ir a ${k}`}
                onClick={() => goTo(k)}
                disabled={!enhanced}
                className={`h-px flex-1 cursor-pointer transition-colors duration-300 ${
                  i <= stepIndex ? "bg-cta-mint" : "bg-cream/20"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
