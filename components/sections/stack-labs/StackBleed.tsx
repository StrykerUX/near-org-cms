"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
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

// ── A · Bleed ────────────────────────────────────────────────────────────────
//
// El ensamble ocupa la pantalla y se sale por el borde derecho y por el
// inferior. No cabe, y por eso se lee como un objeto GRANDE.
//
// Es el diagnóstico de la sección actual llevado al extremo contrario: hoy el
// arte vive en una caja de la mitad izquierda, a media escala, con el texto en
// pills a la derecha y el 40% de la pantalla vacío. Acá el arte es el fondo y
// el texto se le monta encima.
//
// ── El velo no es decoración, es lo que hace legible el texto ───────────────
//
// Un gradiente desde la izquierda apaga el arte justo donde empieza la columna
// de texto. Sin él, la cifra y el cuerpo caen sobre los brazos del isométrico y
// no se lee ninguno de los dos. Va en un nodo aparte y no como `background` del
// contenedor porque tiene que quedar ENTRE el arte y el texto.
//
// ── Las capas dejan de ser pills ────────────────────────────────────────────
//
// Cuatro renglones tipográficos con su número; el activo despliega su cuerpo en
// el sitio (`grid-rows: 0fr → 1fr`, que el navegador interpola sin medir nada).
// Los otros tres se leen igual, en gris.
//
// ── Recorrido: 240svh contra los 320svh del original ────────────────────────
//
// Siete paradas repartidas en menos rueda. El sticky es de CSS y el
// ScrollTrigger solo LEE el progreso — nunca `pin: true` (ver
// `components/sections/README.md`).

const TRAVEL = "240svh";

