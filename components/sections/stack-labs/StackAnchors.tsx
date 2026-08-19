"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import StackAssembly, { type StackStop } from "@/components/sections/stack-labs/stackAssembly";
import StackCursorTag from "@/components/sections/stack-labs/StackCursorTag";
import { useStackScene } from "@/components/sections/stack-labs/useStackScene";
import {
  AI_BLOCK,
  INTENTS_BLOCK,
  NEARCOM_BLOCK,
  PROTOCOL_BLOCK,
} from "@/components/sections/home-ab7/nearStackContent";

// ── C · Anchors ──────────────────────────────────────────────────────────────
//
// El texto vive PEGADO a su capa. Cada ficha se ancla a la pieza de la que
// habla con un trazo corto, en vez de vivir en una lista aparte a la derecha.
//
// Es la diferencia conceptual con las otras cuatro: acá la posición del texto
// SIGNIFICA algo. La ficha de la cáscara está arriba porque la cáscara es lo de
// afuera; la del núcleo, abajo, pegada a la columna. Un lector que no lea una
// palabra ya sabe qué envuelve a qué.
//
// ── El riesgo, y por qué está puesto a prueba ───────────────────────────────
//
// Cuatro bloques de texto en las cuatro esquinas es una composición difícil: si
// crecen, se acercan al arte y lo ahogan; si el viewport es bajo, se tocan. Por
// eso los cuerpos van en `text-caption` y con un ancho corto — y por eso esta
// variante hay que mirarla en una pantalla de portátil, no solo en un monitor.
//
// ── El halo ─────────────────────────────────────────────────────────────────
//
// Un radial verde muy contenido detrás del ensamble. No es decoración: sobre
// negro plano el arte flota en el vacío, y un objeto que no está EN ningún sitio
// se lee como un recorte pegado encima.
//
// ── Recorrido: 200svh ────────────────────────────────────────────────────────
//
// Cada parada enciende una capa Y su ficha, a la vez. Es la relación que la
// variante propone: pieza y texto son la misma unidad.

const TRAVEL = "200svh";

