"use client";

import { useState } from "react";
import Accent from "@/components/primitives/Accent";
import StackAssembly, { type StackStop } from "@/components/sections/stack-labs/stackAssembly";
import StackCursorTag from "@/components/sections/stack-labs/StackCursorTag";
import { useStackScene } from "@/components/sections/stack-labs/useStackScene";
import {
  AI_BLOCK,
  INTENTS_BLOCK,
  NEARCOM_BLOCK,
  PROTOCOL_BLOCK,
} from "@/components/sections/home-ab7/nearStackContent";

// ── G · Concentric ───────────────────────────────────────────────────────────
//
// El LAYOUT es el diagrama. El ensamble va centrado y las cuatro capas viven en
// cuatro marcos concéntricos alrededor: near.com en el más exterior, NEAR AI
// dentro de él, Intents dentro de ese, Protocol en el que abraza a la columna.
//
// La copy no está en una lista al lado del arte: está en la capa de la que
// habla. Su posición en pantalla significa lo mismo que su posición en el
// isométrico — de adentro hacia afuera, que es el orden narrativo del stack.
//
// ── Sin recorrido: `mode: "static"` ─────────────────────────────────────────
//
// Cero scroll. La sección mide una pantalla y el ensamble está completo desde
// que aparece. Es lo contrario de A y de E, y es a propósito: una figura
// simétrica que se lee de un vistazo no puede pedir tres pantallas de rueda
// para revelarse por partes.
//
// Lo que se pierde es el build-up por capa — el mismo precio que paga B, y el
// mismo dato que el lab quiere: ¿vale tres pantallas de scroll ver cómo se
// arma?
//
// ── La navegación es el puntero, no el scroll ───────────────────────────────
//
// Sin recorrido no hay `goTo` (en `static` el hook lo deja sin efecto), así que
// la capa activa es estado LOCAL: el rótulo que se apunta o se clickea. El
// hover sobre el ARTE sigue viniendo del hook y manda por encima del estado
// local — apuntar una pieza y que el texto no responda sería el peor de los dos
// mundos.
//
// ── Los marcos son hairlines de verdad, no adornos ──────────────────────────
//
// Cada uno es un rectángulo con borde de 1px al 12% y su rótulo montado en la
// ESQUINA superior izquierda, con el fondo cortando la línea (`bg-ink px-2`)
// como en un fieldset. Eso es lo que hace que se lea "el rótulo pertenece a
// este marco" y no "hay cuatro cajas y cuatro títulos sueltos".
//
// En la esquina y no centrado arriba: centrados, los cuatro rótulos caían en la
// misma vertical que la columna del ensamble y el de más adentro se le montaba
// encima. En las esquinas forman una escalera que baja hacia adentro — que
// además es la que dice en qué orden anidan.

// ── La geometría de los marcos ─────────────────────────────────────────────
//
// Los cuatro marcos NO se miden desde los bordes de la pantalla: se miden desde
// el ARTE hacia afuera. El de más adentro es el ensamble más un margen, y cada
// uno de los otros se sale del anterior el mismo paso por los cuatro lados.
//
// Esa es la diferencia entre una figura concéntrica y una decoración de borde.
// Con marcos anclados a los bordes de la ventana —`inset` creciente— el de más
// adentro termina siendo casi toda la pantalla, con el ensamble flotando en el
// medio: cuatro rectángulos ANIDADOS, sí, pero ninguno alrededor de nada.
//
// Todo va en svh y no en rem porque el arte se mide en svh: si el paso fuera
// fijo, en una ventana baja los marcos se comerían la pantalla y en una alta se
// separarían del arte. En svh la figura entera escala junta.
// Los números salen de una cuenta, no de probar: la figura entera —el marco
// exterior— mide ART + 6·STEP de alto, y tiene que caber entre el header fijo
// y la banda de lectura. En una ventana de 812px eso son 546px de región y
// 519px de figura. Subir ART o STEP le come el aire y el rótulo de near.com se
// va debajo del header.
const ART = 36; // svh de alto del ensamble
const ART_W = ART * (695 / 650); // su ancho, del aspecto del viewBox
const STEP = 4; // svh entre marco y marco
const PAD_Y = 2; // rem de aire entre el arte y el marco de más adentro
const PAD_X = 3;
const BAND = 11; // rem de la banda de lectura, abajo

// i = 0 es el marco EXTERIOR (near.com) y 3 el interior (protocol).
const frameBox = (i: number) => ({
  width: `calc(${ART_W + STEP * 2 * (3 - i)}svh + ${PAD_X}rem)`,
  height: `calc(${ART + STEP * 2 * (3 - i)}svh + ${PAD_Y}rem)`,
});

const FRAMES = [
  { key: "nearcom", i: 0 },
  { key: "ai", i: 1 },
  { key: "intents", i: 2 },
  { key: "protocol", i: 3 },
] as const;

const BODIES: Record<string, string> = {
  protocol: PROTOCOL_BLOCK.body,
  intents: INTENTS_BLOCK.body,
  ai: AI_BLOCK.intro,
  nearcom: NEARCOM_BLOCK.body,
  ironclaw: AI_BLOCK.subs[0].body,
  cloud: AI_BLOCK.subs[1].body,
  market: AI_BLOCK.subs[2].body,
};

const NAMES: Record<string, string> = {
  protocol: PROTOCOL_BLOCK.name,
  intents: INTENTS_BLOCK.name,
  ai: AI_BLOCK.name,
  nearcom: NEARCOM_BLOCK.name,
  ironclaw: AI_BLOCK.subs[0].name,
  cloud: AI_BLOCK.subs[1].name,
  market: AI_BLOCK.subs[2].name,
};