export default function StackBleed() {
  const { rootRef, stageRef, stage, stop, hover, enhanced, goTo, stageProps, tagRef } =
    useStackScene();

  const aiOpen =
    !enhanced || stop === "ai" || AI_BLOCK.subs.some((s) => s.key === stop);
  const open = (key: StackStop) => !enhanced || stop === key;

  return (
    <section
      ref={rootRef}
      style={{ "--travel": TRAVEL } as React.CSSProperties}
      className="group/bleed relative bg-ink text-cream data-[mode=track]:h-[calc(var(--travel)+100svh)]"
    >
      <div className="relative overflow-hidden group-data-[mode=track]/bleed:sticky group-data-[mode=track]/bleed:top-0 group-data-[mode=track]/bleed:h-svh">
        {/* El arte, a sangre. `-right` y `-bottom` en unidades de viewport para
            que el recorte sea proporcional a la pantalla y no a un número de
            píxeles que solo funcione en un monitor.
            
            104svh y no más: con 128 el ensamble se salía tanto que en pantalla
            quedaba un FRAGMENTO sin forma reconocible — a sangre no significa
            recortado hasta que no se sepa qué es. Con esto el objeto se lee
            entero y aun así toca los dos bordes. */}
        <div
          ref={stageRef}
          {...stageProps}
          className="pointer-events-auto absolute -bottom-[6svh] -right-[6vw] h-[104svh] lg:-right-[2vw]"
        >
          <StackAssembly stage={stage} hover={hover} className="h-full w-auto" />
          <StackCursorTag ref={tagRef} hover={hover} />
        </div>

        {/* El velo: apaga el arte donde empieza el texto. Sin `pointer-events`
            para no robarle el hover al ensamble que tiene debajo. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,var(--ink)_30%,rgba(16,16,16,0.86)_46%,rgba(16,16,16,0)_66%)]"
        />

        <Container className="pointer-events-none relative flex h-full flex-col justify-between py-16 group-data-[mode=track]/bleed:pt-[calc(var(--site-header-block)+2rem)]">
          <div className="flex max-w-[40rem] flex-col gap-4">
            <p className="text-eyebrow-mono uppercase text-cream/45">
              Open infrastructure powering the agent economy
            </p>
            <h2 className="text-display text-pretty">
              The NEAR <Accent display>Stack</Accent>
            </h2>
          </div>

          {/* `pointer-events-auto` acá y no en el Container: el Container cubre
              todo el ancho y taparía el hover del arte. */}
          <div className="pointer-events-auto flex max-w-[34rem] flex-col">
            <Row
              index="01"
              name={PROTOCOL_BLOCK.name}
              body={PROTOCOL_BLOCK.body}
              link={PROTOCOL_BLOCK.link}
              open={open("protocol")}
              onSelect={() => goTo("protocol")}
            />
            <Row
              index="02"
              name={INTENTS_BLOCK.name}
              body={INTENTS_BLOCK.body}
              link={INTENTS_BLOCK.link}
              open={open("intents")}
              onSelect={() => goTo("intents")}
            />
            <Row
              index="03"
              name={AI_BLOCK.name}
              body={AI_BLOCK.intro}
              link={AI_BLOCK.link}
              open={aiOpen}
              onSelect={() => goTo("ai")}
            >
              {/* Los tres productos, como chips: en esta variante no se
                  despliegan uno por uno — el recorrido los enciende en el ARTE
                  y acá solo se nombran. El detalle de cada uno es lo que el
                  hover sobre su segmento ya cuenta. */}
              <div className="flex flex-wrap gap-2 pt-1">
                {AI_BLOCK.subs.map((sub) => (
                  <button
                    key={sub.key}
                    type="button"
                    onClick={() => goTo(sub.key as StackStop)}
                    tabIndex={aiOpen ? 0 : -1}
                    className={`rounded-full border px-3 py-1 text-caption-mono transition-colors duration-200 ${
                      stop === sub.key
                        ? "border-cta-mint text-cta-mint"
                        : "border-cream/25 text-cream/70 hover:border-cream/60"
                    }`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            </Row>
            <Row
              index="04"
              name={NEARCOM_BLOCK.name}
              body={NEARCOM_BLOCK.body}
              link={NEARCOM_BLOCK.link}
              open={open("nearcom")}
              onSelect={() => goTo("nearcom")}
              last
            />
          </div>
        </Container>
      </div>

      {/* El progreso del recorrido, solo en modo track: siete paradas. Es lo
          que evita que el lector no sepa cuánto falta dentro de un sticky. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden group-data-[mode=track]/bleed:sticky group-data-[mode=track]/bleed:bottom-0 group-data-[mode=track]/bleed:block">
        <Container className="flex gap-1.5 pb-6">
          {STAGE_ORDER.map((key, i) => (
            <span
              key={key}
              className={`h-px flex-1 transition-colors duration-300 ${
                i <= stage ? "bg-cta-mint" : "bg-cream/20"
              }`}
            />
          ))}
        </Container>
      </div>
    </section>
  );
}

/* ── Un renglón de capa: título siempre visible, cuerpo desplegable ───────── */

function Row({
  index,
  name,
  body,
  link,
  open,
  onSelect,
  children,
  last = false,
}: {
  index: string;
  name: string;
  body: string;
  link?: { label: string; href: string };
  open: boolean;
  onSelect: () => void;
  children?: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      data-open={open}
      className={`group/row border-t transition-colors duration-300 ${
        open ? "border-cta-mint" : "border-cream/15"
      } ${last ? "border-b" : ""}`}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-baseline gap-5 py-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta-mint"
      >
        <span className={`text-caption-mono ${open ? "text-cta-mint" : "text-cream/35"}`}>
          {index}
        </span>
        {/* span y no <p>: un botón solo admite phrasing content. */}
        <span className={`text-h3 transition-colors duration-300 ${open ? "text-cream" : "text-cream/45"}`}>
          {name}
        </span>
      </button>

      {/* 0fr↔1fr: el navegador interpola la altura sin que nadie mida nada. */}
      <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out group-data-[open=true]/row:grid-rows-[1fr] motion-reduce:transition-none">
        <div className="overflow-hidden">
          <div className="flex flex-col gap-2 pb-4 pl-10">
            <p className="max-w-[52ch] text-body-sm text-cream/60 text-pretty">{body}</p>
            {children}
            {link && (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={open ? 0 : -1}
                className="text-caption text-cta-mint transition-colors duration-200 hover:text-cta-lime"
              >
                {link.label} <span aria-hidden="true">→</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
