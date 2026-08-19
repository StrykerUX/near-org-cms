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

// ── H · Dolly ────────────────────────────────────────────────────────────────
//
// El cruce de A (Bleed) y E (Traveling), que son las dos que gustaron.
//
// De A se queda: el arte A SANGRE —se sale por el borde derecho y el inferior,
// no cabe y por eso se lee grande—, el velo que lo apaga del lado del texto, y
// las capas como RENGLONES tipográficos que se despliegan en el sitio.
//
// De E se queda: la CÁMARA. Cada parada es un plano distinto sobre la misma
// pieza — la cámara empuja sobre la columna, se abre para el anillo de AI,
// retrocede hasta la cáscara.
//
// ── Qué se tira de cada una, y por qué ──────────────────────────────────────
//
// De E se tira la PANTALLA PARTIDA. Ahí la cámara vivía en un marco de media
// pantalla con esquinas de visor: un monitor dentro de la página. Acá el marco
// es la pantalla entera — las esquinas del visor están en los bordes del
// viewport— así que el lector no mira una cámara, está DENTRO de ella.
//
// De A se tira el encuadre único. En A el arte estaba grande pero quieto: las
// siete paradas cambiaban qué estaba encendido y nada más. Ese era su límite —
// la mitad del recorrido no tenía nada nuevo que mostrar.
//
// ── El costo, que es el punto de la mezcla ──────────────────────────────────
//
// A costaba 240svh y E 380svh. Esta cuesta 300svh: el travelling necesita más
// rueda que el encendido para no sentirse a los saltos, pero al no tener que
// mostrar el ensamble completo al final de un plano cerrado (el problema de E:
// el objeto entero solo se veía en la última parada) se ahorra la pantalla que
// E gastaba en volver.
//
// Acá el objeto entero SÍ se ve desde el principio —el plano de arranque es el
// de A, a sangre y a escala 1— y el recorrido lo que hace es meterse dentro.
//
// ── Los encuadres ───────────────────────────────────────────────────────────
//
// `FRAMES` da, por parada, escala y desplazamiento en % del propio arte. El
// origen es el centro y el desplazamiento va en porcentaje del arte y no en
// píxeles: el encuadre significa lo mismo en cualquier tamaño de pantalla.
//
// La x es NEGATIVA en las paradas cerradas porque el arte está anclado al borde
// derecho: al ampliarlo, la pieza que interesa se va hacia afuera de la
// pantalla y hay que traerla de vuelta hacia el hueco de la izquierda, que es
// justo donde el velo la deja verse.
//
// Un `transition` de 900ms sobre `transform` hace el travelling entre dos
// paradas — el navegador interpola, no hay tween que mantener.
//
// Sticky de CSS y el ScrollTrigger solo LEE el progreso — nunca `pin: true`
// (ver `components/sections/README.md`).

const TRAVEL = "300svh";

const FRAMES: Record<StackStop, { scale: number; x: number; y: number }> = {
  protocol: { scale: 1.15, x: -9, y: 3 },
  intents: { scale: 1.28, x: -12, y: 2 },
  ai: { scale: 1.15, x: -8, y: 0 },
  // Los tres productos son segmentos del MISMO anillo: misma escala, el
  // encuadre solo se corre hasta el que toca (IronClaw a la izquierda, Cloud a
  // la derecha, Agent Market abajo).
  ironclaw: { scale: 1.3, x: 2, y: -2 },
  cloud: { scale: 1.3, x: -22, y: -2 },
  market: { scale: 1.3, x: -10, y: 10 },
  // La última es el plano de A, tal cual: el objeto entero, a sangre.
  nearcom: { scale: 1, x: 0, y: 0 },
};

// El rótulo del plano. `nearcom` es la clave interna del recorrido, pero en
// pantalla la capa se llama near.com.
const TAGS: Record<StackStop, string> = {
  protocol: "protocol",
  intents: "intents",
  ai: "near ai",
  ironclaw: "ironclaw",
  cloud: "ai cloud",
  market: "agent market",
  nearcom: "near.com",
};

