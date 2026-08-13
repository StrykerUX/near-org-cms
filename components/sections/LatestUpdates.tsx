"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ArrowRight } from "lucide-react";
import type { UnicornStudioScene } from "unicornstudio-react/next";
import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { onViewportToggle } from "@/components/primitives/motion/pauseOffscreen";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";

// ── El SDK de Unicorn entra en su propio chunk, y solo si se llega a usar ─────
//
// `unicornstudio-react/next` embute el runtime completo de Unicorn Studio: 912KB
// en disco. Con el import estático, ese peso entraba en el bundle de cliente de
// TODA página que renderizara esta sección, replicado una vez por entrypoint
// (llegaron a ser tres chunks idénticos de 879KB).
//
// `next/dynamic` con `ssr: false` lo saca a un chunk aparte que se pide cuando el
// componente se monta. Y el componente no se monta hasta que la sección se acerca
// al viewport (ver `nearViewport` más abajo), así que en una visita que no llega
// a scrollear hasta acá, no se descarga nunca.
//
// El `lazyLoad` del propio wrapper NO cubría esto: difiere la INICIALIZACIÓN de la
// escena, no la descarga del SDK que la inicializa.
const UnicornScene = dynamic(() => import("unicornstudio-react/next"), {
  ssr: false,
});

// ── Cuándo se montan las escenas ─────────────────────────────────────────────
//
// Montar el componente es lo que ARRANCA todo el trabajo caro, y eso no es obvio:
// el `lazyLoad` del SDK no espera a que la sección se acerque para empezar. Al
// registrar una escena hace `!lazyLoad || isInView ? initializePlanes() : Mt(m)`,
// y ese `Mt` es un prewarm que se encola en el acto. Los 100px de margen del SDK
// solo gobiernan el paso a "en vista", no el arranque.
//
// Y el trabajo es del orden de SEGUNDOS, sin que la red tenga nada que ver: medido
// en localhost, donde el chunk se sirve al instante, las dos primeras cards
// tardaban ~5s en pintar. Se va en la cola del SDK, que inicializa las escenas DE
// UNA EN UNA (tres acá, cada una con 5 capas y un blur de 4 pases), planifica cada
// paso con `requestIdleCallback({timeout: 500})`, y POSPONE la cola mientras
// detecta scroll reintentando cada 80ms — y con Lenis el scroll sigue emitiendo un
// rato después de soltar la rueda.
//
// De ahí las dos vías de abajo, en orden de preferencia:
//
//  1. `useIdlePreload` — tras `window.load` y con el hilo libre. Es la buena: el
//     lector todavía está en el hero, así que esos segundos no los ve nadie.
//  2. El gate por scroll (`SCENE_LEAD`) — red de seguridad para cuando (1) no
//     corre: conexión limitada, o un navegador sin `requestIdleCallback`.
//
// Las dos escriben el mismo `ready`, y encender un booleano que ya está encendido
// no re-renderiza nada, así que no hace falta coordinarlas.

/** Viewports de anticipación del gate por scroll, cuando es el que decide. */
const SCENE_LEAD = 3;

/**
 * Tope de espera del idle callback. Sin él, en una pestaña que nunca queda ociosa
 * la precarga no ocurriría y todo caería en el gate por scroll.
 */
const IDLE_TIMEOUT = 2000;

/** La parte de la Network Information API que se usa acá. No está en lib.dom. */
type Connection = { saveData?: boolean; effectiveType?: string };

/**
 * `true` si el visitante pidió ahorrar datos o su conexión es mala. En ese caso NO
 * se precarga: 877KB de SDK para un cover decorativo no es un intercambio que
 * corresponda hacer en nombre de alguien con datos contados. Queda el gate por
 * scroll, que solo los descarga si de verdad baja hasta la sección.
 *
 * La API es solo de Chromium; donde no existe, se precarga (que es el default
 * razonable: no hay señal de que la red sea un problema).
 */
