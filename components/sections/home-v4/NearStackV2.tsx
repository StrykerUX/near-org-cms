"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { gsap, ScrollTrigger } from "@/components/primitives/motion/gsapClient";
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

/* ── El mark de NEAR, acostado sobre la cara superior del cubo de arriba ─── */

// La cara superior del cubo 0 en el espacio del svg de la columna (104×634)
// es un rombo: L (izquierda) más la base U = L→T (arista trasera, sube a la
// derecha) y V = L→B (arista delantera, baja a la derecha). Proyectar el mark
// con esa base afín — su eje X por U, su eje Y por V — ES apoyarlo en el
// plano de la cara, con la perspectiva del iso ya horneada en las aristas.
const FACE_L = { x: 0.305, y: 30.865 };
const FACE_U = { x: 51.28, y: -30.56 }; // L→T
const FACE_V = { x: 51.28, y: 31.04 }; // L→B
// El viewBox del mark (copiado de public/prototype/v2/near-mark.svg) y qué
// fracción de la cara ocupa, centrado (inset = (1-escala)/2 por lado).
const MARK_VB = { x: 108, y: 108, size: 351 };
const MARK_SCALE = 0.56;
const MARK_TRANSFORM = (() => {
  const inset = (1 - MARK_SCALE) / 2;
  const a = (FACE_U.x * MARK_SCALE) / MARK_VB.size;
  const b = (FACE_U.y * MARK_SCALE) / MARK_VB.size;
  const c = (FACE_V.x * MARK_SCALE) / MARK_VB.size;
  const d = (FACE_V.y * MARK_SCALE) / MARK_VB.size;
  const e = FACE_L.x + (FACE_U.x + FACE_V.x) * inset - a * MARK_VB.x - c * MARK_VB.y;
  const f = FACE_L.y + (FACE_U.y + FACE_V.y) * inset - b * MARK_VB.x - d * MARK_VB.y;
  return `matrix(${a} ${b} ${c} ${d} ${e} ${f})`;
})();
const NEAR_MARK_D =
  "m421.61,108c-13,0-25.07,6.74-31.88,17.82l-73.37,108.93c-2.39,3.59-1.42,8.43,2.17,10.82,2.91,1.94,6.76,1.7,9.41-.58l72.22-62.64c1.2-1.08,3.05-.97,4.13.23.49.55.75,1.26.75,1.99v196.12c0,1.62-1.31,2.92-2.93,2.92-.87,0-1.69-.38-2.24-1.05L181.56,121.24c-7.11-8.39-17.55-13.23-28.54-13.24h-7.63c-20.65,0-37.39,16.74-37.39,37.39v276.22c0,20.65,16.74,37.39,37.39,37.39,13,0,25.07-6.74,31.88-17.82l73.37-108.93c2.39-3.59,1.42-8.43-2.17-10.82-2.91-1.94-6.76-1.7-9.41.58l-72.22,62.64c-1.2,1.08-3.05.97-4.13-.23-.49-.55-.75-1.26-.74-1.99v-196.17c0-1.62,1.31-2.92,2.93-2.92.86,0,1.69.38,2.24,1.05l218.28,261.37c7.11,8.39,17.55,13.23,28.54,13.24h7.63c20.65.01,37.4-16.72,37.42-37.37V145.39c0-20.65-16.74-37.39-37.39-37.39Z";

/* ── Las sombras de la columna, como elemento propio ──────────────────────── */

// Los 7 parches de sombra que la columna proyecta sobre los anillos venían
// horneados en los svg verdes (multiply + pattern). En V2 los horneados se
// apagan ([data-stack-noshadow] en el stage) y estos son SU reemplazo 1:1 —
// mismas coords, mismos patterns (url(#…) resuelve contra los defs de las
// instancias ya montadas). data-shadow-when separa los de la BASE (los
// proyectan los cubos de abajo) de los del TOPE (los de arriba): el build
// funde cada grupo cuando su bloque aterriza; sin bloque encima, sin sombra.
// El wrapper exterior es del tween (autoAlpha); el interior conserva el
// blend y la opacidad de fábrica.
const COLUMN_SHADOWS = {
  ai: {
    viewBox: "0 0 546 443",
    base: [{ x: 185.14, y: 281.23, w: 175.2, h: 161.28, fill: "ag-pattern0_11_498", op: 0.46 }],
    top: [{ x: 176.98, y: -49.0098, w: 191.52, h: 166.56, fill: "ag-pattern1_11_498", op: 0.46 }],
  },
  intents: {
    viewBox: "0 0 371 248",
    base: [
      { x: 97.36, y: 109.49, w: 108.96, h: 137.76, fill: "ig-pattern0_11_549", op: 0.42 },
      { x: 163.6, y: 109.49, w: 108.96, h: 137.76, fill: "ig-pattern1_11_549", op: 0.42 },
    ],
    top: [{ x: 89.55, y: -44.1899, w: 191.04, h: 161.76, fill: "ig-pattern2_11_549", op: 0.46 }],
  },
  nearcom: {
    viewBox: "0 0 695 604",
    base: [{ x: 239.7, y: 442.146, w: 175.2, h: 161.76, fill: "ng-pattern0_11_436", op: 0.46 }],
    top: [{ x: 231.463, y: -46.0137, w: 191.52, h: 174.72, fill: "ng-pattern1_11_436", op: 0.46 }],
  },
} as const;

