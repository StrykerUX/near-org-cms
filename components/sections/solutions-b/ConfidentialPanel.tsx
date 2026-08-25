"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import CtaPill from "@/components/primitives/CtaPill";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { EASE_OUT, DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { SPOTLIGHT } from "@/components/sections/solutions/solutionsContent";

// §3 — el corte oscuro, en el vocabulario del conmutador.
//
// ── La figura: el mismo panel, con la mitad tapada ────────────────────────
//
// Toda la propuesta B habla en un solo dibujo: un panel de conexión con jacks y
// cables. Esta sección no cambia de tema, cambia de estado — el panel sigue ahí
// y lo que pasa es que el tramo del medio deja de poder leerse. Los extremos son
// públicos, el recorrido no.
//
// Es literalmente lo que el copy afirma («keeps transfers, deposits,
// withdrawals, and swaps out of public view, with selective disclosure when
// institutions need it»), y es la razón de que uno de los cables SÍ atraviese la
// zona en verde y a trazo pleno: eso es la divulgación selectiva. Sin ese único
// cable legible, la figura diría «nada se ve», que es otra promesa.
//
// ── El velado son segmentos, no un desenfoque ─────────────────────────────
//
// Un blur dice «está mal enfocado». Los segmentos dicen «hay algo y no sabés
// qué», que es lo que hace la confidencialidad. La misma decisión que toma la
// figura equivalente de la propuesta A, por el mismo motivo.

const W = 520;
const H = 260;
const JACKS = 7;
const INSET = 40;
const TOP_Y = 34;
const BOT_Y = H - 34;
const jackX = (i: number) => INSET + (i / (JACKS - 1)) * (W - INSET * 2);

const LIVE = "#00b96f";

// La franja opaca del medio: donde el recorrido deja de ser público.
const BAND_TOP = H / 2 - 46;
const BAND_H = 92;

const CABLES = [
  { from: 0, to: 4 },
  { from: 2, to: 6 },
  { from: 3, to: 1, live: true },
  { from: 5, to: 2 },
  { from: 6, to: 5 },
];

const cable = (from: number, to: number) =>
  `M ${jackX(from)} ${TOP_Y} C ${jackX(from)} ${TOP_Y + 82} ${jackX(to)} ${BOT_Y - 82} ${jackX(to)} ${BOT_Y}`;

export default function ConfidentialPanel() {
  const rootRef = useMotionScope<HTMLElement>(({ q, motionOk }) => {
    if (!motionOk) return;

    const tl = gsap.timeline({
      defaults: { ease: EASE_OUT },
      scrollTrigger: {
        trigger: q("[data-conf-item]")[0],
        start: "top 85%",
        once: true,
        markers: DEBUG_MARKERS,
      },
    });

    tl.from(q("[data-conf-item]"), { autoAlpha: 0, y: 20, duration: 0.6, stagger: 0.09 }, 0)
      .fromTo(
        q("[data-conf-cable]"),
        { strokeDasharray: 100, strokeDashoffset: 100 },
        { strokeDashoffset: 0, duration: 0.7, stagger: 0.06, ease: "power2.inOut" },
        0.25
      )
      // La banda llega ÚLTIMA. Es el punto del dibujo: primero se ve el
      // recorrido entero y después deja de verse. Apareciendo antes, no hay
      // nada que ocultar.
      .from(q("[data-conf-band]"), { autoAlpha: 0, duration: 0.5 }, 0.85);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  });

  return (
    <section ref={rootRef} data-nav-dark className="bg-ink-slate py-28 text-white">
      <Container>
        <div className="grid-ds items-center gap-y-14">
          <div className="col-span-12 lg:col-span-5">
            <p data-conf-item className="text-caption-mono uppercase text-white/40">
              {SPOTLIGHT.eyebrow}
            </p>
            <h2 data-conf-item className="mt-7 max-w-[14ch] text-h1 text-pretty">
              Give your users
              <br />
              <Accent>confidentiality</Accent>
            </h2>
            <p data-conf-item className="mt-9 max-w-[46ch] text-body-lg text-white/70 text-pretty">
              {SPOTLIGHT.body}
            </p>
            <div data-conf-item className="mt-11">
              <CtaPill href={SPOTLIGHT.link.href} tone="solid" external>
                {SPOTLIGHT.link.label}
              </CtaPill>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full text-white" aria-hidden="true">
              <rect
                x="1"
                y="1"
                width={W - 2}
                height={H - 2}
                rx="14"
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.18"
              />

              {CABLES.map((c, i) => (
                <path
                  key={i}
                  data-conf-cable
                  d={cable(c.from, c.to)}
                  fill="none"
                  stroke={c.live ? LIVE : "currentColor"}
                  strokeOpacity={c.live ? 1 : 0.3}
                  strokeWidth={c.live ? 1.75 : 1.25}
                  strokeLinecap="round"
                  pathLength={100}
                />
              ))}

              {/* La banda. Va ENCIMA de los cables y por debajo del cable vivo
                  no: el orden del markup la deja tapando a los cinco, y el
                  cable verde se vuelve a dibujar después para que sea el único
                  que la atraviesa legible. */}
              <g data-conf-band>
                <rect
                  x="1"
                  y={BAND_TOP}
                  width={W - 2}
                  height={BAND_H}
                  fill="#222627"
                />
                {/* Los segmentos: el aspecto de un dato ilegible. */}
                {Array.from({ length: 5 }, (_, i) => {
                  const y = BAND_TOP + 18 + i * 14;
                  return (
                    <line
                      key={i}
                      x1={26 + (i % 2) * 18}
                      y1={y}
                      x2={W - 26 - ((i + 1) % 2) * 40}
                      y2={y}
                      stroke="currentColor"
                      strokeOpacity="0.16"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray="2 9"
                    />
                  );
                })}
              </g>

              {/* La divulgación selectiva: el único recorrido que sí se puede
                  leer de punta a punta. */}
              <path
                d={cable(3, 1)}
                fill="none"
                stroke={LIVE}
                strokeWidth="1.75"
                strokeLinecap="round"
              />

              {[TOP_Y, BOT_Y].map((y) =>
                Array.from({ length: JACKS }, (_, i) => {
                  const used = CABLES.some((c) => (y === TOP_Y ? c.from : c.to) === i);
                  const live = (y === TOP_Y ? 3 : 1) === i;
                  return (
                    <circle
                      key={`${y}-${i}`}
                      cx={jackX(i)}
                      cy={y}
                      r="4.5"
                      fill={live ? LIVE : used ? "currentColor" : "none"}
                      fillOpacity={live ? 1 : used ? 0.6 : 0}
                      stroke="currentColor"
                      strokeOpacity={used ? 0 : 0.25}
                    />
                  );
                })
              )}
            </svg>
          </div>
        </div>
      </Container>
    </section>
  );
}
