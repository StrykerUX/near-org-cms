"use client";

import Image from "next/image";
import Container from "@/components/primitives/Container";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { gsap, ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import {
  DEFAULT_CURVE,
  CURVES,
  type CurveKey,
  descentFn,
  descentHold,
} from "./descentCurves";
import DescentDebug, { useDescentReadout } from "./DescentDebug";

// ── La maqueta del laboratorio ───────────────────────────────────────────────
//
// Reproduce SOLO la geometría que participa del problema del descenso del hero, y
// nada más. No hay vídeo (un póster estático en su lugar), ni SplitText, ni velos,
// ni el barrido del texto. Eso es lo que hace que una iteración cueste segundos en
// lugar de minutos, y aísla las dos cosas que fallaron dos veces en la página real:
// el ritmo y la juntura.
//
// Es un sandbox: duplica geometría de `home-v2/HeroVideo` y `home-v2/QuantumBars` a
// propósito, con el mismo criterio que `views/FlowCompareView` ("está duplicado
// porque es un sandbox — si divergen no rompe nada de producción"). Lo que se llevará
// a `home-v2/` es el approach ganador, no este archivo.
//
// ── La geometría, que es lo único que hay que respetar al milímetro ───────────
// De `--u` (el ancho de una de las 7 columnas) cuelga todo:
//
//   hero            = 100svh
//   barras          = marginTop -u*1.5 - 2px   (montan sobre el final del hero)
//   core (la tapa)  = de u*1.5 a u*1.5 de la capa
//   statement       = py u*2
//
// El borde superior del core cae así ~2px por encima del fondo del hero: los 2px son
// costura antisubpíxel. Ese solape es lo que impide que se vea la página entre las dos
// capas, y es lo que el panel `?debug` mide como `gap`.

const HERO_UNIT = "calc(100vw / 7)";

// El mapa de escalones de QuantumBars, tal cual. `offset + height` suma siempre 1.5,
// así que las siete columnas terminan a la misma altura. La central es el valle.
const COLUMNS: ({ offset: number; height: number } | null)[] = [
  { offset: 0, height: 1.5 },
  { offset: 0.5, height: 1 },
  { offset: 1, height: 0.5 },
  null,
  { offset: 1, height: 0.5 },
  { offset: 0.5, height: 1 },
  { offset: 0, height: 1.5 },
];

const u = (n: number) => `calc(var(--u) * ${n})`;

// ── Reparto del crecimiento de la escalera ───────────────────────────────────
// El core va primero y rápido: es la TAPA, no la figura (ver `CORE_IS_A_LID` en
// descentCurves.ts). Los escalones entran temprano y se pisan, para que la figura se
// reconozca antes.
const CORE_DUR = 0.12;
const STEP_AT = 0.04;
const STEP_STAGGER = 0.13;
const STEP_DUR = 0.4;

// Recorrido extra del track en el approach `shared`, en svh.
const SHARED_TRAVEL = "80svh";

export type Approach =
  /** Sin motion: el baseline. Sirve para comprobar que la maqueta reproduce la página real. */
  | "none"
  /** Retención del hero por transform, con el core exento de la curva. */
  | "hold"
  /** Hero y barras dentro de un mismo track sticky: la juntura es rígida por construcción. */
  | "shared"
  /** El hero no se traslada; el ritmo lo da solo su contenido interno. */
  | "inner";

const LABEL: Record<Approach, string> = {
  none: "baseline (lineal, sin descenso)",
  hold: "A · retención por transform",
  shared: "B · track compartido",
  inner: "C · sin traslación",
};

export type DescentStageProps = {
  approach: Approach;
  /** Enciende el HUD de medición. Lo resuelve la página desde `?debug`. */
  debug?: boolean;
  /** Curva a usar. La página la resuelve desde `?curve=a..f`. */
  curve?: CurveKey;
};

// El flag y la curva llegan por PROP, resueltos por el server component de cada
// ruta, y no se leen acá de la URL. Las tres alternativas eran peores:
// `useSearchParams` obliga a envolver la página en Suspense; leer `window` en el
// primer render da mismatch de hidratación; y leerlo en un efecto con setState
// dispara renders en cascada (lo marca el lint de React, con razón).
export default function DescentStage({
  approach,
  debug = false,
  curve: curveKey = DEFAULT_CURVE,
}: DescentStageProps) {
  const readout = useDescentReadout(debug);

  const shared = approach === "shared";

  // El scope va en un WRAPPER que contiene el hero, las barras y la sección
  // siguiente — no en el hero.
  //
  // Es la causa del primer fallo del laboratorio: `gsap.utils.selector` busca
  // DESCENDIENTES y no incluye el elemento raíz, así que con el scope en la sección
  // del hero, `q("[data-lab-hero]")` devolvía undefined y el guard salía sin crear
  // nada. Las barras tampoco entraban, porque son hermanas del hero. Solo el approach
  // `shared` funcionaba, y por accidente: ahí las dos cosas SÍ están dentro del track.
  const rootRef = useMotionScope<HTMLDivElement>(({ q, motionOk }) => {
    if (!motionOk) return;

    // Solo se necesita la curva como FUNCIÓN: los tweens de las barras van en
    // `ease: "none"` y el ritmo se aplica al progreso del timeline, no tween por
    // tween. El nombre registrado (`descentEaseName`) queda disponible por si algún
    // approach quiere pasarlo como `ease` de un tween normal.
    const ease = descentFn(curveKey);

    const hero = q("[data-lab-hero]")[0];
    const track = q("[data-lab-track]")[0];
    const art = q("[data-lab-art]")[0];
    const cols = q("[data-qbar-col]");
    if (!hero || cols.length !== COLUMNS.length) return;

    // ── El crecimiento de la escalera ────────────────────────────────────────
    // Timeline pausado y conducido a mano: es la forma de que el reloj de la escena
    // pase por la curva en vez de que cada barra lleve su propio ease (que daría una
    // curva por barra y difuminaría el punto de quiebre entre las siete).
    //
    // El CORE queda FUERA de ese reloj y crece con su propio tween lineal. Es la
    // lección del intento que falló: el core es la tapa de la juntura, y ralentizarlo
    // abre la franja. Ver `CORE_IS_A_LID`.
    const figure = gsap.timeline({ paused: true });
    const lid = gsap.timeline({ paused: true });

    cols.forEach((col, i) => {
      const core = col.querySelector<HTMLElement>("[data-qbar-core]");
      const top = col.querySelector<HTMLElement>("[data-qbar-top]");
      const bottom = col.querySelector<HTMLElement>("[data-qbar-bottom]");

      // `transformOrigin: top` en el core no es estético: clava su borde superior en
      // `u*1.5` sea cual sea el scaleY, así que el solape con el hero existe desde el
      // primer frame. Con `center` el borde arranca más abajo y se ve la página.
      gsap.set(core, { scaleY: 0, transformOrigin: "top" });
      if (top) gsap.set(top, { scaleY: 0, transformOrigin: "bottom" });
      if (bottom) gsap.set(bottom, { scaleY: 0, transformOrigin: "top" });

      lid.to(core, { scaleY: 1, duration: CORE_DUR, ease: "none" }, 0);

      const ring = Math.min(i, cols.length - 1 - i);
      const at = STEP_AT + ring * STEP_STAGGER;
      if (top) figure.to(top, { scaleY: 1, duration: STEP_DUR, ease: "none" }, at);
      if (bottom) figure.to(bottom, { scaleY: 1, duration: STEP_DUR, ease: "none" }, at);
    });

    // ── El recorrido ─────────────────────────────────────────────────────────
    const setHeroY = gsap.quickSetter(hero, "y", "px") as (v: number) => void;
    const setArtY = art ? (gsap.quickSetter(art, "y", "px") as (v: number) => void) : null;

    // El transform se resetea antes de cada re-medición: getBoundingClientRect
    // incluye los transforms, y el hero es su propio trigger.
    const reset = () => {
      setHeroY(0);
      setArtY?.(0);
    };
    ScrollTrigger.addEventListener("refreshInit", reset);

    let span = 0;

    const st = ScrollTrigger.create({
      // El trigger es explícito y NO el scope: el scope ahora envuelve también la
      // sección siguiente, así que medir contra él daría un recorrido mucho más largo
      // que la salida del hero.
      trigger: shared ? track : hero,
      start: "top top",
      // En `shared` el recorrido es el del track completo; en el resto, la salida
      // del hero.
      end: shared ? "bottom bottom" : () => `+=${hero.offsetHeight}`,
      invalidateOnRefresh: true,
      markers: DEBUG_MARKERS,
      onRefresh: (self) => {
        span = self.end - self.start;
      },
      onUpdate: (self) => {
        const p = self.progress;
        // El baseline usa el progreso crudo en todo: es la referencia contra la que se
        // compara, o sea el comportamiento lineal que la página tiene hoy.
        const eased = approach === "none" ? p : ease(p);

        // La tapa avanza LINEAL con el scroll. La figura, por la curva.
        lid.progress(p);
        figure.progress(eased);

        let hold = 0;
        if (approach === "hold" || approach === "shared") {
          hold = descentHold(p, span, ease);
          setHeroY(hold);
        }
        if (approach === "inner") {
          // El hero no se mueve; su contenido interno sí. Es lo que hace el scrub
          // del vídeo en la página real, sin tocar la caja del hero.
          setArtY?.(-descentHold(p, span, ease));
        }

        if (debug) {
          hero.dataset.labProgress = String(p);
          hero.dataset.labHold = String(hold);
        }
      },
    });
    span = st.end - st.start;

    return () => {
      ScrollTrigger.removeEventListener("refreshInit", reset);
      reset();
      lid.progress(1);
      figure.progress(1);
    };
  }, [approach, curveKey, debug]);

  const artwork = (
    <div
      data-lab-art
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <Image
        src="/prototype/v2/hero-descent-poster.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-bottom"
      />
    </div>
  );

  const heroCopy = (
    <Container className="relative z-[1] flex flex-1 flex-col items-center justify-center gap-6 text-center">
      <h1 className="text-display">Own your world.</h1>
      <p className="max-w-xl text-body-lg text-muted-foreground">
        Maqueta del laboratorio — la geometría del hero y de la escalera, sin vídeo ni
        texto animado.
      </p>
    </Container>
  );

  const bars = (
    <section
      style={
        {
          "--u": HERO_UNIT,
          // En `shared` la capa de barras vive DENTRO del track, así que no necesita
          // montar sobre nada: se posiciona al fondo del sticky.
          ...(shared ? {} : { marginTop: "calc(-1 * var(--u) * 1.5 - 2px)" }),
        } as React.CSSProperties
      }
      className={shared ? "relative z-[2]" : "relative z-[2] text-foreground"}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 flex">
          {COLUMNS.map((cap, i) => (
            <div key={i} data-qbar-col className="relative flex-1">
              <div
                data-qbar-core
                className="absolute inset-x-0 bg-bar"
                style={{ top: u(1.5), bottom: u(1.5) }}
              />
              {cap && (
                <>
                  <div
                    data-qbar-top
                    className="absolute inset-x-0 bg-bar"
                    style={{ top: u(cap.offset), height: `calc(${u(cap.height)} + 1px)` }}
                  />
                  <div
                    data-qbar-bottom
                    className="absolute inset-x-0 bg-bar"
                    style={{ bottom: u(cap.offset), height: `calc(${u(cap.height)} + 1px)` }}
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <Container className="relative py-[calc(var(--u)*2)]">
        <p className="text-h2 text-pretty">
          El statement de la sección 2. Si esto se lee sobre el gris oscuro en algún
          punto del recorrido, el approach está descartado.
        </p>
      </Container>
    </section>
  );

  return (
    <>
      {debug && (
        <DescentDebug
          approach={LABEL[approach]}
          curve={`${curveKey} · ${CURVES[curveKey].label}`}
          readout={readout}
        />
      )}

      {/* El ref va en este wrapper y no en el hero: el scope tiene que abarcar el
          hero Y las barras, que en los approaches sin track son hermanas. */}
      <div ref={rootRef}>
        {shared ? (
          // ── B · track compartido ────────────────────────────────────────────
          // Hero y barras dentro del MISMO contenedor sticky. La juntura es rígida
          // por construcción: las dos capas son hijas del mismo elemento, así que
          // ningún ritmo puede separarlas.
          //
          // Ojo con lo que esto cuesta: durante el pin, todo lo que viene después
          // espera. El track añade SHARED_TRAVEL de scroll a la página, y la escalera
          // solo puede crecer dentro de ese tramo.
          <section
            data-lab-track
            style={
              {
                "--u": HERO_UNIT,
                height: `calc(100svh + ${SHARED_TRAVEL})`,
              } as React.CSSProperties
            }
            className="relative bg-cream text-foreground"
          >
            <div className="sticky top-0 h-svh overflow-hidden">
              <div data-lab-hero className="relative flex h-full flex-col">
                {artwork}
                {heroCopy}
              </div>
              <div className="absolute inset-x-0 bottom-0">{bars}</div>
            </div>
          </section>
        ) : (
          <>
            <section
              data-lab-hero
              style={{ "--u": HERO_UNIT, height: "100svh" } as React.CSSProperties}
              className="relative flex flex-col bg-cream text-foreground"
            >
              {artwork}
              {heroCopy}
            </section>
            {bars}
          </>
        )}

        {/* Algo después de la escalera, para que el statement no sea lo último del
            documento y se pueda ver si el marco se le mete encima. */}
        <section className="bg-background py-40">
          <Container>
            <p className="text-body-lg text-muted-foreground">
              Sección siguiente. Si el marco de barras invade esta zona o deja un hueco
              contra ella, el approach mueve algo que está en flujo.
            </p>
          </Container>
        </section>
      </div>
    </>
  );
}
