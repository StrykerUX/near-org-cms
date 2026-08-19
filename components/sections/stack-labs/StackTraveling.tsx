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

// ── E · Traveling ────────────────────────────────────────────────────────────
//
// Pantalla partida: a la izquierda el arte en plano CERRADO sobre la capa
// activa, a la derecha esa capa a tamaño de titular. El arte no cambia — cambia
// desde dónde se mira.
//
// Es la única de las cinco que trata el recorrido como una CÁMARA. Las otras
// cuatro muestran el mismo encuadre todo el rato y varían qué está encendido;
// acá cada parada es un travelling: la cámara se acerca a la columna, se abre
// para el anillo interior, retrocede hasta la cáscara.
//
// ── El encuadre es un transform sobre el contenedor, no un cambio de arte ───
//
// `FRAMES` da, por parada, la escala y el punto del ensamble que queda en el
// centro. Un `transition` de 900ms sobre `transform` hace el travelling entre
// dos paradas — el navegador interpola, no hay tween que mantener.
//
// El origen es el CENTRO del contenedor y el desplazamiento va en porcentaje del
// propio arte: así el encuadre significa lo mismo en cualquier tamaño de
// pantalla, que es justo lo que un valor en píxeles no puede garantizar.
//
// ── Recorrido: 380svh, el más caro de las cinco ─────────────────────────────
//
// Más que los 320svh del original. Es el precio de que cada parada sea un plano
// propio, y es exactamente el dato que hay que sopesar: si el travelling no vale
// una pantalla y media más de rueda, esta variante se cae sola.
//
// El otro precio, menos obvio: **el ensamble completo solo se ve al final**. En
// las otras cuatro el objeto entero está a la vista desde temprano; acá el
// lector no lo ve completo hasta la última parada.

const TRAVEL = "380svh";

// Por parada: escala y traslación (en % del ensamble) para que la pieza de esa
// capa quede centrada en el marco izquierdo.
const FRAMES: Record<StackStop, { scale: number; x: number; y: number }> = {
  protocol: { scale: 1.9, x: 0, y: -6 },
  intents: { scale: 1.5, x: 0, y: 2 },
  ai: { scale: 1.25, x: 0, y: 0 },
  ironclaw: { scale: 1.45, x: 12, y: -4 },
  cloud: { scale: 1.45, x: -12, y: -4 },
  market: { scale: 1.45, x: 0, y: 10 },
  nearcom: { scale: 1, y: 0, x: 0 },
};

const PANELS: Record<
  string,
  { kicker: string; name: string; accent?: string; body: string; link?: { label: string; href: string } }
> = {
  protocol: {
    kicker: "Settlement layer",
    name: "NEAR",
    accent: "Protocol",
    body: PROTOCOL_BLOCK.body,
    link: PROTOCOL_BLOCK.link,
  },
  intents: {
    kicker: "Outcomes layer",
    name: "NEAR",
    accent: "Intents",
    body: INTENTS_BLOCK.body,
    link: INTENTS_BLOCK.link,
  },
  ai: {
    kicker: "Confidential layer",
    name: "NEAR",
    accent: "AI",
    body: AI_BLOCK.intro,
    link: AI_BLOCK.link,
  },
  nearcom: {
    kicker: "Outer shell",
    name: "near",
    accent: ".com",
    body: NEARCOM_BLOCK.body,
    link: NEARCOM_BLOCK.link,
  },
};