export default function StackDolly() {
  const { rootRef, stageRef, stage, stop, hover, enhanced, goTo, stageProps, tagRef } =
    useStackScene();

  const key: StackStop = stop ?? "protocol";
  const frame = FRAMES[key];
  const stepIndex = Math.max(0, STAGE_ORDER.indexOf(key));

  const aiOpen = !enhanced || key === "ai" || AI_BLOCK.subs.some((s) => s.key === key);
  const open = (k: StackStop) => !enhanced || key === k;

  return (
    <section
      ref={rootRef}
      style={{ "--travel": TRAVEL } as React.CSSProperties}
      className="group/dolly relative bg-ink text-cream data-[mode=track]:h-[calc(var(--travel)+100svh)]"
    >
      <div className="relative overflow-hidden group-data-[mode=track]/dolly:sticky group-data-[mode=track]/dolly:top-0 group-data-[mode=track]/dolly:h-svh">
        {/* El arte a sangre + la cámara. El `transform` del encuadre se
            compone con el anclaje: el nodo sigue clavado abajo a la derecha y
            lo que se mueve es lo que la cámara mira. */}
        <div
          ref={stageRef}
          {...stageProps}
          style={{
            transform: `translate(${frame.x}%, ${frame.y}%) scale(${frame.scale})`,
          }}
          className="pointer-events-auto absolute -bottom-[6svh] -right-[6vw] h-[104svh] origin-center transition-transform duration-[900ms] ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none lg:-right-[2vw]"
        >
          <StackAssembly stage={stage} hover={hover} className="h-full w-auto" />
          <StackCursorTag ref={tagRef} hover={hover} />
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,var(--ink)_30%,rgba(16,16,16,0.86)_46%,rgba(16,16,16,0)_66%)]"
        />

        {/* El visor: las cuatro esquinas en los bordes de la PANTALLA. Es lo
            que declara que el encuadre es una cámara y no un arte que se mueve
            solo — y puesto acá, que la cámara es la ventana del navegador.

            El rótulo del plano va DENTRO del visor y no junto al título: es
            información de la cámara —qué está mirando y cuántos planos
            faltan—, y al lado del eyebrow le partía la línea en dos. */}
        <div className="pointer-events-none absolute inset-6 hidden lg:block">
          <span className="absolute left-0 top-0 size-7 border-l border-t border-cream/25" />
          <span className="absolute right-0 top-0 size-7 border-r border-t border-cream/25" />
          <span className="absolute bottom-0 left-0 size-7 border-b border-l border-cream/25" />
          <span className="absolute bottom-0 right-0 size-7 border-b border-r border-cream/25" />

          <p className="absolute right-12 top-1 text-caption-mono uppercase text-cta-mint/70">
            frame {String(stepIndex + 1).padStart(2, "0")} · {TAGS[key]}
          </p>
        </div>

        <Container className="pointer-events-none relative flex h-full flex-col justify-between pb-20 pt-16 group-data-[mode=track]/dolly:pt-[calc(var(--site-header-block)+1.5rem)]">
          <div className="flex max-w-[40rem] flex-col gap-4">
            <p className="text-eyebrow-mono uppercase text-cream/45">
              Open infrastructure powering the agent economy
            </p>
            {/* `h1` y no `display` como en A: acá el título comparte pantalla
                con cuatro renglones Y con un plano que cambia. En display, la
                cuarta capa se caía abajo del borde. */}
            <h2 className="text-h1 text-pretty">
              The NEAR <Accent>Stack</Accent>
            </h2>
          </div>

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
              {/* Acá los tres productos SÍ tienen parada propia y cada una es
                  un plano: el chip activo dice desde dónde se está mirando. */}
              <div className="flex flex-wrap gap-2 pt-1">
                {AI_BLOCK.subs.map((sub) => (
                  <button
                    key={sub.key}
                    type="button"
                    onClick={() => goTo(sub.key as StackStop)}
                    tabIndex={aiOpen ? 0 : -1}
                    className={`cursor-pointer rounded-full border px-3 py-1 text-caption-mono transition-colors duration-200 ${
                      key === sub.key
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

        {/* El progreso, dentro del visor: siete planos. */}
        <Container className="pointer-events-none absolute inset-x-0 bottom-0 pb-6">
          <div className="pointer-events-auto flex gap-1.5">
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
        </Container>
      </div>
    </section>
  );
}

/* ── Un renglón de capa: título siempre visible, cuerpo desplegable ─────────
   Igual que en A. El desplegable va con `grid-rows: 0fr → 1fr`, que el
   navegador interpola sin que nadie mida una altura. */

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
        <span className={`text-h3 transition-colors duration-300 ${open ? "text-cream" : "text-cream/45"}`}>
          {name}
        </span>
      </button>

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
