"use client";

import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { CustomEase, gsap, ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { MQ, DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { HERO_UNIT } from "@/components/sections/home-v2/heroGeometry";
import {
  CARVE,
  CASCADE,
  STAIR_COLUMNS,
  STAIR_DEPTH,
  STAIR_SPAN,
  carveEdges,
  cascadeEdges,
  ringOf,
  stairOffsets,
  u,
} from "./labStairGeometry";
import { createStatementSweep } from "./labTextSweep";
import LabStatement from "./LabStatement";

// ── Approach paneles · el gris se mueve, la imagen no se toca ────────────────
//
// Mismo efecto que `/prototype/descent/talla` y MISMO reloj —los dos llaman a
// `carveEdges`—, pintado de otra forma: en vez de recortar la imagen del hero, cada
// columna es un panel gris que se escala con `scaleY` y origen abajo, pintando POR ENCIMA
// del hero como en producción.
//
// Escalar un rectángulo de color plano es gratis y no lo distorsiona; escalar una imagen
// no. De ahí que el tallado necesitara un `clip-path` y esto no necesite nada.
//
// ── Los cuatro problemas que esto retira ─────────────────────────────────────
//
//  1. LAS CAPAS. Las barras vuelven a `z-[2]` sobre el hero, como en producción, así que
//     el gris tapa la copy del hero al subir. En el tallado el hero tiene que ir ENCIMA
//     para que su recorte descubra el gris, y ahí la copy solo puede terminar cortada por
//     el recorte o montada sobre el gris. Las dos están mal, y no hay tercera opción
//     dentro de ese apilado — es un defecto estructural del mecanismo, no un bug.
//
//  2. LA INVARIANTE DEL CREMA. En el tallado el borde del recorte no puede subir por
//     encima de donde empieza el gris, o se ve el fondo de la página; eso obligó a estirar
//     el gris hasta el top del hero y a verificar el margen a cada cambio de `depth`. Acá
//     el gris ES el borde: no hay nada que mantener "sobre gris".
//
//  3. EL PAINT. Un `clip-path` animado no va al compositor: paga style recalc y repintado
//     por frame. `scaleY` sí va. Era el único riesgo que el approach del tallado no podía
//     descartar sin medirlo en el navegador.
//
//  4. EL ACOPLAMIENTO. Ya no hay ningún número que las barras tengan que compartir con el
//     hero salvo el excedente de vídeo.
//
// ── Lo que NO retira ─────────────────────────────────────────────────────────
// El excedente de vídeo (`drop`) sigue haciendo falta, y sigue costando su ~12% de
// reencuadre. Por debajo de la juntura, donde el gris de una columna todavía no llegó, hay
// que tener imagen o se ve el crema. Con las barras encima del hero eso funciona igual: el
// vídeo asoma por donde el panel no llegó.
//
// ── Los dos relojes: `?flow=` ────────────────────────────────────────────────
// El mecanismo de pintado (siete `scaleY`) es UNO, pero la `y` de cada anillo puede venir
// de dos relojes distintos, y la perilla `?flow=` los alterna sin recargar nada más:
//
//   · `cascade` (defecto) — `cascadeEdges`. Velocidad de entrada graduada de afuera hacia
//     adentro, los interiores aceleran a mitad de camino para alcanzar a los laterales, y
//     los cuatro aterrizan amortiguados y casi a la par. Es lo que se pidió.
//   · `carve` — `carveEdges`, el reloj original, el mismo que usa `/talla`. Velocidad
//     única, escalonado solo por el arranque, y frenazo contra el borde. Está para el A/B:
//     abrir las dos URLs al lado y ver qué cambió.
//
// Las perillas de cada reloj son distintas y NO se pisan: `depth`/`stagger`/`converge`
// mandan solo en `carve`; `soft`/`spread`/`land`/`lag`/`fast`/`slow`/`settle` solo en
// `cascade`. `drop`, `line` y `?ease=` valen en los dos. `depth` además sigue fijando el
// recorrido del ScrollTrigger y el estado de reposo en los dos casos.

export default function LabBarsPanels({
  flow = "cascade",
  drop = CARVE.drop,
  depth = STAIR_DEPTH,
  carveEase,
  stagger = CARVE.stagger,
  converge = true,
  line = CARVE.line,
  soft = CASCADE.soft,
  spread = CASCADE.spread,
  land = CASCADE.land,
  lag = CASCADE.lag,
  fast = CASCADE.fast,
  slow = CASCADE.slow,
  settle = CASCADE.settle,
  debug = false,
}: {
  flow?: "carve" | "cascade";
  drop?: number;
  depth?: number;
  carveEase?: string;
  stagger?: number;
  converge?: boolean;
  line?: number;
  soft?: number;
  spread?: number;
  land?: number;
  lag?: number;
  fast?: number;
  slow?: number;
  settle?: number;
  debug?: boolean;
}) {
  const bottomOffsets = stairOffsets(STAIR_SPAN);

  const rootRef = useGsapContext<HTMLElement>(
    (_self, scope) => {
      const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        const panels = q("[data-qbar-col]");
        const stage = q("[data-quantum='stage']")[0];
        if (panels.length !== STAIR_COLUMNS || !stage) return;

        CustomEase.create(CARVE.easeName, CARVE.cp);
        // En `cascade` la curva por defecto es la IDENTIDAD, no la CustomEase: toda la
        // forma del movimiento vive en las cúbicas por anillo de `cascadeEdges`, y
        // apilarle encima una curva global volvería a hacer que dos capas peleen por el
        // mismo efecto —que es justo lo que costaba calibrar en el reloj viejo—. `?ease=`
        // sigue disponible como capa extra para quien quiera probar; la garantía de
        // cobertura de `cascadeEdges` aguanta cualquier curva monótona con `e(1) = 1`.
        const fallbackEase = flow === "cascade" ? "none" : CARVE.easeName;
        const parsed = gsap.parseEase(carveEase || fallbackEase);
        const ease =
          typeof parsed === "function"
            ? parsed
            : (gsap.parseEase(fallbackEase) as (v: number) => number);

        // `transformOrigin: bottom` es lo que hace que `scaleY` mueva SOLO el borde
        // superior. El inferior se queda donde el layout lo puso, que es la escalera
        // espejada de abajo — la parte del marco que nadie anima.
        gsap.set(panels, { transformOrigin: "bottom", scaleY: 0 });
        const setScale = panels.map((panel) => gsap.quickSetter(panel, "scaleY") as (v: number) => void);

        // Medidas que solo cambian al redimensionar. `offsetHeight` y `offsetTop` son
        // valores de LAYOUT: no los contamina el `scaleY` que estamos escribiendo, a
        // diferencia de `getBoundingClientRect`. Ese detalle importa acá — leer el rect de
        // un elemento que uno mismo está escalando devuelve el alto ya escalado y el
        // cálculo se realimenta.
        let unitPx = window.innerWidth / STAIR_COLUMNS;
        let viewportH = window.innerHeight;
        let seamDoc = 0;
        let startScroll = 0;
        /** Largo del recorrido en px, y `y` de la juntura al arrancarlo. Los pide `cascade`. */
        let span = 1;
        let seamY0 = 0;
        /** Alto natural de cada panel, y cuánto de él cae por DEBAJO de la juntura. */
        let natural: number[] = [];
        let below: number[] = [];

        const measure = (start: number, end: number) => {
          unitPx = window.innerWidth / STAIR_COLUMNS;
          viewportH = window.innerHeight;
          startScroll = start;
          // La juntura está a `-marginTop` del top de la sección: el margen es
          // exactamente `-(100svh + 2px)`, así que de ahí sale el alto del hero sin
          // tener que buscar el hero en el DOM.
          const seamOffset = -parseFloat(getComputedStyle(scope).marginTop || "0");
          const sectionTopDoc = scope.getBoundingClientRect().top + window.scrollY;
          seamDoc = sectionTopDoc + seamOffset;
          // `cascade` deriva el recorrido de cada anillo de estas dos medidas en vez de
          // llevarlo en una constante, y por eso sus perillas significan lo mismo en
          // cualquier pantalla. Salen del ScrollTrigger, no de un cálculo paralelo: si
          // alguien cambia el `end` de abajo, el reloj se entera solo.
          span = Math.max(1, end - start);
          seamY0 = seamDoc - startScroll;
          natural = panels.map((panel) => panel.offsetHeight);
          below = natural.map((h) => h - seamOffset);
        };

        const apply = (p: number, scroll: number) => {
          const eased = Math.min(1, Math.max(0, ease(p)));
          const seamY = seamDoc - scroll;
          // La única línea que separa a los dos relojes. De acá para abajo el pintado es
          // idéntico: `edges` es una `y` por anillo y nada más.
          const edges =
            flow === "cascade"
              ? cascadeEdges({
                  eased,
                  seamY,
                  seamY0,
                  span,
                  viewportH,
                  unitPx,
                  drop,
                  line,
                  soft,
                  spread,
                  land,
                  lag,
                  fast,
                  slow,
                  settle,
                })
              : carveEdges({
                  eased,
                  seamY,
                  scrolled: scroll - startScroll,
                  viewportH,
                  unitPx,
                  drop,
                  depth,
                  stagger,
                  converge,
                  line,
                  close: CARVE.close,
                });

          for (let i = 0; i < panels.length; i++) {
            const ring = ringOf(i);
            // El borde superior del panel tiene que caer en `edges[ring]`. Su borde
            // inferior está fijo a `below[i]` píxeles por debajo de la juntura, así que
            // el alto visible es la distancia entre los dos, y la escala es esa distancia
            // sobre el alto natural.
            //
            // El piso es lo que diferencia esto del tallado, donde el gris está siempre
            // completo: acá el panel ES el gris, así que si su borde arrancara demasiado
            // abajo dejaría sin marco a la primera línea del statement —que entra a
            // `u·0.5` de la juntura— y se vería sobre crema. Con `drop = 0.5` los dos
            // números coinciden justo, pero `?drop=1` lo rompería sin este clamp.
            const floor = below[i] - 0.5 * unitPx;
            const height = Math.max(floor, below[i] + (seamY - edges[ring]));
            setScale[i](Math.max(0, height / natural[i]));
          }

          if (!debug) return;
          const outer = edges[0];
          const center = edges[edges.length - 1];
          scope.dataset.labProgress = String(p);
          scope.dataset.labStair = String(
            Math.round(Math.max(0, Math.min(viewportH, center) - Math.max(0, outer)))
          );
          scope.dataset.labFlat = String(Math.round(Math.max(0, viewportH - center)));
          // Las cuatro `y` en crudo. `stair` y `flat` resumen la figura, pero el perfil de
          // la cascada y el aterrizaje se juzgan mirando los cuatro números por separado:
          // cuánto se abren entre sí al principio y con qué diferencia llegan al final.
          scope.dataset.labEdges = edges.map((y) => Math.round(y)).join("/");
        };

        const st = ScrollTrigger.create({
          trigger: scope,
          // El top de la sección ES el top del hero (el `marginTop` de abajo), así que
          // `top top` da progreso 0 en scroll 0 sin la función de anclaje que necesita
          // `QuantumBars` en producción.
          start: "top top",
          // Mismo recorrido que el tallado: el alto del hero menos media escalera. Sale
          // del margen negativo, que es `-(100svh + 2px)`.
          end: () => {
            const seamOffset = -parseFloat(getComputedStyle(scope).marginTop || "0");
            return `+=${Math.max(1, seamOffset - ((window.innerWidth / STAIR_COLUMNS) * depth) / 2)}`;
          },
          scrub: true,
          invalidateOnRefresh: true,
          markers: DEBUG_MARKERS,
          onRefresh: (self) => {
            measure(self.start, self.end);
            apply(self.progress, self.scroll());
          },
          onUpdate: (self) => apply(self.progress, self.scroll()),
        });
        measure(st.start, st.end);
        apply(st.progress, st.scroll());

        const cleanups: (() => void)[] = [];
        const lineEl = q("[data-quantum='line']")[0];
        const shineEl = q("[data-quantum='shine']")[0];
        if (lineEl && shineEl) cleanups.push(createStatementSweep(stage, lineEl, shineEl));

        return () => cleanups.forEach((fn) => fn());
      });

      // ── El caso reduced-motion, que acá NO es "no hacer nada" ────────────────
      //
      // Con el bloque de arriba sin correr, los paneles se quedan en su estado de layout:
      // sin transform, o sea grises desde el top del hero hacia abajo. Eso taparía el hero
      // entero — la peor composición posible, y justamente la que un fallo del bundle
      // también produciría.
      //
      // Así que este branch los deja en la figura de REPOSO: la escalera formada, con cada
      // columna detenida donde le corresponde. Es la misma decisión que en el tallado, donde
      // el estado de reposo vive en las custom properties del CSS.
      mm.add(MQ.reduce, () => {
        const panels = q("[data-qbar-col]");
        const unitPx = window.innerWidth / STAIR_COLUMNS;
        const seamOffset = -parseFloat(getComputedStyle(scope).marginTop || "0");
        panels.forEach((panel, i) => {
          const natural = panel.offsetHeight;
          // Cuánto sube el borde de esta columna por encima de la juntura en la figura
          // formada: `depth·(3−anillo)/3` unidades.
          const above = ((depth * (3 - ringOf(i))) / 3) * unitPx;
          const height = natural - seamOffset + above;
          gsap.set(panel, {
            transformOrigin: "bottom",
            scaleY: Math.max(0, Math.min(1, height / natural)),
          });
        });
      });

      return () => mm.revert();
    },
    [
      flow,
      drop,
      depth,
      carveEase,
      stagger,
      converge,
      line,
      soft,
      spread,
      land,
      lag,
      fast,
      slow,
      settle,
      debug,
    ]
  );

  return (
    // `z-[2]`, como en producción: las barras pintan POR ENCIMA del hero. Ese es el punto
    // de este approach.
    //
    // `-100svh`: la sección arranca en el top del hero, así que un panel a `scaleY: 1`
    // llega hasta ahí y nunca hace falta pasar de 1 para tapar todo lo que se pueda ver.
    // El alto TOTAL de la sección crece, pero lo que se ve no: esos `100svh` extra quedan
    // detrás del hero, y el aire visible entre la juntura y el statement sigue siendo
    // `u·0.5`.
    <section
      ref={rootRef}
      data-lab-hero
      style={
        {
          "--u": HERO_UNIT,
          marginTop: "calc(-100svh - 2px)",
        } as React.CSSProperties
      }
      className="relative z-[2] text-foreground"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 flex">
          {bottomOffsets.map((offset, i) => (
            <div key={i} className="relative flex-1">
              <div
                data-qbar-col
                // La columna central lleva el marcador que el HUD busca para no abortar la
                // lectura. Su `gap` ya no dice nada útil: el gris arranca arriba de todo.
                {...(i === 3 ? { "data-qbar-core": "" } : {})}
                className="absolute inset-x-0 top-0 bg-bar"
                // El borde inferior es la escalera espejada de producción y no se anima.
                // El superior lo mueve `scaleY` con origen abajo.
                style={{ bottom: u(offset) }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* La juntura está a `100svh` del top de la sección; el texto entra `u·0.5` más
          abajo, igual que en producción. */}
      <LabStatement above="calc(100svh + var(--u) * 0.5)" />
    </section>
  );
}
