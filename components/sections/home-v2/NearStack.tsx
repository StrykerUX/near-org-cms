"use client";

import { useEffect, useRef, useState } from "react";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import {
  ColumnGreen,
  ColumnWire,
  AiRingGreen,
  AiRingWire,
  IntentsGreen,
  IntentsWire,
  NearcomGreen,
  NearcomWire,
} from "./stackArt.generated";
import {
  PROTOCOL_BLOCK,
  INTENTS_BLOCK,
  AI_BLOCK,
  NEARCOM_BLOCK,
  PROTOCOL_FEATURES,
  type StackKey,
  type StackLeaf,
} from "./nearStackContent";

// ── NearStack: los SVG de marca ensamblados + scroll e iluminación por capa ──
//
// Tercera forma de la sección, ahora sobre los EXPORTS reales de brand
// (SLIDE_10–13): cuatro capas — columna (Protocol), anillo interior (Intents),
// anillo de tres segmentos (NEAR AI) y cáscara exterior (near.com) — cada una
// con su gemela wireframe. Los archivos salen de una misma composición madre:
// cada anillo trae una MÁSCARA con el canal de la columna recortado, así que
// el tejido delante/detrás está horneado y el apilado es por orden de capas.
//
// La alineación horizontal es EXACTA, derivada de esas máscaras (el canal de
// la columna aparece en x=275.81 en la exterior, 221.07 en la de AI y 133.44
// en la de Intents — mismo ancho 103u en todas ⇒ escala 1:1). Las verticales
// NO son derivables de los archivos y están estimadas contra los stills de
// referencia: son las constantes *_Y de abajo, pensadas para ajuste visual.
//
// Interacción (decidida con Lawrence):
//   · La escena es un BUILD-UP por scroll: en Protocol solo existe la
//     columna; cada parada del rail hace ANIMAR SU CAPA a escena y las
//     anteriores se quedan verdes. Dentro de NEAR AI solo el producto activo
//     va verde y sus hermanos quedan wireframe; near.com entra como elemento
//     verde completo y deja el ensamble entero encendido.
//   · El arte es hoverable; el hover GANA sobre el estado de scroll (solo lo
//     hovereado verde, el resto de lo visible en wireframe) y al salir el
//     puntero se vuelve a él. El texto NO se mueve por hover.
//   · La columna es sólida y al hover se PARTE en sus seis cubos — cada cubo
//     es un feature del protocolo, hoverable individualmente.
//   · Cada pieza encendida por hover lleva su bubble tag (pill), como en los
//     stills.
//   · Mobile / reduced-motion: sin scroll-scene — todo expandido y el arte
//     completo en verde (el look ensamblado del still final).

/* ── Geometría del ensamble (espacio de la capa exterior, 695 de ancho) ──── */

const STAGE_W = 695;
const STAGE_H = 650;
// x exactas (máscaras); y estimadas de los stills — TUNEAR EN BROWSER.
const POS = {
  column: { x: 275.81, y: 0, w: 104 },
  intents: { x: 142.37, y: 206, w: 371 },
  ai: { x: 54.74, y: 127, w: 546 },
  nearcom: { x: 0, y: 40, w: 695 },
} as const;