function prefersLessData(): boolean {
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
 * que solo pinta un canvas decorativo — el HTML indexable (títulos, bylines, links)
 * sale del servidor y no depende de nada de esto.
 */
function useIdlePreload(onReady: () => void) {
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

// Sin datos reales (fuera de alcance de este draft): copy fijo. Si esta sección
// se conecta al CMS más adelante, migra a PostCard/PostGrid
// (components/sections/types.ts) en vez de duplicar esta lista.
//
// `scene` es la escena de Unicorn Studio que pinta el cover. `fallback` es el
// gradiente CSS que se ve si la escena no carga — el cover ES el contenido
// visual de la card, no un adorno, así que no puede quedar en blanco.
//
// Hay una escena por color y no una sola parametrizada porque la escena no
// expone ninguna variable: el color sale del JPG de su capa `image`. Y las tres
// no son la misma escena con distinta imagen — cada export trae sus propios
// shaders (spread del flujo, y la aberración cromática de las franjas, que solo
// tiene la verde). Los genera scripts/unicorn-scenes.mjs a partir de los
// exports de assets/unicorn/ — ver docs/unicorn.md.
const POSTS = [
  {
    title: "Sharding the world computer",
    byline: "with Alexander Skidanov",
    cta: "Read the full story",
    scene: "/unicorn-scene-green.json",
    fallback:
      "linear-gradient(118deg, #7fe0d0 0%, #4de88f 30%, #e8e888 60%, #a8a8a0 100%)",
  },
  {
    title: "Lorem Ipsum Dolar Enet",
    byline: "with Alexander Skidanov",
    cta: "View the interview",
    scene: "/unicorn-scene-blue.json",
    fallback:
      "linear-gradient(118deg, #7fd0f5 0%, #5fb8f5 30%, #a5dcf9 60%, #cdd0da 100%)",
  },
  {
    title: "Sharding the world computer",
    byline: "with Alexander Skidanov",
    cta: "Read the full story",
    scene: "/unicorn-scene-red.json",
    fallback:
      "linear-gradient(118deg, #eebb80 0%, #fa9351 30%, #faebdf 60%, #dfd8e6 100%)",
  },
] as const;

/**
 * El mouse de la escena, encendido SOLO mientras el puntero está sobre la card.
 *
 * El SDK de Unicorn engancha un único `mousemove` en `window`, compartido por
 * todas las escenas de la página — por eso, sin esto, las tres cards reaccionan
 * al mouse esté donde esté.
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

function useMouseOnlyOnHover(hovered: boolean) {
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
  // (el SDK la carga async, y con lazyLoad recién cuando la sección se acerca al
  // viewport) y sin provocar un render nuevo. Con una ref-objeto el efecto de
  // arriba no se enteraría hasta el primer hover, y hasta entonces el mouse
  // quedaría vivo — justo lo que esto viene a evitar. Así se aplica en el
  // instante en que el SDK la entrega.
  return useCallback((s: UnicornStudioScene | null) => {
    scene.current = s as SceneWithMouse | null;
    gateMouse(scene.current, hoveredRef.current);
  }, []);
}

function PostCard({ post, ready }: { post: (typeof POSTS)[number]; ready: boolean }) {
  const [hovered, setHovered] = useState(false);
  const sceneRef = useMouseOnlyOnHover(hovered);

  return (
    <article
      data-reveal
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className="group relative aspect-[7/6] overflow-hidden rounded-[1.75rem] bg-white p-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
    >
      {/* El cover llena la card entera; lo que lo convierte en una "L" es el
          bloque blanco de texto que se le monta encima en la esquina superior
          izquierda.

          Sin `group-hover:scale`: la card no se mueve al hover.

          El gradiente CSS va en el contenedor y la escena encima, así que si la
          escena no carga —un clon del repo sin el JSON, un navegador sin
          WebGL2— lo que queda es el gradiente y no un rectángulo gris.

          El `absolute inset-0` de adentro no es decorativo: el runtime de
          Unicorn mide su contenedor para dimensionar el canvas, y con el canvas
          en flujo cada medición agranda la caja y la siguiente lee la caja ya
          crecida. La card se estira sin parar. Sacado del flujo, no puede
          empujar a su padre. */}
      <div
        className="absolute inset-2.5 overflow-hidden rounded-[1.4rem]"
        style={{ backgroundImage: post.fallback }}
      >
        {/* Hasta que `ready` no se enciende, lo que se ve es el gradiente de
            `fallback` del contenedor de arriba — que es el mismo fallback que ya
            cubría el caso "la escena no carga". */}
        <div className="absolute inset-0" aria-hidden="true">
          {ready && <UnicornScene
            jsonFilePath={post.scene}
            width="100%"
            height="100%"
            dpi={1.5}
            scale={1}
            fps={60}
            // Cada card monta su propia escena con 5 capas y un blur de 4
            // pases. lazyLoad evita pagar las tres antes de que la sección esté
            // siquiera cerca del viewport.
            lazyLoad
            placeholderClassName="h-full w-full"
            sceneRef={sceneRef}
          />}
        </div>
      </div>

      {/* Los radios están al revés de lo que parece: `tl` sigue la curva de la
          card, y `br` es la esquina que muerde el cover — sin ese radio el
          recorte se ve como un rectángulo pegado encima de la imagen. */}
      <div className="absolute left-2.5 top-2.5 flex w-[60%] flex-col gap-1 rounded-tl-[1.4rem] rounded-br-[1.4rem] bg-white p-4 pb-5 pr-7">
        <h3 className="text-h4 text-pretty">{post.title}</h3>
        <p className="text-body-sm text-muted-foreground">{post.byline}</p>

        {/* El CTA es solo visual: el link real es el que cubre la card entera,
            más abajo. Anidar un <a> acá dentro de ese otro sería HTML inválido
            (links anidados). */}
        <span className="mt-10 flex items-center gap-2.5 text-body-sm">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-near-green-dark text-white transition-transform group-hover:translate-x-0.5">
            <ArrowRight className="size-3.5" strokeWidth={2} />
          </span>
          {post.cta}
        </span>
      </div>

      {/* Toda la card es el link. Va como UN solo <a> que la cubre y no como un
          <a> por elemento: así un lector de pantalla anuncia un destino por
          card en vez de varios, y el foco de teclado es una sola parada.

          El `::after` de un "stretched link" no servía acá: se posiciona contra
          el ancestro posicionado más cercano, que es el bloque de texto
          (absolute), no la card.

          El texto va en sr-only y no en aria-label: sobrevive a los traductores
          automáticos, que ignoran los aria-label. */}
      <a
        href="#"
        className="absolute inset-0 z-10 rounded-[1.75rem] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-near-green-dark"
      >
        <span className="sr-only">
          {post.title} — {post.cta}
        </span>
      </a>
    </article>
  );
}