function ColumnShadows({ ring, className }: { ring: keyof typeof COLUMN_SHADOWS; className: string }) {
  const s = COLUMN_SHADOWS[ring];
  return (
    <svg viewBox={s.viewBox} aria-hidden="true" className={className}>
      {(["base", "top"] as const).map((when) =>
        s[when].map((r) => (
          <g key={`${when}-${r.fill}`} data-shadow-when={when}>
            <g style={{ mixBlendMode: "multiply" }} opacity={r.op}>
              <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={`url(#${r.fill})`} />
            </g>
          </g>
        ))
      )}
    </svg>
  );
}

/* ── Bubble tags: ancla en % del stage por pieza encendida ────────────────── */

const SEG_NAMES: Record<string, string> = {
  ironclaw: "IronClaw",
  cloud: "NEAR AI Cloud",
  market: "Agent Market",
};

// El bubble tag no tiene anclas por pieza: va CLAVADO al cursor (se posiciona
// imperativo en cada pointermove, sin re-render), como un cursor label.

type Hover =
  | { kind: "layer"; key: "protocol" | "intents" | "nearcom" }
  | { kind: "seg"; key: "ironclaw" | "cloud" | "market" }
  | { kind: "cube"; index: number }
  | null;

const SEG_KEYS = ["ironclaw", "cloud", "market"] as const;