const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(2)}%`;

/* ── Bubble tags: ancla en % del stage por pieza encendida ────────────────── */

const SEG_NAMES: Record<string, string> = {
  ironclaw: "IronClaw",
  cloud: "NEAR AI Cloud",
  market: "Agent Market",
};

const TAG_ANCHORS: Record<string, { x: number; y: number }> = {
  protocol: { x: 57, y: 14 },
  intents: { x: 68, y: 44 },
  ironclaw: { x: 20, y: 30 },
  cloud: { x: 82, y: 48 },
  market: { x: 40, y: 78 },
  nearcom: { x: 7, y: 52 },
};
// Centro vertical de cada cubo (top→bottom) en unidades de columna: el ápice
// mide 62 y cada cubo ~95 de paso. El tag va a la derecha de la columna.
const cubeAnchor = (i: number) => ({ x: 57, y: ((78 + i * 95) / STAGE_H) * 100 });

type Hover =
  | { kind: "layer"; key: "protocol" | "intents" | "nearcom" }
  | { kind: "seg"; key: "ironclaw" | "cloud" | "market" }
  | { kind: "cube"; index: number }
  | null;

const SEG_KEYS = ["ironclaw", "cloud", "market"] as const;

// El orden narrativo del build-up = el orden de las paradas del rail.
const STAGE_ORDER: readonly StackKey[] = [
  "protocol",
  "intents",
  "ironclaw",
  "cloud",
  "market",
  "nearcom",
];

// El z-layering de la columna: el cubo de ARRIBA es la capa más alta de todo
// el ensamble y el de ABAJO la más baja. La columna se pinta DOS veces — los
// cubos 3–5 debajo de los anillos, los 0–2 encima — y las máscaras de los
// anillos (que ya recortan el canal de la columna) hacen que las dos mitades
// calcen con la comp madre. Los ids duplicados de gradientes no molestan:
// las dos instancias definen exactamente lo mismo.
const HIDE_UPPER_CUBES =
  '[&_[data-stack-cube="0"]]:hidden [&_[data-stack-cube="1"]]:hidden [&_[data-stack-cube="2"]]:hidden';
const HIDE_LOWER_CUBES =
  '[&_[data-stack-cube="3"]]:hidden [&_[data-stack-cube="4"]]:hidden [&_[data-stack-cube="5"]]:hidden';

export default function NearStack() {
  // La parada activa del recorrido pineado: -1 = todavía no lockeó (los seis
  // colapsados y solo la columna en escena), 0..5 = STAGE_ORDER.
  const [scrollIdx, setScrollIdx] = useState(-1);
  const [hover, setHover] = useState<Hover>(null);
  // false = fallback (SSR, mobile, reduced-motion): todo verde, todo
  // expandido. true = scroll-scene pineada de desktop.
  const [enhanced, setEnhanced] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  // Sticky track (nunca pin:true — regla del repo): la sección es un tramo
  // alto con un viewport sticky adentro. Al llegar el tope de la sección al
  // tope del frame, la pantalla "lockea" y el progreso del tramo se reparte
  // en seis rebanadas — una por caja del rail. Volver por encima del start
  // colapsa todo de nuevo.
  const rootRef = useMotionScope<HTMLElement>(({ scope, motionOk, isDesktop }) => {
    if (!motionOk || !isDesktop) return;
    setEnhanced(true);
    scope.dataset.mode = "track";
    ScrollTrigger.create({
      trigger: scope,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) =>
        setScrollIdx(Math.min(STAGE_ORDER.length - 1, Math.floor(self.progress * STAGE_ORDER.length))),
      onLeaveBack: () => setScrollIdx(-1),
    });
    return () => {
      setEnhanced(false);
      delete scope.dataset.mode;
    };
  });

  const scrollKey: StackKey | null = scrollIdx >= 0 ? STAGE_ORDER[scrollIdx] : null;

  const hoverTarget: StackKey | null = hover
    ? hover.kind === "cube"
      ? "protocol"
      : hover.key
    : null;

  // La escena es un BUILD-UP: cada parada del rail AGREGA su capa y las
  // anteriores se quedan; las capas que todavía no llegaron están OCULTAS del
  // todo — no wireframe. Antes del lock (scrollIdx -1) solo está la columna.
  // En fallback (mobile/reduced-motion) está el ensamble completo.
  const stage = enhanced ? scrollIdx : STAGE_ORDER.length - 1;
  const showIntents = stage >= 1;
  const showAi = stage >= 2;
  const showNearcom = stage >= 5;

  // Con hover, SOLO lo hovereado va verde y el resto de lo visible cae a
  // wireframe. Sin hover, lo acumulado va verde — salvo el anillo de AI
  // mientras se recorren sus tres productos: ahí solo el activo va verde y
  // sus dos hermanos quedan en wireframe (los stills de referencia). Recién
  // en near.com el anillo completo queda verde.
  const litColumn = hover ? hoverTarget === "protocol" : true;
  const litIntents = showIntents && (hover ? hoverTarget === "intents" : true);
  const litNearcom = showNearcom && (hover ? hoverTarget === "nearcom" : true);
  const litSeg: string | null = !showAi
    ? null
    : hover
      ? (SEG_KEYS.find((k) => k === hoverTarget) ?? null)
      : stage >= 5
        ? "all"
        : (SEG_KEYS.find((k) => k === scrollKey) ?? "all");

  // Los grupos internos del arte (segmentos de AI, cubos de la columna) no son
  // props de los componentes generados: se manejan imperativo sobre los hooks
  // data-* con transiciones inline. Es la mitad "no declarativa" del estado y
  // vive toda en este efecto.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    stage.querySelectorAll<SVGGElement>("[data-ai-green] [data-stack-seg]").forEach((g) => {
      g.style.transition = "opacity 300ms";
      g.style.opacity = litSeg === "all" || g.dataset.stackSeg === litSeg ? "1" : "0";
    });
    // El split: hover sobre la columna la parte en sus seis cubos (verde y
    // wireframe a la vez — comparten geometría y orden de grupos).
    const split = hover?.kind === "cube" || (hover?.kind === "layer" && hover.key === "protocol");
    stage.querySelectorAll<SVGGElement>("[data-stack-cube]").forEach((g) => {
      const i = Number(g.dataset.stackCube);
      g.style.transform = split ? `translateY(${((i - 2.5) * 16).toFixed(0)}px)` : "translateY(0px)";
    });
  }, [litSeg, hover]);

  /* ── Hover por delegación: un solo par de handlers sobre el stage ──────── */

  const onOver = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const t = e.target as Element;
    const layerEl = t.closest("[data-stack-layer]");
    const layer = layerEl?.getAttribute("data-stack-layer");
    const cube = t.closest("[data-stack-cube]");
    const seg = t.closest("[data-stack-seg]");
    if (layer === "protocol" && cube) {
      setHover({ kind: "cube", index: Number(cube.getAttribute("data-stack-cube")) });
    } else if (layer === "ai" && seg) {
      setHover({
        kind: "seg",
        key: seg.getAttribute("data-stack-seg") as "ironclaw" | "cloud" | "market",
      });
    } else if (layer === "protocol" || layer === "intents" || layer === "nearcom") {
      setHover({ kind: "layer", key: layer });
    } else {
      // El puntero está sobre el fondo entre piezas.
      setHover(null);
    }
  };
  const onLeave = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") setHover(null);
  };

  // El tag visible: solo con hover, pegado a la pieza encendida.
  const tag = hover
    ? hover.kind === "cube"
      ? { label: PROTOCOL_FEATURES[hover.index], ...cubeAnchor(hover.index) }
      : hover.kind === "seg"
        ? { label: SEG_NAMES[hover.key], ...TAG_ANCHORS[hover.key] }
        : {
            label:
              hover.key === "protocol"
                ? "NEAR Protocol"
                : hover.key === "intents"
                  ? "NEAR Intents"
                  : "near.com",
            ...TAG_ANCHORS[hover.key],
          }
    : null;

  /* ── Capas: wrapper posicionado + wireframe debajo + verde encima ──────── */

  const layerStyle = (k: keyof typeof POS) => ({
    left: pct(POS[k].x, STAGE_W),
    top: pct(POS[k].y, STAGE_H),
    width: pct(POS[k].w, STAGE_W),
  });
  // Los paths son el área de hit, no la caja del wrapper: sin esto la cáscara
  // exterior (que abarca todo el stage) se tragaría el hover de todo lo demás.
  // Una capa que todavía no llegó al build-up está oculta Y sin hit-area.
  const layerClass = (visible: boolean) =>
    `pointer-events-none absolute transition-[opacity,transform] duration-500 motion-reduce:transition-none ${
      visible
        ? "translate-y-0 opacity-100 [&_path]:pointer-events-auto"
        : "translate-y-4 opacity-0"
    }`;
  const greenClass = (lit: boolean) =>
    `absolute left-0 top-0 w-full transition-opacity duration-300 motion-reduce:transition-none ${lit ? "opacity-100" : "opacity-0"}`;

  const expanded = (key: StackKey) => !enhanced || scrollKey === key;

  return (
    // El track: en modo pineado la sección mide 100svh de viewport + una
    // rebanada de scroll por caja. Sin overflow-hidden en ningún ancestro —
    // mataría el sticky (misma trampa de siempre).
    <section
      ref={rootRef}
      className="group/stack bg-ink text-cream data-[mode=track]:h-[400svh]"
    >
      {/* El viewport sticky: lockea cuando el tope de la sección toca el tope
          del frame, con TODO adentro (título, arte y rail) centrado y entero
          en pantalla — nada se recorta en ningún punto del recorrido. */}
      <div className="group-data-[mode=track]/stack:sticky group-data-[mode=track]/stack:top-0 group-data-[mode=track]/stack:flex group-data-[mode=track]/stack:h-svh group-data-[mode=track]/stack:flex-col group-data-[mode=track]/stack:justify-center">
        <Container className="flex w-full flex-col gap-14 pb-32 pt-32 group-data-[mode=track]/stack:gap-8 group-data-[mode=track]/stack:pb-0 group-data-[mode=track]/stack:pt-0 lg:gap-20 lg:group-data-[mode=track]/stack:gap-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <h2 className="text-h1 text-pretty">
            The NEAR <Accent>Stack</Accent>
          </h2>
          <p className="max-w-[26ch] text-h3 text-cream/70 text-balance">
            Open infrastructure{" "}
            <span
              aria-hidden="true"
              className="inline-block size-[0.78em] translate-y-[0.06em] rounded-full"
              style={{
                backgroundImage:
                  "linear-gradient(to bottom right, var(--near-teal), var(--near-green-accent), var(--near-teal))",
              }}
            />{" "}
            powering the{" "}
            <span
              aria-hidden="true"
              className="inline-block size-[0.72em] translate-y-[0.04em] rotate-45 rounded-[0.12em] bg-near-green-accent"
            />{" "}
            agent economy
          </p>
        </div>

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          {/* El arte. En lg el stage se dimensiona POR ALTURA (64svh — un 20%
              menos que la pasada anterior — con el aspect dando el ancho):
              como vive dentro del viewport pineado, el ensamble entero queda
              siempre en pantalla, de punta a punta. */}
          <div>
            <div
              ref={stageRef}
              onPointerOver={onOver}
              onPointerLeave={onLeave}
              className="relative mx-auto aspect-[695/650] w-full max-w-[420px] lg:h-[64svh] lg:w-auto lg:max-w-full"
            >
              {/* Apilado: mitad BAJA de la columna (cubos 3–5) al fondo,
                  anillos encima (sus máscaras recortan el canal de la
                  columna), y la mitad ALTA (cubos 0–2) por encima de todo —
                  el cubo de arriba es la capa más alta del ensamble. */}
              <div
                data-stack-layer="protocol"
                className={`${layerClass(true)} ${HIDE_UPPER_CUBES}`}
                style={layerStyle("column")}
              >
                <ColumnWire className="w-full" />
                <ColumnGreen className={greenClass(litColumn)} />
              </div>
              <div
                data-stack-layer="intents"
                className={layerClass(showIntents)}
                style={layerStyle("intents")}
              >
                <IntentsWire className="w-full" />
                <IntentsGreen className={greenClass(litIntents)} />
              </div>
              <div data-stack-layer="ai" className={layerClass(showAi)} style={layerStyle("ai")}>
                <AiRingWire className="w-full" />
                {/* La verde de AI queda siempre montada y visible a nivel svg:
                    la iluminación por segmento la maneja el efecto de arriba
                    grupo por grupo. */}
                <div data-ai-green>
                  <AiRingGreen className="absolute left-0 top-0 w-full" />
                </div>
              </div>
              <div
                data-stack-layer="nearcom"
                className={layerClass(showNearcom)}
                style={layerStyle("nearcom")}
              >
                <NearcomWire className="w-full" />
                <NearcomGreen className={greenClass(litNearcom)} />
              </div>
              <div
                data-stack-layer="protocol"
                className={`${layerClass(true)} ${HIDE_LOWER_CUBES}`}
                style={layerStyle("column")}
              >
                <ColumnWire className="w-full" />
                <ColumnGreen className={greenClass(litColumn)} />
              </div>

              {/* El bubble tag de la pieza hovereada. Decorativo: el nombre
                  accesible vive en el rail. */}
              {tag && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute z-10 flex -translate-y-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-cream/25 bg-ink/85 px-2.5 py-1 backdrop-blur-sm"
                  style={{ left: `${tag.x}%`, top: `${tag.y}%` }}
                >
                  <span className="size-2 rounded-full bg-cta-mint" />
                  <span className="text-caption text-cream">{tag.label}</span>
                </div>
              )}
            </div>
          </div>

          {/* El rail. Cada slot con data-stack-slot es una parada de la
              reading line; los min-h le dan aire al recorrido para que el
              scroll tenga dónde contar la secuencia. */}
          <div className="flex w-full flex-col gap-2">
            <RailBlock block={PROTOCOL_BLOCK} index="01" expanded={expanded("protocol")} />
            <RailBlock block={INTENTS_BLOCK} index="02" expanded={expanded("intents")} />

            {/* NEAR AI: heading + intro siempre visibles, y un sub-bloque
                expandible por producto — cada uno es su propia parada de
                scroll y enciende su segmento del anillo. */}
            <div className="rounded-2xl border border-cream/12 px-4 pb-3 pt-3">
              <p className="text-h4 text-cream">
                <sup className="mr-2 align-super text-caption text-cream/30">03</sup>
                {AI_BLOCK.name}
              </p>
              <p className="mt-2 max-w-[46ch] text-body-sm text-cream/60 text-pretty">
                {AI_BLOCK.intro}
              </p>
              <div className="mt-3 flex flex-col gap-1.5">
                {AI_BLOCK.subs.map((sub) => (
                  <RailBlock key={sub.key} block={sub} nested expanded={expanded(sub.key)} />
                ))}
              </div>
              <a
                href={AI_BLOCK.link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-caption text-cta-mint transition-colors duration-200 hover:text-cta-lime motion-reduce:transition-none"
              >
                {AI_BLOCK.link.label} <span aria-hidden="true">→</span>
              </a>
            </div>

            <RailBlock block={NEARCOM_BLOCK} index="04" expanded={expanded("nearcom")} />
          </div>
        </div>
        </Container>
      </div>
    </section>
  );
}

/* ── Una parada del rail: fila con panel colapsable ───────────────────────── */

function RailBlock({
  block,
  index,
  nested = false,
  expanded,
}: {
  block: StackLeaf;
  index?: string;
  nested?: boolean;
  expanded: boolean;
}) {
  return (
    // Caja compacta: colapsada es SOLO la barra de título con su borde,
    // pegada a sus vecinas (el gap del rail es el único aire). El recorrido
    // de scroll ya no vive acá — lo da el track pineado de la sección.
    <div
      data-open={expanded}
      className={`group/blk ${
        nested ? "rounded-xl border border-cream/10" : "rounded-2xl border border-cream/12"
      } transition-colors duration-300 data-[open=true]:border-cream/30 motion-reduce:transition-none`}
    >
      <div className={nested ? "px-3.5 py-2" : "px-4 py-2.5"}>
        <p className={nested ? "text-body text-cream/80" : "text-h4 text-cream/45"}>
          {index && (
            <sup className="mr-2 align-super text-caption text-cream/30 transition-colors duration-300 group-data-[open=true]/blk:text-cta-mint motion-reduce:transition-none">
              {index}
            </sup>
          )}
          <span className="transition-colors duration-300 group-data-[open=true]/blk:text-cream motion-reduce:transition-none">
            {block.name}
          </span>
        </p>
      </div>
      {/* grid-rows 0fr↔1fr: el navegador interpola la altura sin medir nada. */}
      <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out group-data-[open=true]/blk:grid-rows-[1fr] motion-reduce:transition-none">
        <div className="overflow-hidden">
          <div className={`flex flex-col gap-2 ${nested ? "px-3.5 pb-2.5" : "px-4 pb-3"}`}>
            <p className="max-w-[46ch] text-body-sm text-cream/60 text-pretty">{block.body}</p>
            {block.link && (
              <a
                href={block.link.href}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={expanded ? 0 : -1}
                className="text-caption text-cta-mint transition-colors duration-200 hover:text-cta-lime motion-reduce:transition-none"
              >
                {block.link.label} <span aria-hidden="true">→</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
