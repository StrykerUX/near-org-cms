"use client";

import { useRef, useState } from "react";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { enableScene, trackTimeline } from "@/components/primitives/motion/stickyScene";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { LAYERS, VIEW_BOX, AI_SEGMENT_IDS } from "./nearStackGeometry";
import { TIERS, POPOVERS, FOUNDATION } from "./nearStackContent";

// 4 tiers + una fase final que colapsa el rail y sube la banda de foundation.
const PHASES = 5;
// svh de scroll pegado por fase. Es el `PER` del original.
const STEP_VH = "65svh";

// Ancho del popover flotante. Se usa en el clamp de posición, así que vive acá
// y no solo en la clase.
const POP_W = 280;

const GRADIENT_BY_ROLE = {
  top: "url(#ns-core-top)",
  right: "url(#ns-core-right)",
  left: "url(#ns-core-left)",
} as const;

export default function NearStack() {
  // `active` es estado de React y no una variable del closure (como sí lo es en
  // ProofStats): acá lo consumen cuatro cosas del JSX —el body abierto, el color
  // del label, el gate del hover y el estado de cada pieza del SVG—, y
  // mantenerlo imperativo obligaría a duplicar toda esa lógica en tweens.
  // Cambia 5 veces por pasada de scroll, así que el costo es irrelevante.
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(-1);
  const [hoveredSeg, setHoveredSeg] = useState<string | null>(null);
  const [sceneOn, setSceneOn] = useState(false);
  const [popKey, setPopKey] = useState<string | null>(null);

  const popRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk, isDesktop }) => {
    // Las dos ramas estáticas ya están renderizadas por el JSX y no necesitan
    // código: sin `sceneOn` no hay track ni sticky, la escena se ve en su
    // estado final (que es el `buildScene(true)` del original) y los cuatro
    // bodies quedan abiertos. En mobile además la escena se oculta por CSS.
    if (!motionOk || !isDesktop) return;

    const track = q("[data-stack-track]")[0];
    const stage = q("[data-stack-stage]")[0];
    const head = q("[data-stack-head]")[0];
    const foundation = q("[data-stack-foundation]")[0];
    if (!track) return;

    // El interruptor del layout se escribe en el dataset (ver `enableScene`) y NO
    // se declara en el JSX: así React nunca lo pisa al re-renderizar por un cambio
    // de `active`, y sobre todo se aplica de forma SÍNCRONA — el trackTimeline de
    // abajo mide el track con su altura real en vez de con la del contenido.
    // `sceneOn` es el mismo hecho, pero para lo que sí depende de React.
    //
    // Va DESPUÉS del guard: si el markup no trae el track, encenderlo dejaría la
    // sección con la altura del recorrido y sin nada que la anime.
    const sceneOff = enableScene(scope, "scene");
    setSceneOn(true);

    // El estado inicial se aplica acá y NO por CSS: preesconder en la hoja de
    // estilos significa que un fallo del bundle deja la escena invisible para
    // siempre. Mismo criterio que el `.from()` de useScrollReveal.
    gsap.set(q("[data-tier-group]"), { opacity: 0, y: -110 });
    gsap.set(foundation, { yPercent: 140 });

    const tl = trackTimeline(track, {
      scrollTrigger: {
        onUpdate: (self) => {
          const i = Math.floor(self.progress * PHASES);
          // Pasada la última fase: se cierra el rail entero (-1) y la banda
          // de foundation toma la escena.
          setActive(i > TIERS.length - 1 ? -1 : i);
        },
      },
    });

    // Cada anillo aterriza justo cuando su item del rail se abre. `y` va en
    // unidades del viewBox, no en px: en SVG, GSAP escribe el atributo
    // transform, que vive en el sistema de coordenadas del propio SVG.
    TIERS.forEach((_, i) => {
      const at = Math.max(0, i * 0.2 - 0.08);
      tl.fromTo(
        q(`[data-tier-group="${i}"]`),
        { opacity: 0, y: -110 },
        {
          opacity: 1,
          y: 0,
          duration: Math.max(0.07, i * 0.2 + 0.015 - at),
          ease: "power1.out",
          immediateRender: false,
        },
        at
      );
    });

    // Fase final: el bloque sube para dejarle sitio a la banda de foundation.
    //
    // Suben el HEADER Y EL STAGE juntos. El original mueve solo el stage, y
    // eso lo mete por debajo del titular —que está quieto dentro del sticky—
    // hasta superponer el subtítulo con la primera fila del rail. Moviendo los
    // dos, la distancia entre ellos no cambia y el conjunto sale por arriba
    // como una pieza.
    tl.to([head, stage].filter(Boolean), {
      y: () => -Math.round(window.innerHeight * 0.2),
      duration: 0.16,
      ease: "power1.inOut",
    }, 0.8);
    tl.to(foundation, { yPercent: 0, duration: 0.16, ease: "power1.out" }, 0.81);

    // Estira el timeline a duración 1 para que su tiempo sea literalmente el
    // progress del scroll. Sin esto, las fases se comprimen contra el final.
    tl.to({}, { duration: 1 }, 0);

    return () => {
      sceneOff();
      setSceneOn(false);
      setActive(0);
      const all = [...q("[data-tier-group]"), stage, head, foundation].filter(Boolean);
      gsap.killTweensOf(all);
      gsap.set(all, { clearProps: "opacity,transform" });
    };
  });

  // Sin el recorrido de scroll, los cuatro bodies quedan abiertos: es la única
  // forma de que la sección se lea entera sin JS, en mobile y con reduced-motion.
  const isOpen = (i: number) => !sceneOn || i === active;

  /** Trazo de cada pieza: el verde solo en el segmento de AI bajo el puntero. */
  const strokeOf = (tier: number, id: string) => {
    if (hoveredSeg === id) return { color: "var(--near-green-accent)", strokeOpacity: 1 };
    // El núcleo verde nunca se atenúa: es el eje de la escena, no un anillo.
    if (tier === 0) return { color: "#fff", strokeOpacity: 0.9 };
    // Un tier que todavía no voló conserva el trazo pleno (está en opacity 0
    // igual, así que solo importa el frame en que entra).
    const bright = tier >= active || tier === hovered;
    return { color: "#fff", strokeOpacity: bright ? 0.85 : 0.3 };
  };

  const onPieceEnter = (tier: number, id: string) => {
    if (active >= 0 && tier > active) return; // todavía no voló
    setHovered(tier);
    if (AI_SEGMENT_IDS.includes(id)) {
      setHoveredSeg(id);
      setPopKey(id);
    } else {
      setHoveredSeg(null);
      setPopKey(POPOVERS[String(tier)] ? String(tier) : null);
    }
  };

  const onPieceLeave = () => {
    setHovered(-1);
    setHoveredSeg(null);
    setPopKey(null);
  };

  // La posición del popover se escribe IMPERATIVAMENTE. Un setState por
  // mousemove serían ~60 renders por segundo del árbol entero — es el error
  // clásico al portar esto. El contenido sí es estado; la posición no.
  const onPieceMove = (e: React.MouseEvent) => {
    const pop = popRef.current;
    const host = sceneRef.current;
    if (!pop || !host) return;
    const r = host.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - r.left + 18, r.width - POP_W - 12));
    const y = Math.max(0, Math.min(e.clientY - r.top + 18, r.height - pop.offsetHeight - 12));
    // translate3d y no left/top: compone en la GPU en vez de disparar layout.
    pop.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const popover = popKey ? POPOVERS[popKey] : null;

  return (
    // `data-scene` NO se declara acá a propósito: lo escribe el efecto en el
    // dataset. Ver el comentario en el bloque de motion.
    <section
      ref={rootRef}
      style={{ "--phases": PHASES, "--step-vh": STEP_VH } as React.CSSProperties}
      className="group/stack relative bg-ink text-white"
    >
      <div
        data-stack-track
        className="group-data-[scene=on]/stack:h-[calc(var(--phases)*var(--step-vh)+100svh)]"
      >
        {/* El hijo sticky ES el `root.style.height=100vh; overflow:hidden` del
            original, pero sin mutar estilos y sin pin-spacer. El overflow acá es
            legal —y necesario, es lo que esconde la banda de foundation bajo el
            fold—: la regla del repo prohíbe overflow en los ANCESTROS de un
            sticky, no en el sticky mismo.

            De paso desaparece el motivo del `height` fijo del original: abrir y
            cerrar los bodies del rail ya no puede cambiar la altura del
            documento, porque la manda el track y no el contenido. */}
        <div className="relative group-data-[scene=on]/stack:sticky group-data-[scene=on]/stack:top-0 group-data-[scene=on]/stack:h-svh group-data-[scene=on]/stack:overflow-hidden">
          {/* `pt-32` iguala el `pb-32` con que cierra OwnYourOwn: el corte entre
              las dos secciones es a sangre, así que el aire a cada lado tiene
              que coincidir o la juntura se lee descentrada. */}
          <Container className="flex flex-col gap-6 pb-12 pt-32">
            {/* Sube junto con el stage en la fase final — ver el bloque de
                motion. Si se queda quieto, el stage se le mete debajo. */}
            <div data-stack-head className="flex flex-col items-center gap-3 text-center">
              <h2 className="text-h1 text-pretty">The NEAR Stack</h2>
              <p className="max-w-[26ch] text-h3 text-white/70 text-balance">
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

            <div
              data-stack-stage
              className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[1.15fr_1fr]"
            >
              {/* La escena se OCULTA en mobile y el rail toma el ancho completo:
                  el objeto isométrico a 360px de ancho no se lee. */}
              <div ref={sceneRef} className="relative hidden lg:block">
                <svg
                  viewBox={VIEW_BOX}
                  aria-hidden="true"
                  className="mx-auto block max-h-[56svh] w-full max-w-[640px]"
                >
                  <defs>
                    <linearGradient id="ns-core-top" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#ecfdb0" />
                      <stop offset="100%" stopColor="#b9f34e" />
                    </linearGradient>
                    <linearGradient id="ns-core-right" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8bf29c" />
                      <stop offset="100%" stopColor="#049d4e" />
                    </linearGradient>
                    <linearGradient id="ns-core-left" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#d8f2d0" />
                      <stop offset="100%" stopColor="#54ca80" />
                    </linearGradient>
                  </defs>

                  {/* El orden de LAYERS ES el z-order y no se puede reordenar:
                      cada anillo tiene una parte por detrás del eje y otra por
                      delante, y ese cruce es todo el efecto de profundidad.

                      GSAP escribe SOLO opacity e y en estos grupos; el trazo lo
                      maneja React vía style. Propiedades distintas, sin pelea. */}
                  {LAYERS.map((layer, li) => (
                    <g key={li} data-tier-group={layer.tier}>
                      {layer.pieces.map((p) => (
                        <g
                          key={p.id}
                          data-piece={p.id}
                          style={strokeOf(layer.tier, p.id)}
                          className="cursor-pointer transition-[stroke-opacity,color] duration-300"
                          onMouseEnter={() => onPieceEnter(layer.tier, p.id)}
                          onMouseMove={onPieceMove}
                          onMouseLeave={onPieceLeave}
                        >
                          {p.faces.map((f, fi) => (
                            <path
                              key={fi}
                              d={f.d}
                              // El fill de las caras "shell" tiene que ser
                              // EXACTAMENTE el fondo de la sección: el back-face
                              // culling solo se lee como oclusión sólida si
                              // coinciden. Por eso los dos salen de --ink.
                              fill={p.kind === "core" ? GRADIENT_BY_ROLE[f.role] : "var(--ink)"}
                              stroke="currentColor"
                              strokeWidth={1}
                              strokeLinejoin="round"
                              vectorEffect="non-scaling-stroke"
                            />
                          ))}
                        </g>
                      ))}
                    </g>
                  ))}
                </svg>

                {/* Vive dentro del contenedor de la escena porque su posición se
                    mide contra él. `left/top: 0` fijos + transform: el
                    movimiento no toca layout. */}
                <div
                  ref={popRef}
                  aria-hidden="true"
                  data-on={popover !== null}
                  style={{ width: POP_W }}
                  className="pointer-events-none absolute left-0 top-0 z-[5] rounded-xl border border-white/[0.18] bg-ink/95 px-4 py-3.5 opacity-0 transition-opacity duration-200 data-[on=true]:opacity-100"
                >
                  {popover && (
                    <>
                      <Eyebrow className="mb-2 text-white/45">{popover.eyebrow}</Eyebrow>
                      {popover.items.map((item) => (
                        <p key={item.title} className="mb-1.5 text-body-sm text-white/85 last:mb-0">
                          <span className="text-label text-white">{item.title}</span> · {item.blurb}
                        </p>
                      ))}
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-col">
                {TIERS.map((tier, i) => (
                  <div
                    key={tier.name}
                    data-open={isOpen(i)}
                    // El hover del rail ilumina la geometría, pero solo de los
                    // tiers que ya volaron: encender uno que todavía no está en
                    // pantalla no comunica nada.
                    onMouseEnter={() => {
                      if (active < 0 || i <= active) setHovered(i);
                    }}
                    onMouseLeave={() => setHovered(-1)}
                    className="group/tier border-t border-white/15 pb-3.5 pt-4.5 last:border-b"
                  >
                    <h3 className="text-h4 text-white/35 transition-colors duration-300 group-data-[open=true]/tier:text-white">
                      <sup className="index-marker mr-2 align-super text-white/30">
                        0{i + 1}
                      </sup>
                      {tier.name}
                    </h3>

                    {/* grid-template-rows 0fr ↔ 1fr es la sustitución moderna de
                        animar height contra scrollHeight: el navegador interpola
                        sin que nadie mida, y no queda un `height:auto` diferido
                        que pueda colgarse si el tween se mata a mitad.
                        El overflow-hidden va en el hijo interno para que el
                        margen superior del <p> quede DENTRO de la caja que se
                        recorta. */}
                    <div className="grid transition-[grid-template-rows] duration-500 ease-out group-data-[open=true]/tier:grid-rows-[1fr] grid-rows-[0fr]">
                      <div className="overflow-hidden">
                        <p className="mt-3.5 max-w-[38ch] text-body-sm text-white/55 text-pretty">
                          {tier.body}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Container>

          {/* Espera bajo el fold y sube en la fase final. En estático (mobile /
              reduced-motion) queda en flujo normal al pie de la sección. */}
          <div
            data-stack-foundation
            className="group-data-[scene=on]/stack:absolute group-data-[scene=on]/stack:inset-x-0 group-data-[scene=on]/stack:bottom-0"
          >
            <Container className="pb-12 pt-8">
              <div className="mx-auto grid max-w-[1120px] gap-16 border-t border-white/15 pt-8 lg:grid-cols-2">
                {FOUNDATION.map((block) => (
                  <div key={block.title} className="flex flex-col gap-3">
                    <Eyebrow className="text-white/40">{block.title}</Eyebrow>
                    <p className="max-w-[40ch] text-body-sm text-white/55 text-pretty">
                      {block.body}
                    </p>
                  </div>
                ))}
              </div>
            </Container>
          </div>
        </div>
      </div>
    </section>
  );
}
