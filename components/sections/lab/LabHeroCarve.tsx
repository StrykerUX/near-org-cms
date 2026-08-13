"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import {
  CustomEase,
  gsap,
  ScrollTrigger,
  SplitText,
} from "@/components/primitives/motion/gsapClient";
import { createVideoScrub } from "@/components/primitives/motion/videoScrub";
import { MQ, DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { HERO_UNIT } from "@/components/sections/home-v2/heroGeometry";
import {
  CARVE,
  STAIR_COLUMNS,
  STAIR_DEPTH,
  carveEdges,
  carvePolygon,
  carveRestVars,
  clearCarve,
  writeCarve,
} from "./labStairGeometry";

// ── Approach B, mitad 2 de 2 · la imagen se retrae ───────────────────────────
//
// Copia de `HeroVideo` con TRES cambios. Todo lo demás —el velo fijo, el velo ligado
// al scroll, el parallax de la copy, el scrub de 193 frames, la intro con SplitText—
// es idéntico, y el porqué de cada pieza está documentado en el original; acá solo se
// comenta lo que cambia, para que las dos versiones no arrastren dos copias de la
// misma prosa.
//
//   1. `z-[3]`: el hero se apila POR ENCIMA de las barras (que siguen en `z-[2]`).
//      Es la inversión que hace posible todo lo demás — el gris ya está dibujado
//      debajo, completo y quieto, y el hero lo tapa.
//   2. El vídeo cuelga `drop · u` por debajo de la juntura, así que hay imagen para
//      cubrir la zona que el scroll está por revelar. `heroGeometry` documenta que el
//      HTML original usaba el vídeo a `100% + u·1.5`: esto es en parte volver a eso.
//   3. Un `clip-path` escalonado sobre un LIENZO —un div `absolute inset-0` que lleva
//      el `bg-cream`, el vídeo y los dos velos— cuya profundidad por columna se anima
//      con el scroll.
//
//      El recorte va sobre el lienzo y no sobre la <section> por una razón concreta:
//      `clip-path` recorta TODOS los descendientes, así que con la sección recortada el
//      bloque de copy se cortaba también, y eso ponía un techo a `depth` — a 3.0 el
//      corte caía a 782px y el subtítulo termina cerca de 736px, o sea a 46px de
//      empezar a comerse el texto, en silencio. Con el lienzo aparte, la copy queda
//      SIEMPRE fuera del recorte y el techo desaparece: lo peor que puede pasar con una
//      escalera muy profunda es que el texto quede sobre gris en vez de sobre crema,
//      que es un problema de contraste y no un texto cortado a la mitad.
//
// ── Por qué esto sí elimina la banda gris ────────────────────────────────────
// El borde inferior de la imagen no es una línea recta en ningún momento del
// recorrido. Arranca como una escalera INVERTIDA (más honda en el centro, porque la
// columna central es la que cuelga `drop·u`) y termina como la escalera definitiva
// (más honda en los extremos). El relieve entre la columna exterior y la central nunca
// baja de `drop·u`, así que el borde no pasa por plano más que en un frame.
//
// Y la zona de ancho completo, el "zócalo", no puede aparecer hasta que el recorte de
// la columna central suba hasta la juntura.
//
// Medido con node sobre un viewport de 1877×1050 (u = 268px), escalera / zócalo en px:
//
//   scroll   este approach        producción
//    25px      91 /   0   ∞×        0 /  25   ← barra pura
//    50px     177 /   0   ∞×        0 /  50   ← barra pura
//   110px     336 /  34   10×        0 / 110   ← el momento de la captura
//   200px     460 / 159    3×      101 / 200
//
// A 25px de scroll lo visible son 91px de gris en las columnas exteriores y nada en las
// centrales; a 50px son 177px. Eso es literalmente "que se vean los escalones laterales
// sin ver la sección gris".
//
// ── Coste ────────────────────────────────────────────────────────────────────
// Un `clip-path` animado no va al compositor: cada frame paga un style recalc y el
// repintado del recorte. Son 4 escrituras de custom property sobre UN elemento, contra
// los 21 tweens de `scaleY` que reemplaza — pero es paint, no transform, así que es lo
// primero a medir si el scroll se siente peor. Si el coste no cierra, el plan de
// respaldo es el approach A: la misma figura de una pieza por columna, colgando por
// debajo de la juntura, revelada por el scroll sin animar nada.

// Cuánto cuelga la columna CENTRAL por debajo de la juntura al inicio, en unidades de
// `--u`. Fija el relieve del perfil en el primer frame… y es la perilla CARA, porque el
// vídeo tiene que crecer lo mismo para tener imagen que retirar.
//
// El asset es 1728×972 (16:9) y el hero mide 100svh, así que a 1877×1050 la imagen
// entra casi exacta y `object-cover` no recorta nada. Cada unidad de `drop` obliga a
// escalar para cubrir una caja más alta, y eso se paga en ancho:
//
//   drop   caja        escala   recorte horizontal
//   0.00   1877×1050   1.086×     0px   (0%)
//   0.50   1877×1184   1.218×   228px  (12%)   ← el valor de acá
//   1.00   1877×1318   1.356×   466px  (25%)
//   1.50   1877×1452   1.494×   705px  (38%)
//
// O sea: `drop` NO es la perilla del escalonado —eso es `STAIR_DEPTH`, que es gratis—
// sino la que decide cuánto tarda en aparecer el zócalo. Se queda en el mínimo que hace
// falta para que no exista en el arranque.
// ── El reloj no vive acá ─────────────────────────────────────────────────────
//
// La curva, el relevo, el techo y el cierre están todos en `carveEdges`, en
// `labStairGeometry`, y los valores por defecto en `CARVE`. Este componente solo PINTA el
// resultado: recibe la `y` del borde de cada anillo y la convierte en cuatro custom
// properties del polígono.
//
// Están ahí y no acá porque `/prototype/descent/paneles` pinta las MISMAS `y` con otro
// mecanismo —paneles grises escalados, en vez de un recorte de la imagen— y las dos rutas
// tienen que compartir el reloj exacto. Si estuviera duplicado, cualquier diferencia que
// se viera entre las dos podría ser del mecanismo o de una deriva entre copias, y no
// habría forma de distinguirlo.
//
// Lo único de ritmo que sigue siendo asunto de este archivo es el RECORRIDO, porque
// depende del alto del hero: está en el `end` del ScrollTrigger, más abajo.

// ── Ajustes del scrub, idénticos al original ─────────────────────────────────
const SCRUB_RATE = 1;
const FPS = 24;
const CHASE = 0.14;
const CHASE_DOCKING = 0.09;

export default function LabHeroCarve({
  drop = CARVE.drop,
  depth = STAIR_DEPTH,
  carveEase = CARVE.easeName,
  stagger = CARVE.stagger,
  converge = true,
  line = CARVE.line,
  /**
   * Si este hero es DUEÑO del reveal.
   *
   * En `true` (el defecto) lleva el recorte escalonado y se apila en `z-[3]`, por encima
   * de las barras: es el approach del tallado.
   *
   * En `false` no recorta nada y vuelve al apilado de producción, así que las barras le
   * pintan encima. Lo usa `/prototype/descent/paneles`, donde el reveal es de las barras.
   * Lo único que queda del tallado ahí es el excedente de vídeo (`drop`), que sigue
   * haciendo falta para tener imagen por debajo de la juntura.
   *
   * Es un flag y no un componente aparte a propósito: las dos rutas tienen que usar EL
   * MISMO hero para que la comparación aísle el mecanismo de las barras. Una copia de
   * estas 250 líneas derivaría, y entonces no se sabría si la diferencia es del approach
   * o del hero.
   */
  carve = true,
  debug = false,
}: {
  drop?: number;
  depth?: number;
  carveEase?: string;
  stagger?: number;
  converge?: boolean;
  line?: number;
  carve?: boolean;
  debug?: boolean;
}) {
  const rootRef = useGsapContext<HTMLElement>(
    (_self, scope) => {
      const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        const cleanups: (() => void)[] = [];

        const canvas = q("[data-hero-canvas]")[0];
        const video = q("[data-hero-bg]")[0] as HTMLVideoElement | undefined;
        const wrap = q("[data-hero-wrap]")[0];
        const fade = q("[data-hero-topfade]")[0];
        const heading = q("[data-hero='heading']")[0];
        const rest = q("[data-hero='sub']");

        // ── 0. El tallado ───────────────────────────────────────────────────
        //
        // Un solo ScrollTrigger sin timeline: la profundidad de cada anillo es una
        // interpolación entre dos números, así que un tween no aportaría nada y
        // sí obligaría a un objeto proxy por anillo.
        //
        // El estado de REPOSO vive en CSS (ver `carveRestVars`) y es el FINAL, para
        // que sin JS y con reduced-motion quede la composición correcta. Este bloque
        // escribe el estado inicial en su primer frame, que corre en
        // `useLayoutEffect` — antes del primer paint.
        if (canvas && carve) {
          // La curva se registra acá y no a nivel de módulo: `CustomEase.create` correría
          // durante el SSR, donde no hace falta. Es idempotente, así que repetirla en cada
          // mount no acumula nada. Mismo patrón que `descentCurves`.
          CustomEase.create(CARVE.easeName, CARVE.cp);
          // Un `?ease=` mal escrito no debe dejar el hero sin recorte —sería la reja
          // entera tapada y ningún reveal—, así que cae al valor por defecto.
          const parsed = gsap.parseEase(carveEase);
          const ease = typeof parsed === "function" ? parsed : gsap.parseEase(CARVE.easeName);

          // Todo lo que depende del tamaño de la ventana se cachea y se refresca en
          // `onRefresh`, para no leer layout por frame. `--u` es `calc(100vw / 7)`, e
          // `innerWidth` incluye la barra de scroll igual que `100vw`.
          let unitPx = window.innerWidth / STAIR_COLUMNS;
          let viewportH = window.innerHeight;
          // Posición DOCUMENTAL de la juntura y del arranque del recorrido, para poder
          // pasar de coordenadas de documento a coordenadas de pantalla sin medir por frame.
          let seamDoc = scope.getBoundingClientRect().bottom + window.scrollY;
          let startScroll = 0;
          const measure = (start: number) => {
            unitPx = window.innerWidth / STAIR_COLUMNS;
            viewportH = window.innerHeight;
            seamDoc = scope.getBoundingClientRect().bottom + window.scrollY;
            startScroll = start;
          };

          const applyCarve = (p: number, scroll: number) => {
            // El clamp de `e` a [0,1] es lo que hace que ninguna perilla pueda romper la
            // invariante: fuera de ese rango el borde podría bajar de su `start` o pasarse
            // del techo, y las dos cosas descubren fondo de página.
            const eased = Math.min(1, Math.max(0, ease(p)));
            const seamY = seamDoc - scroll;
            // Todo el reloj —curva, relevo, techo, cierre— vive en `carveEdges`, que es el
            // MISMO que usa `/prototype/descent/paneles`. Acá solo se pinta el resultado.
            const edges = carveEdges({
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

            for (let ring = 0; ring < edges.length; ring++) {
              writeCarve(canvas, ring, edges[ring] - seamY);
            }

            if (!debug) return;
            // Las dos medidas que describen el defecto original. El HUD las lee de acá
            // porque el componente conoce las profundidades; medirlas con
            // `getBoundingClientRect` no sirve — el recorte no aparece en el rect.
            const outer = edges[0];
            const center = edges[edges.length - 1];
            scope.dataset.labProgress = String(p);
            scope.dataset.labStair = String(
              Math.round(Math.max(0, Math.min(viewportH, center) - Math.max(0, outer)))
            );
            scope.dataset.labFlat = String(Math.round(Math.max(0, viewportH - center)));
          };

          const st = ScrollTrigger.create({
            trigger: scope,
            start: "top top",
            // El recorrido termina cuando la MITAD de la escalera ha salido por el techo
            // del viewport. Pasado ese punto más de la mitad del relieve está fuera de
            // pantalla y seguir tallando es trabajo que nadie ve.
            //
            // Antes la referencia era el borde SUPERIOR de la figura, y con escaleras
            // profundas eso se vuelve demasiado corto: a depth 3 el borde sale a los
            // 246px de scroll, o sea todo el reveal metido en un cuarto de pantalla — lo
            // contrario de una entrada lenta. Con la mitad, el mismo depth da 648px.
            // `offsetHeight` y no el rect, para que el parallax de la copy no contamine
            // la medida. Función porque depende del ancho — `--u` es `100vw/7`.
            end: () =>
              `+=${Math.max(1, scope.offsetHeight - ((window.innerWidth / STAIR_COLUMNS) * depth) / 2)}`,
            scrub: true,
            invalidateOnRefresh: true,
            onRefresh: (self) => {
              measure(self.start);
              applyCarve(self.progress, self.scroll());
            },
            onUpdate: (self) => applyCarve(self.progress, self.scroll()),
          });
          // Un reload a mitad de página entra con `progress > 0` y sin ningún update
          // pendiente: sin esto el recorte se quedaría en el estado de reposo del CSS.
          measure(st.start);
          applyCarve(st.progress, st.scroll());

          cleanups.push(() => clearCarve(canvas));
        }

        // ── 1. Fundido superior ligado al scroll ────────────────────────────
        if (fade) {
          gsap.fromTo(
            fade,
            { opacity: 0 },
            {
              opacity: 1,
              ease: "none",
              immediateRender: true,
              scrollTrigger: {
                trigger: scope,
                start: "top top",
                end: "40% top",
                scrub: true,
                invalidateOnRefresh: true,
                markers: DEBUG_MARKERS,
              },
            }
          );
        }

        // ── 2. Parallax de la copy ──────────────────────────────────────────
        if (wrap) {
          gsap.fromTo(
            wrap,
            { y: -20 },
            {
              y: () => -20 - 0.2 * scope.getBoundingClientRect().height,
              ease: "none",
              immediateRender: false,
              scrollTrigger: {
                trigger: scope,
                start: "top top",
                end: "bottom top",
                scrub: true,
                invalidateOnRefresh: true,
              },
            }
          );
        }

        // ── 3. El vídeo, scrubbeado por scroll ──────────────────────────────
        if (video) {
          const scrub = createVideoScrub(video, {
            fps: FPS,
            chase: CHASE,
            chaseDocking: CHASE_DOCKING,
          });

          ScrollTrigger.create({
            trigger: scope,
            start: "top top",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => scrub.setProgress(self.progress * SCRUB_RATE),
          });

          cleanups.push(scrub.destroy);
        }

        // ── 4. Intro del titular ────────────────────────────────────────────
        // ⚠️ El gradiente del <h1> y SplitText no pueden convivir: el fondo y el clip
        // viven detrás de `data-intro="done"` y se encienden recién tras el revert.
        // El porqué completo está en HeroVideo.tsx.
        if (heading) {
          gsap.set(rest, { autoAlpha: 0, y: 16 });

          let split: SplitText | null = null;
          let cancelled = false;

          const run = () => {
            if (cancelled) return;
            split = SplitText.create(heading, { type: "words", mask: "words" });
            const words = split.words;
            const lead = words.slice(0, -1);
            const last = words.slice(-1);

            const tl = gsap.timeline();
            tl.from(lead, {
              yPercent: 110,
              autoAlpha: 0,
              stagger: 0.08,
              duration: 0.9,
              ease: "power3.out",
            }, 0);
            tl.from(last, {
              yPercent: 110,
              autoAlpha: 0,
              duration: 0.9,
              ease: "power3.out",
            }, 0.42);
            tl.to(rest, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.1 }, "-=0.45");
            tl.call(() => {
              split?.revert();
              heading.dataset.intro = "done";
            });
          };

          if (document.fonts?.ready) document.fonts.ready.then(run).catch(run);
          else run();

          cleanups.push(() => {
            cancelled = true;
            split?.revert();
            delete heading.dataset.intro;
          });
        }

        return () => cleanups.forEach((fn) => fn());
      });

      return () => mm.revert();
    },
    [drop, depth, carveEase, stagger, converge, line, debug]
  );

  return (
    <section
      ref={rootRef}
      // `data-lab-hero` para que el HUD lo encuentre por su primer selector y lea de
      // acá los números publicados.
      data-lab-hero
      style={{ "--u": HERO_UNIT, height: "100svh" } as React.CSSProperties}
      // Con recorte, `z-[3]`: el hero tapa a las barras (`z-[2]`) y su recorte es lo que
      // las descubre. `OwnYourOwn` está en `z-[1]` y nunca solapa el hero.
      //
      // Sin recorte, el apilado vuelve al de producción: las barras quedan por encima y
      // le pintan al hero por arriba, incluida la copy. Eso es lo correcto —y es
      // exactamente el defecto estructural del tallado: con el hero encima, la copy o se
      // corta con el recorte o se monta sobre el gris, y las dos están mal.
      //
      // El `bg-cream` vive en el lienzo y no acá: si estuviera acá, asomaría por el
      // recorte y taparía el gris que el recorte acaba de descubrir.
      className={
        carve
          ? "relative z-[3] flex flex-col text-foreground"
          : "relative flex flex-col text-foreground"
      }
    >
      {/* ── El lienzo ────────────────────────────────────────────────────────
          Todo lo que se recorta vive acá dentro: el fondo crema, el vídeo y los dos
          velos. La copy queda FUERA, como hermana, y por eso el recorte no puede
          cortarla nunca.

          `absolute inset-0` y no un `bottom` negativo: así el `100%` del polígono sigue
          siendo la juntura —el píxel donde termina el hero— y las alturas de los velos
          (`82%`, `60%`) siguen midiendo contra el hero, como en el original. El
          excedente del vídeo desborda esta caja, que no lleva `overflow-hidden`, y el
          polígono lo incluye porque sus vértices pueden pasar de `100%`. */}
      <div
        data-hero-canvas
        aria-hidden="true"
        style={
          // Sin recorte no hay `clip-path` en absoluto: el lienzo queda como un contenedor
          // normal. Nada de `clip-path: none`, que igual crearía un stacking context.
          (carve
            ? {
                // El polígono se escribe UNA vez y no cambia; por frame solo se reescriben
                // las 4 custom properties que lleva dentro.
                clipPath: carvePolygon(),
                ...carveRestVars(drop, depth),
              }
            : {}) as React.CSSProperties
        }
        className="pointer-events-none absolute inset-0 bg-cream"
      >
        <video
          data-hero-bg
          src="/prototype/v2/hero-descent.mp4"
          poster="/prototype/v2/hero-descent-poster.jpg"
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-0 w-full object-cover object-bottom"
          // El vídeo cuelga `drop · u` por debajo del hero: es la imagen que el recorte
          // va a ir retirando. Sin ese excedente, el recorte de la columna central
          // arrancaría por debajo del final de la imagen y descubriría el gris de una.
          //
          // Efecto colateral a mirar: con `object-cover object-bottom`, una caja más
          // alta obliga a escalar la imagen para cubrir. Medido con el asset real
          // (1728×972): a `drop = 0.5` la imagen se agranda un 12% y pierde eso de ancho.
          style={{ height: `calc(100% + var(--u) * ${drop})` }}
        />

        {/* Velo permanente: tapa con crema el 20% superior del vídeo y lo suelta hacia
            abajo, para que la imagen emerja del fondo en vez de estar pegada encima. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-[1] h-[82%] w-full"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, var(--cream) 0%, var(--cream) 20%, transparent 100%)",
          }}
        />

        {/* Segundo velo, ligado al scroll: cierra el hero contra el crema al salir. */}
        <div
          data-hero-topfade
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-[1] h-[60%] w-full"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, var(--cream) 0%, rgba(245,244,241,0.9) 30%, transparent 100%)",
          }}
        />

      </div>

      {/* Reserva el alto del nav, que es fixed y no ocupa flujo. */}
      <div aria-hidden="true" className="h-[5.5rem] shrink-0" />

      <Container
        data-hero-wrap
        className="relative z-[2] flex flex-1 flex-col items-center justify-center gap-6 py-14 text-center"
      >
        <h1
          data-hero="heading"
          className="text-display text-pretty data-[intro=done]:bg-clip-text data-[intro=done]:text-transparent data-[intro=done]:[background-image:linear-gradient(135deg,#000_0%,#000_55%,var(--ink-deep)_100%)]"
        >
          Own your
          <br />
          <Accent display>world.</Accent>
        </h1>

        <p data-hero="sub" className="max-w-xl text-body-lg text-muted-foreground text-pretty">
          Move cross-chain, trade perps, hold RWAs, stay confidential, and access
          all of DeFi from your own wallet.
        </p>
      </Container>
    </section>
  );
}
