"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import StackAssembly from "@/components/sections/stack-labs/stackAssembly";
import StackCursorTag from "@/components/sections/stack-labs/StackCursorTag";
import { useStackScene } from "@/components/sections/stack-labs/useStackScene";
import {
  AI_BLOCK,
  INTENTS_BLOCK,
  NEARCOM_BLOCK,
  PROTOCOL_BLOCK,
} from "@/components/sections/home-ab7/nearStackContent";

// ── B · Broadsheet ───────────────────────────────────────────────────────────
//
// Las cuatro capas COMPLETAS a la vez, con los tres productos de NEAR AI en
// línea. Nada se abre ni se cierra: la sección es una página, no un acordeón.
//
// Es la respuesta directa a "320svh para cuatro párrafos": acá son **cero**. La
// sección mide una pantalla y se lee entera de un vistazo.
//
// ── Lo que se pierde, dicho de frente ───────────────────────────────────────
//
// El build-up por capa. En esta variante el ensamble entra COMPLETO cuando la
// sección aparece (`mode: "static"`), así que el lector nunca ve construirse el
// stack — que es lo mejor que tiene hoy la sección. Lo que queda del gesto es el
// build-in de la columna y el hover, que siguen intactos.
//
// Si al mirarla la sensación es "esto perdió lo que la hacía especial", ese es
// exactamente el dato que esta variante existe para dar.
//
// ── Todo apretado, y ese es el compromiso de esta variante ─────────────────
//
// La promesa es "las cuatro capas en UNA pantalla", así que la escala de todo
// —título en `h2` y no `h1`, cuerpos en `body-sm`, los tres productos en
// `caption`— sale de lo que cabe en 800px de alto, no de lo que se vería mejor
// suelto. En un portátil de 768px la cuarta capa roza el borde.
//
// Si al mirarla el texto se siente chico, esa es la respuesta: esta densidad es
// el precio de no gastar scroll, y la comparación contra A y E es exactamente
// esa.
//
// ── El arte no está en una caja ─────────────────────────────────────────────
//
// Ocupa la mitad derecha de punta a punta y se sale por el borde. La diferencia
// con la sección actual no es de tamaño: es que allá el arte está DENTRO de una
// celda de la grilla, con su aire alrededor, y acá es el fondo de esa mitad.

export default function StackBroadsheet() {
  const { rootRef, stageRef, stage, hover, stageProps, tagRef } = useStackScene({
    mode: "static",
  });

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-svh items-center overflow-hidden bg-ink py-14 text-cream"
    >
      {/* El arte, anclado al borde derecho. `h-[112svh]` y centrado en vertical:
          se sale por arriba y por abajo, no queda flotando en un hueco. */}
      <div
        ref={stageRef}
        {...stageProps}
        className="absolute -right-[8vw] top-1/2 h-[112svh] -translate-y-1/2 lg:-right-[4vw]"
      >
        <StackAssembly stage={stage} hover={hover} className="h-full w-auto" />
        <StackCursorTag ref={tagRef} hover={hover} />
      </div>

      {/* El velo, entre el arte y el texto. Llega hasta el 86% y no al 100%:
          el borde derecho del arte tiene que quedar limpio. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,var(--ink)_36%,rgba(16,16,16,0.92)_50%,rgba(16,16,16,0.55)_64%,rgba(16,16,16,0)_86%)]"
      />

      <Container className="pointer-events-none relative flex flex-col gap-7">
        <div className="pointer-events-auto flex max-w-[46rem] flex-col gap-2">
          <h2 className="text-h2 text-pretty">
            The NEAR <Accent>Stack</Accent>
          </h2>
          <p className="max-w-[58ch] text-body text-cream/55 text-pretty">
            Open infrastructure powering the agent economy. Four layers, built
            from the core outward.
          </p>
        </div>

        <div className="pointer-events-auto flex max-w-[48rem] flex-col">
          <Entry index="01" name={PROTOCOL_BLOCK.name} body={PROTOCOL_BLOCK.body} link={PROTOCOL_BLOCK.link} />
          <Entry index="02" name={INTENTS_BLOCK.name} body={INTENTS_BLOCK.body} link={INTENTS_BLOCK.link} />
          <Entry index="03" name={AI_BLOCK.name} body={AI_BLOCK.intro} link={AI_BLOCK.link}>
            {/* Los tres productos, en columnas: se leen sin desplegar nada. Es
                la diferencia con el rail actual, donde viven dentro de una caja
                que hay que abrir. */}
            <div className="grid grid-cols-1 gap-3 pt-0.5 md:grid-cols-3">
              {AI_BLOCK.subs.map((sub) => (
                <div key={sub.key} className="flex flex-col gap-1 border-l border-cream/15 pl-3">
                  <p className="text-body-sm text-cream/85">{sub.name}</p>
                  <p className="text-caption text-cream/50 text-pretty">{sub.body}</p>
                </div>
              ))}
            </div>
          </Entry>
          <Entry
            index="04"
            name={NEARCOM_BLOCK.name}
            body={NEARCOM_BLOCK.body}
            link={NEARCOM_BLOCK.link}
            last
          />
        </div>
      </Container>
    </section>
  );
}

/* ── Una capa: siempre abierta, separada por reglas ───────────────────────── */

function Entry({
  index,
  name,
  body,
  link,
  children,
  last = false,
}: {
  index: string;
  name: string;
  body: string;
  link?: { label: string; href: string };
  children?: React.ReactNode;
  last?: boolean;
}) {
  return (
    <article
      className={`grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-5 border-t border-cream/15 py-4 ${
        last ? "border-b" : ""
      }`}
    >
      <p className="text-caption-mono text-cta-mint">{index}</p>
      <div className="flex flex-col gap-2">
        <h3 className="text-h4 text-cream">{name}</h3>
        <p className="max-w-[62ch] text-body-sm text-cream/60 text-pretty">{body}</p>
        {children}
        {link && (
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-caption text-cta-mint transition-colors duration-200 hover:text-cta-lime"
          >
            {link.label} <span aria-hidden="true">→</span>
          </a>
        )}
      </div>
    </article>
  );
}
