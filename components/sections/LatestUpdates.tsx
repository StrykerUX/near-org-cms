"use client";

import { useCallback, useState } from "react";
import { ArrowRight } from "lucide-react";
import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { onViewportToggle } from "@/components/primitives/motion/pauseOffscreen";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
// El SDK de Unicorn, su precarga ociosa y el gateo del mouse viven en el toolkit
// de motion desde que las cards del índice del repo los necesitan también. Las
// decisiones de por qué se cargan así están documentadas allá.
import {
  UnicornScene,
  UNICORN_COVERS,
  useIdlePreload,
  useMouseOnlyOnHover,
} from "@/components/primitives/motion/unicornScene";

// ── Cuándo se montan las escenas EN ESTA SECCIÓN ─────────────────────────────
//
// `useIdlePreload` es la vía preferida (ver el toolkit). El gate por scroll de
// acá es la red de seguridad para cuando esa no corre —conexión limitada, o un
// navegador sin `requestIdleCallback`—: esta sección está al fondo de una página
// larga, así que en ese caso alcanza con montarlas al acercarse.
//
// Las dos escriben el mismo `ready`, y encender un booleano que ya está encendido
// no re-renderiza nada, así que no hace falta coordinarlas.

/** Viewports de anticipación del gate por scroll, cuando es el que decide. */
const SCENE_LEAD = 3;

// Sin datos reales (fuera de alcance de este draft): copy fijo. Si esta sección
// se conecta al CMS más adelante, migra a PostCard/PostGrid
// (components/sections/types.ts) en vez de duplicar esta lista.
//
// El `cover` sale de `UNICORN_COVERS` y no se declara acá: el JSON de la escena y
// su gradiente de respaldo van pareados, y con los literales sueltos regenerar
// una escena dejaba el gradiente viejo mintiendo. Ver el toolkit.
const POSTS = [
  {
    title: "Sharding the world computer",
    byline: "with Alexander Skidanov",
    cta: "Read the full story",
    cover: UNICORN_COVERS.green,
  },
  {
    title: "Lorem Ipsum Dolar Enet",
    byline: "with Alexander Skidanov",
    cta: "View the interview",
    cover: UNICORN_COVERS.blue,
  },
  {
    title: "Sharding the world computer",
    byline: "with Alexander Skidanov",
    cta: "Read the full story",
    cover: UNICORN_COVERS.red,
  },
] as const;


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
        style={{ backgroundImage: post.cover.fallback }}
      >
        {/* Hasta que `ready` no se enciende, lo que se ve es el gradiente de
            `fallback` del contenedor de arriba — que es el mismo fallback que ya
            cubría el caso "la escena no carga". */}
        <div className="absolute inset-0" aria-hidden="true">
          {ready && <UnicornScene
            jsonFilePath={post.cover.scene}
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
          {/* justify-end: sin el label "Latest News" (removido a pedido), el
              botón conserva su lugar a la derecha. */}
          <div className="flex items-center justify-end gap-4">
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
