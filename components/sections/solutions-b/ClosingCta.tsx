"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import CtaPill from "@/components/primitives/CtaPill";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { EASE_OUT, DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { CLOSING, SOLUTIONS } from "@/components/sections/solutions/solutionsContent";

// §5 — el cierre, y el eco del conmutador.
//
// La página abrió con un tablero de cinco entradas y cierra con las cinco
// enchufadas a la vez: el mismo objeto en su estado final. Un lector que
// reconoce la rima cierra el recorrido; uno que no la reconoce igual ve una
// figura de «cinco caminos, un destino», que es lo que el copy del cierre dice.
//
// `CtaPill` se importa de `quantum/` y no se copia: el contrato de sections
// permite `@/components/sections/*`, todo el mecanismo de hover vive en
// `[data-q-cta]` en `globals.css`, y una segunda copia acá sería una segunda
// cosa que mantener en sincronía con esa regla.

const W = 440;
const H = 200;
const JACKS = SOLUTIONS.length;
const INSET = 44;
const TOP_Y = 26;
const BOT_Y = H - 26;
const jackX = (i: number) => INSET + (i / (JACKS - 1)) * (W - INSET * 2);
const CENTER = W / 2;

const LIVE = "#00b96f";

export default function ClosingCta() {
  const rootRef = useMotionScope<HTMLElement>(({ q, motionOk }) => {
    if (!motionOk) return;

    const tl = gsap.timeline({
      defaults: { ease: EASE_OUT },
      scrollTrigger: {
        trigger: q("[data-close-item]")[0],
        start: "top 85%",
        once: true,
        markers: DEBUG_MARKERS,
      },
    });

    tl.from(q("[data-close-item]"), { autoAlpha: 0, y: 22, duration: 0.6, stagger: 0.08 }, 0)
      .fromTo(
        q("[data-close-cable]"),
        { strokeDasharray: 100, strokeDashoffset: 100 },
        // Desde el centro hacia afuera: el tablero se ENCHUFA, en vez de
        // barrer de una punta a la otra.
        {
          strokeDashoffset: 0,
          duration: 0.65,
          stagger: { each: 0.06, from: "center" },
          ease: "power2.inOut",
        },
        0.25
      )
      .from(q("[data-close-sink]"), { scale: 0, transformOrigin: "center", duration: 0.4 }, 0.8);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  });

  return (
    <section ref={rootRef} data-nav-dark className="bg-ink py-28 text-white">
      <Container>
        <div className="grid-ds items-center gap-y-14">
          <div className="col-span-12 lg:col-span-6">
            <p data-close-item className="text-caption-mono uppercase text-white/40">
              Start here
            </p>
            <h2 data-close-item className="mt-6 max-w-[12ch] text-h1 text-pretty">
              Build <Accent>on NEAR</Accent>
            </h2>
            <p data-close-item className="mt-9 max-w-[46ch] text-body-lg text-white/70 text-pretty">
              {CLOSING.subhead}
            </p>

            {/* Dos CTA y no uno: el copy los pide, y son dos públicos que no se
                pisan — quien va a leer docs no va a escribirle a ventas. El
                `solid` es el primario y el `dark` el par de menor peso; dos
                botones del mismo tono compiten y ninguno gana. */}
            <div data-close-item className="mt-11 flex flex-wrap gap-4">
              <CtaPill href={CLOSING.primary.href} tone="solid" external>
                {CLOSING.primary.label}
              </CtaPill>
              <CtaPill href={CLOSING.secondary.href} tone="dark">
                {CLOSING.secondary.label}
              </CtaPill>
            </div>
          </div>

          {/* ── el tablero, enchufado ─────────────────────────────────────
              Cinco jacks arriba —uno por solución— y un solo destino abajo. Es
              el panel de `switchArt` con todos los cables puestos a la vez, que
              es el único estado que ninguna pestaña muestra. */}
          <div className="col-span-12 lg:col-span-5 lg:col-start-8">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full text-white" aria-hidden="true">
              <rect
                x="1"
                y="1"
                width={W - 2}
                height={H - 2}
                rx="14"
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.2"
              />

              {SOLUTIONS.map((s, i) => (
                <path
                  key={s.id}
                  data-close-cable
                  d={`M ${jackX(i)} ${TOP_Y} C ${jackX(i)} ${TOP_Y + 72} ${CENTER} ${BOT_Y - 72} ${CENTER} ${BOT_Y}`}
                  fill="none"
                  stroke={LIVE}
                  strokeOpacity="0.55"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  pathLength={100}
                />
              ))}

              {SOLUTIONS.map((s, i) => (
                <circle key={`j-${s.id}`} cx={jackX(i)} cy={TOP_Y} r="4.5" fill="#ffffff" />
              ))}

              {/* El destino. Dos anillos, para que lea como el mismo tipo de
                  objeto que el nodo verde del conmutador. */}
              <circle data-close-sink cx={CENTER} cy={BOT_Y} r="8" fill={LIVE} />
              <circle
                data-close-sink
                cx={CENTER}
                cy={BOT_Y}
                r="16"
                fill="none"
                stroke={LIVE}
                strokeWidth="1"
                strokeOpacity="0.45"
              />
            </svg>

            {/* Las etiquetas van en HTML y no en `<text>`: así conservan la
                escala mono de la página en vez de quedar multiplicadas por la
                escala del viewBox. */}
            <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2">
              {SOLUTIONS.map((s) => (
                <span
                  key={`l-${s.id}`}
                  data-close-item
                  className="text-caption-mono text-white/40"
                >
                  {s.title}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
