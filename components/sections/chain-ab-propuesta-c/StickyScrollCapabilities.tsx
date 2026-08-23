"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Container from "@/components/primitives/Container";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { enableScene, trackTimeline } from "@/components/primitives/motion/stickyScene";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { CAPABILITIES } from "@/components/sections/chain-abstraction-proposals/content";
import {
  SIZE,
  C,
  R_CORE,
  SATELLITES,
  SPOKES,
  RACE_PATHS,
  RACE_FROM,
  RACE_WINNER,
  MOVE_FROM,
  MOVE_TO,
} from "@/components/sections/chain/chainDiagram";

// Clon directo de `chain/CapabilityStack.tsx` — mismo mecanismo, mismos
// tiempos, misma geometría (`chainDiagram.ts`). Lo único que cambia es la
// fuente del copy (nuestro `CAPABILITIES`, no `chainContent.ts` — los campos
// no se llaman igual, así que se adaptan acá abajo) y el verde (nuestro
// `LIVE` de marca en vez de `CTA_RAMP`/`NEAR_TEAL` literales de esa página).
//
// La idea que sostiene todo esto: el diagrama ACUMULA — la cuenta y sus
// spokes se dibujan en el beat 1 y siguen ahí en el beat 4, cuando la
// autoridad finalmente viaja por ellos. Un figura que se reseteara entre
// beats contradiría en pantalla lo que el copy afirma ("share one
// foundation"). Por beat:
//
//   1 · accounts    → se dibujan los doce spokes (color DIM) y sus nodos
//   2 · intents     → la carrera de solvers: 3 curvas bowed, una gana
//   3 · omnibridge  → el activo viaja satélite → centro → satélite
//   4 · signatures  → TODOS los spokes a la vez, más el pulso de autoridad
//
// Sticky vía CSS (`enableScene`/`trackTimeline`), nunca `pin: true`.
const CAPABILITY_ITEMS = CAPABILITIES.map((c, i) => ({
  id: c.kicker,
  index: String(i + 1).padStart(2, "0"),
  eyebrow: c.kicker,
  title: c.header,
  body: c.body,
  linkLabel: c.link,
  href: "#",
}));

const BEATS = CAPABILITY_ITEMS.length;
const TRAVEL_SVH = BEATS * 78;
const TRAVEL = `${TRAVEL_SVH}svh`;

const SPAN = 1 / BEATS;
const beat = (i: number) => i * SPAN;

// El cross-fade del texto SÍ va en el timeline scrubbed `tl` (mismo que el
// diagrama) — "atado al scroll" en serio: nada de tween con duración de
// reloj, la interpolación es una función pura de la posición de scroll, así
// que revertir (scrollear para arriba) retrocede exactamente la misma
// interpolación, frame a frame, sin casos especiales.
//
// La versión anterior de este bloque SÍ vivía en `tl`, pero con una ventana
// de blend diminuta (~4.5% del rango total de 4 beats, ~18svh de scroll
// real) — atada al scroll, pero tan angosta que un scroll normal la cruzaba
// en un solo frame y se sentía como un corte, no como un fundido. La
// ventana de acá es bastante más ancha (32% del tramo de CADA beat, no del
// total) para que incluso un scroll rápido atraviese suficientes frames de
// scroll como para que el fundido se vea.
const OVERLAP = SPAN * 0.32;
// 18/26px se leía como un simple fade in-place (el desplazamiento era
// chico frente al alto del bloque de texto, varias líneas de body incluidas).
// Con más recorrido el nuevo texto se ve entrar empujando al que sale, no
// solo desvanecerse encima.
const TEXT_ENTER_Y = 64;
const TEXT_EXIT_Y = -56;

const DIM = "rgba(255,255,255,0.16)";
const LIVE = "#00ec97"; // --near-green — token de marca en vez del literal de esa página

const PATH_LEN = 100;
const PULSE_DASH = 14;

