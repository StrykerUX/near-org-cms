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

// ── D · Blueprint ────────────────────────────────────────────────────────────
//
// El stack como plano de ingeniería: retícula, líneas guía que salen de cada
// capa hacia su ficha, rótulos en monoespaciada con su número de capa. Todo
// anotado a la vez, sin recorrido.
//
// Es la más honesta con lo que la cosa ES —un ensamble de cuatro capas, una
// dentro de otra— y la menos emocional de las cinco. Funciona si el lector es
// técnico; se queda fría si esta sección tiene que vender.
//
// ── Las líneas guía van en un SVG y no en bordes ────────────────────────────
//
// Cada una es una polilínea con un codo: sale horizontal desde la ficha y gira
// hacia el punto de la pieza. Con bordes de CSS haría falta un nodo por tramo y
// el codo quedaría a merced del redondeo del layout; en un SVG con `viewBox`
// propio, la geometría es la misma en cualquier viewport.
//
// El `preserveAspectRatio="none"` deforma el trazo con la caja — aceptable
// porque son líneas rectas de 1px, no formas.
//
// ── La retícula es del PLANO, no del arte ───────────────────────────────────
//
// Cubre la sección entera y no se mueve. Si siguiera al arte, sería textura;
// quieta, es el papel sobre el que el arte está dibujado, que es la idea.

export default function StackBlueprint() {
  const { rootRef, stageRef, stage, hover, stageProps, tagRef } = useStackScene({
    mode: "static",
  });

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-svh flex-col justify-center overflow-hidden bg-ink py-16 text-cream"
    >
      {/* La retícula. 48px y al 6%: se ve, no se lee. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[length:48px_48px] bg-[linear-gradient(rgba(245,244,241,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(245,244,241,0.06)_1px,transparent_1px)]"
      />

      <Container className="relative flex flex-col gap-6">
        <div className="flex items-start justify-between gap-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-h2 text-pretty">
              The NEAR <Accent>Stack</Accent>
            </h2>
            <p className="text-body-sm text-cream/50">
              Open infrastructure powering the agent economy
            </p>
          </div>
          <p className="text-caption-mono uppercase text-cream/40">
            Assembly · 04 layers
          </p>
        </div>

        {/* El plano: el arte al centro y las cuatro fichas cotadas. */}
        <div className="relative h-[64svh] min-h-0">
          <div
            ref={stageRef}
            {...stageProps}
            className="absolute left-1/2 top-1/2 h-full -translate-x-1/2 -translate-y-1/2"
          >
            <StackAssembly stage={stage} hover={hover} className="h-full w-auto" />
            <StackCursorTag ref={tagRef} hover={hover} />
          </div>

          {/* Las guías. Coordenadas en un espacio de 1320×700 que se estira con
              la caja: lo único que importa es que cada codo caiga sobre su
              pieza, y las piezas escalan con el mismo contenedor.
              
              Los cuatro puntos están MEDIDOS contra el ensamble renderizado, no
              estimados: se leyó dónde cae cada pieza en pantalla y se convirtió
              a este espacio. Si el arte cambia de tamaño relativo dentro del
              contenedor, hay que volver a medirlos — no se derivan solos. */}
          <svg
            viewBox="0 0 1320 700"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full"
          >
            {/* near.com: la arista superior izquierda de la cáscara exterior */}
            <path d="M 300 120 L 430 120 L 488 183" fill="none" stroke="rgba(245,244,241,0.28)" strokeWidth="1" />
            <circle cx="488" cy="183" r="3.5" fill="#00DC8D" />
            {/* NEAR AI: el brazo derecho del anillo de tres segmentos */}
            <path d="M 1020 330 L 860 330 L 780 387" fill="none" stroke="rgba(245,244,241,0.28)" strokeWidth="1" />
            <circle cx="780" cy="387" r="3.5" fill="#00DC8D" />
            {/* NEAR Intents: el anillo interior, por su lado izquierdo */}
            <path d="M 300 540 L 450 540 L 546 496" fill="none" stroke="rgba(245,244,241,0.28)" strokeWidth="1" />
            <circle cx="546" cy="496" r="3.5" fill="#00DC8D" />
            {/* NEAR Protocol: la columna, bajo el cruce de los anillos */}
            <path d="M 1020 640 L 760 640 L 644 605" fill="none" stroke="rgba(245,244,241,0.28)" strokeWidth="1" />
            <circle cx="644" cy="605" r="3.5" fill="#00DC8D" />
          </svg>

          <Spec
            className="left-0 top-[6%] items-end text-right"
            layer="Layer 04 · Shell"
            name={NEARCOM_BLOCK.name}
            body={NEARCOM_BLOCK.body}
            link={NEARCOM_BLOCK.link}
          />
          <Spec
            className="right-0 top-[36%]"
            layer="Layer 03 · Ring"
            name={AI_BLOCK.name}
            body={AI_BLOCK.intro}
            link={AI_BLOCK.link}
            meta={AI_BLOCK.subs.map((s) => s.name).join(" · ")}
          />
          <Spec
            className="bottom-[26%] left-0 items-end text-right"
            layer="Layer 02 · Inner ring"
            name={INTENTS_BLOCK.name}
            body={INTENTS_BLOCK.body}
            link={INTENTS_BLOCK.link}
          />
          <Spec
            className="bottom-0 right-0"
            layer="Layer 01 · Core"
            name={PROTOCOL_BLOCK.name}
            body={PROTOCOL_BLOCK.body}
            link={PROTOCOL_BLOCK.link}
          />
        </div>
      </Container>
    </section>
  );
}

/* ── Una ficha del plano ──────────────────────────────────────────────────── */

function Spec({
  className,
  layer,
  name,
  body,
  link,
  meta,
}: {
  className: string;
  layer: string;
  name: string;
  body: string;
  link?: { label: string; href: string };
  meta?: string;
}) {
  return (
    <div className={`absolute flex w-[19rem] flex-col gap-1.5 ${className}`}>
      <p className="text-caption-mono uppercase text-cta-mint">{layer}</p>
      <h3 className="text-h4 text-cream">{name}</h3>
      <p className="text-caption text-cream/55 text-pretty">{body}</p>
      {meta && <p className="text-caption-mono text-cream/40">{meta}</p>}
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
  );
}
