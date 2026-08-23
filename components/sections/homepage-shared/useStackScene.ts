"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import {
  SEG_KEYS,
  STAGE_ORDER,
  type StackHover,
  type StackStop,
} from "@/components/sections/homepage-shared/stackAssembly";

// La MECÁNICA que las cinco variantes comparten: el build-in de la columna, el
// recorrido por paradas, la iluminación por segmento y el hover por delegación.
//
// ── Qué se copió y qué no, y por qué ────────────────────────────────────────
//
// La decisión del lab fue cinco secciones editables por separado. Lo que las
// distingue —y lo que se está comparando— es el LAYOUT y el RECORRIDO: dónde
// vive el texto, a qué escala se muestra el arte, cuánto scroll cuesta. Eso
// vive entero en cada variante y ninguna sabe de las otras.
//
// Esto de acá es lo otro: el gesto que ya funciona y que nadie pidió cambiar.
// Copiado cinco veces serían ~150 líneas idénticas donde el mismo bug puede
// esconderse cinco veces, y donde "arreglá el hover" es cinco ediciones.
//
// **Si una variante necesita desviarse**, el camino es una opción de este hook
// (como `mode`) o copiar el hook para ESA variante — no editar el compartido
// hasta que sirva a las cinco a medias.
//
// ── `mode` ──────────────────────────────────────────────────────────────────
//
// `track`  — la sección es un tramo alto con un viewport sticky adentro y el
//            progreso se reparte en una rebanada por parada. Es el mecanismo
//            del original.
// `static` — la sección mide lo que mide y el ensamble entra COMPLETO cuando
//            aparece en pantalla. Sin recorrido y sin paradas: para las
//            variantes que muestran las cuatro capas a la vez.
//
// Nunca `pin: true`, en ninguno de los dos. El razonamiento largo está en
// `components/sections/README.md`.

export type StackSceneMode = "track" | "static";

/** Cuánto se separan los cubos al partirse la columna, en unidades del svg. */
const SPLIT_GAP = 32;

/** Alto del viewBox de la columna — el que convierte px de pantalla a unidades. */
const COLUMN_VB_H = 634;

export type StackSceneOptions = {
  mode?: StackSceneMode;
};

export type StackScene = {
  /** Va en la <section>. Escribe `data-mode="track"` cuando la escena está activa. */
  rootRef: React.RefObject<HTMLElement | null>;
  /** Va en el contenedor del ensamble: es el ancestro del que cuelga el hover. */
  stageRef: React.RefObject<HTMLDivElement | null>;
  /** Índice en STAGE_ORDER. -1 = todavía no arrancó el recorrido. */
  stage: number;
  /** La parada activa, o null antes de arrancar. */
  stop: StackStop | null;
  hover: StackHover;
  /** false en SSR, móvil y reduced-motion: todo verde y todo expandido. */
  enhanced: boolean;
  /** Salta a una parada del recorrido (click en el arte o en el texto). */
  goTo: (key: StackStop) => void;
  /** Handlers del stage: hover por delegación + el tag clavado al cursor. */
  stageProps: {
    onPointerOver: (e: React.PointerEvent) => void;
    onPointerMove: (e: React.PointerEvent) => void;
    onPointerLeave: (e: React.PointerEvent) => void;
    onClick: (e: React.MouseEvent) => void;
  };
  /** El nodo del tag; la posición se escribe imperativa en cada pointermove. */
  tagRef: React.RefObject<HTMLDivElement | null>;
};