export default function StickyScrollCapabilities() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk, isDesktop }) => {
    // Mobile y reduced-motion caen a la composición estática (ver el JSX: el
    // SVG ya renderiza su estado FINAL — todo dibujado, la carrera decidida,
    // el activo llegado — así que sin JS/en móvil/con motion reducido el
    // lector ve el diagrama completo y los 4 bloques de texto apilados.
    if (!motionOk || !isDesktop) return;

    const off = enableScene(scope, "stack");
    const tl = trackTimeline(scope);

    const beats = q("[data-beat]");
    const spokes = q<SVGPathElement>("[data-spoke]");
    const nodes = q<SVGCircleElement>("[data-node]");
    const labels = q("[data-node-label]");
    const races = q<SVGPathElement>("[data-race]");
    const pulses = q<SVGPathElement>("[data-pulse]");

    gsap.set([...spokes, ...races], { strokeDasharray: PATH_LEN, strokeDashoffset: PATH_LEN });
    gsap.set(spokes, { stroke: DIM });
    gsap.set(nodes, { scale: 0, transformOrigin: "center", autoAlpha: 0 });
    gsap.set(labels, { autoAlpha: 0 });
    gsap.set(q("[data-core]"), { scale: 0, transformOrigin: "center" });
    gsap.set(q("[data-core-inner]"), { autoAlpha: 0, scale: 0.4, transformOrigin: "center" });
    gsap.set(q("[data-token]"), { autoAlpha: 0 });
    gsap.set(pulses, {
      strokeDasharray: `${PULSE_DASH} ${PATH_LEN - PULSE_DASH}`,
      strokeDashoffset: PATH_LEN,
      autoAlpha: 0,
    });
    gsap.set(beats.slice(1), { autoAlpha: 0 });

    // ── beat copy — entra desde abajo, sale hacia arriba, atado al scroll ──
    // Un tramo de blend por límite entre beats, centrado en `beat(i+1)`: el
    // saliente y el entrante comparten exactamente la misma posición/
    // duración en `tl`, así que se funden en simultáneo (crossfade real) en
    // vez de que uno termine antes de que el otro arranque. `ease:"none"`
    // a propósito — con `scrub:true` el "tiempo" de la tween YA es scroll;
    // un easing con aceleración/desaceleración rompe la relación lineal
    // entre delta de scroll y delta visual, y se siente como un arranque
    // brusco al revertir.
    for (let i = 0; i < BEATS - 1; i++) {
      const at = beat(i + 1) - OVERLAP / 2;
      tl.to(beats[i], { autoAlpha: 0, y: TEXT_EXIT_Y, duration: OVERLAP, ease: "none" }, at);
      tl.fromTo(
        beats[i + 1],
        { autoAlpha: 0, y: TEXT_ENTER_Y },
        { autoAlpha: 1, y: 0, duration: OVERLAP, ease: "none" },
        at
      );
    }

    // ── beat 1 · la cuenta y su alcance ─────────────────────────────────────
    tl.to(q("[data-core]"), { scale: 1, duration: 0.05, ease: "back.out(1.6)" }, beat(0) + 0.01)
      .to(spokes, { strokeDashoffset: 0, duration: 0.11, stagger: 0.006, ease: "power2.out" }, beat(0) + 0.04)
      .to(nodes, { scale: 1, autoAlpha: 1, duration: 0.05, stagger: 0.006, ease: "back.out(2)" }, beat(0) + 0.09)
      .to(labels, { autoAlpha: 1, duration: 0.05, stagger: 0.006 }, beat(0) + 0.1);

    // ── beat 2 · los solvers compiten ───────────────────────────────────────
    races.forEach((path, i) => {
      const isWinner = i === RACE_WINNER;
      tl.to(
        path,
        { strokeDashoffset: 0, duration: isWinner ? 0.09 : 0.15 + i * 0.02, ease: "power1.inOut" },
        beat(1) + 0.03
      );
    });
    tl.to(races[RACE_WINNER], { stroke: LIVE, strokeOpacity: 1, duration: 0.04 }, beat(1) + 0.12)
      .to(races.filter((_, i) => i !== RACE_WINNER), { strokeOpacity: 0.18, duration: 0.05 }, beat(1) + 0.12)
      .to(nodes[RACE_FROM], { fill: LIVE, duration: 0.04 }, beat(1) + 0.13);

    // ── beat 3 · el activo viaja y sigue siendo él mismo ────────────────────
    const from = SATELLITES[MOVE_FROM];
    const to = SATELLITES[MOVE_TO];
    tl.set(q("[data-token]"), { x: from.x - C, y: from.y - C }, beat(2) + 0.01)
      .to(q("[data-token]"), { autoAlpha: 1, duration: 0.02 }, beat(2) + 0.01)
      .to(spokes[MOVE_FROM], { stroke: LIVE, duration: 0.03 }, beat(2) + 0.02)
      .to(q("[data-token]"), { x: 0, y: 0, duration: 0.07, ease: "power1.inOut" }, beat(2) + 0.04)
      .to(spokes[MOVE_TO], { stroke: LIVE, duration: 0.03 }, beat(2) + 0.09)
      .to(q("[data-token]"), { x: to.x - C, y: to.y - C, duration: 0.07, ease: "power1.inOut" }, beat(2) + 0.11)
      .to(nodes[MOVE_FROM], { fill: LIVE, duration: 0.04 }, beat(2) + 0.14)
      .to(nodes[MOVE_TO], { fill: LIVE, duration: 0.04 }, beat(2) + 0.14);

    // ── beat 4 · la autoridad viaja por todos a la vez ──────────────────────
    tl.to(q("[data-core-inner]"), { autoAlpha: 1, scale: 1, duration: 0.06, ease: "back.out(1.8)" }, beat(3) + 0.02)
      .to(pulses, { autoAlpha: 1, duration: 0.02 }, beat(3) + 0.04)
      .to(pulses, { strokeDashoffset: PULSE_DASH, duration: 0.12, ease: "power1.inOut" }, beat(3) + 0.04)
      .to(spokes, { stroke: LIVE, strokeOpacity: 0.7, duration: 0.06, stagger: 0.004 }, beat(3) + 0.1)
      .to(nodes, { fill: LIVE, duration: 0.05, stagger: 0.004 }, beat(3) + 0.12)
      .to(pulses, { autoAlpha: 0, duration: 0.03 }, beat(3) + 0.18);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      off();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      data-nav-dark
      style={{ "--travel": TRAVEL } as React.CSSProperties}
      className="group/stack relative bg-ink-slate text-white data-[stack=on]:h-[calc(100svh+var(--travel))]"
    >
      <div className="relative overflow-hidden py-[12svh] group-data-[stack=on]/stack:sticky group-data-[stack=on]/stack:top-0 group-data-[stack=on]/stack:h-svh group-data-[stack=on]/stack:py-0">
        <Container className="grid h-full grid-cols-12 items-center gap-x-[var(--grid-gutter)] gap-y-16">
          {/* ── la figura ─────────────────────────────────────────────────── */}
          <div className="order-first col-span-12 lg:order-none lg:col-span-6 lg:col-start-7 lg:row-start-1">
            <div className="relative mx-auto aspect-square w-full max-w-[40rem]">
              <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
                {SPOKES.map((d, i) => (
                  <path key={`spoke-${i}`} data-spoke d={d} fill="none" stroke={DIM} strokeWidth="1" pathLength={PATH_LEN} />
                ))}

                {SPOKES.map((d, i) => (
                  <path key={`pulse-${i}`} data-pulse d={d} fill="none" stroke={LIVE} strokeWidth="2" pathLength={PATH_LEN} opacity="0" />
                ))}

                {RACE_PATHS.map((d, i) => (
                  <path
                    key={`race-${i}`}
                    data-race
                    d={d}
                    fill="none"
                    stroke={i === RACE_WINNER ? LIVE : "rgba(255,255,255,0.9)"}
                    strokeOpacity={i === RACE_WINNER ? 1 : 0.18}
                    strokeWidth={i === RACE_WINNER ? 1.75 : 1}
                    pathLength={PATH_LEN}
                  />
                ))}

                {SATELLITES.map((s, i) => (
                  <circle key={s.label} data-node cx={s.x} cy={s.y} r="5" fill={i === RACE_FROM ? LIVE : "#ffffff"} />
                ))}

                <g data-core>
                  <circle cx={C} cy={C} r={R_CORE} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1" />
                  <circle cx={C} cy={C} r="4" fill="#ffffff" />
                </g>
                <g data-core-inner>
                  <circle cx={C} cy={C} r={R_CORE - 11} fill="none" stroke={LIVE} strokeWidth="1" />
                  <circle cx={C} cy={C} r={R_CORE + 13} fill="none" stroke={LIVE} strokeWidth="1" strokeOpacity="0.5" />
                </g>

                <g data-token transform={`translate(${SATELLITES[MOVE_TO].x - C} ${SATELLITES[MOVE_TO].y - C})`}>
                  <g transform={`translate(${C} ${C})`}>
                    <rect x="-7" y="-7" width="14" height="14" fill={LIVE} transform="rotate(45)" />
                  </g>
                </g>
              </svg>

              {SATELLITES.map((s) => (
                <span
                  key={s.label}
                  data-node-label
                  className="absolute -translate-y-1/2 whitespace-nowrap text-caption-mono text-white/45"
                  style={{
                    left: `${s.leftPct}%`,
                    top: `${s.topPct}%`,
                    transform:
                      s.align === "center"
                        ? "translate(-50%, -50%)"
                        : s.align === "end"
                          ? "translate(-100%, -50%)"
                          : "translate(0, -50%)",
                  }}
                >
                  {s.label}
                </span>
              ))}
            </div>
          </div>

          {/* ── los beats ────────────────────────────────────────────────── */}
          <div className="col-span-12 space-y-20 lg:col-span-5 lg:col-start-1 lg:row-start-1 group-data-[stack=on]/stack:relative group-data-[stack=on]/stack:h-[50svh] group-data-[stack=on]/stack:space-y-0">
            {CAPABILITY_ITEMS.map((cap) => (
              <div
                key={cap.id}
                data-beat
                className="group-data-[stack=on]/stack:absolute group-data-[stack=on]/stack:inset-x-0 group-data-[stack=on]/stack:top-0"
              >
                <p className="text-caption-mono text-white/40">
                  {cap.index} — {cap.eyebrow}
                </p>
                <h3 className="mt-6 max-w-[16ch] text-h2 text-pretty">{cap.title}</h3>
                <p className="mt-6 max-w-[46ch] text-body text-white/70 text-pretty">{cap.body}</p>
                <Link
                  href={cap.href}
                  className="mt-8 inline-flex items-center gap-2 border-b border-white/30 pb-1 text-label text-white transition-colors hover:border-white"
                >
                  {cap.linkLabel}
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}