export default function LatestUpdates() {
  // El reveal de las cards al entrar en viewport. Es lo único que queda de la
  // maquinaria de motion propia: el material del cover ahora lo pinta el runtime
  // de Unicorn Studio, que trae su propio rAF por escena.
  const gridRef = useScrollReveal<HTMLDivElement>();

  // Se enciende una sola vez y no se vuelve a apagar: desmontar las escenas al
  // salir de vista significaría volver a inicializarlas al volver, que es más caro
  // que dejarlas corriendo (y el runtime de Unicorn ya pausa las suyas). Las dos
  // vías que lo encienden están explicadas arriba, junto a SCENE_LEAD.
  const [ready, setReady] = useState(false);
  const mount = useCallback(() => setReady(true), []);

  // Vía preferida: en cuanto la página cargó lo crítico y el hilo está libre.
  useIdlePreload(mount);

  // Red de seguridad: si la de arriba no corrió (conexión limitada, o un navegador
  // sin requestIdleCallback), el scroll las monta igual antes de llegar.
  const gateRef = useGsapContext<HTMLDivElement>((_self, scope) => {
    onViewportToggle(scope, (visible) => visible && mount(), SCENE_LEAD);
  }, []);

  return (
    <section ref={gateRef} className="bg-cream text-foreground">
      <Container className="flex flex-col gap-20 py-28 md:gap-24 md:py-36">
        <h2 className="text-center text-h1 text-pretty">The latest from NEAR</h2>

        <div className="flex flex-col gap-7">
          <div className="flex items-center justify-between gap-4">
            <span className="text-body-sm">Latest News</span>
            {/* near-green-dark y no near-green: el verde puro (#00ec97) con
                texto blanco queda en ~1.5:1 de contraste. Este es además el
                tono del botón de la referencia. */}
            <a
              href="#"
              className="rounded-full bg-near-green-dark px-6 py-2.5 text-eyebrow uppercase text-white transition-opacity hover:opacity-90"
            >
              All posts
            </a>
          </div>

          <div ref={gridRef} className="grid grid-cols-1 gap-7 md:grid-cols-3">
            {POSTS.map((post, i) => (
              <PostCard key={i} post={post} ready={ready} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