export function useStackScene({ mode = "track" }: StackSceneOptions = {}): StackScene {
  // -1 = todavía no arrancó (solo la columna en escena), 0..6 = STAGE_ORDER.
  const [scrollIdx, setScrollIdx] = useState(-1);
  const [hover, setHover] = useState<StackHover>(null);
  const [enhanced, setEnhanced] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);

  // Identidad del salto por click activo: >0 congela el estado derivado del
  // scroll hasta que el tween aterriza. Es un id y no un boolean para que un
  // segundo click no pueda "aterrizar" el salto viejo por encima del nuevo.
  const jumpRef = useRef(0);
  const jumpSeq = useRef(0);
  // false MIENTRAS corre el build-in: el efecto de hover no escribe sobre los
  // cubos en ese lapso (pisaría el tween de entrada). Arranca en true para que
  // el fallback sin escena nunca quede con los cubos sin gobernar.
  const builtRef = useRef(true);

  const rootRef = useMotionScope<HTMLElement>(
    ({ scope, motionOk, isDesktop }) => {
      if (!motionOk || !isDesktop) return;
      setEnhanced(true);
      scope.dataset.mode = mode;

      const triggers: ScrollTrigger[] = [];

      if (mode === "track") {
        triggers.push(
          ScrollTrigger.create({
            trigger: scope,
            start: "top top",
            end: "bottom bottom",
            onUpdate: (self) => {
              if (jumpRef.current) return;
              setScrollIdx(
                Math.min(STAGE_ORDER.length - 1, Math.floor(self.progress * STAGE_ORDER.length))
              );
            },
            onLeaveBack: () => {
              if (!jumpRef.current) setScrollIdx(-1);
            },
          })
        );
      } else {
        // Sin recorrido: el ensamble está COMPLETO desde el principio.
        //
        // Se setea acá y no desde un ScrollTrigger `onEnter`, y el motivo es un
        // modo de fallo real: `onEnter` no dispara cuando la sección YA está
        // dentro del rango al crearse el trigger (una recarga a media página,
        // una llegada por ancla, o simplemente una sección alta en un viewport
        // alto). El resultado era una sección que se quedaba con la columna
        // sola y sin los tres anillos, para siempre.
        //
        // Lo que sí sigue colgado del scroll es el build-in de los cubos, que
        // tiene su propio trigger más abajo: la columna se construye cuando se
        // la ve, y los anillos ya están puestos.
        setScrollIdx(STAGE_ORDER.length - 1);
      }

      // La columna no ESTÁ al llegar: se CONSTRUYE — los seis cubos suben a
      // escena de abajo hacia arriba, una sola vez. Cada índice agrupa sus
      // instancias (wire+verde × las dos mitades del z-layering) más el mark.
      builtRef.current = false;
      const cubes = scope.querySelectorAll<SVGGElement>("[data-stack-cube]");
      // `transition: none` inline mientras dura el build: los grupos traen una
      // transition CSS que interceptaba y RE-EASEABA cada frame que GSAP
      // escribía. Se restaura al final con el clearProps.
      gsap.set(cubes, { autoAlpha: 0, y: -90, transition: "none" });

      const buildTl = gsap.timeline({
        // En modo track, cuando el stage YA está pegado (`top top`) y no antes.
        //
        // El valor viejo era "top 30%" —el arte asomando por el borde de abajo—
        // y dejó de servir cuando la sección quedó encerrada entre las dos
        // cortinas (`InkCurtain`): durante ese tramo el panel de la cortina
        // cubre el viewport entero, así que un build disparado ahí se armaba
        // DETRÁS del negro y el lector llegaba a una columna ya construida. El
        // gesto de la sección es que la columna se levante frente a él.
        //
        // En modo `static` no hay cortina ni sticky y la regla vieja sigue
        // siendo la correcta: el arte se construye cuando asoma.
        scrollTrigger: {
          trigger: scope,
          start: mode === "track" ? "top top" : "top 30%",
          once: true,
        },
        onComplete: () => {
          builtRef.current = true;
          gsap.set(cubes, { clearProps: "opacity,visibility,transform,transition" });
        },
      });

      // Secuencial de verdad, no ola: cada cubo arranca cuando el anterior va
      // por ~2/3 de su caída. La caída va en DOS tweens encadenados porque
      // ninguna ease de fábrica hace lo pedido (velocidad constante y freno
      // SOLO al final): 72px lineales a 200px/s y después los últimos 18px en
      // power2.out arrancando a esos mismos 200px/s (v₀ = 2·d/T = 2·18/0.18).
      for (let i = 5; i >= 0; i--) {
        const nodes = scope.querySelectorAll<SVGGElement>(`[data-stack-cube="${i}"]`);
        const at = (5 - i) * 0.3;
        buildTl.to(nodes, { y: -18, duration: 0.36, ease: "none" }, at);
        buildTl.to(nodes, { y: 0, duration: 0.18, ease: "power2.out" }, at + 0.36);
        // Totalmente visible a menos de la mitad de la caída: el fade ocurre
        // arriba y el resto del recorrido se ve entero.
        buildTl.to(nodes, { autoAlpha: 1, duration: 0.22, ease: "sine.inOut" }, at);
      }

      // Las sombras esperan a su bloque: sin bloque encima, sin sombra.
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
      buildTl.timeScale(1.3);

      return () => {
        builtRef.current = true;
        setEnhanced(false);
        triggers.forEach((t) => t.kill());
        buildTl.scrollTrigger?.kill();
        buildTl.kill();
        delete scope.dataset.mode;
      };
    },
    [mode]
  );

  const stop: StackStop | null = scrollIdx >= 0 ? STAGE_ORDER[scrollIdx] : null;

  // En fallback (SSR, móvil, reduced-motion) el ensamble está completo.
  const stage = enhanced ? scrollIdx : STAGE_ORDER.length - 1;
  const showAi = stage >= 2;

  const hoverTarget = hover && "key" in hover ? hover.key : null;
  const litSeg: string | null = !showAi
    ? null
    : hover
      ? (SEG_KEYS.find((k) => k === hoverTarget) ?? null)
      : stage === 2 || stage >= 6
        ? "all"
        : (SEG_KEYS.find((k) => k === stop) ?? "all");

  // Los segmentos de AI no son props de los componentes generados: se manejan
  // imperativo sobre los hooks `data-*`. Es la mitad no declarativa del estado.
  useEffect(() => {
    const stageEl = stageRef.current;
    if (!stageEl) return;
    // Hover sobre UN producto: los hermanos no caen a wireframe seco, se
    // ATENÚAN al 30% conservando algo de color. En los demás estados (paradas
    // del scroll, hover en otras capas) siguen apagándose del todo.
    const segHover = hover?.kind === "seg";
    stageEl.querySelectorAll<SVGGElement>("[data-ai-green] [data-stack-seg]").forEach((g) => {
      g.style.transition = "opacity 300ms";
      g.style.opacity =
        litSeg === "all" || g.dataset.stackSeg === litSeg ? "1" : segHover ? "0.3" : "0";
    });

    // ── El split ────────────────────────────────────────────────────────
    //
    // El hover sobre la columna la PARTE en sus seis cubos, y cada uno es un
    // feature del protocolo. Verde y wireframe se separan a la vez porque
    // comparten geometría y orden de grupos: el `data-stack-cube` está en
    // ambas instancias.
    //
    // Con un cubo concreto bajo el cursor, sus cinco hermanos se atenúan al
    // 30% — el foco es el feature señalado, no la columna entera.
    //
    // La transición va inline y no en una clase porque gobierna también
    // `opacity`, que la clase generada no cubre.
    const split =
      hover?.kind === "cube" || (hover?.kind === "layer" && hover.key === "protocol");
    const hoveredCube = hover?.kind === "cube" ? hover.index : null;

    // Con el build-in de la columna en curso los cubos son del tween de
    // entrada: escribirles transform/opacity acá lo pisaría a mitad de vuelo.
    if (!builtRef.current) return;

    stageEl.querySelectorAll<SVGGElement>("[data-stack-cube]").forEach((g) => {
      const i = Number(g.dataset.stackCube);
      g.style.transition = "transform .38s cubic-bezier(.65,0,.35,1), opacity .25s";
      g.style.transform = split ? `translateY(${((i - 2.5) * SPLIT_GAP).toFixed(0)}px)` : "translateY(0px)";
      // El mark de NEAR viaja con el cubo 0 (mismo `data-stack-cube`) pero NO
      // se atenúa con él: queda negro pleno mientras sus vecinos caen al 30%.
      g.style.opacity =
        hoveredCube !== null && i !== hoveredCube && !("stackLogo" in g.dataset) ? "0.3" : "1";
    });
  }, [litSeg, hover]);

  /* ── El corredor de la columna ───────────────────────────────────────────
     Con el hover YA en la columna, moverse en vertical recorre sus seis cubos
     por POSICIÓN Y del puntero, sin depender de sobre qué path cae el evento.
     Hace falta por dos motivos concretos: los anillos cruzan por delante y por
     detrás justo ahí y le robarían el hover, y el propio split abre HUECOS
     entre cubos por los que el puntero se cae al fondo.

     Devuelve true si capturó el evento. */
  const columnCorridor = (e: React.PointerEvent): boolean => {
    const inColumn =
      hover?.kind === "cube" || (hover?.kind === "layer" && hover.key === "protocol");
    if (!inColumn) return false;
    const col = stageRef.current?.querySelector('[data-stack-layer="protocol"]');
    if (!col) return false;
    const r = col.getBoundingClientRect();
    if (e.clientX < r.left - 16 || e.clientX > r.right + 16) return false;
    // Centros de los seis cubos en pantalla, CON el split aplicado: el
    // desplazamiento va en unidades del svg, así que escala con r.height.
    const s = r.height / COLUMN_VB_H;
    let best = 0;
    let bestD = Infinity;
    for (let i = 0; i < 6; i++) {
      const c = r.top + (78 + 95 * i + (i - 2.5) * SPLIT_GAP) * s;
      const d = Math.abs(e.clientY - c);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    }
    // Demasiado lejos por arriba o por abajo: soltar el modo columna.
    if (bestD > 120 * s) return false;
    setHover({ kind: "cube", index: best });
    return true;
  };

  const goTo = (key: StackStop) => {
    const section = rootRef.current;
    if (!section || !enhanced || mode !== "track") return;
    const i = STAGE_ORDER.indexOf(key);
    const top = section.getBoundingClientRect().top + window.scrollY;
    const span = section.offsetHeight - window.innerHeight;
    const id = ++jumpSeq.current;
    jumpRef.current = id;
    // El estado NO viaja con el scroll: se setea directo a la parada destino y
    // el derivado del scroll queda congelado mientras el tween aterriza. Con un
    // solo cambio de estado, cada elemento hace su transición una única vez, sin
    // recorrer las paradas intermedias.
    setScrollIdx(i);
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

  /* ── Hover por delegación: un solo par de handlers sobre el stage ──────── */

  const onPointerOver = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    if (columnCorridor(e)) return;
    const t = e.target as Element;
    const layer = t.closest("[data-stack-layer]")?.getAttribute("data-stack-layer");
    const seg = t.closest("[data-stack-seg]")?.getAttribute("data-stack-seg");
    const cube = t.closest("[data-stack-cube]")?.getAttribute("data-stack-cube");
    if (layer === "protocol" && cube !== null && cube !== undefined) {
      setHover({ kind: "cube", index: Number(cube) });
    } else if (layer === "ai" && seg) {
      setHover({ kind: "seg", key: seg as (typeof SEG_KEYS)[number] });
    } else if (layer === "protocol" || layer === "intents" || layer === "nearcom") {
      setHover({ kind: "layer", key: layer });
    } else {
      // El puntero está sobre el fondo, entre piezas.
      setHover(null);
    }
  };

  const onPointerLeave = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") setHover(null);
  };

  // Escribe las coordenadas crudas del cursor sobre el nodo del tag. Un
  // setState por pointermove sería un re-render por píxel.
  const onPointerMove = (e: React.PointerEvent) => {
    const el = tagRef.current;
    const stageEl = stageRef.current;
    if (!el || !stageEl) return;
    const r = stageEl.getBoundingClientRect();
    el.style.left = `${e.clientX - r.left}px`;
    el.style.top = `${e.clientY - r.top}px`;
    // `pointerover` no vuelve a dispararse entre huecos del MISMO elemento, así
    // que el corredor de la columna se evalúa también en cada move.
    if (e.pointerType === "mouse") columnCorridor(e);
  };

  // Click sobre una pieza = saltar a su parada. En `static` no hay adónde ir.
  const onClick = (e: React.MouseEvent) => {
    const t = e.target as Element;
    const layer = t.closest("[data-stack-layer]")?.getAttribute("data-stack-layer");
    const seg = t.closest("[data-stack-seg]")?.getAttribute("data-stack-seg");
    if (layer === "ai" && seg) goTo(seg as StackStop);
    // Un cubo es un feature del protocolo: su parada es la de la capa.
    else if (layer === "protocol") goTo("protocol");
    else if (layer === "intents" || layer === "nearcom") goTo(layer as StackStop);
  };

  return {
    rootRef,
    stageRef,
    stage,
    stop,
    hover,
    enhanced,
    goTo,
    stageProps: { onPointerOver, onPointerMove, onPointerLeave, onClick },
    tagRef,
  };
}