export default function StackTraveling() {
  const { rootRef, stageRef, stage, stop, hover, enhanced, goTo, stageProps, tagRef } =
    useStackScene();

  // Antes de arrancar el recorrido, el plano es el de la columna: es lo único
  // que hay en escena.
  const key: StackStop = stop ?? "protocol";
  const frame = FRAMES[key];

  // Los tres productos de AI comparten panel con la capa: lo que cambia entre
  // sus paradas es el ENCUADRE y cuál de los tres está resaltado.
  const panelKey = AI_BLOCK.subs.some((s) => s.key === key) ? "ai" : key;
  const panel = PANELS[panelKey];
  const stepIndex = STAGE_ORDER.indexOf(key);

  return (
    <section
      ref={rootRef}
      style={{ "--travel": TRAVEL } as React.CSSProperties}
      className="group/trav relative bg-ink text-cream data-[mode=track]:h-[calc(var(--travel)+100svh)]"
    >
      <div className="group-data-[mode=track]/trav:sticky group-data-[mode=track]/trav:top-0 group-data-[mode=track]/trav:h-svh">
        <div className="grid h-full grid-cols-1 lg:grid-cols-2">
          {/* La cámara. `overflow-hidden` acá y no en la sección: es el marco
              que recorta, y la sección tiene que poder ser sticky. */}
          <div className="relative hidden overflow-hidden border-r border-cream/12 lg:block">
            <div
              ref={stageRef}
              {...stageProps}
              style={{
                transform: `translate(${frame.x}%, ${frame.y}%) scale(${frame.scale})`,
              }}
              className="absolute left-1/2 top-1/2 h-[86%] -translate-x-1/2 -translate-y-1/2 transition-transform duration-[900ms] ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none"
            >
              <StackAssembly stage={stage} hover={hover} className="h-full w-auto" />
              <StackCursorTag ref={tagRef} hover={hover} />
            </div>

            {/* La marca de encuadre: cuatro esquinas, como un visor. Es lo que
                declara que esto es una cámara y no un arte que se mueve solo. */}
            <div className="pointer-events-none absolute inset-10">
              <span className="absolute left-0 top-0 size-6 border-l border-t border-cream/30" />
              <span className="absolute right-0 top-0 size-6 border-r border-t border-cream/30" />
              <span className="absolute bottom-0 left-0 size-6 border-b border-l border-cream/30" />
              <span className="absolute bottom-0 right-0 size-6 border-b border-r border-cream/30" />
            </div>

            <p className="pointer-events-none absolute bottom-14 left-10 text-caption-mono uppercase text-cream/40">
              Frame {String(Math.max(0, stepIndex) + 1).padStart(2, "0")} · {key}
            </p>
          </div>

          {/* El panel: UNA capa, a tamaño de titular. */}
          <div className="flex flex-col justify-between px-[60px] py-14 group-data-[mode=track]/trav:pt-[calc(var(--site-header-block)+2rem)]">
            <div className="flex items-baseline justify-between gap-6">
              <p className="text-body-sm text-cream/50">
                The NEAR <Accent>Stack</Accent>
              </p>
              <p className="text-caption-mono text-cream/45">
                {String(Math.max(0, stepIndex) + 1).padStart(2, "0")} / {STAGE_ORDER.length}
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <p className="text-caption-mono uppercase text-cta-mint">{panel.kicker}</p>
              <h2 className="text-h1 text-pretty">
                {panel.name} {panel.accent && <Accent>{panel.accent}</Accent>}
              </h2>
              <p className="max-w-[46ch] text-body-lg text-cream/65 text-pretty">{panel.body}</p>

              {/* Los tres productos solo aparecen en las paradas de AI: en las
                  otras, la sección estaría prometiendo una jerarquía que no
                  existe. */}
              {panelKey === "ai" && (
                <div className="flex flex-col">
                  {AI_BLOCK.subs.map((sub) => {
                    const active = key === sub.key;
                    return (
                      <button
                        key={sub.key}
                        type="button"
                        onClick={() => goTo(sub.key as StackStop)}
                        className={`grid cursor-pointer grid-cols-[10rem_minmax(0,1fr)] gap-x-5 border-t py-3 text-left transition-colors duration-300 last:border-b focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta-mint ${
                          active ? "border-cta-mint" : "border-cream/15"
                        }`}
                      >
                        <span className={active ? "text-body text-cream" : "text-body text-cream/70"}>
                          {sub.name}
                        </span>
                        <span
                          className={`text-caption text-pretty transition-colors duration-300 ${
                            active ? "text-cream/60" : "text-cream/35"
                          }`}
                        >
                          {sub.body}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {panel.link && (
                <a
                  href={panel.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-fit text-body-sm text-cta-mint transition-colors duration-200 hover:text-cta-lime"
                >
                  {panel.link.label} <span aria-hidden="true">→</span>
                </a>
              )}
            </div>

            {/* El progreso: siete tramos. Dentro de un sticky, el lector no
                tiene otra pista de cuánto falta. */}
            <div className="flex gap-1.5">
              {STAGE_ORDER.map((k, i) => (
                <button
                  key={k}
                  type="button"
                  aria-label={`Ir a ${k}`}
                  onClick={() => goTo(k)}
                  disabled={!enhanced}
                  className={`h-0.5 flex-1 cursor-pointer transition-colors duration-300 ${
                    i <= stepIndex ? "bg-cta-mint" : "bg-cream/20"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
