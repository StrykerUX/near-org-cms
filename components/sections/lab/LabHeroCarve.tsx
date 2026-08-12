"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { gsap, ScrollTrigger, SplitText } from "@/components/primitives/motion/gsapClient";
import { createVideoScrub } from "@/components/primitives/motion/videoScrub";
import { MQ, DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { HERO_UNIT } from "@/components/sections/home-v2/heroGeometry";
import {
  STAIR_COLUMNS,
  carveDepths,
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
//   3. Un `clip-path` escalonado sobre la <section> —sobre la sección y no sobre el
//      vídeo, para que el `bg-cream` viaje con el recorte y no asome por los cantos—
//      cuya profundidad por columna se anima con el scroll.
//
// ── Por qué esto sí elimina la banda gris ────────────────────────────────────
// El borde inferior de la imagen no es una línea recta en ningún momento del
// recorrido. Arranca como una escalera INVERTIDA (más honda en el centro, porque la
// columna central es la que cuelga `drop·u`) y termina como la escalera definitiva
// (más honda en los extremos). El relieve entre la columna exterior y la central va de
// `drop·u` a `u·1.5` — nunca baja de 134px a 1877px de ancho.
//
// Y la zona de ancho completo, el "zócalo", no puede aparecer hasta que el recorte de
// la columna central suba hasta la juntura.
//
// Medido con node sobre un viewport de 1877×1050 (u = 268px), con los valores de acá
// abajo, contra lo que hace producción en el mismo punto:
//
//   scroll   escalera / zócalo        producción
//    25px      62 /   0   ∞×            0 /  25   ← barra pura
//    50px     121 /   0   ∞×            0 /  50   ← barra pura
//   110px     230 /  24   10×            0 / 110   ← el momento de la captura
//   150px     257 /  78    3×           38 / 150
//   200px     287 / 142    2×          101 / 200
//
// A 25px de scroll lo visible son 62px de gris en las DOS columnas exteriores y 9px en
// el par siguiente; a 50px son 121 / 61 / 0 / 0, con las tres centrales todavía tapadas.
// Eso es literalmente "que se vean los escalones laterales sin ver la sección gris".
//
// Pasados los ~400px la relación baja de 1× y no importa: a esa altura la escalera ya
// está completa y lo que se mira es el marco alrededor del statement, que debe ser un
// bloque sólido. La medida solo dice algo en la ventana del arranque.
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
// O sea: subir `drop` para pronunciar el escalonado reencuadra el hero, que es
// justamente lo que no queremos tocar. El relieve se pronuncia con la CURVA, que es
// gratis. `drop` se queda en el mínimo que hace falta para que el zócalo no exista en
// el arranque.
const DROP = 0.5;

// El tallado carga el grueso al principio: la escalera alcanza sus proporciones reales
// en los primeros píxeles de scroll y después se acomoda. Es lo contrario a la curva de
// retención que buscábamos para el hero —esa sigue en su sitio, este recorte es otra
// cosa— y es lo que decide qué tan PRONUNCIADO se ve el escalonado.
//
// Medido a 1877×1050 con `drop = 0.5`, salto entre el primer escalón y el segundo:
//
//   scroll   power2.out        power4.out
//    50px    53px  2 esc       61px  3 esc
//   110px    62px  4 esc  z3   77px  4 esc  z24
//   200px    75px  4 esc       96px  4 esc
//
// Y el relieve total (402px en la escalera final) llega al 50% a 75px de scroll con
// `power4.out`, contra 145px con `power2.out`.
//
// ⚠️ Solo eases SIN sobrepaso. Un `back.out` o un `elastic.out` devuelven valores > 1,
// y ahí el borde de la imagen subiría POR ENCIMA de donde empieza el gris de esa
// columna: reaparecería la franja crema que este approach hace imposible. El progreso
// se clampea a [0,1] justamente para que una perilla mal puesta no pueda romper eso.
const CARVE_EASE = "power4.out";

// Retardo del centro respecto a los extremos: el anillo `r` avanza con `e^(1 + lag*r)`.
//
// En 0 los cuatro anillos comparten el reloj, y eso mantiene la silueta intermedia
// RECTA — los cuatro escalones guardan la misma proporción 1 : 0.67 : 0.33 : 0 que la
// escalera final, solo más chica. Subirlo empuja el zócalo a cero (a 110px de scroll:
// 0px con lag 0.5 contra 24px con lag 0) y duplica el salto del primer escalón, pero
// CURVA el perfil: la escalera queda más empinada en los bordes que en el centro, o sea
// una figura distinta de la final. Se tantea con `?lag=`.
const CARVE_LAG = 0;

// ── Ajustes del scrub, idénticos al original ─────────────────────────────────
const SCRUB_RATE = 1;
const FPS = 24;
const CHASE = 0.14;
const CHASE_DOCKING = 0.09;

export default function LabHeroCarve({
  drop = DROP,
  carveEase = CARVE_EASE,
  lag = CARVE_LAG,
  debug = false,
}: {
  drop?: number;
  carveEase?: string;
  lag?: number;
  debug?: boolean;
}) {
  const rootRef = useGsapContext<HTMLElement>(
    (_self, scope) => {
      const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        const cleanups: (() => void)[] = [];

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
        {
          const depths = carveDepths(drop);
          // Un `?ease=` mal escrito no debe dejar el hero sin recorte —sería la reja
          // entera tapada y ningún reveal—, así que cae al valor por defecto.
          const parsed = gsap.parseEase(carveEase);
          const ease = typeof parsed === "function" ? parsed : gsap.parseEase(CARVE_EASE);
          // `--u` es `calc(100vw / 7)`, e `innerWidth` incluye la barra de scroll
          // igual que `100vw`: los dos miden lo mismo. Se cachea y se refresca en
          // `onRefresh` en vez de leerlo por frame.
          let unitPx = window.innerWidth / STAIR_COLUMNS;

          /** Profundidad del anillo `r` en px desde la juntura. Positiva = cuelga. */
          const depthAt = (ring: number, e: number) => {
            const { start, end } = depths[ring];
            // Con `lag > 0` el centro avanza más lento que los extremos, así que el
            // zócalo llega más tarde a cambio de curvar la silueta intermedia.
            const eRing = lag ? e ** (1 + lag * ring) : e;
            return (start + (end - start) * eRing) * unitPx;
          };

          const applyCarve = (p: number) => {
            // El clamp es lo que hace que ninguna perilla pueda romper la invariante:
            // con `e` dentro de [0,1] la profundidad se queda entre `start` y `end`, y
            // `end` es exactamente donde empieza el gris de esa columna.
            const e = Math.min(1, Math.max(0, ease(p)));
            for (let ring = 0; ring < depths.length; ring++) {
              writeCarve(scope, ring, depthAt(ring, e));
            }

            if (!debug) return;
            // Las dos medidas que describen el defecto que perseguimos. El HUD las
            // lee de acá porque el componente conoce las profundidades; medirlas con
            // `getBoundingClientRect` no sirve — el recorte no aparece en el rect.
            const seamY = scope.getBoundingClientRect().bottom;
            const vh = window.innerHeight;
            const outer = seamY + depthAt(0, e);
            const center = seamY + depthAt(depths.length - 1, e);
            scope.dataset.labProgress = String(p);
            scope.dataset.labStair = String(
              Math.round(Math.max(0, Math.min(vh, center) - Math.max(0, outer)))
            );
            scope.dataset.labFlat = String(Math.round(Math.max(0, vh - center)));
          };

          const st = ScrollTrigger.create({
            trigger: scope,
            start: "top top",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
            onRefresh: (self) => {
              unitPx = window.innerWidth / STAIR_COLUMNS;
              applyCarve(self.progress);
            },
            onUpdate: (self) => applyCarve(self.progress),
          });
          // Un reload a mitad de página entra con `progress > 0` y sin ningún update
          // pendiente: sin esto el recorte se quedaría en el estado de reposo del CSS.
          applyCarve(st.progress);

          cleanups.push(() => clearCarve(scope));
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
    [drop, carveEase, lag, debug]
  );

  return (
    <section
      ref={rootRef}
      // `data-lab-hero` para que el HUD lo encuentre por su primer selector y lea de
      // acá los números publicados.
      data-lab-hero
      style={
        {
          "--u": HERO_UNIT,
          height: "100svh",
          // El polígono se escribe UNA vez y no cambia; por frame solo se reescriben
          // las 4 custom properties que lleva dentro.
          clipPath: carvePolygon(),
          ...carveRestVars(drop),
        } as React.CSSProperties
      }
      // `z-[3]`: el hero tapa a QuantumBars, que sigue en `z-[2]`. `OwnYourOwn` está
      // en `z-[1]` y nunca solapa el hero, así que no hay conflicto.
      //
      // Sin `overflow-hidden`: el vídeo sobresale por abajo a propósito.
      className="relative z-[3] flex flex-col bg-cream text-foreground"
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
        // alta obliga a escalar la imagen para cubrir, así que el encuadre se acerca
        // un ~5% respecto al original.
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
