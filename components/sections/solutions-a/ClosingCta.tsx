"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import CtaPill from "@/components/primitives/CtaPill";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { EASE_OUT, DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { CTA_RAMP } from "@/components/primitives/motion/motionColors";
import { CLOSING, SOLUTIONS } from "@/components/sections/solutions/solutionsContent";

// §6 — el cierre, y el bookend de la página.
//
// El hero abre con un índice de cinco entradas leyéndose de arriba abajo. Esto
// es ese mismo índice leído desde el otro lado: **un punto que se abre en cinco
// rutas**. La misma información, la dirección invertida — un lector que reconoce
// la rima cierra el recorrido, y uno que no la reconoce igual ve un diagrama de
// «un stack, cinco salidas», que es lo que el copy afirma.
//
// El abanico sale de `chain/BuildersCta`, donde cierra `/chain-abstraction` con
// exactamente el mismo argumento (write once, reach everywhere). Acá los radios
// no son chains sino las cinco soluciones, así que son cinco y no doce: con las
// etiquetas reales al final de cada uno, el abanico se puede leer entero.
//
// `CtaPill` se importa de `quantum/` y no se copia: el contrato de sections
// permite `@/components/sections/*`, y todo el mecanismo de hover vive en
// `[data-q-cta]` en `globals.css` — una segunda copia acá sería una segunda cosa
// que mantener en sincronía con esa regla.

const PATH_LEN = 100;

const W = 460;
const H = 360;
// El origen del abanico: borde izquierdo, centrado en vertical. El stack.
const OX = 12;
const OY = H / 2;
const RAYS = SOLUTIONS.length;
const ENDPOINTS = SOLUTIONS.map((s, i) => ({
  id: s.id,
  label: s.title,
  x: W - 150,
  // El inset deja los radios extremos despegados del techo y del piso de la
  // caja, así que el abanico se lee como un grupo y no como algo recortado.
  y: 22 + (i / (RAYS - 1)) * (H - 44),
}));

export default function ClosingCta() {
  const rootRef = useMotionScope<HTMLElement>(({ q, motionOk }) => {
    if (!motionOk) return;

    // Anclado al primer elemento animado y no a la sección: con `py-[16svh]` el
    // borde de la sección queda ~155px por encima del eyebrow, y disparar ahí
    // hace que el abanico se dibuje entero antes de que el lector lo vea.
    const tl = gsap.timeline({
      defaults: { ease: EASE_OUT },
      scrollTrigger: {
        trigger: q("[data-cta-item]")[0],
        start: "top 85%",
        toggleActions: "play none none none",
        markers: DEBUG_MARKERS,
      },
    });


    // Tiempos apretados a propósito: estaban en 0.8–0.95s con stagger de 0.12,
    // o sea ~1.5s de punta a punta. A velocidad de scroll normal el lector
    // atraviesa la sección antes de que termine, así que ve el FINAL de la
    // animación y no la animación — que es lo que se siente como «tarda» o como
    // «no pasó nada». Con el trigger ya anclado al contenido, esto es lo que
    // faltaba para que el gesto entre en la ventana en que la sección está en
    // cuadro.
    tl.from(q("[data-cta-item]"), { y: 26, autoAlpha: 0, duration: 0.6, stagger: 0.08 })
      .fromTo(
        q("[data-ray]"),
        { strokeDasharray: PATH_LEN, strokeDashoffset: PATH_LEN },
        // Desde el medio hacia afuera: el abanico se ABRE, en vez de barrer de
        // una punta a la otra. Es la diferencia entre «llega a todos lados» y
        // «escanea».
        {
          strokeDashoffset: 0,
          duration: 0.7,
          stagger: { each: 0.05, from: "center" },
          ease: "power2.out",
        },
        0.2
      )
      .from(
        q("[data-ray-tip]"),
        { scale: 0, transformOrigin: "center", duration: 0.25, stagger: { each: 0.05, from: "center" } },
        0.6
      )
      .from(q("[data-fan-label]"), { autoAlpha: 0, x: -8, duration: 0.4, stagger: 0.04 }, 0.7);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  });

  return (
    <section ref={rootRef} data-nav-dark className="bg-ink py-[16svh] text-white">
      <Container>
        <div className="grid-ds items-center gap-y-16">
          <div className="col-span-12 lg:col-span-6">
            <p data-cta-item className="text-caption-mono uppercase text-white/40">
              Start here
            </p>

            <h2 data-cta-item className="mt-6 max-w-[12ch] text-h1 text-pretty">
              Build <Accent>on NEAR</Accent>
            </h2>

            <p data-cta-item className="mt-10 max-w-[46ch] text-body-lg text-white/70 text-pretty">
              {CLOSING.subhead}
            </p>

            {/* Dos CTA y no uno: el copy los pide, y son dos públicos que no se
                pisan — quien va a leer docs no va a escribirle a ventas. El
                `solid` es el primario y el `dark` el par de menor peso; dos
                botones del mismo tono compiten y ninguno gana. */}
            <div data-cta-item className="mt-12 flex flex-wrap gap-4">
              <CtaPill href={CLOSING.primary.href} tone="solid" external>
                {CLOSING.primary.label}
              </CtaPill>
              <CtaPill href={CLOSING.secondary.href} tone="dark">
                {CLOSING.secondary.label}
              </CtaPill>
            </div>
          </div>

          {/* ── el abanico ───────────────────────────────────────────────── */}
          <div className="col-span-12 lg:col-span-5 lg:col-start-8">
            <div className="relative mx-auto w-full max-w-[28rem]">
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible" aria-hidden="true">
                {ENDPOINTS.map((p) => (
                  <path
                    key={p.id}
                    data-ray
                    d={`M ${OX} ${OY} L ${p.x} ${p.y}`}
                    fill="none"
                    stroke="rgba(255,255,255,0.28)"
                    strokeWidth="1"
                    // `pathLength` es 100 y no 1 porque GSAP redondea valores en
                    // píxeles por defecto (`autoRound`), y `stroke-dashoffset`
                    // es una propiedad en píxeles: normalizada a 1, el trazo
                    // salta de no dibujado a dibujado sin nada en el medio.
                    pathLength={PATH_LEN}
                  />
                ))}
                {ENDPOINTS.map((p) => (
                  <circle key={`tip-${p.id}`} data-ray-tip cx={p.x} cy={p.y} r="3" fill="var(--sem-background-primary)" />
                ))}
                {/* El stack. Dos anillos, para que lea como el mismo tipo de
                    objeto que el nodo verde del spotlight. */}
                <circle cx={OX} cy={OY} r="9" fill={CTA_RAMP[0]} />
                <circle
                  cx={OX}
                  cy={OY}
                  r="18"
                  fill="none"
                  stroke={CTA_RAMP[0]}
                  strokeWidth="1"
                  strokeOpacity="0.45"
                />
              </svg>

              {/* Las etiquetas van en HTML y no en `<text>`: así conservan la
                  escala mono de la página en vez de quedar multiplicadas por la
                  escala del viewBox. */}
              {ENDPOINTS.map((p) => (
                <span
                  key={`label-${p.id}`}
                  data-fan-label
                  className="absolute -translate-y-1/2 whitespace-nowrap text-caption-mono text-white/45"
                  style={{ left: `${((p.x + 12) / W) * 100}%`, top: `${(p.y / H) * 100}%` }}
                >
                  {p.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