const LINKS: Record<string, { label: string; href: string } | undefined> = {
  protocol: PROTOCOL_BLOCK.link,
  intents: INTENTS_BLOCK.link,
  ai: AI_BLOCK.link,
  nearcom: NEARCOM_BLOCK.link,
  ironclaw: AI_BLOCK.link,
  cloud: AI_BLOCK.link,
  market: AI_BLOCK.link,
};

export default function StackConcentric() {
  const { rootRef, stageRef, stage, hover, stageProps, tagRef } = useStackScene({
    mode: "static",
  });

  const [pick, setPick] = useState<StackStop>("protocol");

  // El hover sobre el arte gana: es la lectura más directa que hay —el dedo
  // está encima de la pieza— y si el texto no la siguiera, el estado local
  // estaría contradiciendo lo que el puntero ya está diciendo.
  const active: StackStop = (hover?.key as StackStop) ?? pick;
  const isAiActive = (k: string) =>
    active === k || (k === "ai" && AI_BLOCK.subs.some((sub) => sub.key === active));

  return (
    <section
      ref={rootRef}
      className="relative flex h-svh min-h-[40rem] items-center overflow-hidden bg-ink text-cream"
    >
      {/* La figura: los cuatro marcos y el ensamble, centrados en la región que
          queda entre el header fijo y la banda de lectura — no en la pantalla
          entera: el rótulo del marco exterior terminaba debajo del header, y el
          centro visual, debajo del texto. */}
      <div
        className="absolute inset-x-0 hidden lg:block"
        style={{ top: "var(--site-header-block)", bottom: `${BAND}rem` }}
      >
        {FRAMES.map((f) => (
          <div
            key={f.key}
            style={frameBox(f.i)}
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-sm border transition-colors duration-300 ${
              isAiActive(f.key) ? "border-cta-mint/60" : "border-cream/12"
            }`}
          >
            {/* El rótulo, montado en la esquina del marco con el fondo cortando
                la línea. `translate-y-1/2` negativo: queda a caballo del trazo,
                como en un fieldset. */}
            <button
              type="button"
              onClick={() => setPick(f.key as StackStop)}
              onPointerEnter={() => setPick(f.key as StackStop)}
              className="absolute left-5 top-0 -translate-y-1/2 cursor-pointer bg-ink px-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta-mint"
            >
              <span
                className={`text-caption-mono uppercase transition-colors duration-300 ${
                  isAiActive(f.key) ? "text-cta-mint" : "text-cream/40 hover:text-cream/80"
                }`}
              >
                {NAMES[f.key]}
              </span>
            </button>

            {/* Los tres productos de NEAR AI van en el borde INFERIOR de SU
                marco: pertenecen a esa capa y están donde esa capa termina. */}
            {f.key === "ai" && (
              <div className="absolute bottom-0 left-5 flex translate-y-1/2 gap-2 bg-ink px-2">
                {AI_BLOCK.subs.map((sub) => (
                  <button
                    key={sub.key}
                    type="button"
                    onClick={() => setPick(sub.key as StackStop)}
                    onPointerEnter={() => setPick(sub.key as StackStop)}
                    className={`cursor-pointer rounded-full border px-3 py-1 text-caption-mono transition-colors duration-200 ${
                      active === sub.key
                        ? "border-cta-mint text-cta-mint"
                        : "border-cream/20 text-cream/50 hover:border-cream/50 hover:text-cream/80"
                    }`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        <div
          ref={stageRef}
          {...stageProps}
          style={{ height: `${ART}svh` }}
          className="pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <StackAssembly stage={stage} hover={hover} className="h-full w-auto" />
          <StackCursorTag ref={tagRef} hover={hover} />
        </div>
      </div>

      {/* La banda: el título a la izquierda y la ranura de lectura a la derecha.
          La ranura está SIEMPRE en el mismo sitio, cambie lo que cambie de capa.
          Poner el cuerpo dentro de cada marco sería más consecuente con la idea,
          pero el ojo tendría que ir a buscarlo a cuatro alturas distintas — y el
          marco de más adentro no tiene sitio para un párrafo. */}
      <div
        style={{ height: `${BAND}rem` }}
        className="absolute inset-x-0 bottom-0 hidden grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] items-start gap-10 border-t border-cream/10 px-[60px] pb-10 pt-5 lg:grid"
      >
        <div className="flex flex-col gap-1">
          <p className="text-eyebrow-mono uppercase text-cream/40">Open infrastructure</p>
          <h2 className="text-h3">
            The NEAR <Accent>Stack</Accent>
          </h2>
        </div>

        <div className="flex max-w-[52rem] flex-col gap-1.5">
          <p className="text-label-lg text-cream">{NAMES[active]}</p>
          <p className="max-w-[84ch] text-body-sm text-cream/60 text-pretty">{BODIES[active]}</p>
          {LINKS[active] && (
            <a
              href={LINKS[active]!.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit text-caption text-cta-mint transition-colors duration-200 hover:text-cta-lime"
            >
              {LINKS[active]!.label} <span aria-hidden="true">→</span>
            </a>
          )}
        </div>
      </div>

      {/* Fallback vertical (móvil, reduced-motion): las cuatro capas en lista.
          No está diseñado, solo es correcto — decisión declarada del lab. */}
      <div className="relative flex w-full flex-col gap-6 px-5 lg:hidden">
        <h2 className="text-h3">
          The NEAR <Accent>Stack</Accent>
        </h2>
        {(["protocol", "intents", "ai", "nearcom"] as const).map((k) => (
          <div key={k} className="flex flex-col gap-2 border-t border-cream/15 pt-4">
            <p className="text-label-lg">{NAMES[k]}</p>
            <p className="text-body-sm text-cream/60 text-pretty">{BODIES[k]}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