export default function StackAnchors() {
  const { rootRef, stageRef, stage, stop, hover, enhanced, goTo, stageProps, tagRef } =
    useStackScene();

  // La ficha se enciende cuando su capa es la parada activa, cuando el puntero
  // está sobre su pieza, o siempre en el fallback sin escena.
  const on = (key: StackStop | "ai") => {
    if (!enhanced) return true;
    if (hover) return hover.key === key || (key === "ai" && hover.kind === "seg");
    if (key === "ai") return stop === "ai" || AI_BLOCK.subs.some((s) => s.key === stop);
    return stop === key;
  };

  return (
    <section
      ref={rootRef}
      style={{ "--travel": TRAVEL } as React.CSSProperties}
      className="group/anchors relative bg-ink text-cream data-[mode=track]:h-[calc(var(--travel)+100svh)]"
    >
      <div className="relative overflow-hidden group-data-[mode=track]/anchors:sticky group-data-[mode=track]/anchors:top-0 group-data-[mode=track]/anchors:h-svh">
        {/* El halo. `inset` negativo y el degradado apagándose antes del borde:
            si el radial termina dentro de su propia caja, se ve el rectángulo. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-[30svh] bg-[radial-gradient(circle_at_50%_56%,rgba(0,220,141,0.13)_0%,rgba(0,220,141,0.05)_22%,rgba(0,220,141,0.015)_34%,rgba(16,16,16,0)_46%)]"
        />

        <Container className="pointer-events-none relative flex h-full flex-col py-14 group-data-[mode=track]/anchors:pt-[calc(var(--site-header-block)+1.5rem)]">
          <div className="pointer-events-auto flex flex-col items-center gap-2 text-center">
            <h2 className="text-h1 text-pretty">
              The NEAR <Accent>Stack</Accent>
            </h2>
            <p className="max-w-[34ch] text-body-lg text-cream/55 text-balance">
              Open infrastructure powering the agent economy
            </p>
          </div>

          {/* El área de anclaje: el arte centrado y las cuatro fichas en las
              esquinas. `min-h-0` para que el arte pueda encogerse dentro del
              sticky en vez de desbordarlo. */}
          <div className="relative mt-6 min-h-0 flex-1">
            <div
              ref={stageRef}
              {...stageProps}
              className="pointer-events-auto absolute left-1/2 top-1/2 h-full -translate-x-1/2 -translate-y-1/2"
            >
              <StackAssembly stage={stage} hover={hover} className="h-full w-auto" />
              <StackCursorTag ref={tagRef} hover={hover} />
            </div>

            <Anchor
              side="left"
              label="Outer shell"
              name={NEARCOM_BLOCK.name}
              body={NEARCOM_BLOCK.body}
              on={on("nearcom")}
              onSelect={() => goTo("nearcom")}
              className="left-0 top-0"
            />
            <Anchor
              side="right"
              label="Ring"
              name={AI_BLOCK.name}
              body={AI_BLOCK.intro}
              on={on("ai")}
              onSelect={() => goTo("ai")}
              className="right-0 top-0"
            >
              <div className="flex flex-wrap justify-end gap-1.5 pt-1">
                {AI_BLOCK.subs.map((sub) => (
                  <button
                    key={sub.key}
                    type="button"
                    onClick={() => goTo(sub.key as StackStop)}
                    className={`rounded-full border px-2.5 py-0.5 text-caption-mono transition-colors duration-200 ${
                      stop === sub.key
                        ? "border-cta-mint text-cta-mint"
                        : "border-cream/25 text-cream/60 hover:border-cream/60"
                    }`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            </Anchor>
            <Anchor
              side="left"
              label="Inner ring"
              name={INTENTS_BLOCK.name}
              body={INTENTS_BLOCK.body}
              on={on("intents")}
              onSelect={() => goTo("intents")}
              className="bottom-0 left-0"
            />
            <Anchor
              side="right"
              label="Core column"
              name={PROTOCOL_BLOCK.name}
              body={PROTOCOL_BLOCK.body}
              on={on("protocol")}
              onSelect={() => goTo("protocol")}
              className="bottom-0 right-0"
            />
          </div>
        </Container>
      </div>
    </section>
  );
}

/* ── Una ficha anclada ────────────────────────────────────────────────────── */

function Anchor({
  side,
  label,
  name,
  body,
  on,
  onSelect,
  className,
  children,
}: {
  side: "left" | "right";
  label: string;
  name: string;
  body: string;
  on: boolean;
  onSelect: () => void;
  className: string;
  children?: React.ReactNode;
}) {
  const right = side === "right";
  return (
    <div
      className={`pointer-events-auto absolute w-[17rem] ${className} flex flex-col gap-2 ${
        right ? "items-end text-right" : "items-start"
      }`}
    >
      {/* El trazo: es lo que declara que este texto pertenece a esa pieza. Se
          alarga y se pinta cuando la capa está activa — el vínculo se AFIRMA, no
          aparece de la nada. */}
      <div className={`flex items-center gap-2.5 ${right ? "flex-row-reverse" : ""}`}>
        <span
          className={`h-px transition-all duration-500 ${
            on ? "w-10 bg-cta-mint" : "w-5 bg-cream/30"
          }`}
        />
        <span
          className={`text-caption-mono uppercase transition-colors duration-300 ${
            on ? "text-cta-mint" : "text-cream/40"
          }`}
        >
          {label}
        </span>
      </div>

      <button
        type="button"
        onClick={onSelect}
        className="cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta-mint"
      >
        <span
          className={`block text-h4 transition-colors duration-300 ${right ? "text-right" : ""} ${
            on ? "text-cream" : "text-cream/55"
          }`}
        >
          {name}
        </span>
      </button>

      <p
        className={`text-caption text-pretty transition-colors duration-300 ${
          on ? "text-cream/65" : "text-cream/35"
        }`}
      >
        {body}
      </p>
      {children}
    </div>
  );
}
