"use client";

import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { MQ, DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { HERO_UNIT } from "@/components/sections/home-v2/heroGeometry";
import { STAIR_CAPS, u } from "./labStairGeometry";
import { createStatementSweep } from "./labTextSweep";
import LabStatement from "./LabStatement";

// ── Approach C · "zócalo": misma reja, mismo mecanismo, otro reloj ───────────
//
// La sonda barata. No cambia la estructura ni la geometría: las tres piezas por
// columna siguen ahí, el margen negativo sigue siendo `-u·1.5 - 2px`, el bloque
// uniforme sigue tapando la juntura. Lo único que cambia son dos líneas del reloj.
//
// ── El diagnóstico que esto prueba o mata ────────────────────────────────────
// Producción escalona los escalones en el TIEMPO (`at = 0.15 + ring * 0.2`) pero les
// da a los tres la misma `duration: 0.4`. Eso produce lo peor de los dos mundos:
//
//   · Como los recorridos son 402 / 268 / 134px y la duración es la misma, las
//     velocidades difieren 3×. Eso NO es el bug: es justamente lo que mantiene la
//     proporción, porque a igual fracción de tween los tres están a 402f / 268f / 134f
//     — o sea la silueta es una escalera bien proporcionada en todo instante.
//   · Lo que rompe la silueta es el `at` escalonado: mientras el par exterior crece,
//     los otros dos siguen clavados en cero. Al 40% del recorrido lo que se ve no es
//     una escalera, son DOS TORRES en los extremos sobre una barra plana. Y en el
//     primer 15.8% no se ve ni eso: solo la barra.
//
// Así que la corrección es quitar el stagger, no agregar curvas. Los tres escalones
// arrancan en 0, con la misma duración y la misma ease — y la proporción 3:2:1 sale
// gratis, en cada frame, sin coordinar nada.
//
// ── Lo que este approach NO arregla, y hay que mirar con eso en mente ────────
// El bloque uniforme abarca las SIETE columnas, así que por debajo de la juntura la
// silueta sigue siendo un rectángulo de ancho completo, y su alto es exactamente el
// scroll acumulado. Lo que cambia es que ahora hay escalera ENCIMA desde el primer
// píxel, así que se lee como "escalera sobre un zócalo" y no como una barra.
//
// Medido con node sobre un viewport de 1877×1050 (u = 268px), `stepSpan = 0.5` y
// `power2.out`, contra producción en el mismo punto:
//
//   scroll   escalera / zócalo        producción
//    10px      21 /  10   2.1×          0 /  10   ← barra pura
//    50px      99 /  50   2.0×          0 /  50   ← barra pura
//   110px     199 / 110   1.8×          0 / 110   ← el momento de la captura
//   200px     312 / 200   1.6×        101 / 200
//
// La relación se queda en ~2× durante todo el arranque y nunca hay un instante de
// barra sola, que es el defecto. Pero el zócalo existe siempre y crece con el scroll:
// eso es el techo de este approach, y la razón de que B exista.
//
// Eliminar el zócalo requiere cambiar la forma que ocupa esa zona, no su reloj — eso
// es el approach B (`LabHeroCarve` + `LabBarsStatic`). Si este zócalo se lee
// aceptable, no hace falta tocar la geometría y esto es todo el cambio.

// Qué fracción del recorrido tarda el bloque uniforme en tapar la juntura. Sigue
// siendo casi instantáneo, como hoy (12.6%): es una TAPA, no parte de la figura, y
// cualquier demora acá abre franja de crema entre el vídeo y el gris.
const CORE_SPAN = 0.13;

// Los escalones cargan el grueso de su recorrido al principio. Con la misma ease y la
// misma duración para los tres, la ease no puede desproporcionar la silueta — solo
// adelanta o atrasa el conjunto. Es lo que hace que la escalera esté definida antes de
// que el zócalo tenga alto para competir con ella.
const STEP_EASE = "power2.out";

export default function LabBarsProportional({
  /** Fracción del recorrido que ocupan los escalones. Más bajo = escalera antes. */
  stepSpan = 0.5,
}: {
  stepSpan?: number;
}) {
  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const cols = q("[data-qbar-col]");
      const stage = q("[data-quantum='stage']")[0];
      if (cols.length !== STAIR_CAPS.length || !stage) return;

      // El `start` es una función porque tiene que anclar el progreso a la posición
      // DOCUMENTAL de las barras: la sección se solapa con el hero, así que su top ya
      // está por encima del fondo del viewport cuando la página carga. Sin este ajuste
      // el scrub arrancaría con progress > 0.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scope,
          start: () => {
            const top = scope.getBoundingClientRect().top + window.scrollY;
            return `top+=${Math.max(0, window.innerHeight - top)} bottom`;
          },
          endTrigger: stage,
          end: "center center",
          scrub: true,
          invalidateOnRefresh: true,
          markers: DEBUG_MARKERS,
        },
      });

      // Fija el largo del timeline en 1 para que los `duration` de abajo se lean
      // directamente como FRACCIÓN DEL RECORRIDO DE SCROLL. Sin esto el largo lo
      // define el tween más largo, así que cambiar `stepSpan` movería también el
      // momento en que el core tapa la juntura — que es lo único que no se debe
      // mover.
      tl.to({}, { duration: 1 }, 0);

      cols.forEach((col) => {
        const core = col.querySelector<HTMLElement>("[data-qbar-core]");
        const top = col.querySelector<HTMLElement>("[data-qbar-top]");
        const bottom = col.querySelector<HTMLElement>("[data-qbar-bottom]");

        // `top` y NO `center` en el bloque uniforme: con origen `top` su borde
        // superior queda clavado en la juntura sea cual sea el `scaleY`, así que el
        // solape con el vídeo existe desde el primer frame. Con `center` el bloque se
        // abre hacia los dos lados y en los primeros ~75px de scroll asoma el crema.
        gsap.set(core, { scaleY: 0, transformOrigin: "top" });
        if (top) gsap.set(top, { scaleY: 0, transformOrigin: "bottom" });
        if (bottom) gsap.set(bottom, { scaleY: 0, transformOrigin: "top" });

        tl.to(core, { scaleY: 1, duration: CORE_SPAN, ease: "none" }, 0);

        // La única diferencia con producción: posición 0 para todos los anillos (en
        // vez de `0.15 + ring * 0.2`) y una ease compartida.
        if (top) tl.to(top, { scaleY: 1, duration: stepSpan, ease: STEP_EASE }, 0);
        if (bottom) tl.to(bottom, { scaleY: 1, duration: stepSpan, ease: STEP_EASE }, 0);
      });

      const line = q("[data-quantum='line']")[0];
      const shine = q("[data-quantum='shine']")[0];
      return line && shine ? createStatementSweep(stage, line, shine) : undefined;
    });

    return () => mm.revert();
  }, []);

  return (
    // Idéntico a producción: `-u·1.5 - 2px` deja el bloque uniforme empezando justo en
    // `100svh`, el píxel donde termina el vídeo. Los 2px son costura antisubpíxel.
    <section
      ref={rootRef}
      style={
        {
          "--u": HERO_UNIT,
          marginTop: "calc(-1 * var(--u) * 1.5 - 2px)",
        } as React.CSSProperties
      }
      className="relative z-[2] text-foreground"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 flex">
          {STAIR_CAPS.map((cap, i) => (
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

      <LabStatement />
    </section>
  );
}
