"use client";

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

// ── F · Axis ─────────────────────────────────────────────────────────────────
//
// El rótulo de la parada activa, a tamaño de póster y ACOSTADO SOBRE EL PLANO
// isométrico del ensamble, encima del arte a sangre. Una palabra por parada —
// siete — y un párrafo abajo.
//
// Las cinco variantes del lab tratan el texto como texto: renglones, fichas,
// panel, rótulos de plano. Esta lo trata como parte del OBJETO: la palabra no
// está delante del isométrico, está apoyada en su misma plano.
//
// ── De dónde sale el ángulo ─────────────────────────────────────────────────
//
// No es un valor elegido a ojo. La cara superior del cubo de la columna está
// definida en `stackAssembly` por su base afín: U = (51.28, −30.56), el eje que
// sube hacia la derecha. Su ángulo es atan(30.56 / 51.28) = 30.79°, y ese es el
// `skewY` negativo que se le aplica a la palabra. Con ese número exacto la
// tipografía comparte la fuga del arte; con 30 redondo, no — se nota como un
// texto torcido.
//
// El cizallamiento deforma los glifos, y eso es lo correcto: en una axonometría
// lo que está apoyado en un plano se deforma con él.
//
// ── Siete palabras y no cuatro ──────────────────────────────────────────────
//
// Las tres paradas de los productos de NEAR AI traen su propio rótulo
// (IronClaw, NEAR AI Cloud, Agent Market) en vez de repetir el de la capa. Es
// lo que hace que las siete paradas se sientan siete y no cuatro con anexos.
//
// ── Las siete están montadas a la vez, apiladas ─────────────────────────────
//
// Y solo la activa está en opacidad 1. Alternativa era remontar el nodo por
// parada con `key`, pero entonces el cambio es un corte seco: no hay dos
// estados entre los que transicionar. Apiladas, el cruce es una transición CSS
// de opacidad y desplazamiento, sin timeline que mantener.
//
// ── Recorrido: 260svh ───────────────────────────────────────────────────────
//
// Sticky de CSS y el ScrollTrigger solo LEE el progreso — nunca `pin: true`
// (ver `components/sections/README.md`).

const TRAVEL = "260svh";

// atan(30.56 / 51.28) — el eje U de la cara superior del cubo.
const ISO_SKEW = "skewY(-30.79deg)";

type AxisPanel = {
  word: string;
  body: string;
  link?: { label: string; href: string };
};

const PANELS: Record<StackStop, AxisPanel> = {
  protocol: { word: "Protocol", body: PROTOCOL_BLOCK.body, link: PROTOCOL_BLOCK.link },
  intents: { word: "Intents", body: INTENTS_BLOCK.body, link: INTENTS_BLOCK.link },
  ai: { word: "NEAR AI", body: AI_BLOCK.intro, link: AI_BLOCK.link },
  ironclaw: { word: "IronClaw", body: AI_BLOCK.subs[0].body, link: AI_BLOCK.link },
  cloud: { word: "AI Cloud", body: AI_BLOCK.subs[1].body, link: AI_BLOCK.link },
  market: { word: "Agent Market", body: AI_BLOCK.subs[2].body, link: AI_BLOCK.link },
  nearcom: { word: "near.com", body: NEARCOM_BLOCK.body, link: NEARCOM_BLOCK.link },
};

// El rótulo corto de cada parada para el riel de progreso.
const TICKS: Record<StackStop, string> = {
  protocol: "protocol",
  intents: "intents",
  ai: "ai",
  ironclaw: "ironclaw",
  cloud: "cloud",
  market: "market",
  nearcom: "near.com",
};