// El orden narrativo del build-up = el orden de las paradas del rail.
// "ai" es la llegada al anillo completo (los TRES productos encendidos a la
// vez); recién después el recorrido entra a los tres productos de a uno.
const STAGE_ORDER: readonly StackKey[] = [
  "protocol",
  "intents",
  "ai",
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

export default function NearStackV2() {
  // La parada activa del recorrido pineado: -1 = todavía no lockeó (los seis
  // colapsados y solo la columna en escena), 0..5 = STAGE_ORDER.
  const [scrollIdx, setScrollIdx] = useState(-1);
  const [hover, setHover] = useState<Hover>(null);
  // false = fallback (SSR, mobile, reduced-motion): todo verde, todo
  // expandido. true = scroll-scene pineada de desktop.
  const [enhanced, setEnhanced] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  // Identidad del salto por click activo: >0 congela el estado derivado del
  // scroll (guard en onUpdate) hasta que el tween aterriza o lo interrumpen.
  // Es un id y no un boolean para que un segundo click durante el salto no
  // pueda "aterrizar" el salto viejo por encima del nuevo.
  const jumpRef = useRef(0);
  const jumpSeq = useRef(0);
  // false MIENTRAS corre el build-in de la columna: el efecto de hover no
  // escribe sobre los cubos en ese lapso (pisaría el tween de entrada).
  // Arranca en true para que el fallback sin escena (mobile/reduced-motion)
  // nunca quede con los cubos sin gobernar.
  const builtRef = useRef(true);

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
      onUpdate: (self) => {
        if (jumpRef.current) return;
        setScrollIdx(Math.min(STAGE_ORDER.length - 1, Math.floor(self.progress * STAGE_ORDER.length)));
      },
      onLeaveBack: () => {
        if (!jumpRef.current) setScrollIdx(-1);
      },
    });
    // La columna no ESTÁ al llegar: se CONSTRUYE — los seis cubos suben a
    // escena de abajo hacia arriba (una sola vez) cuando la sección entra al
    // viewport. Cada índice agrupa sus 4 instancias (wire+verde × las dos
    // mitades del z-layering) más el mark, así todo el cubo entra junto.
    // Al terminar, clearProps deja los inline limpios para que el split y la
    // atenuación del hover escriban sobre nodos sin residuos del tween.
    // Cada cubo BAJA a su lugar (y negativa → 0) fundiendo a escena, y una
    // vez asentado no se vuelve a mover: cada índice tiene UN solo tween y
    // su y termina exactamente en 0, sin rebote (power2.out, sin back/elastic).
    builtRef.current = false;
    const cubes = scope.querySelectorAll<SVGGElement>("[data-stack-cube]");
    // transition: none INLINE mientras dura el build: los grupos de cubo traen
    // una transition CSS de transform (la del split por hover) que interceptaba
    // y RE-EASEABA cada frame que GSAP escribía — la caída lineal llegaba al
    // ojo emborronada y con un easing que nadie pidió. Se restaura al final
    // junto con el resto (clearProps).
    gsap.set(cubes, { autoAlpha: 0, y: -90, transition: "none" });
    const buildTl = gsap.timeline({
      // "top 30%" y no antes: al 75% el arte todavía asomaba apenas por el
      // borde de abajo y el build pasaba fuera de cámara. Acá la escena ya
      // está bien adentro del frame cuando arranca (y si el usuario llega
      // rápido al lock, el trigger dispara igual a más tardar en el pin).
      scrollTrigger: { trigger: scope, start: "top 30%", once: true },
      onComplete: () => {
        builtRef.current = true;
        gsap.set(cubes, { clearProps: "opacity,visibility,transform,transition" });
      },
    });
    // Secuencial DE VERDAD, no ola: cada cubo arranca cuando el anterior va
    // por ~2/3 de su caída — se lee un aterrizaje por vez, de abajo arriba.
    // Caída y fundido SIMULTÁNEOS pero con perfiles propios. La caída va en
    // DOS tweens encadenados porque ninguna ease de fábrica hace lo pedido
    // (velocidad constante y freno SOLO al final): 72px lineales a 200px/s y
    // después los últimos 18px en power2.out arrancando exactamente a esos
    // mismos 200px/s (v₀ = 2·d/T = 2·18/0.18) — un movimiento continuo que
    // recién desacelera al aterrizar. El fundido corre aparte y más corto:
    // el cubo ya es visible en plena caída lineal.
    for (let i = 5; i >= 0; i--) {
      const nodes = scope.querySelectorAll<SVGGElement>(`[data-stack-cube="${i}"]`);
      const at = (5 - i) * 0.3;
      buildTl.to(nodes, { y: -18, duration: 0.36, ease: "none" }, at);
      buildTl.to(nodes, { y: 0, duration: 0.18, ease: "power2.out" }, at + 0.36);
      // 0.22s: totalmente visible a menos de la mitad de la caída — el fade
      // ocurre ARRIBA y el resto del recorrido se ve entero.
      buildTl.to(nodes, { autoAlpha: 1, duration: 0.22, ease: "sine.inOut" }, at);
    }
    // Las sombras de la columna esperan a su bloque: sin bloque encima, sin
    // sombra. Las de la BASE funden cuando aterrizan los cubos de abajo
    // (cubo 4 clava a ~0.84s) y las del TOPE con los de arriba (cubo 0 a
    // ~2.04s). Componen multiplicativamente con la visibilidad del anillo,
    // así que solo se ven cuando SU anillo además está en escena.
    gsap.set(scope.querySelectorAll("[data-shadow-when]"), { autoAlpha: 0 });
    buildTl.to(
      scope.querySelectorAll('[data-shadow-when="base"]'),
      { autoAlpha: 1, duration: 0.35, ease: "sine.inOut" },
      0.9
    );
    buildTl.to(
      scope.querySelectorAll('[data-shadow-when="top"]'),
      { autoAlpha: 1, duration: 0.35, ease: "sine.inOut" },
      2.0
    );
    // 30% más rápido, pedido — por timeScale y no reescribiendo duraciones:
    // los números de arriba siguen siendo la partitura legible (velocidad
    // constante 200px/s, aterrizajes, sombras) y el ritmo se ajusta acá.
    buildTl.timeScale(1.3);
    return () => {
      builtRef.current = true;
      setEnhanced(false);
      delete scope.dataset.mode;
    };
  });

  const scrollKey: StackKey | null = scrollIdx >= 0 ? STAGE_ORDER[scrollIdx] : null;

  // Click = saltar a la parada: scrollea la página al centro de la rebanada
  // de esa caja dentro del track, pero el estado NO viaja con el scroll — se
  // setea DIRECTO a la parada destino y el derivado del scroll queda
  // CONGELADO (guard en onUpdate) mientras el tween aterriza. Con un solo
  // cambio de estado, cada elemento hace su propia transición una única vez
  // (las capas que faltan funden a escena, las que sobran se apagan, el
  // panel viejo cierra y el nuevo abre) — sin recorrer paradas intermedias.
  const goTo = (key: StackKey) => {
    const section = rootRef.current;
    if (!section || !enhanced) return;
    const i = STAGE_ORDER.indexOf(key);
    const top = section.getBoundingClientRect().top + window.scrollY;
    const span = section.offsetHeight - window.innerHeight;
    const id = ++jumpSeq.current;
    jumpRef.current = id;
    setScrollIdx(i);
    // land corre también en onInterrupt (otro click u overwrite): devuelve el
    // control al scroll, pero solo si ESTE salto sigue siendo el activo.
    const land = () => {
      if (jumpRef.current === id) jumpRef.current = 0;
    };
    gsap.to(document.scrollingElement ?? document.documentElement, {
      scrollTop: top + ((i + 0.5) / STAGE_ORDER.length) * span,
      duration: 0.6,
      ease: "power2.inOut",
      overwrite: "auto",
      onComplete: land,
      onInterrupt: land,
    });
  };

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
  const showNearcom = stage >= 6;

  // Hover sobre CUALQUIER pieza (columna incluida): solo lo hovereado verde,
  // el resto de lo visible cae a wireframe — fill negro y stroke blanco,
  // nunca color translúcido. (Antes la columna era especial: dejaba a las
  // demás en verde atenuado al 15% de fill, y ese velo dejaba VER el color a
  // través — pedido que caigan a wire como con el resto de los hovers.)
  // Sin hover, lo acumulado va verde — al LLEGAR a NEAR AI el anillo entero
  // se enciende, después cada producto enciende solo su pieza, y near.com
  // vuelve a encender todo.
  const litColumn = hover ? hoverTarget === "protocol" : true;
  const litIntents = showIntents && (hover ? hoverTarget === "intents" : true);
  const litNearcom = showNearcom && (hover ? hoverTarget === "nearcom" : true);
  const litSeg: string | null = !showAi
    ? null
    : hover
      ? (SEG_KEYS.find((k) => k === hoverTarget) ?? null)
      : stage === 2 || stage >= 6
        ? "all"
        : (SEG_KEYS.find((k) => k === scrollKey) ?? "all");

  // Los grupos internos del arte (segmentos de AI, cubos de la columna) no son
  // props de los componentes generados: se manejan imperativo sobre los hooks
  // data-* con transiciones inline. Es la mitad "no declarativa" del estado y
  // vive toda en este efecto.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    // Hover sobre UN producto de AI: los hermanos no caen a wireframe seco —
    // se ATENÚAN al 30% conservando algo de color, igual que los cubos
    // vecinos de la columna cuando se hoverea uno (pedido). En los demás
    // estados (paradas del scroll, hover en otras capas) siguen apagándose.
    const segHover = hover?.kind === "seg";
    stage.querySelectorAll<SVGGElement>("[data-ai-green] [data-stack-seg]").forEach((g) => {
      g.style.transition = "opacity 300ms";
      g.style.opacity =
        litSeg === "all" || g.dataset.stackSeg === litSeg ? "1" : segHover ? "0.3" : "0";
    });
    // El split: hover sobre la columna la parte en sus seis cubos (verde y
    // wireframe a la vez — comparten geometría y orden de grupos). Con un
    // cubo específico hovereado, sus cinco hermanos se ATENÚAN — el foco es
    // el feature bajo el cursor. La transición va inline porque también
    // gobierna opacity, que la clase generada no cubre.
    const split = hover?.kind === "cube" || (hover?.kind === "layer" && hover.key === "protocol");
    const hoveredCube = hover?.kind === "cube" ? hover.index : null;
    // Con el build-in de la columna en curso, los cubos son del tween de
    // entrada — escribirles transform/opacity acá lo pisaría a mitad de vuelo.
    if (!builtRef.current) return;
    stage.querySelectorAll<SVGGElement>("[data-stack-cube]").forEach((g) => {
      const i = Number(g.dataset.stackCube);
      g.style.transition = "transform .38s cubic-bezier(.65,0,.35,1), opacity .25s";
      g.style.transform = split ? `translateY(${((i - 2.5) * 32).toFixed(0)}px)` : "translateY(0px)";
      // El mark de NEAR viaja con el cubo 0 (mismo data-stack-cube) pero NO se
      // atenúa con él: queda negro pleno mientras sus vecinos caen al 30%.
      g.style.opacity =
        hoveredCube !== null && i !== hoveredCube && !("stackLogo" in g.dataset) ? "0.3" : "1";
    });
    // El sheen (la luz recorriendo el contorno de la pieza hovereada) quedó
    // FUERA — pedido. Sus paths siguen en el arte generado con opacity 0 de
    // fábrica; si vuelve, el toggle por pieza vivía acá (ver historia git).
  }, [litSeg, hover]);

  /* ── Hover por delegación: un solo par de handlers sobre el stage ──────── */

  // Modo columna: con el hover YA en la columna, moverse en vertical recorre
  // sus seis cubos por POSICIÓN Y del puntero — dentro del corredor
  // horizontal de la columna ninguna otra pieza puede robar el hover (los
  // anillos cruzan por delante y por detrás justo ahí, y el split abre
  // huecos entre cubos). Devuelve true si capturó el evento.
  const columnCorridor = (e: React.PointerEvent): boolean => {
    const inColumn =
      hover?.kind === "cube" || (hover?.kind === "layer" && hover.key === "protocol");
    if (!inColumn) return false;
    const col = stageRef.current?.querySelector('[data-stack-layer="protocol"]');
    if (!col) return false;
    const r = col.getBoundingClientRect();
    if (e.clientX < r.left - 16 || e.clientX > r.right + 16) return false;
    // Centros de los seis cubos en pantalla, CON el split aplicado (el
    // translateY del split va en unidades del svg → escala con r.height).
    const s = r.height / 634;
    let best = 0;
    let bestD = Infinity;
    for (let i = 0; i < 6; i++) {
      const c = r.top + (78 + 95 * i + (i - 2.5) * 32) * s;
      const d = Math.abs(e.clientY - c);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    }
    // Demasiado lejos por arriba/abajo: soltar el modo columna.
    if (bestD > 120 * s) return false;
    setHover({ kind: "cube", index: best });
    return true;
  };

  const onOver = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    if (columnCorridor(e)) return;
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

  // El contenido del tag: solo con hover. Los cubos de la columna llevan
  // ADEMÁS su texto secundario (el resumen del claim), y ahí el tag deja de
  // ser pill y pasa a caja. La POSICIÓN la escribe onMove directo sobre el
  // nodo — un setState por pointermove sería un re-render por pixel.
  const tag = hover
    ? hover.kind === "cube"
      ? {
          label: PROTOCOL_FEATURES[hover.index].name,
          sub: PROTOCOL_FEATURES[hover.index].sub,
          desc: PROTOCOL_FEATURES[hover.index].desc,
        }
      : hover.kind === "seg"
        ? // Los productos de AI llevan su copy explicativa en la caja, igual
          // que los cubos de la columna.
          {
            label: SEG_NAMES[hover.key],
            desc: AI_BLOCK.subs.find((s) => s.key === hover.key)?.body,
          }
        : {
            label:
              hover.key === "protocol"
                ? "NEAR Protocol"
                : hover.key === "intents"
                  ? "NEAR Intents"
                  : "near.com",
          }
    : null;

  // onMove escribe las coordenadas CRUDAS del cursor; el desplazamiento del
  // tag respecto de ese punto va por clases: la caja de los cubos se CENTRA
  // en el mouse, la pill se corre a la derecha.
  const tagRef = useRef<HTMLDivElement>(null);
  const onMove = (e: React.PointerEvent) => {
    const el = tagRef.current;
    const stage = stageRef.current;
    if (!el || !stage) return;
    const r = stage.getBoundingClientRect();
    el.style.left = `${e.clientX - r.left}px`;
    el.style.top = `${e.clientY - r.top}px`;
    // pointerover no dispara entre huecos del mismo elemento: el corredor de
    // la columna también se evalúa en cada move.
    if (e.pointerType === "mouse") columnCorridor(e);
  };

  // Click sobre el arte = mismo salto que clickear su panel: la pieza
  // clickeada pasa a ser la parada activa del track (y su panel se abre).
  const onStageClick = (e: React.MouseEvent) => {
    const t = e.target as Element;
    const layer = t.closest("[data-stack-layer]")?.getAttribute("data-stack-layer");
    const seg = t.closest("[data-stack-seg]")?.getAttribute("data-stack-seg");
    if (layer === "ai" && seg) goTo(seg as StackKey);
    else if (layer === "protocol") goTo("protocol");
    else if (layer === "intents" || layer === "nearcom") goTo(layer);
  };

  /* ── Capas: wrapper posicionado + wireframe debajo + verde encima ──────── */

  const layerStyle = (k: keyof typeof POS) => ({
    left: pct(POS[k].x, STAGE_W),
    top: pct(POS[k].y, STAGE_H),
    width: pct(POS[k].w, STAGE_W),
  });
  // Los paths son el área de hit, no la caja del wrapper: sin esto la cáscara
  // exterior (que abarca todo el stage) se tragaría el hover de todo lo demás.
  // Una capa que todavía no llegó al build-up está oculta Y sin hit-area.
  // Las capas SOLO funden, clavadas en su posición — nada de translate. Acá
  // hubo un bug dos veces: el offset de entrada era `translate-y-4`, que en
  // Tailwind v4 compila a la propiedad `translate` (NO `transform`), así que
  // ninguna transition-property lo cubría y el offset se aplicaba en un SNAP:
  // la capa saltaba 16px hacia abajo al inicio del fade de salida. Y como en
  // la entrada ese mismo snap la clavaba en 0 antes del fade, el "rise-in"
  // nunca animó de verdad — el offset solo aportaba el glitch.
  const layerClass = (visible: boolean) =>
    `pointer-events-none absolute transition-opacity duration-500 motion-reduce:transition-none [&_path]:transition-[fill-opacity,stroke-opacity] [&_path]:duration-300 ${
      visible ? "opacity-100 [&_path]:pointer-events-auto" : "opacity-0"
    }`;
  // Las copias de FONDO de los anillos (la divergencia de V2): mismas capas
  // pero pintadas DEBAJO de todos los cubos y con la máscara del canal
  // apagada (data-stack-unmask, regla en globals.css) — son el anillo
  // CONTINUO que se ve detrás de un cubo en vuelo. Con la columna completa
  // los cubos las tapan pixel por pixel, así que en reposo nada cambia.
  // Sin hit-area nunca: el hover en el canal es de los cubos.
  const backClass = (visible: boolean) =>
    `pointer-events-none absolute transition-opacity duration-500 motion-reduce:transition-none [&_path]:transition-[fill-opacity,stroke-opacity] [&_path]:duration-300 ${
      visible ? "opacity-100" : "opacity-0"
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
      className="group/stack bg-ink text-cream data-[mode=track]:h-[320svh]"
    >
      {/* El viewport sticky: lockea cuando el tope de la sección toca el tope
          del frame, con TODO adentro (título, arte y rail) centrado y entero
          en pantalla — nada se recorta en ningún punto del recorrido. */}
      {/* justify-START, no center: el headline queda anclado arriba y las
          cajas abren hacia ABAJO — nada de lo que se expande puede empujar
          al título. */}
      <div className="group-data-[mode=track]/stack:sticky group-data-[mode=track]/stack:top-0 group-data-[mode=track]/stack:flex group-data-[mode=track]/stack:h-svh group-data-[mode=track]/stack:flex-col group-data-[mode=track]/stack:justify-start">
        {/* h-full en modo track: sin altura definida acá, el flex-1 de la
            grilla y el 1fr de su fila no resuelven contra nada y todo vuelve
            a medirse por contenido — el arte se movía con cada panel. */}
        <Container className="flex w-full flex-col gap-14 pb-32 pt-32 group-data-[mode=track]/stack:h-full group-data-[mode=track]/stack:min-h-0 group-data-[mode=track]/stack:gap-8 group-data-[mode=track]/stack:pb-0 group-data-[mode=track]/stack:pt-[calc(var(--site-header-block)+2rem)] lg:gap-20 lg:group-data-[mode=track]/stack:gap-8">
        {/* En modo track el bloque de título sube respecto del centro del
            viewport pineado — pedido de Lawrence. */}
        <div className="flex flex-col items-center gap-1 text-center">
          <h2 className="text-h1 text-pretty">
            The NEAR <Accent>Stack</Accent>
          </h2>
          <p className="max-w-[34ch] text-body-lg text-cream/70 text-balance">
            Open infrastructure powering the agent economy
          </p>
        </div>

        {/* La grilla llena lo que queda del viewport pineado. El rail va
            self-start (top-justificado bajo el heading, crece hacia abajo);
            la celda del arte se estira y CENTRA el ensamble en vertical entre
            el fondo del texto de arriba y el fondo del frame. */}
        <div className="grid grid-cols-1 gap-12 group-data-[mode=track]/stack:min-h-0 group-data-[mode=track]/stack:flex-1 group-data-[mode=track]/stack:grid-rows-[minmax(0,1fr)] lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          {/* El arte. En lg el stage se dimensiona POR ALTURA (64svh — un 20%
              menos que la pasada anterior — con el aspect dando el ancho):
              como vive dentro del viewport pineado, el ensamble entero queda
              siempre en pantalla, de punta a punta. */}
          <div className="lg:flex lg:h-full lg:items-center lg:justify-center lg:self-stretch">
            <div
              ref={stageRef}
              data-stack-noshadow
              onPointerOver={onOver}
              onPointerMove={onMove}
              onPointerLeave={onLeave}
              onClick={onStageClick}
              className="relative mx-auto aspect-[695/650] w-full max-w-[340px] lg:h-[51svh] lg:w-auto lg:max-w-full [&_path]:cursor-pointer"
            >
              {/* Apilado V2: copias de fondo CONTINUAS de los anillos al
                  fondo de todo, mitad BAJA de la columna (cubos 3–5) encima,
                  anillos enmascarados encima (el frente que envuelve a la
                  columna), y la mitad ALTA (cubos 0–2) por encima de todo —
                  el cubo de arriba es la capa más alta del ensamble. */}
              {/* overflow-visible en las copias de fondo: el vértice superior
                  de la cáscara (y del brazo de ironclaw) vive en y NEGATIVA
                  del viewBox — la máscara horneada lo recortaba igual, pero
                  sin máscara el clip default del svg lo cortaba CHATO en vez
                  de terminar en punta. */}
              <div
                data-stack-unmask
                className={`${backClass(showIntents)}`}
                style={layerStyle("intents")}
              >
                <IntentsWire className="w-full overflow-visible" />
                <IntentsGreen className={`${greenClass(litIntents)} overflow-visible`} />
              </div>
              <div
                data-stack-unmask
                className={`${backClass(showAi)}`}
                style={layerStyle("ai")}
              >
                <AiRingWire className="w-full overflow-visible" />
                {/* data-ai-green también acá: el efecto de segmentos ilumina
                    TODAS las instancias, así el fondo y el frente del anillo
                    de AI siempre coinciden. */}
                <div data-ai-green>
                  <AiRingGreen className="absolute left-0 top-0 w-full overflow-visible" />
                </div>
              </div>
              <div
                data-stack-unmask
                className={`${backClass(showNearcom)}`}
                style={layerStyle("nearcom")}
              >
                <NearcomWire className="w-full overflow-visible" />
                <NearcomGreen className={`${greenClass(litNearcom)} overflow-visible`} />
              </div>
              {/* overflow-visible en los svg de la columna: al partirse, los
                  cubos de las puntas se corren FUERA del viewBox y el clip
                  default del svg los cortaba. */}
              <div
                data-stack-layer="protocol"
                className={`${layerClass(true)} ${HIDE_UPPER_CUBES}`}
                style={layerStyle("column")}
              >
                <ColumnWire className="w-full overflow-visible" />
                <ColumnGreen className={`${greenClass(litColumn)} overflow-visible`} />
              </div>
              {/* Cada sombra va en un wrapper hermano JUSTO DEBAJO de su
                  anillo: multiplica sobre la columna y el fondo (como la
                  horneada, que en el svg original se pintaba ANTES de los
                  paths del anillo) y los brazos frontales del anillo pintan
                  ENCIMA, limpios — la sombra nunca cae sobre lo que está
                  DELANTE de la columna. */}
              <div
                className={`${backClass(showIntents)}`}
                style={layerStyle("intents")}
              >
                <ColumnShadows ring="intents" className={greenClass(litIntents)} />
              </div>
              <div
                data-stack-layer="intents"
                className={`${layerClass(showIntents)}`}
                style={layerStyle("intents")}
              >
                <IntentsWire className="w-full" />
                <IntentsGreen className={greenClass(litIntents)} />
              </div>
              {/* Como su horneada, la sombra de AI no depende del lit por
                  segmento: visible siempre que la capa lo sea. */}
              <div
                className={`${backClass(showAi)}`}
                style={layerStyle("ai")}
              >
                <ColumnShadows ring="ai" className="absolute left-0 top-0 w-full" />
              </div>
              <div
                data-stack-layer="ai"
                className={`${layerClass(showAi)}`}
                style={layerStyle("ai")}
              >
                <AiRingWire className="w-full" />
                {/* La verde de AI queda siempre montada y visible a nivel svg:
                    la iluminación por segmento la maneja el efecto de arriba
                    grupo por grupo. */}
                <div data-ai-green>
                  <AiRingGreen className="absolute left-0 top-0 w-full" />
                </div>
              </div>
              <div
                className={`${backClass(showNearcom)}`}
                style={layerStyle("nearcom")}
              >
                <ColumnShadows ring="nearcom" className={greenClass(litNearcom)} />
              </div>
              <div
                data-stack-layer="nearcom"
                className={`${layerClass(showNearcom)}`}
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
                <ColumnWire className="w-full overflow-visible" />
                <ColumnGreen className={`${greenClass(litColumn)} overflow-visible`} />
                {/* El mark sobre la cara superior: mismo viewBox que la
                    columna y un g data-stack-cube="0" para que el split del
                    efecto lo mueva JUNTO al cubo de arriba. SIEMPRE visible y
                    negro pleno — no funde con el verde ni se atenúa cuando la
                    columna cae a wireframe o sus cubos se apagan (pedido).
                    pointer-events none INLINE (gana al [&_path] del stage):
                    el hit-area sigue siendo el arte de abajo. */}
                <svg
                  viewBox="0 0 104 634"
                  aria-hidden="true"
                  className="absolute left-0 top-0 w-full overflow-visible"
                >
                  <g
                    data-stack-cube="0"
                    data-stack-logo
                    className="[transition:transform_.38s_cubic-bezier(.65,0,.35,1)]"
                  >
                    <path
                      d={NEAR_MARK_D}
                      transform={MARK_TRANSFORM}
                      fill="#101010"
                      fillOpacity="0.85"
                      style={{ pointerEvents: "none" }}
                    />
                  </g>
                </svg>
              </div>

              {/* El bubble tag de la pieza hovereada, clavado al cursor: el
                  nodo vive siempre montado (onMove le escribe left/top) y el
                  hover solo lo prende y le cambia el texto. Decorativo: el
                  nombre accesible vive en el rail. */}
              {/* Pill para capas/segmentos; con desc (los cubos del split) se
                  vuelve una caja de esquinas apenas redondeadas con el texto
                  secundario debajo del nombre. */}
              <div
                ref={tagRef}
                aria-hidden="true"
                className={`pointer-events-none absolute z-10 border border-cream/25 bg-ink/85 backdrop-blur-sm transition-opacity duration-150 ${
                  tag ? "opacity-100" : "opacity-0"
                } ${
                  tag?.desc
                    ? "w-[19rem] translate-x-4 -translate-y-1/2 rounded-lg px-4 py-3"
                    : "translate-x-3 -translate-y-1/2 rounded-full px-4 py-1.5"
                }`}
              >
                <span className="flex items-center gap-2 whitespace-nowrap">
                  <span className="size-3 shrink-0 rounded-full bg-cta-mint" />
                  <span className="text-body text-cream">{tag?.label}</span>
                </span>
                {"sub" in (tag ?? {}) && tag?.sub && (
                  <span className="mt-1.5 block text-caption text-cta-mint/90 text-pretty">
                    {tag.sub}
                  </span>
                )}
                {tag?.desc && (
                  <span className="mt-1 block text-caption text-cream/65 text-pretty">
                    {tag.desc}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* El rail: cuatro cajas iguales — colapsadas son la MISMA barra de
              título compacta, apretadas entre sí. */}
          <div className="flex w-full flex-col gap-2">
            <RailBlock
              block={PROTOCOL_BLOCK}
              expanded={expanded("protocol")}
              onSelect={goTo}
            />
            <RailBlock
              block={INTENTS_BLOCK}
              expanded={expanded("intents")}
              onSelect={goTo}
            />

            {/* NEAR AI: colapsada es una barra de título idéntica a las otras
                tres. Abierta (cualquiera de sus tres paradas) revela el intro
                y las filas de productos, y adentro cada producto se expande
                en SU parada — dos niveles del mismo mecanismo 0fr↔1fr. */}
            {(() => {
              const aiOpen =
                !enhanced || scrollKey === "ai" || AI_BLOCK.subs.some((s) => scrollKey === s.key);
              return (
                // OJO: grupo `ai`, NO `blk` — los RailBlock anidados usan
                // `group-data-[open=true]/blk:*`, y con el MISMO nombre acá el
                // selector matcheaba contra este padre abierto: los tres
                // productos se expandían juntos apenas abría la caja de AI.
                <div
                  data-open={aiOpen}
                  className="group/ai rounded-2xl border border-cream transition-colors duration-300 data-[open=true]:border-cta-mint/70 data-[open=false]:hover:bg-ink-soft motion-reduce:transition-none"
                >
                  {/* Click en la barra de NEAR AI = saltar a SU parada (el
                      anillo entero encendido); el scroll sigue a los tres. */}
                  <button
                    type="button"
                    onClick={() => goTo("ai")}
                    aria-expanded={aiOpen}
                    className="w-full cursor-pointer rounded-2xl px-4 py-2.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta-mint"
                  >
                    <span className="block text-h4 text-cream">{AI_BLOCK.name}</span>
                  </button>
                  <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out group-data-[open=true]/ai:grid-rows-[1fr] motion-reduce:transition-none">
                    <div className="overflow-hidden">
                      <div className="flex flex-col gap-2 px-4 pb-3">
                        <p className="max-w-[46ch] text-body-sm text-cream/60 text-pretty">
                          {AI_BLOCK.intro}
                        </p>
                        <div className="flex flex-col gap-1.5">
                          {AI_BLOCK.subs.map((sub) => (
                            <RailBlock
                              key={sub.key}
                              block={sub}
                              nested
                              expanded={expanded(sub.key)}
                              onSelect={goTo}
                            />
                          ))}
                        </div>
                        <a
                          href={AI_BLOCK.link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          tabIndex={aiOpen ? 0 : -1}
                          className="text-caption text-cta-mint transition-colors duration-200 hover:text-cta-lime motion-reduce:transition-none"
                        >
                          {AI_BLOCK.link.label} <span aria-hidden="true">→</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            <RailBlock
              block={NEARCOM_BLOCK}
              expanded={expanded("nearcom")}
              onSelect={goTo}
            />
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
  nested = false,
  expanded,
  onSelect,
}: {
  block: StackLeaf;
  nested?: boolean;
  expanded: boolean;
  onSelect?: (key: StackLeaf["key"]) => void;
}) {
  return (
    // Caja compacta: colapsada es SOLO la barra de título con su borde,
    // pegada a sus vecinas (el gap del rail es el único aire). El recorrido
    // de scroll ya no vive acá — lo da el track pineado de la sección.
    <div
      data-open={expanded}
      className={`group/blk ${
        nested ? "rounded-xl border border-cream/25" : "rounded-2xl border border-cream"
      } transition-colors duration-300 data-[open=true]:border-cta-mint/70 data-[open=false]:hover:bg-ink-soft motion-reduce:transition-none`}
    >
      {/* La barra de título es un botón: click = saltar a la parada de esta
          caja en el track (goTo). Scroll y click, el mismo mecanismo. */}
      <button
        type="button"
        onClick={() => onSelect?.(block.key)}
        aria-expanded={expanded}
        className={`w-full cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta-mint ${
          nested ? "rounded-xl px-3.5 py-2" : "rounded-2xl px-4 py-2.5"
        }`}
      >
        {/* span y no <p>: un botón solo admite phrasing content. */}
        {/* Título siempre en cream pleno; sin numeración — pedido. */}
        <span className={`block ${nested ? "text-body text-cream/80" : "text-h4 text-cream"}`}>
          {block.name}
        </span>
      </button>
      {/* grid-rows 0fr↔1fr: el navegador interpola la altura sin medir nada. */}
      <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out group-data-[open=true]/blk:grid-rows-[1fr] motion-reduce:transition-none">
        <div className="overflow-hidden">
          <div className={`flex flex-col gap-2 ${nested ? "px-3.5 pb-2.5" : "px-4 pb-3"}`}>
            <p className="max-w-[46ch] text-body-sm text-cream/60 text-pretty">{block.body}</p>
            {block.link &&
              // Rutas internas (Protocol → /prototype/protocol) van por
              // next/link y en la misma pestaña; las externas abren aparte.
              (block.link.href.startsWith("/") ? (
                <Link
                  href={block.link.href}
                  tabIndex={expanded ? 0 : -1}
                  className="text-caption text-cta-mint transition-colors duration-200 hover:text-cta-lime motion-reduce:transition-none"
                >
                  {block.link.label} <span aria-hidden="true">→</span>
                </Link>
              ) : (
                <a
                  href={block.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={expanded ? 0 : -1}
                  className="text-caption text-cta-mint transition-colors duration-200 hover:text-cta-lime motion-reduce:transition-none"
                >
                  {block.link.label} <span aria-hidden="true">→</span>
                </a>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
