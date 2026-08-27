"use client";

import { useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import type { UnicornStudioScene } from "unicornstudio-react/next";

// Todo lo compartido para montar una escena de Unicorn Studio sin que su SDK le
// cueste a nadie que no la mire.
//
// Vivía dentro de `sections/LatestUpdates.tsx`, que fue quien lo resolvió. Salió
// acá al aparecer el segundo consumidor (las cards destacadas del índice): son
// ~90 líneas de decisiones no obvias sobre cuándo cargar 877KB de SDK, y de las
// que se equivocan en silencio —el costo no se ve en el render, se ve en el INP
// de alguien con una máquina peor.
//
// Lo que NO está acá: cuándo decide cada consumidor que es momento de montar.
// `LatestUpdates` usa un gate por scroll porque está al fondo de la página; el
// índice no lo necesita porque sus cards están sobre el fold. Esa parte es del
// llamador.

// ── El SDK entra en su propio chunk, y solo si se llega a usar ───────────────
//
// `unicornstudio-react/next` embute el runtime completo de Unicorn Studio: 912KB
// en disco. Con el import estático, ese peso entraba en el bundle de cliente de
// TODA página que renderizara el componente, replicado una vez por entrypoint
// (llegaron a ser tres chunks idénticos de 879KB).
//
// `next/dynamic` con `ssr: false` lo saca a un chunk aparte que se pide cuando el
// componente se monta. Y el componente no se monta hasta que el llamador lo
// decide, así que en una visita que no llega a mirarlo, no se descarga nunca.
//
// El `lazyLoad` del propio wrapper NO cubre esto: difiere la INICIALIZACIÓN de la
// escena, no la descarga del SDK que la inicializa.
export const UnicornScene = dynamic(() => import("unicornstudio-react/next"), {
  ssr: false,
});

// ── Las tres escenas que el repo tiene, con su gradiente de respaldo ─────────
//
// `scene` es el JSON que pinta el cover; `fallback` es el gradiente CSS que se ve
// mientras carga, y el que queda si no carga nunca — un clon del repo sin los
// JSON, un navegador sin WebGL2, o alguien con `saveData`. El cover ES contenido
// visual, no un adorno, así que no puede quedar en blanco.
//
// Van pareados y en un solo lugar porque el `fallback` no es un color libre: es
// una aproximación de ESA escena. Con los literales sueltos en cada consumidor,
// regenerar una escena con otro color deja los gradientes viejos mintiendo en
// los otros archivos.
//
// Son TRES y no se agregan más a la ligera: cada una es un export propio con sus
// shaders (el spread del flujo, y la aberración cromática de las franjas que solo
// tiene la verde), no la misma escena recoloreada — el color sale del JPG de su
// capa `image`, que la escena no expone como variable. Las genera
// `scripts/unicorn-scenes.mjs` desde `assets/unicorn/` — ver `docs/unicorn.md`.
// Un consumidor que necesite más covers que estos tres, repite.
export const UNICORN_COVERS = {
  green: {
    scene: "/unicorn-scene-green.json",
    fallback: "linear-gradient(118deg, #7fe0d0 0%, #4de88f 30%, #e8e888 60%, #a8a8a0 100%)",
  },
  blue: {
    scene: "/unicorn-scene-blue.json",
    fallback: "linear-gradient(118deg, #7fd0f5 0%, #5fb8f5 30%, #a5dcf9 60%, #cdd0da 100%)",
  },
  red: {
    scene: "/unicorn-scene-red.json",
    fallback: "linear-gradient(118deg, #eebb80 0%, #fa9351 30%, #faebdf 60%, #dfd8e6 100%)",
  },
} as const;

export type UnicornCover = (typeof UNICORN_COVERS)[keyof typeof UNICORN_COVERS];

// ── Cuándo se montan las escenas ─────────────────────────────────────────────
//
// Montar el componente es lo que ARRANCA todo el trabajo caro, y eso no es obvio:
// el `lazyLoad` del SDK no espera a que la escena se acerque para empezar. Al
// registrarla hace `!lazyLoad || isInView ? initializePlanes() : Mt(m)`, y ese
// `Mt` es un prewarm que se encola en el acto.
//
// Y el trabajo es del orden de SEGUNDOS, sin que la red tenga nada que ver: medido
// en localhost, donde el chunk se sirve al instante, las dos primeras cards de
// `LatestUpdates` tardaban ~5s en pintar. Se va en la cola del SDK, que inicializa
// las escenas DE UNA EN UNA (cada una con 5 capas y un blur de 4 pases), planifica
// cada paso con `requestIdleCallback({timeout: 500})`, y POSPONE la cola mientras
// detecta scroll reintentando cada 80ms — y con Lenis el scroll sigue emitiendo un
// rato después de soltar la rueda.
//
// De ahí `useIdlePreload`: tras `window.load` y con el hilo libre.
//
// ── `lazyLoad` va SIEMPRE, aunque la escena esté sobre el fold ───────────────
//
// La bandera no es solo un gate de viewport: decide por qué camino se
// inicializa la escena.
//
//     !lazyLoad || isInView ? initializePlanes() : Mt(m)
//
// Sin ella, `initializePlanes()` corre sincrónicamente al registrar —antes de
// que el canvas exista— y tira `Cannot read properties of null (reading
// 'canvas')` dentro de `setInitialElementPlaneUniforms`. Con ella nunca entra
// por ahí ni siquiera estando visible, porque al registrar el
// IntersectionObserver todavía no disparó: `isInView` es false y cae en `Mt(m)`,
// la cola de prewarm, que sí espera al canvas.
//
// Está anotado acá y no solo en cada llamador porque el razonamiento que lleva a
// quitarla —"esta escena ya está en pantalla, el lazy no difiere nada"— es
// correcto sobre el viewport y equivocado sobre la inicialización.

/** Tope de espera del idle callback. Sin él, en una pestaña que nunca queda
 *  ociosa la precarga no ocurriría nunca. */
const IDLE_TIMEOUT = 2000;

/** La parte de la Network Information API que se usa acá. No está en lib.dom. */
type Connection = { saveData?: boolean; effectiveType?: string };

/**
 * `true` si el visitante pidió ahorrar datos o su conexión es mala. En ese caso NO
 * se precarga: 877KB de SDK para un cover decorativo no es un intercambio que
 * corresponda hacer en nombre de alguien con datos contados.
 *
 * La API es solo de Chromium; donde no existe, se precarga (que es el default
 * razonable: no hay señal de que la red sea un problema).
 */
export function prefersLessData(): boolean {
  const conn = (navigator as Navigator & { connection?: Connection }).connection;
  if (!conn) return false;
  if (conn.saveData) return true;
  return conn.effectiveType === "slow-2g" || conn.effectiveType === "2g" || conn.effectiveType === "3g";
}

/**
 * Llama a `onReady` cuando la página terminó de cargar lo necesario para verse Y el
 * hilo principal está libre.
 *
 * Las dos condiciones importan y son distintas: `load` dice que no queda nada
 * crítico compitiendo por la RED (el LCP ya pasó, por definición, antes de `load`),
 * y el idle callback dice que no queda nada compitiendo por la CPU — que es lo que
 * protege al INP del parse de 877KB de JavaScript.
 *
 * Consecuencia buscada para SEO: los dos Core Web Vitals que son señal de ranking
 * quedan fuera del camino de esto por construcción. Y como Googlebot normalmente no
 * llega a ejecutar un idle callback, tampoco gasta presupuesto de rastreo en un SDK
 * que solo pinta un canvas decorativo — el HTML indexable sale del servidor y no
 * depende de nada de esto.
 */
export function useIdlePreload(onReady: () => void) {
  useEffect(() => {
    if (prefersLessData()) return;
    if (typeof window.requestIdleCallback !== "function") return;

    let handle = 0;
    const schedule = () => {
      handle = window.requestIdleCallback(onReady, { timeout: IDLE_TIMEOUT });
    };

    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      if (handle) window.cancelIdleCallback(handle);
      window.removeEventListener("load", schedule);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/**
 * El mouse de la escena, encendido SOLO mientras el puntero está sobre su card.
 *
 * El SDK engancha un único `mousemove` en `window`, compartido por todas las
 * escenas de la página — por eso, sin esto, todas reaccionan al mouse esté donde
 * esté.
 *
 * La palanca es una bandera que el loop de render consulta EN CADA FRAME:
 *
 *     if (…interactivity?.mouse?.disabled) { }        // no propaga nada
 *     else { scene.mouse.pos = scene.mouse.movePos }  // acá es donde llega al shader
 *
 * Como se lee por frame, darla vuelta en vivo alcanza y no hay que recrear la
 * escena. Todo lo demás —el flujo, el blur, las franjas— sigue animando: lo
 * único que se congela es el aporte del puntero.
 *
 * Por qué NO `setProp("flow_field", "trackMouse", 0)`, que era el candidato
 * obvio: `trackMouse` también lo lee `isAnimating()`, así que tocarlo puede
 * afectar si la capa se considera animada. Esta bandera es quirúrgica.
 *
 * `interactivity` no está en los tipos públicos del wrapper (solo expone
 * `disableMobile`), de ahí el acceso defensivo: si el SDK cambia de forma, el
 * mouse deja de responder pero nada revienta.
 */
type SceneWithMouse = UnicornStudioScene & {
  interactivity?: { mouse?: { disabled?: boolean } };
};

function gateMouse(scene: SceneWithMouse | null, on: boolean) {
  const mouse = scene?.interactivity?.mouse;
  if (mouse) mouse.disabled = !on;
}

export function useMouseOnlyOnHover(hovered: boolean) {
  const scene = useRef<SceneWithMouse | null>(null);

  // El hover en una ref además del estado: el callback de abajo se crea una
  // sola vez y necesita leer el valor ACTUAL, no el que había al montar.
  //
  // La ref se escribe DENTRO del efecto y no durante el render: escribirla en el
  // cuerpo del componente rompe con rendering concurrente, donde React puede
  // renderizar sin llegar a commitear.
  const hoveredRef = useRef(hovered);

  useEffect(() => {
    hoveredRef.current = hovered;
    gateMouse(scene.current, hovered);
  }, [hovered]);

  // Callback ref y no una ref-objeto: la escena llega DESPUÉS del primer render
  // (el SDK la carga async, y con lazyLoad recién cuando se acerca al viewport) y
  // sin provocar un render nuevo. Con una ref-objeto el efecto de arriba no se
  // enteraría hasta el primer hover, y hasta entonces el mouse quedaría vivo —
  // justo lo que esto viene a evitar. Así se aplica en el instante en que el SDK
  // la entrega.
  return useCallback((s: UnicornStudioScene | null) => {
    scene.current = s as SceneWithMouse | null;
    gateMouse(scene.current, hoveredRef.current);
  }, []);
}