export default function StackAxis() {
  const { rootRef, stageRef, stage, stop, hover, enhanced, goTo, stageProps, tagRef } =
    useStackScene();

  // Antes de arrancar el recorrido el rótulo es el de la columna: es lo único
  // que hay en escena.
  const key: StackStop = stop ?? "protocol";
  const panel = PANELS[key];
  const stepIndex = Math.max(0, STAGE_ORDER.indexOf(key));

  return (
    <section
      ref={rootRef}
      style={{ "--travel": TRAVEL } as React.CSSProperties}
      className="group/axis relative bg-ink text-cream data-[mode=track]:h-[calc(var(--travel)+100svh)]"
    >
      <div className="relative overflow-hidden group-data-[mode=track]/axis:sticky group-data-[mode=track]/axis:top-0 group-data-[mode=track]/axis:h-svh">
        {/* El arte a sangre, como en A: se sale por el borde derecho y el
            inferior. Acá además es el plano sobre el que se apoya el rótulo. */}
        <div
          ref={stageRef}
          {...stageProps}
          className="pointer-events-auto absolute -bottom-[8svh] -right-[10vw] h-[112svh] lg:-right-[4vw]"
        >
          <StackAssembly stage={stage} hover={hover} className="h-full w-auto" />
          <StackCursorTag ref={tagRef} hover={hover} />
        </div>

        {/* El velo: apaga el arte del lado del texto. Más corto que en A —
            hasta el 58%— porque acá el bloque de lectura es más chico y lo que
            se le monta encima al arte es la palabra, que no necesita fondo. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(96deg,var(--ink)_22%,rgba(16,16,16,0.82)_40%,rgba(16,16,16,0)_58%)]"
        />

        {/* La palabra. Fuera del Container y en `absolute` a propósito: al
            cizallarse sube hacia la derecha y tiene que poder pasarse por
            encima del arte sin que el layout la contenga. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[42%] hidden lg:block"
        >
          <Container className="relative">
            {STAGE_ORDER.map((k) => (
              <span
                key={k}
                style={{ transform: ISO_SKEW }}
                className={`absolute left-[60px] block origin-left whitespace-nowrap text-display transition-all duration-300 ease-out motion-reduce:transition-none ${
                  k === key
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
              >
                {PANELS[k].word}
              </span>
            ))}
          </Container>
        </div>

        <Container className="pointer-events-none relative flex h-full flex-col justify-between py-16 group-data-[mode=track]/axis:pt-[calc(var(--site-header-block)+2rem)]">
          <div className="flex flex-col gap-2">
            <p className="text-eyebrow-mono uppercase text-cream/45">
              Open infrastructure powering the agent economy
            </p>
            <p className="text-body-sm text-cream/70">The NEAR Stack</p>
          </div>

          {/* El párrafo NO va cizallado: la palabra es el objeto, el cuerpo es
              lectura. Torcerlo también sería un efecto sobre algo que hay que
              leer, que es donde este tipo de recurso deja de funcionar. */}
          <div className="pointer-events-auto flex max-w-[34rem] flex-col gap-4 pb-10">
            <div className="flex items-baseline gap-4">
              <span className="text-caption-mono text-cta-mint">
                {String(stepIndex + 1).padStart(2, "0")} / {STAGE_ORDER.length}
              </span>
              {/* En las paradas de producto, la capa a la que pertenecen sigue
                  nombrada: sin esto, "IronClaw" a tamaño de póster no dice de
                  qué parte del stack está hablando. */}
              <span className="text-caption-mono uppercase text-cream/40">
                {AI_BLOCK.subs.some((s) => s.key === key) ? "NEAR AI" : "Layer"}
              </span>
            </div>

            <p className="min-h-[7.5rem] max-w-[46ch] text-body-lg text-cream/70 text-pretty">
              {panel.body}
            </p>

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
        </Container>

        {/* El riel: siete paradas con su nombre. Dentro de un sticky el lector
            no tiene otra pista de cuánto falta, y acá además es lo único que
            enumera las siete de un vistazo.

            `pb-14` y no `pb-6`: abajo de todo hay una barra sticky —la del
            laboratorio en su ruta, la de los drafts EX en la página— y con el
            padding chico los nombres de las paradas quedaban DEBAJO de ella. */}
        {/* El riel cruza por encima del arte, y sobre el verde claro los
            nombres en gris desaparecían. Un degradado corto al pie los
            devuelve sin oscurecer la pieza. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(0deg,var(--ink)_18%,rgba(16,16,16,0.7)_50%,rgba(16,16,16,0)_100%)]"
        />

        <Container className="pointer-events-none absolute inset-x-0 bottom-0 pb-14">
          <div className="pointer-events-auto flex gap-1.5">
            {STAGE_ORDER.map((k, i) => (
              <button
                key={k}
                type="button"
                onClick={() => goTo(k)}
                disabled={!enhanced}
                className="group/tick flex flex-1 cursor-pointer flex-col gap-2 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta-mint"
              >
                <span
                  className={`h-px w-full transition-colors duration-300 ${
                    i <= stepIndex ? "bg-cta-mint" : "bg-cream/20"
                  }`}
                />
                <span
                  className={`text-caption-mono transition-colors duration-300 ${
                    k === key ? "text-cta-mint" : "text-cream/30 group-hover/tick:text-cream/60"
                  }`}
                >
                  {TICKS[k]}
                </span>
              </button>
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}
