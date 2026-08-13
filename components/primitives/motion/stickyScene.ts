"use client";

import { gsap } from "./gsapClient";
import { DEBUG_MARKERS } from "./motionTokens";

/**
 * Enciende una escena sticky y devuelve su apagado.
 *
 * El patrón que gobierna las cuatro secciones sticky del repo: la sección
 * declara en CSS cuánto recorrido tiene (`--travel`, `--steps × --step-vh`) y un
 * atributo de estado decide si ese alto y el `position: sticky` del hijo se
 * aplican. Sin JS, en móvil o con `prefers-reduced-motion`, el atributo no
 * existe: la sección mide lo que mide su contenido y los paneles se leen
 * apilados en flujo normal. Es la degradación correcta y es la razón de que el
 * mecanismo viva en un atributo y no en una clase.
 *
 * **El atributo NO se declara en el JSX.** Es la regla que este helper existe
 * para hacer cumplir. Tres de las cuatro secciones lo declaraban como `"off"` y
 * además lo escribían desde el efecto — dos fuentes para un mismo estado. Hoy no
 * se nota porque esas secciones no tienen estado React, pero el día que una lo
 * tenga, el primer re-render devuelve el atributo a `"off"` y el layout sticky se
 * desarma **en silencio**: sin error, sin warning, solo una sección que dejó de
 * pegarse. Escribiéndolo solo desde acá, React nunca lo pisa.
 *
 *   const off = enableScene(scope, "seq");
 *   return () => off();
 *
 * Ojo con el nombre: es la clave de `dataset`, o sea camelCase — `"navDark"`
 * para `data-nav-dark`. Los cuatro usos actuales son de una palabra.
 */
export function enableScene(host: HTMLElement, name: string): () => void {
  host.dataset[name] = "on";
  return () => {
    delete host.dataset[name];
  };
}

/**
 * La timeline de una escena sticky: progreso de 0 a 1 mientras el track cruza el
 * viewport, sin animar nada por sí misma.
 *
 * Los cuatro tracks declaraban el mismo `scrollTrigger` a mano. Los tres valores
 * que no son obvios y que conviene no volver a decidir sección por sección:
 *
 * - `start/end` van `top top → bottom bottom` porque el hijo está `sticky top-0`:
 *   el progreso tiene que ser exactamente el tramo en que ese hijo está pegado,
 *   que es desde que el track toca el borde superior hasta que su fondo lo
 *   alcanza.
 * - **Nunca `pin: true`.** El pin-spacer que inserta pelea con Lenis, realimenta
 *   el `ResizeObserver` de `PrototypeMotionProvider` y deja spacers fantasma bajo
 *   StrictMode. El recorrido se declara en CSS y acá solo se LEE. El razonamiento
 *   largo está en `components/sections/README.md`.
 * - `invalidateOnRefresh` es obligatorio si algún valor del track se calcula con
 *   una función (`() => window.innerHeight * 0.055`): sin él, GSAP cachea el
 *   resultado del primer cálculo y la escena queda medida contra el viewport que
 *   había antes del swap de fuentes.
 *
 * Consecuencia estructural a no olvidar: **ningún ancestro del hijo sticky puede
 * tener `overflow` distinto de `visible`**, o se convierte en su contenedor de
 * scroll y el sticky deja de pegarse. El `overflow-hidden` va sobre el hijo
 * pegado, que sí puede tenerlo.
 */
export function trackTimeline(
  track: Element,
  { scrub = true, defaults, scrollTrigger }: TrackOptions = {}
): gsap.core.Timeline {
  return gsap.timeline({
    defaults,
    scrollTrigger: {
      trigger: track,
      start: "top top",
      end: "bottom bottom",
      scrub,
      invalidateOnRefresh: true,
      markers: DEBUG_MARKERS,
      ...scrollTrigger,
    },
  });
}

export type TrackOptions = {
  /** Suavizado del scrub en segundos. `true` = pegado al scroll, sin inercia. */
  scrub?: number | boolean;
  /** Defaults de los tweens de la timeline (ease, duration). */
  defaults?: gsap.TweenVars;
  /** Overrides del trigger, para las escenas que arrancan en otro punto. */
  scrollTrigger?: ScrollTrigger.Vars;
};
